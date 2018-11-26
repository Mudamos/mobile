import farfetch, { prefix, requestLogger, responseLogger } from "farfetch";
import { camelizeKeys } from "humps";

import {
  buildQueryString,
  log,
  logError as logErrorUtil,
  isDev,
  isUnauthorized,
  toCredential,
} from "../utils";

import { identity } from "ramda";

import { UnauthorizedError } from "../models/net-error";

const getPagination = ({ response, ...args }) => ({
  page: parseInt(response.headers.get("X-Page") || 0, 10),
  nextPage: parseInt(response.headers.get("X-Next-Page"), 10) || null,

  ...args,
});

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


const fbSignIn = ({ client }) => ({ fbToken, plipId, block }) => {
  let requester = client
    .use(req => req.set("access_token", fbToken))
    .use(serializeJson)
    .post("/auth/facebook/token");

  const payload = { block };
  if (plipId) payload.petition = { versionId: plipId };

  return requester
    .send(payload)
    .then(getData)
    .then(json => json.accessToken);
};

const signIn = ({ client }) => (email, password) =>
  client
    .use(req => req.set("Authorization", `Basic ${toCredential(email, password)}`))
    .use(req => req.set("grant_type", "client_credentials"))
    .post("/auth/token")
    .then(getData)
    .then(json => json.accessToken);

