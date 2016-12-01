const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "NAVIGATION":
      return {
        ...state,
        currentKey: payload.sceneKey,
      };
    default:
      return state;
  }
};
