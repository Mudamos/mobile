module.exports = {
  root: true,
  extends: "@react-native-community",
  env: {
    jest: true,
  },
  rules: {
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "curly": ["error", "multi-line"],
    "jest/no-disabled-tests": "off",
    "no-console": "off",
    "no-shadow": "off",
    "quotes": [
      "error",
      "double",
      { avoidEscape: true }
    ],
    "react/sort-prop-types": [
      "warn",
      {
        "callbacksLast": true
      }
    ]
  }
};
