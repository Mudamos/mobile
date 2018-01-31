//
//  Bool.swift
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 22/01/18.
//  Copyright © 2018 Tagview. All rights reserved.
//

import Foundation

extension Bool {
  public static func fromJson(_ value: Any?) -> Bool {
    if let v = value as? Bool {
      return v
    }

    if let v = value as? Int {
      return v == 1
    }

    return false
  }
}
