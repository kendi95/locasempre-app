import { useEffect, useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"
import { FlatList, Keyboard, Modal, Pressable, TextInput, View } from "react-native"
import { RectButton, RectButtonProps } from "react-native-gesture-handler"

import { Title } from "../Title"
import { Container } from "../Container"

export type ItemProps = {
  label: string
  value: string
}

type InputSelectSearchProps = RectButtonProps & {
  placeholder?: string
  inputPlaceholder?: string
  value?: string
  inputValue?: string
  onChangeInputValue: (value: string) => void
  onCreateNewResource?: (isCreateNewResource: boolean) => void
  onChangeValue: (value: ItemProps) => void
  onSearch?: () => void
  onPress?: () => void
  items: ItemProps[]
}

export function InputSelectSearch({ 
  items, 
  placeholder, 
  inputPlaceholder, 
  value, 
  inputValue, 
  onChangeInputValue, 
  onPress, 
  onChangeValue,
  onCreateNewResource,
  onSearch,
  ...rest 
}: InputSelectSearchProps) {
  const { styles, theme } = useStyles(style)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ItemProps | null>(null)

  function handlePress() {
    setShowModal(true)
  }

  function handleSelectItem(item: ItemProps) {
    setSelectedItem(item)
    onChangeValue(item)
    setShowModal(false)
  }

  function handleCreateNewClient() {
    setShowModal(false)
    if (onCreateNewResource) onCreateNewResource(true)
  }

  useEffect(() => {
    if (value !== undefined) {
      const item = items.find((item) => item.value === value)

      if (item === undefined) {
        setSelectedItem(null)
      } else {
        setSelectedItem(item)
      }
      
    }
  }, [value, items])

  return (
    <>
      <View style={styles.selectContainer}>
        <RectButton
          style={[rest.style, styles.selectButtonContainer]}
          onPress={handlePress}
        >
          {placeholder && !selectedItem && <Title label={placeholder} style={{ color: theme.colors.shape }} />}
          {selectedItem?.label && <Title label={selectedItem.label} />}
          <ChevronDown size={16} color={theme.colors.subTitle} />
        </RectButton>
      </View>

      <Modal 
        transparent
        visible={showModal} 
        animationType="fade"
      >
        <Container 
          onTouch={() => setShowModal(false)}
          style={{ 
            alignItems: 'center', 
            justifyContent: 'center',
            paddingHorizontal: 0,
            backgroundColor: `${theme.colors.background}`
          }}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalInputContent}>
              <TextInput
                style={styles.modalInput} 
                placeholder={inputPlaceholder}
                placeholderTextColor={theme.colors.subTitle}
                value={inputValue}
                onChangeText={onChangeInputValue}
                returnKeyType="search"
                onEndEditing={onPress}
              />

              <Pressable 
                style={styles.modalButtonSearch}
                onPress={onSearch}
                android_ripple={{
                  borderless: false
                }}
              >
                <Search size={16} color={theme.colors.title} />
              </Pressable>
            </View>

            {items.length > 0 ? (
              <FlatList 
                data={items}
                keyExtractor={(item) => item.value}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable 
                    style={[styles.modalItem, selectedItem?.value === item.value && styles.activeItem]} 
                    key={item.value}
                    android_ripple={{
                      borderless: false
                    }}
                    onPress={() => handleSelectItem(item)}
                  >
                    <Title label={item.label} />
                    {selectedItem?.value === item.value && <Check size={16} color={theme.colors.primary} />}
                  </Pressable>
                )}
              />
            ) : (
              <Pressable 
                style={styles.modalItem} 
                android_ripple={{
                  borderless: false
                }}
                onPress={handleCreateNewClient}
              >
                <Title label="Criar novo cadastro de cliente" size="sm" />
              </Pressable>
            )}
          </View>
        </Container>
      </Modal>
    </>
  )
}

const style = createStyleSheet((theme) => ({
  selectContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.shape,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  selectButtonContainer: {
    width: '100%', 
    padding: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  input: {
    color: theme.colors.title,
    width: '90%',
    fontFamily: theme.fonts.family.medium,
    fontSize: theme.fonts.size.base
  },
  icon: {
    color: theme.colors.primary
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
  activeItem: {
    backgroundColor: theme.colors.bottomSheet,
  },
  modalItem: {
    padding: theme.fonts.size.base,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}))