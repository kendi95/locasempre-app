import dayjs from 'dayjs'
import bcrypt from 'bcrypt-react-native'

import { supabase } from "@/database"

type InputData = {
  token: string
  newPassword: string
  confirmPassword: string
}

export class ResetPasswordService {
  async execute(data: InputData) {
    try {
      const resetAccount = await supabase.from('reset_user_account')
        .select('id, isValid, expiredAt, userId')
        .eq('id', data.token)
        .single()

      if (!resetAccount.data) {
        throw new Error('Código não confere.')
      }

      if (dayjs().isAfter(dayjs(resetAccount.data.expiredAt))){
        throw new Error('Código expirado.')
      }

      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Senha não conferem.')
      }

      const salt = await bcrypt.getSalt(8)
      const passwordHashed = await bcrypt.hash(salt, data.newPassword)

      await supabase.from('users')
        .update({
          password: passwordHashed,
          updatedAt: dayjs().toISOString()
        }).eq('id', resetAccount.data.userId)

      
      await supabase.from('reset_user_account')
        .update({
          isValid: false,
          isReseted: true,
          updatedAt: dayjs().toISOString()
        }).eq('id', resetAccount.data.id)

      return
    } catch (error) {
      throw error
    }
    
  }
}