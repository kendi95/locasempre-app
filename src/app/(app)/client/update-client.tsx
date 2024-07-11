import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronRight, Phone } from "lucide-react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "@/components/Title";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";

import { UpdateClientData } from "./update-client-data";
import { UpdateAddressData } from "./update-address-data";

import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { fetchCEP } from "@/apis/brasilapi/fetchCEP";
import { GetCustomerService } from "@/apis/supabase/customers/GetCustomerService";
import { UpdateCustomerService } from "@/apis/supabase/customers/UpdateCustomerService";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

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

export type FormData = z.infer<typeof schemaData>

const service = new GetCustomerService()
const updateService = new UpdateCustomerService()

export default function UpdateClient() {
  const { setParams } = useRouter()
  const { handleSwipeDrawer } = useApp()
  const { client_id } = useLocalSearchParams()
  const { theme, styles } = useStyles(style);
  const { goBack, navigate } = useNavigation()
  const { error, normal, success } = useToast()

  const { control, handleSubmit, formState: { isSubmitting }, reset, getValues, setValue } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  const { isPending, mutate } = useMutation({
    mutationKey: ['customer', client_id],
    mutationFn: fetchCustomerById
  })

  const { mutate: mutateAddress, isPending: isPendingAddress } = useMutation({
    mutationKey: ['customer-address'],
    mutationFn: handleFetchZipCode
  })

  async function handleUpdateClient(data: FormData) {
    try {
      await schemaData.parseAsync(data)

      await updateService.execute(String(client_id), {
        ...data,
        address: {
          ...data.address,
          numberAddress: Number(data.address.numberAddress)
        }
      })

      success({
        message: 'Dados atualizados com sucesso!',
        duration: 5000,
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

  function handleVisualizeOrder() {
    navigate('visualize-order' as never)
    setParams({ customer_id: String(client_id) })
  }

  function handleVisualizeDeliveredAddress() {
    navigate('delivered-addresses/index' as never)
    setParams({ customer_id: String(client_id) })
  }

  async function fetchCustomerById() {
    try {
      const customer = await service.execute({ customer_id: String(client_id) })
      
      reset({
        name: customer?.name,
        cpf: customer?.cpf,
        phone: customer?.phone,
        address: {
          ...customer?.addresses,
          numberAddress: String(customer?.addresses?.numberAddress)
        }
      })

      normal({
        message: 'Dados obtidos com sucesso!',
        duration: 5000,
        position: 2
      })
    } catch (err) {
      error({
        message: err?.message,
        position: 2,
        duration: 4000
      })
    } 
    
  }

  async function handleFetchZipCode() {
    try {
      const { address: { zipcode } } = getValues()
      const response = await fetchCEP(zipcode);

      setValue("address.address", response.street)
      setValue("address.neighborhood", response.neighborhood)
      setValue("address.provincy", response.state)
      setValue("address.city", response.city)
    } catch (err) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
      })
    }
  }

  useEffect(() => {
    if (client_id) {
      mutate()
    }
  }, [client_id])

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
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <UpdateClientData control={control} />
            <UpdateAddressData 
              control={control} 
              onFetchZipCode={() => mutateAddress()} 
              loadingSearchZipCode={isPendingAddress}
            />

            <Pressable 
              style={styles.orderButton} 
              android_ripple={{ borderless: false }}
              onPress={handleVisualizeOrder}
            >
              <Title label="Visualizar os pedidos" size="sm" />
              <ChevronRight size={14} color={theme.colors.title} />
            </Pressable>

            <Pressable 
              style={[styles.orderButton, { marginTop: -8 }]} 
              android_ripple={{ borderless: false }}
              onPress={handleVisualizeDeliveredAddress}
            >
              <Title label="Visualizar os endereços de entrega" size="sm" />
              <ChevronRight size={14} color={theme.colors.title} />
            </Pressable>

            <Button 
              label="Salvar" 
              disabled={isSubmitting}
              loading={isSubmitting}
              onPress={handleSubmit(handleUpdateClient)} 
              style={{ marginTop: 32 }} 
            />
          </ScrollView>
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
    marginBottom: 8
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.fonts.size.base,
    paddingVertical: theme.fonts.size.xs,
    borderRadius: theme.fonts.size.base / 2,
    borderWidth: 1,
    borderColor: theme.colors.shape,
    marginVertical: theme.fonts.size.base
  }
}))