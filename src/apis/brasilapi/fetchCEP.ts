import cep from 'cep-promise'

import { AppError } from '@/errors/AppError'

type FetchResponse = {
  zip_code: string
  city: string
  state: string
  neighborhood: string
  street: string
}

export async function fetchCEP(zip_code: string): Promise<FetchResponse> {
  try {
    const response = await cep(zip_code, { providers: ['brasilapi'] })

    return {
      zip_code: response.cep,
      city: response.city,
      state: response.state,
      neighborhood: response.neighborhood,
      street: response.street
    }
  } catch (error) {
    throw new AppError('CEP inválido ou CEP não existe.')
  }
  
}