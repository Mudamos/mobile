import { call, fork, takeLatest } from "redux-saga/effects";
import { URL, URLSearchParams } from "react-native-url-polyfill";
import Toast from "react-native-simple-toast";

import { isSignMessage, log, logError } from "../utils";
import { signMessageWithUrl } from "./action-signer";
import locale from "../locales/pt-BR";

// Example url
// https://f9d7p.app.goo.gl/?link=https%3A%2F%2Fsign.mudamos.org%2Fsignlink%3Fmessage%3D757365722d3132333b7369676e65642d78797a%26appid%3Drxc%26signature%3Dab19ed7d4c8ba673f06efcc5f51e8d222ce4a1b70a42563ce0c0bb4f192a1342&apn=br.com.tagview.petition.mudamos.beta&ibi=br.com.tagview.mudamosmobile&isi=1214485690&efr=1
const checkIsSignMessage = (url) => {
  const error = () => ({ success: false });
  try {
    const scannedUrl = new URL(url);
    log(`scannedUrl: ${scannedUrl}`, { tag: "checkIsSignMessage" });

    if (!scannedUrl || !scannedUrl.search) return error();

    const params = new URLSearchParams(scannedUrl.search);
    const firebaseLink = params.get("link");

    if (!firebaseLink) return error();

    const decodedLink = decodeURIComponent(firebaseLink);
    log("Decoded link", { tag: "checkIsSignMessage" }, decodedLink);

    const signUrl = new URL(decodedLink);
    if (!isSignMessage(signUrl)) return error();

    return { success: true, url: signUrl };
  } catch (e) {
    logError(e);

    return error();
  }
};

function* onQrCodeScan({ mobileApi, walletStore }) {
  yield takeLatest("QR_CODE_SCAN_SCANNED_DATA", function* ({
    payload: { data },
  }) {
    const { success, url } = checkIsSignMessage(data);

    if (success) {
      yield call(signMessageWithUrl, {
        url,
        mobileApi,
        walletStore,
      });
      return;
    }

    yield call([Toast, Toast.show], locale.qrCodeScanUnknownData);
  });
}

export default function* qrCodeScan({ mobileApi, walletStore }) {
  yield fork(onQrCodeScan, { mobileApi, walletStore });
}
