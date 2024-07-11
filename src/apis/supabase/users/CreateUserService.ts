import bcrypt from 'bcrypt-react-native'
import uuid from 'react-native-uuid'
 
import { supabase } from "@/database"
import { Role } from "@prisma/client"
import { SendEmailService } from '@/apis/emailjs/SendEmailService'

type InputData = {
  name: string
  email: string
  password: string
  role: Role
}

export class CreateUserService {
  async execute(data: InputData) {
    try {
      const emailAlreadyExists = await supabase.from('users')
        .select('id')
        .eq('email', data.email)
        .limit(1)
        .single()
      
      if (emailAlreadyExists.data) {
        throw new Error('Existe usuário com esse email.')
      }

      const salt = await bcrypt.getSalt(8)
      const passwordHashed = await bcrypt.hash(salt, data.password)

      const { error } = await supabase.from('users').insert({
        ...data,
        id: String(uuid.v4()),
        password: passwordHashed,
        isActive: true,
      })

      if (error) {
        throw new Error(error.message)
      }

      const sendEmailService = new SendEmailService()
      
      await sendEmailService.execute({
        service_id: 'service_gmail',
        template_id: 'template_resetpass',
        to_email: data.email,
        to_name: data.name,
        message: `Seu cadastro foi realizado, sua senha de acesso a plataforma é: ${data.password}`
      })
    } catch (error) {
      throw error
    }
  }
}