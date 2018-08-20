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

export const isFetchingPlipsNextPage = state => state.plip.isFetchingPlipsNextPage;

export const isRefreshingPlips = state => state.plip.isRefreshingPlips;

export const findPlip = id => state =>
  (findPlips(state) || []).find(propEq("id", id));

export const findPlips = state => {
  const {
    nationwidePlips,
    userLocationPlips,
    allPlips,
    favoritePlips,
    signedPlips,
  } = state.plip;

  return [
    ...nationwidePlips.plips,
    ...userLocationPlips.plips,
    ...allPlips.plips,
    ...favoritePlips.plips,
    ...signedPlips.plips,
  ] || [];
}

export const findNationwidePlips = state => state.plip.nationwidePlips.plips || [];

export const findUserLocationPlips = state => state.plip.userLocationPlips.plips || [];

export const findAllPlips = state => state.plip.allPlips.plips || [];

export const findUserFavoritePlips = state => state.plip.favoritePlips.plips || [];

export const findSignedPlips = state => state.plip.signedPlips.plips || [];

export const findNationwidePlipsNextPage = state => state.plip.nationwidePlips.nextPage;

export const findUserLocationPlipsNextPage = state => state.plip.userLocationPlips.nextPage;

export const findAllPlipsNextPage = state => state.plip.allPlips.nextPage;

export const findUserFavoritePlipsNextPage = state => state.plip.favoritePlips.nextPage;

export const findSignedPlipsNextPage = state => state.plip.signedPlips.nextPage;

export const sortPlips = plips => state => {
  const user = currentUser(state);
  const address = (user || {}).address;
  const normalize = str => (str || "").toLowerCase();
  const getTime = date => moment(date).toDate().getTime();
  const orderPlips = plips => sort((a, b) => getTime(b.initialDate) - getTime(a.initialDate), plips || []);
  // There is no concept for signed unsigned anymore
  const groupBySignature = groupBy(() => "unsigned");

  const userCityPlips = plips.filter(plip => {
    const { scopeCoverage, uf, cityName } = plip;

    return !isNationalCause(plip) && scopeCoverage === CITYWIDE_SCOPE &&
           address &&
           normalize(address.uf) === normalize(uf) &&
           normalize(address.city) === normalize(cityName);
  }).filter(({ id }) => !hasUserSignedPlip(id)(state));

  const userStatePlips = plips.filter(plip => {
    const { scopeCoverage, uf } = plip;

    return !isNationalCause(plip) && scopeCoverage === STATEWIDE_SCOPE &&
           address &&
           normalize(address.uf) === normalize(uf);
  }).filter(({ id }) => !hasUserSignedPlip(id)(state));

  const unsignedNationwidePlips = plips
    .filter(({ scopeCoverage }) => scopeCoverage === NATIONWIDE_SCOPE)
    .filter(({ id }) => !hasUserSignedPlip(id)(state));

  const filteredIds = [
    ...userCityPlips,
    ...userStatePlips,
    ...unsignedNationwidePlips,
  ].map(prop("id"));

  const others = plips.filter(pipe(prop("id"), excludes(filteredIds)));

  const signedNationwide = others.filter(({ scopeCoverage }) => scopeCoverage === NATIONWIDE_SCOPE);
  const otherStatewide = groupBySignature(others.filter(plip => !isNationalCause(plip) && plip.scopeCoverage === STATEWIDE_SCOPE));
  const otherCitywide = groupBySignature(others.filter(plip => !isNationalCause(plip) && plip.scopeCoverage === CITYWIDE_SCOPE));

  const stateNationalCause = groupBySignature(others.filter(plip => isNationalCause(plip) && plip.scopeCoverage === STATEWIDE_SCOPE));
  const cityNationalCause = groupBySignature(others.filter(plip => isNationalCause(plip) && plip.scopeCoverage === CITYWIDE_SCOPE));

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
};

export const listAllPlips = state => state.plip.allPlips;

export const getNextPlipsPage = state => state.plip.nextPlipsPage;

export const getCurrentPlipsPage = state => state.plip.currentPlipsPage;

export const getCurrentPlip = state => state.plip.currentPlip;

export const hasPlipsNextPage = state => !!getNextPlipsPage(state);

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
  const currentPlip = getCurrentPlip(state);
  const plip = findPlip(plipId)(state) || (currentPlip && currentPlip.id === plipId ? currentPlip : {});
  const { currentSignatureGoal } = getPlipSignInfo(plipId)(state) || {};

  const {
    initialSignaturesGoal: initialGoal,
    totalSignaturesRequired: finalGoal,
  } = plip;

  return { currentSignatureGoal, initialGoal, finalGoal };
};

export const getPlipsSignatureGoals = state =>
  (findPlips(state) || []).reduce((memo, { id }) => ({
    ...memo,
    [id]: getPlipSignatureGoals(id)(state),
  }), {});

export const findPlipBySlug = slug => state => {
  const plips = findPlips(state);

  if (plips) {
    return plips.find(plip => {
      const plipSlug = /\S+\/(\S+)\/plugins\/peticao\/?$/.exec(plip.plipUrl);

      if (plipSlug && plipSlug[1] === slug) {
        return true;
      }
    });
  }
}

export const mostRecentNationalPlip = state => findNationwidePlips(state) && findNationwidePlips(state)[0]
