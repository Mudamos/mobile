import {
  Platform,
} from "react-native";

import {
  allPass,
  apply,
  complement,
  concat,
  contains,
  equals,
  filter,
  find,
  flip,
  fromPairs,
  head,
  is,
  isEmpty,
  isNil,
  last,
  mergeWith,
  not,
  pipe,
  propEq,
  reduce,
  reject,
  test,
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

import { isNationalCause } from "./models";

const DEFAULT_LOCALE = "pt-br";

moment.locale(DEFAULT_LOCALE);


export { moment };

const toLogTag = (...tags) => compact(tags).map(t => `[${t}]`).join(" ");

export const MUDAMOS_WEB_SITE = "https://www.mudamos.org";

export const MUDAMOS_APP_SITE = "https://app.mudamos.org";

export const NATIONWIDE_SCOPE = "nationwide";

export const STATEWIDE_SCOPE = "statewide";

export const CITYWIDE_SCOPE = "citywide";

export const ALL_SCOPE = "all";

export const different = complement(equals);

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

export const notEmpty = complement(isEmpty);

export const notNil = complement(isNil);

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

// slow start, slow end
export const countTimingFunction = (interval, progress) => interval * (1 - Math.sin(Math.PI*progress)) * 10;

export const isBlank = value => isNil(value) || isEmpty(value) || isBlankString(value);

export const isBlankString = value => allPass([isString, test(/^\s*$/)])(value);

export const isPresent = complement(isBlank);

export const includes = flip(contains);

export const excludes = complement(includes);

export const buildQueryString = params =>
  Object
    .keys(params)
    .map(k => {
        if (isNil(params[k])) return null;
        if (Array.isArray(params[k])) {
            return params[k]
                .map(val => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`)
                .join("&")
        }

        return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
    })
    .filter(value => not(isNil(value)))
    .join("&")

export const isNotNil = complement(isNil);

export const delay = duration => new Promise(r => setTimeout(r, duration));

export const backoff = (fn, { attempts, delay: duration = 100 } = {}) =>
  fn().catch(err => isNil(attempts) || attempts > 1
    ? delay(duration).then(() => backoff(fn, {
      attempts: isNil(attempts) ? attempts : attempts - 1,
      delay: duration * 2,
    }))
    : Promise.reject(err));

export const eligibleToSignPlip = ({ plip, user }) => {
  if (!user || !plip) return;

  const { scopeCoverage: scope, uf, cityName } = plip;
  const { uf: userUF, city: userCityName } = user.address;

  const matchUF = () => userUF && uf && userUF.toLowerCase() === uf.toLowerCase();
  const matchCity = () => userUF && uf && userCityName && cityName && userUF.toLowerCase() === uf.toLowerCase() && userCityName.toLowerCase() === cityName.toLowerCase();

  switch (scope) {
    case NATIONWIDE_SCOPE: return true;
    case STATEWIDE_SCOPE: return isBlank(userUF) || isNationalCause(plip) || matchUF();
    case CITYWIDE_SCOPE: return isBlank(userCityName) || isNationalCause(plip) || matchCity();
  }
}

// Read more about this email validation at http://emailregex.com/
/* eslint-disable no-useless-escape */
export const validateEmail = email => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)

export const errorMessageFromCode = ({ errorCode, locale }) => locale.errorsCode[errorCode];

export const isIOSVersionBellow11 = (Platform.OS === "ios") && (parseInt(Platform.Version, 10) <= 11);

export const plipRegion = plip => {
  if (!plip) return;

  switch (plip.scopeCoverage) {
    case STATEWIDE_SCOPE: return plip.uf;
    case CITYWIDE_SCOPE: return plip.cityName;
    default: return null;
  }
}
