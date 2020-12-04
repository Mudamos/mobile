import MUDFirebase from "./mud-firebase";

const service = {
  asBoolean: (name) => MUDFirebase.getBooleanConfig(name),
  asNumber: (name) => MUDFirebase.getNumberConfig(name),
  asString: (name) => MUDFirebase.getStringConfig(name),
};

export default service;
