import {
  apply,
  concat,
  filter,
  find,
  fromPairs,
  head,
  is,
  isNil,
  last,
  mergeWith,
  pipe,
  propEq,
  reduce,
  reject,
  toPairs,
  unapply,
} from "ramda";

import statesData from "./states.json";

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

export const MUDAMOS_WEB_SITE = "https://www.mudamos.org";

export const MUDAMOS_APP_SITE = "https://app.mudamos.org";

export const NATIONWIDE_SCOPE = "nationwide";

export const STATEWIDE_SCOPE = "statewide";

export const CITYWIDE_SCOPE = "citywide";

export const isNationwideScope = scope => scope === NATIONWIDE_SCOPE;

export const isStatewideScope = scope => scope === STATEWIDE_SCOPE;

export const isCitywideScope = scope => scope === CITYWIDE_SCOPE;

export const isUnauthorized = error => error instanceof UnauthorizedError;

export const isString = is(String);

export const baseName = file => last(file.split("/"));

export const homeSceneKey = "plipsNav";

export const first = list => head(list || []);

export const findByStrIndex = (index, object) => (object || {})[String(index)];

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

export const homeLinks = {
  mudamos: { title: "Conheça Mudamos+", link: "https://www.mudamos.org" },
  projectsReason: { title: "Por que estes projetos de lei?", link: "https://www.mudamos.org/institucional/projetos-de-lei-de-iniciativa-popular" },
};

export const siteLinks = {
  homeLinks,
  sendYourIdea: "https://www.mudamos.org/envie-sua-ideia",
};

export const findStateByUF = uf => find(propEq("uf", uf), statesData.states);

export const findStateNameByUF = uf => (findStateByUF(uf) || {}).name;

export const remainingDays = ({ date }) => {
  const start = moment();
  const end = moment(date);

  // No days left because there are no more seconds left
  if (end.diff(start, "seconds") < 0) return;

  return end.diff(start, "days");
};

export const signatureEnabled = ({ finalDate }) => {
  const days = remainingDays({ date: finalDate });
  return days != null && days >= 0;
};

export const filterWithKeys = (pred, obj) => pipe(
  toPairs,
  filter(apply(pred)),
  fromPairs
)(obj);

export const pickObjNonNilValues = obj => filterWithKeys((_, val) => !isNil(val), obj);

export const concatLists = unapply(reduce((acc, list) => concat(acc, list || []), []));

export const randomItem = list => list[Math.floor(Math.random() * list.length)];
