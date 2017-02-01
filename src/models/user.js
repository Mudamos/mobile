import Mobile from "./mobile";
import ProfileType from "./profile-type";
import Wallet from "./wallet";


export default class User {
  constructor(attrs = {}) {
    this.id = attrs.id;
    this.birthdate = attrs.birthdate;
    this.cpf = attrs.cpf;
    this.email = attrs.email;
    this.mobile = attrs.mobile || new Mobile();
    this.name = attrs.name;
    this.profileType = attrs.profileType;
    this.voteCard = attrs.voteCard;
    this.wallet = attrs.wallet || new Wallet();
    this.zipCode = attrs.zipCode;
  }

  get isAppUser() {
    return this.profileType === ProfileType.app;
  }

  get isFacebookUser() {
    return this.profileType === ProfileType.facebook;
  }

  clone() {
    return User.fromJson(this.toJson());
  }

  toJson() {
    const mobileJson = this.mobile ? this.mobile.toJson() : {};
    const walletJson = this.wallet ? this.wallet.toJson() : {};

    return {
      userId: this.id,
      userName: this.name,
      profileEmail: this.email,
      profileType: this.profileType,
      userVoteidcard: this.voteCard,
      userCpf: this.cpf,
      userZipcode: this.zipCode,
      userBirthday: this.birthdate,

      ...mobileJson,
      ...walletJson,
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
      profileType: json.profileType,
      voteCard: json.userVoteidcard,
      wallet: Wallet.fromJson(json),
      zipCode: json.userZipcode,
    });
  }
}
