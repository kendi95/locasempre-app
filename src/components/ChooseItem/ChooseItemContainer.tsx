import { View, ViewProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Title } from "../Title";

type ChooseItemContainerProps = ViewProps & {
  children: React.ReactNode
  label: string
}

export function ChooseItemContainer({ children, label, ...rest }: ChooseItemContainerProps) {
  const { styles } = useStyles(style)

  return (
    <View {...rest} style={[styles.container, rest.style]}>
      <Title label={label} size="sm" />
      {children}
    </View>
  )
}

const style = createStyleSheet((theme) => ({
  container: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
}))