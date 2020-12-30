export const addressClear = () => ({
  type: "ADDRESS_CLEAR_LOCATION",
});

export const addressZipCodeSearch = (zipCode) => ({
  type: "ADDRESS_ZIP_CODE_SEARCH",
  payload: { zipCode },
});

export const addressZipCodeSearching = (isSearchingZipCode) => ({
  type: "ADDRESS_ZIP_CODE_SEARCHING",
  payload: { isSearchingZipCode },
});

export const addressZipCodeSearchError = (error) => ({
  type: "ADDRESS_ZIP_CODE_SEARCH_ERROR",
  payload: { error },
});

export const addressReverseZipCodeSearchError = (error) => ({
  type: "ADDRESS_REVERSE_ZIP_CODE_SEARCH_ERROR",
  payload: { error },
});

export const addressFound = (location) => ({
  type: "ADDRESS_FOUND",
  payload: { location },
});

export const addressZipCodeSearchWithCoords = ({ latitude, longitude }) => ({
  type: "ADDRESS_ZIP_CODE_SEARCH_WITH_COORDS",
  payload: { latitude, longitude },
});
