import { useState } from "react";
import { useStyles } from "react-native-unistyles";

import { Input } from "@/components/Input";
import { Container } from "@/components/Container";

type FilterProps = {
  label: string
  value: string
}

export type FilterStatus = 'ALL' | 'PENDING' | 'PAID' | 'CANCELED'
export type FilterIsCollected = 'YES' | 'NO'

type OrderFiltersProps = {
  onChangeFilterStatus?: (value: FilterStatus | string) => void
  onChangeFilterCollected?: (value: FilterStatus | string) => void
}

const filter = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Pago', value: 'PAID' },
  { label: 'Cancelado', value: 'CANCELED' },
] as FilterProps[]

const isCollected = [
  { label: 'Sim', value: 'YES' },
  { label: 'Não', value: 'NO' },
] as FilterProps[]


export function OrderFilters({ onChangeFilterStatus, onChangeFilterCollected }: OrderFiltersProps) {
  const { theme, styles } = useStyles()
  const [filterStatus, setFilterStatus] = useState<FilterProps>({
    label: 'Todos',
    value: 'ALL'
  })
  const [filterIsCollected, setFilterIsCollected] = useState<FilterProps>({
    label: 'Não',
    value: 'NO'
  })

  function onChangeFilter(value: string) {
    setFilterStatus(filter.find(fil => fil.value === value)!)
    if (onChangeFilterStatus) onChangeFilterStatus(value)
  }

  function onChangeFilterIsCollected(value: string) {
    setFilterIsCollected(isCollected.find(fil => fil.value === value)!)
    if (onChangeFilterCollected) onChangeFilterCollected(value)
  }

  return (
    <Container
      style={{
        alignItems: 'flex-start',
        paddingBottom: 8,
        paddingTop: 0,
        width: '100%',
        backgroundColor: theme.colors.bottomSheet,
        gap: 8
      }}
    >
      <Input.Container label="Status">
        <Input.Select 
          value={filterStatus.value}
          enabled
          onChange={onChangeFilter}
          placeholder={filterStatus.label}
          items={filter}
        />
      </Input.Container>

      <Input.Container label="Pedido coletado">
        <Input.Select 
          value={filterIsCollected.value}
          enabled
          onChange={onChangeFilterIsCollected}
          placeholder={filterIsCollected.label}
          items={isCollected}
        />
      </Input.Container>
    </Container>
  )
}