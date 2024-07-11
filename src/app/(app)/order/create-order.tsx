import { z } from 'zod';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { CameraCapturedPicture } from 'expo-camera';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BackHandler, ScrollView, useWindowDimensions, View } from "react-native";

import { Form } from '@/components/Form';
import { Title } from "@/components/Title";
import { Camera } from '@/components/Camera';
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";
import { CustomHandlerBottomSheet } from '@/components/CustomHandlerBottomSheet';

import { OrderData } from './order-data';
import { ConfirmData } from "./confirm-data";
import { CustomerData } from './customer-data';
import { ClientNewData } from './client-new-data';
import { DeliveredAddressNewData } from './delivered-address-new-data';

import { useApp } from '@/hooks/useApp';
import { useToast } from '@/hooks/useToast';
import { amountFormat } from '@/utils/amountFormat';
import { DeliveredAddresses } from '@/apis/supabase/delivered_addresses/GetDeliveredAddressesByCustomerService';
import { CreateOrderService } from '@/apis/supabase/orders/CreateOrderService';

const schemaData = z.object({
  customer: z.object({
    id: z.string(),
    name: z.string()
  }),
  totalAmountInCents: z.number(),
  takeAt: z.date(),
  collectedAt: z.date(),
  deliveredaddress: z.object({
    address: z.string(),
    city: z.string(),
    complement: z.string(),
    id: z.string(),
    neighborhood: z.string(),
    numberAddress: z.number(),
    provincy: z.string(),
    zipcode: z.string(),
  }),
  items: z.array(
    z.object({
      id: z.string({ message: 'Id do ítem obrigatório.' }),
      name: z.string(),
      amount: z.number()
    })
  )
})

export type FormData = z.infer<typeof schemaData>

const createOrderService = new CreateOrderService()

