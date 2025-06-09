import { Theme, ThemeName } from '@/types/theme'

export const themes: Record<ThemeName, Theme> = {
  dark: {
    name: 'dark',
    colors: {
      primaryText: '#DEDEDE',
      secondaryText: '#ABABAB',
      primaryBackground: '#181818',
      secondaryBackground: '#252525',
      border: '#404040',
      borderHover: '#333333'
    }
  },
  light: {
    name: 'light',
    colors: {
      primaryText: '#292929',
      secondaryText: '#8F8F8F',
      primaryBackground: '#FEFEFE',
      secondaryBackground: '#F6F6F6',
      border: '#E0E0E0',
      borderHover: '#D0D0D0'
    }
  }
}

export const defaultTheme: ThemeName = 'dark' 