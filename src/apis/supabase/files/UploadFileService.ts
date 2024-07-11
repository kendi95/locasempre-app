import { CameraCapturedPicture } from "expo-camera"

import { supabase } from "@/database"

type InputData = {
  file: CameraCapturedPicture
  filename: string
  bucketName: 'items' | 'avatars' | 'orders'
}

export class UploadFileService {
  async execute({ bucketName, file, filename }: InputData) {
    try {
      const res = await fetch(file?.uri!)
      const blob = await res.blob()
      const buffer = await new Response(blob).arrayBuffer()

      const signedURL = await supabase.storage.from(bucketName)
        .createSignedUploadUrl(`public/${filename}`)

      const { error, data } = await supabase.storage.from(bucketName)
        .uploadToSignedUrl(`public/${filename}`, signedURL.data?.token!, buffer)

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      throw error
    }
  }
}