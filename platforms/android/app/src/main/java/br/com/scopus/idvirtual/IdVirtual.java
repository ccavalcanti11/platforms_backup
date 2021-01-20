package br.com.scopus.idvirtual;

import java.util.HashMap;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import br.com.scopus.seguranca.idvirtual.android.DeviceInfoAndroid;
import br.com.scopus.seguranca.idvirtual.android.GetUniqueAndroid;
import br.com.scopus.seguranca.idvirtual.android.MobileIdStore;
import br.com.scopus.seguranca.idvirtual.android.ParameterNonceProvider;
import br.com.scopus.seguranca.idvirtual.common.GeneratorCallback;
import br.com.scopus.seguranca.idvirtual.common.MobileIdGenerator;
import br.com.scopus.util.Base64;

/**
 * ID Virtual Cordova Plugin.
 * 
 * @author Scopus -> Seguranca de Sistemas
 */
public class IdVirtual extends CordovaPlugin implements GeneratorCallback {
	
	Context context;
	CallbackContext callbackContext;
	
	@Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
		
		this.callbackContext = callbackContext;
        if (action.equals("generateId")) {
        	 context = cordova.getActivity().getApplicationContext();
        	 MobileIdHelper.build(context, args.getString(0));
 			 MobileIdHelper.getInstance().setCallback(this);
			 MobileIdHelper.getInstance().GenerateId();
             
             return true;
        }
        return false;
    }

	@Override
	public void completed(byte[] result, String extra) {
		String b64 = new String(Base64.encode(result));
		callbackContext.success(b64);
	}

	@Override
	public void error(String error) {
		int codigo = Integer.parseInt(error.substring(0, error.indexOf("-")));
		String mensagem = error.substring(error.indexOf("-") + 1);
		HashMap<String, Object> erro = new HashMap<String, Object>(); 
		erro.put("code", codigo);
		erro.put("message", mensagem);
		JSONObject obj = new JSONObject(erro);
		callbackContext.error(obj);
	}
	
	public static class MobileIdHelper {

		private static MobileIdHelper instance;
		private MobileIdGenerator generator;

		private GeneratorCallback callback;

		protected MobileIdHelper(Context context, String paramNonce) {
			generator = MobileIdGenerator.build()
					.setNonceProvider(new ParameterNonceProvider(paramNonce))
					.setUniqueProvider(new GetUniqueAndroid())
					.setPersistenceProvider(new MobileIdStore(context))
					.setDeviceInfo(new DeviceInfoAndroid(context));
		}

		public static MobileIdHelper build(Context context, String paramNonce) {
			instance = new MobileIdHelper(context, paramNonce);

			return instance;
		}

		public void setCallback(GeneratorCallback callback) {
			this.callback = callback;
		}

		public static MobileIdHelper getInstance() {
			return instance;
		}

		public void GenerateId() {
			generator.generate(callback);
		}
	}
}
