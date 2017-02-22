const initialState = {
  unauthorized: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "PERMISSION_UNAUTHORIZED":
      return {
        ...state,
        unauthorized: state.notAuthorized.concat(payload.permission),
      };
    default:
      return state;
  }
}
