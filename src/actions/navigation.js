export const navigate = (route, params = {}) => ({
  type: "NAVIGATE",
  payload: {
    route,
    params,
  },
});

export const navigateBack = () => ({
  type: "NAVIGATE_BACK",
});
