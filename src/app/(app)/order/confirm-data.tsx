import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Container } from "@/components/Container";
import { DataLabel } from "@/components/DataLabel";
import { ItemPrice } from "@/components/ChooseItem";
import { DataWithPriceLabel } from "@/components/DataWithPriceLabel";

type ConfirmDataProps = {
  customerName: string
  takedAt: string
  collectedAt: string
  address: string
  items: ItemPrice[]
  imageCount: number
  buttonElement: React.ReactNode
  onSubTotal?: (value: string) => void
}

export function ConfirmData({ items, customerName, takedAt, collectedAt, address, buttonElement, imageCount, onSubTotal }: ConfirmDataProps) {
  const { theme, styles } = useStyles(style)

  return (
    <Container
      style={{
        alignItems: 'flex-start',
        paddingBottom: 8,
        paddingTop: 0,
        width: '100%',
        backgroundColor: theme.colors.background,
        gap: 8
      }}
    >
      <DataLabel label="Cliente" content={customerName} />
      <DataLabel 
        label="Endereço de entrega" 
        content={address} 
      />

      <View style={styles.dateContainer}>
        <DataLabel label="Data de retirada" content={takedAt} />
        <DataLabel label="Data de coleta" content={collectedAt} />
      </View>  

      <DataLabel 
        label="Imagens (opcional)" 
        content={imageCount > 0 ? `${imageCount} imagens inseridos...` : 'Nenhuma imagem inserido'}
      />

      <DataWithPriceLabel 
        isShowCheckbox
        items={items} 
        label="Itens selecionados" 
        onSubTotal={onSubTotal}
      />

      {buttonElement}
    </Container>
  )
}

const style = createStyleSheet((theme) => ({
  dateContainer: {
    width: '100%', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
}))