import { useState } from "react"
import { Modal, View } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

import { Title } from "./Title"
import { Button } from "./Button"

type AlertProps = {
  message: string
  isActive: boolean
  onOK?: () => void
}

export function Alert({ message, isActive, onOK }: AlertProps) {
  const { styles, theme } = useStyles(style)
  const [showModal, setShowModal] = useState(isActive)

  function handleHideModal() {
    setShowModal(false)

    if (onOK) onOK()
  }

  return (
    <Modal
      transparent
      visible={showModal} 
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Title label={message} size="sm" />

          <Button 
            label="OK" 
            style={{ backgroundColor: theme.colors.shape }}
            onPress={handleHideModal} 
          />
        </View>
      </View>
    </Modal>
  )
}

const style = createStyleSheet((theme) => ({
  modalContainer: {
    flex: 1,
    backgroundColor: `${theme.colors.background}90`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    width: '80%',
    height: 'auto',
    maxHeight: 300,
    backgroundColor: theme.colors.bottomSheet,
    borderRadius: theme.fonts.size.xs,
    overflow: 'hidden',
    padding: theme.fonts.size.xs,
    gap: theme.fonts.size.base
  },
  
}))