import { ImageBackground, ImageSourcePropType, Pressable, PressableProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type CardPressable = PressableProps & {
  imageURL?: ImageSourcePropType
}

export function CardPressable({ imageURL, ...rest }: CardPressable) {
  const { styles, theme } = useStyles(style)

  return (
    <Pressable 
      {...rest} 
      style={[styles.card]} 
      android_ripple={{
        foreground: true,
        borderless: true,
        color: theme.colors.shape
      }}
    >
      {imageURL !== undefined && <ImageBackground source={imageURL} style={styles.image} />}
    </Pressable>
  )
}

const style = createStyleSheet((theme) => ({
  card: {
    borderRadius: theme.fonts.size.xs,
    borderWidth: 2,
    borderColor: theme.colors.shape,
    zIndex: 50,
    overflow: 'hidden'
  },
  image: {
    width: '100%', 
    height: 160,
    objectFit: 'contain',
    opacity: 0.2,
  }
}))