export default function CreateOrder() {
  const { back } = useRouter()
  const { handleSwipeDrawer } = useApp()
  const { success, error } = useToast()
  const { height } = useWindowDimensions()
  const { theme, styles } = useStyles(style);
  const bottomSheetRef = useRef<BottomSheet>(null)
  const customerBottomSheet = useRef<BottomSheet>(null)
  const [files, setFiles] = useState<CameraCapturedPicture[]>([])
  const createNewDeliveredAddressBottomSheetRef = useRef<BottomSheet>(null)

  const [submitting, setSubmitting] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  const { getValues, control, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schemaData),
    defaultValues: {
      totalAmountInCents: 0
    }
  })

  const enabledButtonVerifyOrder = useMemo(() => {
    if (
      watch('collectedAt') !== undefined && watch('takeAt') !== undefined &&
      watch('totalAmountInCents') !== undefined && watch('customer') !== undefined &&
      watch('deliveredaddress') !== undefined && watch('items') !== undefined
    ) {
      return false
    }

    return true
  }, [
    watch('collectedAt'), watch('takeAt'), watch('deliveredaddress'),
    watch('totalAmountInCents'), watch('customer'), watch('items')
  ])

  function handleVerifyOrder() {
    bottomSheetRef.current?.expand();
  }

  function handleShowCreateNewCustomerBottomSheet() {
    customerBottomSheet.current?.expand()
  }

  function handleCloseBottomSheet() {
    bottomSheetRef.current?.close()
  }

  function handleCloseCustomerBottomSheet() {
    customerBottomSheet.current?.close()
  }

  function handleShowDeliveredAddress() {
    createNewDeliveredAddressBottomSheetRef.current?.expand()
  }

  function handleCloseDeliveredAddress() {
    createNewDeliveredAddressBottomSheetRef.current?.close()
  }

  function handleSelectedDeliveredAddress(address: DeliveredAddresses) {
    setValue('deliveredaddress.id', address.id)
    setValue('deliveredaddress.address', address.address)
    setValue('deliveredaddress.city', address.city)
    setValue('deliveredaddress.complement', address.complement)
    setValue('deliveredaddress.neighborhood', address.neighborhood)
    setValue('deliveredaddress.numberAddress', address.numberAddress)
    setValue('deliveredaddress.provincy', address.provincy)
  }

  function handleSubTotal(subtotal: string) {
    const subTotal = amountFormat(subtotal, 'USD')
    setValue('totalAmountInCents', Number(subTotal) * 100)
  }

  function handleTakePicture(file: CameraCapturedPicture) {
    setFiles(oldFiles => [...oldFiles, file])
  }

  function handleRemoveFile(index: number) {
    setFiles((oldFiles) => {
      const newFiles = oldFiles.filter((file, ind) => ind !== index)
      return newFiles
    })
  }

  async function handleConfirm() {
    try {
      setSubmitting(true)

      const data = getValues()

      await createOrderService.execute({
        customerId: data.customer.id,
        collectedAt: data.collectedAt,
        takenAt: data.takeAt,
        deliveryAddressId: data.deliveredaddress.id,
        items: data.items,
        files,
        totalAmountInCents: data.totalAmountInCents > 0 
          ? data.totalAmountInCents 
          : (data.items?.reduce((prev, value) => {
              return prev = prev + value.amount
            }, 0) * 100)
      })

      success({
        message: 'Pedido criado com sucesso!',
        duration: 4000,
        position: 2
      })

      bottomSheetRef.current?.close()

      back()
    } catch (err) {
      error({
        message: err.message,
        duration: 5000,
        position: 1
      })
    } finally {
      setSubmitting(false)
    }
  }

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
            width: '100%'
          }}
        >
          <View style={styles.headerContainer}>
            <DrawerMenu backButton />
            <Title label="Cadastro de novo pedido" size="xl" style={{ textAlign: 'left' }} />
          </View>

          <Form style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8, width: '100%' }}>
              <CustomerData
                control={control}
                customerId={watch('customer')?.id}
                onCreateNewDeliveredAddress={handleShowDeliveredAddress}
                onCreateNewCustomer={handleShowCreateNewCustomerBottomSheet}
                onSelectedDeliveredddress={handleSelectedDeliveredAddress}
              />

              <OrderData 
                control={control} 
                files={files} 
                onShowCamera={() => setShowCamera(true)} 
                onRemoveImage={handleRemoveFile}
              />
            </ScrollView>
          </Form>

          <Button
            label="Verificar o pedido"
            disabled={enabledButtonVerifyOrder}
            onPress={handleVerifyOrder}
          />
        </Container>
      )}

      <BottomSheet
        ref={customerBottomSheet}
        snapPoints={[0.01, height]}
        handleIndicatorStyle={styles.handleIndicator}
        handleComponent={() => <CustomHandlerBottomSheet onPress={handleCloseCustomerBottomSheet} />}
        backgroundStyle={styles.containerStyle}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
      >
        <BottomSheetScrollView
          style={styles.sheetContainer}
          contentContainerStyle={{ flex: 1 }}
        >
          <ClientNewData onCreatedNewData={handleCloseCustomerBottomSheet} />
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet
        ref={createNewDeliveredAddressBottomSheetRef}
        snapPoints={[0.01, height]}
        handleIndicatorStyle={styles.handleIndicator}
        handleComponent={() => <CustomHandlerBottomSheet onPress={handleCloseDeliveredAddress} />}
        backgroundStyle={styles.containerStyle}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
      >
        <BottomSheetScrollView
          style={styles.sheetContainer}
          contentContainerStyle={{ flex: 1 }}
        >
          <DeliveredAddressNewData
            customerId={watch('customer.id')}
            onCreatedNewData={handleCloseDeliveredAddress}
          />
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[0.01, height]}
        handleIndicatorStyle={styles.handleIndicator}
        handleComponent={() => <CustomHandlerBottomSheet onPress={handleCloseBottomSheet} />}
        backgroundStyle={styles.containerStyle}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
      >
        <BottomSheetScrollView
          style={styles.sheetContainer}
          contentContainerStyle={{ flex: 1 }}
        >
          <ConfirmData
            customerName={watch('customer.name')}
            takedAt={dayjs(watch('takeAt')).format('DD/MM/YYYY')}
            collectedAt={dayjs(watch('collectedAt')).format('DD/MM/YYYY')}
            address={`${watch('deliveredaddress')?.address}, ${watch('deliveredaddress')?.numberAddress}, ${watch('deliveredaddress')?.neighborhood} - ${watch('deliveredaddress')?.city}/${watch('deliveredaddress')?.provincy}`}
            items={watch('items')}
            onSubTotal={handleSubTotal}
            imageCount={files.length}
            buttonElement={
              <Button
                label="Confirmar o pedido"
                disabled={submitting}
                loading={submitting}
                style={{ position: 'absolute', bottom: 16, right: 32, left: 32 }}
                onPress={handleConfirm}
              />
            }
          />
        </BottomSheetScrollView>
      </BottomSheet>
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

  sheetContainer: {
    flex: 1,
    zIndex: 50,
    backgroundColor: theme.colors.bottomSheet
  },
  handleIndicator: {
    width: 0
  },
  containerStyle: {
    backgroundColor: theme.colors.bottomSheet,
    opacity: 0.9
  },

  customHandleContainer: {
    flexDirection: 'row-reverse',
    width: '100%',
    paddingHorizontal: theme.fonts.size.base,
    paddingVertical: theme.fonts.size.base / 2,
    backgroundColor: theme.colors.background
  },

  customHandleCloseButton: {
    padding: theme.fonts.size.base / 2,
    borderRadius: theme.fonts.size.base * 2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  dateContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },


}))
