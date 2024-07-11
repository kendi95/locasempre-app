import { supabase } from "@/database"

type InputData = {
  order_id: string
}

export class GetOrderService {
  async execute({ order_id }: InputData) {
    try {
      const { data } = await supabase.from('orders')
        .select(`
          *, 
          customers (id, name), 
          delivered_addresses (id, address, numberAddress, zipcode, neighborhood, complement, city, provincy, isDefaultAddress),
          items_in_order (items (id, name, amountInCents)),
          images_in_order (images (id, filename))
        `)
        .eq('id', order_id)
        .single()

      return data
    } catch (error) {
      throw error
    }
  }
}