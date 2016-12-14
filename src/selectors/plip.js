import { head } from "ramda";

export const findCurrentPlip = state => head(state.plip.plips || []) || {};

export const isFetchingPlips = state => !!state.plip.isFetchingPlips;

export const isSigningPlip = state => state.plip.isSigning;

export const errorFetchingPlips = state => state.plip.errorFetchingPlips;
