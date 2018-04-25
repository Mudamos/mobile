import { DeviceEventEmitter, NativeModules } from "react-native";

const onDeepLinkReceivedEvent = "onDeepLinkReceived";

export default class MUDFirebaseDynamicLink {
  subscribe(listener) {
    this.subscription = DeviceEventEmitter.addListener(onDeepLinkReceivedEvent, listener);
    NativeModules.MUDFirebaseDynamicLink.getInitialLink();
  }

  unsubscribe() {
    this.subscription && this.subscription.remove();
  }
}
