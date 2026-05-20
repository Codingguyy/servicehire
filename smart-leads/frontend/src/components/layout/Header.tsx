import React from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

interface Props { onMenuToggle: () => void; title: string }

export const Header: React.FC<Props> = ({ onMenuToggle, title }) => {
  const { theme, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-13 px-4 lg:px-5 bg-white/80 dark:bg-surface/80 backdrop-blur-md border-b border-gray-100 dark:border-surface-border h-[52px]">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-hover transition-colors lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h1>
      </div>
      <button onClick={toggle} className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-hover transition-colors" aria-label="Toggle theme">
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  )
}
