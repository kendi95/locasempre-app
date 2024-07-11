import { useStyles } from 'react-native-unistyles'
import { toast, ToastPosition } from '@backpackapp-io/react-native-toast'

type Props = {
  message: string
  duration?: number
  type?: 'NORMAL' | 'SUCCESS' | 'ERROR'
  position?: ToastPosition.BOTTOM | ToastPosition.TOP
}

export function useToast() {
  const { theme } = useStyles()

  function success({ message, duration = 3000, position = 1 }: Props) {
    toast.success(message, {
      position,
      duration,
      styles: {
        indicator: {
          backgroundColor: `${theme.colors.primary}`
        },
        text: {
          color: theme.colors.title,
          fontWeight: '700'
        },
        view: {
          backgroundColor: `${theme.colors.primary}`,
          borderRadius: theme.fonts.size.xs / 2
        }
      }
    })
  }

  function error({ message, duration = 3000, position = 1 }: Props) {
    toast.error(message, {
      position,
      duration,
      styles: {
        indicator: {
          backgroundColor: `${theme.colors.accent}`
        },
        text: {
          color: theme.colors.title,
          fontWeight: '700'
        },
        view: {
          backgroundColor: `${theme.colors.accent}`,
          borderRadius: theme.fonts.size.xs / 2
        }
      }
    })
  }

  function normal({ message, duration = 3000, position = 1 }: Props) {
    toast(message, {
      position,
      duration,
      styles: {
        indicator: {
          backgroundColor: `${theme.colors.bottomSheet}`
        },
        text: {
          color: theme.colors.title,
          fontWeight: '700'
        },
        view: {
          backgroundColor: `${theme.colors.bottomSheet}`,
          borderRadius: theme.fonts.size.xs / 2
        }
      }
    })
  }

  return {
    success,
    error,
    normal
  }
}