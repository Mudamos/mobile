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

class ActionViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {

  @IBOutlet weak var imageView: UIImageView!

  var webView: WKWebView!

  let api = MobileApi()
  let walletService = WalletService()

  func delay(_ delay:Double, closure: @escaping () -> ()) {
    let when = DispatchTime.now() + delay
    DispatchQueue.main.asyncAfter(deadline: when, execute: closure)
  }

  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    print("result: \(message.body)")
    guard let body = message.body as? [String: Any] else {
      print("could not convert message body to dictionary")
      return
    }

    guard let signedMessage = body["signedMessage"] as? String else {
      print("failed sign lib crypto signedMessage")
      return
    }

    guard let timestamp = body["timestamp"] as? String else {
      print("failed sign lib crypto timestamp")
      return
    }

//    guard let seed = body["seed"] as? [String: Any] else {
//      print("fail seed")
//      return
//    }

//    guard let key = seed["publicKey"] as? String else {
//      print("key failed")
//      return
//    }
//
//    print("key: \(key)")

    print("timestamp: \(timestamp), signedMessage: \(signedMessage)")

    api.signMessage(message: signedMessage) { result, error in
      print("sign error: \(error)")
      print("sign result: \(result)")

      if let publicKey = result {
        print("publicKey: \(publicKey)")
      }
    }
  }

  func buildMessage(input: String, now: String) -> String {
    return [input, now].joined(separator: ";")
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
//    let thing = "`jamantafeliz`"
//    self.webView.evaluateJavaScript("getThingy(\(thing))") { r, e in
//      print("result: \(r)")
//      print("error: \(e)")
//    }

    print("will call profile")

    api.profile() { result, error in
      print("profile: \(result)")
      print("request error: \(error)")

      if let user = result, let voteCard = user.voteCard {
        let seed = self.walletService.retrieve(password: voteCard)
        print("le seed: \(seed)")

        if let encryptedSeed = seed {
          self.webView.evaluateJavaScript("getSeed(`\(encryptedSeed)`, `\(voteCard)`)") { r, e in
            print("result seed: \(r)")
            print("error seed: \(e)")

            if let realSeed = r {
              print("real seed: \(realSeed)")

              self.webView.evaluateJavaScript("validateWallet(`\(realSeed)`)") { r, e in
                print("validateWallet error: \(e)")

                if let _ = r as? Bool {
                  print("valid wallet")

                  self.api.difficulty { result, error in
                    print("difficulty error: \(error)")
                    print("difficulty: \(result)")

                    if let difficulty = result {
                      let input = "abacatecremoso"
                      let now = Date().iso8601

                      let message = self.buildMessage(input: input, now: now)
                      print("message: \(message)")
                      print("signMessage(`\(realSeed)`, `\(message)`, \(difficulty), `\(now)`)")
                      self.webView.evaluateJavaScript("signMessage(`\(realSeed)`, `\(message)`, \(difficulty), `\(now)`)") { _, e in
                        print("lib crypto error: \(String(describing: e))")
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  override func viewDidLoad() {
    super.viewDidLoad()

    print("begin")

    //let url = Bundle.main.url(forResource: "sign", withExtension: "html")
    let url = Bundle.main.path(forResource: "sign", ofType: "html")
    print("url: \(url)")
    let content = try? String(contentsOfFile: url!, encoding: .utf8)
    print("has content: \(content != nil)")
    let contentController = WKUserContentController()
    contentController.add(self, name: "myController")
    print("built contentController")

    let configuration = WKWebViewConfiguration()
    configuration.userContentController = contentController
    print("built configuration")

    webView = WKWebView(frame: .zero, configuration: configuration)
    print("built webview")
    webView.navigationDelegate = self
    print("will load url")
    //webView.load(URLRequest(url: url!))
    webView.loadHTMLString(content!, baseURL: nil)
    print("view did load")

    //
    //        delay(5) {
    //            print("weee")
    //
    //            self.webView.evaluateJavaScript("getThingy()") { r, e in
    //
    //                print("result: \(r)")
    //                print("error: \(e)")
    //            }
    //        }

    
    //        // Get the item[s] we're handling from the extension context.
    //
    //        // For example, look for an image and place it into an image view.
    //        // Replace this with something appropriate for the type[s] your extension supports.
    //        var imageFound = false
    //        for item in self.extensionContext!.inputItems as! [NSExtensionItem] {
    //            for provider in item.attachments! as! [NSItemProvider] {
    //                if provider.hasItemConformingToTypeIdentifier(kUTTypeImage as String) {
    //                    // This is an image. We'll load it, then place it in our image view.
    //                    weak var weakImageView = self.imageView
    //                    provider.loadItem(forTypeIdentifier: kUTTypeImage as String, options: nil, completionHandler: { (imageURL, error) in
    //                        OperationQueue.main.addOperation {
    //                            if let strongImageView = weakImageView {
    //                                if let imageURL = imageURL as? URL {
    //                                    strongImageView.image = UIImage(data: try! Data(contentsOf: imageURL))
    //                                }
    //                            }
    //                        }
    //                    })
    //
    //                    imageFound = true
    //                    break
    //                }
    //            }
    //
    //            if (imageFound) {
    //                // We only handle one image, so stop looking for more.
    //                break
    //            }
    //        }
  }

  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }

  @IBAction func done() {
    webView.navigationDelegate = nil
    // Return any edited content to the host app.
    // This template doesn't do anything, so we just echo the passed in items.
    self.extensionContext!.completeRequest(returningItems: self.extensionContext!.inputItems, completionHandler: nil)
  }

}
