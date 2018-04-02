package org.mudamos.petition;


import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


/**
 * Created by guimello on 3/13/17.
 */

public class YouTubeWebViewReactPackage implements ReactPackage, LifecycleEventListener {
    private YouTubeWebViewManager viewManager;

    // Deprecated in RN 0.47.0
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactApplicationContext) {
        List<ViewManager> managers = new ArrayList<>();
        viewManager = new YouTubeWebViewManager();
        managers.add(viewManager);
        reactApplicationContext.addLifecycleEventListener(this);

        return managers;
    }

    public YouTubeWebViewManager getViewManager() {
        return viewManager;
    }

    @Override
    public void onHostPause() {
        if (viewManager != null) {
            viewManager.onPause();
        }
    }

    @Override
    public void onHostResume() {
        if (viewManager != null) {
            viewManager.onResume();
        }
    }

    @Override
    public void onHostDestroy() {
    }
}
