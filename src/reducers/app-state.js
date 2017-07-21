const initialState = {
  foreground: true,
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type } = action;

  switch (type) {
    case "APP_ON_FOREGROUND":
      return { foreground: true }
    case "APP_ON_BACKGROUND":
      return { foreground: false }
    default:
      return state;
  }
};
