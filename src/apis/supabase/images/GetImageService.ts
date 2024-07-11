import { supabase } from "@/database"

type InputData = {
  image_id: string
}

export class GetImageService {
  async execute({ image_id }: InputData) {
    try {
      const { data } = await supabase.from('images')
        .select('*')
        .eq('id', image_id)
        .single()

      return data
    } catch (error) {
      throw error
    }
  }
}