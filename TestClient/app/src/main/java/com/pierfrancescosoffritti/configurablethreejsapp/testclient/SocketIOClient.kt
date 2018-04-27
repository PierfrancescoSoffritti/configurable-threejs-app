package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket

class SocketIOClient(ip: String, port: Int, private val connectionListener: ConnectionListener) {
    private val socket: Socket = IO.socket("http://$ip:$port")

    init {
        socket
                .on(Socket.EVENT_CONNECT, {
                    Log.d(this.javaClass.simpleName, "connected")
                    connectionListener.onConnected()
                })
                .on(Socket.EVENT_DISCONNECT, {
                    connectionListener.onDisconnected()
                })
    }

    fun connect() = socket.connect()!!
    fun disconnect() = socket.disconnect()!!

    fun onAlarm() = socket.emit("alarm")!!

    fun onLeft() = socket.emit("turnLeft")!!
    fun onForward() = socket.emit("moveForward")!!
    fun onBackward() = socket.emit("moveBackward")!!
    fun onRight() = socket.emit("turnRight")!!
}

interface ConnectionListener {
    fun onConnected()
    fun onDisconnected()
}