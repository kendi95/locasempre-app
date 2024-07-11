import { z } from "zod";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Link, useRouter } from "expo-router";
import { Keyboard, View } from "react-native";
import { AtSign, Hash } from "lucide-react-native";
import { useStyles } from "react-native-unistyles";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Title } from "@/components/Title";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

import { useToast } from "@/hooks/useToast";
import { ForgotPasswordService } from "@/apis/supabase/auth/ForgotPasswordService";
import { ValidationResetTokenService } from "@/apis/supabase/auth/ValidationResetTokenService";

const schemaData = z.object({
  email: z.string({ message: 'E-mail obrigatório.' }).email('E-mail inválido.'),
})

type FormData = z.infer<typeof schemaData>

const forgotPasswordService = new ForgotPasswordService()
const validationResetTokenService = new ValidationResetTokenService()

export default function ForgotPassword() {
  const { theme } = useStyles()
  const { error, success } = useToast()
  const { setParams, navigate } = useRouter()
  const [token, setToken] = useState('')
  const [isSubmit, setIsSubmit] = useState(false)
  const [isSendEmail, setIsSendEmail] = useState(false)
  const [countdown, setCountdown] = useState(dayjs(new Date().setHours(0, 1, 0, 0)))
  const [isResend, setIsResend] = useState(false)

  const formattedCountdown = useMemo(() => {
    return dayjs(countdown).format('mm:ss')
  }, [countdown])

  const { handleSubmit, formState: { isSubmitting, errors }, control, reset } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  const subtitle = !isSendEmail 
    ? 'Informe seu endereço de email no campo abaixo que esteja cadastrado na plataforma'
    : 'Copie e cole o código enviado na sua caixa de email.'

  function handleSetTimeout() {
    setIsResend(false)

    if (dayjs(countdown).minute() === 0) {
      setCountdown(oldTime => dayjs(oldTime).add(1, 'minute'))
    }

    const interval = setInterval(() => {
      setCountdown(oldTime => {
        if (dayjs(oldTime).minute() !== 0 || dayjs(oldTime).second() !== 0) {
          return dayjs(oldTime).subtract(1, 'second')
        }

        setIsResend(true)
        clearInterval(interval)
        return dayjs(oldTime)
      })
    }, 1000)

  }

  async function handleSendEmail(data: FormData) {
    try {
      await forgotPasswordService.execute(data)

      setIsSendEmail(true)

      success({
        message: 'Email enviado na sua caixa de email.',
        duration: 5000,
        position: 2
      })

      handleSetTimeout()
    } catch (err) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
      })
    }
  }

  async function handleSubmitToken() {
    try {
      setIsSubmit(true)

      await validationResetTokenService.execute({ token })
      
      navigate('forgot-password/new-password')
      setParams({ token: String(token) })
    } catch (err) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
      })
    } finally {
      setIsSubmit(false)
    }
  }

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
        label={subtitle}
        size="xs" 
        style={{ textAlign: 'left', marginTop: -24, color: theme.colors.subTitle }} 
      />

      <Form>
        {!isSendEmail ? (
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
        ) : (
          <Input.Container label="Código" errorMessage={token === '' ? 'Token obrigatório' : ''}>
            <Input.InputText 
              icon={Hash}
              keyboardType="default" 
              autoCapitalize="none"
              placeholder='Informe o código...'
              editable
              containerStyle={{ borderColor: token === '' ? theme.colors.accent : theme.colors.shape }}
              value={token}
              onChangeText={setToken}
            />
          </Input.Container>
        )}

        {!isSendEmail ? (
          <Button 
            label="Enviar" 
            style={{ marginTop: 12 }} 
            disabled={isSubmitting} 
            loading={isSubmitting}
            onPress={handleSubmit(handleSendEmail)} 
          />
        ) : (
          <Button 
            label="Próximo" 
            style={{ marginTop: 12 }} 
            disabled={token === ''} 
            loading={isSubmit}
            onPress={handleSubmitToken} 
          />
        )}

        {isSendEmail && (
          <View style={{ marginVertical: 8 }}>
            <Title label={formattedCountdown} size="sm" style={{ textAlign: 'center' }} />  
            <Button 
              label="Enviar novamente" 
              style={{ marginTop: 12, backgroundColor: theme.colors.bottomSheet }} 
              disabled={isSubmitting || !isResend} 
              loading={isSubmitting}
              onPress={handleSubmit(handleSendEmail)} 
            />
          </View>
        )}
        
      </Form>

      <Link href="/" style={{ marginTop: -8 }}>
        <Title 
          label="Acesso a plataforma" 
          size="sm" 
          style={{ textAlign: 'center', color: theme.colors.subTitle }} 
        />
      </Link>
    </Container>
  )
}