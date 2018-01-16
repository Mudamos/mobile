//
//  ActionViewController.swift
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 09/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import WebKit
import MobileCoreServices

class SignResult {
  var message: String?
  var signature: String?
  var publicKey: String?
  var timestamp: String?
  var error = false

  var item: NSExtensionItem {
    let attrs: NSDictionary = [
      "message": message,
      "signature": signature,
      "publicKey": publicKey,
      "timestamp": timestamp,
      "error": error
    ]

    let provider = NSItemProvider(item: attrs, typeIdentifier: "com.mudamos.signmessage")
    let item = NSExtensionItem()
    item.attachments = [provider]

    return item
  }
}

class ActionViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {

  @IBOutlet weak var loader: UIActivityIndicatorView!
  @IBOutlet weak var resultLabel: UILabel!
  @IBOutlet weak var doneButton: UIBarButtonItem!

  var webView: WKWebView!

  let api = MobileApi()
  let walletService = WalletService()

  let messageIdentifier = "com.mudamos.signmessage"
  let signResult = SignResult()

  func delay(_ delay:Double, closure: @escaping () -> ()) {
    let when = DispatchTime.now() + delay
    DispatchQueue.main.asyncAfter(deadline: when, execute: closure)
  }

  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    print("Result body: \(message.body)")
    guard let body = message.body as? [String: Any] else {
      return self.addError("Erro ao assinar mensagem")
    }

    guard let signedMessage = body["signedMessage"] as? String else {
      return self.addError("Erro ao assinar mensagem")
    }

    self.signResult.signature = signedMessage.components(separatedBy: ";")[3]

    self.api.signMessage(message: signedMessage) { result, error in
      if error != nil {
        return self.addError(error.debugDescription)
      }

      guard let publicKey = result else {
        return self.addError("Resultado inválido")
      }

      self.signResult.publicKey = publicKey

      print("PublicKey: \(publicKey)")
      self.addSuccess("Sucesso!")

      self.delay(2) {
        self.done()
      }
    }
  }

  func buildMessage(input: String, now: String) -> String {
    return [input, now].joined(separator: ";")
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    print("will call profile!")

    self.extractInputData { result in
      print("Extract Result: \(result)")
      guard let messageToSign = result else {
        return
      }

      self.api.profile() { result, error in
        print("Profile fetched")
        if error != nil {
          return self.addError("Erro ao buscar o perfil")
        }

        guard let user = result, let voteCard = user.voteCard else {
          return self.addError("Sem título de eleitor")
        }

        guard let encryptedSeed = self.walletService.retrieve(password: voteCard) else {
          return self.addError("Wallet não encontrada")
        }

        self.getSeed(encryptedSeed: encryptedSeed, voteCard: voteCard) { result, error in
          print("Seed fetched")
          if error != nil {
            return self.addError("Erro ao acessar wallet")
          }

          guard let seed = result as? String else {
            return self.addError("Wallet não encontrada")
          }

          self.validateWallet(seed: seed) { result, error in
            print("Wallet validated")
            if error != nil {
              return self.addError("Erro ao validar wallet")
            }

            if let valid = result as? Bool, !valid {
              return self.addError("Invalid local wallet")
            }

            self.api.difficulty { result, error in
              print("Diffculty fetched")
              if error != nil {
                return self.addError("Erro ao buscar dificuldade")
              }

              guard let difficulty = result else {
                return self.addError("Nenhuma dificuldade")
              }

              let now = Date().iso8601
              let message = self.buildMessage(input: messageToSign, now: now)
              self.signResult.message = message
              self.signResult.timestamp = now

              print("will sign message")
              self.signMessage(seed: seed, message: message, difficulty: difficulty, timestamp: now) { error in
                print("fired sign message error: \(error)")
                if error != nil {
                  return self.addError("Erro ao assinar mensagem")
                }
              }
            }
          }
        }
      }
    }
  }

  private func signMessage(seed: String, message: String, difficulty: Int, timestamp: String, completionHandler: @escaping (Error?) -> ()) {
    print("signMessage(`\(seed)`, `\(message)`, \(difficulty), `\(timestamp)`)")
    webView.evaluateJavaScript("signMessage(`\(seed)`, `\(message)`, \(difficulty), `\(timestamp)`)") { _, e in
      completionHandler(e)
    }
  }

  private func validateWallet(seed: String, completionHandler: @escaping (Any?, Error?) -> ()) {
    webView.evaluateJavaScript("validateWallet(`\(seed)`)", completionHandler: completionHandler)
  }

  private func getSeed(encryptedSeed: String, voteCard: String, completionHandler: @escaping (Any?, Error?) -> ()) {
    webView.evaluateJavaScript("getSeed(`\(encryptedSeed)`, `\(voteCard)`)", completionHandler: completionHandler)
  }

  private func addError(_ text: String) {
    OperationQueue.main.addOperation {
      self.resultLabel.text = text
      self.signResult.error = true
      self.doneButton.isEnabled = true
      self.loader.stopAnimating()
    }
  }

  private func addSuccess(_ text: String) {
    OperationQueue.main.addOperation {
      self.resultLabel.text = text
      self.loader.stopAnimating()
    }
  }

  private func extractInputData(completionHandler: @escaping (String?) -> ()) {
    guard let item = extensionContext?.inputItems.first as? NSExtensionItem else {
      addError("Nenhum item enviado")
      return completionHandler(nil)
    }

    guard let provider = item.attachments?.first as? NSItemProvider else {
      addError("Nenhum provider")
      return completionHandler(nil)
    }

    if !provider.hasItemConformingToTypeIdentifier(messageIdentifier) {
      addError("Identificador não encontrado")
      return completionHandler(nil)
    }

    provider.loadItem(forTypeIdentifier: messageIdentifier, options: nil) { item, error in
      if error != nil || item == nil {
        self.addError("Load item error")
        return completionHandler(nil)
      }

      print("item: \(item)")

      guard let result = item as? [String: Any] else {
        self.addError("Could not convert message")
        return completionHandler(nil)
      }

      guard let message = result["message"] as? String else {
        self.addError("Message not found in payload")
        return completionHandler(nil)
      }

      completionHandler(message)
    }
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    print("viewDidLoad")

    resultLabel.text = nil
    doneButton.isEnabled = false
    loader.startAnimating()

    print("begin")
    loadWebView()

    print("finish load")
  }

  private func loadWebView() {
    OperationQueue.main.addOperation {
      let url = Bundle.main.path(forResource: "sign", ofType: "html")
      let content = try? String(contentsOfFile: url!, encoding: .utf8)
      print("Has content?: \(content != nil)")

      let contentController = WKUserContentController()
      contentController.add(self, name: "myController")

      let configuration = WKWebViewConfiguration()
      configuration.userContentController = contentController

      self.webView = WKWebView(frame: .zero, configuration: configuration)
      self.webView.navigationDelegate = self
      self.webView.loadHTMLString(content!, baseURL: nil)
    }
  }

  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }

  @IBAction func done() {
    webView.navigationDelegate = nil
    extensionContext!.completeRequest(returningItems: [signResult.item], completionHandler: nil)
  }
}
