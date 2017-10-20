import {
  allPass,
  pipe,
  prop,
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
