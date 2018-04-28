package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import android.os.Handler
import com.google.gson.JsonObject
import io.reactivex.Flowable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers

class TCPEndPoint(private val tcpClient: TCPClient, private val connectionListener: ConnectionListener) : OutputChannel {
    override fun connect(ip: String, port: Int) {
        tcpClient.connect(ip, port)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .doOnSuccess{ connectionListener.onConnected() }
            .subscribe()
    }

    override fun disconnect() {
        tcpClient.disconnect()
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .doOnSuccess{ connectionListener.onDisconnected() }
            .subscribe()
    }

    override fun onAlarm() {
        Thread { tcpClient.write(OutputChannel.OutputConstants.alarm, 0) }.start()
    }

    override fun forward(duration: Int) {
        Thread { tcpClient.write(OutputChannel.OutputConstants.moveForward, duration) }.start()
    }

    override fun backward(duration: Int) {
        Thread { tcpClient.write(OutputChannel.OutputConstants.moveBackward, duration) }.start()
    }

    override fun right(duration: Int) {
        Thread { tcpClient.write(OutputChannel.OutputConstants.turnRight, duration) }.start()
    }

    override fun left(duration: Int) {
        Thread { tcpClient.write(OutputChannel.OutputConstants.turnLeft, duration) }.start()
    }

    override fun getOutput(): Flowable<String> {
        return tcpClient.getOutput()
    }
}