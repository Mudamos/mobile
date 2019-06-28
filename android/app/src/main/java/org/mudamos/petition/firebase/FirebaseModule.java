package org.mudamos.petition.firebase;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.module.annotations.ReactModule;

/**
 * Created by guimello on 5/17/17.
 */

@ReactModule(name="MUDFirebase")
public class FirebaseModule extends ReactContextBaseJavaModule {
    private Config config;

    public FirebaseModule(ReactApplicationContext reactContext) {
        super(reactContext);

        config = new Config();
    }

    public String getName() {
        return "MUDFirebase";
    }

    @ReactMethod
    public void getStringConfig(String name, Promise promise) {
        config.getString(name, promise);
    }

    @ReactMethod
    public void getNumberConfig(String name, Promise promise) {
        config.getNumber(name, promise);
    }

    @ReactMethod
    public void getBooleanConfig(String name, Promise promise) {
        config.getBoolean(name, promise);
    }
}
