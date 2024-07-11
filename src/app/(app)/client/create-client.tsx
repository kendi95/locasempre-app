import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigation } from "expo-router";
import { ScrollView, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "@/components/Title";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";

import { ClientData } from "./client-data";
import { AddressData } from "./address-data";

import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { fetchCEP } from "@/apis/brasilapi/fetchCEP";

import { CreateCustomerService } from "@/apis/supabase/customers/CreateCustomerService";

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

const service = new CreateCustomerService()

export default function CreateClient() {
  const { goBack } = useNavigation()
  const { styles } = useStyles(style);
  const { error, success } = useToast()
  const { handleSwipeDrawer } = useApp()

  const { control, handleSubmit, formState: { isSubmitting }, reset, getValues, setValue } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

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

      goBack()
    } catch (err) {
      error({
        message: err?.message,
        duration: 4000,
        position: 2
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
          <Title label="Cadastro de novo cliente" size="xl" style={{ textAlign: 'left' }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <ClientData control={control} />
          <AddressData control={control} onFetchZipCode={handleFetchZipCode} />

          <Button 
            label="Cadastrar" 
            disabled={isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmit(handleCreateClient)} 
            style={{ marginTop: 32 }} 
          />
        </ScrollView>
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
}))
