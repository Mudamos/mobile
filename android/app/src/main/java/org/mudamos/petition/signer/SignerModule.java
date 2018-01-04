package org.mudamos.petition.signer;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;


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
        Log.d("OHMYGOD", data.getString("dance"));
        Intent result = new Intent();
        result.putExtra("org.mudamos.petition.result.something", data.getString("dance"));
        getCurrentActivity().setResult(Activity.RESULT_OK, result);
        getCurrentActivity().finish();
    }

    @ReactMethod
    public void data(Promise promise) {
        promise.resolve(processIntent());
    }

    public WritableMap processIntent() {
        WritableMap map = Arguments.createMap();

        String value = "lol";
        String type = "wut";
        String action = "rofl";

        Activity currentActivity = getCurrentActivity();

//        if (currentActivity != null) {
//            Intent intent = currentActivity.getIntent();
//            action = intent.getAction();
//            type = intent.getType();
//            if (type == null) {
//                type = "";
//            }
//            if (Intent.ACTION_SEND.equals(action) && "text/plain".equals(type)) {
//                value = intent.getStringExtra(Intent.EXTRA_TEXT);
//            }
//            else if (Intent.ACTION_SEND.equals(action) && ("image/*".equals(type) || "image/jpeg".equals(type) || "image/png".equals(type) || "image/jpg".equals(type) ) ) {
//                Uri uri = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
//                value = "file://" + RealPathUtil.getRealPathFromURI(currentActivity, uri);
//
//            } else {
//                value = "";
//            }
//        } else {
//            value = "";
//            type = "";
//        }

        Log.d("OHMYGOD", getCurrentActivity().getClass().getSimpleName());
        Log.d("OHMYGOD", getCurrentActivity().getLocalClassName());
        Log.d("OHMYGOD", getCurrentActivity().getClass().getName());
        String activityName = getCurrentActivity().getClass().getSimpleName();
        map.putString("type", type);
        map.putString("value",value);
        map.putString("activityName", activityName);

        return map;
    }
}
