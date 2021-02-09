package com.example.roadtip.restaurantes

import com.google.firebase.database.DataSnapshot
import java.lang.Exception

/**Classe Restaurante. Contém as variáveis correspondentes aos atributos relevantes e obrigatórios
 * para se representar restaurantes na aplicação. É feita também a associação entre essas variáveis
 * e a informação da firebase quando é criada uma instância firebase*/

class restauranteClass(snapshot: DataSnapshot){
    lateinit var id: String
    lateinit var nomeRestaurante: String
    lateinit var precoMedio: String
    lateinit var dono: String
    lateinit var localizacao: String
    lateinit var hashtag: String
    lateinit var classificacao: String
    lateinit var descricao: String
    lateinit var morada: String
    lateinit var latlong: String

    //Variáveis recebem informação da instância firebase, para cada restaurante existente.
    init {
        try {
            @Suppress("UNCHECKED_CAST")
            val data: HashMap<String, Any> = snapshot.value as HashMap<String, Any>

            id = snapshot.key ?: ""
            nomeRestaurante = data["nome"] as String
            precoMedio = data["precomedio"] as String
            dono = data["dono"] as String
            localizacao = data["local"] as String
            hashtag = data["hashtags"] as String
            classificacao = data["classificacao"] as String
            descricao = data["descricao"] as String
            morada = data["morada"] as String
            latlong = data["LatLong"] as String

        }catch (e:Exception){
            e.printStackTrace()
        }
    }

}