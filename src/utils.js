import {
  find,
  is,
  propEq
} from "ramda";

import { Buffer } from "buffer";


export const isString = is(String);

// eslint-disable-next-line no-undef
export const isDev = __DEV__;

export const toCredential = (email, password) => new Buffer(email + ":" + password).toString("base64");

export const errorForField = (field, errors) => (find(propEq("key", field))(errors || []) || {}).message;
