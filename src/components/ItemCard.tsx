import { 
  Pressable, 
  View, 
  PressableProps, 
  ViewStyle, 
  ImageStyle, 
  TextStyle, 
  ActivityIndicator
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "./Title";
import { Avatar } from "./Avatar";

import { currencyFormat } from "@/utils/currencyFormat";
import { GetFileService } from "@/apis/supabase/files/GetFileService";

export type ItemProps = {
  id: string
  name: string
  price: number
  imageURL: string
}

type ItemCardProps = PressableProps & {
  item: ItemProps
  bucketName: 'items' | 'orders' | 'avatars'
  style?: ViewStyle | ImageStyle | TextStyle
}

export function ItemCard({ item, bucketName, ...rest }: ItemCardProps) {
  const { styles, theme } = useStyles(style)

  const { isFetching, data } = useQuery({
    queryKey: ['item-image', item.imageURL],
    queryFn: fetchImage
  })

  async function fetchImage() {
    const getFileService = new GetFileService()

    const data = await getFileService.execute({ 
      bucketName, 
      filename: item.imageURL
    })

    return data
  }

  return (
    <Pressable {...rest} android_ripple={{ borderless: false }} style={[styles.cardContainer, rest.style]}>
      {item.imageURL ? (
        <>
          {isFetching ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 14 }}>
              <ActivityIndicator size="small" color={theme.colors.title} />
            </View>
          ) : (
            <Avatar size="xs" url={data?.imageURL} />
          )}
        </>
      ) : (
        <Avatar isItem size="xs" />
      )}

      <View style={styles.descriptionsContent}>
        <Title label={item.name} size="sm" style={{ color: theme.colors.title }} />
        <Title label={currencyFormat(item.price, 'pt-BR')} size="xs" style={{ color: theme.colors.subTitle }} />
      </View>
    </Pressable>
  )
}

const style = createStyleSheet((theme) => ({
  cardContainer: {
    backgroundColor: theme.colors.bottomSheet,
    width: '100%',
    marginBottom: 8,
    borderRadius: theme.fonts.size.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8
  },
  descriptionsContent: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
}))
