//
//  ActionViewController.h
//  MessageSignerActionBeta
//
//  Created by Guilherme da Silva Mello on 13/12/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ActionViewController : UIViewController
- (void)doneWithResult:(NSDictionary*)result;
- (void)extractDataWithCallBack:(void(^)(NSDictionary *value, NSError *error))callback;

extern ActionViewController *actionViewController;
@end
