import { takeLatest } from "redux-saga";
import { fork, put } from "redux-saga/effects";

export function* fetchPlip() {
  yield takeLatest("FETCH_PLIP", function* () {
    console.log("will fetch plip");
    yield put({ type: "PLIP_FETCHED", payload: {
      plip: { id: 1, content: "plip body" }
    }});
  });
}
export default function* plipSaga() {
  yield fork(fetchPlip);
}
