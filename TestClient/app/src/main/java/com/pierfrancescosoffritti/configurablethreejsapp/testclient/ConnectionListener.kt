package com.pierfrancescosoffritti.configurablethreejsapp.testclient

interface ConnectionListener {
    fun onConnected()
    fun onDisconnected()
    fun postOnMainThread(callback: () -> Unit)
}