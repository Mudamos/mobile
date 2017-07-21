import {
  buildPlip,
  buildUser,
} from "../factories";

import {
  CITYWIDE_SCOPE,
  STATEWIDE_SCOPE,
  NATIONWIDE_SCOPE,
} from "../../src/utils";

import reducer from "../../src/reducers";

import {
  plipsFetched,
  plipUserSignInfo,
  updatedUserProfile,
} from "../../src/actions";

import {
  findPlips,
} from  "../../src/selectors";

describe("#findPlips", () => {
  it("returns the nation, state, city wide plips in this order", () => {
    const cityPlip = buildPlip({ seed: 1, scope: CITYWIDE_SCOPE });
    const nationPlip = buildPlip({ seed: 2, scope: NATIONWIDE_SCOPE });
    const statePlip = buildPlip({ seed: 3, scope: STATEWIDE_SCOPE });

    const state = [
      plipsFetched({ plips: [cityPlip, nationPlip, statePlip] }),
    ].reduce(reducer, reducer());

    const plips = findPlips(state);
    expect(plips).to.eql([nationPlip, statePlip, cityPlip]);
  });

  it("orders individually by phase initial date desc", () => {
    const cityPlipA = buildPlip({ seed: 1, scope: CITYWIDE_SCOPE });
    const cityPlipB = buildPlip({ seed: 2, scope: CITYWIDE_SCOPE });

    const state = [
      plipsFetched({ plips: [cityPlipA, cityPlipB] }),
    ].reduce(reducer, reducer());

    const plips = findPlips(state);
    expect(plips).to.eql([cityPlipB, cityPlipA]);
  });

  it("returns signed plips in the end", () => {
    const cityPlip = buildPlip({ seed: 1, scope: CITYWIDE_SCOPE });
    const nationPlip = buildPlip({ seed: 2, scope: NATIONWIDE_SCOPE });
    const statePlip = buildPlip({ seed: 3, scope: STATEWIDE_SCOPE });

    const signedCityPlip = buildPlip({ seed: 4, scope: CITYWIDE_SCOPE });
    const signedNationPlip = buildPlip({ seed: 5, scope: NATIONWIDE_SCOPE });
    const signedStatePlip = buildPlip({ seed: 6, scope: STATEWIDE_SCOPE });
    const signatureDate = "2017-10-06T23:59:59-03:00";

    const state = [
      plipsFetched({ plips: [
        cityPlip,
        nationPlip,
        statePlip,
        signedCityPlip,
        signedNationPlip,
        signedStatePlip,
      ]}),
      plipUserSignInfo({ plipId: signedCityPlip.id, info: { updatedAt: signatureDate }}),
      plipUserSignInfo({ plipId: signedNationPlip.id, info: { updatedAt: signatureDate }}),
      plipUserSignInfo({ plipId: signedStatePlip.id, info: { updatedAt: signatureDate }}),
    ].reduce(reducer, reducer());

    const plips = findPlips(state);
    expect(plips).to.eql([
      nationPlip,
      statePlip,
      cityPlip,
      signedNationPlip,
      signedStatePlip,
      signedCityPlip,
    ]);
  });

  describe("when user", () => {
    it("returns the user's city and state unsigned plips first", () => {
      const user = buildUser({ address: { city: "Várzea Paulista", uf: "SP" }});
      const cityPlip = buildPlip({ seed: 1, scope: CITYWIDE_SCOPE, scopeCoverage: {
        city: { name: user.address.city, uf: user.address.uf },
      }});
      const nationPlip = buildPlip({ seed: 2, scope: NATIONWIDE_SCOPE });
      const statePlip = buildPlip({ seed: 3, scope: STATEWIDE_SCOPE });

      const signedCityPlip = buildPlip({ seed: 4, scope: CITYWIDE_SCOPE });
      const signedNationPlip = buildPlip({ seed: 5, scope: NATIONWIDE_SCOPE });
      const signedStatePlip = buildPlip({ seed: 6, scope: STATEWIDE_SCOPE });
      const signatureDate = "2017-10-06T23:59:59-03:00";

      const state = [
        updatedUserProfile({ user }),
        plipsFetched({ plips: [
          cityPlip,
          nationPlip,
          statePlip,
          signedCityPlip,
          signedNationPlip,
          signedStatePlip,
        ]}),
        plipUserSignInfo({ plipId: signedCityPlip.id, info: { updatedAt: signatureDate }}),
        plipUserSignInfo({ plipId: signedNationPlip.id, info: { updatedAt: signatureDate }}),
        plipUserSignInfo({ plipId: signedStatePlip.id, info: { updatedAt: signatureDate }}),
      ].reduce(reducer, reducer());

      const plips = findPlips(state);
      expect(plips).to.eql([
        cityPlip,
        statePlip,
        nationPlip,
        signedNationPlip,
        signedStatePlip,
        signedCityPlip,
      ]);
    });
  })
});
