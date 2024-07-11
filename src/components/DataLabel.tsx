import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "./Title";

type DataLabelProps = {
  label: string
  content?: string
}

export function DataLabel({ label, content = '' }: DataLabelProps) {
  const { theme, styles } = useStyles(style)

  return (
    <View>
      <Title 
        label={label} 
        size="lg" 
        style={{ fontFamily: theme.fonts.family.bold }} 
      />
      <Title 
        label={content} 
        size="sm" 
        style={{ 
          fontFamily: theme.fonts.family.regular, 
          lineHeight: theme.fonts.size.sm,
          color: theme.colors.subTitle
        }}  
      />
    </View>
  )
}

const style = createStyleSheet((theme) => ({
  dataContainer: {
    lineHeight: theme.fonts.size.lg
  },
}))