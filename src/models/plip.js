import {
  allPass,
  pipe,
  prop,
  propEq,
} from "ramda";

import {
  CITYWIDE_SCOPE,
  STATEWIDE_SCOPE,
  includes,
  isBlank,
} from "../utils";

export const isNationalCause = plip => allPass([
  pipe(prop("cityName"), isBlank),
  pipe(prop("uf"), isBlank),
  pipe(prop("scopeCoverage"), includes([CITYWIDE_SCOPE, STATEWIDE_SCOPE])),
])(plip);

export const isStateNationalCause = plip => allPass([
  pipe(prop("uf"), isBlank),
  propEq("scopeCoverage", STATEWIDE_SCOPE),
])(plip);

export const isCityNationalCause = plip => allPass([
  pipe(prop("cityName"), isBlank),
  propEq("scopeCoverage", CITYWIDE_SCOPE),
])(plip);

export const isUserGoals = ({ user, plip }) => {
  if (!user || !isNationalCause(plip)) return false;

  if (isStateNationalCause(plip)) {
    return !!user.address.uf;
  }

  return !!user.address.uf && !!user.address.city;
};

export const calcCustomTotalSignatures = (signaturesCount) => {
  if (!signaturesCount) return null;

  let signaturesLength = 0;
  let signatures = signaturesCount;

  while (signatures >= 10) {
    signatures /= 10;
    signaturesLength++;
  }

  return Math.floor(signatures) * Math.pow(10, signaturesLength);
}
