//
//  SignerAction.m
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 13/12/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "SignerAction.h"
#import "ActionViewController.h"
#import "RCTBridge.h"

@implementation SignerAction

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (void)loadBundle {
  [_bridge reload];
}

RCT_EXPORT_METHOD(done:result) {
  NSLog(@"Done js entrypoint result %@", result);
  [actionViewController doneWithResult:result];
}

RCT_EXPORT_METHOD(restart) {
  [self loadBundle];
}

RCT_REMAP_METHOD(inputData,
                 findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [actionViewController extractDataWithCallBack:^(NSDictionary *value, NSError *error) {
    if (error) {
      reject(@"an error code", @"a message", error);
    } else {
      resolve(value);
    }
  }];
}

@end
