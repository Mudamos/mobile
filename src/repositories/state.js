import statesData from "../states.json";

const list = () => Promise.resolve(statesData.states);

const repository = {
  list,
  listSync: () => statesData.states,
};

export default repository;
