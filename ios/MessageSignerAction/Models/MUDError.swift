//
//  MUDError.swift
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 19/01/18.
//  Copyright © 2018 Tagview. All rights reserved.
//

import Foundation

enum MUDError {
  case Unauthorized(Error)
  case Unknown(Error)
  case Fail(String?)
  case NotLoggedIn

  case IncompleteProfile
  case InvalidWallet

  case InvalidMudamosPayload(String)
  case MissingMudamosPayloadIdentifier(String)

  case SignError

  var identifier: String {
    switch self {
    case .Fail(let key):
      return key ?? "unknown-error";
    case .Unauthorized(_):
      return "user-not-logged-in"
    case .Unknown(_):
      return "unknown-error"
    case .NotLoggedIn:
      return "user-not-logged-in"
    case .IncompleteProfile:
      return "incomplete-profile"
    case .InvalidMudamosPayload(let e):
      return e
    case .InvalidWallet:
      return "invalid-wallet"
    case .MissingMudamosPayloadIdentifier(let e):
      return e
    case .SignError:
      return "sign-error"
    }
  }

  var userMessage: String {
    return NSLocalizedString(identifier, comment: "")
  }
}
