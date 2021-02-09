package com.example.roadtip.transportes


import android.app.Activity
import android.content.Context
import android.media.Image
import android.os.Bundle
import android.view.KeyEvent
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.*
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.FragmentTransaction

import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentTransportesBinding
import com.example.roadtip.mainscreen.MainScreen

/**
 * Fragmento referentes ao layout dos transportes onde o utilizador pode escolher o meio de transporte e consequentemente de que
 * região é o transporte que pretende obter.
 */
class Transportes : Fragment() {
    private lateinit var binding: FragmentTransportesBinding

    private lateinit var transportesDroplist: Spinner
    private lateinit var paisText: EditText
    private lateinit var cidadeDropList: Spinner
    private lateinit var pesquisa: Button
    private lateinit var back: ImageButton

    private var paisString : String = ""

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        //DataBinding do fragmento transporte
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_transportes, container, false)

        transportesDroplist = binding.droplistTransportes

        //Colocação da informação de um string array no spinner. Contém informação sobre vários transportes
        ArrayAdapter.createFromResource(this.requireContext(), R.array.transportes_droplist, android.R.layout.simple_spinner_item).also { adapter ->
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

            transportesDroplist.adapter = adapter
        }

        paisText = binding.paisTransportesText
        cidadeDropList = binding.droplistCidadeTransportes

        pesquisa = binding.pesquisaBotao

        paisText.setOnKeyListener(View.OnKeyListener { v, keyCode, event ->
            if (keyCode == KeyEvent.KEYCODE_ENTER && event.action == KeyEvent.ACTION_UP) {
                //País escrito no texto editado
                paisString = paisText.text.toString()

                if (paisString.equals("Portugal")) {
                    /**A lista de objetos de um spinner é dado através de um adapter
                     * neste caso o adapter recebe um array de strings e o tipo de
                     * "simple_spinner_item" como forma de funcionamento*/
                    ArrayAdapter.createFromResource(
                        this.requireContext(),
                        R.array.localidades_droplist1,
                        android.R.layout.simple_spinner_item
                    ).also { adapter ->
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

                        hideKeyboard()
                        //Incorporação do adapter ao spinner
                        cidadeDropList.adapter = adapter
                        return@OnKeyListener true
                    }
                }
            }
            false
        })
        pesquisa.setOnClickListener{PesquisarHorarios()}

        back = binding.backarrow

        back.setOnClickListener{Retornar()}
        // Inflate the layout for this fragment
        return binding.root
    }

    //Pesquisa os horários de um determinado tipo de transporte e abre um novo layout dentro do próprio fragmento
    private fun PesquisarHorarios(){
        val transporteSelecionado: String = transportesDroplist.selectedItem.toString()
        val manager = this.parentFragmentManager

        when(transporteSelecionado){
            "Comboio" -> manager.beginTransaction()
                .replace(R.id.frame_transportes, TransporteComboio())
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .commit()

        }
    }

    //Método de retorno para o fragmento MainScreen
    private fun Retornar(){
        val main: MainScreen = MainScreen()

        val manager = fragmentManager

        val frag_transaction = manager?.beginTransaction()

        frag_transaction?.replace(this.id, main)
        frag_transaction?.commit()
    }

    fun Fragment.hideKeyboard() {
        view?.let { activity?.hideKeyboard(it) }
    }

    fun Activity.hideKeyboard() {
        hideKeyboard(currentFocus ?: View(this))
    }

    fun Context.hideKeyboard(view: View) {
        val inputMethodManager = getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
        inputMethodManager.hideSoftInputFromWindow(view.windowToken, 0)
    }


}
