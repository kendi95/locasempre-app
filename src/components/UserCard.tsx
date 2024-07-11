import { View, Pressable, PressableProps, ViewStyle, TextStyle, ImageStyle } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

import { Title } from "./Title"

export type UserItem = {
  id: string
  name: string
  email: string
  role: 'ADMINISTRATOR' | 'USER'
}

type UserCardProps = PressableProps & {
  item: UserItem
  style?: ViewStyle | TextStyle | ImageStyle
}

export function UserCard({ item, ...rest }: UserCardProps) {
  const style = createStyleSheet((theme) => ({
    cardContainer: {
      backgroundColor: theme.colors.bottomSheet,
      width: '100%',
      padding: 8,
      paddingHorizontal: theme.fonts.size.xs,
      marginBottom: 8,
      borderRadius: theme.fonts.size.xs,
    },
    descriptionsContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    role: {
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 4,
      paddingHorizontal: 12,
      borderRadius: 99,
      backgroundColor: item.role === 'ADMINISTRATOR' ? theme.colors.primary : theme.colors.shape
    }
  }))

  const { styles, theme } = useStyles(style)

  const role = item.role === 'ADMINISTRATOR' ? 'Administrador' : 'Comum'

  return (
    <Pressable {...rest} android_ripple={{ borderless: false }} style={[styles.cardContainer, rest.style]}>
      <Title label={item.name} size="lg" />

      <View style={styles.descriptionsContent}>
        <Title label={item.email} size="xs" style={{ color: theme.colors.subTitle }} />

        <View style={styles.role}>
          <Title label={role} size="xs" style={{ fontSize: 10 }} />
        </View>
      </View>
    </Pressable>
  )
}