const signUp = ({ client }) => (authToken, { user, plipId, block }) => {
  const api =  authToken ? authorizedClient(client, authToken) : client;
  const requestPayload = { user };

  if (plipId) {
    requestPayload.petition = { versionId: plipId };
  }

  if (block) {
    requestPayload.block = block;
  }

  return api
    .use(serializeJson)
    .post("/users/sign_up")
    .send(requestPayload)
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

const fetchDifficulty = ({ client }) => () =>
  client
    .get("/config/difficulty")
    .then(getData)
    .then(data => parseInt(data.config.value, 10));

const signPlip = ({ client }) => (authToken, signMessage) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/message/sign")
    .send({ signMessage })
    .then(getData);

const signMessage = ({ client }) => (authToken, { message }) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/message/sign/custom")
    .send({ message })
    .then(getData);

const userSignInfo = ({ client }) => (authToken, plipId) =>
  authorizedClient(client, authToken)
    .get(`/users/message/${plipId}`)
    .then(getData);

const plipSignInfo = ({ client }) => ({ authToken, plipId }) => {
  const api =  authToken ? authorizedClient(client, authToken) : client;

  return api
    .get(`/petition/${plipId}/info`)
    .then(getData);
};

const userFavoriteInfo = ({ client }) => ( authToken, { detailId }) =>
  authorizedClient(client, authToken)
    .get(`/favorites/${detailId}/info`)
    .then(getData)

const logout = ({ client }) => authToken =>
  authorizedClient(client, authToken)
    .post("/auth/logout")
    .catch(() => {
      if (isDev) console.log("Logout failed, but skipping.");
    });

const retrievePassword = ({ client }) => ({ email, block }) =>
  client
    .use(serializeJson)
    .post("/users/password/reset")
    .send({ user: { email }, block })
    .then(getData);

const changeForgotPassword = ({ client }) => ({ code, password, block }) =>
  client
    .use(serializeJson)
    .post("/users/password/update")
    .send({ user: { password, pincode: code }, block })
    .then(getData);

const changePassword = ({ client }) => (authToken, { currentPassword, newPassword }) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/users/password/update")
    .send({ user: { currentPassword, newPassword } })
    .then(getData);

const updateProfile = ({ client }) => (authToken, { birthdate, name, voteIdCard, zipCode }) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/users/profile/update")
    .send({ user: {
      birthday: birthdate || "",
      name: name || "",
      zipcode: zipCode || "",
      voteidcard: voteIdCard || "",
    }})
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

const listPlips = ({ client }) => ({
  city,
  uf,
  includeCauses,
  limit,
  page,
  scope,
  search,
  path,
}) => {
  const qs = buildQueryString({
    city,
    uf,
    includeCauses,
    limit,
    page,
    scope,
    search,
    path,
  });

  return client
    .get(`/petitions/pagination?${qs}`)
    .then(getPagination)
    .then(({ json, page, nextPage }) => ({ plips: json.data.petitions, page, nextPage }));
};

const listSignedPlips = ({ client }) => (authToken, {
  city,
  uf,
  includeCauses,
  limit,
  page,
  scope,
  path,
}) => {
  const qs = buildQueryString({
    city,
    uf,
    includeCauses,
    limit,
    page,
    scope,
    path,
  });

  if (authToken) {
    return authorizedClient(client, authToken)
      .get(`/petitions/pagination/sign?${qs}`)
      .then(getPagination)
      .then(({ json, page, nextPage }) => ({ plips: json.data.petitions, page, nextPage }));
  } else {
    return Promise.resolve({plips: [], page: 0, nextPage: null});
  }
};

const listFavoritePlips = ({ client }) => (authToken, {
  city,
  uf,
  includeCauses,
  limit,
  page,
  scope,
  path,
}) => {
  const qs = buildQueryString({
    city,
    uf,
    includeCauses,
    limit,
    page,
    scope,
    path,
  });

  if (authToken) {
    return authorizedClient(client, authToken)
      .get(`/petitions/pagination/favorite?${qs}`)
      .then(getPagination)
      .then(({ json, page, nextPage }) => ({ plips: json.data.petitions, page, nextPage }));
  } else {
    return Promise.resolve({plips: [], page: 0, nextPage: null});
  }
};

const listSignedPlipsByUser = ({ client }) => authToken =>
  authorizedClient(client, authToken)
    .get("/users/petitions")
    .then(getData);

const toggleFavoritePlip = ({ client }) => (authToken, { detailId }) =>
  authorizedClient(client, authToken)
    .use(serializeJson)
    .post("/favorites/update/")
    .send({ petition: { id: detailId }})
    .then(getData)

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
  const v1Client = requester({ host, version: "v1" });
  const v2Client = requester({ host, version: "v2" });
  const v3Client = requester({ host, version: "v3" });

  return {
    changePassword: changePassword({ client: v1Client }),
    changeForgotPassword: changeForgotPassword({ client: v2Client }),
    difficulty: fetchDifficulty({ client: v1Client }),
    fbSignIn: fbSignIn({ client: v2Client }),
    fetchOfflinePlipSigners: fetchOfflinePlipSigners({ client: v1Client }),
    fetchPlipSigners: fetchPlipSigners({ client: v1Client }),
    fetchOfflineShortPlipSigners: fetchOfflineShortPlipSigners({ client: v1Client }),
    fetchShortPlipSigners: fetchShortPlipSigners({ client: v1Client }),
    listPlips: listPlips({ client: v3Client }),
    listFavoritePlips: listFavoritePlips({ client: v3Client }),
    listSignedPlips: listSignedPlips({ client: v3Client }),
    listSignedPlipsByUser: listSignedPlipsByUser({ client: v3Client }),
    logout: logout({ client: v1Client }),
    plipSignInfo: plipSignInfo({ client: v1Client }),
    userFavoriteInfo: userFavoriteInfo({ client: v3Client }),
    toggleFavoritePlip: toggleFavoritePlip({ client: v3Client }),
    profile: profile({ client: v3Client }),
    retrievePassword: retrievePassword({ client: v2Client }),
    reverseSearchZipCode: reverseSearchZipCode({ client: v3Client }),
    saveAvatar: upload({ endpoint: `${host}/api/v1/profile/photo` }),
    saveBirthdate: saveBirthdate({ client: v1Client }),
    saveDocuments: saveDocuments({ client: v1Client }),
    savePhone: savePhone({ client: v1Client }),
    saveWallet: saveWallet({ client: v1Client }),
    saveZipCode: saveZipCode({ client: v1Client }),
    searchZipCode: searchZipCode({ client: v1Client }),
    sendPhoneValidation: sendPhoneValidation({ client: v1Client }),
    signIn: signIn({ client: v1Client }),
    signMessage: signMessage({ client: v1Client }),
    signUp: signUp({ client: v3Client }),
    signPlip: signPlip({ client: v1Client }),
    updateProfile: updateProfile({ client: v3Client }),
    userSignInfo: userSignInfo({ client: v1Client }),
  };
}
