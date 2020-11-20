module.exports = {
  dependencies: {
    "react-native-firestack": {
      platforms: {
        ios: null, // disable iOS platform, other platforms will still autolink if provided
        android: null, // disable on Android
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
