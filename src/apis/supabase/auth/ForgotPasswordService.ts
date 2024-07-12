import dayjs from 'dayjs'
import uuid from 'react-native-uuid'

import { supabase } from "@/database"
import { SendEmailService } from "@/apis/emailjs/SendEmailService"


type InputData = {
  email: string
}

export class ForgotPasswordService {
  async execute(data: InputData) {
    try {
      const user = await supabase.from('users')
        .select('id, name, email')
        .eq('email', data.email)
        .single()

      if (!user) {
        throw new Error('Não existe uma conta com esse email.')
      }

      const resetAccount = await supabase.from('reset_user_account')
        .select('id, isValid')
        .eq('isValid', true)
        .single()

      if (resetAccount.data) {
        if (resetAccount.data.isValid) {
          await supabase.from('reset_user_account')
            .update({
              isValid: false,
            }).eq('id', resetAccount.data.id)
        }
      }

      const resetUserAccountId = String(uuid.v4())

      await supabase.from('reset_user_account')
        .insert({
          id: resetUserAccountId,
          userId: user.data?.id!,
          expiredAt: dayjs().add(1, 'day').toISOString(),
        })

      const sendEmailService = new SendEmailService()
      await sendEmailService.execute({
        to_name: user.data?.name!,
        to_email: user.data?.email!,
        message: resetUserAccountId,
        service_id: 'service_gmail',
        template_id: 'template_resetpass'
      })
    } catch (error) {
      throw error
    }
    
  }
}