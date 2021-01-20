package br.com.bradesco.mobile.plugin;

import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;

public class StringToKey {
	
	
	public static PrivateKey loadPrivateKey(String key64) throws GeneralSecurityException {
		byte[] clear = Base64.base64Decode(key64);
		PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(clear);
		KeyFactory fact = KeyFactory.getInstance("RSA");
		PrivateKey priv = fact.generatePrivate(keySpec);
		Arrays.fill(clear, (byte) 0);
		return priv;
	}

	public static PublicKey loadPublicKey(String stored) throws GeneralSecurityException {
		byte[] data = Base64.base64Decode(stored);
		X509EncodedKeySpec spec = new X509EncodedKeySpec(data);
		KeyFactory fact = KeyFactory.getInstance("RSA");
		return fact.generatePublic(spec);
	}

	public static String savePrivateKey(PrivateKey priv) throws GeneralSecurityException {
		KeyFactory fact = KeyFactory.getInstance("RSA");
		PKCS8EncodedKeySpec spec = fact.getKeySpec(priv, PKCS8EncodedKeySpec.class);
		byte[] packed = spec.getEncoded();
		String key64 = Base64.base64Encode(packed);

		Arrays.fill(packed, (byte) 0);
		return key64;
	}

	public static String savePublicKey(PublicKey publ) throws GeneralSecurityException {
		KeyFactory fact = KeyFactory.getInstance("RSA");
		X509EncodedKeySpec spec = fact.getKeySpec(publ, X509EncodedKeySpec.class);
		return Base64.base64Encode(spec.getEncoded());
	}

	
	public static void main(String[] args) throws Exception {
		KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
		KeyPair pair = gen.generateKeyPair();

		String pubKey = savePublicKey(pair.getPublic());
		PublicKey pubSaved = loadPublicKey(pubKey);
		System.out.println(pair.getPublic() + "\n" + pubSaved);

		String privKey = savePrivateKey(pair.getPrivate());
		PrivateKey privSaved = loadPrivateKey(privKey);
		System.out.println(pair.getPrivate() + "\n" + privSaved);
	}
}
