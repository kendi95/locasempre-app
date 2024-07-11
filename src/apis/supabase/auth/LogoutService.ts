import SecureStorage from 'rn-secure-storage'

import { EXPO_SECURE } from './jwtMiddleware'

export class LogoutService {

  async execute() {
    await SecureStorage.removeItem(EXPO_SECURE)
  }
}