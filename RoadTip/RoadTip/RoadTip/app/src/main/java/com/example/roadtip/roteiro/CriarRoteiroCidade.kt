package com.example.roadtip.roteiro


import android.app.Activity
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.*
import androidx.databinding.DataBindingUtil
import com.example.roadtip.models.RoteiroViewModel

import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentCriarRoteiroCidadeBinding
import kotlinx.android.synthetic.main.fragment_criar_roteiro_cidade.view.*
import kotlinx.android.synthetic.main.fragment_descricao_roteiro.view.*

/**
 * Fragmento responsável por permitir a inserção do nome, localidade e pais do roteiro
 */
class CriarRoteiroCidade : Fragment() {
    //variavéis exemplo para demonstração do preenchimento automático do spinner
    private var portugal: String = "Portugal"
    private var reino: String = "Reino Unido"

    private var paisString: String = ""

    //variável binding
    private lateinit var binding: FragmentCriarRoteiroCidadeBinding
    private lateinit var nomeRoteiro: EditText
    private lateinit var paisEditText: EditText
    private lateinit var local: String
    private lateinit var listaLocalidades: Spinner
    private lateinit var botao: Button
    private lateinit var back: ImageButton

    private lateinit var viewModel: RoteiroViewModel

    private lateinit var roteiroLocais: CriarRoteiroLocais

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        //Binding do fragmento
        binding = DataBindingUtil.inflate(
            inflater,
            R.layout.fragment_criar_roteiro_cidade,
            container,
            false
        )

        //Referência ao texto input para o nome do roteiro

        nomeRoteiro = binding.inputNomeRoteiro

        //Referência ao texto input para o pais do roteiro
        paisEditText = binding.inputPaisRoteiro

        //Referência à droplist
        listaLocalidades = binding.droplistLocalidades

        //Permite manter o nome do roteiro ao se retorceder para este fragmento
        if (arguments?.get("nome") != null) {
            nomeRoteiro.setText(arguments?.get("nome").toString())
        }

        botao = binding.buttonSeguinte
        back = binding.backarrow

        /**Ao ser clicado o botão para continuar são verificados se os campos obrigatórios foram preenchidos.
         * São colocadas mensagens de erro para notificar o utilizador a informação em falta.*/
        botao.setOnClickListener {
            if (nomeRoteiro.text.toString().equals("") || paisEditText.text.toString().equals("") || listaLocalidades.selectedItem == null) {

                if (nomeRoteiro.text.toString().equals("")) {
                    binding.nomeRoteiroSubtitulo.text = "Nome do roteiro: Nome do roteiro em falta"
                    binding.nomeRoteiroSubtitulo.setTextColor(resources.getColor(R.color.red))

                }
                if (paisEditText.text.toString().equals("")) {
                    binding.nomePaisSubtitulo.text = "Pais: Pais do roteiro em falta"
                    binding.nomePaisSubtitulo.setTextColor(resources.getColor(R.color.red))

                }
                if (listaLocalidades.selectedItem == null) {
                    binding.localidadeSubtitulo.text = "Localidade: Localidade em falta"
                    binding.localidadeSubtitulo.setTextColor(resources.getColor(R.color.red))
                }
                return@setOnClickListener
            }
            if (nomeRoteiro.text.toString() != "" || paisEditText.text.toString() != "" || listaLocalidades.selectedItem.toString() != null) {
                if (nomeRoteiro.text.toString() != "") {
                    binding.nomeRoteiroSubtitulo.setTextColor(resources.getColor(R.color.texto_preto))
                    binding.nomeRoteiroSubtitulo.setText("Nome do roteiro:")

                }
                if (paisEditText.text.toString() != "") {
                    binding.nomePaisSubtitulo.setTextColor(resources.getColor(R.color.texto_preto))
                    binding.nomeRoteiroSubtitulo.setText("País:")
                }
                if (listaLocalidades.selectedItem.toString() != "") {
                    binding.localidadeSubtitulo.setTextColor(resources.getColor(R.color.texto_preto))
                    binding.nomeRoteiroSubtitulo.setText("Localidade: ")
                }

            }
            PaginaSeguinte()
        }

        back.setOnClickListener { Retornar() }


