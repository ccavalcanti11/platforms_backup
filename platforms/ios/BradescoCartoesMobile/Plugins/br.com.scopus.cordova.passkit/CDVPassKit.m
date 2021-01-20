//
//  CDVPassKit.m
// Implementação dos plugins para acesos a Apple Wallet (PassKit.framework)
//  Created by Thiago Busso on 2018-03-19.
//
//

#import "CDVPassKit.h"
#import <PassKit/PassKit.h>


/*
*  System Versioning Preprocessor Macros
*/

#define SYSTEM_VERSION_EQUAL_TO(v)                  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedSame)
#define SYSTEM_VERSION_GREATER_THAN(v)              ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedDescending)
#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN(v)                 ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN_OR_EQUAL_TO(v)     ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedDescending)

#if !defined(StringOrEmpty)
#define StringOrEmpty(A)  ({ __typeof__(A) __a = (A); __a ? __a : @""; })
#endif


/**
 Plugin para acesso ao PassKit
 */
@implementation CDVPassKit

- (void) isPassLibraryAvaliable:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        BOOL avaliable = [PKPassLibrary isPassLibraryAvailable];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:avaliable];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void) passes:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        PKPassLibrary* passLibrary = [[PKPassLibrary alloc]init];
        NSArray<PKPass*>* passes =  [passLibrary passes];
        
        NSMutableArray *ret = [[NSMutableArray alloc]initWithCapacity:passes.count];
        for (PKPass *pass in passes) {
            [ret addObject:[self mapToDictionary:pass]];
        }
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ret];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void) passesOf:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        PKPassLibrary* passLibrary = [[PKPassLibrary alloc]init];
        
        NSNumber *passType= [command.arguments objectAtIndex:0];
        
        PKPassType pkPassType = PKPassTypeAny;
        switch (passType.intValue) {
            case 0:
                pkPassType = PKPassTypePayment;
                break;
            case 1:
                pkPassType = PKPassTypeBarcode;
                break;
            default:
                pkPassType = PKPassTypeAny;
                break;
        }
        
        NSArray<PKPass*>* passes = [passLibrary passesOfType:pkPassType];
        NSMutableArray *ret = [[NSMutableArray alloc]initWithCapacity:passes.count];
        for (PKPass *pass in passes) {
            [ret addObject:[self mapToDictionary:pass]];
        }

        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ret];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void) remotePaymentPasses:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground: ^{
        PKPassLibrary* passLibrary = [[PKPassLibrary alloc]init];
        
        NSArray<PKPass*> *passes = [passLibrary remotePaymentPasses];
        NSMutableArray *ret = [[NSMutableArray alloc]initWithCapacity:passes.count];
        for (PKPass *pass in passes) {
            [ret addObject:[self mapToDictionary:pass]];
        }
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ret];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void) paymentPasses:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground: ^{
        PKPassLibrary* passLibrary = [[PKPassLibrary alloc]init];
        
        NSArray<PKPass*> *passesRemote = [passLibrary remotePaymentPasses];
        NSArray<PKPass*> *passes = [passLibrary passesOfType:PKPassTypePayment];
        NSArray<PKPass*> *allPasses = [passesRemote arrayByAddingObjectsFromArray:passes];
        NSMutableArray *ret = [[NSMutableArray alloc]initWithCapacity:allPasses.count];
        for (PKPass *pass in allPasses) {
            [ret addObject:[self mapToDictionary:pass]];
        }
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ret];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void) canAddPaymentPass:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground: ^{
        BOOL avaliable = NO;
        if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"9.0")) { 
            avaliable = [PKAddPaymentPassViewController canAddPaymentPass];
        }

        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:avaliable];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
    }];
}


/**
 Converte os atributos de um PKPaymentPass para NSDicitionary para ser depois repasso para o JS.

 @param pass atributos a serem convertidos
 @return dicionario com os atributos
 */
