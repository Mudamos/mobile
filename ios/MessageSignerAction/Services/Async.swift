//
//  Async.swift
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 22/01/18.
//  Copyright © 2018 Tagview. All rights reserved.
//

import Foundation

struct Async {
  static func delay(_ delay: Double, closure: @escaping () -> ()) {
    let when = DispatchTime.now() + delay
    DispatchQueue.main.asyncAfter(deadline: when, execute: closure)
  }

  static func main(closure: @escaping () -> ()) {
    DispatchQueue.main.async(execute: closure)
  }

  static func background(_ delay: Double = 0, closure: @escaping () -> ()) {
   let when = DispatchTime.now() + delay
    DispatchQueue.global(qos: .default).asyncAfter(deadline: when, execute: closure)
  }
}
