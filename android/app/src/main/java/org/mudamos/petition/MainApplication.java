package org.mudamos.petition;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.bitgo.randombytes.RandomBytesPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNDeviceInfo(),
            new RandomBytesPackage(),
            new ReactMaterialKitPackage(),
            new MapsPackage(),
            new FacebookLoginPackage(),
            new VectorIconsPackage(),
            new RNSpinkitPackage(),
            new ReactNativeConfigPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
