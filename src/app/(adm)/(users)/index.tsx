import { useRouter } from 'expo-router';
import { Plus } from "lucide-react-native";
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ActivityIndicator, Keyboard, View, FlatList } from "react-native";

import { Container } from "@/components/Container";
import { Pagination } from '@/components/Pagination';
import { Header, FormData } from '@/components/Header';
import { UserCard, UserItem } from '@/components/UserCard';
import { FloatingActionButton } from "@/components/FloatingActionButton";

import { jwtMiddleware } from '@/apis/supabase/auth/jwtMiddleware';
import { ListUsersService } from '@/apis/supabase/users/ListUsersService';
import { Alert } from '@/components/Alert';

const service = new ListUsersService()

export default function Users() {
  const { theme, styles } = useStyles(style)
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState('50')
  const [page, setPage] = useState(1)
  const { navigate, setParams, replace } = useRouter();

  const { isFetching, data, refetch } = useQuery({
    queryKey: ['users', search, page, limit],
    queryFn: handleFetchUsers
  })

  const users = useMemo(() => {
    return data?.data?.map<UserItem>((user) => {
      return {
        ...user
      }
    }) || []
  }, [data?.data])

  function handleCreateUser() {
    navigate('create-user')
  }

  function handleUpdateUser(user_id: string) {
    navigate('update-user')
    setParams({ user_id })
  }

  async function handleFetchUsers() {
    const users = await service.execute({ page, limit: Number(limit), search })
    return users
  }

  function onReload() {
    setSearch('')
    refetch()
  }

  async function handleFetchUserByName(data: FormData) {
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
          paddingBottom: 0,
          width: '100%'
        }}
      >
        <Header 
          title="Usuários" 
          placeholder="Pesquisar usuários..."
          onReload={onReload} 
          onSearch={handleFetchUserByName}
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
              data={users}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => (
                <UserCard
                  key={item.id} 
                  item={item}
                  onPress={() => handleUpdateUser(item.id)} 
                />
              )}
              style={{ width: '100%' }}
              contentContainerStyle={{ paddingBottom: 8 }}
              ListHeaderComponentStyle={{ marginBottom: 16 }}
            />
          </>
        )}
        
        <FloatingActionButton 
          icon={Plus} 
          onPress={handleCreateUser}
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 8
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.fonts.size.base
  },
}))
