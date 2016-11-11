const initialState = {};

export default  (state = initialState, action) => {
  const { type } = action;
  console.log('le type', type)

  switch (type) {
    case "TEST":
      return { ...state, testing: 'yolo'};
    default:
      return state;
  }
};
