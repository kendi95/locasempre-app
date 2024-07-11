import { ActivityIndicator, View } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

export function AppLoading() {
  const { styles, theme } = useStyles(style)

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  )
}

const style = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background
  }
}))