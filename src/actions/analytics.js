export const logEvent = ({ name, extraData }) => ({
  type: "ANALYTICS_LOG_EVENT",
  payload: { name, extraData },
});
