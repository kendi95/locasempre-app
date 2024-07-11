import { TextInput, TextInputProps, View, ViewStyle } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

type InputTextProps = TextInputProps & {
  icon?: React.ElementType
  containerStyle?: ViewStyle
}

export function InputText({ icon: Icon, containerStyle, ...rest }: InputTextProps) {
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
      width: '90%',
      fontFamily: theme.fonts.family.medium,
      fontSize: theme.fonts.size.base
    },
    icon: {
      color: theme.colors.primary
    },
  }))

  const { styles, theme } = useStyles(style)

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {Icon && <Icon size={18} style={styles.icon} />}
      <TextInput {...rest} style={[styles.input, rest.style]} placeholderTextColor={theme.colors.shape} />
    </View>
  )
}
