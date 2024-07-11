import uuid from 'react-native-uuid'
 
import { supabase } from "@/database"

type InputData = {
  name: string
  phone: string
  cpf: string
  address: {
    zipcode: string
    address: string
    numberAddress: number
    neighborhood: string
    complement?: string
    city: string
    provincy: string
  }
}

export class CreateCustomerService {
  async execute(data: InputData) {
    try {
      const cpfAlreadyExists = await supabase.from('customers')
        .select('id')
        .eq('cpf', data.cpf)
        .limit(1)
        .single()
      
      if (cpfAlreadyExists.data) {
        throw new Error('Existe cliente com esse CPF.')
      }

      const addressId = String(uuid.v4())

      const { error: erroraddress } = await supabase.from('addresses').insert({
        id: addressId,
        ...data.address,
        complement: ''
      })

      if (erroraddress) {
        throw new Error(erroraddress.message)
      }

      const { error } = await supabase.from('customers').insert({
        id: String(uuid.v4()),
        addressId,
        name: data.name,
        cpf: data.cpf,
        phone: data.phone,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      throw error
    }
  }
}