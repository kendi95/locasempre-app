import { Text, TextProps } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

type TitleProps = TextProps & {
  label: string
  size?: 'sm' | 'xs' | 'lg' | 'xl' | 'base'
}

export function Title({ label, size = 'base', ...rest }: TitleProps) {
  const style = createStyleSheet((theme) => ({
    title: {
      fontFamily: theme.fonts.family.bold,
      color: theme.colors.title,
      fontSize: theme.fonts.size[size]
    }
  }))

  const { styles } = useStyles(style)

  return (
    <Text {...rest} style={[styles.title, rest.style]}>{label}</Text>
  )
}

