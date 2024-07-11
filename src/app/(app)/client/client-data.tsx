import { useStyles } from "react-native-unistyles";
import { Control, Controller, useController } from "react-hook-form";

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";

import { FormData } from "./create-client";

type ClientDataProps = {
  control: Control<FormData>
}

export function ClientData({ control }: ClientDataProps) {
  const { theme } = useStyles()
  const { formState: { errors } } = useController({ control, name: 'name' })

  return (
    <Form style={{ marginTop: 16 }}>
      <Input.Container label="Nome Completo" errorMessage={errors.name?.message}>
        <Controller 
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input.InputText 
              keyboardType="default" 
              placeholder='Informe o nome completo...'
              autoCapitalize="words"
              containerStyle={{ borderColor: errors.name?.message 
                ? theme.colors.accent 
                : theme.colors.shape 
              }}
              editable
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Input.Container>

      <Input.Container label="Celular" errorMessage={errors.phone?.message}>
        <Controller 
          control={control}
          name="phone"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input.InputMask 
              keyboardType="decimal-pad" 
              placeholder='Informe o celular...'
              mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
              style={{ borderColor: errors.phone?.message ? theme.colors.accent : theme.colors.shape }}
              value={value}
              editable
              onChangeText={(masked, unmasked) => onChange(masked)}
              onBlur={onBlur}
            />
          )}
        />
      </Input.Container>

      <Input.Container label="CPF" errorMessage={errors.cpf?.message}>
        <Controller 
          control={control}
          name="cpf"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input.InputMask 
              keyboardType="decimal-pad" 
              placeholder='Informe o CPF...'
              mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
              style={{ borderColor: errors.cpf?.message ? theme.colors.accent : theme.colors.shape }}
              value={value}
              editable
              onChangeText={(masked, unmasked) => onChange(masked)}
              onBlur={onBlur}
            />
          )}
        />
      </Input.Container>
    </Form>
  )
}