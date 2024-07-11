import { View } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

type PagerDotProps = {
  isCurrentPage: boolean
}

export function PagerDot({ isCurrentPage }: PagerDotProps) {
  const style = createStyleSheet((theme) => ({
    dot: {
      width: !isCurrentPage ? 6 : 8,
      height: !isCurrentPage ? 6 : 8,
      borderRadius: !isCurrentPage ? 6 * 2 : 8 * 2,
      backgroundColor: theme.colors.shape
    },
  }))

  const { styles } = useStyles(style)

  return(
    <View style={styles.dot} />
  )
}