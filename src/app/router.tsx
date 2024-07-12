import { Stack } from 'expo-router';

export function Router() {

  return (
    <Stack 
      initialRouteName='index'
      screenOptions={{
        animation: 'slide_from_right',
        animationDuration: 800,
        statusBarAnimation: 'fade',
      }}
    >
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='app-landing/index' options={{ headerShown: false }} />
      <Stack.Screen name='forgot-password/index' options={{ headerShown: false }} />
      <Stack.Screen name='forgot-password/new-password' options={{ headerShown: false }} />
      <Stack.Screen name='(adm)' options={{ headerShown: false }} />
      <Stack.Screen name='(app)' options={{ headerShown: false }} />
    </Stack>
  )
}