import { Stack } from "expo-router";


export default function OrderLayout() {
  return (
    <Stack
      initialRouteName='index' 
      screenOptions={{
        animation: 'slide_from_right',
        animationDuration: 800,
        statusBarAnimation: 'fade',
        headerShown: false
      }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen name='create-order' />
    </Stack>
  )
}