import { useStyles } from "react-native-unistyles"
import { createStyleSheet } from "react-native-unistyles"
import { ImageStyle, Pressable, PressableProps, TextStyle, View, ViewStyle } from "react-native"

import { Title } from "./Title"

type DeliveredAddressItem = {
  id: string
  zipcode: string
  address: string
}

type AddressCardProps = PressableProps & {
  item: DeliveredAddressItem
  style?: ImageStyle | TextStyle | ViewStyle
}

export function AddressCard({ item, ...rest }: AddressCardProps) {
  const { styles, theme } = useStyles(style)

  return (
    <Pressable {...rest} android_ripple={{ borderless: false }} style={[styles.cardContainer, rest.style]}>
      <View style={styles.cardContent}>
        <Title label={`#${item.id.substring(0, 4)}`} size="base" />
        <Title label={item.zipcode} size="sm" style={{ color: theme.colors.title }} />
      </View>

      <Title label={item.address} size="sm" style={{ color: theme.colors.title }} />
    </Pressable>
  )
}

const style = createStyleSheet((theme) => ({
  cardContainer: {
    backgroundColor: theme.colors.bottomSheet,
    width: '100%',
    marginBottom: 8,
    borderRadius: theme.fonts.size.xs,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  cardContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
}))