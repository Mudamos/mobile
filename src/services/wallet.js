import LocalStorage from "./local-storage";

import crypto from "./crypto";

import { isDev } from "../utils";

const key = "wallet";

export default root => {
  const storage = LocalStorage(root);

  return {
    persist: (seed, password) => {
      const encryptedSeed = crypto.encrypt(seed, password);

      if (isDev) console.log("Seed encryption: ", encryptedSeed);
      if (!encryptedSeed) return Promise.reject();

      return storage.store(key, encryptedSeed);
    },
    retrieve: password => {
      return storage.fetch(key)
        .then(encryptedSeed => {
          if (!encryptedSeed) return;

          return crypto.decrypt(encryptedSeed, password);
        });
    },
    destroy: () => storage.destroy(key),
  };
}
