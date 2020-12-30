import { curry } from "ramda";

export const isFeatureEnabled = (feature, state) => state.feature[feature];

export const isRemainingDaysEnabled = curry(isFeatureEnabled)(
  "plipRemainingDaysEnabled",
);
