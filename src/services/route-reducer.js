import { Reducer } from "react-native-router-flux";

import { navigationHappened } from "../actions";


export default store => params => {
  const defaultReducer = new Reducer(params);

  return (state, action) => {
    const sceneKey = action && action.scene && action.scene.sceneKey;

    if (sceneKey) {
      store.dispatch(navigationHappened({ sceneKey }));
    }

    return defaultReducer(state, action);
  };
};
