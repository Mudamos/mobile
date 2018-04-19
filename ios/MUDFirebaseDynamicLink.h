//
//  MUDFirebaseDynamicLink.h
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 20/04/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface MUDFirebaseDynamicLink : RCTEventEmitter<RCTBridgeModule>

+ (_Nonnull instancetype)instance;

+ (NSString *)EVENT_DEEP_LINK_RECEIVED;
+ (NSString *)DEEPLINKRECEIVED;

@property (nonatomic, strong) NSString *bufferUrl;

- (void)handleLink:(NSURL *)url;

@end
