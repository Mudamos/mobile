import { is } from "ramda";

import { Buffer } from "buffer";


export const isString = is(String);

// eslint-disable-next-line no-undef
export const isDev = __DEV__;

export const toCredential = (email, password) => new Buffer(email + ":" + password).toString("base64");
