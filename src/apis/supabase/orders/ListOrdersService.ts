import { supabase } from "@/database"

type FilterStatus = 'ALL' | 'PENDING' | 'PAID' | 'CANCELED'

type InputData = {
  search?: string
  limit?: number
  page?: number
  filter?: {
    status: FilterStatus
    isCollected?: boolean
  }
}

export class ListOrdersService {
  async execute({ search, limit = 100, page = 1, filter }: InputData) {
    try {
      let startOffset = (page - 1) * limit
      let endOffset = startOffset + (limit - 1) 

      if (search) {
        const orders = await supabase.from('orders')
          .select('*, customers (id, name)')
          .like('customers.name', `%${search}%`)
          .limit(limit)
          .order('createdAt', { ascending: true })

        page = page + 1
        startOffset = (page - 1) * limit
        endOffset = startOffset + (limit - 1) 

        const { count } = await supabase.from('orders')
          .select('id', { count: 'exact', head: true })
          .limit(limit)
          .range(startOffset, endOffset)

        page = page - 1

        return {
          previous: page > 1,
          data: orders.data,
          next: count && count > 0 ? true : false
        }
      }

      if (filter?.status === 'ALL') {
        const orders = await supabase.from('orders')
          .select('*, customers (id, name)')
          .eq('isCollected', filter.isCollected!)
          .limit(limit)
          .range(startOffset, endOffset)
          .order('createdAt', { ascending: true })

        page = page + 1
        startOffset = (page - 1) * limit
        endOffset = startOffset + (limit - 1) 

        const { count } = await supabase.from('orders')
          .select('id', { count: 'exact', head: true })
          .limit(limit)
          .range(startOffset, endOffset)

        page = page - 1

        return {
          previous: page > 1,
          data: orders.data,
          next: count && count > 0 ? true : false
        }
      }

      const orders = await supabase.from('orders')
        .select('*, customers (id, name)')
        .eq('status', filter?.status!)
        .eq('isCollected', filter?.isCollected!)
        .limit(limit)
        .range(startOffset, endOffset)
        .order('createdAt', { ascending: true })

      page = page + 1
      startOffset = (page - 1) * limit
      endOffset = startOffset + (limit - 1) 

      const { count } = await supabase.from('orders')
        .select('id', { count: 'exact', head: true })
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