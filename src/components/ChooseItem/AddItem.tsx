import { FlatList, ImageStyle, Modal, Pressable, PressableProps, TextInput, TextStyle, View, ViewStyle } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Plus, Search } from 'lucide-react-native'
import { useState } from "react";

import { Title } from "../Title";
import { RectButton } from "react-native-gesture-handler";

import { ItemProps } from "../Input/SearchSelect";

type AddItemProps = PressableProps & {
  label: string
  placeholder?: string
  items?: ItemProps[]
  style?: ViewStyle | ImageStyle | TextStyle
  onSearch?: (search: string) => void
  onSelectedValue?: (item: ItemProps) => void
}

export function AddItem({ label, items, placeholder, onSearch, onSelectedValue, ...rest }: AddItemProps) {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const style = createStyleSheet((theme) => ({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 8,
      paddingHorizontal: theme.fonts.size.base,
      paddingVertical: theme.fonts.size.xs,
      borderRadius: theme.fonts.size.xs,
      borderWidth: 1.2,
      borderColor: theme.colors.shape,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: `${theme.colors.background}`,
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

    modalItem: {
      padding: theme.fonts.size.base,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
  
    item: {
      paddingHorizontal: theme.fonts.size.base,
      paddingVertical: theme.fonts.size.base / 2
    }
  }))

  const { styles, theme } = useStyles(style)

  async function handleSearch() {
    if (search) {
      if (onSearch) onSearch(search)
    }
  }

  function handlePress() {
    if (items !== undefined) {
      setShowModal(true)
      return
    }

    rest.onPress()
  }

  function handleSelectItem(item: ItemProps) {
    if (onSelectedValue) onSelectedValue(item)
    setShowModal(false)
  }

  return (
    <>
      <Pressable 
        {...rest} 
        android_ripple={{ borderless: false }} 
        style={[styles.container, rest.style]}
        onPress={handlePress}
      >
        <Plus size={16} color={theme.colors.subTitle} />

        <Title 
          label={label}
          size="xs" 
          style={{ color: theme.colors.subTitle }} 
        />
      </Pressable>

      <Modal
        transparent
        visible={showModal} 
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalInputContent}>
              <TextInput
                style={styles.modalInput} 
                placeholder={placeholder}
                placeholderTextColor={theme.colors.subTitle}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
                onEndEditing={handleSearch}
              />

              <RectButton
                style={styles.modalButtonSearch}
                onPress={handleSearch}
              >
                <Search size={16} color={theme.colors.title} />
              </RectButton>
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable 
                  style={[styles.modalItem]} 
                  key={item.value}
                  android_ripple={{
                    borderless: false
                  }}
                  onPress={() => handleSelectItem(item)}
                >
                  <Title label={item.label} />
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
    
  )
}