import SecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

import { EXPO_SECURE } from './jwtMiddleware'

export class LogoutService {

  async execute() {
    const isExists = await SecureStorage.exist(EXPO_SECURE)
  
    if (!isExists) {
      await SecureStorage.setItem(EXPO_SECURE, '', { accessible: ACCESSIBLE.ALWAYS })
    }

    await SecureStorage.removeItem(EXPO_SECURE)
  }
}