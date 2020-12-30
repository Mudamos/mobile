module.exports = {
  dependencies: {
    "rn-viewpager": {
      platforms: {
        ios: null, // Autolink disabled on iOS
        android: null, // Autolink disabled on android
      },
    },
    // rn-viewpager dependency
    "@react-native-community/viewpager": {
      platforms: {
        ios: null, // Autolink disabled on iOS
        android: {}, // Forcing enabling because this is a dependency of a dependency. Just a Hack for now
      },
    },
  },
};
