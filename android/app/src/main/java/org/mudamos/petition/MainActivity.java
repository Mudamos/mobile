package org.mudamos.petition;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

import android.content.Intent;
import android.os.Bundle;

import android.support.annotation.Nullable;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MudamosMobile";
    }

   // protected ReactActivityDelegate createReactActivityDelegate() {
   //     return new ReactActivityDelegate(this, getMainComponentName()) {
   //         @Nullable
   //         @Override
   //         protected Bundle getLaunchOptions() {
   //             Bundle initialProps = new Bundle();
   //             initialProps.putString("SOME_VARIABLE_1", getCurrentActivity().getClass().getSimpleName());
   //             initialProps.putString("SOME_VARIABLE_2", "some variable 2 value");
   //             return initialProps;
   //         }
   //     };
   // }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
}
