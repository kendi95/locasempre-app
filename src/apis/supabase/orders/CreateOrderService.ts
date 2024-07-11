import uuid from 'react-native-uuid'
import { CameraCapturedPicture } from 'expo-camera';
 
import { supabase } from "@/database"
import { UploadFileService } from '../files/UploadFileService';
import { CreateImageService } from '../images/CreateImageService';

type InputData = {
  customerId: string
  deliveryAddressId: string
  takenAt: Date
  collectedAt: Date
  totalAmountInCents: number
  files: CameraCapturedPicture[]
  items: {
    id: string
    name: string
    amount: number
  }[]
}

export class CreateOrderService {
  async execute(data: InputData) {
    try {
      const orderId = String(uuid.v4())

      if (data.files.length > 0) {
        const uploadFileService = new UploadFileService()
        const createImageService = new CreateImageService()

        data.files.forEach(async (file, index) => {
          const filename = `${new Date().getTime()}_${orderId}_${index + 1}.jpg`

          await uploadFileService.execute({ bucketName: 'orders', file, filename })

          const { id } = await createImageService.execute({ filename })

          await supabase.from('images_in_order').insert({
            id: String(uuid.v4()),
            imageId: id,
            orderId
          })
        })
      }

      const { error } = await supabase.from('orders').insert({
        id: orderId,
        collectedAt: data.collectedAt.toISOString(),
        takenAt: data.takenAt.toISOString(),
        customerId: data.customerId,
        deliveryAddressId: data.deliveryAddressId,
        totalAmountInCents: data.totalAmountInCents,
      })

      if (error) {
        throw new Error(error.message)
      }

      data.items.forEach(async (item) => {
        await supabase.from('items_in_order').insert({
          id: String(uuid.v4()),
          orderId,
          itemId: item.id
        })
      })
    } catch (error) {
      throw error
    }
  }
}