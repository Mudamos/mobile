export const fetchIsUserFirstTime = () => ({
  type: "LOCAL_FETCH_IS_USER_FIRST_TIME",
});

export const userFirstTimeFetched = ({ isUserFirstTime }) => ({
  type: "LOCAL_IS_USER_FIRST_TIME_FETCHED",
  payload: { isUserFirstTime },
});

export const userFirstTimeDone = () => ({
  type: "LOCAL_USER_FIRST_TIME_DONE",
});
