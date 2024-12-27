import { supabase } from "@/database"

type InputData = {
  address_id: string
}

export class GetDeliveredAddressService {
  async execute({ address_id }: InputData) {
    try {
      const { data } = await supabase.from('delivered_addresses')
        .select('*')
        .eq('id', address_id)
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