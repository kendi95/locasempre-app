import { View } from "react-native";
import { Control, Controller, useController } from "react-hook-form";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";

import { FormData } from "./create-client";
import { useState } from "react";

type AddressDataProps = {
  control: Control<FormData>
  onFetchZipCode: () => Promise<void>
}

export function AddressData({ control, onFetchZipCode }: AddressDataProps) {
  const { styles, theme } = useStyles(style);
  const [loadZipCode, setLoadZipCode] = useState(false)
  const { formState: { errors } } = useController({ control, name: 'address' })

  async function handleFetchZipCode() {
    setLoadZipCode(true)

    await onFetchZipCode()
    
    setLoadZipCode(false)
  }

  return (
    <Form style={{ marginTop: 16 }}>
      <View style={styles.horizontal}>
        <Input.Container 
          label="CEP" 
          style={{ width: '62%' }} 
          errorMessage={errors.address?.zipcode?.message}
        >
          <Controller 
            control={control}
            name="address.zipcode"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input.InputMask
                keyboardType="decimal-pad" 
                placeholder='CEP...'
                mask={[/\d/, /\d/, /\d/,  /\d/,  /\d/, '-', /\d/, /\d/, /\d/]}
                style={{ borderColor: errors.address?.zipcode?.message ? theme.colors.accent : theme.colors.shape }}
                onChangeText={(masked, unmasked) => onChange(masked)}
                value={value}
                editable
                loading={loadZipCode}
                onBlur={onBlur}
                returnKeyType="search"
                onEndEditing={handleFetchZipCode}
              />
            )}
          />
        </Input.Container>

        <Input.Container 
          label="Número" 
          style={{ width: '34%' }}
          errorMessage={errors.address?.numberAddress?.message}
        >
          <Controller 
            control={control}
            name="address.numberAddress"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input.InputText 
                keyboardType="number-pad" 
                placeholder='Número...'
                containerStyle={{ borderColor: errors.address?.numberAddress?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                maxLength={4}
                value={value}
                editable
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </Input.Container>
      </View>

      <Input.Container label="Endereço" errorMessage={errors.address?.address?.message}>
        <Controller 
          control={control}
          name="address.address"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input.InputText 
              keyboardType="default" 
              placeholder='Informe o endereço completo...'
              containerStyle={{ borderColor: errors.address?.address?.message 
                ? theme.colors.accent 
                : theme.colors.shape 
              }}
              value={value}
              editable
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Input.Container>

      <Input.Container label="Complemento" errorMessage={errors.address?.complement?.message}>
        <Controller 
          control={control}
          name="address.complement"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input.InputText 
              keyboardType="default" 
              placeholder='Informe o complemento...'
              containerStyle={{ borderColor: errors.address?.complement?.message 
                ? theme.colors.accent 
                : theme.colors.shape 
              }}
              value={value!}
              editable
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Input.Container>

      <Input.Container label="Bairro" errorMessage={errors.address?.neighborhood?.message}>
        <Controller 
          control={control}
          name="address.neighborhood"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input.InputText 
              keyboardType="default" 
              placeholder='Informe o bairro...'
              containerStyle={{ borderColor: errors.address?.neighborhood?.message 
                ? theme.colors.accent 
                : theme.colors.shape 
              }}
              value={value}
              editable
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Input.Container>

      <View style={styles.horizontal}>
        <Input.Container 
          label="Cidade" 
          style={{ width: '72%' }}
          errorMessage={errors.address?.city?.message}  
        >
          <Controller 
            control={control}
            name="address.city"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input.InputText 
                keyboardType="default" 
                placeholder='Informe a cidade...'
                containerStyle={{ borderColor: errors.address?.city?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                value={value}
                editable
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </Input.Container>

        <Input.Container 
          label="Estado" 
          style={{ width: '24%' }}
          errorMessage={errors.address?.provincy?.message}
        >
          <Controller 
            control={control}
            name="address.provincy"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input.InputText 
                autoCapitalize="characters"
                placeholder='Ex: SP'
                containerStyle={{ borderColor: errors.address?.provincy?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                maxLength={2}
                value={value}
                editable
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </Input.Container>
      </View>
    </Form>
  )
}

const style = createStyleSheet((theme) => ({
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    width: '100%'
  },
}))