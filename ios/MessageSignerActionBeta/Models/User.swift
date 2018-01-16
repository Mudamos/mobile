//
//  User.swift
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 10/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

class User: CustomStringConvertible {
  let id: String?
  let voteCard: String?

  init(json: [String: Any]) {
    self.id = json["user_id"] != nil ? String(describing: json["user_id"]!) : nil
    self.voteCard = json["user_voteidcard"] as? String
  }

  var description: String {
    return "<User id: \(id) voteCard: \(voteCard) />"
  }
}
