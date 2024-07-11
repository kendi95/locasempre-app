import { StatusBar, ViewProps, TouchableWithoutFeedback, SafeAreaView } from "react-native";
import { createStyleSheet, useStyles } from 'react-native-unistyles'

type ContainerProps = ViewProps & {
  children: React.ReactNode
  onTouch?: () => void
}

export function Container({ children, onTouch, ...rest }: ContainerProps) {
  const { styles } = useStyles(style)

  return (
    <TouchableWithoutFeedback onPress={onTouch}>
      <SafeAreaView {...rest} style={[styles.container, rest.style]}>
        {children}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const style = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: theme.colors.background,
  }
}))
