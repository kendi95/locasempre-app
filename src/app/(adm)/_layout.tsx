import { Drawer } from "expo-router/drawer";
import { LayoutDashboard, Users, UserCog } from "lucide-react-native";

import { useApp } from "@/hooks/useApp";
import { CustomOptions } from "@/types/navigation";

import { DrawerContent } from "@/components/DrawerContent";

export default function DrawerLayoutAdm() {
  const { enableSwipeDrawer } = useApp()

  return (
    <Drawer 
      initialRouteName="dashboard"
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
        name="dashboard"
        options={{
          title: 'Principal',
          icon: LayoutDashboard
        } as CustomOptions}
      />

      <Drawer.Screen 
        name="(users)"
        options={{
          title: 'Usuários',
          icon: Users
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