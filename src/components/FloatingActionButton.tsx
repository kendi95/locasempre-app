import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type FloatingActionButtonProps = RectButtonProps & {
  icon: React.ElementType
  iconStyle?: TextStyle | ViewStyle | ImageStyle
}

export function FloatingActionButton({ icon: Icon, iconStyle, ...rest }: FloatingActionButtonProps) {
  const { styles } = useStyles(style)

  return (
    <RectButton
      {...rest}
      style={[styles.button, rest.style]}
    >
      {Icon && <Icon size={18} style={[styles.icon, iconStyle]} />}
    </RectButton>
  )
}

const style = createStyleSheet((theme) => ({
  button: {
    width: theme.fonts.size.xl * 2.5,
    height: theme.fonts.size.xl * 2.5,
    borderRadius: theme.fonts.size.xl,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    color: theme.colors.title,
  }
}))