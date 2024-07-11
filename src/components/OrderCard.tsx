import { createStyleSheet, useStyles } from "react-native-unistyles"
import { View, Pressable, PressableProps, ViewStyle, TextStyle, ImageStyle } from "react-native"

import { Title } from "./Title"

import { currencyFormat } from "@/utils/currencyFormat"

export type OrderItem = {
  id: string
  clientName: string
  subtotal: number
  status: 'PENDING' | 'PAID' | 'CANCELED'
}

type OderCardProps = PressableProps & {
  item: OrderItem
  style?: ViewStyle | TextStyle | ImageStyle
  showFullname?: boolean
}

export function OrderCard({ item, showFullname = true, ...rest }: OderCardProps) {
  const style = createStyleSheet((theme) => ({
    cardContainer: {
      backgroundColor: theme.colors.bottomSheet,
      width: '100%',
      paddingVertical: theme.fonts.size.base / 2,
      paddingHorizontal: theme.fonts.size.base,
      marginBottom: 8,
      borderRadius: theme.fonts.size.xs,
      gap: 4
    },
    cardNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    descriptionsContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    status: {
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 4,
      paddingHorizontal: 12,
      borderRadius: 99,
      backgroundColor: item.status === 'PAID' 
        ? theme.colors.primary 
        : item.status === "CANCELED"
          ? theme.colors.accent
          : theme.colors.shape
    }
  }))

  const { styles, theme } = useStyles(style)

  const status = item?.status === 'PENDING' 
    ? 'Pendente' 
    : item?.status === "PAID"
      ? "Pago"
      : "Cancelado"

  return (
    <Pressable {...rest} android_ripple={{ borderless: false }} style={[styles.cardContainer, rest.style]}>
      <View style={styles.cardNameContainer}>
        {showFullname && <Title label={item?.clientName} size="base" />}
        {item && <Title label={`#${item.id.substring(0, 4)}`} size="base" />}
      </View>

      <View style={styles.descriptionsContent}>
        <Title label={currencyFormat(item?.subtotal, 'pt-BR')} size="xs" style={{ color: theme.colors.subTitle }} />

        <View style={styles.status}>
          <Title label={status} size="xs" style={{ fontSize: 10 }} />
        </View>
      </View>
    </Pressable>
  )
}

