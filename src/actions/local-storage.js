export const fetchIsUserFirstTime = () => ({
  type: "LOCAL_FETCH_IS_USER_FIRST_TIME",
});

export const fetchAboutAppFeedback = () => ({
  type: "LOCAL_FETCH_ABOUT_APP_FEEDBACK",
});

export const userFirstTimeFetched = ({ isUserFirstTime }) => ({
  type: "LOCAL_IS_USER_FIRST_TIME_FETCHED",
  payload: { isUserFirstTime },
});

export const aboutAppFeedbackFetched = ({ userFeedback }) => ({
  type: "LOCAL_ABOUT_APP_FEEDBACK_FETCHED",
  payload: { userFeedback },
})

export const userFirstTimeDone = () => ({
  type: "LOCAL_USER_FIRST_TIME_DONE",
});

export const userAboutAppFeedback = ({ questionAnswered, answer }) => ({
  type: "LOCAL_USER_ABOUT_APP_FEEDBACK",
  payload: { questionAnswered, answer },
});
