const initialState = {};

export default (state = initialState, action) => {
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
        isSearchingZipCode: payload.isSearchingZipCode,
      };
    case "ADDRESS_FOUND":
      return {
        ...state,
        location: payload.location,
      };
    default:
      return state;
  }
}
