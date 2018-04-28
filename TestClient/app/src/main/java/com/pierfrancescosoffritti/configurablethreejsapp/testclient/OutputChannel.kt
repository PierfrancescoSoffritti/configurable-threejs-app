package com.pierfrancescosoffritti.configurablethreejsapp.testclient

interface OutputChannel {
    object OutputConstants {
        const val alarm = "alarm"

        const val moveForward = "moveForward"
        const val moveBackward = "moveBackward"
        const val turnRight = "turnRight"
        const val turnLeft = "turnLeft"
    }

    fun connect()
    fun disconnect()

    fun onAlarm()

    fun forward(duration: Int)
    fun backward(duration: Int)
    fun right(duration: Int)
    fun left(duration: Int)
}