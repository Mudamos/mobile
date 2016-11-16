import { spawn } from "redux-saga/effects";

import plipSaga from "./plip";

export default function* rootSaga() {
  yield spawn(plipSaga);
};
