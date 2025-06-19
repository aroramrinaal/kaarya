# kaarya

Background #FAEBD7 and text #90574D


## Commands

### optional dev test build
```bash
eas build --profile development --platform ios 
```

### actual prod build for testflight
```bash
eas build --platform ios
```

### then push it
```bash
eas submit --platform ios
```