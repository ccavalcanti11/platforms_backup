#import "AWBECryptoPlugin.h"
#import <Cordova/CDV.h>


static NSString *base64_encode_data(NSData *data){
    data = [data base64EncodedDataWithOptions:0];
    NSString *ret = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    return ret;
}

static NSData *base64_decode(NSString *str){
    NSData *data = [[NSData alloc] initWithBase64EncodedString:str options:NSDataBase64DecodingIgnoreUnknownCharacters];
    return data;
}


@implementation AWBECryptoPlugin{
    NSData* publicTag;
    NSData* privateTag;
}

// identificar unico para as chaves
static const UInt8 publicKeyIdentifier[] = "br.com.bradesco.crypto.publickey\0";
static const UInt8 privateKeyIdentifier[] = "br.com.bradesco.crypto.privatekey\0";

// gera, de fato, as chaves assimétricas
-(OSStatus)genKeyPair{
    OSStatus status = noErr;
    NSMutableDictionary *privateKeyAttr = [[NSMutableDictionary alloc] init];
    NSMutableDictionary *publicKeyAttr = [[NSMutableDictionary alloc] init];
    NSMutableDictionary *keyPairAttr = [[NSMutableDictionary alloc] init];
    
    SecKeyRef publicKey = NULL;
    SecKeyRef privateKey = NULL;
    
    [keyPairAttr setObject:(__bridge id)kSecAttrKeyTypeRSA
                    forKey:(__bridge id)kSecAttrKeyType];
    [keyPairAttr setObject:[NSNumber numberWithInt:2048]
                    forKey:(__bridge id)kSecAttrKeySizeInBits];
    
    [privateKeyAttr setObject:[NSNumber numberWithBool:YES]
                       forKey:(__bridge id)kSecAttrIsPermanent];
    [privateKeyAttr setObject:privateTag
                       forKey:(__bridge id)kSecAttrApplicationTag];
    
    [publicKeyAttr setObject:[NSNumber numberWithBool:YES]
                      forKey:(__bridge id)kSecAttrIsPermanent];
    [publicKeyAttr setObject:publicTag
                      forKey:(__bridge id)kSecAttrApplicationTag];
    
    [keyPairAttr setObject:privateKeyAttr
                    forKey:(__bridge id)kSecPrivateKeyAttrs];
    [keyPairAttr setObject:publicKeyAttr
                    forKey:(__bridge id)kSecPublicKeyAttrs];
    
    status = SecKeyGeneratePair((__bridge CFDictionaryRef)keyPairAttr,
                                &publicKey, &privateKey);
    
    return status;
}

-(NSData*)getKey:(NSData*)keyTag {
    OSStatus sanityCheck = noErr;
    NSData* keyBits = nil;
    
    NSMutableDictionary * queryPublicKey = [[NSMutableDictionary alloc] init];
    
    // Set the public key query dictionary.
    [queryPublicKey setObject:(__bridge id)kSecClassKey forKey:(__bridge id)kSecClass];
    [queryPublicKey setObject:keyTag forKey:(__bridge id)kSecAttrApplicationTag];
    [queryPublicKey setObject:(__bridge id)kSecAttrKeyTypeRSA forKey:(__bridge id)kSecAttrKeyType];
    [queryPublicKey setObject:[NSNumber numberWithBool:YES] forKey:(__bridge id)kSecReturnData];
    
    // Get the key bits.
    CFDataRef pkBits;
    sanityCheck = SecItemCopyMatching((__bridge CFDictionaryRef)queryPublicKey, (CFTypeRef *)&pkBits);
    
    if (sanityCheck != noErr)
    {
        keyBits = nil;
    } else {
        keyBits = (__bridge_transfer NSData *)pkBits;
    }
    
    return keyBits;
}

// Obtem a chave privada como um string PEM.
-(NSString*)getKeyAsPEM:(NSData*)keyTag {
    NSData* keyBits = [self getKey:keyTag];
    
    return [keyBits base64Encoding];
}

