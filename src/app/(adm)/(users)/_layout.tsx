import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack
      initialRouteName='index' 
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false
      }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen name='create-user' />
      <Stack.Screen name='update-user' />
    </Stack>
  )
}