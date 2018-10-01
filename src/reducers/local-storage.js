const initialState = {
  aboutAppUserFeedback: {},
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "LOCAL_IS_USER_FIRST_TIME_FETCHED":
      return { ...state, isUserFirstTime: payload.isUserFirstTime };
    case "LOCAL_ABOUT_APP_FEEDBACK_FETCHED":
      return { ...state, aboutAppUserFeedback: payload.userFeedback };
    case "LOCAL_USER_FIRST_TIME_DONE":
      return { ...state, isUserFirstTime: false };
    default:
      return state;
  }
};
