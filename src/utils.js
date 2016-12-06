import {
  find,
  is,
  propEq,
} from "ramda";

import { Buffer } from "buffer";
import StringMask from "string-mask";

import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

export { moment };

export const isString = is(String);

// eslint-disable-next-line no-undef
export const isDev = __DEV__;

export const logError = (error, { tag }) => isDev && console.log(tag ? `[${tag}] ` : "", error.message, error.stack, error);

export const toCredential = (email, password) => new Buffer(`${email}:${password}`).toString("base64");

export const errorForField = (field, errors) => (find(propEq("key", field))(errors || []) || {}).message;

export const dateMask = (text, separator = "/") => StringMask.apply(text, `00${separator}00${separator}0000`);
export const cepMask = text => StringMask.apply(text, "00000-000");

export const toISODate = (value, format = "DD/MM/YYYY") => moment(value, format).format("YYYY-MM-DD");

export const extractNumbers = text => (String(text).match(/\d+/g) || []).join("");
