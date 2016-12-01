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
})

export const profileStateMachine = () => ({
  type: "USER_PROFILE_NAVIGATOR",
});
