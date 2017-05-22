const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch(type) {
    case "STATES_STATES_FETCHED":
      return {
        ...state,
        states: payload.states,
      };
    case "STATES_CLEAR_STATES":
      return {
        ...state,
        states: [],
      };
    default:
      return state;
  }
};