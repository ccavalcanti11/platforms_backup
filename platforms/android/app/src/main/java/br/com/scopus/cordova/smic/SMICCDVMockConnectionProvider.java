package br.com.scopus.cordova.smic;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import br.com.scopus.smiclib.SMIC;
import br.com.scopus.smiclib.SMICConnectionProvider;
import br.com.scopus.smiclib.SMICException;
import br.com.scopus.smiclib.SMICServerMock;

/**
 * Servidor MOCK para testes de desenvolvedor.
 * Created by tbusso on 24/10/18.
 */

public class SMICCDVMockConnectionProvider implements SMICConnectionProvider {

    private SMICServerMock serverMock;

    public SMICCDVMockConnectionProvider() {
        try {
            this.serverMock = new SMICServerMock();
        } catch (SMICException e) {
            Log.e("SMIC", "Server mock error", e);
        }
    }

    @Override
    public void sendServerRequest(SMICConnectionRequest smicRequest, SMICConnectionCallback callback) {
        Log.d("Debug", smicRequest.getBody().toString());
        try {
            JSONObject responseBody;
            if (smicRequest.getType() == SMIC.UPDATE) {
                responseBody = serverMock.updateResponse(smicRequest.getBody());
            } else {
                responseBody = serverMock.trustResponse(smicRequest.getBody());
            }
            Log.d("Debug", responseBody.toString());
            callback.onConnectionSuccess(smicRequest, responseBody);
        } catch (JSONException e) {
            e.printStackTrace();
            Log.e("SMIC", "MOCKSERVER Error", e);
            callback.onConnectionError(smicRequest, e);
        }
    }
}
