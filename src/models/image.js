export default class Image {
  constructor(attrs = {}) {
    this.url = attrs.url;
  }

  toJson() {
    return {
      url: this.url,
    };
  }

  static fromJson(json = {}) {
    return new Image({
      url: json.url,
    });
  }
}
