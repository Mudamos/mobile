module.exports = {
  dependencies: {
    "react-native-firestack": {
      platforms: {
        ios: null, // disable iOS platform, other platforms will still autolink if provided
        android: null, // disable on Android
      },
    },

    // Manually linked on Android
    "react-native-fbsdk": {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },

    // Dependency of rn-viewpager
    "@react-native-community/viewpager": {
      platforms: {
        ios: null, // Autolink disable on iOS
        android: {}, // Forcing enabling because this is a dependency of a dependency. Just a Hack for now
      },
    },
  },
};
