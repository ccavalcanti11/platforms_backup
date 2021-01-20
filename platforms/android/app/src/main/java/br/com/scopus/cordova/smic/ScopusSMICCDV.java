package br.com.scopus.cordova.smic;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.util.Patterns;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import br.com.scopus.smiclib.SMIC;
import br.com.scopus.smiclib.SMICCallback;
import br.com.scopus.smiclib.SMICConnectionProvider;
import br.com.scopus.smiclib.SMICError;
import br.com.scopus.smiclib.SMICException;
import br.com.scopus.smiclib.SMICResultCodes;
import br.com.scopus.smiclib.SMICServerMock;

/**
 * Implementação das funcionalidades SMIC disponibilizadas no Cordova. Esse
 * plugin faz uso de lifecycle como activeForResult Maioria das operações são
 * assincrondas por isso são utilizados diversos contexto.
 *
 * TODO: melhorar código, separando as operações em funções ou classes ao invés
 * de deixar inline no código.
 */
public class ScopusSMICCDV extends CordovaPlugin {

    // Context usado para entregar eventos recebidos pelo SMIC para o App Cordova.
    CallbackContext callbackContextEvents;

    // Contexto usado para operações imediatas como consulta de permissões
    CallbackContext callbackContextImmediate;

    // Context usado nos pedidos de dados
    CallbackContext callbackRequestData;

    // Context usado para esperar as resposta de permissao.
    CallbackContext callbackRequestPermission;

    // Referencia a API do SMIC
    SMIC smic;

    // Servidor para mock
    private SMICServerMock serverMock;

    // Código de erros usados no PLUGIN
    private final int ERROR_INVALID_PARAMETER = 92;
    private final int ERROR_GENERIC = 99;

    // Identificação dos eventos recebidos pelo SMIC
    public final static int SMIC_TRUST_REQUEST = 10;
    public final static int SMIC_DATA = 11;
    public final static int SMIC_DATA_NO_RESULT = 12;
    public final static int SMIC_TRUST_RESPONSE = 13;
    public final static int SMIC_MANIFEST_RESPONSE = 14;

    // Flag para indicar que foi feita inicialização do plugin (no momento não
    // utilizado)
    private boolean inicialization = false;

    // Referencia ao package que foi requirido trust ou data
    private String otherPackageName;

    private SMICConnectionProvider smicConnectionProvider;
    private SMICConnectionProvider bussinessConnectionProvider = null;

