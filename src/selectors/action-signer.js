import { pick } from "ramda";

export const actionSignerResult = state => pick([
  "error",
  "message",
  "signature",
  "publicKey",
  "timestamp",
], state.actionSigner);

export const isActionSignerDone = state => state.actionSigner.done;
