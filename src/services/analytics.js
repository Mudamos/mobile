import analytics from "@react-native-firebase/analytics";

const logEvent = ({ name, extraData = {} }) =>
  analytics().logEvent(name, extraData);

const service = () => ({
  logEvent,
});

export default service;
