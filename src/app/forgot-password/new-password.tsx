import { z } from "zod"
import { useEffect } from "react"
import { Keyboard } from "react-native"
import { Asterisk } from "lucide-react-native"
import { useStyles } from "react-native-unistyles"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Link, useLocalSearchParams, useRouter } from "expo-router"

import { Form } from "@/components/Form"
import { Input } from "@/components/Input"
import { Title } from "@/components/Title"
import { Button } from "@/components/Button"
import { Container } from "@/components/Container"

import { useToast } from "@/hooks/useToast"
import { ResetPasswordService } from "@/apis/supabase/auth/ResetPasswordService"

const schemaData = z.object({
  token: z.string({ message: 'Token obrigatório.' }).uuid(),
  newPassword: z.string({ message: 'Senha obrigatória.' }).min(6, 'Deve conter no mínimo 6 caracteres.'),
  confirmPassword: z.string().min(6, 'Deve conter no mínimo 6 caracteres.')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Nova senha não confere.',
  path: ['confirmPassword']
})

type FormData = z.infer<typeof schemaData>

const resetPasswordService = new ResetPasswordService()

export default function NewPassword() {
  const { theme } = useStyles()
  const { error, success } = useToast()
  const { token } = useLocalSearchParams()
  const { dismissAll } = useRouter()

  const { handleSubmit, formState: { isSubmitting, errors }, control, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  async function handleResetPassword(data: FormData) {
    try {
      await schemaData.parseAsync(data)

      await resetPasswordService.execute(data)

      reset({
        token: '',
        newPassword: '',
        confirmPassword: ''
      })

      success({
        message: 'Senha alterado com sucesso!',
        duration: 5000,
        position: 2
      })

      dismissAll()
    } catch (err) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
      })
    }
  }

  useEffect(() => {
    if (token) {
      setValue('token', String(token))
    }
  }, [token])

  return (
    <Container
      onTouch={Keyboard.dismiss}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      <Title label="Recuperação de senha" size="lg" style={{ textAlign: 'center' }} />

      <Title 
        label="Informe seu endereço de email no campo abaixo que esteja cadastrado na plataforma" 
        size="xs" 
        style={{ textAlign: 'left', marginTop: -24, color: theme.colors.subTitle }} 
      />

      <Form>
        <Input.Container label="Nova Senha" errorMessage={errors.newPassword?.message}>
          <Controller 
            control={control}
            name='newPassword'
            render={({ field: { value, onChange, onBlur } }) => (
              <Input.InputText 
                icon={Asterisk} 
                keyboardType="default" 
                secureTextEntry 
                editable
                placeholder='Informe sua nova senha...'
                containerStyle={{ borderColor: errors.newPassword?.message ? theme.colors.accent : theme.colors.shape }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />

            )}
          />
        </Input.Container>

        <Input.Container label="Confirmar Senha" errorMessage={errors.confirmPassword?.message}>
          <Controller 
            control={control}
            name='confirmPassword'
            render={({ field: { value, onChange, onBlur } }) => (
              <Input.InputText 
                icon={Asterisk} 
                keyboardType="default" 
                secureTextEntry 
                editable
                placeholder='Informe a confirmação senha...'
                containerStyle={{ borderColor: errors.confirmPassword?.message ? theme.colors.accent : theme.colors.shape }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />

            )}
          />
        </Input.Container>

        <Button 
          label="Resetar" 
          style={{ marginTop: 12 }} 
          disabled={isSubmitting} 
          loading={isSubmitting}
          onPress={handleSubmit(handleResetPassword)} 
        />
      </Form>

      <Link href="/forgot-password" style={{ marginTop: -8 }}>
        <Title 
          label="Acesso a plataforma" 
          size="sm" 
          style={{ textAlign: 'center', color: theme.colors.subTitle }} 
        />
      </Link>
    </Container>
  )
}