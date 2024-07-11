import { supabase } from "@/database"

type InputData = {
  user_id: string
}

export class GetUserService {
  async execute({ user_id }: InputData) {
    try {
      const { data } = await supabase.from('users')
        .select('name, email, role, id')
        .eq('id', user_id)
        .single()

      return data
    } catch (error) {
      throw error
    }
  }
}