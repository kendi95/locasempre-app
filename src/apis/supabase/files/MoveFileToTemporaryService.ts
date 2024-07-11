import { supabase } from "@/database"

type InputData = {
  filename: string
  bucketName: 'items' | 'avatars' | 'orders'
}

export class MoveFileToTemporaryService {
  async execute({ bucketName, filename }: InputData) {
    try {
      const { error } = await supabase.storage.from(bucketName).copy(
        `public/${filename}`,
        `temporary/${filename}`
      )

      if (error) {
        throw new Error(error.message)
      }

      const { error: errorRemove } = await supabase.storage.from(bucketName).remove([`public/${filename}`])

      if (errorRemove) {
        throw new Error(errorRemove.message)
      }

    } catch (error) {
      throw error
    }
  }
}