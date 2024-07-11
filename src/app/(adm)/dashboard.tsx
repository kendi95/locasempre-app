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

import { jwtMiddleware } from "@/apis/supabase/auth/jwtMiddleware";
import { GetMetricsAdministratorService } from "@/apis/supabase/metrics/GetMetricsAdministratorService";

const service = new GetMetricsAdministratorService()

export default function Dashboard() {
  const { replace } = useRouter()
  const { styles } = useStyles(style)
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const { isFetching, data, refetch } = useQuery({
    queryKey: ['metrics-dashboard'],
    queryFn: fetchMetrics,
    enabled: false
  })

  async function fetchMetrics() {
    const data = await service.execute()
    return data
  }

  useEffect(() => {
    jwtMiddleware().then((data) => {
      if (!data.status) {
        setShowAlert(true)
        setMessage('O acesso a plataforma foi expirado. Faça login novamente.')
      }
    })
  }, [jwtMiddleware])

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
          <MetricCard label="Usuários" value={String(data?.usersCount)} loadingData={isFetching} />
          <MetricCard label="Todos pedidos" value={String(data?.ordersCount)} loadingData={isFetching} />
        </View>

        <View style={styles.cardContainer}>
          <MetricCard label="Imagens" value={String(data?.imagesCount)} loadingData={isFetching} />
          <MetricCard label="Itens" value={String(data?.itemsCount)} loadingData={isFetching} />
        </View>

        <View style={styles.cardContainer}>
          <MetricCard label="Clientes" value={String(data?.customersCount)} loadingData={isFetching} />
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
    paddingBottom: 12
  },

  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8
  },
}))