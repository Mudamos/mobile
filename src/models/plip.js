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
  pipe(prop("city"), isBlank),
  pipe(prop("uf"), isBlank),
  pipe(prop("scope"), includes([CITYWIDE_SCOPE, STATEWIDE_SCOPE])),
])(plip.scopeCoverage);

export const isStateNationalCause = plip => allPass([
  pipe(prop("uf"), isBlank),
  propEq("scope", STATEWIDE_SCOPE),
])(plip.scopeCoverage);

export const isCityNationalCause = plip => allPass([
  pipe(prop("city"), isBlank),
  propEq("scope", CITYWIDE_SCOPE),
])(plip.scopeCoverage);

export const isUserGoals = ({ user, plip }) => {
  if (!user || !isNationalCause(plip)) return false;

  if (isStateNationalCause(plip)) {
    return !!user.address.uf;
  }

  return !!user.address.uf && !!user.address.city;
};