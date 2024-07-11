import { useRouter } from "expo-router";
import { Keyboard, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "@/components/Title";
import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";
import { MetricCard } from "@/components/MetricCard";

import { scheduleNotification } from "@/libs/notifications";
import { jwtMiddleware } from "@/apis/supabase/auth/jwtMiddleware";
import { GetMetricsUserService } from "@/apis/supabase/metrics/GetMetricsUserService";
import { GetCountCollectedOrdersService } from "@/apis/supabase/orders/GetCountCollectedOrdersService";

const service = new GetMetricsUserService()
const getCountOrdersService = new GetCountCollectedOrdersService()

export default function Home() {
  const { replace } = useRouter()
  const { styles } = useStyles(style)
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const { isFetching, data, refetch } = useQuery({
    queryKey: ['metrics-home'],
    queryFn: fetchMetrics,
    enabled: false
  })

  async function fetchMetrics() {
    const data = await service.execute()
    return data
  }

  async function fetchCountCollectedOrders() {
    const { count, expiredCollected, noExpiredCollected } = await getCountOrdersService.execute()

    const title = count > 0 ? 'Contém pedidos não coletados' : 'Não contém pedidos não coletados'
    const body = count > 0 
      ? `Contém ${count} pedidos não coletados, sendo que ${noExpiredCollected} pedidos não expirou da data de coleta e ${expiredCollected} foram expirados.` 
      : 'Não há pedidos não coletados.'

    await scheduleNotification({
      content: {
        title,
        body,
        vibrate: [300, 500],
        launchImageName: 'notification-icon',
        data: {
          url: 'order'
        }
      },
      trigger: {
        seconds: 10
      }
    })
  }

  useEffect(() => {
    jwtMiddleware().then((data) => {
      if (!data.status) {
        setShowAlert(true)
        setMessage('O acesso a plataforma foi expirado. Faça login novamente.')
      }
    })
  }, [jwtMiddleware])

  useEffect(() => {
    fetchCountCollectedOrders()
  }, [])

  useFocusEffect(useCallback(() => {
    refetch()
  }, []))

  return (
    <>
      <Alert 
        isActive={showAlert}
        message={message}
        onOK={() => replace('/')} 
      />

      <Container
        onTouch={Keyboard.dismiss}
        style={{
          alignItems: 'flex-start',
          paddingTop: 48,
          width: '100%'
        }}
      >
        <View style={styles.headerContainer}>
          <DrawerMenu />
          <Title label="Principal" size="lg" style={{ textAlign: 'left', fontSize: 28 }} />
        </View>

        <View style={styles.cardContainer}>
          <MetricCard label="Clientes" value={String(data?.customersCount)} loadingData={isFetching} />
          <MetricCard label="Todos pedidos" value={String(data?.ordersCount)} loadingData={isFetching} />
        </View>

        <View style={styles.cardContainer}>
          <MetricCard label="Ítens" value={String(data?.itemsCount)} loadingData={isFetching} />
        </View>
        
      </Container>
    </>
  )
}

const style = createStyleSheet((theme) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16
  },

  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8
  },
}))