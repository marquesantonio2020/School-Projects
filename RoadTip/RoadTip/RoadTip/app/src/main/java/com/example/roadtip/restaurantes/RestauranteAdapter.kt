package com.example.roadtip.restaurantes

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.TextView
import com.example.roadtip.R
import java.lang.Exception

/**RestauranteAdapter referência os dados obtidos do firebase relativamente aos restaurantes
 * e coloca essa referência nos widgets que constituem o layout da informação a ser disposta na listview*/

class RestauranteAdapter(context: Context, resource: Int, restauranteList: ArrayList<restauranteClass>)
    : ArrayAdapter<restauranteClass>(context, resource, restauranteList) {

    private var numeroResource: Int = 0
    private var lista: ArrayList<restauranteClass>
    private var inflater: LayoutInflater
    private var contexto: Context = context

    init {
        this.numeroResource = resource
        this.lista = restauranteList
        this.inflater = contexto.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
    }

    /**GetView retorna uma view*/
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val retorno: View?

        if (convertView == null) {
            retorno = try {
                inflater.inflate(numeroResource, null)
            } catch (e: Exception) {
                e.printStackTrace()
                View(context)
            }
            setUI(retorno, position)
            return retorno
        }
        setUI(convertView, position)
        return convertView
    }

    /**SetUI referencia os widgets de cada view com a informação da firabase*/
    private fun setUI(view: View, position: Int) {
        val restaurante: restauranteClass? = if (count > position) getItem(position) else null

        /**Para cada instância recebida do firebase para a classe restauranteClass
         * é associado o valor a um widget especifico para disponibilizar a informação
         * durante a listagem dos restaurantes.*/
        var nomeRestaurante: TextView = view.findViewById(R.id.titulo_restaurante)
        nomeRestaurante.text = restaurante?.nomeRestaurante ?: ""

        var precoMedio: TextView = view.findViewById(R.id.precomedio)
        precoMedio.text = restaurante?.precoMedio ?: ""

        var localidade: TextView = view.findViewById(R.id.localizacao)
        localidade.text = restaurante?.localizacao ?: ""

        var hashTags: TextView = view.findViewById(R.id.hashtags)
        hashTags.text = restaurante?.hashtag ?: ""

        var criador: TextView = view.findViewById(R.id.criador)
        criador.text = "Criado por: " + restaurante?.dono ?: ""

        var classificacao: TextView = view.findViewById(R.id.classificacao)
        classificacao.text = restaurante?.classificacao ?: ""

    }

    fun getInfo(view: View, position: Int): restauranteClass{
        val restaurante: restauranteClass? = if (count > position) getItem(position) else null

        return restaurante!!
    }

}
