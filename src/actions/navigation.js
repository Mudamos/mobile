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

export const navigationHappened = ({ sceneKey }) => ({
  type: "NAVIGATION",
  payload: { sceneKey },
});

export const profileStateMachine = (params = {}) => ({
  type: "USER_PROFILE_NAVIGATOR",
  payload: { params: params || {} },
});

export const unauthorized = (params = {}) => ({
  type: "NAVIGATE_UNAUTHORIZED",
  payload: { params },
});
