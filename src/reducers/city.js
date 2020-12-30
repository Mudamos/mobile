const initialState = {
  cities: [],
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "CITIES_CITIES_FETCHED":
      return {
        ...state,
        cities: payload.cities,
      };
    case "PROFILE_CLEAR_VOTE_ADDRESS_DATA":
    case "CITIES_CLEAR_CITIES":
      return {
        ...state,
        cities: [],
      };
    default:
      return state;
  }
};
