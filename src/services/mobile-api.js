import farfetch, { prefix, requestLogger, responseLogger } from "farfetch";
import { camelizeKeys } from "humps";

import {
  isDev,
  isUnauthorized,
  toCredential,
} from "../utils";

import { UnauthorizedError } from "../models/net-error";


const requester = ({ host }) => {
  let builder = farfetch;

  if (isDev) {
    builder = builder
      .use(requestLogger())
      .use(responseLogger());
  }

  builder = builder
    .use(prefix(host))
    .use(req => req.set("Content-Type", "application/json"))
    .use(req => req.set("Accept", "application/json"))
    .use((req, execute) => ({
      ...req,
      execute: req => handleResponseError(execute(req)),
    }));

  return builder;
};

const serializeJson = req => ({ ...req, body: JSON.stringify(req.body) });

const handleResponseError = res => res
  .then(rejectErrorResponses)
  .catch(logError)
  .catch(defineErrorType);

const logError = err => {
  if (isDev) console.log("Raw error: ", err.message, err.stack, err.json);

  return Promise.reject(err);
};

const rejectErrorResponses = res => {
  if (res.status === 401) {
    return Promise.reject(new UnauthorizedError(res));
  }

  return deserialize(res)
    .then(json =>  {
      const response = { response: res, json: camelizeKeys(json) };
      return json.status !== "success" ? Promise.reject(response) : response;
    });
}

const deserialize = res => res.json().then(camelizeKeys);

const getData = ({ json }) => json.data;

const defineErrorType = err => {
  if (isUnauthorized(err)) return Promise.reject(err);

  const json = err.json || {};
  const data = json.data || {};

  return Promise.reject({
    ...err,
    json,
    type: data.type || "unknown",
    userMessage: json.status === "fail" && data.message,
    validations: data.validations,
  });
};

const authorizedClient = (client, token) =>
  client
    .use(req => req.set("Authorization", `Bearer ${token}`));


const fbSignIn = ({ client }) => fbToken =>
  client
    .use(req => req.set("access_token", fbToken))
    .post("/auth/facebook/token")
      .then(getData)
      .then(json => json.accessToken);

const signIn = ({ client }) => (email, password) =>
  client
    .use(req => req.set("Authorization", `Basic ${toCredential(email, password)}`))
    .use(req => req.set("grant_type", "client_credentials"))
    .post("/auth/token")
    .then(getData)
    .then(json => json.accessToken);

const signUp = ({ client }) => (authToken, payload) => {
  const api =  authToken ? authorizedClient(client, authToken) : client;

  return api
    .use(serializeJson)
    .post("/users/sign_up")
    .send({ user: payload })
    .then(getData);
};

const profile = ({ client }) => authToken =>
  authorizedClient(client, authToken)
    .get("/profile")
    .then(getData);

const saveBirthdate = ({ client }) => (authToken, birthdate) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/profile/birthday")
    .send({ user: { birthday: birthdate }})
    .then(getData);

const searchZipCode = ({ client }) => (authToken, zipCode) =>
  authorizedClient(client, authToken)
    .get(`/address/search/${zipCode}`)
    .then(getData);

const saveZipCode = ({ client }) => (authToken, zipCode) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/profile/zipcode")
    .send({ user: { zipcode: zipCode }})
    .then(getData);

const saveDocuments = ({ client }) => (authToken, { cpf, voteCard }) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/profile/documents")
    .send({ user: { cpf, voteidcard: voteCard }})
    .then(getData);

const savePhone = ({ client }) => (authToken, payload) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/profile/mobile")
    .send(payload)
    .then(getData);

const sendPhoneValidation = ({ client }) => (authToken, number) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/profile/mobile_pin")
    .send({ mobile: { number }})
    .then(getData);

const saveWallet = ({ client }) => (authToken, walletKey) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/profile/wallet")
    .send({ user: { walletKey }})
    .then(getData);

const fetchDifficulty = ({ client }) => authToken =>
  authorizedClient(client, authToken)
    .get("/config/difficulty")
    .then(getData)
    .then(data => parseInt(data.config.value, 10));

const signPlip = ({ client }) => (authToken, signMessage) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/message/sign")
    .send({ signMessage })
    .then(getData);

const userSignInfo = ({ client }) => (authToken, plipId) => {
  return Promise.resolve({});
  // eslint-disable-next-line no-unreachable
  return Promise.resolve({
    signMessage: { dateTime: "2016-11-14T19:20:30" },
  });
  // eslint-disable-next-line no-unreachable
  authorizedClient(client, authToken)
    .get(`/user/message/${plipId}`)
    .then(getData);
};

const plipSignInfo = ({ client }) => plipId => {
  return Promise.resolve({
    info: {
      updatedAt: "2016-11-14T19:20:30",
      blockchainAddress: "xpto address",
      signaturesCount: 777,
    },
  });
  // eslint-disable-next-line no-unreachable
  client
    .get(`/petition/${plipId}/info`)
    .then(getData);
};


export default function MobileApi(host) {
  const client = requester({ host });

  return {
    difficulty: fetchDifficulty({ client }),
    fbSignIn: fbSignIn({ client }),
    plipSignInfo: plipSignInfo({ client }),
    profile: profile({ client }),
    saveBirthdate: saveBirthdate({ client }),
    saveDocuments: saveDocuments({ client }),
    savePhone: savePhone({ client }),
    saveWallet: saveWallet({ client }),
    saveZipCode: saveZipCode({ client }),
    searchZipCode: searchZipCode({ client }),
    sendPhoneValidation: sendPhoneValidation({ client }),
    signIn: signIn({ client }),
    signUp: signUp({ client }),
    signPlip: signPlip({ client }),
    userSignInfo: userSignInfo({ client }),
  };
}
