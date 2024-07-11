import { ChevronLeft } from "lucide-react-native"
import { ImageStyle, Pressable, PressableProps, TextStyle, ViewStyle } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

type PaginationPreviousProps = PressableProps & {
  style?: ImageStyle | TextStyle | ViewStyle
  hasPrevious?: boolean
}

export function PaginationPrevious({ hasPrevious = true, ...rest }: PaginationPreviousProps) {
  const style = createStyleSheet((theme) => ({
    button: {
      width: theme.fonts.size.base * 3,
      height: theme.fonts.size.base * 3,
      borderRadius: theme.fonts.size.base / 1.5,
      backgroundColor: hasPrevious ? theme.colors.bottomSheet : `${theme.colors.bottomSheet}80`,
      alignItems: 'center',
      justifyContent: 'center'
    },
  }))
  
  const { styles, theme } = useStyles(style)

  return (
    <Pressable 
      {...rest} 
      style={[styles.button, rest.style]}
      android_ripple={{ borderless: false }}
      disabled={!hasPrevious}
    >
      <ChevronLeft 
        size={18} 
        color={hasPrevious ? theme.colors.title : `${theme.colors.subTitle}80`} 
      />
    </Pressable>
  )
}