-(NSDictionary *) mapRemoteToDictionary:(PKPaymentPass*) pass {
    
    
    NSMutableDictionary *dic = [[NSMutableDictionary alloc]init];
    
    
    [dic setObject:StringOrEmpty(pass.primaryAccountIdentifier) forKey:@"primaryAccountIdentifier"];
    
    [dic setObject:StringOrEmpty(pass.primaryAccountNumberSuffix) forKey:@"primaryAccountNumberSuffix"];
    
    [dic setObject:StringOrEmpty(pass.deviceAccountIdentifier) forKey:@"deviceAccountIdentifier"];
    
    [dic setObject:StringOrEmpty(pass.deviceAccountNumberSuffix) forKey:@"deviceAccountNumberSuffix"];
    
    
    int number = 0;
    switch(pass.activationState) {
        case PKPaymentPassActivationStateActivated:
            number = 0;
            break;
        case PKPaymentPassActivationStateRequiresActivation:
            number = 1;
            break;
        case PKPaymentPassActivationStateActivating:
            number = 2;
            break;
        case PKPaymentPassActivationStateSuspended:
            number = 3;
            break;
        case PKPaymentPassActivationStateDeactivated:
            number = 4;
            break;
    }

    [dic setObject:[NSNumber numberWithInt:number] forKey:@"activationState"];
    
    return dic;
}

/**
 Converte os atributos de um PKPass para NSDicitionary para ser depois repasso para o JS.
 
 @param pass atributos a serem convertidos
 @return dicionario com os atributos
 */
-(NSDictionary *) mapToDictionary:(PKPass*) pass {
    NSMutableDictionary *dic = [[NSMutableDictionary alloc]init];
    
    [dic setObject:StringOrEmpty(pass.serialNumber) forKey:@"serialNumber"];
    [dic setObject:StringOrEmpty(pass.passTypeIdentifier) forKey:@"passTypeIdentifier"];
    [dic setObject:StringOrEmpty(pass.authenticationToken) forKey:@"authenticationToken"];
    [dic setObject:StringOrEmpty(pass.localizedName) forKey:@"localizedName"];
    [dic setObject:StringOrEmpty(pass.localizedDescription) forKey:@"localizedDescription"];
    
    [dic setObject:StringOrEmpty(pass.organizationName) forKey:@"organizationName"];
    
    if (pass.relevantDate != nil) {
        [dic setObject:pass.relevantDate forKey:@"relevantDate"];
    } else {
         [dic setObject:@"" forKey:@"relevantDate"];
    }
    
    
    if (pass.passURL != nil) {
        [dic setObject:pass.passURL.absoluteString forKey:@"passURL"];
    } else {
        [dic setObject:@"" forKey:@"passURL"];
    }
    
    if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"7.0")) {
        if (pass.userInfo != nil) {
            [dic setObject:pass.userInfo forKey:@"userInfo"];
        } else {
            [dic setObject:@"" forKey:@"userInfo"];
        }
    }
    
    if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"9.0")) {
        [dic setObject:[NSNumber numberWithBool:pass.isRemotePass] forKey:@"isRemotePass"];
        [dic setObject:StringOrEmpty(pass.deviceName) forKey:@"deviceName"];
    }

    if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0")) {
        if (pass.paymentPass != nil) {
            NSDictionary *pkPaymentPass = [self mapRemoteToDictionary:pass.paymentPass];
            [dic setObject:pkPaymentPass forKey:@"paymentPass"];
        } else {
            [dic setObject:@"" forKey:@"paymentPass"];
        }
        
        
        
        NSNumber *pkPassType = nil;
        switch (pass.passType) {
            case PKPassTypePayment:
                pkPassType = [NSNumber numberWithInt:0];
            break;
            case PKPassTypeBarcode:
                pkPassType = [NSNumber numberWithInt:1];
            break;
            default:
                pkPassType = [NSNumber numberWithInt:2];
            break;
        }
        
        [dic setObject:pkPassType forKey:@"passType"];
        
    }
    
    if(pass.webServiceURL != nil) {
        [dic setObject:pass.webServiceURL.absoluteString forKey:@"webServiceURL"];
    }
    
    [dic setObject:[self encodeToBase64String:pass.icon] forKey:@"icon"];
    
    return dic;
}


/**
 Set variable in dictionary or "" if nil
 
 */

- (NSString *) setBlankOnNil:(NSString *) str {
    if (str == nil) {
        return @"";
    }
    return str;
}



/**
 Converte um UIImage para PNG em BAE64

 @param image imagem a ser convertida
 @return imagem PNG no formato BASE64
 */
- (NSString *)encodeToBase64String:(UIImage *)image {
    if (image == nil) {
        return @"";
    }
    
    NSData *png = UIImagePNGRepresentation(image);
    
    if (png != nil) {
        return [png base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
    }
    
    return @"";
}
@end
