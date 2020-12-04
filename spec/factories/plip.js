import {
  CITYWIDE_SCOPE,
  STATEWIDE_SCOPE,
  NATIONWIDE_SCOPE,
} from "../../src/utils";

const buildScopeCoverage = ({ scope, uf = "SP", city }) => {
  switch (scope) {
    case CITYWIDE_SCOPE: {
      return {
        scope,
        city: city ? city : { name: "City name", uf },
      };
    }
    case STATEWIDE_SCOPE: {
      return { scope, uf };
    }
    default: {
      return { scope };
    }
  }
};

const buildPhase = ({ seed = 1, ...attrs }) => {
  return {
    initialDate: `2017-10-0${(seed % 9) + 1}T23:59:59-03:00`,

    ...attrs,
  };
};

const buildPlip = ({
  seed = 1,
  scope = NATIONWIDE_SCOPE,
  scopeCoverage = {},
  phase = {},
  ...attrs
} = {}) => {
  return {
    id: seed,
    scopeCoverage: buildScopeCoverage({ scope, ...scopeCoverage }),
    phase: buildPhase({ ...phase, seed }),

    ...attrs,
  };
};

export { buildPlip };
