package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.View
import android.widget.Toast
import com.pierfrancescosoffritti.configurablethreejsapp.testclient.io.ConnectionListener
import com.pierfrancescosoffritti.configurablethreejsapp.testclient.io.TCPClient
import com.pierfrancescosoffritti.configurablethreejsapp.testclient.io.TCPEndPoint
import com.pierfrancescosoffritti.configurablethreejsapp.testclient.utils.PreferencesHelper
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity(), ConnectionListener {
    private lateinit var outputChannel: OutputChannel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        lifecycle.addObserver(PreferencesHelper(this, ip_address_edit_text, port_edit_text))

        outputChannel = TCPEndPoint(TCPClient(), this)

        setupClickListeners(outputChannel)
    }

    override fun onConnected() {
        connection_status_label.text = getString(R.string.connected)
        toggleConnectDisconnectButtons(true)

        outputChannel.getOutput()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({ server_output_text_view.text = it }, { Log.e(javaClass.simpleName, it.toString()); onError(it) }, {  })
    }

    override fun onDisconnected() {
        toggleConnectDisconnectButtons(false)
        server_output_text_view.text = ""
        connection_status_label.text = getString(R.string.not_connected)
    }

    override fun onError(error: Throwable) {
        val toast = Toast.makeText(applicationContext, error.toString(), Toast.LENGTH_SHORT)
        toast.show()

        outputChannel.disconnect()
        onDisconnected()
    }

    private fun setupClickListeners(outputChannel: OutputChannel) {
        connect_button.setOnClickListener {
            val ip = ip_address_edit_text.text.toString().trim()
            val portString = port_edit_text.text.toString()
            val port: Int

            try {
                port = Integer.parseInt(portString)
                outputChannel.connect(ip, port)
            } catch (e: Exception) {
                onError(Exception("Port number not valid"))
            }
        }

        disconnect_button.setOnClickListener { outputChannel.disconnect() }

        alarm_button.setOnClickListener { outputChannel.onAlarm() }
        forward_button.setOnClickListener { outputChannel.forward(300) }
        backward_button.setOnClickListener { outputChannel.backward(300) }
        left_button.setOnClickListener { outputChannel.left(300) }
        right_button.setOnClickListener { outputChannel.right(300) }
    }

    private fun toggleConnectDisconnectButtons(connected: Boolean) {
        connect_button.visibility = if(connected) View.GONE else View.VISIBLE
        disconnect_button.visibility = if(connected) View.VISIBLE else View.GONE
    }
}
