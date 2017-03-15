package org.mudamos.petition;

import android.webkit.WebView;
import android.webkit.GeolocationPermissions;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.webview.ReactWebViewManager;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by guimello on 3/13/17.
 */

public class YouTubeWebViewManager extends ReactWebViewManager {
    public static final String REACT_CLASS = "RCTYouTubeWebView";

    private List<WebView> runningWebViews = new ArrayList<>();

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public void onPause() {
        for (WebView webView : runningWebViews) {
            webView.onPause();
        }
    }

    public void onResume() {
        for (WebView webView : runningWebViews) {
            webView.onResume();
        }
    }

    @Override
    protected WebView createViewInstance(final ThemedReactContext reactContext) {
        final WebView webView = super.createViewInstance(reactContext);

        webView.setWebChromeClient(new VideoWebChromeClient(reactContext.getCurrentActivity(), webView) {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });

        webView.getSettings().setUseWideViewPort(true);
        runningWebViews.add(webView);

        return webView;
    }

    @Override
    public void onDropViewInstance(WebView webView) {
        super.onDropViewInstance(webView);
        runningWebViews.remove(webView);
    }
}
