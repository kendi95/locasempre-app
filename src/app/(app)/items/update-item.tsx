import { z } from "zod";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CameraCapturedPicture } from "expo-camera";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ActivityIndicator, BackHandler, ScrollView, View } from "react-native";

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Title } from "@/components/Title";
import { Button } from "@/components/Button";
import { Camera } from "@/components/Camera";
import { Container } from "@/components/Container";
import { DataLabel } from "@/components/DataLabel";
import { DrawerMenu } from "@/components/DrawerMenu";

import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { amountFormat } from "@/utils/amountFormat";
import { currencyFormat } from "@/utils/currencyFormat";
import { GetItemService } from "@/apis/supabase/items/GetItemService";
import { UpdateItemService } from "@/apis/supabase/items/UpdateItemService";
import { GetFileService } from "@/apis/supabase/files/GetFileService";

const service = new GetItemService()
const updateService = new UpdateItemService()
const getFileService = new GetFileService()

const schemaData = z.object({
  name: z.string({ message: 'Nome obrigatório.' }),
  amount: z.string({ message: 'Preço obrigatório.' }),
  isActive: z.boolean().default(true),
  imageURL: z.string()
})

type FormData = z.infer<typeof schemaData>

export default function UpdateItem() {
  const { goBack } = useNavigation()
  const { normal, success, error } = useToast()
  const { handleSwipeDrawer } = useApp()
  const { item_id } = useLocalSearchParams()
  const { theme, styles } = useStyles(style);
  const [createdAt, setCreatedAt] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [file, setFile] = useState<CameraCapturedPicture | undefined>(undefined)

  const { control, handleSubmit, setValue, reset, watch, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['item', item_id],
    mutationFn: fetchItemById,
  })

  async function handleUpdateItem(data: FormData) {
    try {
      await schemaData.parseAsync(data)

      await updateService.execute(String(item_id), {
        name: data.name,
        isActive: data.isActive,
        amountInCents: parseFloat(amountFormat(data.amount, 'USD')) * 100,
        file,
      })

      reset({
        name: '',
        isActive: false,
        amount: '0,00'
      })

      success({
        message: 'Item atualizado com sucesso!',
        duration: 5000,
        position: 1
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

  function handleTakePicture(file: CameraCapturedPicture) {
    setFile(file)
  }

  async function fetchItemById() {
    try {
      const item = await service.execute({ item_id: String(item_id) })

      if (item?.images) {
        const { imageURL } = await getFileService.execute({
          bucketName: 'items',
          filename: item?.images?.filename!
        })

        setValue('imageURL', imageURL)
      }

      setValue('name', item?.name!)
      setValue('isActive', item?.isActive!)
      setValue('amount', currencyFormat(Number(item?.amountInCents) / 100, 'pt-BR', false))
      

      setCreatedAt(dayjs(item?.createdAt).format('DD/MM/YYYY'))
      setUpdatedAt(dayjs(item?.updatedAt).format('DD/MM/YYYY'))

      normal({
        message: 'Dados obtidos.',
        duration: 5000,
        position: 2
      })
    } catch (err) {
      error({
        message: err.message,
        duration: 5000,
        position: 2
      })
    }
    
  }

  useEffect(() => {
    mutate()
  }, [item_id])

  useEffect(() => {
    handleSwipeDrawer(false)

    return () => handleSwipeDrawer(true)
  }, [])

  useEffect(() => {
    const subscriber = BackHandler.addEventListener('hardwareBackPress', () => {
      return false
    })

    return () => subscriber.remove()
  }, [])

  return (
    <>
      {!showCamera 
        ? (
          <Container
            style={{
              alignItems: 'flex-start',
              paddingTop: 48,
              paddingBottom: 8,
              width: '100%',
            }}
          >
            <View style={styles.headerContainer}>
              <DrawerMenu backButton />
              <Title label="Atualização do item" size="xl" style={{ textAlign: 'left' }} />
            </View>

            {isPending ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <ActivityIndicator color={theme.colors.title} size="large" />
              </View>
            ) : (
              <Form style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }} contentContainerStyle={{ gap: 8, flex: 1 }}>
                  <Input.Container label="Nome do item" errorMessage={errors.name?.message}>
                    <Controller 
                      control={control}
                      name="name"
                      render={({ field: { value, onBlur, onChange } }) => (
                        <Input.InputText 
                          keyboardType="default" 
                          placeholder='Informe o nome do item...'
                          autoCapitalize="words"
                          editable
                          containerStyle={{ borderColor: errors.name?.message 
                            ? theme.colors.accent 
                            : theme.colors.shape 
                          }}
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                        />
                      )}
                    />
                  </Input.Container>

                  <View style={styles.horizontal}>
                    <Input.Container 
                      label="Preço do item" 
                      style={{ width: '48%' }}
                      errorMessage={errors.amount?.message}
                    >
                      <Controller 
                        control={control}
                        name="amount"
                        render={({ field: { value, onBlur, onChange } }) => (
                          <Input.InputText 
                            keyboardType="number-pad" 
                            placeholder='Informe o preço do item...'
                            style={{ textAlign: 'right' }}
                            editable
                            containerStyle={{ borderColor: errors.amount?.message 
                              ? theme.colors.accent 
                              : theme.colors.shape 
                            }}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                          />
                        )}
                      />
                    </Input.Container>

                    <Input.Container 
                      label="Status" 
                      style={{ width: '36%' }}
                    >
                      <Controller 
                        control={control}
                        name="isActive"
                        render={({ field: { value, onChange } }) => (
                          <Input.CheckBox 
                            isChecked={value} 
                            label={value ? 'Ativado' : 'Desativado'} 
                            onChange={onChange} 
                          />
                        )}
                      />
                    </Input.Container>
                  </View>

                  <Input.Container label="Imagem (opcional)" style={{ width: '100%' }}>
                    <View style={styles.imageContainer}>
                      <Input.AddImage size="xl" onPress={() => setShowCamera(true)} />

                      {watch('imageURL') !== undefined && file?.uri === undefined ? (
                        <Input.ImageCard size="xl" source={{ uri: watch('imageURL') }} />
                      ) : watch('imageURL') !== undefined && file?.uri !== undefined ? (
                        <Input.ImageCard size="xl" source={{ uri: file?.uri }} />
                      ) : <></>}
                    </View>
                  </Input.Container>

                  <View style={styles.horizontal}>
                    <DataLabel label="Criado à" content={createdAt} />
                    <DataLabel label="Atualizado à" content={updatedAt} />
                  </View>

                  <Button 
                    label="Salvar" 
                    disabled={isSubmitting}
                    loading={isSubmitting} 
                    onPress={handleSubmit(handleUpdateItem)} 
                    style={{ position: 'absolute', bottom: 16 }} 
                  />
                </ScrollView>
              </Form>
            )}
          </Container>
        ) 
        : (
          <Camera 
            isShow={showCamera} 
            onBackCamera={() => setShowCamera(false)}
            onTakePicture={handleTakePicture} 
          />
        )
      }
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  }
}))