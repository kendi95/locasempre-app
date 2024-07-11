import { z } from "zod";
import { ScrollView, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Button } from "@/components/Button";
import { Form } from "@/components/Form";
import { Input } from "@/components/Input";

import { useToast } from "@/hooks/useToast";
import { fetchCEP } from "@/apis/brasilapi/fetchCEP";
import { CreateCustomerService } from "@/apis/supabase/customers/CreateCustomerService";

type ClientNewDataProps = {
  onCreatedNewData: () => void
}

const schemaData = z.object({
  name: z.string({ message: 'Nome obrigatório.' }),
  phone: z.string({ message: 'Celular obrigatório.' })
    .min(15, 'Deve conter no mínimo de 14 caracteres.')
    .max(15, 'Deve conter no máximo de 15 caracteres.'),
  cpf: z.string({ message: 'CPF obrigatório.' })
    .min(14, 'Deve conter no mínimo de 14 caracteres.')
    .max(14, 'Deve conter no máximo de 14 caracteres.'),
  address: z.object({
    zipcode: z.string({ message: 'CEP obrigatório.' })
      .min(8, 'Deve conter no mínimo de 8 caracteres.')
      .max(9, 'Deve conter no máximo de 9 caracteres.'),
    numberAddress: z.string({ message: 'Número do endereço obrigatório.' }).default('0'),
    address: z.string({ message: 'Endereço obrigatório.' }),
    neighborhood: z.string({ message: 'Bairro obrigatório.' }),
    complement: z.string().default(''),
    city: z.string({ message: 'Cidade obrigatória.' }),
    provincy: z.string({ message: 'Estado/Província obrigatoria.' })
      .min(2, 'Deve conter no mínimo de 2 carateres.')
      .max(2, 'Deve conter no máximo de 2 caracteres.')
  }, { message: 'Dados do endereço obrigatório.' })
})

type FormData = z.infer<typeof schemaData>

const service = new CreateCustomerService()

export function ClientNewData({ onCreatedNewData }: ClientNewDataProps) {
  const { success, error } = useToast()
  const { styles, theme } = useStyles(style);

  const { handleSubmit, control, formState: { isSubmitting, errors }, setValue, getValues, reset } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  const { isPending, mutate } = useMutation({
    mutationKey: ['customer-delivered-address'],
    mutationFn: handleFetchCEP
  })

  async function handleFetchCEP() {
    try {
      const { address: { zipcode } } = getValues()
      const response = await fetchCEP(zipcode);

      setValue("address.address", response.street)
      setValue("address.neighborhood", response.neighborhood)
      setValue("address.provincy", response.state)
      setValue("address.city", response.city)
    } catch (err: any) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
      })
    }
  }

  async function handleCreateClient(data: FormData) {
    try {
      await schemaData.parseAsync(data)

      await service.execute({
        ...data,
        address: {
          ...data.address,
          numberAddress: Number(data.address.numberAddress),
          complement: data.address.complement || ''
        }
      })

      reset({
        name: '',
        cpf: '',
        phone: '',
        address: {
          address: '',
          city: '',
          provincy: '',
          complement: '',
          neighborhood: '',
          numberAddress: '0',
          zipcode: ''
        }
      })

      success({
        message: 'Cliente cadastrado com sucesso!',
        duration: 5000,
        position: 2
      })

      onCreatedNewData()
    } catch (err) {
      error({
        message: err.message,
        duration: 4000,
        position: 2
      })
    }
    
  }

  return (
    <Form style={{ flex: 1 }}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 24, backgroundColor: theme.colors.background }}
      >
        <Input.Container label="Nome Completo" errorMessage={errors.name?.message}>
          <Controller 
            control={control}
            name="name"
            render={({ field: { value, onBlur, onChange } }) => (
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
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </Input.Container>

        <Input.Container label="Celular" errorMessage={errors.phone?.message}>
          <Controller 
            control={control}
            name="phone"
            render={({ field: { value, onBlur, onChange } }) => (
              <Input.InputMask 
                keyboardType="decimal-pad" 
                placeholder='Informe o celular...'
                mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                style={{ borderColor: errors.phone?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                editable
                value={value}
                onChangeText={(masked) => onChange(masked)}
                onBlur={onBlur}
              />
            )}
          />
        </Input.Container>

        <Input.Container label="CPF" errorMessage={errors.cpf?.message}>
          <Controller 
            control={control}
            name="cpf"
            render={({ field: { value, onBlur, onChange } }) => (
              <Input.InputMask 
              keyboardType="decimal-pad" 
              placeholder='Informe o CPF...'
              mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
              style={{ borderColor: errors.cpf?.message 
                ? theme.colors.accent 
                : theme.colors.shape 
              }}
              editable  
              value={value}
                onChangeText={(masked) => onChange(masked)}
                onBlur={onBlur}
              />
            )}
          />
        </Input.Container>

        <View style={styles.horizontal}>
          <Input.Container 
            label="CEP" 
            style={{ width: '68%' }}
            errorMessage={errors.address?.zipcode?.message}
          >
            <Controller 
              control={control}
              name="address.zipcode"
              render={({ field: { value, onBlur, onChange } }) => (
                <Input.InputMask 
                  keyboardType="decimal-pad" 
                  placeholder='CEP...'
                  mask={[/\d/, /\d/, /\d/,  /\d/,  /\d/, '-', /\d/, /\d/, /\d/]}
                  style={{ borderColor: errors.address?.zipcode?.message 
                    ? theme.colors.accent 
                    : theme.colors.shape 
                  }}
                  returnKeyType="search"
                  editable
                  loading={isPending}
                  value={value}
                  onChangeText={(masked) => onChange(masked)}
                  onEndEditing={() => mutate()}
                  onBlur={onBlur}
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
              render={({ field: { value, onBlur, onChange } }) => (
                <Input.InputText 
                  keyboardType="number-pad" 
                  placeholder='Número...'
                  containerStyle={{ borderColor: errors.address?.numberAddress?.message 
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
            render={({ field: { value, onBlur, onChange } }) => (
              <Input.InputText 
                keyboardType="default" 
                placeholder='Informe o endereço completo...'
                containerStyle={{ borderColor: errors.address?.address?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                editable
                value={value}
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
            render={({ field: { value, onBlur, onChange } }) => (
              <Input.InputText 
                keyboardType="default" 
                placeholder='Informe o complemento...'
                containerStyle={{ borderColor: errors.address?.complement?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                editable
                value={value}
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
            render={({ field: { value, onBlur, onChange } }) => (
              <Input.InputText 
                keyboardType="default" 
                placeholder='Informe o bairro...'
                containerStyle={{ borderColor: errors.address?.neighborhood?.message 
                  ? theme.colors.accent 
                  : theme.colors.shape 
                }}
                editable
                value={value}
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
              render={({ field: { value, onBlur, onChange } }) => (
                <Input.InputText 
                  keyboardType="default" 
                  placeholder='Informe a cidade...'
                  containerStyle={{ borderColor: errors.address?.city?.message 
                    ? theme.colors.accent 
                    : theme.colors.shape 
                  }}
                  editable
                  value={value}
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
              render={({ field: { value, onBlur, onChange } }) => (
                <Input.InputText 
                  autoCapitalize="characters"
                  placeholder='Ex: SP'
                  containerStyle={{ borderColor: errors.address?.provincy?.message 
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

        <Button 
          label="Cadastrar" 
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={handleSubmit(handleCreateClient)} 
          style={{ marginTop: 32 }} 
        />
      </ScrollView>
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