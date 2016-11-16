import { spawn } from "redux-saga/effects";

import plipSaga from "./plip";

export default function* rootSaga( { mudamosWebApi }) {
  yield spawn(plipSaga, { mudamosWebApi });
};
