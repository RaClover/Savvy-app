package com.raheeb.savvyapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
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

    private var accountCreationTimeMillis: Long = 0

    init {
        registerSMSReceiver()
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
                        if (isValidBankNumber(sms.originatingAddress) && sms.timestampMillis > accountCreationTimeMillis) {
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
        val bankNumbers = listOf("Bank", "bank", "SberBank", "Sber", "Tinkoff", "VTB", "The bank", "TheBank", "900") // Add your actual bank phone numbers or patterns
        return bankNumbers.any { phoneNumber != null && phoneNumber.contains(it) }
    }

    @ReactMethod
    fun startListeningToSMS(accountCreationTime: Double) {
        this.accountCreationTimeMillis = accountCreationTime.toLong()
        registerSMSReceiver()
    }
}
