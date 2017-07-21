import {
  CITYWIDE_SCOPE,
  STATEWIDE_SCOPE,
  NATIONWIDE_SCOPE,
  moment,
} from "../utils";

import { currentUser } from "./profile";

import {
  contains,
  flatten,
  groupBy,
  prop,
  sort,
} from "ramda";

export const errorFetchingPlips = state => state.plip.errorFetchingPlips;

export const isFetchingPlips = state => state.plip.isFetchingPlips;

export const isRefreshingPlips = state => state.plip.isRefreshingPlips;

export const findPlips = state => {
  const plips = state.plip.plips || [];
  const address = (currentUser(state) || {}).address;
  const normalize = str => (str || "").toLowerCase();
  const getTime = date => moment(date).toDate().getTime();
  const orderPlips = plips => sort((a, b) => getTime(b.phase.initialDate) - getTime(a.phase.initialDate), plips || []);
  const groupBySignature = groupBy(({ id }) => hasUserSignedPlip(id)(state) ? "signed" : "unsigned");

  const userCityPlips = plips.filter(({ scopeCoverage }) => {
    return scopeCoverage.scope === CITYWIDE_SCOPE &&
           address &&
           normalize(address.uf) === normalize(scopeCoverage.city.uf) &&
           normalize(address.city) === normalize(scopeCoverage.city.name);
  }).filter(({ id }) => !hasUserSignedPlip(id)(state));

  const userStatePlips = plips.filter(({ scopeCoverage }) => {
    return scopeCoverage.scope === STATEWIDE_SCOPE &&
           address &&
           normalize(address.uf) === normalize(scopeCoverage.uf);
  }).filter(({ id }) => !hasUserSignedPlip(id)(state));

  const unsignedNationwidePlips = plips
    .filter(({ scopeCoverage }) => scopeCoverage.scope === NATIONWIDE_SCOPE)
    .filter(({ id }) => !hasUserSignedPlip(id)(state));

  const filteredIds = flatten([userCityPlips, userStatePlips, unsignedNationwidePlips]).map(prop("id"));
  const others = plips.filter(({ id }) => !contains(id, filteredIds));

  const signedNationwide = others.filter(({ scopeCoverage }) => scopeCoverage.scope === NATIONWIDE_SCOPE);
  const otherStatewide = groupBySignature(others.filter(({ scopeCoverage }) => scopeCoverage.scope === STATEWIDE_SCOPE));
  const otherCitywide = groupBySignature(others.filter(({ scopeCoverage }) => scopeCoverage.scope === CITYWIDE_SCOPE));

  return flatten([
    orderPlips(userCityPlips),
    orderPlips(userStatePlips),
    orderPlips(unsignedNationwidePlips),
    orderPlips(otherStatewide["unsigned"]),
    orderPlips(otherCitywide["unsigned"]),
    orderPlips(signedNationwide),
    orderPlips(otherStatewide["signed"]),
    orderPlips(otherCitywide["signed"]),
  ]);
}

export const isSigningPlip = state => state.plip.isSigning;

export const getUserSignInfo = state => state.plip.userSignInfo;

export const getPlipSignInfo = state => state.plip.plipSignInfo;

export const getUserCurrentPlipSignInfo = (state, plipId) => (getUserSignInfo(state) || {})[plipId];

export const hasUserSignedPlip = plipId => state => !!((getUserCurrentPlipSignInfo(state, plipId) || {}).updatedAt)

export const hasUserJustSignedPlip = (state, plipId) => state.plip.justSignedPlips[plipId];

export const getCurrentPlipShortSignersInfo = state => ({
  users: state.plip.shortSigners,
  total: state.plip.shortSignersTotal,
});

export const isFetchingPlipSigners = state => state.plip.isFetchingSigners;

export const getPlipSigners = state => state.plip.signers;

export const hasSignersFetchError = state => state.plip.signersFetchError;

export const getCurrentSigningPlip = state => state.plip.currentSigningPlip;

export const wasUserSiginingBefore = state => getCurrentSigningPlip(state);

export const isFetchingPlipRelatedInfo = state => state.plip.isFetchingPlipRelatedInfo;

export const fetchPlipRelatedInfoError = state => state.plip.fetchPlipRelatedInfoError;

export const findPlipsSignInfo = state => state.plip.plipsSignInfo;
