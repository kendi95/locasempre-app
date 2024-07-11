import { useNavigation } from 'expo-router'
import { Menu, ChevronLeft } from "lucide-react-native";
import { DrawerActions } from '@react-navigation/native'
import { ImageStyle, Pressable, PressableProps, TextStyle, ViewStyle } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type DrawerMenuProps = PressableProps & {
  backButton?: boolean
  style?: ViewStyle | ImageStyle | TextStyle
}

export function DrawerMenu({ backButton = false, ...rest }: DrawerMenuProps) {
  const { theme, styles } = useStyles(style)
  const { dispatch, goBack } = useNavigation()

  function handleToggleMenu() {
    if (backButton) {
      goBack()
      return;
    }

    dispatch(DrawerActions.toggleDrawer())
  }
  
  return (
    <Pressable
      {...rest}
      android_ripple={{ borderless: false }}
      style={[styles.button, rest.style]}
      onPress={handleToggleMenu}
    >
      {backButton === true
        ? (
          <ChevronLeft size={theme.fonts.size.base} color={theme.colors.title} />  
        ) 
        : (
          <Menu size={theme.fonts.size.base} color={theme.colors.title} />  
        )
      }
      
    </Pressable>
  )
}

const style = createStyleSheet((theme) => ({
  button: {
    width: theme.fonts.size.base * 3,
    height: theme.fonts.size.base * 3,
    borderRadius: theme.fonts.size.base / 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bottomSheet
  }
}))