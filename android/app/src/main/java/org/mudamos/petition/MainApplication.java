package org.mudamos.petition;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.ReactApplication;
import io.fullstack.firestack.FirestackPackage;
import com.ianlin.RNFirebaseCrashReport.RNFirebaseCrashReportPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.imagepicker.ImagePickerPackage;
import com.opensettings.OpenSettingsPackage;
import cl.json.RNSharePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.bitgo.randombytes.RandomBytesPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import org.mudamos.petition.firebase.FirebasePackage;
import org.mudamos.petition.signer.SignerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FirestackPackage(),
            new RNFirebaseCrashReportPackage(),
            new ReactNativeOneSignalPackage(),
            new ImagePickerPackage(),
            new OpenSettingsPackage(),
            new RNSharePackage(),
            new FBSDKPackage(mCallbackManager),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new RandomBytesPackage(),
            new ReactMaterialKitPackage(),
            new MapsPackage(),
            new VectorIconsPackage(),
            new RNSpinkitPackage(),
            new ReactNativeConfigPackage(),
            new YouTubeWebViewReactPackage(),
            new FirebasePackage(),
            new SignerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
