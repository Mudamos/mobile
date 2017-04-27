import statesData from "../states.json";

const list = () => Promise.resolve(statesData.states);

const repository = {
  list,
};

export default repository;
