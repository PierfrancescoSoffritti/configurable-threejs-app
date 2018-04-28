package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import android.util.Log
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import io.reactivex.BackpressureStrategy
import io.reactivex.Flowable
import io.reactivex.FlowableOnSubscribe
import io.reactivex.Single
import java.io.DataInputStream
import java.io.DataOutputStream
import java.io.IOException
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.Socket
import java.net.SocketTimeoutException

class TCPClient {
    private val separator = ";"

    private var socket: Socket? = null
    private lateinit var inSocket: DataInputStream
    private lateinit var outSocket: DataOutputStream

    fun connect(ip: String, port: Int): Single<TCPClient> {
        socket?.close()

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

    fun write(name: String, arg: Int) {
        val string = "$separator{ \"name\":\"$name\", \"arg\":$arg }$separator"
        try {
            outSocket.writeUTF(string)
        } catch (e: Exception) {
            Log.e(javaClass.simpleName, "Error writing: $string")
            throw e
        }
    }

    fun getOutput() : Flowable<JsonObject> {
        val onSubscribe: FlowableOnSubscribe<JsonObject> = FlowableOnSubscribe { subscriber ->
            try {

                while (true) {
                    val message = inSocket.readUTF()
                    message.split(separator)
                        .map{ it.trim() }
                        .filter{ it.isNotEmpty() }
                        .filter{ it[0] == '{' }
                        .map{ JsonParser().parse(it).asJsonObject }
                        .forEach{ subscriber.onNext(it) }
                }

            } catch (e: Exception) {
                subscriber.onError(e)
            } finally {
                subscriber.onComplete()
            }
        }

        return Flowable.create(onSubscribe, BackpressureStrategy.BUFFER);
    }

    fun disconnect(): Single<TCPClient> {
        return Single.create<TCPClient> {
            try {
                outSocket.flush()
                outSocket.close()

                inSocket.close()

                socket?.close()

                it.onSuccess(this)
            } catch (e: IOException) {
                it.onError(e)
            }
        }
    }

    fun isConnected(): Boolean {
        return socket?.isConnected ?: false
    }
}