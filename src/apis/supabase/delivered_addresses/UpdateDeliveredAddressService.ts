import dayjs from "dayjs"

import { supabase } from "@/database"

type InputData = {
  zipcode: string
  address: string
  numberAddress: number
  neighborhood: string
  complement?: string
  city: string
  provincy: string
}

export class UpdateDeliveredAddressService {
  async execute(address_id: string, data: InputData) {
    try {
      const { data: dataAddress } = await supabase.from('delivered_addresses')
        .select('id')
        .eq('id', address_id)
        .single()

      if (!dataAddress) {
        throw new Error('Não existe esse endereço de entrega.')
      }

      const { error: errorAddress } = await supabase.from('delivered_addresses')
        .update({
          ...data,
          updatedAt: dayjs().toISOString()
        }).eq('id', address_id)

      if (errorAddress) {
        throw new Error(errorAddress.message)
      }

      return
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