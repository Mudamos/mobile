import citiesData from "../cities.json";

const list = () => Promise.resolve(citiesData.cities);

const repository = {
  list,
  listSync: () => citiesData.cities,
};

export default repository;
