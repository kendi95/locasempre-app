import { supabase } from "@/database"

type InputData = {
  search?: string
  limit?: number
  page?: number
}

export class ListUsersService {
  async execute({ search, limit = 20, page = 1 }: InputData) {
    try {
      let startOffset = (page - 1) * limit
      let endOffset = startOffset + (limit - 1) 

      if (search) {
        const users = await supabase.from('users')
          .select('name, email, role, id')
          .like('name', `%${search}%`)
          .limit(limit)
          .order('createdAt', { ascending: true })

        page = page + 1
        startOffset = (page - 1) * limit
        endOffset = startOffset + (limit - 1) 
  
        const { count } = await supabase.from('users')
          .select('id', { count: 'exact', head: true })
          .limit(limit)
          .range(startOffset, endOffset)
  
        page = page - 1
  
        return {
          previous: page > 1,
          data: users.data,
          next: count && count > 0 ? true : false
        }
      }

      const users = await supabase.from('users')
        .select('name, email, role, id')
        .limit(limit)
        .range(startOffset, endOffset)
        .order('createdAt', { ascending: true })

      page = page + 1
      startOffset = (page - 1) * limit
      endOffset = startOffset + (limit - 1) 

      const { count } = await supabase.from('users')
        .select('id', { count: 'exact', head: true })
        .limit(limit)
        .range(startOffset, endOffset)

      page = page - 1

      return {
        previous: page > 1,
        data: users.data,
        next: count && count > 0 ? true : false
      }
    } catch (error) {
      throw error
    }
  }
}