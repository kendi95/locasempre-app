import { View, ViewProps } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

import { Title } from "../Title"

type InputContainerProps = ViewProps & {
  children: React.ReactNode
  label: string
  errorMessage?: string
}

export function InputContainer({ children, label, errorMessage, ...rest }: InputContainerProps) {
  const { styles, theme } = useStyles(style)

  return (
    <View
      {...rest}
      style={[styles.container, rest.style]}
    >
      <Title label={label} size="sm" />
      {children}
      {errorMessage && 
        <Title label={errorMessage} size="xs" style={{ color: theme.colors.accent }} />
      }
    </View>
  )
}

const style = createStyleSheet((theme) => ({
  container: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
}))