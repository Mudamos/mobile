const initialState = {};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch(type) {
    case "CITIES_CITIES_FETCHED":
      return {
        ...state,
        cities: payload.cities,
      };
    case "CITIES_CLEAR_CITIES":
      return {
        ...state,
        cities: [],
      };
    default:
      return state;
  }
};
