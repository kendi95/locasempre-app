import { useState } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ImageStyle, Modal, Pressable, PressableProps, TextStyle, View, ViewStyle } from "react-native";

import { Title } from "../Title";
import { Container } from "../Container";
import { Check } from "lucide-react-native";

type PaginationLimitProps = PressableProps & {
  style?: ImageStyle | TextStyle | ViewStyle
  limits: string[]
  value: string
  onChange: (value: string) => void
}

export function PaginationLimit({ limits, value, onChange, ...rest }: PaginationLimitProps) {
  const { styles, theme } = useStyles(style)
  const [showModal, setShowModal] = useState(false)
  const [selectedLimit, setSelectedLimit] = useState(value)

  function handleSelectLimit(limit: string) {
    setSelectedLimit(limit)
    onChange(limit)
    setShowModal(false)
  }

  return (
    <>
      <Pressable 
        {...rest} 
        style={[styles.button, rest.style]}
        android_ripple={{ borderless: false }}
        onPress={() => setShowModal(true)}
      >
        <Title label={selectedLimit} size="base" />
      </Pressable>

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
            backgroundColor: `${theme.colors.background}90`
          }}
        >
          <View style={styles.modalContent}>
            {limits.map(limit => (
              <Pressable 
                key={limit}
                android_ripple={{ borderless: false }}
                style={styles.modalItem}
                onPress={() => handleSelectLimit(limit)}
              >
                <Title label={limit} size="base" />
                {selectedLimit === limit && <Check size={20} color={theme.colors.primary} />}
              </Pressable>
            ))}
          </View>
        </Container>
      </Modal>
    </>
  )
}

const style = createStyleSheet((theme) => ({
  button: {
    width: theme.fonts.size.base * 3,
    height: theme.fonts.size.base * 3,
    borderRadius: theme.fonts.size.base / 1.5,
    backgroundColor: theme.colors.bottomSheet,
    alignItems: 'center',
    justifyContent: 'center'
  },

  modalContent: {
    width: '80%',
    height: 'auto',
    maxHeight: 300,
    backgroundColor: theme.colors.bottomSheet,
    borderRadius: theme.fonts.size.xs,
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