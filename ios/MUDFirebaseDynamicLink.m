//
//  MUDFirebaseDynamicLink.m
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 20/04/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "MUDFirebaseDynamicLink.h"
#import <React/RCTLog.h>

@implementation MUDFirebaseDynamicLink
{
  bool hasListeners;
  NSString *initialLink;
}

static MUDFirebaseDynamicLink *myInstance = nil;

RCT_EXPORT_MODULE();

+ (nonnull instancetype)instance {
  if (myInstance == nil) {
    myInstance = [[MUDFirebaseDynamicLink alloc] init];
  }

  return myInstance;
}

- (instancetype)init {
  self = [super init];

  if (self != nil) {
    myInstance = self;
    hasListeners = NO;
  }

  return self;
}

+ (NSString *)EVENT_DEEP_LINK_RECEIVED {
  return @"onDeepLinkReceived";
}

+ (NSString *)DEEPLINKRECEIVED {
  return @"DEEPLINKRECEIVED";
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[MUDFirebaseDynamicLink.EVENT_DEEP_LINK_RECEIVED];
}

- (void)handleLink:(NSURL *)url {
  RCTLog(@"Deep links received");

  if (hasListeners) { // Only send events if anyone is listening
    RCTLog(@"Firing event");

    [self sendEventWithName:MUDFirebaseDynamicLink.EVENT_DEEP_LINK_RECEIVED
                       body:url.absoluteString];
  } else {
    RCTLog(@"Buffering deep link");
    self.bufferUrl = url.absoluteString;
  }
}

- (void)startObserving {
  hasListeners = YES;
  RCTLog(@"Started observing deep links");

  if (self.bufferUrl) {
    RCTLog(@"Firing buffered deep link");
    [self sendEventWithName:MUDFirebaseDynamicLink.EVENT_DEEP_LINK_RECEIVED
                       body:self.bufferUrl];
    self.bufferUrl = nil;
  }
}

- (void)stopObserving {
  hasListeners = NO;
  self.bufferUrl = nil;
  RCTLog(@"Stopped observing deep links");
}

- (void) dealloc {
  RCTLog(@"Deep link dealloc");
  hasListeners = NO;
  self.bufferUrl = nil;
}

@end
