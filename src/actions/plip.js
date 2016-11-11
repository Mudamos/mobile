export const fetchPlips = () => ({
  type: "FETCH_PLIPS"
});

export const plipsFetched = plips => ({
  type: "PLIPS_FETCHED",
  payload: { plips }
});
