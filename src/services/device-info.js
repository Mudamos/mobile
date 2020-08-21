import { randomBytes } from "react-native-randombytes";
import DeviceInfo from "react-native-device-info";

import { Device } from "../models";
import { isPresent } from "../utils";

const UNIQUE_ID_KEY = "device-unique-id";

const generateUniqueId = storage => storage.findOrCreate(UNIQUE_ID_KEY, () => randomBytes(32).toString("hex"));

const info = storage => () => new Promise(async (resolve) => {
  const uniqueId = DeviceInfo.getUniqueID();

  const deviceUniqueId = isPresent(uniqueId) ? uniqueId : await generateUniqueId(storage);

  resolve(
    new Device({
      brand: DeviceInfo.getBrand(),
      deviceId: DeviceInfo.getDeviceId(),
      deviceUniqueId,
      manufacturer: DeviceInfo.getManufacturer(),
      model: DeviceInfo.getModel(),
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      userAgent: DeviceInfo.getUserAgent(),
    })
  );
})

const appVersion = () => Promise.resolve(DeviceInfo.getReadableVersion());

const isEmulator = DeviceInfo.isEmulator;

export default ({ storage }) => ({
  appVersion: appVersion,
  info: info(storage),
  isEmulator,
})
