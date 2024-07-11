import SecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
import { createContext, ReactNode, useEffect, useState } from "react";

type AppContextProps = {
  user_id: string
  storeUserId: (userId: string) => void
  enableSwipeDrawer: boolean
  handleSwipeDrawer: (swipeDrawer: boolean) => void
  isFirstOpenApp: boolean
  handleFirstOpenApp:  () => void
}

export const AppContext = createContext<AppContextProps>({
  user_id: '',
  storeUserId: (userId) => {},
  enableSwipeDrawer: true,
  handleSwipeDrawer: (swipeDrawer) => {},
  isFirstOpenApp: true,
  handleFirstOpenApp:  () => {}
})

type AppProviderProps = {
  children: ReactNode
}

const FIRST_RUN_APP = 'FIRST_RUN_APP'

export function AppProvider({ children }: AppProviderProps) {
  const [user_id, setUserId] = useState('')
  const [enableSwipeDrawer, setEnableSwipeDrawer] = useState(true)
  const [isFirstOpenApp, setFirstOpenApp] = useState(true)

  function handleSwipeDrawer(swipeDrawer: boolean) {
    setEnableSwipeDrawer(swipeDrawer)
  }

  function storeUserId(userId: string) {
    setUserId(userId)
  }

  async function handleFirstOpenApp() {
    await SecureStorage.setItem(
      FIRST_RUN_APP, 
      JSON.stringify({ isFirstOpenApp: false }),
      { accessible: ACCESSIBLE.ALWAYS }
    )
    setFirstOpenApp(false)
  }

  async function onGetStorageFirstApp() {
    try {
      const isExists = await SecureStorage.exist(FIRST_RUN_APP)
  
      if (!isExists) {
        setFirstOpenApp(true)
      }

      const data =  await SecureStorage.getItem(FIRST_RUN_APP)

      if (!data) {
        return
      }
  
      const { isFirstOpenApp } = JSON.parse(data)
  
      setFirstOpenApp(isFirstOpenApp)
    } catch (error) {
      setFirstOpenApp(true)
    }
    
  }

  useEffect(() => {
    onGetStorageFirstApp()
  }, [])

  return (
    <AppContext.Provider 
      value={{ 
        user_id,
        storeUserId,
        enableSwipeDrawer,
        handleSwipeDrawer,
        isFirstOpenApp,
        handleFirstOpenApp
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

