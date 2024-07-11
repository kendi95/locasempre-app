import uuid from 'react-native-uuid'
 
import { supabase } from "@/database"

type InputData = {
  zipcode: string
  address: string
  numberAddress: number
  neighborhood: string
  complement?: string
  city: string
  provincy: string
  customersId: string
}

export class CreateDeliveredAddressService {
  async execute(data: InputData) {
    try {
      const addressId = String(uuid.v4())

      const { error } = await supabase.from('delivered_addresses')
        .insert({
          id: addressId,
          ...data,
          complement: '',
        })

      if (error) {
        throw new Error(error.message)
      }

      return
    } catch (error) {
      throw error
    }
  }
}