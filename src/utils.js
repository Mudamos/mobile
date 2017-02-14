import {
  find,
  head,
  is,
  isNil,
  mergeWith,
  pipe,
  propEq,
  reject,
} from "ramda";

import { UnauthorizedError } from "./models/net-error";

import { Buffer } from "buffer";
import StringMask from "string-mask";

import numeral from "numeral";
import "numeral/locales/pt-br";

import moment from "moment";
import "moment/locale/pt-br";

const DEFAULT_LOCALE = "pt-br";

moment.locale(DEFAULT_LOCALE);


export { moment };

const toLogTag = (...tags) => compact(tags).map(t => `[${t}]`).join(" ");

export const isUnauthorized = error => error instanceof UnauthorizedError;

export const isString = is(String);

export const homeSceneKey = "plipsNav";

export const first = list => head(list || []);

// eslint-disable-next-line no-undef
export const isDev = __DEV__;

export const compact = list => reject(isNil, list);

export const log = (message, { level = "DEBUG", tag } = {}, ...args) => isDev && console.log(toLogTag(level, tag), message, ...args);

export const logError = (error, { tag } = {}) => log(error.message, { level: "ERROR", tag }, error.stack, error);

export const toCredential = (email, password) => new Buffer(`${email}:${password}`).toString("base64");

export const errorForField = (field, errors) => (find(propEq("key", field))(errors || []) || {}).message;

export const dateMask = (text, separator = "/") => StringMask.apply(text, `00${separator}00${separator}0000`);

export const cpfMask = text => StringMask.apply(text, "000.000.000-00");

export const phoneMask = text => StringMask.apply(text, "(00) 90000-0000");

export const voteCardMask = text => StringMask.apply(text, "0000.0000.0000");

export const zipCodeMask = text => StringMask.apply(text, "00000-000");

export const toISODate = (value, format = "DD/MM/YYYY") => moment(value, format).format("YYYY-MM-DD");

export const fromISODate = value => moment(value, "YYYY-MM-DD").format("DD/MM/YYYY");

export const extractNumbers = text => (String(text).match(/\d+/g) || []).join("");

export const formatNumber = (value, locale = DEFAULT_LOCALE) => {
  numeral.locale(locale);
  return numeral(value).format("0,0");
}

export const deepMerge = (a, b) => is(Object, a) && is(Object, b) ? mergeWith(deepMerge, a, b) : b;

export const stripAccents = text => {
  const patternLetters = /[öäüÖÄÜáàâãéèêúùûóòôÁÀÂÃÉÈÊÚÙÛÓÒÔßçÇ]/g;
  const table = {
    "ä": "a", "ö": "o", "ü": "u",
    "Ä": "A", "Ö": "O", "Ü": "U",
    "á": "a", "à": "a", "â": "a",
    "é": "e", "è": "e", "ê": "e",
    "ú": "u", "ù": "u", "û": "u",
    "ó": "o", "ò": "o", "ô": "o",
    "Á": "A", "À": "A", "Â": "A",
    "É": "E", "È": "E", "Ê": "E",
    "Ú": "U", "Ù": "U", "Û": "U",
    "Ó": "O", "Ò": "O", "Ô": "O",
    "ß": "s", "ç": "c", "Ç": "C",
    "ã": "a", "Ã": "A",
  };

  return text.replace(patternLetters, match => table[match] || match);
};

export const capitalizeWords = text => text.replace(/\b\w/g, l => l.toUpperCase());

export const removeSpaces = text => text.replace(/\s/g, "");

export const removeHyphens = text => text.replace(/-/g, "");

export const hashtagfy = (...texts) => texts
  .map(text => "#" + pipe(stripAccents, capitalizeWords, removeSpaces, removeHyphens)(text))
  .join(" ");

export const facebookPicURI = ({ id, type = "normal" }) => `https://graph.facebook.com/${id}/picture?type=${type}`;

export const cancelablePromise = promise => {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) =>
    promise
      .then(val => hasCanceled ? reject({ isCanceled: true }) : resolve(val))
      .catch(e => hasCanceled ? reject({ isCanceled: true }) : reject(e))
  );

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
};
