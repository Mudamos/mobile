import { path, pick } from "ramda";

export const actionSignerResult = (state) =>
  pick(
    ["error", "message", "signature", "publicKey", "timestamp"],
    state.actionSigner,
  );

export const isActionSignerDone = (state) => state.actionSigner.done;

export const actionSignerUrl = path(["actionSigner", "integrator", "url"]);

export const actionSignerIntegratorErrorMessage = path([
  "actionSigner",
  "integrator",
  "error",
]);
