package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import io.socket.client.IO
import io.socket.client.Socket

class SocketIOClient(ip: String, port: Int, private val connectionListener: ConnectionListener) : OutputChannel {
    private val socket: Socket = IO.socket("http://$ip:$port")

    init {
        socket
            .on(Socket.EVENT_CONNECT, { connectionListener.onConnected() })
            .on(Socket.EVENT_DISCONNECT, { connectionListener.onDisconnected() })
    }

    override fun connect() {
        socket.connect()
    }

    override fun disconnect() {
        socket.disconnect()
    }

    override fun onAlarm() {
        socket.emit(OutputChannel.OutputConstants.alarm)
    }

    override fun forward(duration: Int) {
        socket.emit(OutputChannel.OutputConstants.moveForward, duration)
    }

    override fun backward(duration: Int) {
        socket.emit(OutputChannel.OutputConstants.moveBackward, duration)
    }

    override fun right(duration: Int) {
        socket.emit(OutputChannel.OutputConstants.turnRight, duration)
    }

    override fun left(duration: Int) {
        socket.emit(OutputChannel.OutputConstants.turnLeft, duration)
    }
}

interface ConnectionListener {
    fun onConnected()
    fun onDisconnected()
}