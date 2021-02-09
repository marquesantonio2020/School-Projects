package com.example.roadtip.restaurantes


import android.os.Bundle
import android.content.Intent
import android.content.Intent.getIntent
import android.content.Intent.parseIntent
import android.graphics.Color
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.databinding.DataBindingUtil

import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentDescricaoRestauranteBinding
import com.example.roadtip.roteiro.CriarRoteiroLocais
import com.google.android.gms.maps.*
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions

/**
 * Fragmento onde se encontra disponibilizada a informação relativa ao restaurante
 * que acabou de ser clicado na listagem dos restaurantes. É recebido por parâmetro boolean
 * para se determinar se as condições são as suficientes para mostrar o botão de adicionar para um roteiro
 */
class DescricaoRestaurante(val showAddButton: Boolean) : Fragment() {
    private lateinit var binding: FragmentDescricaoRestauranteBinding

    //Varáveis de referencia aos diferentes widgets que constituem o fragmento
    private lateinit var nomeText: TextView
    private lateinit var hashtagText: TextView
    private lateinit var classificacaoText: TextView
    private lateinit var precomedioText: TextView
    private lateinit var localText: TextView
    private lateinit var donoText: TextView
    private lateinit var descricaoText: TextView
    private lateinit var moradaText: TextView
    private lateinit var latlongString: String
    private lateinit var back: ImageButton
    private lateinit var favorito: ImageButton
    private var isFavorito: Boolean = false
    private lateinit var bundle: Bundle
    private var isAdicionado: Boolean = false

    private lateinit var arrayRestaurantes: ArrayList<String>

    private lateinit var adicionarButton: Button

    //Variáveis referentes à aplicação mapas.
    private lateinit var mapa: SupportMapFragment
    private lateinit var googleMap: GoogleMap

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        //Databinding do fragmento DeacricaoRestaurante
        binding = DataBindingUtil.inflate(
            inflater,
            R.layout.fragment_descricao_restaurante,
            container,
            false
        )

        favorito = binding.favorito
        favorito.setOnClickListener{isFavorito()}

        //Bundle onde serão guardados alguns valores para serem passados para outros fragmentos
        bundle = Bundle()

        nomeText = binding.tituloRestaurante
        hashtagText = binding.hashtags
        classificacaoText = binding.classificacao
        precomedioText = binding.precomedio
        localText = binding.localizacao
        donoText = binding.criador
        descricaoText = binding.textoDescricao
        moradaText = binding.morada

        adicionarButton = binding.buttonAdicionar
        back = binding.backarrow

        /**Os arguments contém informações que o bundle do fragmento atual recebeu do fragmento/actividade que o precedeu.
         * através das referências dadas ao bundle é possivel aceder-se ao valores passados e carregá-los no fragmento atual*/
        nomeText.text = arguments?.getString("nomeRestaurante")
        hashtagText.text = arguments?.getString("hashtagRestaurante")
        classificacaoText.text = arguments?.getString("classificacaoRestaurante")
        precomedioText.text = "Preço médio: " + arguments?.getString("precoRestaurante")
        localText.text = arguments?.getString("localRestaurante")
        donoText.text = "Criado por: " + arguments?.getString("donoRestaurante")
        descricaoText.text = arguments?.getString("descricaoRestaurante")
        moradaText.text = arguments?.getString("moradaRestaurante")

        arrayRestaurantes = arguments?.getStringArrayList("restaurantes") as ArrayList<String>

        //Se um restaurante em particular já tiver sido adicionado o botão tem que ser alterado para mostrar "Remover Roteiro"
        for (adicionados in arrayRestaurantes) {
            val splitArray = adicionados.split(":")
            val nomeRes = splitArray[0]

            if (nomeRes == nomeText.text.toString()) {
                isAdicionado = true
                adicionarButton.setText("Remover Roteiro")
                adicionarButton.setBackgroundResource(R.drawable.button_selected_round_borders)
            }
            break
        }

        /**latLongString contém informações sobre os valores de latitude e longetide
         * do restaurante em questão, passada por string*/
        latlongString = arguments?.getString("latlongRestaurante").toString()

        /**É necessário dividir os valores da string da latitude e longitude para
         * ser possível utilizar os valores individualmente no formato Double*/
        val latlongSplit = latlongString.split(",")
        val lat = latlongSplit[0].toDouble()
        val long = latlongSplit[1].toDouble()

        //Referência ao fragmento maps do layout
        mapa = childFragmentManager.findFragmentById(R.id.map) as SupportMapFragment

