import { useState } from "react";
import { Pressable, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Check } from 'lucide-react-native'

import { Title } from "../Title";

type CheckBoxProps = {
  label: string
  isChecked: boolean
  onChange: (checked: boolean) => void
}

export function CheckBox({ label, isChecked, onChange }: CheckBoxProps) {
  const style = createStyleSheet((theme) => ({
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 8,
      marginTop: 4
    },
    cheeckboxButton: {
      width: theme.fonts.size.xs * 2,
      height: theme.fonts.size.xs * 2,
      borderRadius: theme.fonts.size.xs / 1.5,
      borderWidth: isChecked ? 0 : 1,
      borderColor: theme.colors.shape,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isChecked ? theme.colors.primary : 'transparent'
    }
  }))

  const { styles, theme } = useStyles(style)

  function handleCheck() {
    onChange(!isChecked)
  }

  return (
    <View style={styles.checkboxContainer}>
      <Pressable style={styles.cheeckboxButton} onPress={handleCheck}>
        {isChecked && <Check size={12} color={theme.colors.title} />}
      </Pressable>
      <Title label={label} size="sm" />
    </View>
  )
}

