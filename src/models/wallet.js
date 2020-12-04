export default class Wallet {
  constructor(attrs = {}) {
    this.key = attrs.key;
    this.status = attrs.status;
  }

  toJson() {
    return {
      walletKey: this.key,
      walletStatus: this.status,
    };
  }

  static fromJson(json = {}) {
    return new Wallet({
      key: json.walletKey,
      status: json.walletStatus,
    });
  }
}
