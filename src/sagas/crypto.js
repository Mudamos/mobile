import { call } from "redux-saga/effects";

import LibCrypto from "mudamos-libcrypto";
import { log } from "../utils";


export function* blockBuilder({ message, mobileApi, Crypto }) {
  const difficulty = yield call(mobileApi.difficulty);
  const mineDifficulty = parseInt(difficulty / 2, 10);
  const hash = Crypto.sha256(message);

  log(`Will mine message: ${message} hash: ${hash}, mineDifficulty: ${mineDifficulty}`, { tag: "blockBuilder" });

  return yield call([LibCrypto, LibCrypto.mineMessage], hash, mineDifficulty);
}
