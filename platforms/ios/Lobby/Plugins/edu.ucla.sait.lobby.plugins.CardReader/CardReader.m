//
//  CardReader.m
//  HelloWorld
//
//  Created by SAIT on 7/8/14.
//
//

#import "MTSCRA.h"
#import "CardReader.h"
#import "MediaPlayer/MPMusicPlayerController.h"

#define _DGBPRNT
#define PROTOCOLSTRING @"com.magtek.idynamo"

@implementation CardReader
-(void) RunCardReaderListener:(CDVInvokedUrlCommand *)command{
    self.cordovaCommand = command;
    self.mtSCRALib = [[MTSCRA alloc] init];
    [self.mtSCRALib listenForEvents:(TRANS_EVENT_OK|TRANS_EVENT_START|TRANS_EVENT_ERROR)];
    
    
    
    if([self isHeadsetPluggedIn])
    {
        [self.mtSCRALib setDeviceType:(MAGTEKAUDIOREADER)];
    }
    else{
        [self.mtSCRALib setDeviceType:(MAGTEKIDYNAMO)];
        [self.mtSCRALib setDeviceProtocolString:(@"com.magtek.idynamo")];
    }
    
    
    [self openDevice];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(trackDataReady:)
                                                 name:@"trackDataReadyNotification"
                                               object:nil];
}

-(void) StopCardReaderListener:(CDVInvokedUrlCommand *)command{
    self.cordovaCommand = command;
    [self closeDevice];
}


#pragma mark -
#pragma mark Post Notification Selector Methods
#pragma mark -

- (void)trackDataReady:(NSNotification *)notification
{
    NSNumber *status = [[notification userInfo] valueForKey:@"status"];
    
    [self performSelectorOnMainThread:@selector(onDataEvent:)
                           withObject:status
                        waitUntilDone:NO];
}

#pragma mark -
#pragma mark Post Notification Selector Helper Methods
#pragma mark -

- (void)onDataEvent:(id)status
{
#ifdef _DGBPRNT
    NSLog(@"onDataEvent: %i", [status intValue]);
#endif
    
	switch ([status intValue])
    {
        case TRANS_STATUS_OK:
        {
            BOOL bTrackError = NO;
            
            NSString *pstrTrackDecodeStatus = [self.mtSCRALib getTrackDecodeStatus];
            
            [self returnData];
            
            @try
            {
                if(pstrTrackDecodeStatus)
                {
                    if(pstrTrackDecodeStatus.length >= 6)
                    {
#ifdef _DGBPRNT
                        NSString *pStrTrack1Status = [pstrTrackDecodeStatus substringWithRange:NSMakeRange(0, 2)];
                        NSString *pStrTrack2Status = [pstrTrackDecodeStatus substringWithRange:NSMakeRange(2, 2)];
                        NSString *pStrTrack3Status = [pstrTrackDecodeStatus substringWithRange:NSMakeRange(4, 2)];
                        
                        if(pStrTrack1Status && pStrTrack2Status && pStrTrack3Status)
                        {
                            if([pStrTrack1Status compare:@"01"] == NSOrderedSame)
                            {
                                bTrackError=YES;
                            }
                            
                            if([pStrTrack2Status compare:@"01"] == NSOrderedSame)
                            {
                                bTrackError=YES;
                                
                            }
                            
                            if([pStrTrack3Status compare:@"01"] == NSOrderedSame)
                            {
                                bTrackError=YES;
                                
                            }
                            
                            NSLog(@"Track1.Status=%@",pStrTrack1Status);
                            NSLog(@"Track2.Status=%@",pStrTrack2Status);
                            NSLog(@"Track3.Status=%@",pStrTrack3Status);
                        }
#endif
                    }
                }
                
            }
            @catch(NSException *e)
            {
            }
            
            if(bTrackError == NO)
            {
                //[self closeDevice];
            }
            
            break;
            
        }
        case TRANS_STATUS_START:
        
        /*
         *
         *  NOTE: TRANS_STATUS_START should be used with caution. CPU intensive tasks done after this events and before
         *        TRANS_STATUS_OK may interfere with reader communication.
         *
         */
        
#ifdef _DGBPRNT
        NSLog(@"TRANS_STATUS_START");
#endif
        
        break;
        
        case TRANS_STATUS_ERROR:
        
        if(self.mtSCRALib != NULL)
        {
#ifdef _DGBPRNT
            NSLog(@"TRANS_STATUS_ERROR");
#endif
            
        }
        
        break;
        
        default:
        
        break;
    }
}

