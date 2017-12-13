//
//  ActionViewController.m
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 13/12/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "ActionViewController.h"
#import <MobileCoreServices/MobileCoreServices.h>
#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"

@interface ActionViewController ()

@end

ActionViewController * actionViewController = nil;

@implementation ActionViewController

- (void)loadView {
  NSURL *jsCodeLocation;

  #if DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"action-index.ios" fallbackResource:nil];
  #else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"MudamosActionSigner"
                                               initialProperties:nil
                                                   launchOptions:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.view = rootView;
  actionViewController = self;
}

- (void)extractDataWithCallBack:(void(^)(NSDictionary *value, NSError *error))callback {
  NSExtensionItem *item = self.extensionContext.inputItems[0];
  if (!item) {
    return callback(nil, [[NSError alloc] initWithDomain:@"app" code:1 userInfo:@{@"no": @"item"}]);
  }

  NSItemProvider *itemProvider = item.attachments[0];
  if (!itemProvider) {
    return callback(nil, [[NSError alloc] initWithDomain:@"app" code:1 userInfo:@{@"no": @"item provider"}]);
  }

  if ([itemProvider hasItemConformingToTypeIdentifier:@"com.mudamos.signmessage"]) {
    [itemProvider loadItemForTypeIdentifier:@"com.mudamos.signmessage" options:nil completionHandler:^(id<NSSecureCoding> item, NSError *error) {
      if (error) {
        return callback(nil, [[NSError alloc] initWithDomain:@"app" code:1 userInfo:@{@"load": @"error", @"desc": error.description}]);
      }

      if (!item) {
        return callback(nil, [[NSError alloc] initWithDomain:@"app" code:1 userInfo:@{@"load": @"no item"}]);
      }

      NSDictionary *result = (NSDictionary *) item;
      callback(result, nil);
    }];
  } else {
    return callback(nil, [[NSError alloc] initWithDomain:@"app" code:1 userInfo:@{@"no": @"hasItemConformingToTypeIdentifier"}]);
  }
}

- (void)doneWithResult:(NSDictionary*)result {
  NSExtensionItem *item = [[NSExtensionItem alloc] init];
  [item setAttachments:@[[[NSItemProvider alloc] initWithItem:result typeIdentifier:@"com.mudamos.signmessage"]]];

  [self.extensionContext completeRequestReturningItems:@[item] completionHandler:nil];

  actionViewController = nil;
}

@end
