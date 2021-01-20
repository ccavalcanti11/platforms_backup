package br.com.scopus.cordova.appcomm;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


/**
 * Plugin que permite:
 * - Lista as aplicações instaladas que desejamos comunicar.
 * - Inicia um aplicação passando o packagename
 * <p>
 * Created by tbusso on 01/18/16.
 */
public class CDVAppComm extends CordovaPlugin {

    //Context do activity cordova
    private Context context;

    //Callback para resposta da execucao de plugin
    private CallbackContext callbackContext;

    private final String LIST_APPS = "listInstalledApps";
    private final String LIST_SMIC_APPS = "listInstalledAppsSMIC";
    private final String LAUNCH_APP = "launchApp";

    private List<String> methods = Arrays.asList(LIST_APPS, LIST_SMIC_APPS, LAUNCH_APP);

    /**
     * Implementacao do método execute do CordovaPlugin
     *
     * @param action
     * @param args
     * @param callbackContext
     * @return
     * @throws JSONException
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        //Salva referencia para retorna resposta no futuro
        //uma vez que todo o processo é executado em um thread a parte
        this.callbackContext = callbackContext;
        context = cordova.getActivity().getApplicationContext();

        final CordovaInterface cordova = this.cordova;
        final CallbackContext localCallbackContext = callbackContext;

        //verifica se atendemos o método passado.
        if (!methods.contains(action)) {
            return false;
        }

        if (LIST_APPS.equalsIgnoreCase(action)) {
            JSONArray retApps = installedApps();
            this.callbackContext.success(retApps);
        } else if (LAUNCH_APP.equalsIgnoreCase(action)) {
            final String appName = args.getString(0);
            final String parameters = args.getString(1);

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW);
                        intent.addCategory(Intent.CATEGORY_BROWSABLE);
                        intent.addCategory(Intent.CATEGORY_DEFAULT);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

                        intent.setData(Uri.parse(parameters));
                        intent.setClassName(appName, "br.com.bradesco.integrador.home.Home");

                        cordova.getActivity().startActivity(intent);
                        localCallbackContext.success();
                    } catch (Exception e) {
                        localCallbackContext.error(e.getMessage());
                    }
                }
            });
        } else if (LIST_SMIC_APPS.equalsIgnoreCase(action)){
            JSONArray retApps = installedAppsSMIC();
            this.callbackContext.success(retApps);
        }
            return true;
    }

    public JSONArray installedApps() {
        //Cria e inicializa ArrayList que contem os packages instalados no Aparelho
        ArrayList<String> mPackages;

        //Variavel responsavel por guarda a url schema e utilizar no json
        String urlScheme = null;

        //Grava no ArrayList o retorno do método
        mPackages = buscaAppsBradescoInstalados();

        //Cria e inicializa JsonArray
        JSONArray jsonArray = new JSONArray();

        //Varre ArrayList de Packages
        for (String name : mPackages) {

            //Criando e inicializando JsonObject pra cada volta do for
            JSONObject jsonObject = new JSONObject();

            try {
                //Verifica qual é o pacote e atribui para String
                //a url schema que sera usado
                if (name.equals("com.bradesco")) {
                    urlScheme = "bradescovarejo";
                }

                if (name.equals("com.bradesco.prime")) {
                    urlScheme = "bradescoprime";
                }

                if (name.equals("com.bradesco.exclusive")) {
                    urlScheme = "bradescoexclusive";
                }

                if (name.equals("com.bradesco.appprivate")) {
                    urlScheme = "bradescoprivate";
                }

                //Construindo um JsonObject
                jsonObject.put("name", name);
                jsonObject.put("scheme", urlScheme);
            } catch (Exception e) {
                //Grava mensagem de erro
                String erro = e.toString().trim();
                Log.d("CDVAPPCOMM", erro);
            }

            //Adiciona ao JsonArray o JsonObject
            jsonArray.put(jsonObject);
        }

        //Retorna json
        return jsonArray;
    }

    //Método que busca no aparelho os package dos aplicativos Bradesco
    //Este método será utilizado no WebViewActivity
    public ArrayList<String> buscaAppsBradescoInstalados() {
        //Cria um array com os package do Bradesco
        ArrayList<String> mListaBuscaApps = new ArrayList<String>();
        mListaBuscaApps.add("com.bradesco.appprivate");
        mListaBuscaApps.add("com.bradesco.exclusive");
        mListaBuscaApps.add("com.bradesco.prime");
        mListaBuscaApps.add("com.bradesco");

        //Cria lista de package instalados para ser utilizado no for
        ArrayList<String> mListaAppsInstalados = new ArrayList<String>();

        //Varre a lista de package
        for (int i = 0; i < mListaBuscaApps.size(); i++) {

            //Chama método que busca o package instalado no aparelho
            boolean mAppInstalado = isAppInstalled(mListaBuscaApps.get(i));

            //Verifca se esta instalado
            if (mAppInstalado) {

                //Caso esteja instalado adiciona package no ArrayList de package instalado
                mListaAppsInstalados.add(mListaBuscaApps.get(i));
            }
        }

        //Retorna o ArrayList de package instalado
        return mListaAppsInstalados;
    }

    /**
     * Retorna se temos o app passado instalado no aparelho
     *
     * @param packageName packageName do app que estamos consultando
     * @return true está instalado false não está
     */
    private boolean isAppInstalled(String packageName) {
        PackageManager pm = context.getPackageManager();
        boolean installed;
        try {
            pm.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
            installed = true;
        } catch (PackageManager.NameNotFoundException e) {
            installed = false;
        }
        return installed;
    }

    private JSONArray installedAppsSMIC(){
        JSONArray jsonArray = new JSONArray();
        PackageManager pm = context.getPackageManager();
        final Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("smiccartoes://exists/"));
        final List<ResolveInfo> list = pm.queryIntentActivities(intent, 0);
        for (ResolveInfo info: list){
            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("name", info.activityInfo.packageName);
                String urlScheme = "";
                
                if (info.activityInfo.packageName.equals("com.bradesco")) {
                    urlScheme = "bradescovarejoSMIC";
                }

                if (info.activityInfo.packageName.equals("com.bradesco.prime")) {
                    urlScheme = "bradescoprimeSMIC";
                }

                if (info.activityInfo.packageName.equals("com.bradesco.exclusive")) {
                    urlScheme = "bradescoexclusiveSMIC";
                }

                if (info.activityInfo.packageName.equals("com.bradesco.appprivate")) {
                    urlScheme = "bradescoprivateSMIC";
                }

                jsonObject.put("scheme", urlScheme);
                jsonArray.put(jsonObject);
            } catch (JSONException e) {
                String erro = e.toString().trim();
                Log.d("CDVAPPCOMM", erro);
            }
        }
        return jsonArray;
    }
}