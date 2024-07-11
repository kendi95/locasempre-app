import { supabase } from "@/database"

type InputData = {
  search?: string
  limit?: number
  page?: number
}

export class ListItemsService {
  async execute({ search, limit = 20, page = 1 }: InputData) {
    try {
      let startOffset = (page - 1) * limit
      let endOffset = startOffset + (limit - 1) 

      if (search) {
        const items = await supabase.from('items')
          .select('name, amountInCents, id, images (id, filename)')
          .like('name', `%${search}%`)
          .limit(limit)
          .order('createdAt', { ascending: true })

        page = page + 1
        startOffset = (page - 1) * limit
        endOffset = startOffset + (limit - 1) 

        const { count } = await supabase.from('items')
          .select('id', { count: 'exact', head: true })
          .limit(limit)
          .range(startOffset, endOffset)

        page = page - 1

        return {
          previous: page > 1,
          data: items.data,
          next: count && count > 0 ? true : false
        }
      }

      const items = await supabase.from('items')
        .select('name, amountInCents, id, images (id, filename)')
        .limit(limit)
        .range(startOffset, endOffset)
        .order('createdAt', { ascending: true })

      page = page + 1
      startOffset = (page - 1) * limit
      endOffset = startOffset + (limit - 1) 

      const { count } = await supabase.from('items')
        .select('id', { count: 'exact', head: true })
        .limit(limit)
        .range(startOffset, endOffset)

      page = page - 1

      return {
        previous: page > 1,
        data: items.data,
        next: count && count > 0 ? true : false
      }
    } catch (error) {
      throw error
    }
  }
}