import { Role } from "@prisma/client"

import { supabase } from "@/database"

type InputData = {
  customer_id: string
  limit?: number
  page?: number
}

export class GetOrdersByCustomerService {
  async execute({ limit = 20, page = 1, customer_id }: InputData) {
    try {
      let startOffset = (page - 1) * limit
      let endOffset = startOffset + (limit - 1) 

      const orders = await supabase.from('orders')
        .select('id, status, totalAmountInCents, isCollected')
        .eq('customerId', customer_id)
        .limit(limit)
        .range(startOffset, endOffset)
        .order('createdAt', { ascending: true })

      page = page + 1
      startOffset = (page - 1) * limit
      endOffset = startOffset + (limit - 1) 

      const { count } = await supabase.from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('customerId', customer_id)
        .limit(limit)
        .range(startOffset, endOffset)

      page = page - 1

      return {
        previous: page > 1,
        data: orders.data,
        next: count && count > 0 ? true : false
      }
    } catch (error) {
      throw error
    }
  }
}