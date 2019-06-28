import AsyncStorage from "@react-native-community/async-storage";

import { curry } from "ramda";

const buildKey = (...args) => args.join(":");

const store = (namespace, key, value) =>
  AsyncStorage.setItem(buildKey(namespace, key), JSON.stringify(value));

const fetch = (namespace, key) =>
  AsyncStorage
    .getItem(buildKey(namespace, key))
    .then(value => value && JSON.parse(value));

const destroy = (namespace, key) =>
  AsyncStorage.removeItem(buildKey(namespace, key));

const service = namespace => ({
  store: curry(store)(namespace),
  fetch: curry(fetch)(namespace),
  destroy: curry(destroy)(namespace),
});

export const defaultStorage = () => service("@Mudamos");

export default service;
