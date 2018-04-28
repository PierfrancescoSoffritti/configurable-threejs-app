package com.pierfrancescosoffritti.configurablethreejsapp.testclient.io

interface ConnectionListener {
    fun onConnected()
    fun onDisconnected()
    fun onError(error: Throwable)
}