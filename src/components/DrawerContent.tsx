import { LogOut } from 'lucide-react-native'
import { Pressable, View } from 'react-native'
import { useNavigation, useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { DrawerContentComponentProps } from '@react-navigation/drawer'

import { Title } from './Title'
import { Container } from './Container'

import { useApp } from '@/hooks/useApp'
import { CustomOptions } from '@/types/navigation'
import { LogoutService } from '@/apis/supabase/auth/LogoutService'

type DrawerContentProps = DrawerContentComponentProps & {}

const logoutService = new LogoutService()

export function DrawerContent({ state, descriptors }: DrawerContentProps) {
  const { replace } = useRouter()
  const { storeUserId } = useApp()
  const { navigate } = useNavigation()
  const { theme, styles } = useStyles(style)

  function handleNavigation(pathName: string) {
    navigate(pathName as never)
  }

  async function handleLogout() {
    await logoutService.execute()
    storeUserId('')
    replace('/')
  }

  return (
    <Container
      style={{
        paddingTop: 64,
        paddingRight: 0,
        justifyContent: 'space-between',
        borderBottomRightRadius: 16
      }}
    >
      <View style={{ gap: 8 }}>
        {state.routes.map((route, index) => {
          const { title, icon: Icon } = descriptors[route.key].options as CustomOptions
          const isFocused = state.index === index

          if (!title) {
            return <View key={index + 1} />
          }

          return (
            <Pressable 
              key={index + 1} 
              android_ripple={{ borderless: false }} 
              style={[styles.itemMenu, isFocused && styles.itemFocused]}
              onPress={() => handleNavigation(route.name)}
            >
              {Icon && <Icon size={18} color={theme.colors.title} />}
              <Title label={title} size='base' />
            </Pressable>
          )
        })}
        
      </View>
      <View>
        <Pressable 
          android_ripple={{ borderless: false }} 
          style={styles.itemLogoutMenu}
          onPress={handleLogout}
        >
          <LogOut size={18} color={theme.colors.title} />
          <Title label='Sair' size='sm' />
        </Pressable>
      </View>
      
    </Container>
  )
}

const style = createStyleSheet((theme) => ({
  itemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    paddingLeft: 16,
    borderTopLeftRadius: theme.fonts.size.base * 2,
    borderBottomLeftRadius: theme.fonts.size.base * 2,
  },
  itemLogoutMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    paddingLeft: 16,
    borderTopLeftRadius: theme.fonts.size.base * 2,
    borderBottomLeftRadius: theme.fonts.size.base * 2,
  },
  itemFocused: {
    backgroundColor: `${theme.colors.primary}95`
  }
}))