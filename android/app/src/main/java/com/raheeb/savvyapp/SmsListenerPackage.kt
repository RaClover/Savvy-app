package com.raheeb.savvyapp

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class SmsListenerPackage : ReactPackage {

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        // Return an empty list since there are no view managers provided by this package
        return emptyList()
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        // Initialize the list of native modules
        val modules = mutableListOf<NativeModule>()
        // Add the SmsListenerModule to the list of native modules
        modules.add(SmsListenerModule(reactContext))
        // Return the list of native modules
        return modules
    }
}
