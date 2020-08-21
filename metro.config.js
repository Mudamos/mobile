/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// This allows us to blacklist files when there are issues with metro
// This has happened before when using Reat in the Podfile.
// const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
 // resolver:{
 //   blacklistRE: blacklist([
 //     /android\/.*/,
 //     /ios\/.*/
 //   ])
 // },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
