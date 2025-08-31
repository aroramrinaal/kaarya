import { AppTheme } from '../../types';

export const themes: Record<'light' | 'dark', AppTheme> = {
  light: {
    background: '#FAEBD7',
    text: '#90574D',
    cardBackground: '#FAEBD7',
    border: '#90574D',
    deleteBackground: '#E8D5C4',
    statusBarStyle: 'dark-content',
  },
  dark: {
    background: '#1A1611',
    text: '#F5E6D3',
    cardBackground: '#2A241F',
    border: '#D4A574',
    deleteBackground: '#3A2F26',
    statusBarStyle: 'light-content',
  },
};


