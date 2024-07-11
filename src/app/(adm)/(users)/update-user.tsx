import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Title } from "@/components/Title";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";

import { Role } from "@prisma/client";
import { useApp } from "@/hooks/useApp";

import { GetUserService } from "@/apis/supabase/users/GetUserService";
import { UpdateUserService } from "@/apis/supabase/users/UpdateUserService";
import { useMutation, useQuery } from "@tanstack/react-query";

const service = new GetUserService()
const updateService = new UpdateUserService()

const schemaData = z.object({
  name: z.string({ message: 'Nome obrigatório.' }),
  email: z.string({ message: 'E-mail obrigatório.' }).email('E-mail não confere.'),
  role: z.enum([Role.ADMINISTRATOR, Role.USER] as const, { message: 'Papel obrigatorio.' }),
})

type FormData = z.infer<typeof schemaData>

export default function UpdateUser() {
  const { back } = useRouter()
  const { user_id } = useLocalSearchParams()
  const { theme, styles } = useStyles(style);
  const { error, success, normal } = useToast()
  const { handleSwipeDrawer, user_id: userId } = useApp()

  const { control, handleSubmit, setValue, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  const { isPending, mutate } = useMutation({
    mutationKey: ['user', user_id],
    mutationFn: fetchUserById
  })

  async function handleUpdateClient(data: FormData) {
    try {
      await updateService.execute(String(user_id), data)

      success({
        message: 'Usuário atualizado com sucesso!',
        duration: 4000,
        position: 2
      })

      back()
    } catch (err) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
      })
    }
  }

  async function fetchUserById() {
    try {
      const user = await service.execute({ user_id: String(user_id) })
      
      setValue('name', user?.name!, { shouldValidate: true })
      setValue('email', user?.email!, { shouldValidate: true })
      setValue('role', user?.role!, { shouldValidate: true })

      normal({
        message: 'Dados obtidos.',
        duration: 5000,
        position: 2
      })
    } catch (err) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
      })
    }
  }

  useEffect(() => {
    if (user_id) {
      mutate()
    }
  }, [user_id])

  useEffect(() => {
    handleSwipeDrawer(false)

    return () => handleSwipeDrawer(true)
  }, [])

  return (
    <>
      <Container
        style={{
          alignItems: 'flex-start',
          paddingTop: 48,
          paddingBottom: 8,
          width: '100%'
        }}
      >
        <View style={styles.headerContainer}>
          <DrawerMenu backButton />
          <Title label="Atualização de dados" size="xl" style={{ textAlign: 'left' }} />
        </View>

        {isPending ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <ActivityIndicator color={theme.colors.title} size="large" />
          </View>
        ) : (
          <>
            <Form style={{ flex: 1 }}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                <Input.Container label="Nome Completo" errorMessage={errors.name?.message}>
                  <Controller 
                    control={control}
                    name="name"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Input.InputText 
                        keyboardType="default" 
                        editable={userId !== user_id}
                        placeholder='Informe o seu nome completo...'
                        containerStyle={{ borderColor: errors.name?.message ? theme.colors.accent : theme.colors.shape }}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    )}
                  />
                </Input.Container>

                <Input.Container label="E-mail" errorMessage={errors.email?.message}>
                  <Controller 
                    control={control}
                    name="email"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Input.InputText 
                        keyboardType="email-address"
                        editable={userId !== user_id} 
                        placeholder='Informe o seu e-mail...'
                        containerStyle={{ borderColor: errors.email?.message ? theme.colors.accent : theme.colors.shape }}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    )}
                  />
                </Input.Container>

                <Input.Container label="Papel" errorMessage={errors.role?.message}>
                  <Controller 
                    control={control}
                    name="role"
                    render={({ field: { value, onChange } }) => (
                      <Input.Select 
                        value={value}
                        onChange={onChange}
                        enabled={userId !== user_id}
                        placeholder="Selecione o papel..."
                        containerStyle={{ borderColor: errors.role?.message ? theme.colors.accent : theme.colors.shape }}
                        items={[
                          { label: 'Administrador', value: 'ADMINISTRATOR' },
                          { label: 'Comum', value: 'USER' }
                        ]}
                      />
                    )}
                  />
                </Input.Container>
              </ScrollView>
            </Form>

            <Button 
              label="Salvar" 
              disabled={(userId === user_id) || (userId !== user_id && isSubmitting)} 
              loading={isSubmitting}
              onPress={handleSubmit(handleUpdateClient)} 
              style={{ marginTop: 32 }} 
            />
          </>
        )}
      </Container>
    </>
  )
}

const style = createStyleSheet((theme) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
}))