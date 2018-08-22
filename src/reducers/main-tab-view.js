const initialState = {
  index: 0,
  routes: [
    { key: "nationwidePlips", title: "Nacional", fetchedPlips: false },
    { key: "userLocationPlips", title: "Minha localidade", fetchedPlips: false },
    { key: "allPlips", title: "Todos", fetchedPlips: false },
    { key: "signedPlips", title: "Assinados", fetchedPlips: false },
    { key: "favoritePlips", title: "Favoritos", fetchedPlips: false },
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