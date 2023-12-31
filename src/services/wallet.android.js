import LocalStorage from "./local-storage";

import crypto from "./crypto";

import LibCrypto from "mudamos-libcrypto";

import { always, nth, pipe, split } from "ramda";

import { isDev, moment } from "../utils";

const key = "wallet";
const LANG = "BRAZILIAN-PORTUGUESE";

export default (root, { DeviceInfo }) => {
  const storage = LocalStorage(root);

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

    return storage.store(key, encryptedSeed);
  };

  const retrieve = (password) => {
    return storage.fetch(key).then((encryptedSeed) => {
      if (isDev) console.log("Retrieved encrypted wallet key:", encryptedSeed);
      if (!encryptedSeed) return;

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

  const destroy = () => storage.destroy(key);

  const exists = () => storage.fetch(key).then((seed) => !!seed);

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
