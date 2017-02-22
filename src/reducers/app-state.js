const initialState = {
  foreground: true,
};

export default (state = initialState, { type }) => {
  switch (type) {
    case "APP_ON_FOREGROUND":
      return { foreground: true }
    case "APP_ON_BACKGROUND":
      return { foreground: false }
    default:
      return state;
  }
};
