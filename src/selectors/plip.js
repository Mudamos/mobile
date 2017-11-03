import {
  CITYWIDE_SCOPE,
  STATEWIDE_SCOPE,
  NATIONWIDE_SCOPE,

  excludes,
  moment,
} from "../utils";

import {
  isNationalCause,
} from "../models";

import { currentUser } from "./profile";

import {
  groupBy,
  pipe,
  prop,
  propEq,
  sort,
} from "ramda";

export const errorFetchingPlips = state => state.plip.errorFetchingPlips;

export const isFetchingPlips = state => state.plip.isFetchingPlips;

export const isRefreshingPlips = state => state.plip.isRefreshingPlips;

export const findPlip = id => state =>
  (state.plip.plips || []).find(propEq("id", id));

export const findPlips = state => {
  const plips = state.plip.plips || [];
  const user = currentUser(state);
  const address = (user || {}).address;
  const normalize = str => (str || "").toLowerCase();
  const getTime = date => moment(date).toDate().getTime();
  const orderPlips = plips => sort((a, b) => getTime(b.phase.initialDate) - getTime(a.phase.initialDate), plips || []);
  const groupBySignature = groupBy(({ id }) => hasUserSignedPlip(id)(state) ? "signed" : "unsigned");

  const userCityPlips = plips.filter(plip => {
    const { scopeCoverage } = plip;

    return !isNationalCause(plip) && scopeCoverage.scope === CITYWIDE_SCOPE &&
           address &&
           normalize(address.uf) === normalize(scopeCoverage.city.uf) &&
           normalize(address.city) === normalize(scopeCoverage.city.name);
  }).filter(({ id }) => !hasUserSignedPlip(id)(state));

  const userStatePlips = plips.filter(plip => {
    const { scopeCoverage } = plip;

    return !isNationalCause(plip) && scopeCoverage.scope === STATEWIDE_SCOPE &&
           address &&
           normalize(address.uf) === normalize(scopeCoverage.uf);
  }).filter(({ id }) => !hasUserSignedPlip(id)(state));

  const unsignedNationwidePlips = plips
    .filter(({ scopeCoverage }) => scopeCoverage.scope === NATIONWIDE_SCOPE)
    .filter(({ id }) => !hasUserSignedPlip(id)(state));

  const filteredIds = [
    ...userCityPlips,
    ...userStatePlips,
    ...unsignedNationwidePlips,
  ].map(prop("id"));

  const others = plips.filter(pipe(prop("id"), excludes(filteredIds)));

  const signedNationwide = others.filter(({ scopeCoverage }) => scopeCoverage.scope === NATIONWIDE_SCOPE);
  const otherStatewide = groupBySignature(others.filter(plip => !isNationalCause(plip) && plip.scopeCoverage.scope === STATEWIDE_SCOPE));
  const otherCitywide = groupBySignature(others.filter(plip => !isNationalCause(plip) && plip.scopeCoverage.scope === CITYWIDE_SCOPE));

  const stateNationalCause = groupBySignature(others.filter(plip => isNationalCause(plip) && plip.scopeCoverage.scope === STATEWIDE_SCOPE));
  const cityNationalCause = groupBySignature(others.filter(plip => isNationalCause(plip) && plip.scopeCoverage.scope === CITYWIDE_SCOPE));

  return [
    ...orderPlips(userCityPlips),
    ...(user ? orderPlips(cityNationalCause["unsigned"]) : []),
    ...orderPlips(userStatePlips),
    ...(user ? orderPlips(stateNationalCause["unsigned"]) : []),
    ...orderPlips(unsignedNationwidePlips),
    ...(user ? [] : orderPlips(cityNationalCause["unsigned"])),
    ...(user ? [] : orderPlips(stateNationalCause["unsigned"])),
    ...orderPlips(otherStatewide["unsigned"]),
    ...orderPlips(otherCitywide["unsigned"]),
    ...orderPlips(signedNationwide),
    ...orderPlips(otherStatewide["signed"]),
    ...orderPlips(stateNationalCause["signed"]),
    ...orderPlips(otherCitywide["signed"]),
    ...orderPlips(cityNationalCause["signed"]),
  ];
}

export const isSigningPlip = state => state.plip.isSigning;

export const getUserSignInfo = state => state.plip.userSignInfo;

export const getPlipSignInfo = id => state => (findPlipsSignInfo(state) || {})[id];

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

export const getPlipSignatureGoals = plipId => state => {
  const plip = findPlip(plipId)(state) || {};
  const { currentSignatureGoal } = getPlipSignInfo(plipId)(state) || {};

  const {
    initialSignaturesGoal: initialGoal,
    totalSignaturesRequired: finalGoal,
  } = plip;

  return { currentSignatureGoal, initialGoal, finalGoal };
};

export const getPlipsSignatureGoals = state =>
  (state.plip.plips || []).reduce((memo, { id }) => ({
    ...memo,
    [id]: getPlipSignatureGoals(id)(state),
  }), {});
