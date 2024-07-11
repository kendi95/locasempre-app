import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import PagerView from "react-native-pager-view";
import { ChevronLeft } from "lucide-react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Button } from "@/components/Button";
import { PagerDot } from "@/components/PagerDot";
import { Container } from "@/components/Container";

import { useApp } from "@/hooks/useApp";

import { OrderLanding } from "./order-landing";
import { CustomerLanding } from "./customer-landing";

export default function AppLanding() {
  const { replace } = useRouter()
  const { handleFirstOpenApp, isFirstOpenApp } = useApp()
  const { styles, theme } = useStyles(style)
  const pagerViewRef = useRef<PagerView>(null)
  const [currentPage, setCurrentPage] = useState(0)

  function handleNextPage() {
    pagerViewRef.current?.setPage(1)
    setCurrentPage(1)
  }

  function handlePreviousPage() {
    pagerViewRef.current?.setPage(0)
    setCurrentPage(0)
  }

  function handleAccessApp() {
    handleFirstOpenApp()
  }

  useEffect(() => {
    if (!isFirstOpenApp) {
      replace('')
    }
  }, [isFirstOpenApp])

  return (
    <Container
      onTouch={Keyboard.dismiss}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <PagerView 
          ref={pagerViewRef} 
          initialPage={0} 
          style={styles.landingContainer}
        >
          <OrderLanding />
          <CustomerLanding />
        </PagerView>

        <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
          {[0, 1].map((page) => (
            <PagerDot key={page} isCurrentPage={currentPage === page} />
          ))}
        </View>
      </View>

      {currentPage === 0 ? (
        <Button label="Proximo" onPress={handleNextPage} />
      ) : (
        <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Button 
            icon={ChevronLeft} 
            onPress={handlePreviousPage} 
            style={{
              width: '14%',
              height: 44
            }}
          />
          <Button 
            label="Acessar" 
            onPress={handleAccessApp}
            style={{
              width: '84%',
            }}
          />
        </View>
      )}
      <Button 
        label="Pular" 
        style={{ backgroundColor: `${theme.colors.bottomSheet}90` }}
        onPress={handleAccessApp} 
      />
    </Container>
  )
}

const style = createStyleSheet((theme) => ({
  landingContainer: {
    width: '100%',
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))