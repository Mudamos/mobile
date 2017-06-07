import {
  curry,
} from "ramda";

import Firestack from "react-native-firestack";

const logEvent = (firestack, { name, extraData }) => firestack.analytics.logEventWithName(name, (extraData || {}));

const service = options => {
  const firestack = new Firestack(options);

  return {
    logEvent: curry(logEvent)(firestack),
  };
};

export default service;
