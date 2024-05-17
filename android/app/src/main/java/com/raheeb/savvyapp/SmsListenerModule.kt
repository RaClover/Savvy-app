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
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

class SmsListenerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
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
                val extras = intent.extras
                extras?.let {
                    val pdus = it["pdus"] as Array<*>
                    pdus.forEach { pdu ->
                        val sms = SmsMessage.createFromPdu(pdu as ByteArray)
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
        val bankNumbers = listOf("Bank", "bank", "SberBank", "Sber", "Tinkoff", "VTB", "TheBank", "900")
        return bankNumbers.any { phoneNumber != null && phoneNumber.contains(it) }
    }

    @ReactMethod
    fun startForegroundService() {
        val serviceIntent = Intent(reactContext, SmsForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(serviceIntent)
        } else {
            reactContext.startService(serviceIntent)
        }
    }

    @ReactMethod
    fun startListeningToSMS() {
        registerSMSReceiver()
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // empty fun
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // empty fun
    }
}
