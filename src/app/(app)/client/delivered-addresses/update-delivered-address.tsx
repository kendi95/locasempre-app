import { custom, z } from "zod";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStyleSheet } from "react-native-unistyles";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Title } from "@/components/Title";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";

import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { fetchCEP } from "@/apis/brasilapi/fetchCEP";
import { GetDeliveredAddressByCustomerService } from "@/apis/supabase/delivered_addresses/GetDeliveredAddressByCustomerService";
import { UpdateDeliveredAddressService } from "@/apis/supabase/delivered_addresses/UpdateDeliveredAddressService";

const schemaData = z.object({
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
})

type FormData = z.infer<typeof schemaData>

const service = new GetDeliveredAddressByCustomerService()
const updateService = new UpdateDeliveredAddressService()

export default function UpdateDeliveredAddress() {
  const { goBack } = useNavigation()
  const { success, error } = useToast()
  const { handleSwipeDrawer } = useApp()
  const { styles, theme } = useStyles(style)
  const { customer_id } = useLocalSearchParams()
  const [loadData, setLoadData] = useState(false)
  const [loadZipCode, setLoadZipCode] = useState(false)

  const { handleSubmit, control, formState: { isSubmitting }, setValue, getValues, reset } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  async function handleFetchDeliveredAddress() {
    try {
      setLoadData(true)

      const data = await service.execute({ customer_id: String(customer_id) })

      reset({
        address: data?.address,
        city: data?.city,
        complement: data?.complement,
        neighborhood: data?.neighborhood,
        numberAddress: String(data?.numberAddress || '0'),
        provincy: data?.provincy,
        zipcode: data?.zipcode
      })
    } catch (error) {
      
    } finally {
      setLoadData(false)
    }
  }

  async function handleFetchCEP() {
    try {
      setLoadZipCode(true)

      const { zipcode } = getValues()
      const response = await fetchCEP(zipcode);

      setValue("address", response.street)
      setValue("neighborhood", response.neighborhood)
      setValue("provincy", response.state)
      setValue("city", response.city)
    } catch (err: any) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
      })
    } finally {
      setLoadZipCode(false)
    }
  }

  async function handleUpdateDeliveredAddress(data: FormData) {
    try {
      await schemaData.parseAsync(data)

      await updateService.execute(String(customer_id), {
        ...data,
        numberAddress: Number(data.numberAddress)
      })

      reset({
        address: '',
        city: '',
        provincy: '',
        complement: '',
        neighborhood: '',
        numberAddress: '0',
        zipcode: ''
      })

      success({
        message: 'Endereço de entrega cadastrado com sucesso!',
        duration: 5000,
        position: 2
      })

      goBack()
    } catch (err) {
      error({
        message: err.message,
        duration: 4000,
        position: 2
      })
    }
    
  }

  useEffect(() => {
    handleSwipeDrawer(false)
  }, [])

  useEffect(() => {
    if (customer_id) {
      handleFetchDeliveredAddress()
    }
  }, [customer_id])

  return (
    <Container
      style={{
        alignItems: 'flex-start',
        paddingTop: 48,
        paddingBottom: 8,
        paddingHorizontal: 24,
        width: '100%'
      }}
    >
      <View style={styles.headerContainer}>
        <DrawerMenu backButton />
        <Title label="Atualização de endereço" size="lg" style={{ textAlign: 'left' }} />
      </View>

      {loadData ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <ActivityIndicator color={theme.colors.title} size="large" />
        </View>
      ) : (

        <Form style={{ flex: 1 }}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            style={{ backgroundColor: theme.colors.background }}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 8, backgroundColor: theme.colors.background }}
          >
            <View style={styles.horizontal}>
              <Input.Container label="CEP" style={{ width: '68%' }}>
                <Controller 
                  control={control}
                  name="zipcode"
                  render={({ field: { value, onBlur, onChange } }) => (
                    <Input.InputMask 
                      keyboardType="decimal-pad" 
                      placeholder='CEP...'
                      mask={[/\d/, /\d/, /\d/,  /\d/,  /\d/, '-', /\d/, /\d/, /\d/]}
                      returnKeyType="search"
                      editable
                      loading={loadZipCode}
                      value={value}
                      onChangeText={(masked) => onChange(masked)}
                      onEndEditing={handleFetchCEP}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Input.Container>

              <Input.Container label="Número" style={{ width: '30%' }}>
                <Controller 
                  control={control}
                  name="numberAddress"
                  render={({ field: { value, onBlur, onChange } }) => (
                    <Input.InputText 
                      keyboardType="number-pad" 
                      placeholder='Número...'
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

            <Input.Container label="Endereço">
              <Controller 
                control={control}
                name="address"
                render={({ field: { value, onBlur, onChange } }) => (
                  <Input.InputText 
                    keyboardType="default" 
                    placeholder='Informe o endereço completo...'
                    editable
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
            </Input.Container>

            <Input.Container label="Complemento">
              <Controller 
                control={control}
                name="complement"
                render={({ field: { value, onBlur, onChange } }) => (
                  <Input.InputText 
                    keyboardType="default" 
                    placeholder='Informe o complemento...'
                    editable
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
            </Input.Container>

            <Input.Container label="Bairro">
              <Controller 
                control={control}
                name="neighborhood"
                render={({ field: { value, onBlur, onChange } }) => (
                  <Input.InputText 
                    keyboardType="default" 
                    placeholder='Informe o bairro...'
                    editable
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
            </Input.Container>

            <View style={styles.horizontal}>
              <Input.Container label="Cidade" style={{ width: '72%' }}>
                <Controller 
                  control={control}
                  name="city"
                  render={({ field: { value, onBlur, onChange } }) => (
                    <Input.InputText 
                      keyboardType="default" 
                      placeholder='Informe a cidade...'
                      editable
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  )}
                />
              </Input.Container>

              <Input.Container label="Estado" style={{ width: '24%' }}>
                <Controller 
                  control={control}
                  name="provincy"
                  render={({ field: { value, onBlur, onChange } }) => (
                    <Input.InputText 
                      autoCapitalize="characters"
                      placeholder='Ex: SP'
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
              label="Salvar" 
              disabled={isSubmitting}
              loading={isSubmitting}
              onPress={handleSubmit(handleUpdateDeliveredAddress)} 
              style={{ marginTop: 32 }} 
            />
          </ScrollView>
        </Form>
      )}
    </Container>
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

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8
  },
}))