import { map, prop } from "ramda";

const extractValue = map(prop("value"));

const initialState = {
  plipRemainingDaysEnabled: false,
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "FEATURE_FETCHED_FEATURE_TOGGLES": {
      const { features } = payload;
      const toggles = extractValue(features);

      return {
        ...state,
        ...toggles,
      };
    }
    default:
      return state;
  }
};
