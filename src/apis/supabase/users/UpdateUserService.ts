import dayjs from 'dayjs'
 
import { supabase } from "@/database"
import { Role } from "@prisma/client"

type InputData = {
  name: string
  email: string
  role: Role
}

export class UpdateUserService {
  async execute(user_id: string, data: InputData) {
    try {
      const emailAlreadyExists = await supabase.from('users')
        .select('id')
        .eq('id', user_id)
        .neq('email', data.email)
        .limit(1)
        .single()
      
      if (emailAlreadyExists.data) {
        throw new Error('Existe usuário com esse email.')
      }

      const { error } = await supabase.from('users')
        .update({
          ...data,
          updatedAt: dayjs().toISOString()
        })
        .eq('id', user_id)

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      throw error
    }
  }
}