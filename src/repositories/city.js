import citiesData from "../cities.json";

const list = () => Promise.resolve(citiesData.cities);

const repository = {
  list,
};

export default repository;
