import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { Pagination } from "@/components/Pagination";
import { FormData, Header } from '@/components/Header';
import { ItemCard, ItemProps } from "@/components/ItemCard";
import { CustomListEmpty } from "@/components/CustomListEmpty";
import { FloatingActionButton } from "@/components/FloatingActionButton";

import { jwtMiddleware } from "@/apis/supabase/auth/jwtMiddleware";
import { ListItemsService } from '@/apis/supabase/items/ListItemsService';

const service = new ListItemsService()

export default function Items() {
  const { styles, theme } = useStyles(style)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState('10')
  const [search, setSearch] = useState('')
  const { navigate, setParams, replace } = useRouter()
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const { isFetching, data, refetch } = useQuery({
    queryFn: handleFetchItems,
    queryKey: ['items', page, limit, search],
    placeholderData: keepPreviousData
  })

  const items = useMemo(() => {
    return data?.data?.map<ItemProps>((item) => {
      return {
        id: item.id,
        name: item.name,
        price: item.amountInCents / 100,
        imageURL: item.images?.filename || ''
      }
    }) || []
  }, [data?.data])

  function handleCreateItem() {
    navigate('items/create-item')
  }

  function handleUpdateItem(item_id: string) {
    navigate("items/update-item")
    setParams({ item_id })
  }

  async function handleFetchItems() {
    const items = await service.execute({ page, limit: Number(limit), search })
    return items
  }

  async function handleFetchItemByName(data: FormData) {
    setSearch(data.search)
  }

  function onReload() {
    setSearch('')
    refetch()
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
        style={{
          alignItems: 'flex-start',
          paddingTop: 48,
          paddingBottom: 0,
          width: '100%'
        }}
      >
        <Header 
          title="Ítens" 
          placeholder="Pesquisar ítens..."
          onReload={onReload} 
          onSearch={handleFetchItemByName}
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
              data={items}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ItemCard 
                  bucketName="items"
                  item={item}
                  onPress={() => handleUpdateItem(item.id)}
                />
              )}
              style={{ width: '100%' }}
              ListEmptyComponent={<CustomListEmpty message="Ítens não existe ou náo encontrado..." />}
              contentContainerStyle={{ paddingBottom: 8 }}
              ListHeaderComponentStyle={{ marginBottom: 16 }}
            />
          </>
        )}

        <FloatingActionButton 
          icon={Plus} 
          onPress={handleCreateItem}
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16
          }} 
        />
      </Container>
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
}))
