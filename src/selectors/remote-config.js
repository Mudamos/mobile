import {
  CITYWIDE_SCOPE,
  STATEWIDE_SCOPE,
} from "../utils";

export const findRemoteLinks = state => state.remoteConfig.links;
export const listRemoteConfig = state => state.remoteConfig.config;
export const getIneligiblePlipReasonForScope = scope => state => {
  const config = listRemoteConfig(state);

  switch (scope) {
    case CITYWIDE_SCOPE: return config.ineligibleToSignCitywidePlipReason;
    case STATEWIDE_SCOPE: return config.ineligibleToSignStatewidePlipReason;
  }
}
