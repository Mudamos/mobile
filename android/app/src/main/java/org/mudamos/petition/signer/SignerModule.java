package org.mudamos.petition.signer;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import org.mudamos.petition.BuildConfig;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by guimello on 24/01/18.
 */

public class SignerModule extends ReactContextBaseJavaModule {
    private static String PAYLOAD_IDENTIFIER = "org.mudamos.signer.message";
    private static String RESULT_IDENTIFIER = "org.mudamos.signer.message.result";
    private static String MUDAMOS_SIGNER_ACTIVITY_NAME = "SignerActivity";
    private static String MAIN_ACTIVITY_NAME = "MainActivity";

    private static String ACTIVITY_NAME_KEY = "MUDAMOS_SIGNER_ACTIVITY_NAME";

    private static String TAG = "Signer";

    public SignerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "MUDSigner";
    }

    @ReactMethod
    public void close() {
        getCurrentActivity().finish();
    }

    @ReactMethod
    public void done(ReadableMap data) {
        if (BuildConfig.DEBUG) {
            Log.d(TAG, data.hasKey("message") ? data.getString("message") : "No message");
        }

        Intent intent = new Intent();
        HashMap<String, Object> result = new HashMap<>();

        if (data.hasKey("message")) {
            result.put("message", data.getString("message"));
        }

        if (data.hasKey("signature")) {
            result.put("signature", data.getString("signature"));
        }

        if (data.hasKey("publicKey")) {
            result.put("publicKey", data.getString("publicKey"));
        }

        if (data.hasKey("timestamp")) {
            result.put("timestamp", data.getString("timestamp"));
        }

        if (data.hasKey("error")) {
            result.put("error", data.getBoolean("error"));
        }

        intent.putExtra(RESULT_IDENTIFIER, result);

        getCurrentActivity().setResult(Activity.RESULT_OK, intent);
        getCurrentActivity().finish();
    }

    @ReactMethod
    public void data(Promise promise) {
        promise.resolve(processIntent());
    }

    @ReactMethod
    public void isMainApp(Promise promise) {
        String activityName = currentActivityName();
        promise.resolve(activityName == null || activityName.equals(MAIN_ACTIVITY_NAME));
    }

    @ReactMethod
    public void isSignerApp(Promise promise) {
        String activityName = currentActivityName();
        promise.resolve(activityName != null && activityName.equals(MUDAMOS_SIGNER_ACTIVITY_NAME));
    }

    private WritableMap processIntent() {
        WritableMap map = Arguments.createMap();

        Activity currentActivity = getCurrentActivity();

        if (currentActivity != null) {
            Intent intent = currentActivity.getIntent();
            map.putString("message", intent.getStringExtra(PAYLOAD_IDENTIFIER));

            String activityName = currentActivityName();

            if (activityName != null) {
                map.putString("activityName", activityName);
            }
        }

        return map;
    }

    private String currentActivityName() {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity != null) {
            return currentActivity.getClass().getSimpleName();
        }

        return null;
    }
}
