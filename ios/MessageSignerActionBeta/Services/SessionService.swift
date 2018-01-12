//
//  SessionService.swift
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 10/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

class SessionService {
  private let storage: UserDefaults
  private let rootPrefix: String
  private let sessionKey: String

  init() {
    storage = UserDefaults(suiteName: ProcessInfo.processInfo.environment["IOS_APP_GROUP"])!
    rootPrefix = ProcessInfo.processInfo.environment["STORAGE_ROOT_PREFIX"]!
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
}
