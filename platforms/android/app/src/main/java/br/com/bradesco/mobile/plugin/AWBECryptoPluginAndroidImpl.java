package br.com.bradesco.mobile.plugin;

import java.nio.ByteBuffer;
import java.nio.charset.Charset;

import java.io.UnsupportedEncodingException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;

import javax.crypto.Cipher;

import org.apache.commons.codec.binary.Base64;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class AWBECryptoPluginAndroidImpl extends CordovaPlugin {

	@Override
	public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext)
			throws JSONException {
					
			
		if ("generateKeyPair".equals(action)) {
			cordova.getThreadPool().execute(new Runnable() {
				
				@Override
				public void run() {
					try {
						callbackContext.success(generateKeyPair());
					} catch (Exception e) {
						callbackContext.error(e.getMessage());
					}
				}
			});
			
			return true;
		} else if ("decrypt".equals(action)) {
			cordova.getThreadPool().execute(new Runnable() {
				
				@Override
				public void run() {
					try {
						callbackContext.success(decriptografa(args.getJSONObject(0)));
					} catch (Exception e) {
						callbackContext.error(e.getMessage());
					}
				}
			});

			return true;
		}

		return false;
	}

	/**
	 * Decriptografa o texto puro usando chave privada.
	 * @throws JSONException 
	 */
	private JSONObject decriptografa(JSONObject texto) throws JSONException, UnsupportedEncodingException {
		byte[] dectyptedText = null;

		String chave = texto.getString("chave");
		int paso = 0;
		try {
			final Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
			// Decriptografa o texto puro usando a chave Privada
			
			chave = chave.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "");
			paso = 1;
			chave = chave.replace("\n","").replace("\t","").replace("\r", "").replace("\\","");
			paso = 2;
	        PrivateKey privateKey = StringToKey.loadPrivateKey(chave);
	        paso = 3;
			cipher.init(Cipher.DECRYPT_MODE, privateKey);
			paso = 4;
			//dectyptedText = cipher.doFinal(Base64.decodeBase64(stringToBytesASCII(texto.getString("texto"))));
			dectyptedText = cipher.doFinal(Base64.decodeBase64(texto.getString("texto").getBytes("US-ASCII")));

		} catch (Exception ex) {
			JSONObject obj = new JSONObject();
			obj.put("decryptText", "Exception:"+paso+":"+ex.getMessage());

			return obj;
		}
		
		JSONObject obj = new JSONObject();
		obj.put("decryptText", new String(dectyptedText));

		return obj;
	}

	private JSONObject generateKeyPair()
			throws NoSuchAlgorithmException, UnsupportedEncodingException, JSONException, NoSuchProviderException {
		KeyPairGenerator keyGenerator = KeyPairGenerator.getInstance("RSA");
		keyGenerator.initialize(2048);

		KeyPair keyPair = keyGenerator.genKeyPair();

		String publicKeyPEM = String.format("-----BEGIN PUBLIC KEY-----%s-----END PUBLIC KEY-----",
				new String(Base64.encodeBase64(keyPair.getPublic().getEncoded()), "UTF-8"));

		String privateKeyPEM = String.format("-----BEGIN PRIVATE KEY-----%s-----END PRIVATE KEY-----",
				new String(Base64.encodeBase64(keyPair.getPrivate().getEncoded()), "UTF-8"));

		JSONObject obj = new JSONObject();
		obj.put("publicKey", publicKeyPEM);
		obj.put("privateKey", privateKeyPEM);

		return obj;
	}
	
	private static ByteBuffer toByteBuffer(String content) {  
	    Charset charset = Charset.forName("UTF-8");  
	    ByteBuffer bb = charset.encode(content);  
	    return bb;  
	} 
	
	public static byte[] stringToBytesASCII(String str) {
		char[] buffer = str.toCharArray();
		byte[] b = new byte[buffer.length];
		for (int i = 0; i < b.length; i++) {
			b[i] = (byte) buffer[i];
		}
		return b;
	}

}