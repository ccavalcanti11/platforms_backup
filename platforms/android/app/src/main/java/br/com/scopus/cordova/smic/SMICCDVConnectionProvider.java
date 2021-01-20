package br.com.scopus.cordova.smic;

import android.annotation.TargetApi;
import android.os.Build;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import br.com.scopus.smiclib.SMIC;
import br.com.scopus.smiclib.SMICConnectionProvider;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

/**
 * Implementação de classe de conexão para obtenção de dados com servidor SMIC.
 * Created by tbusso on 24/10/18.
 */

public class SMICCDVConnectionProvider implements SMICConnectionProvider {

    private String smicServerConnection;
    private String smicBussinessConnection;

    public SMICCDVConnectionProvider(String smicServerConnection, String smicBussinessConnection) {
        this.smicServerConnection = smicServerConnection;
        this.smicBussinessConnection = smicBussinessConnection;
    }

    public String getSmicServerConnection() {
        return smicServerConnection;
    }

    public void setSmicServerConnection(String smicServerConnection) {
        this.smicServerConnection = smicServerConnection;
    }

    public String getSmicBussinessConnection() {
        return smicBussinessConnection;
    }

    public void setSmicBussinessConnection(String smicBussinessConnection) {
        this.smicBussinessConnection = smicBussinessConnection;
    }

    @Override
    public void sendServerRequest(final SMICConnectionRequest smicRequest, final SMICConnectionCallback callback) {
        OkHttpClient client = new OkHttpClient();

        String url;
        if (smicRequest.getType() == SMIC.UPDATE) {
            url = smicServerConnection + "/list";
        } else if (smicRequest.getType() == SMIC.LOG) {
            url = smicServerConnection + "/log";
        } else {
            url = smicServerConnection + "/trust";
        }

        final MediaType MEDIA_TYPE = MediaType.parse("application/JSON; charset=utf-8");
        RequestBody requestBodyJSON = RequestBody.create(MEDIA_TYPE, smicRequest.getBody()
                .toString());
        Request httpRequest = new Request.Builder()
                .url(url)
                .header("Content-Type", "application/JSON")
                .post(requestBodyJSON)
                .build();

        client.newCall(httpRequest).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
                Log.e("SMIC", e.getMessage(), e);
                callback.onConnectionError(smicRequest, e);
            }

            @TargetApi(Build.VERSION_CODES.KITKAT)
            @Override
            public void onResponse(Call call, Response response) throws
                    IOException {
                try {
                    ResponseBody responseBody = response.body();
                    if (!response.isSuccessful()) {
                        Log.e("SMIC", "Connection error:" + response.code());
                        callback.onConnectionError(smicRequest, new Exception("Response Error code:" + response.code()));
                        return;
                    }
                    JSONObject responseBodyJSON = new JSONObject(responseBody.string());
                    callback.onConnectionSuccess(smicRequest, responseBodyJSON);
                } catch (JSONException e) {
                    Log.e("SMIC", e.getMessage(), e);
                    callback.onConnectionError(smicRequest, e);
                }
            }
        });
    }
}
