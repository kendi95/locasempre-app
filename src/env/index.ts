import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_DATABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_URL: z.string(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  EXPO_PUBLIC_SECRET_KEY: z.string(),
  EXPO_PUBLIC_EMAILJS_URL: z.string().url(),
  EXPO_PUBLIC_EMAILJS_PUBLIC_KEY: z.string()
})

type DataEnv = z.infer<typeof envSchema>

let env: DataEnv | null

async function validationEnv() {
  try {
    env = await envSchema.parseAsync(process.env)
  } catch (err) {
    env = null
    throw new Error('Deve conter variáveis de ambiente dentro do arquivo .env')
  }
}

validationEnv()

export { env }
