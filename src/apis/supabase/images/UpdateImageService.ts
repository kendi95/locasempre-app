import dayjs from 'dayjs'
 
import { supabase } from "@/database"

type InputData = {
  filename: string
}

export class UpdateImageService {
  async execute(image_id: string, data: InputData) {
    try {
      const alreadyExists = await supabase.from('images')
        .select('id')
        .eq('id', image_id)
        .limit(1)
        .single()
      
      if (!alreadyExists.data) {
        throw new Error('Não existe imagem salva.')
      }

      const { error } = await supabase.from('images')
        .update({
          ...data,
          updatedAt: dayjs().toISOString()
        }).eq('id', image_id)

      if (error) {
        throw new Error(error.message)
      }

    } catch (error) {
      throw error
    }
  }
}