package com.example.roadtip.roteiro

import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Filter
import android.widget.Filterable
import android.widget.TextView
import com.example.roadtip.R
import com.example.roadtip.restaurantes.restauranteClass
import org.w3c.dom.Text
import java.lang.Exception

/**RoteiroAdapter referência os dados obtidos do firebase relativamente aos roteiros
 * e coloca essa referência nos widgets que constituem o layout da informação a ser disposta na listview.
 * Implementa Filterable para ser possível efetuarem se pesquisas na barra de pesquisa
 * relativamente ao roteiros*/

class RoteiroAdapter(context: Context, resource: Int, listaRoteiros: ArrayList<RoteiroClass>)
    : ArrayAdapter<RoteiroClass>(context, resource, listaRoteiros), Filterable {

    private var numeroResource: Int = 0
    private var lista: ArrayList<RoteiroClass>
    private var listaFiltrada: ArrayList<RoteiroClass>
    private var inflater: LayoutInflater
    private var contexto: Context = context

    init {
        this.numeroResource = resource
        this.lista = listaRoteiros
        this.listaFiltrada = listaRoteiros
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

        var criadorRoteiro: TextView = view.findViewById(R.id.criador_roteiro)
        criadorRoteiro.text = "Criado por: " + roteiro?.criadorRoteiro

    }

    fun getInfo(view: View, position: Int): RoteiroClass {
        val roteiro: RoteiroClass? = if (count > position) getItem(position) else null

        return roteiro!!
    }

    fun getAllInfo(): ArrayList<RoteiroClass?>{
        val roteiro: RoteiroClass?
        val lista: ArrayList<RoteiroClass?> = ArrayList()
        val pos: Int = 0

        while(pos <= count){
            lista.add(getItem(pos))
        }

        return lista
    }

    //Método de filtragem de roteiro para a pesquisa
    //Esta filtragem pesquisa por correspondências de letras iguais
    override fun getFilter(): Filter {
        //Ocorre sempre que num caracter novo é inserido na barra de pesquisa
        return object: Filter(){
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                //É convertido o que o utilizador escreve para uma string
                val stringPesquisa: String = constraint.toString()

                //Se a barra de pesquisa estiver vazia então a lista a ser apresentada é igual a lista recebida por parâmetro
                //Ou seja, todos os roteiros existentes são apresentados
                if(stringPesquisa.isEmpty()){
                    listaFiltrada = lista
                }else{
                    val listaResultados = ArrayList<RoteiroClass>()

                    for(row in lista){
                        //Se o nome do roteiro da lista recebida for igual à string naquele momento então é adicionado o roteiro a uma lista de resultados
                        if(row.nomeRoteiro!!.toLowerCase().contains(stringPesquisa.toLowerCase())){
                            listaResultados.add(row)
                            Log.e("Filtro", row.nomeRoteiro.toString())
                        }
                    }
                    //Lista filtrada é igual à lista de resultados
                    listaFiltrada = listaResultados
                }

                val resultados: FilterResults = Filter.FilterResults()
                //Devem ser retornados os roteiros sob a forma de FilterResults
                resultados.values = listaFiltrada

                return resultados


            }

            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                //Sempre que ocorre uma alteração e o resultado é publicado é necessário notificar a alteração
                listaFiltrada = results!!.values as ArrayList<RoteiroClass>
                Log.e("Filtro", listaFiltrada.size.toString())
                notifyDataSetChanged()
            }

        }
    }
}