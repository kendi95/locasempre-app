import { ActivityIndicator, View } from "react-native"
import MaskInput, { MaskInputProps } from "react-native-mask-input"
import { createStyleSheet, useStyles } from "react-native-unistyles"

type InputMaskProps = MaskInputProps & {
  icon?: React.ElementType
  loading?: boolean
}

export function InputMask({ icon: Icon, loading = false, ...rest }: InputMaskProps) {
  const style = createStyleSheet((theme) => ({
    inputContainer: {
      alignItems: 'center',
      backgroundColor: rest.editable ? 'transparent' : theme.colors.bottomSheet,
      width: '100%',
      borderWidth: 1,
      borderColor: theme.colors.shape,
      borderRadius: 8,
      flexDirection: 'row',
      gap: 8,
      padding: 8,
      marginTop: 4,
      overflow: 'hidden'
    },
    input: {
      color: theme.colors.title,
      width: '82%',
      fontFamily: theme.fonts.family.medium,
      fontSize: theme.fonts.size.base
    },
    icon: {
      color: theme.colors.primary
    },
  }))

  const { styles, theme } = useStyles(style)

  return (
    <View style={[styles.inputContainer, rest.style]}>
      {Icon && <Icon size={18} style={styles.icon} />}
      <MaskInput {...rest} style={styles.input} placeholderTextColor={theme.colors.shape} />
      {loading && <ActivityIndicator size="small" color={theme.colors.primary} />}
    </View>
  )
}

