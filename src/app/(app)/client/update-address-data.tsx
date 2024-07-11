import { View } from "react-native";
import { Control, Controller, useController } from "react-hook-form";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";

import { FormData } from "./update-client";

type UpdateAddressDataProps = {
  control: Control<FormData>
  onFetchZipCode: () => Promise<void>
  loadingSearchZipCode: boolean
}

export function UpdateAddressData({ control, onFetchZipCode, loadingSearchZipCode }: UpdateAddressDataProps) {
  const { styles, theme } = useStyles(style);
  const { formState: { errors } } = useController({ control, name: 'address' })

  return (
    <Form style={{ marginTop: 16 }}>
      <View style={styles.horizontal}>
        <Input.Container 
          label="CEP" 
          style={{ width: '68%' }}
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
                onChangeText={(masked, unmasked) => onChange(masked)}
                style={{ borderColor: errors.address?.zipcode?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                editable
                loading={loadingSearchZipCode}
                value={value}
                onBlur={onBlur}
                returnKeyType="search"
                onEndEditing={onFetchZipCode}
              />
            )}
          />
        </Input.Container>

        <Input.Container 
          label="Número" 
          style={{ width: '30%' }}
          errorMessage={errors.address?.numberAddress?.message}
        >
          <Controller 
            control={control}
            name="address.numberAddress"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input.InputText 
                keyboardType="number-pad" 
                placeholder='Número...'
                style={{ borderColor: errors.address?.numberAddress?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                maxLength={4}
                editable
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
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
              style={{ borderColor: errors.address?.address?.message 
                ? theme.colors.accent 
                : theme.colors.shape 
              }}
              value={value}
              editable
              onBlur={onBlur}
              onChangeText={onChange}
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
              style={{ borderColor: errors.address?.complement?.message 
                ? theme.colors.accent 
                : theme.colors.shape 
              }}
              value={value}
              editable
              onBlur={onBlur}
              onChangeText={onChange}
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
              style={{ borderColor: errors.address?.neighborhood?.message 
                ? theme.colors.accent 
                : theme.colors.shape 
              }}
              value={value}
              editable
              onBlur={onBlur}
              onChangeText={onChange}
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
                style={{ borderColor: errors.address?.city?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                value={value}
                editable
                onBlur={onBlur}
                onChangeText={onChange}
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
                style={{ borderColor: errors.address?.provincy?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                maxLength={2}
                editable
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
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