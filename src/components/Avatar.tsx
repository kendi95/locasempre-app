import { User, ListIcon } from 'lucide-react-native'
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Pressable, PressableProps, Image, ViewStyle, ImageStyle, TextStyle } from "react-native";

import { fonts } from '@/libs/uninstyles/tokens/fonts'
import { Title } from "./Title";

interface AvatarProps extends PressableProps  {
  style?: ViewStyle | ImageStyle | TextStyle
  size?: keyof typeof fonts.size
  isItem?: boolean
  url?: string
  info?: {
    firstname: string
    lastname: string
  }
}

export function Avatar({ size = 'base', url, info, isItem = false, ...rest }: AvatarProps) {
  const stylesheet = createStyleSheet((theme) => ({
    avatarContainer: {
      width: theme.fonts.size[size] * 4,
      height: theme.fonts.size[size] * 4,
      color: theme.colors.title,
      backgroundColor: theme.colors.shape,
      borderRadius: theme.fonts.size[size],
      alignItems: 'center',
      padding: theme.fonts.size[size],
      justifyContent: 'center',
    },
    image: {
      width: theme.fonts.size[size] * 4,
      height: theme.fonts.size[size] * 4,
      borderRadius: theme.fonts.size[size],
      borderWidth: 3,
      borderColor: theme.colors.shape
    }
  }))

  const { styles, theme } = useStyles(stylesheet)

  const firstLetterFirstname = info?.firstname.substring(0, 1).toLocaleUpperCase();
  const firstLetterLastname = info?.lastname.substring(0, 1).toLocaleUpperCase();

  return (
    <Pressable {...rest} android_ripple={{ borderless: false }} style={[styles.avatarContainer, rest.style]}>
      {!url && !firstLetterFirstname && !firstLetterLastname && isItem && <ListIcon color={theme.colors.title} size={theme.fonts.size[size] * 2} />}
      {!url && !firstLetterFirstname && !firstLetterLastname && !isItem && <User color={theme.colors.title} size={theme.fonts.size[size] * 2} />}
      {url && !firstLetterFirstname && !firstLetterLastname && !isItem && <Image source={{ uri: url }} style={styles.image} />}
      {(url || !url) && firstLetterFirstname && firstLetterLastname && !isItem && (
        <Title 
          size={size} 
          label={`${firstLetterFirstname}${firstLetterLastname}`} 
        />
      )}
    </Pressable>
  )
}