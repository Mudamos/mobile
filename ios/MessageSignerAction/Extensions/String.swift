//
//  String.swift
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 19/01/18.
//  Copyright © 2018 Tagview. All rights reserved.
//

import Foundation

extension String {
  var dateFromISO8601: Date? {
    return Formatter.iso8601.date(from: self)
  }
}
