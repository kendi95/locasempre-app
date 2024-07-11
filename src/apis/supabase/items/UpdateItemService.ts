import dayjs from 'dayjs'
import { CameraCapturedPicture } from 'expo-camera'
 
import { supabase } from "@/database"

import { UploadFileService } from '../files/UploadFileService'
import { CreateImageService } from '../images/CreateImageService'
import { GetImageService } from '../images/GetImageService'
import { MoveFileToTemporaryService } from '../files/MoveFileToTemporaryService'
import { UpdateImageService } from '../images/UpdateImageService'

type InputData = {
  name: string
  amountInCents: number
  isActive: boolean
  file?: CameraCapturedPicture
}

export class UpdateItemService {
  async execute(item_id: string, data: InputData) {
    try {
      const itemExists = await supabase.from('items')
        .select('id, imageId')
        .eq('id', item_id)
        .limit(1)
        .single()
      
      if (!itemExists.data) {
        throw new Error('Não existe item.')
      }

      if (data.file) {
        if (itemExists.data.imageId) {
          const getImageService = new GetImageService()
          const image = await getImageService.execute({ image_id: itemExists.data.imageId })

          const moveTempService = new MoveFileToTemporaryService()
          await moveTempService.execute({ bucketName: 'items', filename: image?.filename! })
        }

        const uploadFileService = new UploadFileService()

        const filename = `${new Date().getTime()}_${item_id}.jpg`

        await uploadFileService.execute({
          bucketName: 'items',
          file: data.file,
          filename
        })

        delete data.file

        if (itemExists.data.imageId) {
          const updateImageService = new UpdateImageService()
          await updateImageService.execute(itemExists.data.imageId, { filename })

          const { error } = await supabase.from('items')
            .update({
              ...data,
              updatedAt: dayjs().toISOString()
            })
            .eq('id', item_id)

          if (error) {
            throw new Error(error.message)
          }

        } else {
          const imageService = new CreateImageService()
          const { id } = await imageService.execute({ filename })

          const { error } = await supabase.from('items')
            .update({
              ...data,
              imageId: id,
              updatedAt: dayjs().toISOString()
            })
            .eq('id', item_id)

          if (error) {
            throw new Error(error.message)
          }
        }

        return
      }

      delete data.file

      const { error } = await supabase.from('items')
        .update({
          ...data,
          updatedAt: dayjs().toISOString()
        })
        .eq('id', item_id)

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      throw error
    }
  }
}