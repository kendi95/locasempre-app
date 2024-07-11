import { Keyboard, View } from "react-native";
import { LogOut, User } from 'lucide-react-native'
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { RectButton } from 'react-native-gesture-handler'
import { useRouter } from "expo-router";

import { Container } from "@/components/Container";
import { Title } from "@/components/Title";

import { useApp } from "@/hooks/useApp";

export default function UserConfig() {
  // const { profileBottomSheetRef  } = useApp()
  const { theme, styles } = useStyles(style);
  const { dismissAll } = useRouter();

  function handleSignout() {
    dismissAll()
  }

  function handleUpdateProfile() {
    // profileBottomSheetRef.current?.expand();
  }

  return (
    <Container
      onTouch={Keyboard.dismiss}
      style={{
        alignItems: 'flex-start',
        paddingTop: 48,
        gap: 16
      }}
    >
      <Title label="Configurações" size="lg" style={{ textAlign: 'left', fontSize: 28 }} />

      <View style={styles.navs}>
        <RectButton 
          style={styles.nav} 
          rippleColor={theme.colors.shape}
          onPress={handleUpdateProfile}
        >
          <User size={20} color={theme.colors.subTitle} />
          <Title label="Meu perfil" size="lg" style={{ color: theme.colors.subTitle }} />
        </RectButton>

        <RectButton 
          style={styles.nav} 
          rippleColor={theme.colors.shape}
          onPress={handleSignout}
        >
          <LogOut size={20} color={theme.colors.subTitle} />
          <Title label="Sair" size="lg" style={{ color: theme.colors.subTitle }} />
        </RectButton>
      </View>
    </Container>
  )
}

const style = createStyleSheet((theme) => ({
  navs: {
    gap: 4,
    width: '100%',
  },
  nav: {
    width: '100%',
    borderRadius: 6,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
}))