-(void)generateKeyPair:(CDVInvokedUrlCommand*)command{
    [self.commandDelegate runInBackground:^{
        NSLog(@"====| AWBECryptoPlugin |==== > gerando par de chaves");
        
        publicTag = [NSData dataWithBytes:publicKeyIdentifier
                                   length:strlen((const char *)publicKeyIdentifier)];
        privateTag = [NSData dataWithBytes:privateKeyIdentifier
                                    length:strlen((const char *)privateKeyIdentifier)];
        
        OSStatus status = [self genKeyPair];
        
        if(status != noErr){
            NSLog(@"====| AWBECryptoPlugin |==== > Erro ao gerar chaves...");
            
            CDVPluginResult* errorResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
            
            [self.commandDelegate sendPluginResult:errorResult callbackId:command.callbackId];
            
            return;
        }
        
        NSMutableDictionary *jsonReturn = [[NSMutableDictionary alloc] init];
        [jsonReturn setValue:[NSString stringWithFormat:@"-----BEGIN RSA PRIVATE KEY-----%@-----END RSA PRIVATE KEY-----", [self getKeyAsPEM:privateTag]] forKey:@"privateKey"];
        [jsonReturn setValue:[NSString stringWithFormat:@"-----BEGIN PUBLIC KEY-----%@-----END PUBLIC KEY-----", [self getRSAPublicKeyAsBase64:publicTag]] forKey:@"publicKey"];
        
        NSLog(@"%@", jsonReturn);
        
        CDVPluginResult* successResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonReturn];
        
        [self.commandDelegate sendPluginResult:successResult callbackId:command.callbackId];
    }];
}

// Helper function for ASN.1 encoding
size_t encodeLength(unsigned char * buf, size_t length) {
    
    // encode length in ASN.1 DER format
    if (length < 128) {
        buf[0] = length;
        return 1;
    }
    
    size_t i = (length / 256) + 1;
    buf[0] = i + 0x80;
    for (size_t j = 0 ; j < i; ++j) {
        buf[i - j] = length & 0xFF;
        length = length >> 8;
    }
    
    return i + 1;
}

/**
 * Codigo baseado em:
 * http://blog.wingsofhermes.org/?p=42
 **/
- (NSString *) getRSAPublicKeyAsBase64:(NSData*)keyTag {
    
    static const unsigned char _encodedRSAEncryptionOID[15] = {
        
        /* Sequence of length 0xd made up of OID followed by NULL */
        0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86,
        0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00
        
    };
    
    NSData* publicKeyBits = [self getKey:keyTag];
    
    // OK - that gives us the "BITSTRING component of a full DER
    // encoded RSA public key - we now need to build the rest
    
    unsigned char builder[15];
    NSMutableData* encKey = [[NSMutableData alloc] init];
    int bitstringEncLength;
    
    // When we get to the bitstring - how will we encode it?
    if  ([publicKeyBits length ] + 1  < 128 )
    bitstringEncLength = 1 ;
    else
    bitstringEncLength = (([publicKeyBits length ] +1 ) / 256 ) + 2 ;
    
    // Overall we have a sequence of a certain length
    builder[0] = 0x30;    // ASN.1 encoding representing a SEQUENCE
    // Build up overall size made up of -
    // size of OID + size of bitstring encoding + size of actual key
    size_t i = sizeof(_encodedRSAEncryptionOID) + 2 + bitstringEncLength +
    [publicKeyBits length];
    size_t j = encodeLength(&builder[1], i);
    [encKey appendBytes:builder length:j +1];
    
    // First part of the sequence is the OID
    [encKey appendBytes:_encodedRSAEncryptionOID
                 length:sizeof(_encodedRSAEncryptionOID)];
    
    // Now add the bitstring
    builder[0] = 0x03;
    j = encodeLength(&builder[1], [publicKeyBits length] + 1);
    builder[j+1] = 0x00;
    [encKey appendBytes:builder length:j + 2];
    
    // Now the actual key
    [encKey appendData:publicKeyBits];
    
    NSString* ret = [encKey base64Encoding];
    
    return ret;
}



