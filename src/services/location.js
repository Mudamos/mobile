const getCurrentPosition = options => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    resolve,
    reject,
    options,
  );
});

const service = {
  getCurrentPosition,
};

export default service;
