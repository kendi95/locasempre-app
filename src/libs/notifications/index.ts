import { Router } from '@react-navigation/native'
import * as Notifications from 'expo-notifications'

export async function initNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true
    })
  })
}

export async function requestPermissionNotification() {
  const permission = await Notifications.getPermissionsAsync()

  if (permission.status !== 'granted') {
    const { granted } = await Notifications.requestPermissionsAsync()

    if (!granted) {
      throw new Error('O aplicativo deve ter permissão do usuário.')
    }
  }

  return
}

export async function scheduleNotification(data: Notifications.NotificationRequestInput) {
  await Notifications.scheduleNotificationAsync(data)
}

export async function cancelScheduleNotification(identifier: string) {
  await Notifications.cancelScheduledNotificationAsync(identifier)
}

export function notificationResponseReceiver(router: Router) {

  const listener = Notifications.addNotificationResponseReceivedListener((response) => {
    const { data } = response.notification.request.content
    if (data?.url) {
      router.push(data?.url)
    }
  })

  return listener
}