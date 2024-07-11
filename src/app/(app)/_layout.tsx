import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { LayoutDashboard, ListOrdered, Users, UserCog, ListIcon } from "lucide-react-native";

import { useApp } from "@/hooks/useApp";
import { CustomOptions } from "@/types/navigation";
import { notificationResponseReceiver } from "@/libs/notifications";

import { DrawerContent } from "@/components/DrawerContent";

export default function DrawerLayoutApp() {
  const { enableSwipeDrawer } = useApp()
  const router = useRouter()

  useEffect(() => {
    const listener = notificationResponseReceiver(router)

    return () => listener.remove();
  }, [router])

  return (
    <Drawer 
      initialRouteName="home"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: enableSwipeDrawer,
        drawerStyle: {
          width: 240,
          backgroundColor: 'transparent',
        }
      }}
    >
      <Drawer.Screen 
        name="home"
        options={{
          title: 'Principal',
          icon: LayoutDashboard
        } as CustomOptions}
      />

      <Drawer.Screen 
        name="order"
        options={{
          title: 'Pedidos',
          icon: ListOrdered
        } as CustomOptions}
      />

      <Drawer.Screen 
        name="client"
        options={{
          title: 'Clientes',
          icon: Users
        } as CustomOptions}
      />

      <Drawer.Screen 
        name="items"
        options={{
          title: 'Itens',
          icon: ListIcon
        } as CustomOptions}
      />

      <Drawer.Screen 
        name="profile/index"
        options={{
          title: 'Meu Perfil',
          icon: UserCog
        } as CustomOptions}
      />
    </Drawer>
  )
}