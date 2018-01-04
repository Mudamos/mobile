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


/**
 * Created by guimello on 03/01/18.
 */

public class SignerModule extends ReactContextBaseJavaModule {
    public SignerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SignerAction";
    }

    @ReactMethod
    public void close() {
        getCurrentActivity().finish();
    }

    @ReactMethod
    public void done(ReadableMap data) {
        Log.d("OHMYGOD", data.getString("message"));
        Intent result = new Intent();

        if (data.hasKey("message"))
            result.putExtra("org.mudamos.petition.result.message", data.getString("message"));

        if (data.hasKey("publicKey"))
            result.putExtra("org.mudamos.petition.result.publicKey", data.getString("publicKey"));

        if (data.hasKey("timestamp"))
            result.putExtra("org.mudamos.petition.result.timestamp", data.getString("timestamp"));

        if (data.hasKey("error"))
            result.putExtra("org.mudamos.petition.result.error", data.getBoolean("error"));

        getCurrentActivity().setResult(Activity.RESULT_OK, result);
        getCurrentActivity().finish();
    }

    @ReactMethod
    public void data(Promise promise) {
        promise.resolve(processIntent());
    }

    public WritableMap processIntent() {
        WritableMap map = Arguments.createMap();

        Activity currentActivity = getCurrentActivity();

        if (currentActivity != null) {
            Intent intent = currentActivity.getIntent();
            map.putString("message", intent.getStringExtra("org.mudamos.petition.message"));
        }

        String activityName = getCurrentActivity().getClass().getSimpleName();
        map.putString("activityName", activityName);

        return map;
    }
}