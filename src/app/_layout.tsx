import 'react-native-gesture-handler';
import "@/libs/uninstyles"

import { StatusBar } from 'expo-status-bar';
import { useStyles } from 'react-native-unistyles';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';

import { queryClient } from '@/libs/use-query';
import { AppProvider } from '@/context/AppProvider';
import { initNotifications } from '@/libs/notifications';

import { Router } from './router';

import { AppLoading } from '@/components/AppLoading';

initNotifications();

export default function Layout() {
  const { theme } = useStyles()
  const [fontLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold
  })

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar backgroundColor={theme.colors.background} style="light" />
     
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          {!fontLoaded ? (
            <AppLoading />
          ) : (
            <Router />
          )}

          <Toasts />
        </AppProvider>
      </QueryClientProvider>

    </GestureHandlerRootView>
  )
}