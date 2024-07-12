import { z } from 'zod'
import { useEffect } from 'react';
import { useRouter, Link } from 'expo-router';
import { Image, Keyboard } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Asterisk, AtSign } from 'lucide-react-native';

import { Form } from '@/components/Form';
import { Input } from '@/components/Input';
import { Title } from '@/components/Title';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';

import { useApp } from '@/hooks/useApp';
import { useToast } from '@/hooks/useToast';
import { jwtMiddleware } from '@/apis/supabase/auth/jwtMiddleware'
import { requestPermissionNotification } from '@/libs/notifications';
import { AuthenticationService } from '@/apis/supabase/auth/AuthenticationService'

const service = new AuthenticationService()

const schemaData = z.object({
  email: z.string({ message: 'E-mail obrigatório.' }).email(),
  password: z.string({ message: 'Senha obrigatória.' }).min(6, 'Deve conter no mínimo 6 caracteres.')
})

type FormData = z.infer<typeof schemaData>

export default function Home() {
  const { theme } = useStyles()
  const { replace } = useRouter()
  const { error, success } = useToast()
  const { isFirstOpenApp, storeUserId } = useApp()

  const { handleSubmit, formState: { isSubmitting, errors }, control, reset } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  async function handleSignin(data: FormData) {
    try {
      await schemaData.parseAsync(data)

      const { user: { role, id } } = await service.execute(data)

      storeUserId(id)

      reset({
        email: '',
        password: '',
      })

      success({
        message: 'Usuário acessado com sucesso!',
        duration: 5000,
        position: 2
      })

      if (role === "ADMINISTRATOR") {
        return replace('dashboard')
      }

      return replace('home')
    } catch (err) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
      })
    }
    
  }

  async function checkAuthentication() {
    const checkAuth = await jwtMiddleware()

    if (checkAuth.status) {
      storeUserId(checkAuth.user_id!)

      if (checkAuth.role === "ADMINISTRATOR") {
        return replace('dashboard')
      }

      return replace('home')
    }

    if (isFirstOpenApp) {
      return replace('app-landing')
    }
  }

  // useEffect(() => {
  //   checkAuthentication();
  // }, [isFirstOpenApp])

  useEffect(() => {
    requestPermissionNotification()
  }, [])

  return (
    <Container
      onTouch={Keyboard.dismiss}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      <Image 
        source={require('../../assets/icon.png')} 
        style={{
          width: '100%',
          height: '12.5%',
          resizeMode: 'cover'
        }}
      />

      <Title label="Acessar a plataforma" size="lg" style={{ textAlign: 'center' }} />

      <Form>
        <Input.Container label="E-mail" errorMessage={errors.email?.message}>
          <Controller 
            control={control}
            name='email'
            render={({ field: { value, onChange, onBlur } }) => (
              <Input.InputText 
                icon={AtSign} 
                keyboardType="email-address" 
                placeholder='Informe seu e-mail...'
                editable
                containerStyle={{ borderColor: errors.email?.message ? theme.colors.accent : theme.colors.shape }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />

            )}
          />
        </Input.Container>

        <Input.Container label="Senha" errorMessage={errors.password?.message}>
          <Controller 
            control={control}
            name='password'
            render={({ field: { value, onChange, onBlur } }) => (
              <Input.InputText 
                icon={Asterisk} 
                keyboardType="default" 
                secureTextEntry 
                editable
                placeholder='Informe sua senha...'
                containerStyle={{ borderColor: errors.password?.message ? theme.colors.accent : theme.colors.shape }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />

            )}
          />
        </Input.Container>

        <Button 
          label="Acessar" 
          style={{ marginTop: 12 }} 
          disabled={isSubmitting} 
          loading={isSubmitting}
          onPress={handleSubmit(handleSignin)} 
        />
      </Form>

      <Link href="/forgot-password" style={{ width: '100%', marginTop: -8 }}>
        <Title 
          label="Esqueci minha senha" 
          size="sm" 
          style={{ textAlign: 'left', color: theme.colors.subTitle }} 
        />
      </Link>
    </Container>
  )
}