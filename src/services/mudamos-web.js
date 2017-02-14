import farfetch, { prefix, requestLogger, responseLogger } from "farfetch";
import { camelizeKeys } from "humps";

import { isDev } from "../utils";

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

const buildQueryString = params =>
  Object
    .keys(params)
    .map(k => {
        if (Array.isArray(params[k])) {
            return params[k]
                .map(val => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`)
                .join("&")
        }

        return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
    })
    .join("&")

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

const defineErrorType = err => {
  const json = err.json || {};
  const data = json.data || {};

  return Promise.reject({ ...err, json, type: data.type || "unknown" });
};

const getPagination = ({ response, ...args }) => ({
  page: parseInt(response.headers.get("X-Page") || 1, 10),
  nextPage: parseInt(response.headers.get("X-Next-Page"), 10) || null,

  ...args,
});


const listPlips = ({ get }) => ({ page }) => get(`/api/v2/plips?${buildQueryString({ page })}`)
  .then(getPagination)
  .then(({ json, page, nextPage }) => ({ plips: json.data.plips, page, nextPage }))

export default function MudamosWebApi(host) {
  const client = requester({ host });

  return {
    listPlips: listPlips(client),
  };
}
