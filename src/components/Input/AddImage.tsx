import { Plus } from 'lucide-react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { ImageStyle, Pressable, PressableProps, TextStyle, ViewStyle } from 'react-native'

import { fonts } from '@/libs/uninstyles/tokens/fonts'

type AddImageProps = PressableProps & {
  size?: keyof typeof fonts.size
  style?: ViewStyle | ImageStyle | TextStyle
}

export function AddImage({ size = 'base', ...rest }: AddImageProps) {
  const style = createStyleSheet((theme) => ({
    button: {
      width: theme.fonts.size[size] * 3,
      height: theme.fonts.size[size] * 3,
      borderRadius: theme.fonts.size[size] / 1.6,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.8,
      borderColor: theme.colors.shape,
      marginTop: 4,
      overflow: 'hidden'
    },
  }))

  const { theme, styles } = useStyles(style)

  return (
    <Pressable 
      {...rest} 
      android_ripple={{ borderless: false }} 
      style={[styles.button, rest.style]}
    >
      <Plus size={theme.fonts.size[size]} color={theme.colors.subTitle} />
    </Pressable>
  )
}