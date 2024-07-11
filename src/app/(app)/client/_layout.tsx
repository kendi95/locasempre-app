import { Stack } from "expo-router";

export default function ClientLayout() {
  return (
    <Stack
      initialRouteName='index' 
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false
      }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen name='create-client' />
      <Stack.Screen name='update-client' />
      <Stack.Screen name='visualize-order' />
      <Stack.Screen name='delivered-addresses/index' />
      <Stack.Screen name='delivered-addresses/create-delivered-address' />
      <Stack.Screen name='delivered-addresses/update-delivered-address' />
    </Stack>
  )
}