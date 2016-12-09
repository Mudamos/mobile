import Mobile from "./mobile";


export default class User {
  constructor(attrs = {}) {
    this.id = attrs.id;
    this.birthdate = attrs.birthdate;
    this.cpf = attrs.cpf;
    this.email = attrs.email;
    this.mobile = attrs.mobile || new Mobile();
    this.name = attrs.name;
    this.voteCard = attrs.voteCard;
    this.zipCode = attrs.zipCode;
  }

  toJson() {
    const mobileJson = this.mobile ? this.mobile.toJson() : {};

    return {
      userId: this.id,
      userName: this.name,
      profileEmail: this.email,
      userVoteidcard: this.voteCard,
      userCpf: this.cpf,
      userZipcode: this.zipCode,
      userBirthday: this.birthdate,

      ...mobileJson,
    }
  }

  static fromJson(json = {}) {
    return new User({
      id: json.userId,
      birthdate: json.userBirthday,
      cpf: json.userCpf,
      email: json.profileEmail,
      mobile: Mobile.fromJson(json),
      name: json.userName,
      voteCard: json.userVoteidcard,
      zipCode: json.userZipcode,
    });
  }
}
