import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Input } from "@/components/Input";
import { Title } from "@/components/Title";
import { Container } from "@/components/Container";
import { DataLabel } from "@/components/DataLabel";
import { ItemPrice } from "@/components/ChooseItem";
import { DataWithPriceLabel } from "@/components/DataWithPriceLabel";

import { GetOrderService } from '@/apis/supabase/orders/GetOrderService';
import { GetFileService } from '@/apis/supabase/files/GetFileService';

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

type OderDetailsProps = {
  order_id: string
}

const service = new GetOrderService()
const getFileService = new GetFileService()

export function OderDetails({ order_id }: OderDetailsProps) {
  const [images, setImages] = useState<{id: string; filename: string}[]>([])

  const { isFetching, data } = useQuery({
    queryKey: ['order-details', order_id],
    queryFn: fetchOrder
  })

  const order = useMemo(() => {
    if (!data) {
      return null
    }

    return {
      id: data.id,
      isCollected: data.isCollected,
      status: data.status,
      takenAt: dayjs(data.takenAt).format('DD/MM/YYYY'),
      collectedAt: dayjs(data.collectedAt).format('DD/MM/YYYY'),
      customers: data.customers,
      delivered_addresses: data.delivered_addresses,
      items_in_order: data.items_in_order,
      totalAmountInCents: data.totalAmountInCents / 100
    } as OrderData
  }, [data])

  const items = useMemo(() => {
    return data?.items_in_order.map<ItemPrice>((item) => {
      return {
        id: item?.items?.id,
        name: item?.items?.name,
        amount: item?.items?.amountInCents! / 100
      }
    }) || []
  }, [data])

  const style = createStyleSheet((theme) => ({
    dateContainer: {
      width: '100%', 
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
  
    status: {
      width: order?.status?.length! + 72,
      backgroundColor: order?.status === 'PENDING' 
        ? theme.colors.shape 
        : order?.status === 'CANCELED'
          ? theme.colors.accent
          : theme.colors.primary,
      borderRadius: theme.fonts.size.base,
      color: theme.colors.subTitle,
      marginTop: -24,
      paddingVertical: 4,
      paddingHorizontal: 8
    }
  }))

  const { theme, styles } = useStyles(style)

  const statusLabel = useMemo(() => {
    if (order?.status === 'PENDING') return 'Pendente'
    if (order?.status === 'PAID') return 'Pago'

    return 'Cancelado'
  }, [order?.status])

  async function fetchOrder() {
    const order = await service.execute({ order_id })

    order?.images_in_order.forEach(async ({ images }) => {
      const { imageURL } = await getFileService.execute({
        bucketName: 'orders',
        filename: images?.filename!
      })

      setImages((oldImages) => [...oldImages, { id: images?.id!, filename: imageURL }])
    })

    return order
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
      {isFetching || !order ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}> 
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
          <DataLabel label="Cliente" content={order?.customers.name} />

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
            {images && images.map((image) => (
              <Input.ImageCard 
                key={image.id}
                size="xl" 
                source={{ uri: image.filename }}
              />
            ))}
          </ScrollView>
        </ScrollView>
      )}
    </Container>
  )
}

