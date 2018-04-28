package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity(), ConnectionListener {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val ip = ip_address_edit_text.text
        val port = port_edit_text.text

        val outputChannel = SocketIOClient(ip.toString(), Integer.parseInt(port.toString()), this)

        lifecycle.addObserver(PreferencesManager(this, ip_address_edit_text, port_edit_text))

        connect_button.setOnClickListener { outputChannel.connect() }
        alarm_button.setOnClickListener { outputChannel.disconnect() }

        forward_button.setOnClickListener { outputChannel.forward(300) }
        backward_button.setOnClickListener { outputChannel.backward(300) }
        left_button.setOnClickListener { outputChannel.left(300) }
        right_button.setOnClickListener { outputChannel.right(300) }

//        connect_button.setOnClickListener { connect() }
//        forward_button.setOnClickListener { client.write(jsonObject(name to "moveForward", arg to "300")).subscribeOn(Schedulers.io()).doOnSuccess { Log.d(javaClass.simpleName, "sent") }.subscribe() }
//        backward_button.setOnClickListener { client.write(jsonObject(name to "moveBackward", arg to "300")).subscribeOn(Schedulers.io()).subscribe() }
//        left_button.setOnClickListener { client.write(jsonObject(name to "turnLeft", arg to "300")).subscribeOn(Schedulers.io()).subscribe() }
//        right_button.setOnClickListener { client.write(jsonObject(name to "turnRight", arg to "300")).subscribeOn(Schedulers.io()).subscribe() }
//        alarm_button.setOnClickListener { client.write(jsonObject(name to "alarm")).subscribeOn(Schedulers.io()).subscribe() }
    }

    override fun onConnected() {
        connection_status_lable.text = "CONNECTED"
    }

    override fun onDisconnected() {
        connection_status_lable.text = "DISCONNECTED"
    }

//    private fun connect() {
//        val ip = ip_address_edit_text.text
//        val port = port_edit_text.text
//
//        client = TCPClient()
//        client.connect(ip.toString(), Integer.parseInt(port.toString()))
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .doOnSuccess{ connection_status_lable.text = "CONNECTED" }
//                .doOnSuccess{ observeOutput(it) }
//                .subscribe()
//    }

//    private fun observeOutput(client: TCPClient) {
//        client.getOutput()
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe({ server_output_text_view.text = it.toString() }, { throw RuntimeException() }, { Log.d(javaClass.simpleName, "completed")})
//    }
}
