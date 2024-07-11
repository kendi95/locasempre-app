import dayjs from 'dayjs'
import bcrypt from 'bcrypt-react-native'
 
import { supabase } from "@/database"

type InputData = {
  name?: string
  email?: string
  oldPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export class UpdateProfileService {
  async execute(user_id: string, data: InputData) {
    try {
      const emailAlreadyExists = await supabase.from('users')
        .select('*')
        .eq('id', user_id)
        .neq('email', data.email)
        .limit(1)
        .single();
      
      if (emailAlreadyExists.data?.id) {
        throw new Error('Existe usuário com esse email.')
      }

      if (data.oldPassword && data.newPassword && data.confirmPassword) {
        const isCompare = await bcrypt.compareSync(
          data.oldPassword, 
          emailAlreadyExists.data?.password!
        )

        if (!isCompare) {
          throw new Error('A senha antiga não confere.')
        }

        const salt = await bcrypt.getSalt(8)
        const passwordHashed = await bcrypt.hash(salt, data.newPassword)

        const { error } = await supabase.from('users')
          .update({
            password: passwordHashed,
            updatedAt: dayjs().toISOString()
          })
          .eq('id', user_id)

        if (error) {
          throw new Error(error.message)
        }

        return
      }

      const { error } = await supabase.from('users')
        .update({
          name: data.name,
          email: data.email,
          updatedAt: dayjs().toISOString()
        })
        .eq('id', user_id)

      if (error) {
        throw new Error(error.message)
      }

      return
    } catch (error) {
      throw error
    }
  }
}