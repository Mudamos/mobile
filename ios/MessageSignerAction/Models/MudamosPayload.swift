//
//  MudamosPayload.swift
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 22/01/18.
//  Copyright © 2018 Tagview. All rights reserved.
//

import Foundation

class MudamosPayload {
  static let payloadIdentifier = "org.mudamos.signer.message"
  static let resultIdentifier = "org.mudamos.signer.message.result"

  func extractMessage(item maybeItem: NSExtensionItem?, completionHandler: @escaping (MudamosMessage?, MUDError?) -> ()) {
    guard let item = maybeItem else {
      return completionHandler(nil, MUDError.InvalidMudamosPayload("invalid-payload"))
    }

    guard let provider = item.attachments?.first as? NSItemProvider else {
      return completionHandler(nil,  MUDError.InvalidMudamosPayload("invalid-payload"))
    }

    if !provider.hasItemConformingToTypeIdentifier(MudamosPayload.payloadIdentifier) {
      return completionHandler(nil, MUDError.MissingMudamosPayloadIdentifier("identifier-not-found"))
    }

    provider.loadItem(forTypeIdentifier: MudamosPayload.payloadIdentifier, options: nil) { item, error in
      if error != nil || item == nil {
        return completionHandler(nil, MUDError.InvalidMudamosPayload("could-not-convert-message"))
      }

      guard let result = item as? [String: Any] else {
        return completionHandler(nil, MUDError.InvalidMudamosPayload("could-not-convert-message"))
      }

      guard let message = result["message"] as? String else {
        return completionHandler(nil, MUDError.InvalidMudamosPayload("could-not-convert-message"))
      }

      if message.count == 0 {
        return completionHandler(nil, MUDError.InvalidMudamosPayload("invalid-payload"))
      }

      completionHandler(MudamosMessage(data: message), nil)
    }
  }

  func buildResponseResult(withError error: MUDError) -> NSExtensionItem {
    let attrs: NSMutableDictionary = [
      "error": true,
      "message": error.identifier
    ]

    let provider = NSItemProvider(item: attrs, typeIdentifier: MudamosPayload.resultIdentifier)
    let item = NSExtensionItem()
    item.attachments = [provider]

    return item
  }

  func buildResponseResult(withResult result: SignerResult) -> NSExtensionItem {
    let attrs: NSMutableDictionary = [
      "error": false,
      "message": result.message,
      "signature": result.signature,
      "publicKey": result.publicKey,
      "timestamp": result.timestamp
    ]

    let provider = NSItemProvider(item: attrs, typeIdentifier: MudamosPayload.resultIdentifier)
    let item = NSExtensionItem()
    item.attachments = [provider]

    return item
  }
}

class MudamosMessage {
  let data: String

  init(data: String) {
    self.data = data
  }
}
