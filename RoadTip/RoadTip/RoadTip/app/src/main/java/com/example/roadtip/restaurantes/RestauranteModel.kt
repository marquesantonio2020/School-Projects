package com.example.roadtip.restaurantes

import android.util.Log
import com.google.firebase.database.*
import java.util.*
import kotlin.collections.ArrayList

/**RestauranteModel é responsável por obter uma referência de restaurantes da firebase. Através dessa referência
 * são obtidos uma lista de snapshots que contêm a mesma estrutura de atributos que a classe restaurante.*/

object RestauranteModel: Observable(){

    private var listener: ValueEventListener? = null
    private var restaurantesArrayList: ArrayList<restauranteClass>? = ArrayList()

    private fun getDatanaseRef(): DatabaseReference?{
        return FirebaseDatabase.getInstance().reference.child("restaurantes")
    }

    init{
        if(listener != null){
            getDatanaseRef()?.removeEventListener(listener!!)
        }

        listener = null

        listener = object : ValueEventListener{
            override fun onCancelled(p0: DatabaseError) {
                if(p0 != null){

                }
            }

            override fun onDataChange(dataSnapshot: DataSnapshot) {
                try{

                    val data: ArrayList<restauranteClass> = ArrayList()
                    if(dataSnapshot != null){
                        for(snapshot: DataSnapshot in dataSnapshot.children){
                            try{
                                /**Para cada snapshot obtido da referência firebase é criado um objeto
                                 * tipo restaurante através da restauranteClass que é adicionado a um
                                 * arraylist do tipo restauranteClass*/
                                data.add(restauranteClass(snapshot))
                            }catch (e: Exception){
                                e.printStackTrace()
                            }
                        }
                        //Arraylist restauranteArrayList recebe a lista de classes.
                        restaurantesArrayList = data
                        //É necessário notificar os observers da alteração sucedida para que estes consigam disponibilizar a informação
                        setChanged()
                        notifyObservers()
                    }
                }catch (e: Exception){
                    e.printStackTrace()
                }
            }
        }
        getDatanaseRef()?.addValueEventListener(listener!!)
    }

    //GetData é chamada para ser atualizar a listView.
    fun getData(): ArrayList<restauranteClass>?{
        return restaurantesArrayList
    }

}