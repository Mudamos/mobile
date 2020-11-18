import Geolocation from "@react-native-community/geolocation";

const getCurrentPosition = options => new Promise((resolve, reject) => {
  Geolocation.getCurrentPosition(
    resolve,
    reject,
    options,
  );
});

const service = {
  getCurrentPosition,
};

export default service;
