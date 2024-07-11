
import { supabase } from "@/database"

type ReturnData = {
  usersCount: number
  imagesCount: number
  customersCount: number
  itemsCount: number
  ordersCount: number
}

export class GetMetricsAdministratorService {
  async execute(): Promise<ReturnData> {
    const [dataUsers, dataImages, dataCustomers, dataItems, ordersCount] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('images').select('id', { count: 'exact', head: true }),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('items').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
    ])

    return {
      usersCount: dataUsers.count || 0,
      imagesCount: dataImages.count || 0,
      customersCount: dataCustomers.count || 0,
      itemsCount: dataItems.count || 0,
      ordersCount: ordersCount.count || 0
    }
  }
}