package com.example.roadtip.roteiro


import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.databinding.DataBindingUtil

import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentCriarRoteiroLocaisBinding
import com.example.roadtip.models.RoteiroViewModel
import com.example.roadtip.models.RoteiroViewModelFactory
import com.example.roadtip.restaurantes.Restaurantes
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import kotlinx.android.synthetic.main.fragment_descricao_roteiro.*

/**
 * Fragmento que permite a adição de informação extra para a criação do roteiro
 */
class CriarRoteiroLocais : Fragment() {
    private lateinit var binding: FragmentCriarRoteiroLocaisBinding

    private lateinit var restauranteButton: ImageButton
    private lateinit var criarRoteiroButton: Button
    private lateinit var descriptionArea: EditText
    private lateinit var hashtagArea: EditText
    private lateinit var restaurantes: Restaurantes
    private lateinit var back: ImageButton
    private lateinit var spinner: Spinner

    private lateinit var databaseReference: DatabaseReference

    private var aux: ViewGroup? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
            inflater,
            R.layout.fragment_criar_roteiro_locais,
            container,
            false
        )

        //Varável auxiliar para evitar que itens existentes na droplist restaurantes sejam removidos sem serem clicados
        var bool: Boolean = false
        aux = container

        restauranteButton = binding.restaurantesButton
        criarRoteiroButton = binding.criarroteiro
        descriptionArea = binding.descricaoOpcionalInput
        hashtagArea = binding.hashtagOpcionalInput
        back = binding.backarrow


        //Permite manter os dados relativos à descrição e hashtags quando o utilizador muda de fragmento
        if (arguments?.getString("descricaoRoteiro").toString() != null) {
            val descricao = arguments?.getString("descricaoRoteiro")
            descriptionArea.setText(descricao)
        }
        if (arguments?.getString("hashtags").toString() != null) {
            val hashtags = arguments?.getString("hashtags")
            hashtagArea.setText(hashtags)
        }
        if(arguments?.getString("precoCalculado").isNullOrBlank()){
            arguments?.putString("precoCalculado", "0")
        }
        //Lista de Restaurantes adicionados ao roteiro
        val restaurantesSelecionados: ArrayList<String> =
            arguments?.getStringArrayList("restaurantes") as ArrayList<String>

        spinner = binding.listagemRestaurantesSelecionados

        /**Se existirem restaurantes adicionados então o ArrayList de strings é transformando num Array de strings
         * para ser possível fornecer os dados ao spinner correspondente**/
        if (!restaurantesSelecionados.isEmpty()) {
            val arrayRestaurantes = restaurantesSelecionados.toTypedArray()

            //R.layout.spinner_customizado contém o formato do spinner
            val adapter: ArrayAdapter<CharSequence> =
                ArrayAdapter(this.requireContext(), R.layout.spinner_customizado, arrayRestaurantes)

            //R.layout_itens_spinners_customizado contém o formato pelos quais os items sao apresentados quando se carrega no spinner
            adapter.setDropDownViewResource(R.layout.itens_spinner_customizado)
            spinner.adapter = adapter

            /**Ao ser selecionado um item novo este pode ser removido da lista, para evitar que o utilizador
             * se tenha que dirigir especificamente à descrição do roteiro para o remover*/
            spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onNothingSelected(parent: AdapterView<*>?) {

                }

                override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
                ) {
                    if (bool == true && position >= 0) {
                        val arrayRestaurantes: ArrayList<String> =
                            arguments?.getStringArrayList("restaurantes") as ArrayList<String>
                        val stringAux: String = spinner.getItemAtPosition(position).toString()



                        for (i in arrayRestaurantes.indices) {
                            if (arrayRestaurantes[i] == stringAux) {
                                arrayRestaurantes.removeAt(i)
                                //o adapter é notificado da alteração
                                adapter.notifyDataSetChanged()
                                spinner.adapter = adapter
                                bool = false
                            }
                        }
                        arguments?.putStringArrayList("restaurantes", arrayRestaurantes)
                    } else {
                        bool = true
                    }
                }
            }
        }

        //Este botão reencaminha o utilizador para a lista de restaurantes para que posteriormente os possa adicionar
        restauranteButton.setOnClickListener { AdicionarRestaurantes() }
        //Este botão responsabiliza-se por adicionar o roteiro na firebase
        criarRoteiroButton.setOnClickListener { CriarRoteiro() }
        //Retorna o utilizador para fragmento CriarRoteiroCidade
        back.setOnClickListener { Retornar() }

        return binding.root
    }

    //Método que permite ao utilizador seguir para o fragmento restaurantes e adicioná-los ao roteiro
    private fun AdicionarRestaurantes() {
        restaurantes = Restaurantes(true)

        val auxiliar1: String = descriptionArea.text.toString()

        if (auxiliar1 != "") {
            arguments?.putString("descricaoRoteiro", auxiliar1)
        }

        val auxiliar2: String = hashtagArea.text.toString()

        if (auxiliar2 != "") {
            arguments?.putString("hashtags", auxiliar2)
        }

        restaurantes.arguments = this.arguments

        val manager = fragmentManager
        val frag_transaction = manager?.beginTransaction()
        frag_transaction?.replace(this.id, restaurantes)
        frag_transaction?.commit()

    }

    //Método que armazena o roteiro criado com as respetivas caracteristicas  numa instância do firebase
    private fun CriarRoteiro() {
        databaseReference = FirebaseDatabase.getInstance().getReference("Roteiros")

        /**RoteiroClassAux é uma class auxiliar do tipo RoteiroClass que não acede ao firebase.
         * Permite criar uma instância da classe roteiro para que possa ser atribuida diretamente
         * ao firebase que por si só gera o nome das variáveis e atribui os respetivos valor.*/
        val roteiro: RoteiroClassAux = RoteiroClassAux()

        roteiro.classificacaoRoteiro = "8/10"
        roteiro.descricaoRoteiro = descriptionArea.text.toString()
        roteiro.localRoteiro = arguments?.getString("local").toString()
        roteiro.paisRoteiro = arguments?.getString("pais").toString()
        roteiro.nomeRoteiro = arguments?.getString("nome").toString()
        roteiro.precoRoteiro = arguments?.getString("precoCalculado").toString()
        roteiro.hashtags = hashtagArea.text.toString()
        roteiro.criadorRoteiro = "${FirebaseAuth.getInstance().currentUser?.displayName}"
        roteiro.restaurantes = arguments?.getStringArrayList("restaurantes") as ArrayList<String>

        //Roteiro guardado numa nova instância caracterizada pelo nome dado ao roteiro
        databaseReference.child(arguments?.getString("nome").toString()).setValue(roteiro)

        val listaRoteiro: Roteiros = Roteiros()
        val manager = fragmentManager
        val frag_transaction = manager?.beginTransaction()
        frag_transaction?.replace(this.id, listaRoteiro)
        frag_transaction?.commit()

        Toast.makeText(this.context, "Roteiro criado com sucesso.", Toast.LENGTH_SHORT).show()


    }

    //Método que permite retornar ao fragmento CriarRoteiroCidade
    private fun Retornar() {
        val roteiroCidade: CriarRoteiroCidade = CriarRoteiroCidade()

        roteiroCidade.arguments = this.arguments

        val manager = fragmentManager

        val frag_transaction = manager?.beginTransaction()

        frag_transaction?.replace(this.id, roteiroCidade)
        frag_transaction?.commit()
    }


}
