package br.com.scopus.cordova.pinning;

import java.io.FileInputStream;
import java.io.SequenceInputStream;

import java.util.Enumeration;
import java.util.Vector;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.content.res.AssetManager;

import br.com.scopus.pinning.Validador;

public class ScopusPinningCDV extends CordovaPlugin implements Validador.Callback {
	
	Context context;
	CallbackContext callbackContext;
	
	@Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
		
		this.callbackContext = callbackContext;
        
        /**
         * Valida o certificado da URL especificada utilizando o hash da SubjectPublicKeyInfo deste certificado.
         *
         * @param host                  URL que será validada.
         * @param certificateHashes     Vetor de hashes que serão utilizados na validação.
         * @param certificateFiles      Vetor com os caminhos para os certificados.
         */
        if (action.equals("evaluate")) {
            try {
                // Busca os parametros de entrada
                String host = args.getString(0);
                JSONArray hashes = args.getJSONArray(1);
                JSONArray paths = null;
                String obj = args.getString(2);
                
                if (obj != null && obj != "null") {
                    paths = args.getJSONArray(2);
                }

                // Validacao simples para os parametros de entrada
                if (host == null ||
                        host.isEmpty() ||
                        hashes == null ||
                        hashes.length() == 0) {

                    this.sendError("Invalid input");

                    return false;
                }

                context = cordova.getActivity().getApplicationContext();

                // Converte o vetor de entrada para o formato esperado
                String[] certificateHashes = this.configureHashes(this.jsonArrayToStringArray(hashes));
				
				Validador validator;
				
				if (paths != null) {
					// Converte o vetor para um vetor de string
					String[] certificateFileNames = this.jsonArrayToStringArray(paths);

					// Variavel utilizada para converter os certificados em InputStream
					Vector streams = new Vector();
					// Busca os certificados na pasta de assets
					AssetManager assetManager = context.getAssets();

					// adiciona cada certificado na variavel intermediaria
					for (int i = 0; i < certificateFileNames.length; i++) {
						streams.add(assetManager.open(certificateFileNames[i]));
					}

					// Converte os certificados para InputStream
					Enumeration sequenceStream = streams.elements();
					SequenceInputStream rootCertificates = new SequenceInputStream(sequenceStream);

					// Realiza a chamada para a biblioteca de pinning
					validator = new Validador(certificateHashes, false, rootCertificates, this, context);
				} else {
					validator = new Validador(certificateHashes, false, this, context);
				}
                
                // Valida a URL especificada
                validator.validaURL(host);

                return true;
            } catch (Exception e) {
                this.sendError("Exception occurred.");
            }
        }
        
        return false;
    }
    
    // Funcoes de Callback da biblioteca de pinning
    
    @Override
    public void callbackError(int code, Exception e) {
        this.sendError("Erro " + code + ": " + e.getMessage());
    }
	
    @Override
    public void callbackSuccess(String msg) {
        this.sendMessage(msg);
    }
    
    // Metodos auxiliares da Classe

    private String[] jsonArrayToStringArray(JSONArray array) throws JSONException {
        String[] result = new String[array.length()];
        for (int i = 0; i < result.length; i++) {
            result[i] = array.getString(i);
        }
        return result;
    }
	
	private String[] configureHashes(String[] certificateHashes) {
		String[] result = new String[certificateHashes.length];
		for (int i = 0; i < certificateHashes.length; i++) {
			result[i] = "sha256/" + certificateHashes[i];
		}
		return result;
	}
    
    // Metodos auxiliares do Cordova

    private void sendMessage(String message) {
        this.callbackContext.success(message);
    }
    
    private void sendError(String message) {
        this.callbackContext.error(message);
    }
}
