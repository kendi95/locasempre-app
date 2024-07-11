import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Input } from "@/components/Input";
import { Title } from "@/components/Title";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { DataLabel } from "@/components/DataLabel";
import { ItemPrice } from "@/components/ChooseItem";
import { DataWithPriceLabel } from "@/components/DataWithPriceLabel";

import { useToast } from '@/hooks/useToast'; 
import { GetFileService } from '@/apis/supabase/files/GetFileService';
import { GetOrderService } from '@/apis/supabase/orders/GetOrderService';
import { PayOrderService } from '@/apis/supabase/orders/PayOrderService';
import { CancelOrderService } from '@/apis/supabase/orders/CancelOrderService';
import { CollectOrderService } from '@/apis/supabase/orders/CollectOrderService';

const service = new GetOrderService()
const payService = new PayOrderService()
const cancelService = new CancelOrderService()
const collectService = new CollectOrderService()
const getFileService = new GetFileService()

type OrderDetailsProps = {
  order_id: string
  onResourceDone: () => void
}

type OrderData = {
  collectedAt: string;
  id: string;
  isCollected: boolean;
  status: "PENDING" | "PAID" | "CANCELED" | null;
  takenAt: string;
  totalAmountInCents: number;
  customers: { id: string; name: string },
  delivered_addresses: {  
    address: string;
    city: string;
    complement: string;
    id: string;
    neighborhood: string;
    numberAddress: number;
    provincy: string;
    zipcode: string;
    isDefaultAddress: boolean;
  },
  items_in_order: {
    items: {
      id: string;
      name: string;
      amountInCents: number;
    } | null
  }[]
}

