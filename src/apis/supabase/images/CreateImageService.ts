import uuid from 'react-native-uuid'
 
import { supabase } from "@/database"

type InputData = {
  filename: string
}

export class CreateImageService {
  async execute(data: InputData) {
    try {
      const { error, data: dataResponse } = await supabase.from('images').insert({
        id: String(uuid.v4()),
        filename: data.filename
      }).select('id').single()

      if (error) {
        throw new Error(error.message)
      }

      return dataResponse
    } catch (error) {
      throw error
    }
  }
}