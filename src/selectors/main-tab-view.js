export const getMainTabView = (state) => state.mainTabview;

export const getCurrentMainTabView = (state) => {
  const { index, routes } = getMainTabView(state);

  return routes[index].key;
};
