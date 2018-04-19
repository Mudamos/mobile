package org.mudamos.petition.firebase;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.dynamiclinks.FirebaseDynamicLinks;
import com.google.firebase.dynamiclinks.PendingDynamicLinkData;

import org.mudamos.petition.BuildConfig;

/**
 * Created by guimello on 24/04/18.
 */

public class MUDFirebaseDynamicLink extends ReactContextBaseJavaModule implements ActivityEventListener, LifecycleEventListener {
    private static String deepLinkReceivedEvent = "onDeepLinkReceived";

    private static final String TAG = MUDFirebaseDynamicLink.class.getSimpleName();

    public MUDFirebaseDynamicLink(ReactApplicationContext context) {
        super(context);
        getReactApplicationContext().addActivityEventListener(this);
        getReactApplicationContext().addLifecycleEventListener(this);
    }

    @ReactMethod
    public void getInitialLink() {
        if (getCurrentActivity() == null) return;

        FirebaseDynamicLinks.getInstance()
                .getDynamicLink(getCurrentActivity().getIntent())
                .addOnSuccessListener(new OnSuccessListener<PendingDynamicLinkData>() {
                    @Override
                    public void onSuccess(PendingDynamicLinkData pendingDynamicLinkData) {
                        if (pendingDynamicLinkData != null) {
                            Uri link = pendingDynamicLinkData.getLink();

                            if (link != null) {
                                sendEvent(getReactApplicationContext(), deepLinkReceivedEvent, link.toString());
                            }
                        }
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        if (BuildConfig.DEBUG) {
                            Log.d(TAG, "Error attaching firebase dynamic link listener");
                        }
                    }
                });
    }

    private static void sendEvent(ReactContext context, String eventName, String link) {
        Log.d(TAG, "Event fired");
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, link);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    @Override
    public void onNewIntent(Intent intent) {
        FirebaseDynamicLinks.getInstance()
                .getDynamicLink(intent)
                .addOnSuccessListener(new OnSuccessListener<PendingDynamicLinkData>() {
                    @Override
                    public void onSuccess(PendingDynamicLinkData pendingDynamicLinkData) {
                        if (pendingDynamicLinkData != null) {
                            Uri link = pendingDynamicLinkData.getLink();

                            if (link != null) {
                                sendEvent(getReactApplicationContext(), deepLinkReceivedEvent, link.toString());
                            }
                        }
                    }
                });
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {

    }

    @Override
    public String getName() {
        return "MUDFirebaseDynamicLink";
    }
}
