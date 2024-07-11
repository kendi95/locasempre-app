// import DatePicker, { BaseProps } from '@react-native-community/datetimepicker'
import DateTimePicker from 'react-native-ui-datepicker';
import { useState } from 'react'
import { Modal, Pressable, PressableProps, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import { Title } from '../Title';
import { Button } from '../Button';

type InputDateProps = PressableProps & {
  icon?: React.ElementType
  placeholder?: string
  value: Date | null
  onChangeDate: (date: Date) => void
}

export function InputDate({ icon: Icon, placeholder, value, onChangeDate, ...rest }: InputDateProps) {
  const { styles, theme } = useStyles(style)
  const [showPicker, setShowPicker] = useState(false)

  function handleShowPicker() {
    setShowPicker(true)
  }

  function handleHidePicker() {
    setShowPicker(false)
  }

  return (
    <>
      <Pressable 
        style={[styles.inputContainer, rest.style]} 
        onPress={handleShowPicker}
      >
        {Icon && <Icon size={18} style={styles.icon} />}
        <Title 
          label={value ? dayjs(value).format('DD/MM/YYYY').toString() : 'Selecionar data...'} 
          size='sm'
        />
      </Pressable>

      <Modal
        transparent
        visible={showPicker} 
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DateTimePicker
              mode="single"
              date={value || new Date()}
              locale="pt-br"
              displayFullDays
              headerContainerStyle={styles.headerContainerStyle}
              headerTextStyle={styles.headerTextStyle}
              headerButtonColor={theme.colors.primary}
              headerButtonStyle={styles.headerButtonStyle}
              weekDaysTextStyle={styles.weekDaysTextStyle}
              weekDaysContainerStyle={styles.weekDaysContainerStyle}
              todayTextStyle={styles.todayTextStyle}
              selectedItemColor={theme.colors.primary}
              selectedTextStyle={styles.selectedTextStyle}
              todayContainerStyle={styles.todayContainerStyle}
              calendarTextStyle={styles.calendarTextStyle}
              yearContainerStyle={styles.yearContainerStyle}
              monthContainerStyle={styles.monthContainerStyle}
              headerTextContainerStyle={styles.headerTextContainerStyle}
              onChange={(params) => {   
                if (params.date) {
                  onChangeDate(new Date(params.date))
                } 
                
                setShowPicker(false)
              }}                             
            />

            <Pressable 
              android_ripple={{ borderless: false }}
              style={styles.closeButtonModal} 
              onPress={handleHidePicker}
            >
              <Title label='Fechar' size='sm'/>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  )
}

const style = createStyleSheet((theme) => ({
  inputContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.shape,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    marginTop: 4,
    overflow: 'hidden'
  },
  icon: {
    color: theme.colors.primary
  },
  modalContainer: {
    flex: 1,
    backgroundColor: `${theme.colors.background}30`,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    padding: 16,
    backgroundColor: theme.colors.shape,
    borderRadius: theme.fonts.size.base
  },
  headerContainerStyle: {
    backgroundColor: theme.colors.shape
  },
  headerTextStyle: {
    color: theme.colors.title,
    fontSize: theme.fonts.size.xl,
    fontFamily: theme.fonts.family.bold,
    fontWeight: 'bold'
  },
  headerButtonStyle: {
    backgroundColor: `${theme.colors.bottomSheet}80`,
    padding: 12,
    borderRadius: 16
  },
  weekDaysContainerStyle: {
    backgroundColor: theme.colors.shape,
    borderBottomWidth: 0
  },
  weekDaysTextStyle: {
    color: theme.colors.subTitle
  },
  todayTextStyle: {
    color: theme.colors.bottomSheet
  },
  selectedTextStyle: {
    color: theme.colors.title,
    borderRadius: 16
  },
  calendarTextStyle: {
    color: theme.colors.subTitle
  },
  todayContainerStyle: {
    borderColor: theme.colors.subTitle,
    borderWidth: 1,
    borderRadius: 16,
    color: theme.colors.subTitle
  },
  yearContainerStyle: {
    backgroundColor: theme.colors.shape,
    borderColor: theme.colors.subTitle,
    borderRadius: 14
  },
  monthContainerStyle: {
    backgroundColor: theme.colors.shape,
    borderColor: theme.colors.subTitle,
    borderRadius: 14
  },
  closeButtonModal: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.fonts.size.xs,
    backgroundColor: `${theme.colors.background}80`,
    padding: 8
  }
}))