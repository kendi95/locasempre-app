import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import { Keyboard, Pressable, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "@/components/Title";
import { Container } from "@/components/Container";
import { DrawerMenu } from "@/components/DrawerMenu";

import { ProfileUserData } from "./profile-user-data";
import { ProfilePasswordData } from "./profile-password-data";

import { jwtMiddleware } from "@/apis/supabase/auth/jwtMiddleware";
import { Alert } from "@/components/Alert";

export default function Profile() {
  const { replace } = useRouter()
  const { theme, styles } = useStyles(style);
  const pagerViewRef = useRef<PagerView>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  function handleSelectPage(page: number) {
    setCurrentPage(page)
    pagerViewRef.current?.setPage(page)
  }

  useEffect(() => {
    jwtMiddleware().then((data) => {
      if (!data.status) {
        setShowAlert(true)
        setMessage('O acesso a plataforma foi expirado. Faça login novamente.')
      }
    })
  }, [jwtMiddleware])

  return (
    <>
      <Alert 
        isActive={showAlert}
        message={message}
        onOK={() => replace('/')} 
      />
      
      <Container
        onTouch={Keyboard.dismiss}
        style={{
          alignItems: 'flex-start',
          paddingTop: 48,
          width: '100%'
        }}
      >
        <View style={styles.headerContainer}>
          <DrawerMenu />
          <Title label="Meu Perfil" size="xl" style={{ textAlign: 'left' }} />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.buttonPage, { backgroundColor: currentPage === 0 ? theme.colors.shape : 'transparent' }]} 
            android_ripple={{ borderless: false }} 
            onPress={() => handleSelectPage(0)}
          >
            <Title label="Meus dados" />
          </Pressable>

          <Pressable 
            style={[styles.buttonPage, { backgroundColor: currentPage === 1 ? theme.colors.shape : 'transparent' }]} 
            android_ripple={{ borderless: false }} 
            onPress={() => handleSelectPage(1)}
          >
            <Title label="Senha" />
          </Pressable>
        </View>

        <PagerView ref={pagerViewRef} initialPage={0} style={{ width: '100%', flex: 1 }}>
          <ProfileUserData />
          <ProfilePasswordData />
        </PagerView>
      </Container>
    </>
  )
}

const style = createStyleSheet((theme) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8
  },

  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: theme.fonts.size.base,
  },
  buttonPage: {
    width: '50%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bottomSheet,
    borderRadius: 8,
    overflow: 'hidden'
  },
}))