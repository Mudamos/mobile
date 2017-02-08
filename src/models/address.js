export default class Address {
  constructor(attrs = {}) {
    this.address = attrs.address;
    this.district = attrs.district;
    this.state = attrs.state;
    this.uf = attrs.uf;
    this.city = attrs.city;
    this.lat = attrs.lat;
    this.lng = attrs.lng;
    this.zipCode = attrs.zipCode;
  }

  toJson() {
    return {
      address: this.address,
      district: this.district,
      state: this.state,
      uf: this.uf,
      city: this.city,
      lat: this.lat,
      lng: this.lng,
      zipcode: this.zipCode,
    }
  }

  static fromJson(json = {}) {
    return new Address({
      address: json.address,
      district: json.district,
      state: json.state,
      uf: json.uf,
      city: json.city,
      lat: json.lat,
      lng: json.lng,
      zipCode: json.zipcode,
    });
  }
}
