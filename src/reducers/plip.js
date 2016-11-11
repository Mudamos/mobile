const initialState = {};

export default  (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "PLIPS_FETCHED":
      return { ...state, plips: payload.plips };
    default:
      return state;
  }
};
