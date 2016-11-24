import farfetch, { prefix, requestLogger, responseLogger } from "farfetch";
import { camelizeKeys } from "humps";

// eslint-disable-next-line no-undef
const isDev = __DEV__;

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

  return Promise.reject({ ...err, json, type: data.type || "unknown" });
};


const listPlips = ({ get }) => () => get("/api/v2/plips").then(getData).then(json => json.plips);

export default function MudamosWebApi(host) {
  const client = requester({ host });

  return {
    listPlips: listPlips(client),
  };
}
