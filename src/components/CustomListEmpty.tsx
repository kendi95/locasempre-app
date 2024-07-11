import { Database } from 'lucide-react-native'
import { useWindowDimensions, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "./Title";

type CustomListEmptyProps = {
  message: string
}

export function CustomListEmpty({ message }: CustomListEmptyProps) {
  const { height } = useWindowDimensions()

  const style = createStyleSheet((theme) => ({
    container: {
      flex: 1,
      height: height / 1.3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      gap: 4
    }
  
  }))

  const { styles, theme } = useStyles(style)

  return (
    <View style={[styles.container]}>
      <Database size={32} color={theme.colors.primary} />
      <Title label={message} size="sm" />
    </View>
  )
}

