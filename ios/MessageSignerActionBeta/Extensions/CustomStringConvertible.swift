//
//  CustomStringConvertible.swift
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 10/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

extension CustomStringConvertible {
  var description: String {
    var description: String = ""
    description = "***** \(type(of: self)) - ***** \n"

    let selfMirror = Mirror(reflecting: self)
    for child in selfMirror.children {
      if let propertyName = child.label {
        description += "\(propertyName): \(child.value)\n"
      }
    }
    return description
  }
}
