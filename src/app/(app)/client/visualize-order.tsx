import { Plus } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import BottomSheet, { BottomSheetScrollView } from  '@gorhom/bottom-sheet'
import { ActivityIndicator, FlatList, useWindowDimensions, View, RefreshControl } from "react-native";

import { Title } from "@/components/Title";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";
import { Pagination } from "@/components/Pagination";
import { OrderCard, OrderItem } from "@/components/OrderCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CustomHandlerBottomSheet } from "@/components/CustomHandlerBottomSheet";

import { OderDetails } from "./order-details";

import { useApp } from "@/hooks/useApp";
import { GetOrdersByCustomerService } from "@/apis/supabase/orders/GetOrdersByCustomerService";

const getOrders = new GetOrdersByCustomerService()

type CustomOrderItem = OrderItem & {
  isCollected?: boolean
}

export default function VisualizeOrder() {
  const { navigate } = useRouter()
  const { handleSwipeDrawer } = useApp()
  const { height } = useWindowDimensions()
  const { theme, styles } = useStyles(style);
  const { customer_id } = useLocalSearchParams()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState('50')
  const [orderId, setOrderId] = useState('')

  const { isFetching, data, refetch } = useQuery({
    queryKey: ['visualize-order', customer_id],
    queryFn: handleFetchOrdersByCustomer
  })

  const orders = useMemo(() => {
    return data?.data?.map<CustomOrderItem>((order) => {
      return {
        id: order.id,
        clientName: '',
        status: order.status!,
        subtotal: order.totalAmountInCents / 100,
        isCollected: order.isCollected
      }
    }) || []
  }, [data?.data])

  function handleOpenOderDetails(order_id: string) {
    setOrderId(order_id)
    bottomSheetRef.current?.expand()
  }

  function handleCloseBottomSheet() {
    bottomSheetRef.current?.close()
  }

  function handleCreateOrder() {
    navigate('order/create-order' as never)
  }

  async function handleFetchOrdersByCustomer() {
    const data = await getOrders.execute({ 
      customer_id: String(customer_id),
      page
    })
    return data
  }

  useEffect(() => {
    handleSwipeDrawer(false)
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
          <Title label="Visualização de pedidos" size="xl" style={{ textAlign: 'left' }} />
        </View>

        {isFetching ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <>
            <View style={styles.paginationContainer}>
              <Pagination.Container>
                <Pagination.Limit 
                  limits={['10', '50', '100', '150']}
                  value={limit}
                  onChange={setLimit}
                />
              </Pagination.Container>

              <Pagination.Container>
                <Pagination.PreviousButton 
                  hasPrevious={data?.previous} 
                  onPress={() => setPage(page - 1)}
                />
                <Pagination.Page page={String(page)} />
                <Pagination.NextButton 
                  hasNext={data?.next} 
                  onPress={() => setPage(page + 1)}
                />
              </Pagination.Container>
            </View>

            <FlatList 
              data={orders}
              keyExtractor={(item) => item.id}
              style={{ width: '100%' }}
              refreshControl={
                <RefreshControl 
                  onRefresh={refetch}
                  refreshing={isFetching} 
                  colors={[theme.colors.primary]} 
                  progressBackgroundColor={theme.colors.bottomSheet}
                />
              }
              renderItem={({ item }) => (
                <OrderCard
                  item={item}
                  showFullname={false}
                  style={{ 
                    backgroundColor: item.isCollected ? `${theme.colors.primary}80` : theme.colors.bottomSheet
                  }}
                  onPress={() => handleOpenOderDetails(item.id)}
                />
              )}
            />
          </>
        )}

        <FloatingActionButton 
          icon={Plus} 
          onPress={handleCreateOrder}
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16
          }} 
        />
      </Container>

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
          <OderDetails order_id={orderId} />
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

  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  reloadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.fonts.size.xs,
    backgroundColor: `${theme.colors.shape}60`,
    borderRadius: theme.fonts.size.xs
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

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.fonts.size.base
  },
}))