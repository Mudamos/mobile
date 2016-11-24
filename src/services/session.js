import LocalStorage from "./local-storage";

const sessionKey = "session";

export default root => {
  const storage = LocalStorage(root);

  return {
    persist: storage.store(sessionKey),
    retrieve: () => storage.fetch(sessionKey).then(session => session || Promise.reject("No sesssion available")),
    destroy: () => storage.destroy(sessionKey),
  };
}
