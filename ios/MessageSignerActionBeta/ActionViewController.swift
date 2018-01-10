//
//  ActionViewController.swift
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 09/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import MobileCoreServices

class ActionViewController: UIViewController {

    @IBOutlet weak var imageView: UIImageView!

    var webView: UIWebView?

    func delay(_ delay:Double, closure:@escaping ()->()) {
        let when = DispatchTime.now() + delay
        DispatchQueue.main.asyncAfter(deadline: when, execute: closure)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        print("begin")

        let url = Bundle.main.url(forResource: "sign", withExtension: "html")
        webView = UIWebView()
        webView?.loadRequest(URLRequest(url: url!))

        delay(5) {
            print("weee")

            let lol = self.webView?.stringByEvaluatingJavaScript(from: "window.result")
            print("lol \(lol)")
        }

    
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
        // Return any edited content to the host app.
        // This template doesn't do anything, so we just echo the passed in items.
        self.extensionContext!.completeRequest(returningItems: self.extensionContext!.inputItems, completionHandler: nil)
    }

}
