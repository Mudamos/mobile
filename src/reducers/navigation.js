const initialState = {};

export default (state = initialState, action) => {
  if (!action) return state;

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
