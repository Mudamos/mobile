export const oneSignalUserInfoUpdated = ({ city, email, uf }) => ({
  type: "ONE_SIGNAL_USER_INFO_UPDATED",
  payload: {
    city,
    email,
    uf,
  },
});
