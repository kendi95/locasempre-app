import dayjs from 'dayjs'
 
import { supabase } from "@/database"

type InputData = {
  customerId: string
}

export class UpdateDefaultAddressDeliveredAddressService {
  async execute(deliveredAddressId: string, { customerId }: InputData) {
    try {
      const addressExists = await supabase.from('delivered_addresses')
        .select('id')
        .eq('id', deliveredAddressId)
        .limit(1)
        .single()
      
      if (!addressExists.data) {
        throw new Error('Não este existe endereço de entrega.')
      }

      const { error: errorAddress } = await supabase.from('delivered_addresses')
        .update({
          isDefaultAddress: false,
          updatedAt: dayjs().toISOString()
        }).eq('customersId', customerId)

      if (errorAddress) {
        throw new Error(errorAddress.message)
      }

      const { error } = await supabase.from('delivered_addresses')
        .update({
          isDefaultAddress: true,
          updatedAt: dayjs().toISOString()
        })
        .eq('id', deliveredAddressId)

      if (error) {
        throw new Error(error.message)
      }

    } catch (error) {
      throw error
    }
  }
}