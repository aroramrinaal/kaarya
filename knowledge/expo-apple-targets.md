## Expo Apple Targets

An experimental Expo Config Plugin that generates native Apple Targets like Widgets or App Clips, and links them outside the /ios directory. You can open Xcode and develop the targets inside the virtual expo:targets folder and the changes will be saved outside of the ios directory. This pattern enables building things that fall outside of the scope of React Native while still obtaining all the benefits of Continuous Native Generation.

## How to use (IMPORTANT)

1. Run npx create-target in your Expo project to generate an Apple target.

2. Select a target to generate, I recommend starting with a widget (e.g. npx create-target widget). This will generate the required widget files in the root /targets directory, install @bacons/apple-targets, and add the Expo Config Plugin to your project.

3. If you already know your Apple Team ID, then set it under the ios.appleTeamId property in your app.json. You can find this in Xcode under the Signing & Capabilities tab and set it later if needed.

4. Run npx expo prebuild -p ios --clean to generate the Xcode project.

5. You can now open your project in Xcode (xed ios) and develop the widget inside the expo:targets/<target> folder.

6. When you're ready to build, select the target in Xcode and build it.

## How it works
The root /targets folder is magic, each sub-directory should have a expo-target.config.js file that defines the target settings. When you run npx expo prebuild --clean, the plugin will generate the Xcode project and link the target files to the project. The plugin will also generate an Info.plist file if one doesn't exist.

The Config Plugin will link the subfolder (e.g. targets/widget) to Xcode, and all files inside of it will be part of the target. This means you can develop the target inside the expo:targets folder and the changes will be saved outside of the generated ios directory.

The root Info.plist file in each target directory is not managed and can be freely modified.

Any files in a top-level target/{name}/assets directory will be linked as resources of the target. This rule was added to support Safari Extensions.

## Entitlements
If the expo-target.config file defines an entitlements: {} object, then a generated.entitlements will be added. Avoid using this file directly, and instead update the expo-target.config.js file. If the entitlements object is not defined, you can manually add any top-level *.entitlements file to the target directory—re-running npx expo prebuild will link this file to the target as the entitlements file. Only one top-level *.entitlements file is supported per target.

Some targets have special entitlements behavior:

- App Clips (clip) automatically set the required com.apple.developer.parent-application-identifiers to $(AppIdentifierPrefix)${config.ios.bundleIdentifier}
- Targets that can utilize App Groups will automatically mirror the ios.entitlements['com.apple.security.application-groups'] array from the app.json if it's defined. This can be overwritten by specifying an entitlements['com.apple.security.application-groups'] array in the expo-target.config.js file.


## Development
Any changes you make outside of the expo:targets directory in Xcode are subject to being overwritten by the next npx expo prebuild --clean. Check to see if the settings you want to toggle are available in the Info.plist or the expo-target.config.js file. If you modify the expo-target.config.js or your root app.json, you will need to re-run npx expo prebuild --clean to sync the changes.

You can use the custom Prebuild template --template ./node_modules/@bacons/apple-targets/prebuild-blank.tgz to create a build without React Native, this can make development a bit faster since there's less to compile. This is an advanced technique for development NOT PRODUCTION and is not intended to be used with third-party Config Plugins.

## Target config
The target config can be a expo-target.config.js, or expo-target.config.json file.

This file can have the following properties:

```javascript   
/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: "widget",

  // Name of the target/product. Defaults to the directory name.
  name: "My Widget",

  // Generates colorset files for the target.
  colors: {
    // or "$accent": "red",
    $accent: { color: "red", darkColor: "blue" },
  },
  icon: "../assets/icon.png",
  // Can also be a URL
  frameworks: [
    // Frameworks with or without the `.frameworks` extension, these will be added to the target.
    "SwiftUI",
  ],
  entitlements: {
    // Serialized entitlements. Useful for configuring with environment variables.
  },
  // Generates xcassets for the target.
  images: {
    thing: "../assets/thing.png",
  },

  // The iOS version fot the target. Defaults to 18.0
  deploymentTarget: "15.1",

  // Optional bundle identifier for the target. Will default to a sanitized version of the root project bundle id + target name.
  // If the specified bundle identifier is prefixed with a dot (.), the bundle identifier will be appended to the main app's bundle identifier.
  bundleIdentifier: ".mywidget",

  // Should the release build export the JS bundle and embed. Intended for App Clips and Share Extensions where you may want to use React Native.
  exportJs: false,
};
```

