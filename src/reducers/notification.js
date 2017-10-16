const initialState = {
  oneSignalUserInfo: {},
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "ONE_SIGNAL_USER_INFO_UPDATED": {
      const {
        city,
        email,
        uf,
      } = payload;

      return {
        ...state,
        oneSignalUserInfo: {
          ...state.oneSignalUserInfo,

          city,
          email,
          uf,
        },
      };
    }
    default:
      return state;
  }
}
