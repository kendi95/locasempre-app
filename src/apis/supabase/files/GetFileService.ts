import { supabase } from "@/database"

type InputData = {
  filename: string
  bucketName: 'items' | 'avatars' | 'orders'
}

export class GetFileService {
  async execute({ bucketName, filename }: InputData) {
    try {
      const { data, error } = await supabase.storage.from(bucketName)
      .createSignedUrl(`public/${filename}`, 60)

      if (error) {
        throw new Error(error.message)
      }

      return {
        imageURL: data.signedUrl
      }
    } catch (error) {
      throw error
    }
  }
}