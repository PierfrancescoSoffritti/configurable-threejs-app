package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import android.os.Bundle
import android.os.Handler
import android.support.v7.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity(), ConnectionListener {

    private lateinit var handler: Handler

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        handler = Handler(mainLooper)
        lifecycle.addObserver(PreferencesManager(this, ip_address_edit_text, port_edit_text))

        val outputChannel = TCPEndPoint(TCPClient(), this)

        connect_button.setOnClickListener { outputChannel.connect(ip_address_edit_text.text.toString(), Integer.parseInt(port_edit_text.text.toString())) }

        alarm_button.setOnClickListener { outputChannel.onAlarm() }
        forward_button.setOnClickListener { outputChannel.forward(300) }
        backward_button.setOnClickListener { outputChannel.backward(300) }
        left_button.setOnClickListener { outputChannel.left(300) }
        right_button.setOnClickListener { outputChannel.right(300) }
    }

    override fun onConnected() {
        connection_status_lable.text = "CONNECTED"
    }

    override fun onDisconnected() {
        connection_status_lable.text = "DISCONNECTED"
    }
}
