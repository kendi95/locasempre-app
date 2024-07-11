import { supabase } from "@/database"

type InputData = {
  item_id: string
}

export class GetItemService {
  async execute({ item_id }: InputData) {
    try {
      const { data } = await supabase.from('items')
        .select('*, images (id, filename)')
        .eq('id', item_id)
        .single()

      return data
    } catch (error) {
      throw error
    }
  }
}