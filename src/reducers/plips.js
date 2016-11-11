const initialState = {};

export default  (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "PLIP_FETCHED":
      return { ...state, plip: payload.plip };
    default:
      return state;
  }
};
