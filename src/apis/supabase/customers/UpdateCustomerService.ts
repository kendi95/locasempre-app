import dayjs from 'dayjs'
 
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

export class UpdateCustomerService {
  async execute(customer_id: string, data: InputData) {
    try {
      const emailAlreadyExists = await supabase.from('customers')
        .select('id')
        .eq('id', customer_id)
        .neq('cpf', data.cpf)
        .limit(1)
        .single()
      
      if (emailAlreadyExists.data?.id) {
        throw new Error('Existe cliente com esse CPF.')
      }

      const { error, data: dataAddress } = await supabase.from('customers')
        .update({
          name: data.name,
          cpf: data.cpf,
          phone: data.phone,
          updatedAt: dayjs().toISOString()
        }).eq('id', customer_id).select('addressId').single()

      if (error) {
        throw new Error(error.message)
      }

      const { error: errorAddress } = await supabase.from('addresses')
        .update({
          ...data.address,
          complement: data.address.complement || '',
          updatedAt: dayjs().toISOString()
        }).eq('id', dataAddress.addressId)

      if (errorAddress) {
        throw new Error(errorAddress.message)
      }
      
    } catch (error) {
      throw error
    }
  }
}