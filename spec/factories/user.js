import { Address, User } from "../../src/models";

const buildAddress = ({ seed = 1, uf = "SP", city } = {}) => {
  return new Address({
    city: city ? city : `City ${seed}`,
    uf,
  });
};

const buildUser = ({ seed = 1, address = {} }) => {
  return new User({
    id: seed,
    address: buildAddress({ ...address, seed }),
  });
};

export { buildUser };
