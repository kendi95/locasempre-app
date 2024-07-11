import { 
  ActivityIndicator, 
  ImageStyle, 
  Pressable, 
  PressableProps, 
  TextStyle, 
  ViewStyle 
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "./Title";

type ButtonProps = PressableProps & {
  label?: string
  icon?: React.ElementType
  iconPosition?: 'left' | 'right'
  style?: ViewStyle | ImageStyle | TextStyle
  loading?: boolean
}

export function Button({ label, icon: Icon, iconPosition = 'left', loading = false, ...rest }: ButtonProps) {
  const style = createStyleSheet((theme) => ({
    button: {
      width: '100%',
      color: theme.colors.title,
      fontFamily: theme.fonts.family.bold,
      paddingHorizontal: theme.fonts.size.base,
      paddingVertical: theme.fonts.size.base / 1.5,
      backgroundColor: rest.disabled ? `${theme.colors.primary}70` : theme.colors.primary,
      borderRadius: 8,
      flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }))

  const { styles, theme } = useStyles(style)

  return (
    <Pressable
      {...rest}
      style={[styles.button, rest.style]}
      android_ripple={{ borderless: false }}
    >
      {loading ? <ActivityIndicator color={theme.colors.title} /> : (
        <>
          {Icon && <Icon size={16} color={theme.colors.title} />}
          {label && <Title label={label} style={{ fontFamily: theme.fonts.family.bold }} />}
        </>
      )}
    </Pressable>
  )
}
