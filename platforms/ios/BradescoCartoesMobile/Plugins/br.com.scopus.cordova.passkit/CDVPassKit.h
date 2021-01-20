//
//  CDVPassKit.h
//
//  Created by Thiago Busso on 2018-03-19
//
//

#import <Cordova/CDVPlugin.h>
#import <Cordova/CDVInvokedUrlCommand.h>

/**
 Plugin de acesso ao PassKit.framework
 */
@interface CDVPassKit : CDVPlugin {
    
}

/**
 Retorna se o PassKit.framwework está disponível.

 @param command dados da chamada vindo do JS
 */
- (void) isPassLibraryAvaliable:(CDVInvokedUrlCommand*)command;

/**
 Retorna todos os passes da Wallet que esse app tem acesso

 @param command dados da chamada vindo do JS
 */
- (void) passes:(CDVInvokedUrlCommand*)command;

/**
 Retorna os passes especificos

 @param command dados da chamada vindo do JS
 */
- (void) passesOf:(CDVInvokedUrlCommand*)command;

/**
 Retorna os passes que estão armazenados em um dispositivo remoto

 @param command dados da chamada vindo do JS
 */
- (void) remotePaymentPasses:(CDVInvokedUrlCommand*)command;

/**
 Retorna os passes de pagamento remotos e do iPhone
 @param command dados da chamada vindo do JS
 */
- (void) paymentPasses:(CDVInvokedUrlCommand*)command;

/**
 Retorna se o device ou devices associados suportam adição de cartão de pagamento (por ter elemento seguro).
 
 @param command dados da chamada vindo do JS
 */
- (void) canAddPaymentPass:(CDVInvokedUrlCommand*)command;
@end
