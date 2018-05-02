import { NativeEventEmitter, NativeModules } from "react-native";

const onDeepLinkReceivedEvent = "onDeepLinkReceived";

const emitter = new NativeEventEmitter(NativeModules.MUDFirebaseDynamicLink);

export default class MUDFirebaseDynamicLink {
  subscribe(listener) {
    this.subscription = emitter.addListener(onDeepLinkReceivedEvent, listener);
    return () => this.unsubscribe();
  }

  unsubscribe() {
    this.subscription && this.subscription.remove();
  }
}
