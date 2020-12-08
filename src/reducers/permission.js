import { uniq } from "ramda";

const initialState = {
  authorized: null,
  unauthorized: [],
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "PERMISSION_AUTHORIZED":
      return {
        ...state,
        authorized: payload.permission,
      };
    case "PERMISSION_UNAUTHORIZED":
      return {
        ...state,
        unauthorized: uniq([...state.unauthorized, payload.permission]),
      };
    default:
      return state;
  }
};
