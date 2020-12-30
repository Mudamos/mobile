export const fetchUserLocation = () => ({
  type: "LOCATION_FETCH_LOCATION",
});

export const fetchUserLocationError = (error) => ({
  type: "LOCATION_FETCH_LOCATION_ERROR",
  payload: { error },
});

export const fetchingLocation = (isFetching) => ({
  type: "LOCATION_FETCHING_LOCATION",
  payload: { isFetching },
});

export const locationFetched = ({ latitude, longitude }) => ({
  type: "LOCATION_FETCHED",
  payload: { latitude, longitude },
});

export const clearLocation = () => ({
  type: "LOCATION_CLEAR",
});
