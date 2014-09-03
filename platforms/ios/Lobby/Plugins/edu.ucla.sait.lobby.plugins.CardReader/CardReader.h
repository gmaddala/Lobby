//
//  CardReader.h
//  HelloWorld
//
//  Created by SAIT on 7/8/14.
//
//

#import <Cordova/CDVPlugin.h>
#import <UIKit/UIKit.h>
#import <ExternalAccessory/ExternalAccessory.h>

#import "MediaPlayer/MediaPlayer.h"

@class MTSCRA;

@interface CardReader : CDVPlugin

- (void) RunCardReaderListener:(CDVInvokedUrlCommand *)command;

- (void) StopCardReaderListener:(CDVInvokedUrlCommand *)command;

#pragma mark -
#pragma mark MTSCRA Property
#pragma mark -

@property (nonatomic, strong) MTSCRA *mtSCRALib;

@property (nonatomic, strong) CDVInvokedUrlCommand *cordovaCommand;

#pragma mark -
#pragma mark Helper Methods
#pragma mark -

- (void)openDevice;
- (void)closeDevice;
- (BOOL)isHeadsetPluggedIn;

@end
