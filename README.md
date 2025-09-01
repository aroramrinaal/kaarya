# kaarya

Background #FAEBD7 and text #90574D

## Version History

### v1.0.3 - Sep 01, 2025
- ✨ You can finally add tasks from future and past dates

### v1.0.2 - Jun 23, 2025
- Even Faster Onboarding

### v1.0.1 - Jun 22, 2025
- Introduced dark theme support with a theme toggle

### v1.0.0 - Jun 20, 2025
- Initial Release


## Commands

### run iOS with widget (simulator)
To rebuild native iOS (including the widget) and run on Simulator:
```bash
npx expo prebuild -p ios --clean
npx expo run:ios
```
Notes:
- The clean prebuild regenerates the native project and links the widget target.
- You can also open Xcode with `xed ios` and run either the app or the widget target directly.

### optional dev test build
```bash
eas build --profile development --platform ios 
```

### clean build
```bash
npx expo prebuild --clean
```

### actual prod build for testflight
```bash
eas build --platform ios
```

### then push it
```bash
eas submit --platform ios
```
