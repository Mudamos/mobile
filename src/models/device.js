export default class Device {
  constructor(attrs = {}) {
    this.brand = attrs.brand;
    this.deviceId = attrs.deviceId;
    this.deviceUniqueId = attrs.deviceUniqueId;
    this.manufacturer = attrs.manufacturer;
    this.model = attrs.model;
    this.systemName = attrs.systemName;
    this.systemVersion = attrs.systemVersion;
    this.userAgent = attrs.userAgent;
  }

  toString() {
    return [
      this.brand,
      this.deviceId,
      this.deviceUniqueId,
      this.manufacturer,
      this.model,
      this.systemName,
      this.systemVersion,
      this.userAgent,
    ].join(";");
  }
}
