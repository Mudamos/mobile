export default class User {
  constructor(attrs = {}) {
    this.id = attrs.id;
    this.name = attrs.name;
    this.email = attrs.email;
    this.voteCard = attrs.voteCard;
    this.cpf = attrs.cpf;
    this.zipCode = attrs.zipCode;
    this.birthdate = attrs.birthdate;
  }

  toJson() {
    return {
      userId: this.id,
      userName: this.name,
      profileEmail: this.email,
      userVoteidcard: this.voteCard,
      userCpf: this.cpf,
      userZipcode: this.zipCode,
      userBirthday: this.birthdate,
    }
  }

  static fromJson(json = {}) {
    return new User({
      id: json.userId,
      name: json.userName,
      email: json.profileEmail,
      voteCard: json.userVoteidcard,
      cpf: json.userCpf,
      zipCode: json.userZipcode,
      birthdate: json.userBirthday,
    });
  }
}
