import { defaultMainTabViewRoutes } from "../models";

const initialState = {
  index: 0,
  routes: defaultMainTabViewRoutes,
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "UPDATE_MAIN_TAB_VIEW_INDEX":
      return {
        ...state,
        index: payload.index,
      };
    default:
      return state;
  }
};
