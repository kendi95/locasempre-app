import { z } from "zod";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useStyles } from "react-native-unistyles";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { GetUserService } from "@/apis/supabase/users/GetUserService";
import { UpdateProfileService } from "@/apis/supabase/users/UpdateProfileService";

const schemaData = z.object({
  name: z.string({ message: 'Nome obrigatório.' }),
  email: z.string({ message: 'E-mail obrigatório.' }).email('E-mail não confere.')
})

type FormData = z.infer<typeof schemaData>

const service = new UpdateProfileService()
const fetchService = new GetUserService()

export function ProfileUserData() {
  const { user_id } = useApp()
  const { theme } = useStyles()
  const { push } = useRouter()
  const { success, error } = useToast()
  const [loadData, setLoadData] = useState(false)

  const { control, handleSubmit, formState: { isSubmitting, errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  async function handleSaveData(data: FormData) {
    try {
      await schemaData.parseAsync(data)

      await service.execute(user_id, data)

      success({
        message: 'Dados salvo com sucesso!',
        position: 2,
        duration: 4000,
      })

      push('dashboard')
    } catch (err) {
      error({
        message: err?.message,
        position: 2,
        duration: 4000,
      })
    }
  }

  async function fetchProfile() {
    try {
      setLoadData(true)

      const user = await fetchService.execute({ user_id })

      setValue('name', user?.name!)
      setValue('email', user?.email!)
    } catch (err) {
      error({
        message: err?.message,
        position: 2,
        duration: 4000,
      })
    } finally {
      setLoadData(false)
    }
    
  }

  useFocusEffect(useCallback(() => {
    fetchProfile()

    return () => {}
  }, []))

  return (
    <Form key="1" style={{ marginTop: 16, flex: 1, alignItems: 'center', width: '100%' }}>
      {loadData ? (
        <ActivityIndicator size="large" color={theme.colors.title} />
      ) : (
        <>
          <Input.Container 
            label="Nome Completo" 
            style={{ width: '100%' }} 
            errorMessage={errors.name?.message}
          >
            <Controller 
              control={control}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input.InputText 
                  keyboardType="default" 
                  placeholder='Informe o nome completo...'
                  autoCapitalize="words"
                  containerStyle={{ borderColor: errors.name?.message ? theme.colors.accent : theme.colors.shape }}
                  editable
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Input.Container>

          <Input.Container 
            label="E-mail" 
            style={{ width: '100%' }}
            errorMessage={errors.email?.message}
          >
            <Controller 
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input.InputText 
                  keyboardType="email-address" 
                  placeholder='Informe o seu e-mail...'
                  autoCapitalize="words"
                  containerStyle={{ borderColor: errors.email?.message ? theme.colors.accent : theme.colors.shape }}
                  editable
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Input.Container>

          <Button 
            label="Salvar" 
            disabled={isSubmitting} 
            loading={isSubmitting}
            onPress={handleSubmit(handleSaveData)} 
            style={{ position: 'absolute', bottom: 0 }} 
          />
        </>
      )}
    </Form>
  )
}