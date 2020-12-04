export default class Mobile {
  constructor(attrs = {}) {
    this.number = attrs.number;
    this.status = attrs.status;
  }

  toJson() {
    return {
      mobileNumber: this.number,
      mobileStatus: this.status,
    };
  }

  static fromJson(json = {}) {
    return new Mobile({
      number: json.mobileNumber,
      status: json.mobileStatus,
    });
  }
}
