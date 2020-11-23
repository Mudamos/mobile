module.exports = {
  dependencies: {
    // Dependency of rn-viewpager
    "@react-native-community/viewpager": {
      platforms: {
        ios: null, // Autolink disable on iOS
        android: {}, // Forcing enabling because this is a dependency of a dependency. Just a Hack for now
      },
    },
  },
};
