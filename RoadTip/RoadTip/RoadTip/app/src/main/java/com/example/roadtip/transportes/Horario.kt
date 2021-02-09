package com.example.roadtip.transportes


import android.content.Context
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ListView
import android.widget.TextView
import androidx.databinding.DataBindingUtil

import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentHorarioBinding
import java.util.*
import kotlin.collections.ArrayList

/**
 * Fragmento referente aos horários a serem apresentados ao utilizador consoante a escolha de empresa
 */
class Horario : Fragment() {

    private lateinit var binding: FragmentHorarioBinding

    private lateinit var horarioLista: ListView
    private lateinit var tituloHorario: TextView

    private lateinit var origem: String
    private lateinit var destino: String

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        //DataBinding do layout horario
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_horario, container, false)

        horarioLista = binding.horariosList

        tituloHorario = binding.empresaHorarioTitulo
        tituloHorario.text = arguments?.get("nomeEmpresa").toString()

        origem = arguments?.get("origem").toString()
        destino = arguments?.get("destino").toString()

        when(origem){
            "S.Bento" -> when(destino){
                "Campanhã"->{
                    val arrayString = ArrayList<String>(Arrays.asList(*resources.getStringArray(R.array.SBentoCampanhaOrigemDestino)))

                    Log.e("Horario", arrayString[0])
                    horarioLista.adapter = CustomAdapter(this.requireContext(), arrayString, origem, destino)
                }
            }

        }


        // Inflate the layout for this fragment
        return binding.root
    }

    //Listview criada a partir do número de resultados que esta contém
    private class CustomAdapter(context: Context, listaPalavras: ArrayList<*>, ini: String, fim: String): BaseAdapter() {
        private val thisContext: Context
        private var listaHorario: ArrayList<*>? = null
        private var i: Int = 0
        private var origem: String
        private var destino: String


        init {
            thisContext = context
            listaHorario = listaPalavras
            origem = ini
            destino = fim
            i = 0
        }


        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            var inflater: LayoutInflater
            var view: View? = convertView

            if (view == null) {
                inflater =
                    thisContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
                view = inflater.inflate(R.layout.lista_horarios, null)
            }

            val origemText: TextView = view!!.findViewById(R.id.origemText)
            val destinoText: TextView = view!!.findViewById(R.id.destinoText)
            val partidaText: TextView = view!!.findViewById(R.id.partidaText)
            val chegadaText: TextView = view!!.findViewById(R.id.chegadaText)

            if(i < count) {
                origemText.text = origem
                destinoText.text = destino

                val string: String = listaHorario!!.get(i).toString()
                Log.e("Horario", string)
                Log.e("Horario", count.toString())


                val array = string.split("-")


                partidaText.text = array.get(0)
                chegadaText.text = array.get(1)


                i++
            }

            return view
        }

        override fun getItem(position: Int): Any {
            return listaHorario!!.get(position)
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return listaHorario!!.size
        }
    }

}


