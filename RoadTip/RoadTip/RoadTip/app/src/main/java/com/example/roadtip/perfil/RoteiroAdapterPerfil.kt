package com.example.roadtip.perfil

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import com.example.roadtip.R
import com.example.roadtip.restaurantes.restauranteClass
import com.example.roadtip.roteiro.RoteiroClass
import org.w3c.dom.Text
import java.lang.Exception

/**RoteiroAdapterPerfil referência os dados obtidos do firebase relativamente aos roteiros
 * e coloca essa referência nos widgets que constituem o layout da informação a ser disposta na listview*/

class RoteiroAdapterPerfil(context: Context, resource: Int, listaRoteiros: ArrayList<RoteiroClass>)
    : ArrayAdapter<RoteiroClass>(context, resource, listaRoteiros) {

    private var numeroResource: Int = 0
    private var lista: ArrayList<RoteiroClass>
    private var inflater: LayoutInflater
    private var contexto: Context = context

    init {
        this.numeroResource = resource
        this.lista = listaRoteiros
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
        val roteiro: RoteiroClass? = if (count > position) getItem(position) else null

        /**Para cada instância recebida do firebase para a classe RoteiroClass
         * é associado o valor a um widget especifico para disponibilizar a informação
         * durante a listagem dos roteiros.*/
        var nomeRoteiro: TextView = view.findViewById(R.id.titulo_roteiro_list)
        nomeRoteiro.text = roteiro?.nomeRoteiro ?: ""

        var precoRoteiro: TextView = view.findViewById(R.id.precomedio_roteiro)
        precoRoteiro.text = roteiro?.precoRoteiro + "€"

        var classificacaoRoteiro: TextView = view.findViewById(R.id.classificacao_roteiro)
        classificacaoRoteiro.text = roteiro?.classificacaoRoteiro ?: ""

        var hashRoteiro: TextView = view.findViewById(R.id.hashtags_roteiro)
        hashRoteiro.text =roteiro?.hashtags ?: ""

        var paisRoteiro: TextView = view.findViewById(R.id.localizacao_roteiro)
        paisRoteiro.text = roteiro?.paisRoteiro ?: ""

    }

    //Retorna informação contida em cada view no formato da classe roteiro
    fun getInfo(view: View, position: Int): RoteiroClass {
        val roteiro: RoteiroClass? = if (count > position) getItem(position) else null

        return roteiro!!
    }


}