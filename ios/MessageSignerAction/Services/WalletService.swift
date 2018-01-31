//
//  WalletService.swift
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 19/01/18.
//  Copyright © 2018 Tagview. All rights reserved.
//

import Foundation

class WalletService {
  private let storage: UserDefaults
  private let rootPrefix: String
  private let walletKey: String

  init() {
    storage = UserDefaults(suiteName: "group.br.com.tagview.mudamosmobile")!
    rootPrefix = "@Mudamos"
    walletKey = "wallet"
  }

  init(storage: UserDefaults, rootPrefix: String, walletKey: String) {
    self.storage = storage
    self.rootPrefix = rootPrefix
    self.walletKey = walletKey
  }

  var key: String {
    return "\(rootPrefix):\(walletKey)"
  }

  func retrieve() -> String? {
    if
      let walletData = storage.string(forKey: key)?.data(using: .utf8),
      let parsedWalletData = try? JSONSerialization.jsonObject(with: walletData, options: [.allowFragments]),
      let encryptedSeed = parsedWalletData as? String {

      return encryptedSeed
    }

    return nil
  }
}
