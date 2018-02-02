//
//  Signer.swift
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 22/01/18.
//  Copyright © 2018 Tagview. All rights reserved.
//

import Foundation
import WebKit

class Signer: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
  private class SignIntention {
    let timestamp: String
    let originalMessage: MudamosMessage
    var message: String {
      return [originalMessage.data, timestamp].joined(separator: ";")
    }

    init(originalMessage: MudamosMessage, timestamp: String) {
      self.originalMessage = originalMessage
      self.timestamp = timestamp
    }
  }

  private var webView: WKWebView!
  var delegate: SignerDelegate?

  private let walletService = WalletService()
  private let api = MobileApi()

  private var intention: SignIntention?
  private var walletSeed: String?

  init(withDelegate delegate: SignerDelegate) {
    self.delegate = delegate
  }

  func load() {
    let url = Bundle.main.path(forResource: "sign", ofType: "html")
    let content = try? String(contentsOfFile: url!, encoding: .utf8)

    let contentController = WKUserContentController()
    contentController.add(self, name: "myController")

    let configuration = WKWebViewConfiguration()
    configuration.userContentController = contentController

    self.webView = WKWebView(frame: .zero, configuration: configuration)
    self.webView.navigationDelegate = self
    self.webView.loadHTMLString(content!, baseURL: nil)
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    OperationQueue.main.addOperation {
      self.delegate?.signerReady()
    }
  }

  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    guard let body = message.body as? [String: Any] else {
      return self.signFailed(withError: MUDError.SignError)
    }

    guard let signedMessage = body["signedMessage"] as? String else {
      return self.signFailed(withError: MUDError.SignError)
    }

    api.signMessage(message: signedMessage) { result, error in
      if error != nil {
        return self.signFailed(withError: error!)
      }

      guard let publicKey = result else {
        return self.signFailed(withError: MUDError.SignError)
      }

      let signResult = SignerResult(message: self.intention!.message, originalMessage: self.intention!.originalMessage, signedMessage: signedMessage, timestamp: self.intention!.timestamp, publicKey: publicKey)

      self.signSucceeded(withResult: signResult)
    }
  }

  func canSign(_ user: User) -> Bool {
    return user.name != nil
      && user.email != nil
      && user.hasSavedAvatar
      && user.birthday != nil
      && user.zipCode != nil
      && user.cpf != nil
      && user.voteCard != nil
      && user.mobileStatus
  }

  func isWalletValid(voteCard password: String, completionHandler: @escaping (Bool) -> ()) {
    getSeed(password: password) { result in
      guard let seed = result else {
        return completionHandler(false)
      }

      self.webView.evaluateJavaScript("validateWallet(`\(seed)`)") { result, error in
        if error != nil {
          print("Validate wallet error \(error!)")
          return completionHandler(false)
        }

        self.walletSeed = seed

        completionHandler(result as? Bool ?? false)
      }
    }
  }

  func sign(message: MudamosMessage, voteCard: String, difficulty: Int) {
    if let seed = self.walletSeed {
      sign(message: message, difficulty: difficulty, seed: seed)
    } else {
      getSeed(password: voteCard) { result in
        guard let seed = result else {
          return self.signFailed(withError: MUDError.InvalidWallet)
        }

        self.sign(message: message, difficulty: difficulty, seed: seed)
      }
    }
  }

  private func sign(message: MudamosMessage, difficulty: Int, seed: String) {
    intention = SignIntention(originalMessage: message, timestamp: Date().iso8601)

    webView.evaluateJavaScript("signMessage(`\(seed)`, `\(intention!.message)`, \(difficulty), `\(intention!.timestamp)`)") { _, error in
      if error != nil {
        self.signFailed(withError: MUDError.Unknown(error!))
      }
    }
  }

  private func getSeed(password: String, completionHandler: @escaping (String?) -> ()) {
    guard let encryptedSeed = walletService.retrieve() else {
      return completionHandler(nil)
    }

    webView.evaluateJavaScript("getSeed(`\(encryptedSeed)`, `\(password)`)") { result, error in
      if error != nil {
        print("GetSeed error \(error!)")
        return completionHandler(nil)
      }

      guard let seed = result as? String else {
        return completionHandler(nil)
      }

      completionHandler(seed)
    }
  }

  private func signFailed(withError error: MUDError) {
    OperationQueue.main.addOperation {
      self.delegate?.signDidFail(error: error)
    }
  }

  private func signSucceeded(withResult result: SignerResult) {
    OperationQueue.main.addOperation {
      self.delegate?.didFinishSign(result: result)
    }
  }

  deinit {
    webView?.navigationDelegate = nil
    delegate = nil
  }
}

protocol SignerDelegate {
  func signerReady()
  func didFinishSign(result: SignerResult)
  func signDidFail(error: MUDError)
}

class SignerResult {
  let timestamp: String
  let originalMessage: MudamosMessage
  let message: String
  let signedMessage: String

  let publicKey: String

  var signature: String {
    return signedMessage.components(separatedBy: ";").suffix(2).first!
  }

  init(message: String, originalMessage: MudamosMessage, signedMessage: String, timestamp: String, publicKey: String) {
    self.message = message
    self.originalMessage = originalMessage
    self.signedMessage = signedMessage
    self.timestamp = timestamp
    self.publicKey = publicKey
  }
}
