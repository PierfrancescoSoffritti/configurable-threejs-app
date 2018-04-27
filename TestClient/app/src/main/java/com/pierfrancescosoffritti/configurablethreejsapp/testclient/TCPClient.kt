package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import android.util.Log
import com.google.gson.JsonObject
import java.io.DataInputStream
import java.io.DataOutputStream
import java.io.IOException
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.Socket
import java.net.SocketTimeoutException
import com.google.gson.JsonParser
import io.reactivex.*
import java.io.PrintWriter

class TCPClient {
    private val separator = "__endofmessage__"

    private var socket: Socket? = null
    private lateinit var inSocket: DataInputStream
    private lateinit var outSocket: DataOutputStream

    fun connect(ip: String, port: Int): Single<TCPClient> {
        return Single.create<TCPClient> {
            val socketAddress = InetSocketAddress(InetAddress.getByName(ip), port)
            socket = Socket()

            try {
                socket?.connect(socketAddress, 5000)
                inSocket = DataInputStream(socket?.getInputStream())
                outSocket = DataOutputStream(socket?.getOutputStream())

                it.onSuccess( this )

            } catch (e: SocketTimeoutException) {
                it.onError(e)
            }
        }
    }

    fun write(message: JsonObject): Single<TCPClient> {
        Log.d(javaClass.simpleName, message.toString())
        return Single.create<TCPClient> {
            try {
                outSocket.writeUTF(separator +message.toString() +separator)
                it.onSuccess( this )
            } catch (e: SocketTimeoutException) {
                it.onError(e)
            }
        }
    }

    fun getOutput() : Flowable<JsonObject> {
        val onSubscribe: FlowableOnSubscribe<JsonObject> = FlowableOnSubscribe { subscriber ->
            try {

                while (true) {
                    val message = inSocket.readUTF()
                    message.replace(separator, "")
                    val jsonObject = JsonParser().parse("{\"a\": \"A\"}").asJsonObject

                    subscriber.onNext(jsonObject)
                }

            } catch (e: Exception) {
                subscriber.onError(e)
            } finally {
                subscriber.onComplete()
            }
        }

        return Flowable.create(onSubscribe, BackpressureStrategy.BUFFER);
    }

    fun disconnect() {
        try {
            outSocket.flush()
            outSocket.close()

            inSocket.close()

            socket?.close()
        } catch (e: IOException) {
            e.printStackTrace()
            throw RuntimeException(e)
        }
    }

    fun isConnected(): Boolean {
        return socket?.isConnected ?: false
    }
}