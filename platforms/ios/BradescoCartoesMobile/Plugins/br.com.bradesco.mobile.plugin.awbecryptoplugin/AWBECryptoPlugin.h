#import <Cordova/CDV.h>
#import <Security/Security.h>

@interface AWBECryptoPlugin : CDVPlugin

-(void)generateKeyPair:(CDVInvokedUrlCommand*)command;

-(void)decrypt:(CDVInvokedUrlCommand*)command;


@end