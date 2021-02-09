package com.example.roadtip.roteiro

import android.util.Log
import com.google.firebase.database.*
import java.util.*
import kotlin.collections.ArrayList

/**RoteiroModel é responsável por obter uma referência de restaurantes da firebase. Através dessa referência
 * são obtidos uma lista de snapshots que contêm a mesma estrutura de atributos que a classe roteiro.*/

object RoteiroModel: Observable() {

    private var listener: ValueEventListener? = null
    private var roteiroArrayList: ArrayList<RoteiroClass>? = ArrayList()

    private fun getDatabaseRef(): DatabaseReference? {
        return FirebaseDatabase.getInstance().reference.child("Roteiros")
    }

    init {
        if (listener != null) {
            getDatabaseRef()?.removeEventListener(listener!!)
        }

        listener = null

        listener = object : ValueEventListener {
            override fun onDataChange(dataSnapshot: DataSnapshot) {
                try {
                    val data: ArrayList<RoteiroClass> = ArrayList()
                    if (dataSnapshot != null) {
                        /**Para cada snapshot obtido da referência firebase é criado um objeto
                         * tipo roteiro através da RoteiroClass que é adicionado a um
                         * arraylist do tipo RoteiroClass*/
                        for (snapshot: DataSnapshot in dataSnapshot.children) {
                            try {
                                data.add(RoteiroClass(snapshot))
                            } catch (e: Exception) {
                                e.printStackTrace()
                            }
                        }
                        //Arraylist roteiroArrayList recebe a lista de classes.
                        roteiroArrayList = data
                        //É necessário notificar os observers da alteração sucedida para que estes consigam disponibilizar a informação
                        setChanged()
                        notifyObservers()
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }

            override fun onCancelled(p0: DatabaseError) {
                if (p0 != null) {
                    Log.i("RoteiroModel4", "data update canceled")

                }
            }
        }
        getDatabaseRef()?.addValueEventListener(listener!!)
    }

    //GetData é chamada para ser atualizar a listView.
    fun getData(): ArrayList<RoteiroClass>? {
        return roteiroArrayList
    }
}
