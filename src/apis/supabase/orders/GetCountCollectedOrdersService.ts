import dayjs from 'dayjs'

import { supabase } from "@/database"

export class GetCountCollectedOrdersService {
  async execute() {
    try {
      let expiredCollected = 0
      let noExpiredCollected = 0

      const { count, data } = await supabase.from('orders')
        .select('id, collectedAt', { count: 'exact', head: false })
        .eq('isCollected', false)
        .order('createdAt', { ascending: true })

      data?.forEach((order) => {
        if (dayjs(order.collectedAt).isAfter(Date.now())) {
          noExpiredCollected = noExpiredCollected + 1
        } else {
          expiredCollected = expiredCollected + 1
        }
      })
      
      return { 
        count: count || 0,
        expiredCollected,
        noExpiredCollected
      }
    } catch (error) {
      throw error
    }
  }
}