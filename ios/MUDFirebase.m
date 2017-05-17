//
//  MUDFirebase.m
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 5/17/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MUDFirebase.h"
#import "MUDFirebaseConfig.h"

@interface MUDFirebase()

@property (nonatomic, strong) MUDFirebaseConfig *config;

@end

@implementation MUDFirebase
  RCT_EXPORT_MODULE();

- (id)init {
  self = [super init];

  if (self) {
    _config = [[MUDFirebaseConfig alloc] init];
  }

  return self;
}

RCT_EXPORT_METHOD(getStringConfig:(NSString*)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [self.config getString:name resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(getNumberConfig:(NSString*)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [self.config getNumber:name resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(getBooleanConfig:(NSString*)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [self.config getBoolean:name resolver:resolve rejecter:reject];
}

@end
