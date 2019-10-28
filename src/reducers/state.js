const initialState = {
  states: [],
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch(type) {
    case "STATES_STATES_FETCHED":
      return {
        ...state,
        states: payload.states,
      };
    case "PROFILE_CLEAR_VOTE_ADDRESS_DATA":
    case "STATES_CLEAR_STATES":
      return {
        ...state,
        states: [],
      };
    default:
      return state;
  }
};