#pragma mark - Decrypt
-(void)decrypt:(CDVInvokedUrlCommand*)command{
    
    
    [self.commandDelegate runInBackground:^{
    
        //arguments passed from cordova
        if (command.arguments) {
            
            
            NSLog(@"====| AWBECryptoPlugin |==== > arguments received: %@",command.arguments);
            
            NSString * text = command.arguments[0][@"texto"];
            NSString * privateKeyString = command.arguments[0][@"chave"];
            
            
            NSLog(@"====| AWBECryptoPlugin |==== > privateKeyToClear: %@", privateKeyString);
            
            
            NSLog(@"====| AWBECryptoPlugin |==== > TextToDecrypt: %@", text);
            
            
            NSString * stringDecoded = [self decryptString:text privateKey:privateKeyString];
            
            NSLog(@"====| AWBECryptoPlugin |==== > String decoded: %@", stringDecoded);
            
            
            if (stringDecoded != NULL && ![stringDecoded isEqualToString:@""]) {
                
                NSMutableDictionary *jsonReturn = [[NSMutableDictionary alloc] init];
                [jsonReturn setValue:stringDecoded forKey:@"decryptText"];
                
                NSLog(@"%@", jsonReturn);
                
                CDVPluginResult* successResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonReturn];
                
                [self.commandDelegate sendPluginResult:successResult callbackId:command.callbackId];
                
            }else{
             
                CDVPluginResult* errorResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
                
                [self.commandDelegate sendPluginResult:errorResult callbackId:command.callbackId];
            }

        
        
    }else{
        
        CDVPluginResult* errorResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        
        [self.commandDelegate sendPluginResult:errorResult callbackId:command.callbackId];
    }
    
    }];}


- (NSString *)decryptString:(NSString *)str privateKey:(NSString *)privKey{
    NSData *data = [[NSData alloc] initWithBase64EncodedString:str options:NSDataBase64DecodingIgnoreUnknownCharacters];
    data = [self decryptData:data privateKey:privKey];
    NSString *ret = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    return ret;
}

- (NSData *)decryptData:(NSData *)data privateKey:(NSString *)privKey{
    if(!data || !privKey){
        return nil;
    }
    SecKeyRef keyRef = [self addPrivateKey:privKey];
    if(!keyRef){
        return nil;
    }
    return [self decryptData:data withKeyRef:keyRef];
}


- (NSData *)decryptData:(NSData *)data withKeyRef:(SecKeyRef) keyRef{
    const uint8_t *srcbuf = (const uint8_t *)[data bytes];
    size_t srclen = (size_t)data.length;
    
    size_t block_size = SecKeyGetBlockSize(keyRef) * sizeof(uint8_t);
    UInt8 *outbuf = malloc(block_size);
    size_t src_block_size = block_size;
    
    NSMutableData *ret = [[NSMutableData alloc] init];
    for(int idx=0; idx<srclen; idx+=src_block_size){
        //NSLog(@"%d/%d block_size: %d", idx, (int)srclen, (int)block_size);
        size_t data_len = srclen - idx;
        if(data_len > src_block_size){
            data_len = src_block_size;
        }
        
        size_t outlen = block_size;
        OSStatus status = noErr;
        status = SecKeyDecrypt(keyRef,
                               kSecPaddingPKCS1,
                               srcbuf + idx,
                               data_len,
                               outbuf,
                               &outlen
                               );
        if (status != 0) {
            NSLog(@"SecKeyEncrypt fail. Error Code: %d", status);
            ret = nil;
            break;
        }else{
            //the actual decrypted data is in the middle, locate it!
            int idxFirstZero = -1;
            int idxNextZero = (int)outlen;
            for ( int i = 0; i < outlen; i++ ) {
                if ( outbuf[i] == 0 ) {
                    if ( idxFirstZero < 0 ) {
                        idxFirstZero = i;
                    } else {
                        idxNextZero = i;
                        break;
                    }
                }
            }
            
            [ret appendBytes:&outbuf[idxFirstZero+1] length:idxNextZero-idxFirstZero-1];
        }
    }
    
    free(outbuf);
    CFRelease(keyRef);
    return ret;
}



