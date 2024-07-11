import { useRouter } from "expo-router";
import { Plus, Filter } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from  '@gorhom/bottom-sheet'
import { ActivityIndicator, FlatList, Keyboard, useWindowDimensions, View } from "react-native";

import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { Pagination } from "@/components/Pagination";
import { FormData, Header } from "@/components/Header";
import { OrderCard, OrderItem } from "@/components/OrderCard";
import { CustomListEmpty } from "@/components/CustomListEmpty";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CustomHandlerBottomSheet } from "@/components/CustomHandlerBottomSheet";

import { OrderDetails } from "./order-details";
import { FilterStatus, OrderFilters, FilterIsCollected } from "./order-filters";

import { jwtMiddleware } from "@/apis/supabase/auth/jwtMiddleware";
import { ListOrdersService } from "@/apis/supabase/orders/ListOrdersService";

const service = new ListOrdersService()

export default function Orders() {
  const { navigate, replace } = useRouter()
  const { height } = useWindowDimensions()
  const { styles, theme } = useStyles(style)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const filterBottomSheetRef = useRef<BottomSheet>(null)
  const [orderId, setOrderId] = useState('')
  const [limit, setLimit] = useState('50')
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState<FilterStatus | string>('ALL')
  const [filterCollected, setFilterCollected] = useState<FilterIsCollected | string>('NO')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const { isFetching, data, refetch } = useQuery({
    queryFn: handleFetchOrders,
    queryKey: ['orders', page, limit, filterStatus, search, filterCollected],
    placeholderData: keepPreviousData
  })

  const formattedOrders = useMemo(() => {
    return data?.data?.map<OrderItem>((order) => {
      return {
        id: order.id,
        clientName: order.customers?.name!,
        status: order.status!,
        subtotal: order.totalAmountInCents / 100
      }
    })
  }, [data?.data])

  function onReload() {
    setSearch('')
    refetch()
  }

  function handleCreateOrder() {
    navigate('/order/create-order' as never)
  }

  function handleOpenOderDetails(order_id: string) {
    setOrderId(order_id)
    bottomSheetRef.current?.expand()
  }

  function handleShowFilter() {
    filterBottomSheetRef.current?.expand()
  }

  function handleCloseFilter() {
    filterBottomSheetRef.current?.close()
  }

  async function handleCloseBottomSheet() {
    setOrderId('')
    bottomSheetRef.current?.close()

    await handleFetchOrders()
  }

  async function handleFetchOrders() {
    const data = await service.execute({ 
      page, 
      limit: Number(limit), 
      search,
      filter: { 
        status: filterStatus,
        isCollected: filterCollected === 'YES'
      } 
    })

    return data
  }

  function handleFetchOrderByName(data: FormData) {
    setSearch(data.search)
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
          width: '100%',
        }}
      >
        <Header 
          title="Pedidos" 
          placeholder="Pesquisar nome cliente..."
          onReload={onReload} 
          onSearch={handleFetchOrderByName}
          reloading={isFetching}
          searching={isFetching}
        />

        {isFetching ? (
          <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        ) : (
          <>
            <View style={styles.paginationContainer}>
              <Pagination.Container>
                <Pagination.Limit 
                  limits={['50', '100', '150']}
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
              data={formattedOrders}
              keyExtractor={(item) => item.id}
              style={{ width: '100%' }}
              ListEmptyComponent={<CustomListEmpty message="Pedido não existe ou náo encontrado..." />}
              renderItem={({ item }) => {
                if (item.clientName) {
                  return (
                    <OrderCard 
                      key={item.id}
                      item={item}
                      onPress={() => handleOpenOderDetails(item?.id)}
                    />
                  )
                }

                return <></>
              }}
            />
          </>
        )}

        <FloatingActionButton 
          icon={Filter} 
          onPress={handleShowFilter}
          style={{
            position: 'absolute',
            backgroundColor: theme.colors.bottomSheet,
            bottom: 16,
            left: 16
          }} 
        />

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
          <OrderDetails order_id={orderId} onResourceDone={handleCloseBottomSheet} />
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet
        ref={filterBottomSheetRef}
        snapPoints={[0.01, height / 3.6]}
        handleIndicatorStyle={styles.handleIndicator}
        handleComponent={() => <CustomHandlerBottomSheet containerStyle={{ backgroundColor: theme.colors.bottomSheet }} onPress={handleCloseFilter} />}
        backgroundStyle={styles.containerStyle}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
      >
        <BottomSheetScrollView
          style={styles.sheetContainer} 
          contentContainerStyle={{ flex: 1 }}
        >
          <OrderFilters 
            onChangeFilterStatus={setFilterStatus} 
            onChangeFilterCollected={setFilterCollected} 
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  )
}

const style = createStyleSheet((theme) => ({
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.fonts.size.base
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

}))

