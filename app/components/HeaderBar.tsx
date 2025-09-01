import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { AppTheme } from '../../types';

// Timer SVG - COMMENTED OUT FOR NOW
// const getTimerSvg = (isActive: boolean, theme: AppTheme) => `
// <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M12 13V9M21 6L19 4M10 2H14M12 21C7.58172 21 4 17.4183 4 13C4 8.58172 7.58172 5 12 5C16.4183 5 20 8.58172 20 13C20 17.4183 16.4183 21 12 21Z" stroke="${isActive ? theme.background : theme.border}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
// `;

const getThemeSvg = (isDark: boolean, theme: AppTheme) => `
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
${isDark ? 
  `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="${theme.border}" stroke-width="2"/>` :
  `<circle cx="12" cy="12" r="5" fill="none" stroke="${theme.border}" stroke-width="2"/>
   <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="${theme.border}" stroke-width="2" stroke-linecap="round"/>`
}
</svg>
`;

type Props = {
  // Timer props commented out for now
  // isTimerVisible: boolean;
  // onToggleTimer: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  theme: AppTheme;
};

export default function HeaderBar({ isDarkTheme, onToggleTheme, theme }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {/* Timer button commented out for now */}
        {/* <TouchableOpacity 
          style={[styles.timerButton, { backgroundColor: theme.background }, isTimerVisible && { backgroundColor: theme.border }]}
          onPress={onToggleTimer}
          activeOpacity={0.7}
        >
          <SvgXml xml={getTimerSvg(isTimerVisible, theme)} width="28" height="28" />
        </TouchableOpacity> */}
      </View>
      <Text style={[styles.logoText, { color: theme.text }]}>कार्य</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: theme.background }]}
          onPress={onToggleTheme}
          activeOpacity={0.7}
        >
          <SvgXml xml={getThemeSvg(isDarkTheme, theme)} width="28" height="28" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logoText: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 40,
    color: '#90574D',
    fontWeight: '700',
  },
  // Timer button style commented out for now
  // timerButton: {
  //   padding: 12,
  //   borderRadius: 12,
  //   backgroundColor: '#FAEBD7',
  // },
  themeButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FAEBD7',
  },
});


