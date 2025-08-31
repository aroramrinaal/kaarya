import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export function useAppFonts() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'PlayfairDisplay-Regular': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
          'PlayfairDisplay-Medium': require('../assets/fonts/PlayfairDisplay-Medium.ttf'),
          'PlayfairDisplay-SemiBold': require('../assets/fonts/PlayfairDisplay-SemiBold.ttf'),
          'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
          'PlayfairDisplay-Black': require('../assets/fonts/PlayfairDisplay-Black.ttf'),
        });
        if (isMounted) setLoaded(true);
      } catch (e) {
        console.warn('Error loading fonts:', e);
        if (isMounted) setLoaded(true);
      }
    }
    loadFonts();
    return () => {
      isMounted = false;
    };
  }, []);

  return loaded;
}


