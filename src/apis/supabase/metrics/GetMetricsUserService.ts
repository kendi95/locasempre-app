import { supabase } from "@/database"

type ReturnData = {
  customersCount: number
  itemsCount: number
  ordersCount: number
}

export class GetMetricsUserService {
  async execute(): Promise<ReturnData> {
    const [dataCustomers, dataItems, ordersCount] = await Promise.all([
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('items').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
    ])

    return {
      customersCount: dataCustomers.count!,
      itemsCount: dataItems.count!,
      ordersCount: ordersCount.count!
    }
  }
}