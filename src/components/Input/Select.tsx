import { useEffect, useState } from "react"
import { Check, ChevronDown } from "lucide-react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"
import { RectButton, RectButtonProps } from "react-native-gesture-handler"
import { Modal, Pressable, TouchableWithoutFeedback, View, ViewStyle } from "react-native"

import { Title } from "../Title"

type ItemProps = {
  label: string
  value: string
}

type InputSelectProps = RectButtonProps & {
  placeholder?: string
  value?: string
  items: ItemProps[]
  onChange?: (value: string) => void
  containerStyle?: ViewStyle
}

export function Select({ items, placeholder, value, onChange, containerStyle, ...rest }: InputSelectProps) {
  const style = createStyleSheet((theme) => ({
    selectContainer: {
      alignItems: 'center',
      backgroundColor: rest.enabled ? 'transparent' : theme.colors.bottomSheet,
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
    modalContainer: {
      flex: 1,
      backgroundColor: `${theme.colors.background}99`,
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalContent: {
      width: '80%',
      maxHeight: 700,
      height: 'auto',
      backgroundColor: theme.colors.bottomSheet,
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
      borderRadius: theme.fonts.size.base,
      backgroundColor: `${theme.colors.bottomSheet}50`
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
  
  const { styles, theme } = useStyles(style)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ItemProps | null>(null)

  function handlePress() {
    setShowModal(true)
  }

  function handleSelectItem(item: ItemProps) {
    setSelectedItem(item)
    if (onChange) onChange(item.value)

    setShowModal(false)
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
      <View style={[styles.selectContainer, containerStyle]}>
        <RectButton 
          {...rest}
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
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {items.map((item) => (
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
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}
