import dayjs from 'dayjs'
 
import { supabase } from "@/database"

export class CancelOrderService {
  async execute(order_id: string) {
    try {
      const alreadyExists = await supabase.from('orders')
        .select('id')
        .eq('id', order_id)
        .limit(1)
        .single()
      
      if (!alreadyExists.data) {
        throw new Error('Não existe esse pedido.')
      }

      const { error } = await supabase.from('orders')
        .update({
          status: 'CANCELED',
          updatedAt: dayjs().toISOString()
        })
        .eq('id', order_id)

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      throw error
    }
  }
}