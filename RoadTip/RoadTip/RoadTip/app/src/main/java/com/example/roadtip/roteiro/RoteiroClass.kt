package com.example.roadtip.roteiro

import com.google.firebase.database.DataSnapshot
import java.lang.Exception

/**Classe Roteiro. Contém as variáveis correspondentes aos atributos relevantes e obrigatórios
 * para se representar roteiros na aplicação. É feita também a associação entre essas variáveis
 * e a informação da firebase quando é criada uma instância firebase*/

class RoteiroClass(snapshot: DataSnapshot){
    lateinit var nomeRoteiro: String
    lateinit var precoRoteiro: String
    lateinit var localRoteiro: String
    lateinit var paisRoteiro: String
    lateinit var classificacaoRoteiro: String
    lateinit var descricaoRoteiro: String
    lateinit var restaurantes: ArrayList<String>
    lateinit var hashtags: String
    lateinit var criadorRoteiro: String

    //Variáveis recebem informação da instância firebase, para cada restaurante existente.
    init {
        try {
            @Suppress("UNCHECKED_CAST")
            val data: HashMap<String, Any> = snapshot.value as HashMap<String, Any>


            nomeRoteiro = data["nomeRoteiro"] as String
            precoRoteiro = data["precoRoteiro"] as String
            localRoteiro = data["localRoteiro"] as String
            paisRoteiro = data["paisRoteiro"] as String
            hashtags = data["hashtags"] as String
            classificacaoRoteiro = data["classificacaoRoteiro"] as String
            descricaoRoteiro = data["descricaoRoteiro"] as String
            restaurantes = data["restaurantes"] as ArrayList<String>
            criadorRoteiro = data["criadorRoteiro"] as String

        }catch (e: Exception){
            e.printStackTrace()
        }
    }

}
