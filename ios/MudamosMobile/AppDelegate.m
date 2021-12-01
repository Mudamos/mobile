#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLog.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "IQKeyboardManager.h"
#import "ReactNativeConfig.h"
#import <Firebase.h>

#import "MUDFirebaseDynamicLink.h"

//#ifdef FB_SONARKIT_ENABLED
//#import <FlipperKit/FlipperClient.h>
//#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
//#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
//#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
//#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
//#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
//static void InitializeFlipper(UIApplication *application) {
//  FlipperClient *client = [FlipperClient sharedClient];
//  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
//  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
//  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
//  [client addPlugin:[FlipperKitReactPlugin new]];
//  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
//  [client start];
//}
//#endif

@interface AppDelegate()

- (void)notifyDynamicLink:(NSURL *)url;

@end

@implementation AppDelegate

@synthesize oneSignal = _oneSignal;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
 // #ifdef FB_SONARKIT_ENABLED
 //   InitializeFlipper(application);
 // #endif
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                      moduleName:@"MudamosMobile"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [FIRApp configure];

  [IQKeyboardManager sharedManager].toolbarDoneBarButtonItemText = @"OK";

  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                         appId:[ReactNativeConfig envFor:@"ONESIGNAL_APP_ID"]
                                                      settings:@{kOSSettingsKeyInFocusDisplayOption : @(OSNotificationDisplayTypeNotification), kOSSettingsKeyAutoPrompt : @YES}];

  [FBSDKApplicationDelegate initializeSDK:launchOptions];

  //return YES;
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                  didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *))restorationHandler {
  BOOL handled = [[FIRDynamicLinks dynamicLinks] handleUniversalLink:userActivity.webpageURL
                                                          completion: ^(FIRDynamicLink * _Nullable dynamicLink, NSError * _Nullable error) {
                                                            if (dynamicLink && !error) {
                                                              RCTLog(@"App link %@", dynamicLink.url);
                                                              [self notifyDynamicLink:dynamicLink.url];
                                                            } else {
                                                              RCTLog(@"App link error %@", error);
                                                            }
                                                          }];
  return handled;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  FIRDynamicLink *dynamicLink = [[FIRDynamicLinks dynamicLinks] dynamicLinkFromCustomSchemeURL:url];

  RCTLog(@"URL received %@", url);

  if (dynamicLink && dynamicLink.url) {
    [self notifyDynamicLink:dynamicLink.url];
    return YES;
  }

  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation];
}

- (void)notifyDynamicLink:(NSURL *)url {
  [[MUDFirebaseDynamicLink instance] handleLink:url];
}

@end
