import axios from 'axios'

import { env } from '@/env'
import { AppError } from '@/errors/AppError'

type InputData = {
  service_id: 'service_gmail'
  template_id: 'template_resetpass'
  to_name: string
  to_email: string
  message?: string
  link?: string
  html?: string
}

export class SendEmailService {
  async execute(data: InputData) {
    try {
      const response = await axios.post(env?.EXPO_PUBLIC_EMAILJS_URL!, {
        lib_version: '4.3.3',
        user_id: env?.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY!,
        service_id: 'service_gmail',
        template_id: 'template_resetpass',
        template_params: {
          ...data
        },
      })

      if (response.status !== 200) {
        throw new AppError('Erro ao enviar o email.')
      }

      return;
    } catch (error) {
      throw error
    }
  }
}