//
//  Date.swift
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 15/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

extension Date {
  var iso8601: String {
    return Formatter.iso8601.string(from: self)
  }
}
