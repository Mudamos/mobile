export const fetchFeatureToggles = () => ({
  type: "FEATURE_FETCH_FEATURE_TOGGLES",
});

export const featureTogglesFetched = features => ({
  type: "FEATURE_FETCHED_FEATURE_TOGGLES",
  payload: { features },
});
