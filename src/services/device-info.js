import DeviceInfo from "react-native-device-info";

import { Device } from "../models";


const getInfo = () => new Device({
  brand: DeviceInfo.getBrand(),
  deviceId: DeviceInfo.getDeviceId(),
  deviceUniqueId: DeviceInfo.getUniqueID(),
  manufacturer: DeviceInfo.getManufacturer(),
  model: DeviceInfo.getModel(),
  systemName: DeviceInfo.getSystemName(),
  systemVersion: DeviceInfo.getSystemVersion(),
  userAgent: DeviceInfo.getUserAgent(),
});

const service = {
  info: getInfo,
};

export default service;