        /**Listener dado ao "Done button"(botão de confirmação)
         * Quando o botão de confirmação é clicado é preenchida automáticamente
         * o spinner com o nome das localidades correspondentes ao país confirmado*/
        paisEditText.setOnKeyListener(View.OnKeyListener { v, keyCode, event ->
            if (keyCode == KeyEvent.KEYCODE_ENTER && event.action == KeyEvent.ACTION_UP) {
                //País escrito no texto editado
                paisString = paisEditText.text.toString()

                if (paisString.equals(portugal)) {
                    /**A lista de objetos de um spinner é dado através de um adapter
                     * neste caso o adapter recebe um array de strings e o tipo de
                     * "simple_spinner_item" como forma de funcionamento*/
                    ArrayAdapter.createFromResource(
                        this.requireContext(),
                        R.array.localidades_droplist1,
                        android.R.layout.simple_spinner_item
                    ).also { adapter ->
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                        binding.nomePaisSubtitulo.setTextColor(resources.getColor(R.color.texto_preto))
                        if (nomeRoteiro.text.toString() != "") {
                            binding.nomeRoteiroSubtitulo.setTextColor(resources.getColor(R.color.texto_preto))
                            binding.nomeRoteiroSubtitulo.setText("Nome do roteiro:")
                            binding.nomePaisSubtitulo.text = "País:"

                        }
                        //Esconde o teclado apôs o clique no done button
                        hideKeyboard()
                        //Incorporação do adapter ao spinner
                        listaLocalidades.adapter = adapter
                        return@OnKeyListener true
                    }

                }
                if (paisString.equals(reino)) {
                    ArrayAdapter.createFromResource(
                        this.requireContext(),
                        R.array.localidades_droplist2,
                        android.R.layout.simple_spinner_item
                    ).also { adapter ->
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

                        listaLocalidades.adapter = adapter
                        if (nomeRoteiro.text.toString() != "") {
                            binding.nomeRoteiroSubtitulo.setTextColor(resources.getColor(R.color.texto_preto))
                            binding.nomeRoteiroSubtitulo.setText("Nome do roteiro:")

                        }
                        //Esconde o teclado apôs o clique no done button
                        hideKeyboard()
                        return@OnKeyListener true
                    }
                } else {
                    if (nomeRoteiro.text.toString() != "") {
                        binding.nomeRoteiroSubtitulo.setTextColor(resources.getColor(R.color.texto_preto))
                        binding.nomeRoteiroSubtitulo.setText("Nome do roteiro:")

                    }
                    binding.nomePaisSubtitulo.text = "Pais: País inserido inválido."
                    binding.nomePaisSubtitulo.setTextColor(resources.getColor(R.color.red))
                    //Esconde o teclado apôs o clique no done button
                    hideKeyboard()
                }
            }
            //Esconde o teclado apôs o clique no done button
            hideKeyboard()
            false
        })

        // Inflate the layout for this fragment
        return binding.root
    }

    /**Método que permite avançar na criação do roteiro disponibilizando o layout seguinte.*/
    private fun PaginaSeguinte() {
        roteiroLocais = CriarRoteiroLocais()

        local = listaLocalidades.selectedItem.toString()
        val arrayRestaurantes: ArrayList<String> = ArrayList<String>()
        val bundle: Bundle = Bundle()

        bundle.putString("nome", nomeRoteiro.text.toString())
        bundle.putString("pais", paisString)
        bundle.putString("local", local)
        bundle.putStringArrayList("restaurantes", arrayRestaurantes)

        roteiroLocais.arguments = bundle

        val manager = fragmentManager

        val frag_transaction = manager?.beginTransaction()

        frag_transaction?.replace(this.id, roteiroLocais)
        frag_transaction?.commit()

    }

    /**Método que permite retornar ao fragmento anterior.*/
    private fun Retornar() {
        val roteiros: Roteiros = Roteiros()

        val manager = fragmentManager

        val frag_transaction = manager?.beginTransaction()

        frag_transaction?.replace(this.id, roteiros)
        frag_transaction?.commit()
    }

    fun Fragment.hideKeyboard() {
        view?.let { activity?.hideKeyboard(it) }
    }

    fun Activity.hideKeyboard() {
        hideKeyboard(currentFocus ?: View(this))
    }

    fun Context.hideKeyboard(view: View) {
        val inputMethodManager =
            getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
        inputMethodManager.hideSoftInputFromWindow(view.windowToken, 0)
    }


}
