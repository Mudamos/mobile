//
//  String.swift
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 15/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

extension String {
  var dateFromISO8601: Date? {
    return Formatter.iso8601.date(from: self)
  }
}
