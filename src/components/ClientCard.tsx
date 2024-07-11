import { useQuery } from "@tanstack/react-query";
import { Pressable, View, PressableProps, TextStyle, ImageStyle, ViewStyle, ActivityIndicator } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "./Title";
import { Avatar } from "./Avatar";

import { GetFileService } from "@/apis/supabase/files/GetFileService";

export type InfoProps = {
  id: string
  name: string
  phone: string
  imageURL?: string
}

type ClientCardProps = PressableProps & {
  style?: ViewStyle | ImageStyle | TextStyle
  bucketName: 'items' | 'orders' | 'avatars'
  info: InfoProps
}

export function ClientCard({ info, bucketName, ...rest }: ClientCardProps) {
  const { styles, theme } = useStyles(style)

  const { isFetching, data } = useQuery({
    queryKey: ['customer-image', info.imageURL],
    queryFn: fetchImage
  })

  async function fetchImage() {
    const getFileService = new GetFileService()

    const data = await getFileService.execute({ 
      bucketName, 
      filename: info?.imageURL!
    })

    return data
  }

  return (
    <Pressable {...rest} android_ripple={{ borderless: false }} style={[styles.cardContainer, rest.style]}>
      {info.imageURL ? (
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
        <Avatar size="xs" />
      )}

      <View style={styles.descriptionsContent}>
        <Title label={info.name} size="sm" style={{ color: theme.colors.title }} />
        <Title label={info.phone} size="xs" style={{ color: theme.colors.subTitle }} />
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