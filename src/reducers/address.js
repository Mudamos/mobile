const initialState = {};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "ADDRESS_CLEAR_LOCATION":
      return {
        ...state,
        location: null,
      };
    case "ADDRESS_ZIP_CODE_SEARCHING":
      return {
        ...state,
        location: payload.isSearchingZipCode ? null : state.location,
        isSearchingZipCode: payload.isSearchingZipCode,
      };
    case "ADDRESS_FOUND":
      return {
        ...state,
        location: payload.location,
      };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        location: null,
        isSearchingZipCode: false,
      };
    default:
      return state;
  }
};
