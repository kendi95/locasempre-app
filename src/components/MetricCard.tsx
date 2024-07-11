import { ActivityIndicator, Pressable, PressableProps } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

import { Title } from "./Title"

type MetricCardProps = PressableProps & {
  label: string
  value: string
  loadingData: boolean
}

export function MetricCard({ label, loadingData = false, value, ...rest }: MetricCardProps) {
  const { styles, theme } = useStyles(style)

  return (
    <Pressable {...rest} android_ripple={{ borderless: false }} style={styles.cardModal}>
      {loadingData ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <Title label={label} size="sm" style={{ position: 'absolute', top: 12, left: 12 }} />
          <Title label={value} style={{ fontSize: 28, bottom: 12, right: 12, position: 'absolute' }} />
        </>
      )}
    </Pressable>

  )
}

const style = createStyleSheet((theme) => ({
  cardModal: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    backgroundColor: theme.colors.bottomSheet,
    padding: theme.fonts.size.xs,
    alignContent: 'center',
    justifyContent: 'center'
  }
}))