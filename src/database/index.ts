import { createClient } from '@supabase/supabase-js'

import { Database } from './database'
import { env } from '@/env'

export const supabase = createClient<Database>(
  env?.EXPO_PUBLIC_SUPABASE_URL!,
  env?.EXPO_PUBLIC_SUPABASE_ANON_KEY!
)
