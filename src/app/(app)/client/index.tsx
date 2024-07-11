import { useRouter } from 'expo-router';
import { Plus } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Keyboard, View, FlatList, ActivityIndicator } from "react-native";

import { Container } from "@/components/Container";
import { Pagination } from "@/components/Pagination";
import { FormData, Header } from '@/components/Header';
import { ClientCard, InfoProps } from "@/components/ClientCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";

import { jwtMiddleware } from '@/apis/supabase/auth/jwtMiddleware';
import { ListCustomersService } from '@/apis/supabase/customers/ListCustomersService';
import { Alert } from '@/components/Alert';

const service = new ListCustomersService()

export default function Clients() {
  const { theme, styles } = useStyles(style)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState('50')
  const { setParams, navigate, replace } = useRouter()
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const { isFetching, refetch, data } = useQuery({
    queryKey: ['customers', page, search, limit],
    queryFn: handleFetchCustomers
  })

  const customers = useMemo(() => {
    return data?.data?.map<InfoProps>((customer) => {
      return {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        imageURL: customer.images?.filename || ''
      }
    })
  }, [data?.data])

  function handleCreateClient() {
    navigate('client/create-client')
  }

  function handleUpdateClient(client_id: string) {
    navigate('client/update-client')
    setParams({ client_id })
  }

  async function handleFetchCustomers() {
    const customers = await service.execute({ page, search, limit: Number(limit) })
    return customers
  }

  async function handleFetchCustomerByName(data: FormData) {
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
        onTouch={Keyboard.dismiss}
        style={{
          alignItems: 'flex-start',
          paddingTop: 48,
          paddingBottom: 0,
          width: '100%'
        }}
      >
        <Header 
          title="Clientes" 
          placeholder="Pesquisar clientes..."
          onReload={onReload} 
          onSearch={handleFetchCustomerByName}
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
              data={customers}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item }) => (
                <ClientCard 
                  key={item.id}
                  bucketName='avatars'
                  info={item}
                  onPress={() => handleUpdateClient(item.id)}
                />
              )}
              style={{ width: '100%' }}
              contentContainerStyle={{ paddingBottom: 8,  }}
              ListHeaderComponentStyle={{ marginBottom: 16 }}
            />
          </>
        )}
        
        <FloatingActionButton 
          icon={Plus} 
          onPress={handleCreateClient}
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
