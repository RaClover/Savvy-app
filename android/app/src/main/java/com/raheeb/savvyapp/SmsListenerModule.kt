package com.raheeb.savvyapp

import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.content.IntentFilter
import android.os.Bundle
import android.telephony.SmsMessage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.util.Log

class SmsListenerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var senderList: List<String> = listOf()

    init {
        Log.d("SmsListenerModule", "Initializing SMS Listener")
        registerSMSReceiver()
        startForegroundService()
    }

    override fun getName(): String {
        return "SmsListenerModule"
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventName, params)
    }

    private fun registerSMSReceiver() {
        val smsReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                Log.d("SmsListenerModule", "SMS received")
                val extras = intent.extras
                extras?.let {
                    val pdus = it["pdus"] as Array<*>
                    pdus.forEach { pdu ->
                        val sms = SmsMessage.createFromPdu(pdu as ByteArray)
                        Log.d("SmsListenerModule", "SMS from: ${sms.originatingAddress}, body: ${sms.messageBody}")
                        if (isValidBankNumber(sms.originatingAddress)) {
                            val params = Arguments.createMap().apply {
                                putString("messageBody", sms.messageBody)
                                putString("senderPhoneNumber", sms.originatingAddress)
                                putDouble("timestamp", sms.timestampMillis.toDouble())
                            }
                            sendEvent("onSMSReceived", params)
                        }
                    }
                }
            }
        }
        val filter = IntentFilter("android.provider.Telephony.SMS_RECEIVED")
        reactContext.registerReceiver(smsReceiver, filter)
    }

    private fun isValidBankNumber(phoneNumber: String?): Boolean {
        return senderList.any { phoneNumber != null && phoneNumber.contains(it, ignoreCase = true) }
    }

    @ReactMethod
    fun startForegroundService() {
        Log.d("SmsListenerModule", "Starting foreground service")
        val serviceIntent = Intent(reactContext, SmsForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(serviceIntent)
        } else {
            reactContext.startService(serviceIntent)
        }
    }

    @ReactMethod
    fun startListeningToSMS() {
        Log.d("SmsListenerModule", "startListeningToSMS called")
        registerSMSReceiver()
    }

    @ReactMethod
    fun setSenderList(senders: ReadableArray) {
        senderList = senders.toArrayList().map { it.toString() }
        Log.d("SmsListenerModule", "Sender list updated: $senderList")
    }

    @ReactMethod
    fun addListener(eventName: String) {
        Log.d("SmsListenerModule", "addListener called")
        // empty function
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // empty function
    }
}
