import { supabase } from "@/database"

type InputData = {
  customer_id: string
}

export class GetDeliveredAddressByCustomerService {
  async execute({ customer_id }: InputData) {
    try {
      const { data } = await supabase.from('delivered_addresses')
        .select('*')
        .eq('customersId', customer_id)
        .single()

      return data
    } catch (error) {
      throw error
    }
  }
}

export type DeliveredAddresses = {
  address: string;
  city: string;
  complement: string;
  id: string;
  neighborhood: string;
  numberAddress: number;
  provincy: string;
  zipcode: string;
  isDefaultAddress: boolean;
}