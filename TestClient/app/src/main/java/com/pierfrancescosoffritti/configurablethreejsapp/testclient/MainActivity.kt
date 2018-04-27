package com.pierfrancescosoffritti.configurablethreejsapp.testclient

import android.content.Context
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import com.github.salomonbrys.kotson.jsonObject
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    private val name = "name"
    private val arg = "arg"

    private lateinit var client: TCPClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        client = TCPClient()

        connect_button.setOnClickListener { connect() }
        forward_button.setOnClickListener { client.write(jsonObject(name to "moveForward", arg to "300")).subscribeOn(Schedulers.io()).doOnSuccess { Log.d(javaClass.simpleName, "sent") }.subscribe() }
        backward_button.setOnClickListener { client.write(jsonObject(name to "moveBackward", arg to "300")).subscribeOn(Schedulers.io()).subscribe() }
        left_button.setOnClickListener { client.write(jsonObject(name to "turnLeft", arg to "300")).subscribeOn(Schedulers.io()).subscribe() }
        right_button.setOnClickListener { client.write(jsonObject(name to "turnRight", arg to "300")).subscribeOn(Schedulers.io()).subscribe() }
        alarm_button.setOnClickListener { client.write(jsonObject(name to "alarm")).subscribeOn(Schedulers.io()).subscribe() }
    }

    override fun onResume() {
        super.onResume()

        val preferenceKeyIp = "ip"
        val preferenceKeyPort = "port"
        val sharedPreferencesKey = "MainActivity_SharedPreferences"
        val prefs = getSharedPreferences(sharedPreferencesKey, Context.MODE_PRIVATE)
        ip_address_edit_text.setText(prefs.getString(preferenceKeyIp, ""))
        port_edit_text.setText(prefs.getString(preferenceKeyPort, ""))
    }

    override fun onStop() {
        super.onStop()

        val preferenceKeyIp = "ip"
        val preferenceKeyPort = "port"
        val sharedPreferencesKey = "MainActivity_SharedPreferences"
        val prefs = getSharedPreferences(sharedPreferencesKey, Context.MODE_PRIVATE)

        prefs
                .edit()
                .putString(preferenceKeyIp, ip_address_edit_text.text.toString())
                .putString(preferenceKeyPort, port_edit_text.text.toString())
                .apply()
    }

    private fun connect() {
        val ip = ip_address_edit_text.text
        val port = port_edit_text.text

        client = TCPClient()
        client
                .connect(ip.toString(), Integer.parseInt(port.toString()))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .doOnSuccess{ connection_status_lable.text = "CONNECTED" }
                .doOnSuccess{ observeOutput(it) }
                .subscribe()
    }

    private fun observeOutput(client: TCPClient) {
//        client
//                .getOutput()
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe({ server_output_text_view.text = it.toString() }, { throw RuntimeException() }, { Log.d(javaClass.simpleName, "completed")})
    }
}
