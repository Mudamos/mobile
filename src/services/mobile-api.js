import farfetch, { prefix, requestLogger, responseLogger } from "farfetch";
import { camelizeKeys } from "humps";

import {
  isDev,
  toCredential,
} from "../utils";


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


const handleResponseError = res => res
  .then(rejectErrorResponses)
  .catch(logError)
  .catch(defineErrorType);

const logError = err => {
  if (isDev) console.log("Raw error: ", err.message, err.stack, err.json);

  return Promise.reject(err);
};

const rejectErrorResponses = res => deserialize(res)
  .then(json =>  {
    const response = { response: res, json: camelizeKeys(json) };
    return json.status !== "success" ? Promise.reject(response) : response;
  });

const deserialize = res => res.json().then(camelizeKeys);

const getData = ({ json }) => json.data;

const defineErrorType = err => {
  const json = err.json || {};
  const data = json.data || {};

  return Promise.reject({ ...err, json, type: data.type || "unknown", userMessage: data.message });
};


const fbSignIn = ({ client }) => fbToken =>
  client
    .use(req => req.set("access_token", fbToken))
    .post("/auth/facebook/token")
      .then(getData)
      .then(json => json.accessToken);

const signIn = ({ client }) => (email, password) =>
  client
    .use(req => req.set("Authorization", "Basic " + toCredential(email, password)))
    .use(req => req.set("grant_type", "client_credentials"))
    .post("/auth/token")
    .then(getData)
    .then(json => json.accessToken);


export default function MobileApi(host) {
  const client = requester({ host });

  return {
    fbSignIn: fbSignIn({ client }),
    signIn: signIn({ client }),
  };
}
