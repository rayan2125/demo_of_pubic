package com.otpdemo; // replace with your package name

import android.provider.MediaStore;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import java.util.Formatter;
import javax.crypto.Mac;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

class NdpsAesModule(@Nullable reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {

    private var password = "8E41C78439831010F81F61C344B7BFC7"
    private var salt = "8E41C78439831010F81F61C344B7BFC7"
    private val HMAC_SHA512 = "HmacSHA512"
    private val pswdIterations = 65536
    private val keySize = 256
    private val ivBytes = byteArrayOf(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)

    override fun getName(): String {
        return "NdpsAESLibrary"
    }

    private fun encrypt(plainText: String): String {
        val saltBytes = salt.toByteArray(charset("UTF-8"))
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512")
        val spec = PBEKeySpec(password.toCharArray(), saltBytes, pswdIterations, keySize)
        val secretKey = factory.generateSecret(spec)
        val secret = SecretKeySpec(secretKey.encoded, "AES")
        val localIvParameterSpec = IvParameterSpec(ivBytes)
        val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
        cipher.init(Cipher.ENCRYPT_MODE, secret, localIvParameterSpec)
        val encryptedTextBytes = cipher.doFinal(plainText.toByteArray(charset("UTF-8")))
        return byteToHex(encryptedTextBytes)
    }

    private fun byteToHex(byData: ByteArray): String {
        val sb = StringBuilder(byData.size * 2)
        for (i in byData.indices) {
            var v = byData[i].toInt() and 0xFF
            if (v < 16) sb.append('0')
            sb.append(Integer.toHexString(v))
        }
        return sb.toString().toUpperCase()
    }

    @ReactMethod
    fun ndpsEncrypt(plainText: String, key: String, promise: Promise) {
        try {
            password = key
            salt = key
            val encryptedStr = encrypt(plainText)
            promise.resolve(encryptedStr)
        } catch (err: Exception) {
            promise.reject(err)
        }
    }

    @ReactMethod
    fun ndpsDecrypt(encryptedText: String, key: String, promise: Promise) {
        try {
            password = key
            salt = key
            val decryptedStr = decrypt(encryptedText)
            promise.resolve(decryptedStr)
        } catch (err: Exception) {
            promise.reject(err)
        }
    }

    private fun decrypt(encryptedText: String): String {
        val saltBytes = salt.toByteArray(charset("UTF-8"))
        val encryptedTextBytes = hex2ByteArray(encryptedText)
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512")
        val spec = PBEKeySpec(password.toCharArray(), saltBytes, pswdIterations, keySize)
        val secretKey = factory.generateSecret(spec)
        val secret = SecretKeySpec(secretKey.encoded, "AES")
        val localIvParameterSpec = IvParameterSpec(ivBytes)
        val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
        cipher.init(Cipher.DECRYPT_MODE, secret, localIvParameterSpec)
        val decryptedTextBytes: ByteArray = cipher.doFinal(encryptedTextBytes)
        return String(decryptedTextBytes)
    }

    private fun hex2ByteArray(sHexData: String): ByteArray {
        val rawData = ByteArray(sHexData.length / 2)
        for (i in rawData.indices) {
            val index = i * 2
            val v = Integer.parseInt(sHexData.substring(index, index + 2).trim(), 16)
            rawData[i] = v.toByte()
        }
        return rawData
    }

    private fun toHexStringHmac(bytes: ByteArray): String {
        val formatter = Formatter()
        for (b in bytes) {
            formatter.format("%02x", b)
        }
        return formatter.toString()
    }

    @ReactMethod
    @Throws(Exception::class)
    fun calculateHMAC(data: String, key: String, promise: Promise) {
        try {
            val secretKeySpec = SecretKeySpec(key.toByteArray(), HMAC_SHA512)
            val mac = Mac.getInstance(HMAC_SHA512)
            mac.init(secretKeySpec)
            promise.resolve(toHexStringHmac(mac.doFinal(data.toByteArray())))
        } catch (err: Exception) {
            promise.reject(err)
        }
    }
}
