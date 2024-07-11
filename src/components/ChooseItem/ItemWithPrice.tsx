import { View, Pressable, PressableProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { RectButton } from 'react-native-gesture-handler'
import { Trash2, Menu } from 'lucide-react-native'

import { Title } from "../Title";
import { Avatar } from "../Avatar";

import { currencyFormat } from "@/utils/currencyFormat";

export type ItemPrice = {
  id: string
  name: string
  amount: number
  imageURL?: string
}

type ItemWithPriceProps = PressableProps & {
  isSelected?: boolean
  onRemovePress: () => void
  item: ItemPrice
}

export function ItemWithPrice({ isSelected = false, onRemovePress, item, ...rest }: ItemWithPriceProps) {

  const style = createStyleSheet((theme) => ({
    container: {
      width: '100%',
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: theme.fonts.size.xs,
      backgroundColor: theme.colors.bottomSheet,
      marginTop: 4,
      gap: 8
    },
    info: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '65%'
    },
  }))

  const { styles, theme } = useStyles(style)

  return (
    <Pressable {...rest} android_ripple={{ borderless: false }} style={styles.container}>
      {item.imageURL ? (
        <Avatar 
          size="xs" 
          url={item.imageURL}
        />
      ) : (
        <View style={{ paddingHorizontal: 16 }}>
          <Menu size={16} color={theme.colors.title} />
        </View>
      )}


      <View style={styles.info}>
        <Title 
          label={item.name}
          size="base" 
          style={{ color: theme.colors.title }} 
        />

        <Title 
          label={currencyFormat(item.amount, 'pt-BR')}
          size="xs" 
          style={{ color: theme.colors.subTitle }} 
        />
      </View>
      
      <RectButton onPress={onRemovePress}>
        <Trash2 size={20} color={theme.colors.accent} />
      </RectButton>
    </Pressable>
  )
}