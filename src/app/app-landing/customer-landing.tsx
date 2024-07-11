import { Image, View } from "react-native";

import { Title } from "@/components/Title";

import CustomerImage from '@/assets/customers.png'


export function CustomerLanding() {

  return (
    <View 
      key={2}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
      }}
    >
      <Image 
        source={CustomerImage} 
        resizeMode="center"
        style={{ 
          backgroundColor: 'transparent',
          objectFit: 'scale-down',
          width: '100%',
          height: '40%'
        }}  
      />

      <Title 
        label="Assim como os clientes também podem ser gerenciados." 
        size="base" 
        style={{ textAlign: 'center' }} 
      />
    </View>
  )
}