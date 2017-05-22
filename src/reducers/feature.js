import { map, prop } from "ramda";

const extractValue = map(prop("value"));

const initialState = {
  plipRemainingDaysEnabled: true,
};

export default (state = initialState, { type, payload }) => {
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
}
