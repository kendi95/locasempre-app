import { View, Pressable, PressableProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Title } from "../Title";

type ItemProps = PressableProps & {
  isSelected?: boolean
  label: string
}

export function Item({ isSelected = false, label, ...rest }: ItemProps) {

  const style = createStyleSheet((theme) => ({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.fonts.size.base,
      paddingVertical: theme.fonts.size.xs,
      borderRadius: theme.fonts.size.xs,
      borderWidth: 1.2,
      borderColor: isSelected ? theme.colors.primary : theme.colors.shape,
    },
    radio: {
      borderRadius: theme.fonts.size.sm * 2,
      borderColor: isSelected ? theme.colors.primary : theme.colors.shape,
      borderWidth: 1.2,
      padding: 1.4,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 1
    },
    radioBack: {
      borderRadius: theme.fonts.size.sm * 2,
      width: theme.fonts.size.xs,
      height: theme.fonts.size.xs,
      backgroundColor: isSelected ? theme.colors.primary : 'transparent'
    },
  }))

  const { styles, theme } = useStyles(style)

  return (
    <Pressable {...rest} android_ripple={{ borderless: false }} style={styles.container}>
      <View style={styles.radio}>
        <View style={styles.radioBack} />
      </View>

      <Title 
        label={label}
        size="xs" 
        style={{ color: theme.colors.subTitle, width: '90%' }} 
      />
    </Pressable>
  )
}