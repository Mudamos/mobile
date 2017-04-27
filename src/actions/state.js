export const fetchStates = () => ({
  type: "STATES_FETCH_STATES",
});

export const statesFetched = ({ states }) => ({
  type: "STATES_STATES_FETCHED",
  payload: { states },
});

export const clearStates = () => ({
  type: "STATES_CLEAR_STATES",
});
