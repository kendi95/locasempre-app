import { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "./Title";
import { Input } from "./Input";
import { ItemPrice } from "./ChooseItem";

import { currencyFormat } from "@/utils/currencyFormat";
import { amountFormat } from '@/utils/amountFormat'

type DataWithPriceLabelProps = {
  label: string
  isShowCheckbox?: boolean
  items?: ItemPrice[]
  subTotal?: number
  onSubTotal?: (value: string) => void
}

export function DataWithPriceLabel({ label, isShowCheckbox = false, items = [], subTotal = 0, onSubTotal }: DataWithPriceLabelProps) {
  const { theme, styles } = useStyles(style)
  const inputRef = useRef<TextInput>(null)
  const [activeChangeSubtotal, setActiveChangeSubtotal] = useState(false)
  
  const subtotal = items?.reduce((prev, value) => {
    return prev = prev + value.amount
  }, 0)

  const [total, setTotal] = useState(currencyFormat(subtotal, 'pt-BR', false).replace('R$ ', ''))

  function handleActiveChangeSubtotal(isCheckeed: boolean) {
    setActiveChangeSubtotal(isCheckeed)
  }

  useEffect(() => {
    if (activeChangeSubtotal) {
      inputRef.current?.focus();
    }
  }, [activeChangeSubtotal, inputRef])

  return (
    <View style={styles.container}>
      <Title 
        label={label} 
        size="lg" 
        style={{ fontFamily: theme.fonts.family.bold }} 
      />

      {items?.length > 0 && items?.map(((item, index) => {
        return (
          <View key={index} style={styles.itemsContainer}>
            <Title 
              label={item.name}
              size="sm" 
              style={{ 
                fontFamily: theme.fonts.family.regular, 
                lineHeight: theme.fonts.size.sm,
                color: theme.colors.subTitle
              }}  
            />

            <Title 
              label={currencyFormat(item.amount, 'pt-BR')} 
              size="sm" 
              style={{ 
                fontFamily: theme.fonts.family.regular, 
                lineHeight: theme.fonts.size.sm,
                color: theme.colors.subTitle
              }}  
            />
          </View>
        )
      }))}

      <View style={styles.devider} />  

      <View style={styles.itemsContainer}>
        <Title 
          label="Subtotal" 
          size="base" 
          style={{ 
            fontFamily: theme.fonts.family.bold, 
            lineHeight: theme.fonts.size.base,
            color: theme.colors.subTitle
          }}  
        />

        {activeChangeSubtotal ? (
          <View style={styles.inputContainer}>
            <Title 
              label="R$ "
              size="base" 
              style={{ 
                fontFamily: theme.fonts.family.bold, 
                lineHeight: theme.fonts.size.base,
                color: theme.colors.subTitle
              }}  
            />

            <TextInput 
              ref={inputRef}
              value={total} 
              style={styles.input}
              keyboardType="number-pad" 
              onChangeText={(value) => {
                const amount = amountFormat(value)
                setTotal(amount)
                
                if (onSubTotal) onSubTotal(amount)
              }} 
            />
          </View>
        ) : (
          <Title 
            label={currencyFormat(subTotal > 0 ? subTotal : subtotal)}
            size="base" 
            style={{ 
              fontFamily: theme.fonts.family.bold, 
              lineHeight: theme.fonts.size.base,
              color: theme.colors.subTitle
            }}  
          />
        )}
      </View>

      {isShowCheckbox && (
        <Input.Container label="">
          <Input.CheckBox 
            label="Alterar valor do subtotal" 
            isChecked={activeChangeSubtotal}
            onChange={handleActiveChangeSubtotal} 
          />
        </Input.Container>
      )}

    </View>
  )
}

const style = createStyleSheet((theme) => ({
  container: {
    width: '100%'
  },
  dataContainer: {
    lineHeight: theme.fonts.size.lg
  },
  
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.fonts.size.base / 2
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },

  devider: {
    width: '100%',
    height: 2,
    backgroundColor: theme.colors.shape,
    marginVertical: theme.fonts.size.xs
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    marginTop: -4
  },
  input: {
    width: 'auto',
    fontSize: theme.fonts.size.base,
    color: theme.colors.subTitle,
    fontWeight: 'bold',
    marginTop: -4
  }
}))