import { UnistylesRegistry } from 'react-native-unistyles'

import { defaultColor } from './theme'
import { breakpoints } from './tokens/breakpoints'

interface AppTheme {
  default: typeof defaultColor
}

type AppBreakpoints = typeof breakpoints

declare module "react-native-unistyles" {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppTheme {}
}

UnistylesRegistry.addBreakpoints(breakpoints).addThemes({
  default: defaultColor
}).addConfig({ initialTheme: 'default' })