import AsyncStorage from "@react-native-community/async-storage";

import { curry } from "ramda";

const buildKey = (...args) => args.join(":");

const store = (namespace, key, value) =>
  AsyncStorage.setItem(buildKey(namespace, key), JSON.stringify(value));

const fetch = (namespace, key) =>
  AsyncStorage.getItem(buildKey(namespace, key)).then(
    (value) => value && JSON.parse(value),
  );

const destroy = (namespace, key) =>
  AsyncStorage.removeItem(buildKey(namespace, key));

const findOrCreate = curry((namespace, key, valueBuilder) =>
  fetch(namespace, key).then(async (persistedValue) => {
    if (persistedValue) return persistedValue;

    const value = await Promise.resolve().then(() => valueBuilder());
    return store(namespace, key, value).then(() => value);
  }),
);

const service = (namespace) => ({
  findOrCreate: findOrCreate(namespace),
  store: curry(store)(namespace),
  fetch: curry(fetch)(namespace),
  destroy: curry(destroy)(namespace),
});

export const defaultStorage = () => service("@Mudamos");

export default service;
