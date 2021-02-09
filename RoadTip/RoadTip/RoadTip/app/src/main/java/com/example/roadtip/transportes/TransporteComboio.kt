package com.example.roadtip.transportes


import android.content.Context
import android.os.Bundle
import android.text.Layout
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.FragmentManager

import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentTransporteComboioBinding
import java.util.*
import kotlin.collections.ArrayList

/**
 * Fragmento que permite o utilizador escolher a origem e o destino do comboio. Aquando essa escolha
 * é apresentado ao utilizador os diversos tipos de empresas que efetuam o percursos de origem e destino
 * onde o utilizador pode visualizar os horários de quando esse percurso ocorre.
 */
class TransporteComboio : Fragment() {
    private lateinit var binding: FragmentTransporteComboioBinding

    private lateinit var origemDroplist: Spinner
    private lateinit var destinoDroplist: Spinner

    private var manager : FragmentManager? = null

    private lateinit var pesquisaComboios: Button
    private lateinit var list: ListView

    private var aux: ViewGroup? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
            inflater,
            R.layout.fragment_transporte_comboio,
            container,
            false
        )
        aux = container

        manager = parentFragmentManager

        //droplist dos locais de origem e destino que podem ser selecionados
        origemDroplist = binding.origemText
        destinoDroplist = binding.destinoText


        //Colocação da informação nos droplists/spinners
        ArrayAdapter.createFromResource(
            this.requireContext(),
            R.array.de_para_droplists,
            android.R.layout.simple_spinner_item
        ).also { adapter ->
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

            origemDroplist.adapter = adapter
        }

        ArrayAdapter.createFromResource(
            this.requireContext(),
            R.array.de_para_droplists,
            android.R.layout.simple_spinner_item
        ).also { adapter ->
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

            destinoDroplist.adapter = adapter
        }
        list = binding.listaTransportes

        pesquisaComboios = binding.pesquisaComboioBotao

        pesquisaComboios.setOnClickListener { AdicionarEmpresasLista() }




        // Inflate the layout for this fragment
        return binding.root
    }

    /**Método que disponibiliza informação relativoaos itens selecionados no spinner de origem
     * e destino*/

    private fun AdicionarEmpresasLista() {
        val origemText: String = binding.origemText.selectedItem.toString()
        val destinoText: String = binding.destinoText.selectedItem.toString()


        when (origemText) {
            "S.Bento" -> when (destinoText) {
                "Campanhã" -> {val arrayString = ArrayList<String>(Arrays.asList(*resources.getStringArray(R.array.SBento_Campanha)))

                    list.adapter = CustomAdapter(this.requireContext(), arrayString, manager, aux, origemDroplist, destinoDroplist)
                    Log.e("xx", "testeeeeeeee");
                }
            }

            "Campanhã" -> when (destinoText) {
                "Lisboa" -> {val arrayString = ArrayList<String>(Arrays.asList(*resources.getStringArray(R.array.Campanha_Lisboa)))

                    list.adapter = CustomAdapter(this.requireContext(), arrayString, manager, aux, origemDroplist, destinoDroplist)
                }
                "Braga" -> {val arrayString = ArrayList<String>(Arrays.asList(*resources.getStringArray(R.array.Campanha_Braga)))

                    list.adapter = CustomAdapter(this.requireContext(), arrayString, manager, aux, origemDroplist, destinoDroplist)
                }
            }
        }
    }

    /**Listview implementado no próprio fragmento. A informação das empresas resultantes do método AdicionarEmpresasLista
     * cria uma lista com o mesmo tamanho que o número de resultados*/
    private class CustomAdapter(context: Context, listaPalavras: ArrayList<*>, manager: FragmentManager?, viewGroup: ViewGroup?,
                                origemDrop: Spinner, destinoDrop: Spinner): BaseAdapter(){
        private val thisContext: Context
        private var lista: ArrayList<*>? = null
        private var auxiliar: Int = 0
        private val fragmentManager: FragmentManager? = manager
        private val aux: ViewGroup? = viewGroup
        private val origem: Spinner
        private val destino: Spinner

        init{
            thisContext = context
            lista = listaPalavras
            origem = origemDrop
            destino = destinoDrop
        }

        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            var inflater: LayoutInflater
            var view: View? = convertView

            if(view == null){
                inflater = thisContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
                view = inflater.inflate(R.layout.lista_empresa_comboios, null)
            }

            val text: TextView = view!!.findViewById(R.id.empresas)
            //Colocação de um botão a cada item.
            val button: Button = view!!.findViewById(R.id.botao_ver_horario)

            text.text = lista!!.get(auxiliar).toString()
            auxiliar++

            //Ação do botão que apresenta um novo fragmento com o horário selecionado
            button.setOnClickListener{VerHorario(text.text.toString(), origem.selectedItem.toString(), destino.selectedItem.toString())}


            return view
        }

        override fun getItem(position: Int): Any {
            return lista!!.get(position)
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()        }

        override fun getCount(): Int {
            return lista!!.size
        }

        //Método que apresentada o horário da empresa selecionada
        private fun VerHorario(auxiliar: String, auxiliar2: String, auxiliar3: String){
            val horario: Horario = Horario()
            val bundle: Bundle = Bundle()

            bundle.putString("nomeEmpresa", auxiliar)
            bundle.putString("origem", auxiliar2)
            bundle.putString("destino", auxiliar3)

            horario.arguments = bundle


            val t = this.fragmentManager!!.beginTransaction()

            t.replace(this.aux!!.id, horario)

            t.commit()
        }

    }


}
