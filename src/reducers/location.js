const initialState = {};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "LOCATION_FETCHING_LOCATION":
      return {
        ...state,
        isFetchingLocation: payload.isFetching,
      };
    case "LOCATION_FETCHED":
      return {
        ...state,
        location: {
          latitude: payload.latitude,
          longitude: payload.longitude,
        },
      };
    case "LOCATION_CLEAR":
      return {
        ...state,
        location: null,
      };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        location: null,
      };
    default:
      return state;
  }
};
