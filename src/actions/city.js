export const fetchCities = () => ({
  type: "CITIES_FETCH_CITIES",
});

export const citiesFetched = ({ cities }) => ({
  type: "CITIES_CITIES_FETCHED",
  payload: { cities },
});

export const clearCities = () => ({
  type: "CITIES_CLEAR_CITIES",
});
