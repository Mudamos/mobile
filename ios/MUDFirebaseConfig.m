//
//  MUDFirebaseConfig.m
//  MudamosMobile
//
//  Created by Guilherme da Silva Mello on 5/17/17.
//  Copyright © 2017 Facebook. All rights reserved.
//


@import Firebase;
#import "MUDFirebaseConfig.h"
#import "RCTLog.h"


@interface MUDFirebaseConfig()

@property (nonatomic, strong) FIRRemoteConfig *remoteConfig;

- (NSNumber*)sourceFrom:(FIRRemoteConfigSource)source;

- (void)setDefaults;

@end

@implementation MUDFirebaseConfig

- (id)init {
  self = [super init];

  if (self) {
    _remoteConfig = [FIRRemoteConfig remoteConfig];

    #ifdef DEBUG
      FIRRemoteConfigSettings *remoteConfigSettings = [[FIRRemoteConfigSettings alloc] initWithDeveloperModeEnabled:YES];
      _remoteConfig.configSettings = remoteConfigSettings;
    #endif

    [self setDefaults];
    [self fetchConfig];
  }

  return self;
}

- (void)setDefaults {
  [self.remoteConfig setDefaults:@{
    @"authenticated_signers_button_title": @"Lista de assinantes e outras informações",
    @"plip_remaining_days_enabled": @"true",
    @"link_get_to_know_mudamos": @"https://www.mudamos.org",
    @"link_help": @"https://www.mudamos.org/ajuda",
    @"link_send_your_idea": @"https://www.mudamos.org/envie-sua-ideia",
    @"link_why_projects": @"https://www.mudamos.org/institucional/projetos-de-lei-de-iniciativa-popular",
    @"ineligible_to_sign_citywide_plip_reason": @"Obrigado por seu apoio, mas você só pode assinar esse projeto de lei sendo eleitor do município para o qual a lei se destina.",
    @"ineligible_to_sign_statewide_plip_reason": @"Obrigado por seu apoio, mas você só pode assinar esse projeto de lei sendo eleitor do estado para o qual a lei se destina."
  }];
}

- (void)fetchConfig {
  long expirationDuration = 3600;
  if (self.remoteConfig.configSettings.isDeveloperModeEnabled) {
    expirationDuration = 0;
  }

  [self.remoteConfig fetchWithExpirationDuration:expirationDuration completionHandler:^(FIRRemoteConfigFetchStatus status, NSError *error) {
    if (status == FIRRemoteConfigFetchStatusSuccess) {
      RCTLog(@"Firebase remote config fetched");
      [self.remoteConfig activateFetched];
    } else {
      RCTLog(@"Firebase remote config not fetched");
    }
  }];
}

- (NSNumber*)sourceFrom:(FIRRemoteConfigSource)source {
  return [NSNumber numberWithInt: source];
}

- (void)getString:(NSString*)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject {
  FIRRemoteConfigValue *config = [self.remoteConfig configValueForKey: name];

  resolve(@{ @"value": config.stringValue, @"source": [self sourceFrom: config.source] });
}


- (void)getBoolean:(NSString*)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject {
  FIRRemoteConfigValue *config = [self.remoteConfig configValueForKey: name];

  resolve(@{ @"value": [NSNumber numberWithBool: config.boolValue], @"source": [self sourceFrom: config.source] });
}

- (void)getNumber:(NSString*)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject {
  FIRRemoteConfigValue *config = [self.remoteConfig configValueForKey: name];

  resolve(@{ @"value": config.numberValue, @"source":[self sourceFrom: config.source] });
}


@end
