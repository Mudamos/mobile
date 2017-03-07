import farfetch, { prefix, requestLogger, responseLogger } from "farfetch";
import { camelizeKeys } from "humps";

import {
  log,
  logError as logErrorUtil,
  isDev,
  isUnauthorized,
  toCredential,
} from "../utils";

import { identity } from "ramda";

import { UnauthorizedError } from "../models/net-error";


const requester = ({ host, version }) => {
  let builder = farfetch;

  if (isDev) {
    builder = builder
      .use(requestLogger())
      .use(responseLogger());
  }

  const fullURL = version ? `${host}/api/${version}` : host;

  builder = builder
    .use(prefix(fullURL))
    .use(req => req.set("Content-Type", "application/json"))
    .use(req => req.set("Accept", "application/json"))
    .use((req, execute) => ({
      ...req,
      execute: req => {
        log(req, { tag: "Request" });
        return handleResponseError(execute(req));
      },
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
  if (isDev) console.log("Api response:", res);

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
    errorCode: data.errorCode,
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

const reverseSearchZipCode = ({ client }) => (authToken, { latitude, longitude }) =>
  authorizedClient(client, authToken)
    .get(`/address/search/${latitude}/${longitude}/inverse`)
    .then(getData);

const saveZipCode = ({ client }) => (authToken, location) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/profile/zipcode")
    .send({ user: location })
    .then(getData);

const saveDocuments = ({ client }) => (authToken, { cpf, voteCard, termsAccepted }) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/profile/documents")
    .send({ user: { cpf, voteidcard: voteCard, termsAccepted }})
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

const userSignInfo = ({ client }) => (authToken, plipId) =>
  authorizedClient(client, authToken)
    .get(`/users/message/${plipId}`)
    .then(getData);

const plipSignInfo = ({ client }) => plipId =>
  client
    .get(`/petition/${plipId}/info`)
    .then(getData);

const logout = ({ client }) => authToken =>
  authorizedClient(client, authToken)
    .post("/auth/logout")
    .catch(() => {
      if (isDev) console.log("Logout failed, but skipping.");
    });

const retrievePassword = ({ client }) => email =>
  client
    .use(serializeJson)
    .post("/users/password/reset")
    .send({ user: { email } })
    .then(getData);

const changeForgotPassword = ({ client }) => ({ code, password }) =>
  client
    .use(serializeJson)
    .post("/users/password/update")
    .send({ user: { password, pincode: code } })
    .then(getData);

const changePassword = ({ client }) => (authToken, { currentPassword, newPassword }) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/users/password/update")
    .send({ user: { currentPassword, newPassword } })
    .then(getData);

const updateProfile = ({ client }) => (authToken, { birthdate, name, zipCode }) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/users/profile/update")
    .send({ user: { birthday: birthdate, name, zipcode: zipCode }})
    .then(getData);

const fetchShortPlipSigners = ({ client }) => (authToken, { plipId }) =>
  authorizedClient(client, authToken)
    .get(`/petition/${plipId}/false/votes/friends`)
    .then(getData);

const fetchOfflineShortPlipSigners = ({ client }) => ({ plipId }) =>
  client
    .get(`/petition/${plipId}/false/votes/friends`)
    .then(getData);

const fetchPlipSigners = ({ client }) => (authToken, { plipId }) =>
  authorizedClient(client, authToken)
    .get(`/petition/${plipId}/true/votes/friends`)
    .then(getData);

const fetchOfflinePlipSigners = ({ client }) => ({ plipId }) =>
  client
    .get(`/petition/${plipId}/true/votes/friends`)
    .then(getData);

const upload = ({ endpoint }) => (authToken, { contentType, name, uri, oldAvatarURL }) => {
  let progressListener = identity;
  const request = new XMLHttpRequest;

  const promise = new Promise((resolve, reject) => {
    const data = new FormData;
    log(`Will upload ${uri}`);

    if (uri) {
      data.append("file", { uri, name, type: contentType });
    }

    data.append("nonce", new Date().toISOString());

    if (oldAvatarURL) {
      data.append("avatar_url", oldAvatarURL);
    }

    request.open("POST", endpoint, true);
    request.setRequestHeader("Authorization", `Bearer ${authToken}`);

    request.upload.addEventListener("progress", event => {
      if (event.lengthComputable) {
        progressListener(event.loaded / event.total);
      }
    });

    request.addEventListener("load", () => {
      if (request.status === 401) {
        return reject(new UnauthorizedError(request.response));
      }

      try {
        const json = JSON.parse(request.response);
        return json.status !== "success" ? reject(json) : resolve(json);
      } catch (error) {
        logErrorUtil(error);
        reject(error);
      }
    });

    request.addEventListener("error", reject);

    request.send(data);
  });

  const uploader = {
    then: (...args) => promise.then(...args),
    catch: (...args) => promise.catch(...args),
    cancel: () => request.abort(),
    progress: listener => {
      progressListener = listener;
      return uploader;
    },
  };

  return uploader;
};


export default function MobileApi(host) {
  const client = requester({ host, version: "v1" });

  return {
    changePassword: changePassword({ client }),
    changeForgotPassword: changeForgotPassword({ client }),
    difficulty: fetchDifficulty({ client }),
    fbSignIn: fbSignIn({ client }),
    fetchOfflinePlipSigners: fetchOfflinePlipSigners({ client }),
    fetchPlipSigners: fetchPlipSigners({ client }),
    fetchOfflineShortPlipSigners: fetchOfflineShortPlipSigners({ client }),
    fetchShortPlipSigners: fetchShortPlipSigners({ client }),
    logout: logout({ client }),
    plipSignInfo: plipSignInfo({ client }),
    profile: profile({ client }),
    retrievePassword: retrievePassword({ client }),
    reverseSearchZipCode: reverseSearchZipCode({ client }),
    saveAvatar: upload({ endpoint: `${host}/api/v1/profile/photo` }),
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
    updateProfile: updateProfile({ client }),
    userSignInfo: userSignInfo({ client }),
  };
}
