package org.mudamos.petition.signer;

import android.os.Bundle;
import android.support.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

/**
 * Created by guimello on 03/01/18.
 */

public class SignerActivity extends ReactActivity {
    protected String getMainComponentName() {
        return "SignerAction";
    }

   // protected ReactActivityDelegate createReactActivityDelegate() {
   //     return new ReactActivityDelegate(this, getMainComponentName()) {
   //         @Nullable
   //         @Override
   //         protected Bundle getLaunchOptions() {
   //             Bundle initialProps = new Bundle();
   //             initialProps.putString("SOME_VARIABLE_1", getCurrentActivity().getClass().getSimpleName());
   //             initialProps.putString("SOME_VARIABLE_2", "kkkkkkkkk");
   //             return initialProps;
   //         }
   //     };
   // }
}
