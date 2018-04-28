package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import android.os.Handler
import io.socket.client.IO
import io.socket.client.Socket

class SocketIOClient(private val mainThreadHandler: Handler, private val connectionListener: ConnectionListener) : OutputChannel {
    private var socket: Socket? = null

    override fun connect(ip: String, port: Int) {
        socket?.disconnect()

        initSocket(ip, port)
        socket?.connect()
    }

    private fun initSocket(ip: String, port: Int) {
        val opts = IO.Options()
        opts.forceNew = true
        opts.reconnection = false

        socket = IO.socket("http://$ip:$port", opts)
        socket
            ?.on(Socket.EVENT_CONNECT, { mainThreadHandler.post { connectionListener.onConnected() } })
            ?.on(Socket.EVENT_DISCONNECT, { mainThreadHandler.post { connectionListener.onDisconnected() } })
    }

    override fun disconnect() {
        socket?.disconnect()
    }

    override fun onAlarm() {
        socket?.emit(OutputChannel.OutputConstants.alarm)
    }

    override fun forward(duration: Int) {
        socket?.emit(OutputChannel.OutputConstants.moveForward, duration)
    }

    override fun backward(duration: Int) {
        socket?.emit(OutputChannel.OutputConstants.moveBackward, duration)
    }

    override fun right(duration: Int) {
        socket?.emit(OutputChannel.OutputConstants.turnRight, duration)
    }

    override fun left(duration: Int) {
        socket?.emit(OutputChannel.OutputConstants.turnLeft, duration)
    }
}