- (SecKeyRef)addPrivateKey:(NSString *)key{
    NSRange spos;
    NSRange epos;
    spos = [key rangeOfString:@"-----BEGIN RSA PRIVATE KEY-----"];
    if(spos.length > 0){
        epos = [key rangeOfString:@"-----END RSA PRIVATE KEY-----"];
    }else{
        spos = [key rangeOfString:@"-----BEGIN PRIVATE KEY-----"];
        epos = [key rangeOfString:@"-----END PRIVATE KEY-----"];
    }
    if(spos.location != NSNotFound && epos.location != NSNotFound){
        NSUInteger s = spos.location + spos.length;
        NSUInteger e = epos.location;
        NSRange range = NSMakeRange(s, e-s);
        key = [key substringWithRange:range];
    }
    key = [key stringByReplacingOccurrencesOfString:@"\r" withString:@""];
    key = [key stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    key = [key stringByReplacingOccurrencesOfString:@"\t" withString:@""];
    key = [key stringByReplacingOccurrencesOfString:@" "  withString:@""];
    
    
    NSLog(@"my privateKey clear: %@", key);
    
    // This will be base64 encoded, decode it.
    NSData *data = base64_decode(key);
//    data = [self stripPrivateKeyHeader:data];
//    if(!data){
//        return nil;
//    }
    
    //a tag to read/write keychain storage
    NSString *tag = @"br.com.bradesco.crypto.privatekey\0";
    NSData *d_tag = [NSData dataWithBytes:[tag UTF8String] length:[tag length]];
    
    // Delete any old lingering key with the same tag
    NSMutableDictionary *privateKey = [[NSMutableDictionary alloc] init];
    [privateKey setObject:(__bridge id) kSecClassKey forKey:(__bridge id)kSecClass];
    [privateKey setObject:(__bridge id) kSecAttrKeyTypeRSA forKey:(__bridge id)kSecAttrKeyType];
    [privateKey setObject:d_tag forKey:(__bridge id)kSecAttrApplicationTag];
    SecItemDelete((__bridge CFDictionaryRef)privateKey);
    
    // Add persistent version of the key to system keychain
    [privateKey setObject:data forKey:(__bridge id)kSecValueData];
    [privateKey setObject:(__bridge id) kSecAttrKeyClassPrivate forKey:(__bridge id)
     kSecAttrKeyClass];
    [privateKey setObject:[NSNumber numberWithBool:YES] forKey:(__bridge id)
     kSecReturnPersistentRef];
    
    CFTypeRef persistKey = nil;
    OSStatus status = SecItemAdd((__bridge CFDictionaryRef)privateKey, &persistKey);
    if (persistKey != nil){
        CFRelease(persistKey);
    }
    if ((status != noErr) && (status != errSecDuplicateItem)) {
        return nil;
    }
    
    [privateKey removeObjectForKey:(__bridge id)kSecValueData];
    [privateKey removeObjectForKey:(__bridge id)kSecReturnPersistentRef];
    [privateKey setObject:[NSNumber numberWithBool:YES] forKey:(__bridge id)kSecReturnRef];
    [privateKey setObject:(__bridge id) kSecAttrKeyTypeRSA forKey:(__bridge id)kSecAttrKeyType];
    
    // Now fetch the SecKeyRef version of the key
    SecKeyRef keyRef = nil;
    status = SecItemCopyMatching((__bridge CFDictionaryRef)privateKey, (CFTypeRef *)&keyRef);
    if(status != noErr){
        return nil;
    }
    return keyRef;
}


- (NSData *)stripPrivateKeyHeader:(NSData *)d_key{
    // Skip ASN.1 private key header
    if (d_key == nil) return(nil);
    
    unsigned long len = [d_key length];
    if (!len) return(nil);
    
    unsigned char *c_key = (unsigned char *)[d_key bytes];
    unsigned int  idx	 = 22; //magic byte at offset 22
    
    if (0x04 != c_key[idx++]) return nil;
    
    //calculate length of the key
    unsigned int c_len = c_key[idx++];
    int det = c_len & 0x80;
    if (!det) {
        c_len = c_len & 0x7f;
    } else {
        int byteCount = c_len & 0x7f;
        if (byteCount + idx > len) {
            //rsa length field longer than buffer
            return nil;
        }
        unsigned int accum = 0;
        unsigned char *ptr = &c_key[idx];
        idx += byteCount;
        while (byteCount) {
            accum = (accum << 8) + *ptr;
            ptr++;
            byteCount--;
        }
        c_len = accum;
    }
    
    // Now make a new NSData from this buffer
    return [d_key subdataWithRange:NSMakeRange(idx, c_len)];
}



@end
