const initialState = {
  index: 0,
  routes: [
    { key: 'national', title: 'Nacional' },
    { key: 'my_location', title: 'Minha localidade' },
    { key: 'signed', title: 'Assinados' },
    { key: 'favorites', title: 'Favoritos' },
  ],
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "UPDATE_MAIN_TABVIEW_INDEX":
      return {
        ...state,
        index: payload.index,
      };
    default:
      return state;
  }
}