import crypto from "crypto";

import { logError } from "../utils";


const ALGORITHM = "aes-256-ctr";

const encrypt = (text, password) => {
  try {
    const cipher = crypto.createCipher(ALGORITHM, password);

    let encryption = cipher.update(text, "utf8", "hex");
    encryption += cipher.final("hex");

    return encryption;
  } catch (e) {
    logError(e);
  }
};

const decrypt = (text, password) => {
  try {
    const decipher = crypto.createDecipher(ALGORITHM, password);

    let decryption = decipher.update(text, "hex", "utf8");
    decryption += decipher.final("utf8");

    return decryption;
  } catch (e) {
    logError(e);
  }
}

const myCrypto = {
  encrypt: encrypt,
  decrypt: decrypt,
};

export default myCrypto;
