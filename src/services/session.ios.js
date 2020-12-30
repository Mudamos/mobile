import UserDefaults from "react-native-user-defaults";
import LocalStorage from "./local-storage";
import { always } from "ramda";

const buildKey = (...args) => args.join(":");
const sessionKey = "session";

export default (root, { suite } = {}) => {
  const key = buildKey(root, sessionKey);
  const storage = UserDefaults;
  const oldStorage = LocalStorage(root);

  return {
    persist: (value) => storage.set(key, JSON.stringify(value), suite),
    retrieve: () =>
      storage
        .get(key, suite)
        .catch(always(null))
        .then(async (session) => {
          // Try migrate from old storage
          if (!session) {
            const oldSession = await oldStorage.fetch(sessionKey);
            if (!oldSession) return;

            await storage.set(key, JSON.stringify(oldSession), suite);
            await oldStorage.destroy(sessionKey);
            return JSON.stringify(oldSession);
          }

          return session;
        })
        .then((session) => session || Promise.reject())
        .then(JSON.parse)
        .catch(() => Promise.reject("No sesssion available")),
    destroy: () => storage.remove(key, suite),
  };
};
