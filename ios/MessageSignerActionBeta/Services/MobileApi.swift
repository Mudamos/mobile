//
//  MobileApi.swift
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 10/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import Alamofire

class MobileApi {
  let host: String
  let sessionService: SessionService

  var sessionToken: String? {
    return sessionService.retrieve()
  }

  init() {
    host = ProcessInfo.processInfo.environment["MOBILE_API_URL"]!
    sessionService = SessionService()
  }

  init(host: String, sessionService: SessionService) {
    self.host = host
    self.sessionService = sessionService
  }

  func profile(completionHandler: @escaping (User?, MUDError?) -> ()) {
    let headers = buildAuthHeaders([:])

    Alamofire.request(buildURL("/api/v1/profile"), headers: headers).validate().responseJSON { response in
      self.handleResponse(response: response) { data, error in
        if let profileData = data, let userData = profileData["user"] as? [String: Any] {
          completionHandler(User(json: userData), nil)
        } else {
          completionHandler(nil, .Unknown(NSError(domain: "", code: -1, userInfo: nil)))
        }
      }
    }
  }

  private func handleResponse(response: DataResponse<Any>, completionHandler: ([String: Any]?, MUDError?) -> ()) {
    switch response.result {
    case .success:
      guard let value = response.result.value as? [String: Any] else {
        return completionHandler(nil, .Unknown(NSError(domain: "", code: -1, userInfo: nil)))
      }

      if self.isValid(value) {
        return completionHandler(value["data"] as? [String: Any], nil)
      }

      completionHandler(nil, .Unknown(NSError(domain: "", code: -1, userInfo: nil)))
    case .failure(let error):
      print(error)

      if response.response?.statusCode == 401 {
        return completionHandler(nil, .Unauthorized(error))
      }

      completionHandler(nil, .Unknown(error))
    }
  }

  private func isValid(_ data: [String: Any]) -> Bool {
    guard let status = data["status"] as? String else {
      return false
    }

    return status == "success"
  }

  private func buildURL(_ path: String) -> String {
    return "\(host)\(path)"
  }

  private func buildAuthHeaders(_ headers: HTTPHeaders) -> HTTPHeaders {
    let defaultHeaders: HTTPHeaders = [
      "Authorization": "Bearer \(sessionToken ?? "")"
    ]

    return defaultHeaders.merging(headers) { _, new in new }
  }
}
