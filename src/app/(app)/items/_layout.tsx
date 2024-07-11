import { Stack } from "expo-router";

export default function ItemsLayout() {
  return (
    <Stack
      initialRouteName='index' 
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false
      }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen name='create-item' />
      <Stack.Screen name='update-item' />
    </Stack>
  )
}