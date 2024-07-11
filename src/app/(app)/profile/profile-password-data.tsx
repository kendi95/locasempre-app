import { z } from "zod";
import { useStyles } from "react-native-unistyles";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { UpdateProfileService } from "@/apis/supabase/users/UpdateProfileService";

const schemaData = z.object({
  oldPassword: z.string({ message: 'Senha antiga obrigatório.' }).min(6, 'Deve conter no mínimo 6 caracteres.'),
  newPassword: z.string({ message: 'Senha obrigatória.' }).min(6, 'Deve conter no mínimo 6 caracteres.'),
  confirmPassword: z.string().min(6, 'Deve conter no mínimo 6 caracteres.')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Nova senha não confere.',
  path: ['confirmPassword']
})

type FormData = z.infer<typeof schemaData>

const service = new UpdateProfileService()

export function ProfilePasswordData() {
  const { success, error } = useToast()
  const { user_id } = useApp()
  const { theme } = useStyles()

  const { control, handleSubmit, formState: { isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  async function handleSaveData(data: FormData) {
    try {
      await schemaData.parseAsync(data)

      await service.execute(user_id, data)

      reset({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      success({
        message: 'Senha atualizado com sucesso!',
        position: 2,
        duration: 4000
      })
    } catch (err) {
      error({
        message: err?.message,
        position: 2,
        duration: 5000
      })
    }
  }

  return (
    <Form key="2" style={{ marginTop: 16, flex: 1 }}>
      <Input.Container label="Senha Antiga">
        <Controller 
          control={control}
          name="oldPassword"
          render={({ field: { value, onChange, onBlur }, formState: { errors } }) => (
            <Input.InputText 
              keyboardType="default" 
              secureTextEntry 
              containerStyle={{ borderColor: errors.oldPassword?.message ? theme.colors.accent : theme.colors.shape }}
              editable
              placeholder='Informe sua senha...'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Input.Container>

      <Input.Container label="Nova Senha">
        <Controller 
          control={control}
          name="newPassword"
          render={({ field: { value, onChange, onBlur }, formState: { errors } }) => (
            <Input.InputText 
              keyboardType="default" 
              secureTextEntry 
              containerStyle={{ borderColor: errors.newPassword?.message ? theme.colors.accent : theme.colors.shape }}
              editable
              placeholder='Informe sua senha...'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Input.Container>

      <Input.Container label="Confirmação Senha">
        <Controller 
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange, onBlur }, formState: { errors } }) => (
            <Input.InputText 
              keyboardType="default" 
              secureTextEntry 
              containerStyle={{ borderColor: errors.confirmPassword?.message ? theme.colors.accent : theme.colors.shape }}
              editable
              placeholder='Informe sua senha...'
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
        onPress={handleSubmit(handleSaveData)} 
        style={{ position: 'absolute', bottom: 0 }} 
      />
    </Form>
  )
}