import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ActivityIndicator, FlatList, View, RefreshControl } from "react-native";

import { Title } from "@/components/Title";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";
import { AddressCard } from "@/components/AddressCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";

import { useApp } from "@/hooks/useApp";
import { GetDeliveredAddressesByCustomerService } from "@/apis/supabase/delivered_addresses/GetDeliveredAddressesByCustomerService";

const getDeliveredAddressService = new GetDeliveredAddressesByCustomerService()

type DeliveredAddressItem = {
  id: string
  zipcode: string
  address: string
}

export default function DeliveredAddresses() {
  const { navigate, setParams } = useRouter()
  const { handleSwipeDrawer } = useApp()
  const { theme, styles } = useStyles(style);
  const { customer_id } = useLocalSearchParams()
  const [loadData, setLoadData] = useState(false)
  const [addresses, setAddresses] = useState<DeliveredAddressItem[]>([])

  function handleUpdateAddress(address_id: string) {
    navigate('delivered-addresses/update-delivered-address' as never)
    setParams({ customer_id: String(customer_id) })
  }

  function handleCreateDeliveredAddress() {
    navigate('delivered-addresses/create-delivered-address' as never)
    setParams({ customer_id: String(customer_id) })
  }

  async function handleFetchDeliveredAddress() {
    try {
      setLoadData(true)

      const data = await getDeliveredAddressService.execute({ 
        customer_id: String(customer_id) 
      })

      setAddresses(data?.map((address) => {
        return {
          id: address.id,
          address: address.address,
          zipcode: address.zipcode
        }
      }) || [])
    } catch (error) {
      
    } finally {
      setLoadData(false)
    }
  }

  useEffect(() => {
    handleSwipeDrawer(false)
  }, [])

  useEffect(() => {
    if (customer_id) {
      handleFetchDeliveredAddress()
    }
  }, [customer_id])

  return (
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
        <Title label="Visualização dos endereços" size="lg" style={{ textAlign: 'left' }} />
      </View>

      {loadData ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList 
          data={addresses}
          keyExtractor={(item) => item.id}
          style={{ width: '100%' }}
          refreshing={loadData}
          refreshControl={
            <RefreshControl 
              onRefresh={handleFetchDeliveredAddress}
              refreshing={loadData} 
              colors={[theme.colors.primary]} 
              progressBackgroundColor={theme.colors.bottomSheet}
            />
          }
          renderItem={({ item }) => (
            <AddressCard
              item={item}
              onPress={() => handleUpdateAddress(item.id)}
            />
          )}
        />
      )}

      <FloatingActionButton 
        icon={Plus} 
        onPress={handleCreateDeliveredAddress}
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16
        }} 
      />
    </Container>
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
}))