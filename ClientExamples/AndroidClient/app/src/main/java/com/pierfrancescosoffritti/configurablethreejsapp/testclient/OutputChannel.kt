package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import io.reactivex.Flowable

interface OutputChannel {
    object OutputConstants {
        const val alarm = "alarm"

        const val moveForward = "moveForward"
        const val moveBackward = "moveBackward"
        const val turnRight = "turnRight"
        const val turnLeft = "turnLeft"
    }

    fun connect(ip: String, port: Int)
    fun disconnect()

    fun onAlarm()

    fun forward(duration: Int)
    fun backward(duration: Int)
    fun right(duration: Int)
    fun left(duration: Int)
    fun getOutput(): Flowable<String>
}