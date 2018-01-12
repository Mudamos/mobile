//
//  MUDError.swift
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 10/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

enum MUDError {
  case Unauthorized(Error)
  case Unknown(Error)
}
