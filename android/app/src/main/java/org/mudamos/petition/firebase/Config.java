package org.mudamos.petition.firebase;
import android.support.annotation.NonNull;

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

    public Config() {
        remoteConfig = FirebaseRemoteConfig.getInstance();

        FirebaseRemoteConfigSettings configSettings = new FirebaseRemoteConfigSettings.Builder()
                .setDeveloperModeEnabled(DEV_MODE)
                .build();

        remoteConfig.setConfigSettings(configSettings);
        this.setDefaults();
        this.fetchConfig();
    }

    private void setDefaults() {
        Map<String, Object> defaults = new HashMap<>();
        defaults.put("plip_remaining_days_enabled", true);
        defaults.put("link_get_to_know_mudamos", "https://www.mudamos.org");
        defaults.put("link_help", "https://www.mudamos.org/ajuda");
        defaults.put("link_send_your_idea", "https://www.mudamos.org/envie-sua-ideia");
        defaults.put("link_why_projects", "https://www.mudamos.org/institucional/projetos-de-lei-de-iniciativa-popular");

        remoteConfig.setDefaults(defaults);
    }

    public void fetchConfig() {
        long cacheExpiration = 3600;

        if (remoteConfig.getInfo().getConfigSettings().isDeveloperModeEnabled()) {
            cacheExpiration = 0;
        }

        remoteConfig.fetch(cacheExpiration)
                .addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (task.isSuccessful()) {
                            remoteConfig.activateFetched();
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