        //Ativação do google map e inserção de um marcador referent à posição do mesmo
        mapa.getMapAsync(OnMapReadyCallback {
            googleMap = it

            //É usado a latitude e longitude para se obter a posição do restaurante no mapa
            val locationl = LatLng(lat, long)
            googleMap.addMarker(MarkerOptions().position(locationl).title("MyLocation"))
            //Animação dada à abertura do mapa
            //15f(Streets) corresponde ao tipo de Zoom.
            googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(locationl, 15f))
        })

        if (!showAddButton) {
            adicionarButton.visibility = View.GONE
        }

        //Ação de adicionar restaurantes ao roteiro
        adicionarButton.setOnClickListener { AdicionarRestaurante() }

        //Ação de retornar para o fragmento anterior
        back.setOnClickListener { Retornar() }


        // Inflate the layout for this fragment
        return binding.root
    }

    /**Método que adiciona um restaurante ao roteiro. Para que isso seja possível é necessário
     * colocar no bundle a informação relevante que se pertende obter deste fragmento. Essa informação
     * é o nome, morada e as coordenadas(Latitude e Longitude). Se o roteiro já estiver adicionado e estiver presente
     * no bundle então este é removido e são feitas as alterações necessárias para que o fragmento apresente a informação
     * coerente*/
    private fun AdicionarRestaurante() {
        //Se já estiver selecionado o restaurante e o botão for clicado novamente então o restaurante deve ser removido
        if (isAdicionado) {
            adicionarButton.setText("Adicionar Roteiro")
            adicionarButton.setBackgroundResource(R.drawable.button_round_borders)
            isAdicionado = false

            var valorRoteiro = SubtractToPreco()

            val fragmentManager = parentFragmentManager
            val frag = fragmentManager.fragments.get(0)

            val stringRestaurante: String =
                nomeText.text.toString() + ":" + latlongString + ":" + moradaText.text.toString()
            arrayRestaurantes.remove(stringRestaurante)
            bundle.putStringArrayList("restaurantes", arrayRestaurantes)
            bundle.putString("local", arguments?.getString("local"))
            bundle.putString("nome", arguments?.getString("nome"))
            bundle.putString("pais", arguments?.getString("pais"))
            bundle.putString("descricaoRoteiro", arguments?.getString("descricaoRoteiro"))
            bundle.putString("hashtags", arguments?.getString("hashtags"))
            bundle.putString("precoCalculado", valorRoteiro.toString())

            val selecaoRestaurante: Restaurantes = frag as Restaurantes

            selecaoRestaurante.arguments = bundle

            Toast.makeText(
                this.context,
                "Restaurante foi removido do seu roteiro com sucesso.",
                Toast.LENGTH_SHORT
            ).show()
        } else {
            //Se não estiver selecionado o restaurante e o botão for clicado novamente então o restaurante deve ser removido
            adicionarButton.setText("Remover Roteiro")
            adicionarButton.setBackgroundResource(R.drawable.button_selected_round_borders)
            isAdicionado = true

            var valorRoteiro = AddToPreco()
            Log.e("preco", valorRoteiro.toString())

            val fragmentManager = parentFragmentManager
            val frag = fragmentManager.fragments.get(0)
            val stringRestaurante: String =
                nomeText.text.toString() + ":" + latlongString + ":" + moradaText.text.toString()

            arrayRestaurantes.add(stringRestaurante)

            bundle.putStringArrayList("restaurantes", arrayRestaurantes)
            bundle.putString("local", arguments?.getString("local"))
            bundle.putString("nome", arguments?.getString("nome"))
            bundle.putString("pais", arguments?.getString("pais"))
            bundle.putString("descricaoRoteiro", arguments?.getString("descricaoRoteiro"))
            bundle.putString("hashtags", arguments?.getString("hashtags"))
            bundle.putString("precoCalculado", valorRoteiro.toString())

            val selecaoRestaurante: Restaurantes = frag as Restaurantes

            selecaoRestaurante.arguments = bundle

            Toast.makeText(
                this.context,
                "Restaurante foi adicionado ao seu roteiro com sucesso.",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    //Método de retorno para o fragmento anterior.
    private fun Retornar() {
        val manager = parentFragmentManager
        manager.popBackStack()
    }

    private fun SubtractToPreco(): Float{
        val string = precomedioText.text
        val array = string.split("€", " ")

        val string2 = arguments?.getString("precoCalculado")

        var preco = string2!!.toFloat() - array[2].toFloat()
        return preco
    }

    private fun AddToPreco(): Float{
        val string = precomedioText.text
        val array = string.split("€", " ")

        val string2 = arguments?.getString("precoCalculado")

        Log.e("preco", array[2] + string2)

        var preco = array[2].toFloat() + string2!!.toFloat()
        return preco
    }

    private fun isFavorito(){
        if(isFavorito == true){
            isFavorito = false
            favorito.setImageResource(R.drawable.ic_favorite_border_black_24dp)
        }else{
            isFavorito = true
            favorito.setImageResource(R.drawable.ic_favorite_black_24dp)
        }
    }
}
