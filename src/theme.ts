/**
 * Tokens centralizados de design do Material Design 3 (tema escuro Google Play).
 * Aplicacao da Aula 7 (StyleSheet e Flexbox): evita cores e espacamentos soltos.
 */
export const colors = {
  background: '#131314',
  surface: '#1E1F22',
  surfaceVariant: '#282A2C',
  primary: '#A8C7FA',
  primaryContainer: '#004A77',
  onPrimaryContainer: '#C2E7FF',
  text: '#E3E3E3',
  textSecondary: '#C4C7C5',
  textMuted: '#8E918F',
  border: '#444746',
  success: '#01875F',
  danger: '#F2B8B5',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export type ReaderThemeId = 'escuro' | 'sepia' | 'claro';

export interface ReaderThemePalette {
  label: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
}

export const readerThemes: Record<ReaderThemeId, ReaderThemePalette> = {
  escuro: {
    label: 'Escuro',
    background: '#131314',
    surface: '#1E1F22',
    text: '#E3E3E3',
    muted: '#8E918F',
    border: '#282A2C',
  },
  sepia: {
    label: 'Sépia',
    background: '#F4ECD8',
    surface: '#EADFC5',
    text: '#3D2E1E',
    muted: '#7A6448',
    border: '#D5C6A7',
  },
  claro: {
    label: 'Claro',
    background: '#FAFAFA',
    surface: '#EFEFEF',
    text: '#1F1F1F',
    muted: '#5F6368',
    border: '#DADCE0',
  },
};
