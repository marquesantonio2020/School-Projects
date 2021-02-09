package com.example.roadtip.restaurantes


import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.databinding.DataBindingUtil


import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentRestaurantesBinding
import com.example.roadtip.roteiro.CriarRoteiroLocais
import java.util.*
import kotlin.collections.ArrayList

/**
 * Fragmento onde são listados todos os restaurantes cuja informação se encontre armazenada na firebase.
 */
class Restaurantes(val showAddButton: Boolean) : Fragment(), Observer {

    private lateinit var binding: FragmentRestaurantesBinding
    private lateinit var back: ImageButton
    private lateinit var  listView : ListView
    private var restauranteAdapter: RestauranteAdapter? = null

    private var arrayRestaurantes: ArrayList<String> = ArrayList()

    private var aux: ViewGroup? = null

    @SuppressLint("WrongConstant")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        //DataBinding do fragmento Restaurantes
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_restaurantes, container, false)

        //Referência ao container do fragmento
        aux = container

        back= binding.backarrow
        //Método de retornar para o fragmento anterior
        back.setOnClickListener { Retornar() }

        //Adição de um observer para este fragmento em RestaurantesModel
        RestauranteModel
        RestauranteModel.addObserver(this)
        //Referência à listview do fragmento Restaurantes
        listView = binding.restaurantesList
        //ArrayList do tipo restauranteClass onde será colocada uma lista de instâncias dessa classe
        val data: ArrayList<restauranteClass> = ArrayList()
        //Adapter que irá associar os valores obtidos da firebase e da classe restaurantes com o layout da lista de restaurantes
        restauranteAdapter = RestauranteAdapter(this.requireContext(), R.layout.lista_restaurantes, data)
        listView.setAdapter(restauranteAdapter)

        listView.setOnItemClickListener{parent: AdapterView<*>, view: View, position: Int, id: Long ->

            //Referência ao fragmento DescricaoRestaurante
            val descricaoRestaurante: DescricaoRestaurante = DescricaoRestaurante(showAddButton)
            //Bundle para armazenar informação a ser passada entre fragmentos
            val bundle: Bundle = Bundle()


            /**Ao ser clicado um dos itens da listview é obtido a instância
             * da classe restauranteClass onde o utilizador clicou para ser possivel abrir
             * o fragmento da descrição mais apropriado*/
            val auxiliar : restauranteClass = restauranteAdapter!!.getInfo(view, position)

            //Mêtodo de colocação de informação num bundle
            AddInfoIntoIntent(bundle, auxiliar)

            descricaoRestaurante.arguments = bundle

            //Transição entre este fragmento e o DescricaoRestaurante
            val manager = parentFragmentManager
            val t = manager?.beginTransaction()
            t.hide(this)
            t.add(aux!!.id, descricaoRestaurante)
            t.addToBackStack("fragmentDescricaoRestaurante")
            t.commit()
        }
        // Inflate the layout for this fragment
        return binding.root
    }

    //Método de retorno para o fragmento anterior (CriarRoteiroLocais)
    private fun Retornar() {
        val criar = CriarRoteiroLocais()

        criar.arguments = arguments

        val manager = fragmentManager
        val frag_transaction = manager?.beginTransaction()
        frag_transaction?.replace(this.id, criar)
        frag_transaction?.commit()
    }

    //Sempre que há uma alteração À listview esta é atualizada para que a informação não se perca
    override fun update(o: Observable?, arg: Any?) {
        restauranteAdapter?.clear()



        val data = RestauranteModel.getData()
        val dataRes = ArrayList<restauranteClass>();

        if (data != null) {
            restauranteAdapter?.clear()
            restauranteAdapter?.addAll(data)
            restauranteAdapter?.notifyDataSetChanged()
        }

        //Recebidos somento os roteiros existentes no firebase cujo nome do criados corresponde ao nome do
        //utilizador desta conta.
        if(arguments?.getString("local")!!.isNotBlank()) {
            Log.e("local", arguments?.getString("local").toString())
            for (i in data!!.indices) {
                if (data.get(i).localizacao.equals(arguments?.getString("local").toString())) {
                    dataRes!!.add(data[i])
                }
            }

            restauranteAdapter?.clear()
            restauranteAdapter?.addAll(dataRes)
            restauranteAdapter?.notifyDataSetChanged()

        }


    }

    override fun onResume() {
        super.onResume()
        RestauranteModel.addObserver(this)
    }

    override fun onPause() {
        super.onPause()
        RestauranteModel.deleteObserver(this)
    }

    override fun onStop() {
        super.onStop()
        RestauranteModel.deleteObserver(this)
    }

    //Método de colocação de informação dentro de um bundle
    private fun AddInfoIntoIntent(bundle: Bundle, restaurante: restauranteClass){

        bundle.putString("nomeRestaurante", restaurante.nomeRestaurante)
        bundle.putString("localRestaurante", restaurante.localizacao)
        bundle.putString("classificacaoRestaurante", restaurante.classificacao)
        bundle.putString("precoRestaurante", restaurante.precoMedio)
        bundle.putString("hashtagRestaurante", restaurante.hashtag)
        bundle.putString("donoRestaurante", restaurante.dono)
        bundle.putString("descricaoRestaurante", restaurante.descricao)
        bundle.putString("moradaRestaurante", restaurante.morada)
        bundle.putString("latlongRestaurante", restaurante.latlong)

        bundle.putString("local", this.arguments?.getString("local"))
        bundle.putString("pais", this.arguments?.getString("pais"))
        bundle.putString("nome", this.arguments?.getString("nome"))
        bundle.putString("descricaoRoteiro", this.arguments?.getString("descricaoRoteiro"))
        bundle.putString("hashtags", this.arguments?.getString("hashtags"))
        bundle.putString("precoCalculado", this.arguments?.getString("precoCalculado"))

        bundle.putStringArrayList("restaurantes", arrayRestaurantes)
    }
}
