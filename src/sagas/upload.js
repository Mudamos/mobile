import { buffers, END, eventChannel } from "redux-saga";
import { cancelled, call, fork, take } from "redux-saga/effects";
import throttle from "lodash/throttle";

const uploadChannel = (upload, buffer = buffers.sliding(10), throttlingInterval = 250) => eventChannel(emitter => {
  const uploadProgress = throttle((progress) => emitter({ type: "UPLOAD_PROGRESS", payload: progress }), throttlingInterval);

  upload.progress(progress => {
    uploadProgress(progress);
  })
  .then(response => {
    setTimeout(() => {
      emitter({ type: "UPLOAD_FINISHED", payload: response });
      emitter(END);
    }, throttlingInterval * 2);
  })
  .catch(error => {
    setTimeout(() => {
      emitter({ type: "UPLOAD_FAILED", payload: error });
      emitter(END);
    }, throttlingInterval * 2);
  });

  return upload.cancel;
}, buffer);

export function* monitorUpload(upload, monitor) {
  const channel = yield call(uploadChannel, upload);

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      yield fork(monitor, yield take(channel));
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}
