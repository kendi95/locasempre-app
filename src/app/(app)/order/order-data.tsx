import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CameraCapturedPicture } from "expo-camera";
import { Control, Controller } from "react-hook-form";
import { ActivityIndicator, ScrollView, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Input } from "@/components/Input";
import { ChooseItem } from "@/components/ChooseItem";

import { FormData } from "./create-order";
import { ListItemsService } from "@/apis/supabase/items/ListItemsService";
import { GetFileService } from "@/apis/supabase/files/GetFileService";

type ItemProps = {
  label: string
  value: string
}

type ItemWithPrice = {
  id: string
  name: string
  amount: number
  imageURL?: string
}

const listItemsService = new ListItemsService()
const getFileService = new GetFileService()

type OrderDataProps = {
  control: Control<FormData>
  files: CameraCapturedPicture[]
  onShowCamera: () => void
  onRemoveImage?: (index: number) => void
}

export function OrderData({ control, files, onShowCamera, onRemoveImage }: OrderDataProps) {
  const [selectedItem, setSelectedItems] = useState<ItemWithPrice[]>([])
  const { theme, styles } = useStyles(style);

  const { isFetching, data } = useQuery({
    queryKey: ['order-items'],
    queryFn: fetchItems
  })

  function handleSelectedItem(item: ItemProps, onChange: (...events: any[]) => void) {
    setSelectedItems(oldItems => {
      onChange([...oldItems, data?.find(i => i.id === item.value)!])
      return [...oldItems, data?.find(i => i.id === item.value)!]
    })
  }

  function handleRemoveSelectedItem(item_id: string, onChange: (...events: any[]) => void) {
    setSelectedItems(oldItems => {
      const newItems = oldItems.filter(item => item.id !== item_id)

      AsyncStorage.setItem('selected-items', JSON.stringify(newItems)).then(() => {
        onChange(newItems.length > 0 ? [...newItems] : undefined)
      })

      return newItems
    })
  }

  async function fetchItems() {
    let newItems: ItemWithPrice[] = []

    const { data } = await listItemsService.execute({})

    data?.forEach(async (item) => {
      let image_url = ''

      if (item.images) {
        const { imageURL } = await getFileService.execute({
          bucketName: 'items',
          filename: item?.images?.filename!
        })

        image_url = imageURL
      }

      newItems.push({
        id: item.id,
        name: item.name,
        amount: item.amountInCents / 100,
        imageURL: image_url
      })
    })

    return newItems
  }

  useEffect(() => {
    AsyncStorage.clear()
  }, [])

  useEffect(() => {
    if (selectedItem.length > 0) {
      AsyncStorage.setItem('selected-items', JSON.stringify(selectedItem))
    } else {
      AsyncStorage.getItem('selected-items').then(data => {
        if (data) {
          setSelectedItems(JSON.parse(data))
        } 
      })
    }
  }, [selectedItem])

  return (
    <>
      <View style={styles.dateContainer}>
        <Input.Container label="Data de retirada" style={{ width: '48%' }}>
          <Controller 
            control={control}
            name='takeAt'
            render={({ field: { value, onBlur, onChange } }) => (
              <Input.InputDate
                value={value}
                onChangeDate={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </Input.Container>

        <Input.Container label="Data da coleta" style={{ width: '48%' }}>
          <Controller 
            control={control}
            name='collectedAt'
            render={({ field: { value, onBlur, onChange } }) => (
              <Input.InputDate
                value={value}
                onChangeDate={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </Input.Container>
      </View>

      <Input.Container label="Imagens (opcional)" style={{ width: '100%' }}>
        <ScrollView horizontal style={{ height: 72 }} contentContainerStyle={{ gap: 4 }}>
          <Input.AddImage size="xl" onPress={onShowCamera} />

          {files.length > 0 && files.map((file, index) => (
            <Input.ImageCard 
              key={index} 
              size="xl" 
              source={{ uri: file.uri }} 
              showRemoveButton
              onRemoveImage={() => onRemoveImage!(index)}
            />
          ))}
        </ScrollView>
      </Input.Container>

      <ChooseItem.Container label="Itens">
        {isFetching || !data ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <ActivityIndicator size="small" color={theme.colors.title} />
          </View>
        ) : (
          <Controller 
            control={control}
            name="items"
            render={({ field: { onChange } }) => (
              <>
                <ChooseItem.AddItem 
                  label="Selecione um ou mais itens..." 
                  style={{ marginVertical: 6 }}
                  items={data?.map(item => {
                    return {
                      label: item.name,
                      value: item.id
                    }
                  })}
                  onSearch={() => {}}
                  onSelectedValue={(item) => {
                    handleSelectedItem(item, onChange)
                  }}
                />
              
              <ScrollView 
                style={{ paddingBottom: 32 }} 
                contentContainerStyle={{ minHeight: 'auto' }}
              >
                {selectedItem.map((item) => (
                  <ChooseItem.ItemWithPrice 
                    item={item} 
                    key={item.id} 
                    onRemovePress={() => handleRemoveSelectedItem(item.id, onChange)} 
                  />
                ))}
              </ScrollView>
              </>
            )}
          />
        )}

      </ChooseItem.Container>
    </>
  )
}

const style = createStyleSheet((theme) => ({
  dateContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: `${theme.colors.background}99`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    width: '80%',
    height: 'auto',
    maxHeight: 300,
    backgroundColor: theme.colors.shape,
    borderRadius: theme.fonts.size.xs,
    overflow: 'hidden'
  },
  modalInput: {
    width: 'auto',
    height: 48,
    paddingHorizontal: theme.fonts.size.base / 2,
    color: theme.colors.title,
    fontSize: theme.fonts.size.base
  },
  modalInputContent: {
    width: '100%',
    paddingHorizontal: theme.fonts.size.base / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  modalButtonSearch: {
    padding: theme.fonts.size.base / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.fonts.size.base * 2,
    overflow: 'hidden'
  },

  item: {
    paddingHorizontal: theme.fonts.size.base,
    paddingVertical: theme.fonts.size.base / 2
  }
}))