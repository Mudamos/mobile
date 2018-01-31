//
//  SessionService.swift
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 19/01/18.
//  Copyright © 2018 Tagview. All rights reserved.
//

import Foundation

class SessionService {
  private let storage: UserDefaults
  private let rootPrefix: String
  private let sessionKey: String

  private let env = DotEnv()

  init() {
    storage = UserDefaults(suiteName: env["IOS_APP_GROUP"]!)!
    rootPrefix = env["STORAGE_ROOT_PREFIX"]!
    sessionKey = "session"
  }

  init(storage: UserDefaults, rootPrefix: String, sessionKey: String) {
    self.storage = storage
    self.rootPrefix = rootPrefix
    self.sessionKey = sessionKey
  }

  var key: String {
    return "\(rootPrefix):\(sessionKey)"
  }

  func retrieve() -> String? {
    if
      let sessionData = storage.string(forKey: key)?.data(using: .utf8),
      let json = try? JSONSerialization.jsonObject(with: sessionData, options: []) as? [String: Any],
      let token = json?["token"] as? String {
      return token
    }

    return nil
  }

  func isLoggedIn() -> Bool {
    return retrieve() != nil
  }
}
