//
//  User.swift
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 19/01/18.
//  Copyright © 2018 Tagview. All rights reserved.
//

import Foundation


class User: CustomStringConvertible {
  let id: String?
  let birthday: String?
  let cpf: String?
  let email: String?
  let hasSavedAvatar: Bool
  let mobileStatus: Bool
  let name: String?
  let voteCard: String?
  let zipCode: String?

  init(json: [String: Any]) {
    self.id = json["user_id"] != nil ? String(describing: json["user_id"]!) : nil
    self.birthday = json["user_birthday"] as? String
    self.cpf = json["user_cpf"] as? String
    self.email = json["profile_email"] as? String
    self.hasSavedAvatar = Bool.fromJson(json["has_saved_avatar"])
    self.mobileStatus = Bool.fromJson(json["mobile_status"])
    self.name = json["user_name"] as? String
    self.voteCard = json["user_voteidcard"] as? String
    self.zipCode = json["user_zipcode"] as? String
  }

  var description: String {
    return "<User " +
      "id: \(String(describing: id)) " +
      "birthday: \(String(describing: birthday)) " +
      "cpf: \(String(describing: cpf)) " +
      "email: \(String(describing: email)) " +
      "hasSavedAvatar: \(hasSavedAvatar) " +
      "mobileStatus: \(mobileStatus) " +
      "name: \(String(describing: name)) " +
      "voteCard: \(String(describing: voteCard)) " +
      "zipCode: \(String(describing: zipCode)) />"
  }
}
