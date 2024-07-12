import { decode } from 'react-native-pure-jwt'
import SecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

import { env } from '@/env'
import { Role } from '@prisma/client'

type Payload = {
  expiration: number
  user_id: string
  role: Role
}

type ReturnData = {
  user_id?: string
  role?: Role
  status: boolean
}

export const EXPO_SECURE = "SECURE_TOKEN"

export async function jwtMiddleware(token?: string): Promise<ReturnData> {
  try {
    // if (token) {
    //   const { payload } = await decode(token, String(env?.EXPO_PUBLIC_SECRET_KEY))
    //   const { expiration, user_id } = payload as Payload
    
    //   if (expiration > new Date().getTime()) {
    //     await SecureStorage.setItem(EXPO_SECURE, token, { accessible: ACCESSIBLE.ALWAYS })
    
    //     return { user_id, status: true }
    //   }
    
    //   await SecureStorage.removeItem(EXPO_SECURE)
    
    //   return { status: false }
    // }

    // const isExists = await SecureStorage.exist(EXPO_SECURE)
  
    // if (!isExists) {
    //   await SecureStorage.setItem(EXPO_SECURE, '', { accessible: ACCESSIBLE.ALWAYS })
    // }
  
    // const securedToken = await SecureStorage.getItem(EXPO_SECURE)
  
    // if (securedToken) {
    //   const { payload } = await decode(securedToken, String(env?.EXPO_PUBLIC_SECRET_KEY))
    //   const { expiration, user_id, role } = payload as Payload
    
    //   if (expiration > new Date().getTime()) {
    //     return { user_id, role, status: true }
    //   }
  
    //   await SecureStorage.removeItem(EXPO_SECURE)
  
    //   return { status: false }
    // }
  
    return { status: false }
  } catch (error) {
    return { status: false }
  }

}