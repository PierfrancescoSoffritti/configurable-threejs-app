package com.pierfrancescosoffritti.configurablethreejsapp.testclient

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
    private val separator = "__message__"

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
                    message
                            .split(";")
                            .forEach{ subscriber.onNext(JsonParser().parse(it).asJsonObject) }

//                    subscriber.onNext(jsonObject("name" to "moveForward", "arg" to "300"))

//                    message
//                            .split(separator)
//                            .map{ it.trim() }
//                            .filter{ it.isNotEmpty() }
//                            .filter{ it[0] == '{' }
//                            .map{ JsonParser().parse(it).asJsonObject }
//                            .forEach{ subscriber.onNext(it) }

//                    message
//                            .split(separator)
//                            .map{ it.trim() }
//                            .filter{ it.isNotEmpty() }
//                            .filter{ it[0] == '{' }
//                            .map{ JsonParser().parse(it).asJsonObject }
//                            .forEach{ Log.d(javaClass.simpleName, it); subscriber.onNext(JsonParser().parse(it).asJsonObject) }
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