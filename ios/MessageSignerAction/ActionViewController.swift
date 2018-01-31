//
//  ActionViewController.swift
//  MessageSignerAction
//
//  Created by Guilherme da Silva Mello on 19/01/18.
//  Copyright © 2018 Tagview. All rights reserved.
//

import UIKit
import MobileCoreServices

class ActionViewController: UIViewController {

  @IBOutlet weak var loader: UIActivityIndicatorView!
  @IBOutlet weak var resultLabel: UILabel!
  @IBOutlet weak var loaderLabel: UILabel!

  let api = MobileApi()
  let sessionService = SessionService()
  var signer: Signer!
  let mudamosPayload = MudamosPayload()

  let gradientLayer: CAGradientLayer = {
    let gradient = CAGradientLayer()
    gradient.colors = [
      UIColor(red:0.44, green:0.29, blue:0.87, alpha:1).cgColor,
      UIColor(red:0.71, green:0.16, blue:0.91, alpha:1).cgColor
    ]
    gradient.locations = [0, 1]
    gradient.startPoint = CGPoint(x: -0.14, y: -0.14)
    gradient.endPoint = CGPoint(x: 1.51, y: 1.44)

    return gradient
  }()

  override var preferredStatusBarStyle: UIStatusBarStyle {
    return .lightContent
  }

  override func viewDidLoad() {
    super.viewDidLoad()

    prepareLayout()
    self.signer = Signer(withDelegate: self)
    signer.load()
  }

  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    gradientLayer.frame = view.bounds
  }

  private func prepareLayout() {
    gradientLayer.frame = view.bounds
    view.layer.insertSublayer(gradientLayer, at: 0)

    resultLabel.text = nil
    loaderLabel.text = NSLocalizedString("executing-action-wait", comment: "")
    loader.startAnimating()
  }

  private func prepareForExit() {
    loader.stopAnimating()
    loaderLabel.isHidden = true
  }

  private func signUserMessage(message: MudamosMessage, user: User) {
    api.difficulty { result, error in
      if error != nil {
        return self.signDidFail(error: error!)
      }

      guard let difficulty = result else {
        return self.signDidFail(error: MUDError.Unknown(NSError(domain: "mudamos", code: -1, userInfo: nil)))
      }

      self.signer.sign(message: message, voteCard: user.voteCard!, difficulty: difficulty)
    }
  }

  private func close(withResult result: NSExtensionItem, delay: Double = 1.5) {
    Async.delay(delay) {
      self.extensionContext!.completeRequest(returningItems: [result], completionHandler: nil)
    }
  }
}

extension ActionViewController: SignerDelegate {
  func signerReady() {
    Async.background {
      self.mudamosPayload.extractMessage(item: self.extensionContext?.inputItems.first as? NSExtensionItem) { messageToSign, error in
        if error != nil {
          return self.signDidFail(error: error!)
        }

        if !self.sessionService.isLoggedIn() {
          return self.signDidFail(error: MUDError.NotLoggedIn)
        }

        self.api.profile() { result, error in
          if error != nil {
            return self.signDidFail(error: error!)
          }

          guard let user = result else {
            return self.signDidFail(error: MUDError.IncompleteProfile)
          }

          if !self.signer.canSign(user) {
            return self.signDidFail(error: MUDError.IncompleteProfile)
          }

          self.signer.isWalletValid(voteCard: user.voteCard!) { valid in
            if !valid {
              return self.signDidFail(error: MUDError.InvalidWallet)
            }

            self.signUserMessage(message: messageToSign!, user: user)
          }
        }
      }
    }
  }

  func signDidFail(error: MUDError) {
    Async.main {
      self.prepareForExit()
      self.resultLabel.text = error.userMessage
    }

    let result = mudamosPayload.buildResponseResult(withError: error)
    close(withResult: result, delay: 2)
  }

  func didFinishSign(result: SignerResult) {
    Async.main {
      self.prepareForExit()
      self.resultLabel.text = NSLocalizedString("success!", comment: "")
    }

    let result = mudamosPayload.buildResponseResult(withResult: result)
    close(withResult: result)
  }
}
