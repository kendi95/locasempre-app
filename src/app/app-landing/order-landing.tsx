import { Image, View } from "react-native";

import { Title } from "@/components/Title";

import OrderImage from '@/assets/orders.png'


export function OrderLanding() {

  return (
    <View 
      key={1}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Image 
        source={OrderImage} 
        resizeMode="center"
        style={{ 
          backgroundColor: 'transparent',
          objectFit: 'scale-down',
          width: '100%',
          height: '40%'
        }}  
      />

      <Title 
        label="Ao ter acesso a plataforma gerencie os pedidos feito pelo usuário." 
        size="base" 
        style={{ textAlign: 'center' }} 
      />
    </View>
  )
}