export default class User {
  constructor(attrs = {}) {
    this.id = attrs.id;
    this.name = attrs.name;
    this.email = attrs.email;
    this.voteCard = attrs.voteCard;
    this.cpf = attrs.cpf;
    this.zipcode = attrs.zipcode;
  }

  toJson() {
    return {
      userId: this.id,
      userName: this.name,
      profileEmail: this.email,
      userVoteidcard: this.voteCard,
      userCpf: this.cpf,
      userZipcode: this.zipcode,
    }
  }

  static fromJson(json = {}) {
    return new User({
      id: json.userId,
      name: json.userName,
      email: json.profileEmail,
      voteCard: json.userVoteidcard,
      cpf: json.userCpf,
      zipcode: json.userZipcode,
    });
  }
}
