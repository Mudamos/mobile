package org.mudamos.petition;


import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.FrameLayout;

import static android.view.ViewGroup.LayoutParams;


/**
 * Created by guimello on 3/13/17.
 */
public class VideoWebChromeClient extends WebChromeClient {

    private final FrameLayout.LayoutParams FULLSCREEN_LAYOUT_PARAMS = new FrameLayout.LayoutParams(
            LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT, Gravity.CENTER);

    private WebChromeClient.CustomViewCallback mCustomViewCallback;

    private Activity mActivity;
    private View mWebView;
    private View mVideoView;

    public VideoWebChromeClient(Activity activity, WebView webView) {
        mWebView = webView;
        mActivity = activity;
    }

    @Override
    public void onShowCustomView(View view, CustomViewCallback callback) {
        if (mVideoView != null) {
            callback.onCustomViewHidden();
            return;
        }

        // Store the view and it's callback for later, so we can dispose of them correctly
        mVideoView = view;
        mCustomViewCallback = callback;

        view.setBackgroundColor(Color.BLACK);

        getRootView().addView(view, FULLSCREEN_LAYOUT_PARAMS);

        mWebView.setVisibility(View.GONE);

        // Force Landscape
        mActivity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
    }

    @Override
    public void onHideCustomView() {
        if (mVideoView == null) {
            return;
        }

        // Go back to portrait mode
        mActivity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        mVideoView.setVisibility(View.GONE);

        // Remove the custom view from its container.
        getRootView().removeView(mVideoView);
        mVideoView = null;
        mCustomViewCallback.onCustomViewHidden();

        mWebView.setVisibility(View.VISIBLE);
    }

    private ViewGroup getRootView() {
        return ((ViewGroup) mActivity.findViewById(android.R.id.content));
    }
}