You can also return a function that accepts the Expo Config and returns a target function for syncing entitlements and other values:

```javascript
/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",
  colors: {
    $accent: "steelblue",
  },
  entitlements: {
    // Use the same app groups:
    "com.apple.security.application-groups":
      config.ios.entitlements["com.apple.security.application-groups"],
    // Or generate an app group:
    "com.apple.security.application-groups": [
      `group.${config.ios.bundleIdentifier}.widget`,
    ],
  },
});
```

ESM and TypeScript are not supported in the target config. Stick to require for sharing variables across targets.

## Building Widgets

If you experience issues building widgets, it might be because React Native is shipped uncompiled which makes the build complexity much higher. This often leads to issues with the Swift compiler and SwiftUI previews.

Some workarounds:

- Clear the SwiftUI previews cache: xcrun simctl --set previews delete all
- Prebuild without React Native: npx expo prebuild --template ./node_modules/@bacons/apple-targets/prebuild-blank.tgz --clean
- If the widget doesn't show on the home screen when building the app, use iOS 18. You can long press the app icon and select the widget display options to transform the app icon into the widget.

### Sharing data between targets
To share values between the app and the target, you must use App Groups and NSUserDefaults. I've added a native module to make the React Native API a bit easier.

### Configuring App Groups
Start by defining an App Group, a good default is group.<bundle identifier>. App Groups can be used across apps so you may want something more generic or less generic if you plan on having multiple extensions.

First, define your main App Group entitlement in your app.json:

```json
{
  "expo": {
    "ios": {
      "entitlements": {
        "com.apple.security.application-groups": ["group.bacon.data"]
      }
    },
    "plugins": ["@bacons/apple-targets"]
  }
}
```

Second, define the same App Group in your target's expo-target.config.js:

```javascript
/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",
  entitlements: {
    // Use the same app groups:
    "com.apple.security.application-groups":
      config.ios.entitlements["com.apple.security.application-groups"],
  },
});
```

Now you can prebuild to generate the entitlements. You may need to create an EAS Build or open Xcode to sync the entitlements.

### Setting shared data
To define shared data, we'll use a native module (ExtensionStorage) that interacts with NSUserDefaults.

Somewhere in your Expo app, you can set a value:
```javascript
import { ExtensionStorage } from "@bacons/apple-targets";

// Create a storage object with the App Group.
const storage = new ExtensionStorage(
  // Your app group identifier. Should match the values in the app.json and expo-target.config.json.
  "group.bacon.data"
);

// Then you can set data:
storage.set("myKey", "myValue");

// Finally, you can reload the widget:
ExtensionStorage.reloadWidget();
```

ExtensionStorage has the following API:

- set(key: string, value: string | number | Record<string, string | number> | Array<Record<string, string | number>> | undefined): void - Sets a value in the shared storage for a given key. Setting undefined will remove the key.
- ExtensionStorage.reloadWidget(name?: string): void - A static method for reloading the widget. Behind the scenes, this calls WidgetCenter.shared.reloadAllTimelines(). If given a name, it will reload a specific widget using WidgetCenter.shared.reloadTimelines(ofKind: timeline).
- ExtensionStorage.reloadControls(name?: string): void - A static method for reloading the controls. Behind the scenes, this calls ControlCenter.shared.reloadAllControls(): void. If given a name, it will reload a specific widget using ControlCenter.shared.reloadControls(ofKind?: string): void.
- remove(key: string): void - A method for removing the key from the shared storage.
- get(key: string): string | null - A static method for getting the value from the shared storage.

### Accessing shared data
Assuming this is done using Swift code, you'll access data using NSUserDefaults directly. Here's an example of how you might access the data in a widget:
```swift
let defaults = UserDefaults(suiteName:
  // Use the App Group from earlier.
  "group.bacon.data"
)
// Access the value you set:
let index = defaults?.string(forKey: "myKey")
```