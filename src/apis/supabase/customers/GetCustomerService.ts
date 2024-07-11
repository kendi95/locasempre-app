import { supabase } from "@/database"

type InputData = {
  customer_id: string
}

export class GetCustomerService {
  async execute({ customer_id }: InputData) {
    try {
      const { data } = await supabase.from('customers')
        .select('*, addresses (id, address, numberAddress, zipcode, neighborhood, complement, city, provincy)')
        .eq('id', customer_id)
        .single()

      return data
    } catch (error) {
      throw error
    }
  }
}