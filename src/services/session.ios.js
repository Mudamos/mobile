import UserDefaults from "react-native-user-defaults";

const buildKey = (...args) => args.join(":");
const sessionKey = "session";

export default (root, { suite } = {}) => {
  const key = buildKey(root, sessionKey);
  const storage = UserDefaults;

  // TODO: provide a migration from the previous storage to this one
  // upon app launch copy from the old one and insert into the new one
  return {
    persist: value => storage.set(key, JSON.stringify(value), suite),
    retrieve: () => storage.get(key, suite)
      .then(session => session || Promise.reject())
      .then(JSON.parse)
      .catch(() => Promise.reject("No sesssion available")),
    destroy: () => storage.remove(key, suite),
  };
};
