import { findIndex, propEq } from "ramda";

export const defaultMainTabViewRoutes = [
  { key: "nationwidePlips", title: "Nacional" },
  { key: "userLocationPlips", title: "Minha localidade" },
  { key: "allPlips", title: "Todos" },
  { key: "signedPlips", title: "Assinados" },
  { key: "favoritePlips", title: "Favoritos" },
];

export const getMainTabViewKeyByIndex = index => defaultMainTabViewRoutes[index].key;

export const getMainTabViewIndexByKey = key => findIndex(propEq("key", key))(defaultMainTabViewRoutes)