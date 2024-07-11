import dayjs from 'dayjs'

import { supabase } from "@/database"

type InputData = {
  token: string
}

export class ValidationResetTokenService {
  async execute(data: InputData) {
    try {
      const resetAccount = await supabase.from('reset_user_account')
        .select('id, isValid, expiredAt')
        .eq('id', data.token)
        .single()

      if (!resetAccount.data) {
        throw new Error('Código não confere.')
      }

      if (!resetAccount.data.isValid) {
        throw new Error('Código não é mais válido.')
      }

      if (dayjs().isAfter(dayjs(resetAccount.data.expiredAt))){
        throw new Error('Código expirado.')
      }

      return
    } catch (error) {
      throw error
    }
    
  }
}