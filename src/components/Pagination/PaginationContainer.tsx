import { View, ViewProps } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

type PaginationContainerProps = ViewProps & {
  children: React.ReactNode
}

export function PaginationContainer({ children, ...rest }: PaginationContainerProps) {
  const { styles } = useStyles(style)

  return (
    <View
      {...rest}
      style={[styles.container, rest.style]}
    >
      {children}
    </View>
  )
}

const style = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    gap: 8
  },
}))