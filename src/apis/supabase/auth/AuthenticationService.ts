import bcrypt from 'bcrypt-react-native'
import { sign } from 'react-native-pure-jwt'
import SecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

import { Role } from '@prisma/client'
import { supabase } from "@/database"
import { AppError } from '@/errors/AppError'
import { EXPO_SECURE } from './jwtMiddleware'

type InputData = {
  email: string
  password: string
}

type ReturnData = {
  user: {
    id: string
    name: string
    role: Role
    isActive: boolean
  }
}

const minut = 1000 * 60 // 60 secounds or 1 minut
const hour = (minut * 60) // 1 hour
const day = (hour * 24) // 1 day

export class AuthenticationService {
  async execute(data: InputData): Promise<ReturnData> {
    const findedEmail = await supabase.from('users')
      .select('id, isActive, role, password, name')
      .eq('email', data.email)
      .limit(1)
      .single()

    if (!findedEmail.data) {
      throw new AppError('E-mail ou senha incorreta.')
    }

    const isCompare = await bcrypt.compareSync(data.password, findedEmail.data.password)

    if (!isCompare) {
      throw new AppError('E-mail ou senha incorreta.')
    }

    if (!findedEmail.data.isActive) {
      throw new AppError('Conta do usuário está desativado.')
    }

    const token = await sign(
      { 
        user_id: findedEmail.data.id,
        role: findedEmail.data.role,
        expiration: new Date().getTime() + (minut * 5) // 5 minuts
      }, 
      String(process.env.EXPO_PUBLIC_SECRET_KEY!), 
      { alg: 'HS256' }
    )

    await SecureStorage.setItem(EXPO_SECURE, token, { accessible: ACCESSIBLE.ALWAYS })

    return {
      user: {
        ...findedEmail.data
      }
    }
  }
}