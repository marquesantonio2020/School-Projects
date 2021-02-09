package com.example.roadtip.roteiro


import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.databinding.DataBindingUtil

import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentDescricaoRoteiroBinding
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions

/**
 * Fragmento onde se encontra disponibilizada a informação relativa ao roteiro
 * que acabou de ser clicado na listagem dos roteiros.
 */
class DescricaoRoteiro : Fragment() {
    private lateinit var binding: FragmentDescricaoRoteiroBinding

    private lateinit var nomeText: TextView
    private lateinit var hashtagText: TextView
    private lateinit var classificacaoText: TextView
    private lateinit var precomedioText: TextView
    private lateinit var localText: TextView
    private lateinit var donoText: TextView
    private lateinit var descricaoText: TextView
    private lateinit var paisText: TextView
    private lateinit var backButton: ImageView
    private lateinit var stringRestaurantes: ArrayList<String>
    private lateinit var latLog: ArrayList<String>
    private lateinit var listaNomeRestaurantes: ArrayList<String>
    private lateinit var favorito: ImageButton
    private var isFavorito: Boolean = false
    private var contagem = 0

    private lateinit var mapa: SupportMapFragment
    private lateinit var googleMap: GoogleMap

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        //Databinding do fragmento DeacricaoRestaurante
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_descricao_roteiro, container, false)

        favorito = binding.favorito
        favorito.setOnClickListener{isFavorito()}

        backButton = binding.backarrow
        backButton.setOnClickListener{Retornar()}

        //Lista dos nomes restaurantes que constituem este roteiro
        listaNomeRestaurantes = ArrayList()
        //Lista das latitudes e longitudes dos restaurante adicionados ao roteiro
        latLog = ArrayList()

        nomeText = binding.tituloRoteiro
        hashtagText = binding.hashtagsRoteiro
        classificacaoText = binding.classificacaoRoteiro
        precomedioText = binding.precomedioRoteiro
        localText = binding.cidadeRoteiro
        donoText = binding.criadorRoteiro
        descricaoText = binding.textoDescricao
        paisText = binding.localizacaoRoteiro

        //Armazenamento da informação contida nos argumentos para os widgets disponivéis no layout
        nomeText.text = arguments?.getString("nomeRoteiro")
        hashtagText.text = arguments?.getString("hashtagRoteiro")
        classificacaoText.text = arguments?.getString("classificacaoRoteiro")
        precomedioText.text = "Preço médio: " + arguments?.getString("precoRoteiro") + "€"
        localText.text = arguments?.getString("cidadeRoteiro")
        donoText.text = "Criado por: " + arguments?.getString("criadorRoteiro")
        descricaoText.text = arguments?.getString("descricaoRoteiro")
        paisText.text = arguments?.getString("paisRoteiro")

        //Variável auxiliar que contem a lista de restaurantes do roteiro
        stringRestaurantes = arguments?.getStringArrayList("restaurantes") as ArrayList<String>

        //Para cada restaurante é retirado o nome e a latitude/longitude
        for(string: String in stringRestaurantes){
            var auxiliar: List<String> = string.split(":")

            //nome adicionado à lista de nomes
            listaNomeRestaurantes.add(auxiliar.get(0))
            //Latitude e Longitude adicionada à lista de lat/long
            latLog.add(auxiliar.get(1))

        }

        //Referência ao mapa contido no fragmento
        mapa = childFragmentManager.findFragmentById(R.id.map) as SupportMapFragment

        //Implementação do googlemaps
        mapa.getMapAsync(OnMapReadyCallback {
            googleMap = it

            //Para cada string em latlog é feita a divisão da string para se obter a latitude e a longitude separadamente
            for(string: String in latLog) {
                var auxiliar: List<String> = string.split(",")

                //Converção da latitude e da longitude para double
                val location = LatLng(auxiliar.get(0).toDouble(), auxiliar.get(1).toDouble())

                //criação de markers para o mapa para cada restaurante existente no roteiro
                googleMap.addMarker(MarkerOptions().position(location).title(listaNomeRestaurantes.get(contagem)))
                googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(location, 15f))

                contagem++
            }
        })

        // Inflate the layout for this fragment
        return binding.root
    }

    //Método de retorno para o fragmento anterior.
    private fun Retornar() {
        val manager = parentFragmentManager
        manager.popBackStack()
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
