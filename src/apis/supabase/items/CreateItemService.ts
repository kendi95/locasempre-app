import uuid from 'react-native-uuid'
import { CameraCapturedPicture } from 'expo-camera'
 
import { supabase } from "@/database"

import { UploadFileService } from '../files/UploadFileService'
import { CreateImageService } from '../images/CreateImageService'

type InputData = {
  name: string
  amountInCents: number
  file?: CameraCapturedPicture
}

export class CreateItemService {
  async execute(data: InputData) {
    try {
      const item_id = String(uuid.v4())
      let imageId = null

      if (data.file) {
        const uploadFileService = new UploadFileService()
        const imageService = new CreateImageService()

        const filename = `${new Date().getTime()}_${item_id}.jpg`

        await uploadFileService.execute({
          bucketName: 'items',
          file: data.file,
          filename
        })

        const { id } = await imageService.execute({ filename })
        imageId = id
      }

      delete data.file

      const { error } = await supabase.from('items').insert({
        id: item_id,
        imageId,
        ...data,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      throw error
    }
  }
}