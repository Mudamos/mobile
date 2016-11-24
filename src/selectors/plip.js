import { head } from "ramda";

export const findCurrentPlip = state => head(state.plip.plips || []) || {};

export const isFetchingPlips = state => !!state.plip.isFetchingPlips;

export const errorFetchingPlips = state => state.plip.errorFetchingPlips;
