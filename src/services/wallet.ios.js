import LocalStorage from "./local-storage";
import UserDefaults from "react-native-user-defaults";

import crypto from "./crypto";

import LibCrypto from "mudamos-libcrypto";

import { always, nth, pipe, split } from "ramda";

import { isDev, moment } from "../utils";

const buildKey = (...args) => args.join(":");
const walletKey = "wallet";
const LANG = "BRAZILIAN-PORTUGUESE";

export default (root, { DeviceInfo, suite }) => {
  const storage = UserDefaults;
  const oldStorage = LocalStorage(root);

  const key = buildKey(root, walletKey);

  const create = async (password) => {
    const info = await DeviceInfo.info();
    if (isDev) console.log("Device info:", info);

    const entropy = [info.toString(), moment().toISOString()].join(";");

    const seed = LibCrypto.createSeedAndWallet(LANG, entropy);
    if (isDev) console.log("Seed:", seed);

    return persist(seed.seed, password).then(() => seed);
  };

  const valid = (password) =>
    retrieve(password).then(
      (currentSeed) => currentSeed && LibCrypto.validateSeed(currentSeed),
    );

  const persist = (seed, password) => {
    if (isDev) console.log("Will encrypt: ", seed, "password: ", password);

    const encryptedSeed = crypto.encrypt(seed, password);

    if (isDev) console.log("Seed encryption: ", encryptedSeed);
    if (!encryptedSeed) return Promise.reject();

    return storage.set(key, JSON.stringify(encryptedSeed), suite);
  };

  const retrieve = (password) => {
    return storage
      .get(key, suite)
      .then(JSON.parse)
      .catch(always(null)) // key is not present
      .then(async (encryptedSeed) => {
        if (isDev) {
          console.log("Retrieved encrypted wallet key:", encryptedSeed);
        }
        if (!encryptedSeed) {
          if (isDev) console.log("will try to migrate storage");
          const oldSeed = await oldStorage.fetch(walletKey);

          if (!oldSeed) return;

          await storage.set(key, JSON.stringify(oldSeed), suite);
          await oldStorage.destroy(walletKey);
          return retrieve(password);
        }

        if (isDev) console.log("Will decrypt with:", password);
        return crypto.decrypt(encryptedSeed, password);
      });
  };

  const publicKey = (password) =>
    retrieve(password)
      .then((seed) => {
        if (!seed) return;
        const message = "publicKey";
        const difficulty = 1;

        const block = LibCrypto.signMessage(seed, message, difficulty);
        const publicKey = pipe(split(";"), nth(1));

        return publicKey(block);
      })
      .catch(always(null));

  const destroy = () => storage.remove(key, suite);

  const exists = () =>
    storage
      .get(key, suite)
      .catch(always(false)) // key is not present
      .then(
        (seed) => !!seed || oldStorage.fetch(walletKey).then((seed) => !!seed),
      );

  return {
    create: create,
    valid: valid,
    exists: exists,
    persist: persist,
    publicKey: publicKey,
    retrieve: retrieve,
    destroy: destroy,
  };
};
