import { z } from "zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityIndicator, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { ChevronLeft, RefreshCw, Search } from "lucide-react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Title } from "./Title";
import { Input } from "./Input";
import { DrawerMenu } from "./DrawerMenu";

const schemaData = z.object({
  search: z.string()
})

export type FormData = z.infer<typeof schemaData>

type HeaderProps = {
  onReload?: () => void
  onSearch?: (data: FormData) => void
  title: string
  reloading?: boolean
  searching?: boolean
  placeholder: string
}

export function Header({ onReload, onSearch, title, reloading = false, searching = false, placeholder }: HeaderProps) {
  const { styles, theme } = useStyles(style)
  const [activeSearch, setActiveSearch] = useState(false)
  const { control, reset, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schemaData)
  })

  function handleReload() {
    if (onReload) onReload();
  }

  async function handleSearch(data: FormData) {
    await schemaData.parseAsync(data)

    if (onSearch) onSearch(data);
  }

  function handleActiveSearch() {
    setActiveSearch(true)
  }

  function handleDesactiveSearch() {
    setActiveSearch(false)
    reset({ search: '' })

    if (onReload) onReload();
  }

  return (
    <View style={styles.headerContainer}>
      {activeSearch ? (
        <>
          <View style={styles.backButtonContainer}>
            <RectButton style={styles.backButton} onPress={handleDesactiveSearch}>
              <ChevronLeft size={16} color={theme.colors.title} />
            </RectButton>

            <Input.Container label="" style={{ marginTop: -24, width: '65%', height: 52 }}>
              <Controller 
                control={control}
                name="search"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input.InputText 
                    placeholder={placeholder}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    editable
                    style={{ fontSize: 14, width: '100%' }}
                  />
                )}
              />
            </Input.Container>

            <RectButton 
              enabled={!searching}
              style={styles.reloadButton} 
              onPress={handleSubmit(handleSearch)}
            >
              {searching ? (
                <ActivityIndicator color={theme.colors.title} style={{ width: 16, height: 16 }} />
              ) : (
                <Search size={16} color={theme.colors.title} />
              )}
            </RectButton>
          </View>
        </>
      ) : (
        <>
          <View style={styles.backButtonContainer}>
            <DrawerMenu />
            <Title label={title} size="lg" style={{ textAlign: 'left', fontSize: 28 }} />
          </View>
          
          <View style={styles.buttonContainer}>
            <RectButton style={styles.reloadButton} onPress={handleActiveSearch}>
              <Search size={16} color={theme.colors.title} />
            </RectButton>

            <RectButton 
              enabled={!reloading}
              style={styles.reloadButton} 
              onPress={handleReload}
            >
              {reloading ? (
                <ActivityIndicator color={theme.colors.title} style={{ width: 16, height: 16 }} />
              ) : (
                <RefreshCw size={16} color={theme.colors.title} />
              )}
            </RectButton>
          </View>
        </>
      )}
      
    </View>
  )
}

const style = createStyleSheet((theme) => ({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },

  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  buttonContainer: {
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  reloadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.fonts.size.xs,
    backgroundColor: `${theme.colors.shape}60`,
    borderRadius: theme.fonts.size.xs,
    width: theme.fonts.size.base * 3,
    height: theme.fonts.size.base * 3,
  },

  backButton: {
    width: theme.fonts.size.base * 3,
    height: theme.fonts.size.base * 3,
    borderRadius: theme.fonts.size.base / 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bottomSheet
  },
}))