- (void)returnData
{
    if(self.self.mtSCRALib != NULL)
    {
        NSString *pResponse = [NSString stringWithFormat:@"Response.Type: %@\n"
                               "Track.Status: %@\n"
                               "Card.Status: %@\n"
                               "Encryption.Status: %@\n"
                               "Battery.Level: %ld\n"
                               "Swipe.Count: %ld\n"
                               "Track.Masked: %@\n"
                               "Track1.Masked: %@\n"
                               "Track2.Masked: %@\n"
                               "Track3.Masked: %@\n"
                               "Track1.Encrypted: %@\n"
                               "Track2.Encrypted: %@\n"
                               "Track3.Encrypted: %@\n"
                               "MagnePrint.Encrypted: %@\n"
                               "MagnePrint.Status: %@\n"
                               "SessionID: %@\n"
                               "Card.IIN: %@\n"
                               "Card.Name: %@\n"
                               "Card.Last4: %@\n"
                               "Card.ExpDate: %@\n"
                               "Card.SvcCode: %@\n"
                               "Card.PANLength: %d\n"
                               "KSN: %@\n"
                               "Device.SerialNumber: %@\n"
                               "TLV.CARDIIN: %@\n"
                               "MagTek SN: %@\n"
                               "Firmware Part Number: %@\n"
                               "TLV Version: %@\n"
                               "Device Model Name: %@\n"
                               "Capability MSR: %@\n"
                               "Capability Tracks: %@\n"
                               "Capability Encryption: %@\n",
                               [self.mtSCRALib getResponseType],
                               [self.mtSCRALib getTrackDecodeStatus],
                               [self.mtSCRALib getCardStatus],
                               [self.mtSCRALib getEncryptionStatus],
                               [self.mtSCRALib getBatteryLevel],
                               [self.mtSCRALib getSwipeCount],
                               [self.mtSCRALib getMaskedTracks],
                               [self.mtSCRALib getTrack1Masked],
                               [self.mtSCRALib getTrack2Masked],
                               [self.mtSCRALib getTrack3Masked],
                               [self.mtSCRALib getTrack1],
                               [self.mtSCRALib getTrack2],
                               [self.mtSCRALib getTrack3],
                               [self.mtSCRALib getMagnePrint],
                               [self.mtSCRALib getMagnePrintStatus],
                               [self.mtSCRALib getSessionID],
                               [self.mtSCRALib getCardIIN],
                               [self.mtSCRALib getCardName],
                               [self.mtSCRALib getCardLast4],
                               [self.mtSCRALib getCardExpDate],
                               [self.mtSCRALib getCardServiceCode],
                               [self.mtSCRALib getCardPANLength],
                               [self.mtSCRALib getKSN],
                               [self.mtSCRALib getDeviceSerial],
                               [self.mtSCRALib getTagValue:TLV_CARDIIN],
                               [self.mtSCRALib getMagTekDeviceSerial],
                               [self.mtSCRALib getFirmware],
                               [self.mtSCRALib getTLVVersion],
                               [self.mtSCRALib getDeviceName],
                               [self.mtSCRALib getCapMSR],
                               [self.mtSCRALib getCapTracks],
                               [self.mtSCRALib getCapMagStripeEncryption]];
        
        //[self.responseData    setText:pResponse];
        //[self.rawResponseData setText:[self.mtSCRALib getResponseData]];
        
#ifdef _DGBPRNT
        NSLog(@"%@", pResponse);
#endif
        if([self.mtSCRALib getTrack1Masked].length == 0)
        {
            CDVPluginResult *pluginResult = [CDVPluginResult
                                             resultWithStatus: CDVCommandStatus_ERROR                                     messageAsString: @"Did not capture UID"];
            
            [self.mtSCRALib clearBuffers];
            
            [self.commandDelegate sendPluginResult:pluginResult callbackId:self.cordovaCommand.callbackId];
        }
        else
        {
            NSString * uid = [[self.mtSCRALib getTrack1Masked] substringWithRange:NSMakeRange(6, 9)];
    #ifdef _DGBPRNT
            NSLog(@"%@", uid);
    #endif
            CDVPluginResult *pluginResult = [CDVPluginResult
                                             resultWithStatus: CDVCommandStatus_OK
                                             messageAsString: uid];
            
            [self.mtSCRALib clearBuffers];
            
            [self.commandDelegate sendPluginResult:pluginResult callbackId:self.cordovaCommand.callbackId];
        }
    }
}


- (void)openDevice
{
    
    
    if(![self.mtSCRALib isDeviceOpened])
    {
        [self.mtSCRALib openDevice];
    }
    /*
    if(![self.mtSCRALib isDeviceConnected])
    {
        CDVPluginResult *pluginResult = [CDVPluginResult
                                         resultWithStatus: CDVCommandStatus_ERROR
                                         messageAsString: @"Device not connected"];
        
        [self.mtSCRALib clearBuffers];
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.cordovaCommand.callbackId];
    }*/
}

- (void)closeDevice
{
    if([self.mtSCRALib isDeviceOpened])
    {
        [self.mtSCRALib closeDevice];
    }
    
    [self.mtSCRALib clearBuffers];
    
}

- (BOOL)isHeadsetPluggedIn {
    UInt32 routeSize = sizeof (CFStringRef);
    CFStringRef route;
    
    OSStatus error = AudioSessionGetProperty (kAudioSessionProperty_AudioRoute,
                                              &routeSize,
                                              &route);
    
    /* Known values of route:
     * "Headset"
     * "Headphone"
     * "Speaker"
     * "SpeakerAndMicrophone"
     * "HeadphonesAndMicrophone"
     * "HeadsetInOut"
     * "ReceiverAndMicrophone"
     * "Lineout"
     */
    
    if (!error && (route != NULL)) {
        
        NSString* routeStr = (NSString*)CFBridgingRelease(route);
        
        NSRange headphoneRange = [routeStr rangeOfString : @"Head"];
        
        if (headphoneRange.location != NSNotFound) return YES;
        
    }
    
    return NO;
}


@end
