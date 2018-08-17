const initialState = {
  index: 0,
  routes: [
    { key: "nationwidePlips", title: "Nacional" },
    { key: "userLocationPlips", title: "Minha localidade" },
    { key: "allPlips", title: "Todos" },
    { key: "signedPlips", title: "Assinados" },
    { key: "favoritePlips", title: "Favoritos" },
  ],
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "UPDATE_MAIN_TAB_VIEW_INDEX":
      return {
        ...state,
        index: payload.index,
      };
    default:
      return state;
  }
}