export function OrderDetails({ order_id, onResourceDone }: OrderDetailsProps) {
  const { success, error } = useToast()
  const [images, setImages] = useState<{id: string, filename: string}[]>([])

  const { handleSubmit: handleCancelSubmit, formState: { isSubmitting: isCancelSubmitting } } = useForm()
  const { handleSubmit: handlePaySubmit, formState: { isSubmitting: isPaySubmitting } } = useForm()
  const { handleSubmit: handleCollectedSubmit, formState: { isSubmitting: isCollectedSubmitting } } = useForm()

  const { isFetching, data } = useQuery({
    queryKey: ['order', order_id],
    queryFn: fetchOrder,
  })

  const statusLabel = useMemo(() => {
    if (data?.status === 'PENDING') return 'Pendente'
    if (data?.status === 'PAID') return 'Pago'

    return 'Cancelado'
  }, [data?.status])

  const order = useMemo<OrderData>(() => {
    return {
      id: data?.id!,
      isCollected: data?.isCollected!,
      status: data?.status!,
      takenAt: dayjs(data?.takenAt!).format('DD/MM/YYYY'),
      collectedAt: dayjs(data?.collectedAt!).format('DD/MM/YYYY'),
      customers: data?.customers!,
      delivered_addresses: data?.delivered_addresses!,
      items_in_order: data?.items_in_order!,
      totalAmountInCents: data?.totalAmountInCents! / 100
    }
  }, [data])

  const items = useMemo<ItemPrice[]>(() => {
    if (!data?.items_in_order) return []

    return data?.items_in_order.map(({ items: item }) => {
      return {
        id: item?.id!,
        name: item?.name!,
        amount: item?.amountInCents! / 100
      }
    }) 
  }, [data?.items_in_order])

  const style = createStyleSheet((theme) => ({
    dateContainer: {
      width: '100%', 
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    },
  
    status: {
      width: data?.status?.length! + 72,
      backgroundColor: data?.status === 'PENDING' 
        ? theme.colors.shape 
        : data?.status === 'CANCELED'
          ? theme.colors.accent
          : theme.colors.primary ,
      borderRadius: theme.fonts.size.base,
      color: theme.colors.subTitle,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -24,
      paddingVertical: 4,
      paddingHorizontal: 8
    }
  }))

  const { theme, styles } = useStyles(style)

  async function fetchOrder() {
    const order = await service.execute({ order_id })

    setImages([])

    order?.images_in_order.forEach(async ({ images }) => {
      const { imageURL } = await getFileService.execute({
        bucketName: 'orders',
        filename: images?.filename!
      })

      setImages((oldImages) => [...oldImages, { id: images?.id!, filename: imageURL }])
    })

    return order
  }

  async function handleCancelOrder() {
    try {
      await cancelService.execute(order_id)

      success({
        message: 'Pedido cancelado!',
        duration: 5000,
        position: 2
      })

      onResourceDone()
    } catch (err) {
      error({
        message: err.message,
        duration: 4000,
        position: 2
      })
    }
  }

  async function handlePayOrder() {
    try {
      await payService.execute(order_id)

      success({
        message: 'Pedido pago!',
        duration: 5000,
        position: 2
      })

      onResourceDone()
    } catch (err) {
      error({
        message: err.message,
        duration: 4000,
        position: 2
      })
    }
  }

  async function handleCollectedOrder() {
    try {
      await collectService.execute(order_id)

      success({
        message: 'Ítens coletados!',
        duration: 5000,
        position: 2
      })

      await fetchOrder()
    } catch (err) {
      error({
        message: err.message,
        duration: 4000,
        position: 2
      })
    }
  }
    
  return (
    <Container
      style={{
        alignItems: 'flex-start',
        paddingBottom: 8,
        paddingTop: 0,
        width: '100%',
        backgroundColor: theme.colors.background,
        gap: 8
      }}
    >
      {isFetching || !data ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}> 
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <DataLabel label="Cliente" content={order?.customers?.name} />
          <DataLabel 
            label="Endereço de entrega" 
            content={`${order?.delivered_addresses?.address}, ${order?.delivered_addresses?.numberAddress}, ${order?.delivered_addresses?.neighborhood} - ${order?.delivered_addresses?.city}/${order?.delivered_addresses?.provincy}`}
          />
    
          <View style={styles.dateContainer}>
            <DataLabel label="Data de retirada" content={order?.takenAt} />
            <DataLabel label="Data de coleta" content={order?.collectedAt} />
          </View> 
    
          <DataWithPriceLabel 
            items={items} 
            label="Itens selecionados" 
            subTotal={order?.totalAmountInCents}
          />
    
          <View style={styles.dateContainer}>
            <View style={{ width: 'auto', gap: 4 }}>
              <DataLabel label="Status do pedido" />
              <Title label={statusLabel} size="xs" style={styles.status} />
            </View>

            <DataLabel label="Foi coletado?" content={order?.isCollected ? 'Sim' : 'Não'} />
          </View>
    
          <DataLabel label="Imagens (opcional)" content={`${images.length} foto(s) inserido(s)`} />
          <ScrollView horizontal contentContainerStyle={{ gap: 4 }}>
            {images.length > 0 && images.map((image) => (
              <Input.ImageCard 
                key={image.id}
                size="xl" 
                source={{ uri: image.filename }} 
              />
            ))}
          </ScrollView>

          {!order?.isCollected && (
            <Button 
              label="Coletar os ítens" 
              disabled={isCollectedSubmitting}
              loading={isCollectedSubmitting}
              style={{ backgroundColor: theme.colors.shape }} 
              onPress={handleCollectedSubmit(handleCollectedOrder)}
            />
          )}
          
          {order?.status === 'PENDING' && (
            <>
              <Button 
                label="Cancelar pedido" 
                disabled={isCancelSubmitting}
                loading={isCancelSubmitting}
                style={{ backgroundColor: theme.colors.accent }} 
                onPress={handleCancelSubmit(handleCancelOrder)}
              />
              <Button 
                label="Realizar pagamento" 
                disabled={isPaySubmitting}
                loading={isPaySubmitting}
                onPress={handlePaySubmit(handlePayOrder)}
              />
            </>
          )}
        </>
      )}
    </Container>
  )
}

