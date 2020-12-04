export default class Address {
  constructor(attrs = {}) {
    this.address = attrs.address;
    this.district = attrs.district;
    this.state = attrs.state;
    this.uf = attrs.uf;
    this.city = attrs.city;
    this.latitude = attrs.latitude;
    this.longitude = attrs.longitude;
    this.zipCode = attrs.zipCode;
  }

  toJson() {
    return {
      address: this.address,
      district: this.district,
      state: this.state,
      uf: this.uf,
      city: this.city,
      lat: this.latitude,
      lng: this.longitude,
      zipcode: this.zipCode,
    };
  }

  static fromJson(json = {}) {
    return new Address({
      address: json.address,
      district: json.district,
      state: json.state,
      uf: json.uf,
      city: json.city,
      latitude: json.lat,
      longitude: json.lng,
      zipCode: json.zipcode,
    });
  }
}
