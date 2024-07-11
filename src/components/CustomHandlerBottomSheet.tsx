import { X } from "lucide-react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ImageStyle, TextStyle, View, ViewStyle } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";

type CustomHandleProps = RectButtonProps & {
  containerStyle?: ViewStyle | ImageStyle | TextStyle
}

export function CustomHandlerBottomSheet({ containerStyle, ...rest }: CustomHandleProps) {
  const { theme, styles } = useStyles(style);

  return (
    <View style={[styles.customHandleContainer, containerStyle]}>
      <RectButton {...rest} style={styles.customHandleCloseButton}>
        <X size={24} color={theme.colors.title} />
      </RectButton>
    </View>
  )
}

const style = createStyleSheet((theme) => ({
  customHandleContainer: {
    flexDirection: 'row-reverse',
    width: '100%',
    paddingHorizontal: theme.fonts.size.base,
    paddingVertical: theme.fonts.size.base / 2,
    backgroundColor: theme.colors.background
  },

  customHandleCloseButton: {
    padding: theme.fonts.size.base / 2,
    borderRadius: theme.fonts.size.base * 2,
    alignItems: 'center',
    justifyContent: 'center'
  },

}))