export interface ThemeColors {
  primaryText: string
  secondaryText: string
  primaryBackground: string
  secondaryBackground: string
  border: string
  borderHover: string
}

export interface Theme {
  name: string
  colors: ThemeColors
}

export type ThemeName = 'dark' | 'light' 