import { path } from "ramda";

import Address from "./address";
import Image from "./image";
import Mobile from "./mobile";
import ProfileType from "./profile-type";
import Wallet from "./wallet";

import { propIsPresent } from "../utils";


export default class User {
  constructor(attrs = {}) {
    this.id = attrs.id;
    this.address = attrs.address || new Address();
    this.avatar = attrs.avatar;
    this.hasSavedAvatar = attrs.hasSavedAvatar;
    this.birthdate = attrs.birthdate;
    this.cpf = attrs.cpf;
    this.email = attrs.email;
    this.mobile = attrs.mobile || new Mobile();
    this.name = attrs.name;
    this.profileType = attrs.profileType;
    this.termsAccepted = attrs.termsAccepted;
    this.voteCity = attrs.voteCity;
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

  get hasVoteAddress() {
    return propIsPresent("id", this.voteCity);
  }

  clone() {
    return User.fromJson(this.toJson());
  }

  toJson() {
    const mobileJson = this.mobile ? this.mobile.toJson() : {};
    const walletJson = this.wallet ? this.wallet.toJson() : {};
    const avatarJson = this.avatar ? this.avatar.toJson() : {};
    const { profilePicture } = avatarJson;

    return {
      userId: this.id,
      userName: this.name,
      profileEmail: this.email,
      profileType: this.profileType,
      userVoteidcard: this.voteCard,
      userCpf: this.cpf,
      userZipcode: this.zipCode,
      userBirthday: this.birthdate,
      hasSavedAvatar: this.hasSavedAvatar,
      profilePicture,
      termsAccepted: this.termsAccepted,
      voteAddress: this.voteAddress,

      userDistrict: this.address.district,
      userState: this.address.state,
      userUf: this.address.uf,
      userCity: this.address.city,
      userLat: this.address.latitude,
      userLng: this.address.longitude,
      voteCityId: path(["voteCity", "id"], this.voteCity),
      voteCityName: path(["voteCity", "name"], this.voteCity),
      voteCityUf: path(["voteCity", "uf"], this.voteCity),

      ...mobileJson,
      ...walletJson,
    }
  }

  static fromJson(json = {}) {
    const avatar = Image.fromJson({
      url: json.profilePicture,
    });

    const address = Address.fromJson({
      district: json.userDistrict,
      state: json.userState,
      uf: json.userUf,
      city: json.userCity,
      lat: json.userLat,
      lng: json.userLng,
      zipcode: json.userZipcode,
    });

    const voteCity = json.voteCityId ? { id: json.voteCityId, name: json.voteCityName, uf: json.voteCityUf } : null;

    return new User({
      id: json.userId,
      address,
      avatar,
      hasSavedAvatar: json.hasSavedAvatar,
      birthdate: json.userBirthday,
      cpf: json.userCpf,
      email: json.profileEmail,
      mobile: Mobile.fromJson(json),
      name: json.userName,
      profileType: json.profileType,
      termsAccepted: json.termsAccepted,
      voteCard: json.userVoteidcard,
      voteCity: voteCity,
      wallet: Wallet.fromJson(json),
      zipCode: json.userZipcode,
    });
  }
}
