import { supabase } from "@/database"

type InputData = {
  search?: string
  limit?: number
  page?: number
}

export class ListCustomersService {
  async execute({ search, limit = 100, page = 1 }: InputData) {
    try {
      let startOffset = (page - 1) * limit
      let endOffset = startOffset + (limit - 1) 

      if (search) {
        const customers = await supabase.from('customers')
          .select('name, phone, id, images (id, filename)')
          .like('name', `%${search}%`)
          .limit(limit)
          .order('createdAt', { ascending: true })

        page = page + 1
        startOffset = (page - 1) * limit
        endOffset = startOffset + (limit - 1) 

        const { count } = await supabase.from('customers')
          .select('id', { count: 'exact', head: true })
          .limit(limit)
          .range(startOffset, endOffset)

        page = page - 1

        return {
          previous: page > 1,
          data: customers.data,
          next: count && count > 0 ? true : false
        }
      }

      const customers = await supabase.from('customers')
        .select('name, phone, id, images (id, filename)')
        .limit(limit)
        .range(startOffset, endOffset)
        .order('createdAt', { ascending: true })

      page = page + 1
      startOffset = (page - 1) * limit
      endOffset = startOffset + (limit - 1) 

      const { count } = await supabase.from('customers')
        .select('id', { count: 'exact', head: true })
        .limit(limit)
        .range(startOffset, endOffset)

      page = page - 1

      return {
        previous: page > 1,
        data: customers.data,
        next: count && count > 0 ? true : false
      }
    } catch (error) {
      throw error
    }
  }
}