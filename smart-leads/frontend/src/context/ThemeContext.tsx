import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'
interface ThemeCtx {theme: Theme; toggle:() =>void}
const ThemeContext = createContext<ThemeCtx|undefined>(undefined)

export const ThemeProvider:React.FC<{children:React.ReactNode}>=({children}) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) ?? 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{theme,toggle:()=>setTheme(p=>p==='dark'?'light':'dark')}}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme=() =>{
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
