import { z } from "zod";
import { Role } from "@prisma/client";
import { useNavigation } from "expo-router";
import { ScrollView, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Title } from "@/components/Title";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";

import { CreateUserService } from "@/apis/supabase/users/CreateUserService";

const schemaData = z.object({
  name: z.string({ message: 'Nome obrigatório.' }),
  email: z.string({ message: 'E-mail obrigatório.' }).email(),
  role: z.enum([Role.ADMINISTRATOR, Role.USER] as const, { message: 'Papel obrigatorio.' }),
  password: z.string({ message: 'Senha obrigatória.' }).min(6, 'Deve conter no mínimo 6 caracteres.'),
  confirm_password: z.string().min(6, 'Deve conter no mínimo 6 caracteres.')
}).refine((data) => data.password === data.confirm_password, {
  message: 'Senha não confere.',
  path: ['confirm_password']
})

type FormData = z.infer<typeof schemaData>

const service = new CreateUserService()

export default function CreateUser() {
  const { goBack } = useNavigation()
  const { success, error } = useToast()
  const { theme, styles } = useStyles(style)
  
  const { control, handleSubmit, formState: { isSubmitting, errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  async function handleCreateUser(data: FormData) {
    try {
      await schemaData.parseAsync(data)

      await service.execute({
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password
      })

      reset({
        name: '',
        email: '',
        password: '',
        confirm_password: ''
      })

      success({
        message: 'Usuário criado com sucesso!',
        duration: 4000,
        position: 2
      })

      goBack()
    } catch (err) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
      })
    }
  }

  return (
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
        <Title label="Cadastro de usuário" size="xl" style={{ textAlign: 'left' }} />
      </View>

      <Form style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }} contentContainerStyle={{ gap: 8 }}>
          <Input.Container label="Nome Completo" errorMessage={errors.name?.message}>
            <Controller 
              control={control}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input.InputText 
                  keyboardType="default" 
                  placeholder='Informe o seu nome completo...'
                  value={value}
                  editable
                  containerStyle={{ borderColor: errors.name?.message ? theme.colors.accent : theme.colors.shape }}
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
                  placeholder='Informe o seu e-mail...'
                  containerStyle={{ borderColor: errors.email?.message ? theme.colors.accent : theme.colors.shape }}
                  value={value}
                  editable
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
                  enabled
                  onChange={onChange}
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

          <Input.Container 
            label="Nova Senha" 
            style={{ marginTop: 24 }}
            errorMessage={errors.password?.message}
          >
            <Controller 
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input.InputText 
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

          <Input.Container label="Confirmação Senha" errorMessage={errors.confirm_password?.message}>
            <Controller 
              control={control}
              name="confirm_password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input.InputText 
                  keyboardType="default" 
                  secureTextEntry 
                  editable
                  placeholder='Confirmar sua senha...'
                  containerStyle={{ borderColor: errors.confirm_password?.message ? theme.colors.accent : theme.colors.shape }}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Input.Container>
        </ScrollView>

        <Button 
          label="Cadastrar" 
          style={{ marginTop: 12 }}
          disabled={isSubmitting} 
          loading={isSubmitting}
          onPress={handleSubmit(handleCreateUser)}
        />
      </Form>
    </Container>
  )
}

const style = createStyleSheet((theme) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16
  }  
}))
