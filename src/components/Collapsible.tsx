import { Pressable, View, PressableProps, useWindowDimensions, TextStyle, ImageStyle, ViewStyle } from "react-native"
import { ChevronDown } from 'lucide-react-native'
import { createStyleSheet, useStyles } from "react-native-unistyles"
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  useAnimatedRef, 
  measure, 
  runOnUI,
  useDerivedValue,
  interpolate
} from 'react-native-reanimated'

import { Title } from "./Title"

type CollapsibleProps = PressableProps & {
  label: string
  isCollapsed?: boolean
  children: React.ReactNode
  style?: ViewStyle | ImageStyle | TextStyle
}

const AnimatedChevronDown = Animated.createAnimatedComponent(ChevronDown)

export function Collapsible({ label, children, isCollapsed = false, ...rest }: CollapsibleProps) {
  const { height } = useWindowDimensions()
  const { theme, styles } = useStyles(style);
  const animatedRef = useAnimatedRef<View>()
  const collapsibleHeight = useSharedValue(!isCollapsed ? 42 : height / 2)
  const rotateIcon = useSharedValue(!isCollapsed ? 0 : 180)
  const opacityContent = useSharedValue(!isCollapsed ? 0 : 1)
  const isCollapsible = useSharedValue(isCollapsed)
  
  const animatedCollapseStyled = useAnimatedStyle(() => {
    return {
      height: withTiming(collapsibleHeight.value)
    }
  })

  const rotateStyled = useDerivedValue(() => {
    return interpolate(
      rotateIcon.value,
      [0, 180],
      [0, 180],
    )
  })

  const opacityStyled = useDerivedValue(() => {
    return interpolate(
      opacityContent.value,
      [0, 1],
      [0, 1]
    )
  })

  const animatedRotateStyled = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotateStyled.value}deg` }
      ]
    }
  })

  const animatedOpacityStyled = useAnimatedStyle(() => {
    return {
      opacity: opacityStyled.value
    }
  })

  function handleCollapse() {
    'worklet'
    const measured = measure(animatedRef)
    collapsibleHeight.value = isCollapsible.value ? 42 : Number(measured?.height) * 2
    rotateIcon.value = withTiming(!isCollapsible.value ? 180 : 0, { duration: 200 })
    opacityContent.value = withTiming(!isCollapsible.value ? 1 : 0, { duration: 200 })
    isCollapsible.value = !isCollapsible.value
    
  }

  return (
    <Animated.View 
      style={[
        styles.collapsibleContainer, 
        rest.style, 
        animatedCollapseStyled
      ]}
    >
      <Pressable 
        {...rest} 
        android_ripple={{ borderless: false }} 
        style={styles.collapsibleHeaderContainer}
        onPress={() => runOnUI(handleCollapse)()}
      >
        <Title label={label} size="lg" />
        <AnimatedChevronDown 
          size={18} 
          color={theme.colors.title} 
          style={[animatedRotateStyled]}
        />
      </Pressable>

      <Animated.View 
        ref={animatedRef} 
        style={[styles.collapsibleContent, animatedOpacityStyled]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  )
}

const style = createStyleSheet((theme) => ({
  collapsibleContainer: {
    width: '100%',
    height: 42,
    borderRadius: theme.fonts.size.xs,
    backgroundColor: theme.colors.bottomSheet
  },
  collapsibleHeaderContainer: {
    paddingHorizontal: theme.fonts.size.base,
    paddingVertical: theme.fonts.size.base / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collapsibleContent: {
    height: 'auto',
    width: '100%',
    padding: theme.fonts.size.base,
    paddingTop: 8,
  }
}))