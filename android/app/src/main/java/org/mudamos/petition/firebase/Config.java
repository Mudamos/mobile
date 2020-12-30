package org.mudamos.petition.firebase;
import androidx.annotation.NonNull;

import java.util.Map;
import java.util.HashMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.tasks.Task;
import com.google.firebase.remoteconfig.FirebaseRemoteConfig;
import com.google.firebase.remoteconfig.FirebaseRemoteConfigSettings;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.firebase.remoteconfig.FirebaseRemoteConfigValue;

import org.mudamos.petition.BuildConfig;


/**
 * Created by guimello on 5/17/17.
 */

public class Config {
    private FirebaseRemoteConfig remoteConfig;

    private boolean DEV_MODE = BuildConfig.DEV_MODE.equals("true");
    private static final long FETCH_INTERVAL = 3600;

    public Config() {
        remoteConfig = FirebaseRemoteConfig.getInstance();

        FirebaseRemoteConfigSettings configSettings = new FirebaseRemoteConfigSettings.Builder()
                .setMinimumFetchIntervalInSeconds(FETCH_INTERVAL)
                .build();

        remoteConfig.setConfigSettingsAsync(configSettings);
        this.setDefaults();
        this.fetchConfig();
    }

    private void setDefaults() {
        Map<String, Object> defaults = new HashMap<>();
        defaults.put("authenticated_signers_button_title", "Lista de assinantes e outras informações");
        defaults.put("plip_remaining_days_enabled", false);
        defaults.put("link_get_to_know_mudamos", "https://www.mudamos.org/quem-somos");
        defaults.put("link_help", "https://itsrio2.typeform.com/to/nGzwjv");
        defaults.put("link_send_your_idea", "https://itsrio2.typeform.com/to/iulNZI");
        defaults.put("link_why_projects", "https://www.mudamos.org/institucional/projetos-de-lei-de-iniciativa-popular");
        defaults.put("link_privacy_policy", "https://www.mudamos.org/institucional/politica-de-privacidade?no_app_landing_page");
        defaults.put("ineligible_to_sign_citywide_plip_reason", "Obrigado por seu apoio, mas você só pode assinar esse projeto de lei sendo eleitor do município para o qual ele se destina. Se deseja propor essa lei para o seu município, use a função \"Proponha um PL\" no menu do App.");
        defaults.put("ineligible_to_sign_statewide_plip_reason", "Obrigado por seu apoio, mas você só pode assinar esse projeto de lei sendo eleitor do estado para o qual ele se destina. Se deseja propor essa lei para o seu município, use a função \"Proponha um PL\" no menu do App.");

        remoteConfig.setDefaultsAsync(defaults);
    }

    public void fetchConfig() {
        long cacheExpiration = FETCH_INTERVAL;

        if (DEV_MODE) {
            cacheExpiration = 0;
        }

        remoteConfig.fetch(cacheExpiration)
                .addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (task.isSuccessful()) {
                            remoteConfig.activate();
                        }
                    }
                });
    }

    public void getString(String name, Promise promise) {
        FirebaseRemoteConfigValue config = remoteConfig.getValue(name);
        WritableMap result = Arguments.createMap();
        result.putString("value", config.asString());
        result.putInt("source", config.getSource());

        promise.resolve(result);
    }

    public void getNumber(String name, Promise promise) {
        FirebaseRemoteConfigValue config = remoteConfig.getValue(name);
        WritableMap result = Arguments.createMap();
        result.putDouble("value", config.asDouble());
        result.putInt("source", config.getSource());

        promise.resolve(result);
    }

    public void getBoolean(String name, Promise promise) {
        FirebaseRemoteConfigValue config = remoteConfig.getValue(name);
        WritableMap result = Arguments.createMap();
        result.putBoolean("value", config.asBoolean());
        result.putInt("source", config.getSource());

        promise.resolve(result);
    }
}
