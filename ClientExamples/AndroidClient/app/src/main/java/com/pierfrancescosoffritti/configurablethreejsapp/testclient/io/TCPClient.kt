package com.pierfrancescosoffritti.configurablethreejsapp.testclient.io

import android.util.Log
import io.reactivex.BackpressureStrategy
import io.reactivex.Flowable
import io.reactivex.FlowableOnSubscribe
import io.reactivex.Single
import java.io.*
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.Socket

class TCPClient {
    private val separator = ";"

    private var socket: Socket? = null
    private var inSocket: BufferedReader? = null
    private var outSocket: PrintWriter? = null

    fun connect(ip: String, port: Int): Single<TCPClient> {
        return Single.create<TCPClient> {
            try {
                val socketAddress = InetSocketAddress(InetAddress.getByName(ip), port)
                socket = Socket()

                socket?.connect(socketAddress, 1000)
                inSocket = BufferedReader(InputStreamReader(socket?.getInputStream()))
                outSocket = PrintWriter(socket?.getOutputStream(), true)

                it.onSuccess( this )
            } catch (e: Exception) {
                it.onError(e)
            }
        }
    }

    fun write(type: String, arg: Int) {
        val message = "$separator{ \"type\":\"$type\", \"arg\":$arg }$separator"
        try {
            outSocket?.println(message)
        } catch (e: Exception) {
            Log.e(javaClass.simpleName, "Error writing: $message")
            throw e
        }
    }

    fun getOutput() : Flowable<String> {
        val onSubscribe: FlowableOnSubscribe<String> = FlowableOnSubscribe { subscriber ->
            try {
                while (inSocket != null) {
                    val message = inSocket!!.readLine()
                    message.split(separator)
                        .map{ it.trim() }
                        .filter{ it.isNotEmpty() }
                        .forEach{ subscriber.onNext(it) }
                }
            } catch (e: Exception) {
                subscriber.onError(e)
            } finally {
                subscriber.onComplete()
            }
        }

        return Flowable.create(onSubscribe, BackpressureStrategy.BUFFER)
    }

    fun disconnect(): Single<TCPClient> {
        return Single.create<TCPClient> {
            try {
                outSocket?.flush()
                outSocket?.close()

                inSocket?.close()

                socket?.close()

                it.onSuccess(this)
            } catch (e: Exception) {
                it.onError(e)
            }
        }
    }
}