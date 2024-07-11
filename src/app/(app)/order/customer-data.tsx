import { useQuery } from "@tanstack/react-query";
import { useStyles } from "react-native-unistyles";
import { useEffect, useMemo, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { ActivityIndicator, Keyboard, View } from "react-native";

import { Input } from "@/components/Input";
import { ChooseItem } from "@/components/ChooseItem";

import { FormData } from "./create-order";

import { ListCustomersService } from "@/apis/supabase/customers/ListCustomersService";
import { UpdateDefaultAddressDeliveredAddressService } from "@/apis/supabase/delivered_addresses/UpdateDefaultAddressDeliveredAddressService";
import { DeliveredAddresses, GetDeliveredAddressesByCustomerService } from "@/apis/supabase/delivered_addresses/GetDeliveredAddressesByCustomerService";

const listCustomerService = new ListCustomersService()
const updateDefaultAddress = new UpdateDefaultAddressDeliveredAddressService()
const listCustomerDeliveredAddressService = new GetDeliveredAddressesByCustomerService()

type ItemProps = {
  label: string
  value: string
}

type CustomerDataProps = {
  control: Control<FormData>
  customerId: string
  onCreateNewDeliveredAddress?: () => void
  onCreateNewCustomer?: () => void
  onSelectedDeliveredddress: (address: DeliveredAddresses) => void
}

export function CustomerData({ control, customerId, onCreateNewDeliveredAddress, onCreateNewCustomer, onSelectedDeliveredddress }: CustomerDataProps) {
  const { theme } = useStyles()
  const [search, setSearch] = useState('')

  const { data, refetch } = useQuery({
    queryKey: ['order-customer', search],
    queryFn: fetchCustomer,
    enabled: false
  })

  const { isFetching, data: dataDeliveredAddresses, refetch: refetchDeliveredAddress } = useQuery({
    queryKey: ['order-customer-delivered-address', customerId],
    queryFn: fetchDeliveredAddressByCustomer,
    enabled: false
  })

  const customers = useMemo(() => {
    return data?.map<ItemProps>((customer) => {
      return {
        label: customer.name,
        value: customer.id
      }
    }) || []
  }, [data])

  const deliveredAddressses = useMemo(() => {
    return dataDeliveredAddresses?.map<DeliveredAddresses>((address) => {
      return {
        id: address.id,
        address: address.address,
        city: address.city,
        complement: address.complement,
        neighborhood: address.neighborhood,
        numberAddress: address.numberAddress,
        provincy: address.provincy,
        zipcode: address.zipcode,
        isDefaultAddress: address.isDefaultAddress
      }
    })
  }, [dataDeliveredAddresses])

  async function fetchCustomer() {
    Keyboard.dismiss()

    if (search) {
      const { data } = await listCustomerService.execute({ search })
      return data
    }

    const { data } = await listCustomerService.execute({})
    return data
  }

  async function fetchDeliveredAddressByCustomer() {
    const deliveredAddresse = await listCustomerDeliveredAddressService.execute({
      customer_id: customerId
    })

    deliveredAddresse?.forEach((address) => {
      if (address.isDefaultAddress) {
        onSelectedDeliveredddress(address)
        return
      }

      return
    })

    return deliveredAddresse
  }

  async function handleUpdateDefaultDeliveredAddress(deliveredAddressId: string) {
    try {
      await updateDefaultAddress.execute(deliveredAddressId, { customerId })

      setDeliveredAddresses(oldAddress => {
        return oldAddress.map((address) => {
          if (address.id === deliveredAddressId) {
            onSelectedDeliveredddress(address)
            return {
              ...address,
              isDefaultAddress: true
            }
          }

          return address
        })
      })
    } catch (error) {
      
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (customerId) {
      refetchDeliveredAddress()
    }
  }, [customerId])
  
  return (
    <>
      <Input.Container label="Cliente">
        <Controller 
          control={control}
          name='customer'
          render={({ field: { value, onChange } }) => (
            <Input.InputSelectSearch 
              placeholder="Selecione um cliente..."
              inputPlaceholder="Pesquisar cliente..."
              onChangeInputValue={setSearch}
              inputValue={search}
              onCreateNewResource={onCreateNewCustomer}
              onSearch={refetch}
              onChangeValue={(value) => {
                onChange({
                  id: value.value,
                  name: value.label
                })
              }}
              value={value?.id}
              items={customers}
            />
          )}
        />
      </Input.Container>

      <ChooseItem.Container label="Endereço para entrega" style={{ gap: 8 }}>
        {isFetching ? (
          <ActivityIndicator size="small" color={theme.colors.title} />
        ) : (
          <View style={{ width: '100%', gap: 4 }}>
            {deliveredAddressses && deliveredAddressses.map((address) => (
              <ChooseItem.Item 
                key={address.id}
                isSelected={address.isDefaultAddress}
                label={`${address.address}, ${address.numberAddress} - ${address.city}/${address.provincy}`} 
                onPress={() => handleUpdateDefaultDeliveredAddress(address.id)} 
              />
            ))}
          </View>
        )}

        <ChooseItem.AddItem 
          onPress={onCreateNewDeliveredAddress}
          label="Adicionar novo endereço de entrega"
        />
      </ChooseItem.Container>

      
    </>
  )
}