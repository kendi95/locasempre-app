import dayjs from 'dayjs'
 
import { supabase } from "@/database"

export class CollectOrderService {
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
          isCollected: true,
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