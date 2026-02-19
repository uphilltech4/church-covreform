import { createContext, useContext, useState, useEffect } from 'react'
import { settingsAPI } from '../services/api'

const ThemeContext = createContext()

const THEME_KEY = 'covreform_color_theme'

export const COLOR_THEMES = {
  blue: {
    label: 'Classic Blue',
    preview: ['#1a3a5c', '#c8963e'],
    vars: {
      '--primary': '#1a3a5c',
      '--primary-dark': '#0f2844',
      '--primary-light': '#2a5a8c',
      '--secondary': '#c8963e',
      '--secondary-light': '#ddb366',
      '--secondary-dark': '#a67b2e',
      '--accent': '#e8d5b0',
      '--bg-light': '#faf8f5',
      '--bg-cream': '#f5f0e8',
      '--bg-dark': '#1a1a2e',
      '--gradient-primary': 'linear-gradient(135deg, #1a3a5c 0%, #2a5a8c 100%)',
      '--gradient-gold': 'linear-gradient(135deg, #c8963e 0%, #ddb366 100%)',
      '--gradient-hero': 'linear-gradient(135deg, rgba(26,58,92,0.92) 0%, rgba(15,40,68,0.88) 100%)',
    },
  },
  gold: {
    label: 'Royal Gold',
    preview: ['#8B6914', '#1a1a2e'],
    vars: {
      '--primary': '#8B6914',
      '--primary-dark': '#6B4F0E',
      '--primary-light': '#B8942A',
      '--secondary': '#2c2c44',
      '--secondary-light': '#44445e',
      '--secondary-dark': '#1a1a2e',
      '--accent': '#f5e6c8',
      '--bg-light': '#fdfaf3',
      '--bg-cream': '#f8f0de',
      '--bg-dark': '#2c2415',
      '--gradient-primary': 'linear-gradient(135deg, #8B6914 0%, #B8942A 100%)',
      '--gradient-gold': 'linear-gradient(135deg, #2c2c44 0%, #44445e 100%)',
      '--gradient-hero': 'linear-gradient(135deg, rgba(139,105,20,0.92) 0%, rgba(107,79,14,0.88) 100%)',
    },
  },
  purple: {
    label: 'Elegant Purple',
    preview: ['#4A1A6B', '#c8963e'],
    vars: {
      '--primary': '#4A1A6B',
      '--primary-dark': '#361250',
      '--primary-light': '#6B3A8C',
      '--secondary': '#c8963e',
      '--secondary-light': '#ddb366',
      '--secondary-dark': '#a67b2e',
      '--accent': '#e8d0f0',
      '--bg-light': '#fbf8fd',
      '--bg-cream': '#f3edf8',
      '--bg-dark': '#1a1028',
      '--gradient-primary': 'linear-gradient(135deg, #4A1A6B 0%, #6B3A8C 100%)',
      '--gradient-gold': 'linear-gradient(135deg, #c8963e 0%, #ddb366 100%)',
      '--gradient-hero': 'linear-gradient(135deg, rgba(74,26,107,0.92) 0%, rgba(54,18,80,0.88) 100%)',
    },
  },
  teal: {
    label: 'Teal',
    preview: ['#00796B', '#8D6E37'],
    vars: {
      '--primary': '#00796B',
      '--primary-dark': '#004D40',
      '--primary-light': '#26A69A',
      '--secondary': '#8D6E37',
      '--secondary-light': '#B8944D',
      '--secondary-dark': '#6D5428',
      '--accent': '#B2DFDB',
      '--bg-light': '#F5FAFA',
      '--bg-cream': '#E8F5F3',
      '--bg-dark': '#1A2E2C',
      '--gradient-primary': 'linear-gradient(135deg, #00796B 0%, #26A69A 100%)',
      '--gradient-gold': 'linear-gradient(135deg, #8D6E37 0%, #B8944D 100%)',
      '--gradient-hero': 'linear-gradient(135deg, rgba(0,121,107,0.92) 0%, rgba(0,77,64,0.88) 100%)',
    },
  },
  forest: {
    label: 'Forest Green',
    preview: ['#2E5735', '#C8963E'],
    vars: {
      '--primary': '#2E5735',
      '--primary-dark': '#1B3D22',
      '--primary-light': '#4A7C53',
      '--secondary': '#C8963E',
      '--secondary-light': '#DDB366',
      '--secondary-dark': '#A67B2E',
      '--accent': '#C8E6C9',
      '--bg-light': '#F6FAF6',
      '--bg-cream': '#ECF4EC',
      '--bg-dark': '#1A2A1C',
      '--gradient-primary': 'linear-gradient(135deg, #2E5735 0%, #4A7C53 100%)',
      '--gradient-gold': 'linear-gradient(135deg, #C8963E 0%, #DDB366 100%)',
      '--gradient-hero': 'linear-gradient(135deg, rgba(46,87,53,0.92) 0%, rgba(27,61,34,0.88) 100%)',
    },
  },
  warm: {
    label: 'Warm Burgundy',
    preview: ['#7B2D3B', '#D4A76A'],
    vars: {
      '--primary': '#7B2D3B',
      '--primary-dark': '#5C1F2C',
      '--primary-light': '#A64D5E',
      '--secondary': '#D4A76A',
      '--secondary-light': '#E2BF8A',
      '--secondary-dark': '#B88C4F',
      '--accent': '#F2D9DC',
      '--bg-light': '#FDF8F8',
      '--bg-cream': '#F8EEEF',
      '--bg-dark': '#2A1A1E',
      '--gradient-primary': 'linear-gradient(135deg, #7B2D3B 0%, #A64D5E 100%)',
      '--gradient-gold': 'linear-gradient(135deg, #D4A76A 0%, #E2BF8A 100%)',
      '--gradient-hero': 'linear-gradient(135deg, rgba(123,45,59,0.92) 0%, rgba(92,31,44,0.88) 100%)',
    },
  },
  slate: {
    label: 'Modern Slate',
    preview: ['#37474F', '#FF8F00'],
    vars: {
      '--primary': '#37474F',
      '--primary-dark': '#263238',
      '--primary-light': '#546E7A',
      '--secondary': '#FF8F00',
      '--secondary-light': '#FFB300',
      '--secondary-dark': '#E65100',
      '--accent': '#CFD8DC',
      '--bg-light': '#FAFBFC',
      '--bg-cream': '#ECEFF1',
      '--bg-dark': '#1C2528',
      '--gradient-primary': 'linear-gradient(135deg, #37474F 0%, #546E7A 100%)',
      '--gradient-gold': 'linear-gradient(135deg, #FF8F00 0%, #FFB300 100%)',
      '--gradient-hero': 'linear-gradient(135deg, rgba(55,71,79,0.92) 0%, rgba(38,50,56,0.88) 100%)',
    },
  },
  crimson: {
    label: 'Deep Crimson',
    preview: ['#8B0000', '#DAA520'],
    vars: {
      '--primary': '#8B0000',
      '--primary-dark': '#660000',
      '--primary-light': '#B22222',
      '--secondary': '#DAA520',
      '--secondary-light': '#EEC44A',
      '--secondary-dark': '#B8860B',
      '--accent': '#F5DADA',
      '--bg-light': '#FDF8F8',
      '--bg-cream': '#F8EFEF',
      '--bg-dark': '#2A1010',
      '--gradient-primary': 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)',
      '--gradient-gold': 'linear-gradient(135deg, #DAA520 0%, #EEC44A 100%)',
      '--gradient-hero': 'linear-gradient(135deg, rgba(139,0,0,0.92) 0%, rgba(102,0,0,0.88) 100%)',
    },
  },
  ocean: {
    label: 'Ocean Breeze',
    preview: ['#01579B', '#00897B'],
    vars: {
      '--primary': '#01579B',
      '--primary-dark': '#002F6C',
      '--primary-light': '#0288D1',
      '--secondary': '#00897B',
      '--secondary-light': '#26A69A',
      '--secondary-dark': '#00695C',
      '--accent': '#B3E5FC',
      '--bg-light': '#F5FBFF',
      '--bg-cream': '#E1F5FE',
      '--bg-dark': '#0A1929',
      '--gradient-primary': 'linear-gradient(135deg, #01579B 0%, #0288D1 100%)',
      '--gradient-gold': 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
      '--gradient-hero': 'linear-gradient(135deg, rgba(1,87,155,0.92) 0%, rgba(0,47,108,0.88) 100%)',
    },
  },
}

function applyThemeVars(themeKey) {
  const theme = COLOR_THEMES[themeKey] || COLOR_THEMES.blue
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([prop, value]) => {
    root.style.setProperty(prop, value)
  })
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'blue'
  })

  useEffect(() => {
    applyThemeVars(theme)
  }, [theme])

  // Load saved theme from settings on first mount
  useEffect(() => {
    settingsAPI.get()
      .then(data => {
        if (data.colorTheme && COLOR_THEMES[data.colorTheme]) {
          setTheme(data.colorTheme)
          localStorage.setItem(THEME_KEY, data.colorTheme)
        }
      })
      .catch(() => {})
  }, [])

  const changeTheme = (themeKey) => {
    if (COLOR_THEMES[themeKey]) {
      setTheme(themeKey)
      localStorage.setItem(THEME_KEY, themeKey)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
