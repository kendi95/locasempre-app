import { View, ViewProps } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

import { Title } from "../Title"

type PaginationPageProps = ViewProps & {
  page: string
}

export function PaginationPage({ page, ...rest }: PaginationPageProps) {
  const { styles, theme } = useStyles(style)

  return (
    <View {...rest} style={[styles.button, rest.style]}>
      <Title label={page} size="base" />
    </View>
  )
}

const style = createStyleSheet((theme) => ({
  button: {
    width: theme.fonts.size.base * 3,
    height: theme.fonts.size.base * 3,
    borderRadius: theme.fonts.size.base / 1.5,
    backgroundColor: `${theme.colors.bottomSheet}`,
    alignItems: 'center',
    justifyContent: 'center'
  },
}))