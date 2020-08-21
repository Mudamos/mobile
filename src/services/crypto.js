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
    logError(e, { tag: "encrypt" });
  }
};

const decrypt = (text, password) => {
  try {
    const decipher = crypto.createDecipher(ALGORITHM, password);

    let decryption = decipher.update(text, "hex", "utf8");
    decryption += decipher.final("utf8");

    return decryption;
  } catch (e) {
    logError(e, { tag: "decrypt" });
  }
}

const sha256 = text => crypto.createHash("sha256").update(text, "utf8").digest().toString("hex");

const uuid = (size = 32) => new Promise((resolve, reject) => crypto.randomBytes(size, (error, buffer) => {
  if (error) {
    reject(error);
  } else {
    resolve(buffer.toString("hex"));
  }
}));

const myCrypto = {
  encrypt,
  decrypt,
  sha256,
  uuid,
};

export default myCrypto;