    /**
     * Faz inicialização do SMIC.
     *
     * @param cordova
     * @param webView
     */
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        inicialization = true;
    }

    /**
     * Processa os métodos chamados via javascript.
     *
     * @param action
     * @param args
     * @param callbackContext
     * @return
     * @throws JSONException
     */
    @Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext)
            throws JSONException {
        this.callbackContextImmediate = callbackContext;
        final CordovaInterface me = this.cordova;

        // Inicializa a API do SMIC
        // Atualiza o endereços do servidores SMIC
        if (action.equals("init")) {
            final String smicServerAddress = args.optString(0);
            final String bussinessServerAddress = args.optString(1);
            final boolean debug = args.optBoolean(2);
            if (smicServerAddress.isEmpty() || !isValidUrl(smicServerAddress)) {
                callbackContext
                        .error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter smicServerAddress is invalid"));
            } else {

                this.cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        if (debug) {
                            smicConnectionProvider = new SMICCDVMockConnectionProvider();
                        } else {
                            smicConnectionProvider = new SMICCDVConnectionProvider(smicServerAddress, null);
                        }

                        try {
                            smic = new SMIC(cordova.getActivity(), new SmicProcessor(), smicConnectionProvider,
                                    bussinessConnectionProvider);
                            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, true));
                        } catch (SMICException e) {
                            callbackContext.error(makeErrorResponse(ERROR_GENERIC, e.getMessage()));
                        }
                    }
                });
            }

            return true;
        }

        // se smic é nulo (não inicializado) não adianta processeguir.
        if (smic == null) {
            callbackContext.error(makeErrorResponse(ERROR_GENERIC, "Call init before using plugin"));
            return true;
        }

        // Faz o registro do APP (apenas se tiver servidor de negocio) para obtenção do
        // manifesto.
        if (action.equals("register")) {
            this.cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    smic.registerManifestRequest();
                    PluginResult pr = new PluginResult(PluginResult.Status.OK);
                    callbackContext.sendPluginResult(pr);
                }
            });
        }

        // Retorna o status de trust com outra aplicação.
        // Existem 3 estados: GRANTED: 20, NOT_GRANTED: 21, PENDING: 22
        // Pending significa que falta mandar algum dado para a outra aplicação para
        // fechar a relação de confiança.
        if (action.equals("hasPermission")) {
            final String otherSideIdentifier = args.optString(0);
            if (otherSideIdentifier.isEmpty()) {
                callbackContext
                        .error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter otherSideIdentifier is empty"));
            } else {
                this.cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        int trustStatus = smic.getTrustStatus(otherSideIdentifier);
                        PluginResult pr = makePluginSuccess(trustStatus);
                        callbackContext.sendPluginResult(pr);
                    }
                });
            }
            return true;
        }

        // remove a relação de confiança com outra app.
        if (action.equals("removePermission")) {
            final String otherSideIdentifier = args.optString(0);
            if (otherSideIdentifier.isEmpty()) {
                callbackContext
                        .error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter otherSideIdentifier is empty"));
            } else {
                this.cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        if (!smic.removeTrust(otherSideIdentifier)) {
                            PluginResult pr = new PluginResult(PluginResult.Status.OK, false);
                            callbackContext.sendPluginResult(pr);
                        } else {
                            PluginResult pr = new PluginResult(PluginResult.Status.OK, true);
                            callbackContext.sendPluginResult(pr);
                        }
                    }
                });
            }
            return true;
        }

        // Inicia o processo de relação de confiança com outra aplicação.
        if (action.equals("requestPermission")) {
            final String otherSideIdentifier = args.optString(0);
            final String otherSideActivity = args.optString(1);
            if (otherSideIdentifier.isEmpty()) {
                callbackContext
                        .error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter otherSideIdentifier is empty"));
            } else if (otherSideActivity.isEmpty()) {
                callbackContext
                        .error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter otherSideActivity is empty"));
            } else {
                otherPackageName = otherSideIdentifier;
                this.cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        cordova.setActivityResultCallback(null);
                        cordova.setActivityResultCallback(ScopusSMICCDV.this);
                        callbackRequestPermission = callbackContext;
                        smic.requestTrust(otherSideIdentifier, otherSideActivity);
                    }
                });
            }
            return true;
        }

        // Faz a requisição de dados para uma aplicação que já foi feita uma relação de
        // confiança.
        // requestType é apenas uma string para a outra aplicação identificar que dado
        // retornar.
        if (action.equals("requestData")) {
            this.callbackRequestData = callbackContext;
            final String otherSideIdentifier = args.optString(0);
            final String otherSideActivity = args.optString(1);
            final String requestType = args.optString(2);
            if (otherSideIdentifier.isEmpty()) {
                callbackContext
                        .error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter otherSideIdentifier is empty"));
            } else if (otherSideActivity.isEmpty()) {
                callbackContext
                        .error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter otherSideActivity is empty"));
            } else if (requestType.isEmpty()) {
                callbackContext.error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter requestType is empty"));
            } else {
                otherPackageName = otherSideIdentifier;
                this.cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            cordova.setActivityResultCallback(null);
                            cordova.setActivityResultCallback(ScopusSMICCDV.this);
                            smic.sendDataForResult(otherSideIdentifier, otherSideActivity,
                                    requestType.getBytes("UTF-8"));
                        } catch (Exception ex) {
                            PluginResult pr = new PluginResult(PluginResult.Status.ERROR, ex.getMessage());
                            pr.setKeepCallback(true);
                            callbackRequestData.sendPluginResult(pr);
                        }
                    }
                });
            }
            return true;
        }

        // Envia dados para um aplicação que já foi feita a relação de confiança.
        if (action.equals("sendData")) {
            final String otherSideIdentifier = args.optString(0);
            final String otherSideActivity = args.optString(1);
            final String sendData = args.optString(2);
            if (otherSideIdentifier.isEmpty()) {
                callbackContext
                        .error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter otherSideIdentifier is empty"));
            } else if (otherSideActivity.isEmpty()) {
                callbackContext
                        .error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter otherSideActivity is empty"));
            } else if (sendData.isEmpty()) {
                callbackContext.error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter sendData is empty"));
            } else {
                this.cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {

                            ArrayList<Integer> intentFlags = new ArrayList<Integer>();
                            intentFlags.add(Intent.FLAG_ACTIVITY_NEW_TASK);
                            smic.sendData(intentFlags, otherSideIdentifier, otherSideActivity,
                                    sendData.getBytes("UTF-8"));
                            callbackContext.success();
                        } catch (Exception ex) {
                            PluginResult pr = new PluginResult(PluginResult.Status.ERROR, ex.getMessage());
                            pr.setKeepCallback(true);
                            callbackContext.sendPluginResult(pr);
                        }
                    }
                });
            }
            return true;
        }

        // método usado para enviar dados para uma aplicação que fez a requisição.
        if (action.equals("sendResponseData")) {
            final String responseData = args.optString(0);
            if (responseData.isEmpty()) {
                callbackContext.error(makeErrorResponse(ERROR_INVALID_PARAMETER, "parameter responseData is empty"));
            } else {
                this.cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            smic.sendResponse(responseData.getBytes("UTF-8"));
                            callbackContext.success();
                        } catch (Exception ex) {
                            PluginResult pr = new PluginResult(PluginResult.Status.ERROR, ex.getMessage());
                            pr.setKeepCallback(true);
                            callbackContext.sendPluginResult(pr);
                        }
                    }
                });
            }
            return true;
        }

        // Envia erro para requests de dados
        if (action.equals("sendErrorResponse")) {
            this.cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    final int errorCode = args.optInt(0);
                    SMICError error = new SMICError(errorCode);
                    PluginResult pr = new PluginResult(PluginResult.Status.OK);
                    callbackContext.sendPluginResult(pr);
                    smic.sendErrorResponse(me.getActivity(), error);
                }
            });

            return true;
        }

        // Faz um verificação junto ao servidor SMIC das aplicações que você tem direito
        // acesso.
        if (action.equals("updateTrust")) {
            this.cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    smic.updateTrust();
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, true));
                }
            });
            return true;
        }

        // Dá permissão para uma aplicação que fez requisição
        if (action.equals("grantPermission")) {
            cordova.getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    smic.grantPermission();
                    callbackContext.success();

                }
            });
            return true;
        }

        // Nega a permissão de trust para uma aplicação que fez o pedido
        if (action.equals("denyPermission")) {
            this.cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    smic.denyPermission();
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, true));
                }
            });
            return true;
        }

        // Método usado para a aplicação se registrar para receber eventos como pedido
        // de relação de confiança.
        // dados etc
        if (action.equals("registerForEvent")) {
            this.callbackContextEvents = callbackContext;
            // check if activity was lauched by SMIC
            if (smic.processRequest(this.cordova.getActivity().getIntent())) {
                PluginResult pr = new PluginResult(PluginResult.Status.NO_RESULT);
                pr.setKeepCallback(true);
                callbackContext.sendPluginResult(pr);
            } else {
                // No event just return
                PluginResult pr = new PluginResult(PluginResult.Status.NO_RESULT);
                pr.setKeepCallback(true);
                callbackContext.sendPluginResult(pr);
            }
            return true;
        }

        if (action.equals("version")) {
            PluginResult pr = new PluginResult(PluginResult.Status.OK, SMIC.LIB_VERSION);
            callbackContext.sendPluginResult(pr);
            return true;
        }

        if(action.equals("reset")) {
            this.cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    smic.reset();
                    callbackContext.success();
                }
            });

            return true;
        }
        // Método usado apenas no iOS, aqui é apensa retornado sucesso sem reposta
        if (action.equals("processUrlRequest")) {
            PluginResult pr = new PluginResult(PluginResult.Status.NO_RESULT);
            callbackContext.sendPluginResult(pr);
            return true;
        }

        // action not found
        return false;
    }

    // para casos de activity são singleTask o método abaixo é chamado.
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (!smic.processResponse(otherPackageName, requestCode, resultCode, intent)) {
            Log.d("SMIC", "NOT SMIC");
        } else {
            // se foi precessado pelo SMIC e resultCode 14 significa que vai para o passo
            // pending
            // request precisamos cadastrar novamente o plugin para receber mais um result.
            if (resultCode == SMIC.PERMISSION_STATUS_PENDING) {
                cordova.setActivityResultCallback(null);
                cordova.setActivityResultCallback(ScopusSMICCDV.this);
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        this.cordova.getActivity().setIntent(intent);
        if (this.callbackContextEvents == null) {
            return;
        }
        final CallbackContext callbackContext = this.callbackContextEvents;
        // check if we have been lauched by SMIC and launch the event.
        if (smic.processRequest(this.cordova.getActivity().getIntent())) {
            PluginResult pr = new PluginResult(PluginResult.Status.NO_RESULT);
            pr.setKeepCallback(true);
            callbackContext.sendPluginResult(pr);
        } else {
            // No event just return
            PluginResult pr = new PluginResult(PluginResult.Status.NO_RESULT);
            pr.setKeepCallback(true);
            callbackContext.sendPluginResult(pr);
        }
    }

    /**
     * Implementação dos métodos de callback do smic
     */
    class SmicProcessor implements SMICCallback {

        @Override
        public void onManifestRegistered(Activity activity) {
            Log.d("SMIC", "onManifestRegistered");

            if (callbackContextEvents == null) {
                Log.d("SMIC", "callbackContextEvents is null");
                return;
            }

            try {
                Map<String, Object> values = new HashMap<String, Object>();
                values.put("type", SMIC_MANIFEST_RESPONSE);
                values.put("data", true);
                PluginResult pr = new PluginResult(PluginResult.Status.OK, new JSONObject((values)));
                pr.setKeepCallback(true);
                callbackContextEvents.sendPluginResult(pr);
            } catch (Exception ex) {
                PluginResult pr = new PluginResult(PluginResult.Status.ERROR, ex.getMessage());
                pr.setKeepCallback(true);
                callbackContextEvents.sendPluginResult(pr);
            }
        }

        @Override
        public void onPermissionGranted(Activity activity) {
            Log.d("SMIC", "onPermissionGranted");

            if (callbackRequestPermission == null) {
                Log.d("SMIC", "callbackRequestPermission is null");
                return;
            }

            try {
                PluginResult pr = new PluginResult(PluginResult.Status.OK, true);
                pr.setKeepCallback(true);
                callbackRequestPermission.sendPluginResult(pr);
            } catch (Exception ex) {
                PluginResult pr = new PluginResult(PluginResult.Status.ERROR, ex.getMessage());
                pr.setKeepCallback(true);
                callbackRequestPermission.sendPluginResult(pr);
            }
        }

        @Override
        public void onPermissionDenied(Activity activity) {
            Log.d("SMIC", "onPermissionDenied");
            if (callbackRequestPermission == null) {
                Log.d("SMIC", "callbackRequestPermission is null");
                return;
            }

            try {
                PluginResult pr = new PluginResult(PluginResult.Status.OK, false);
                pr.setKeepCallback(true);
                callbackRequestPermission.sendPluginResult(pr);
            } catch (Exception ex) {
                PluginResult pr = new PluginResult(PluginResult.Status.ERROR, ex.getMessage());
                pr.setKeepCallback(true);
                callbackRequestPermission.sendPluginResult(pr);
            }
        }

        @Override
        public void onPermissionRequest(Activity activity) {
            Log.d("SMIC", "onPermissionRequest");
            if (callbackContextEvents == null) {
                Log.d("SMIC", "callbackContextEvents is null");
                return;
            }

            try {
                Map<String, Object> values = new HashMap<String, Object>();
                values.put("type", SMIC_TRUST_REQUEST);
                values.put("data", activity.getCallingPackage());
                PluginResult pr = new PluginResult(PluginResult.Status.OK, new JSONObject((values)));
                pr.setKeepCallback(true);
                callbackContextEvents.sendPluginResult(pr);
            } catch (Exception ex) {
                PluginResult pr = new PluginResult(PluginResult.Status.ERROR, ex.getMessage());
                pr.setKeepCallback(true);
                callbackContextEvents.sendPluginResult(pr);
            }
        }

        @Override
        public void onDataReceived(Activity activity, byte[] bytes, boolean dataForResult) {
            if (callbackContextEvents == null) {
                Log.d("SMIC", "callbackContextEvents is null");
                return;
            }

            try {
                Map<String, Object> values = new HashMap<String, Object>();
                if (dataForResult) {
                    values.put("type", SMIC_DATA);
                } else {
                    values.put("type", SMIC_DATA_NO_RESULT);
                }

                String data = new String(bytes, "UTF-8");
                values.put("data", data);

                if (callbackRequestData == null) {
                    if (callbackContextEvents == null) {
                        Log.d("SMIC", "callbackContextEvents and callbackRequestData are null");
                        return;
                    } else {
                        PluginResult pr = new PluginResult(PluginResult.Status.OK, new JSONObject((values)));
                        pr.setKeepCallback(true);
                        callbackContextEvents.sendPluginResult(pr);
                    }
                } else {
                    PluginResult pr = new PluginResult(PluginResult.Status.OK, data);
                    callbackRequestData.sendPluginResult(pr);
                    callbackRequestData = null;
                }
            } catch (Exception ex) {
                JSONObject jsonError = makeErrorResponse(ERROR_GENERIC, ex.getMessage());
                PluginResult pr = new PluginResult(PluginResult.Status.ERROR, jsonError);
                if (callbackRequestData == null) {
                    if (callbackContextEvents == null) {
                        Log.d("SMIC", "callbackContextEvents and callbackRequestData are null");
                        return;
                    } else {
                        pr.setKeepCallback(true);
                        callbackContextEvents.sendPluginResult(pr);
                    }
                } else {
                    callbackRequestData.sendPluginResult(pr);
                    callbackRequestData = null;
                }
            }
        }

        @Override
        public void onError(Activity activity, SMICError smicError) {
            Log.d("SMIC", "onError code:" + smicError.getErrorCode() + " message:" + smicError.getErrorDescription(),
                    smicError.getException());

            String myPackageName = cordova.getActivity().getPackageName();
            // Erro remoto
            if (smicError.getOwnerPackageName() != myPackageName) {
                // se forResult e erro foi de uma operação remota temos de enviar o erro para o
                // quem chamou
                if (smicError.isForResult()) {
                    smic.sendErrorResponse(activity, smicError);
                }
            }

            // verifica se temos alguma operação em andamento
            if (callbackRequestData != null) {
                PluginResult pr = new PluginResult(PluginResult.Status.ERROR,
                        makeErrorResponse(smicError));
                callbackRequestData.sendPluginResult(pr);
                callbackRequestData = null;
                return;
            }

            if (callbackRequestPermission != null) {
                PluginResult pr = new PluginResult(PluginResult.Status.ERROR,
                        makeErrorResponse(smicError));
                callbackRequestPermission.sendPluginResult(pr);
                callbackRequestPermission = null;
                return;
            }

            if (callbackContextEvents == null) {
                Log.d("SMIC", "callbackContextEvents is null");
                return;
            }

            // Se chegamos nesse ponto o erro e local ou erro remoto de operação que não
            // estamos esperando resposta
            PluginResult pr = new PluginResult(PluginResult.Status.ERROR,
                    makeErrorResponse(smicError));
            pr.setKeepCallback(true);
            callbackContextEvents.sendPluginResult(pr);
        }

    }

    /**
     * Método auxilar para gerar um objeto json de erro
     *
     * @param code        codigo do erro
     * @param description descrição do erro
     * @return objeto json para ser retornado ao javascript
     */
    private JSONObject makeErrorResponse(int code, String description) {
        Map<String, Object> values = new HashMap<String, Object>();
        values.put("code", code);
        values.put("description", description);
        return new JSONObject(values);
    }

    private JSONObject makeErrorResponse(SMICError error) {
        Map<String, Object> values = new HashMap<String, Object>();
        values.put("code", error.getErrorCode());
        values.put("description", error.getErrorDescription());
        values.put("package", error.getOwnerActivityName());
        values.put("activity", error.getOwnerActivityName());
        return new JSONObject(values);
    }



    /**
     * Método auxiliar para retornar um código de sucesso qual o conteudo é um
     * inteiro
     *
     * @param value codigo a ser retornado
     * @return objeto de resultado do cordova
     */
    private PluginResult makePluginSuccess(int value) {
        PluginResult pr = new PluginResult(PluginResult.Status.OK, value);
        return pr;
    }

    /**
     * This is used to check the given URL is valid or not.
     *
     * @param url
     * @return true if url is valid, false otherwise.
     */
    private boolean isValidUrl(String url) {
        Pattern p = Patterns.WEB_URL;
        Matcher m = p.matcher(url.toLowerCase());
        return m.matches();
    }

}