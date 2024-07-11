import { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { ScrollView, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { CameraCapturedPicture } from 'expo-camera'

import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Title } from "@/components/Title";
import { Button } from "@/components/Button"
import { Camera } from "@/components/Camera";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";

import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { amountFormat } from "@/utils/amountFormat";

import { CreateItemService } from "@/apis/supabase/items/CreateItemService";

const schemaData = z.object({
  name: z.string({ message: 'Nome do ítem obrigatório.' }),
  amount: z.string({ message: 'Preço obrigatório.' }),
})

type FormData = z.infer<typeof schemaData>

const service = new CreateItemService()

export default function CreateItem() {
  const { theme, styles } = useStyles(style);
  const { handleSwipeDrawer } = useApp()
  const { goBack } = useNavigation()
  const { success, error } = useToast()
  const [showCamera, setShowCamera] = useState(false)
  const [file, setFile] = useState<CameraCapturedPicture | undefined>(undefined)

  const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(schemaData),
    defaultValues: {
      amount: '0,00'
    }
  })

  function handleOpenCamera() {
    setShowCamera(true)
  }

  function handleTakePicture(file: CameraCapturedPicture) {
    setFile(file)
  }

  async function handleCreateItem(data: FormData) {
    try {
      await schemaData.parseAsync(data)

      await service.execute({
        name: data.name,
        amountInCents: parseFloat(amountFormat(data.amount, 'USD')) * 100,
        file: file
      })

      reset({
        name: '',
        amount: '0,00'
      })

      success({
        message: 'Item criado com sucesso!',
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

    return () => handleSwipeDrawer(true)
  }, [])

  return (
    <>
      {showCamera ? (
        <Camera 
          isShow={showCamera} 
          onBackCamera={() => setShowCamera(false)}
          onTakePicture={handleTakePicture} 
        />
      ) : (
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
            <Title label="Cadastro de novo item" size="xl" style={{ textAlign: 'left' }} />
          </View>

          <Form style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }} contentContainerStyle={{ gap: 8, flex: 1 }}>
              <Input.Container label="Nome do item" errorMessage={errors.name?.message}>
                <Controller 
                  control={control}
                  name="name"
                  render={({ field: { value, onChange, onBlur }, formState: { errors } }) => (
                    <Input.InputText 
                      keyboardType="default" 
                      placeholder='Informe o nome do item...'
                      autoCapitalize="words"
                      containerStyle={{ borderColor: errors.name?.message ? theme.colors.accent : theme.colors.shape }}
                      editable
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />  
              </Input.Container>

              <Input.Container 
                label="Preço do item" 
                style={{ width:  '45%' }}
                errorMessage={errors.amount?.message}
              >
                <Controller 
                  control={control}
                  name="amount"
                  render={({ field: { value, onChange, onBlur }, formState: { errors } }) => (
                    <Input.InputText 
                      keyboardType="number-pad" 
                      placeholder='Informe o preço do item...'
                      style={{ textAlign: 'right' }}
                      editable
                      containerStyle={{ borderColor: errors.amount?.message ? theme.colors.accent : theme.colors.shape }}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(amountFormat(value))}
                    />
                  )}
                />
              </Input.Container>

              <Input.Container label="Imagem (opcional)" style={{ width: '100%' }}>
                <View style={styles.imageContainer}>
                  <Input.AddImage size="xl" onPress={handleOpenCamera} />
                  {file && (
                    <Input.ImageCard 
                      size="xl" 
                      source={{ uri: file.uri }} 
                    />
                  )}
                </View>
              </Input.Container>

              <Button 
                label="Cadastrar" 
                disabled={isSubmitting}
                loading={isSubmitting} 
                onPress={handleSubmit(handleCreateItem)} 
                style={{ position: 'absolute', bottom: 16 }} 
              />
            </ScrollView>
          </Form>
        </Container>
      )}
    </>
  )
}

const style = createStyleSheet((theme) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
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
  }
}))
