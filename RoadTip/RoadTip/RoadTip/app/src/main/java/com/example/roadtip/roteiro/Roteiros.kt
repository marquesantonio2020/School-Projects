package com.example.roadtip.roteiro


import android.os.Bundle
import android.os.Handler
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.os.postDelayed
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.roadtip.MainActivity
import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentRoteirosBinding
import com.example.roadtip.models.LoginViewModel
import com.firebase.ui.auth.AuthUI
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.firebase.auth.FirebaseAuth
import java.util.*
import kotlin.collections.ArrayList

/**
 * Fragmento onde são listados todos os roteiros cuja informação se encontre armazenada na firebase.
 */
class Roteiros : Fragment(), java.util.Observer {

    private lateinit var viewModel: LoginViewModel

    private lateinit var binding: FragmentRoteirosBinding
    lateinit var criarRoteiro: CriarRoteiroCidade
    private lateinit var botaoAdicionar: ImageView
    private lateinit var inputSearch: EditText

    private lateinit var listaRoteiros: ListView
    private var roteiroAdapter: RoteiroAdapter? = null
    private var aux: ViewGroup? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        viewModel = ViewModelProviders.of(this).get(LoginViewModel::class.java)

        //DataBinding do fragmento Roteiro
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_roteiros, container, false)

        RoteiroModel
        RoteiroModel.addObserver(this)

        aux = container

        botaoAdicionar = binding.botaoAdicionar
        botaoAdicionar.setOnClickListener { adicionarRoteiro() }
        if (FirebaseAuth.getInstance().currentUser?.displayName != null) {
            var main = this.activity
            var bottomBar: BottomNavigationView = main!!.findViewById(R.id.bottom_tabs)
            var nomeConta = "${FirebaseAuth.getInstance().currentUser?.displayName}"

            /**Cada conta de email tem um nome associado, seja este nome constituido por uma unica string ou por um array de strings
             *De forma a que o nome do utilizador apareça aquando o login é efetuado é feito um split ao nome associado ao email.
             * O split é feito através dos espaços entre o nome */
            val strings = nomeConta.split(" ").toTypedArray()

            /**Altera o nome do icone "Conta" para o nome do utilizador que se encontra na primeira
             * posição da lista de strings  (ou seja o nome selecionado é o primeiro nome do utilizador)*/
            bottomBar.menu.findItem(R.id.nav_account).title = strings[0]
        }
        //Referência à listview do fragmento Roteiro
        listaRoteiros = binding.roteiroList
        //ArrayList do tipo roteiroClass onde será colocada uma lista de instâncias dessa classe
        val data: ArrayList<RoteiroClass> = ArrayList()

        //Adapter que irá associar os valores obtidos da firebase e da classe restaurantes com o layout da lista de roteiro
        roteiroAdapter = RoteiroAdapter(this.requireContext(), R.layout.lista_roteiros, data)
        listaRoteiros.setAdapter(roteiroAdapter)

        this.roteiroAdapter!!.notifyDataSetChanged()

        listaRoteiros.setOnItemClickListener { parent: AdapterView<*>, view: View, position: Int, id: Long ->

            //Referência ao fragmento DescricaoRestaurante
            val descricaoRoteiro: DescricaoRoteiro = DescricaoRoteiro()
            //Bundle para armazenar informação a ser passada entre fragmentos
            val bundle: Bundle = Bundle()

            /**Ao ser clicado um dos itens da listview é obtido a instância
             * da classe RoteiroClass onde o utilizador clicou para ser possivel abrir
             * o fragmento da descrição mais apropriado*/
            val auxiliar: RoteiroClass = roteiroAdapter!!.getInfo(view, position)

            //Mêtodo de colocação de informação num bundle
            AddInfoIntoIntent(bundle, auxiliar)
            descricaoRoteiro.arguments = bundle

            //Transição entre este fragmento e o DescricaoRoteiro
            val manager = parentFragmentManager
            val t = manager?.beginTransaction()
            t.hide(this)
            t.add(aux!!.id, descricaoRoteiro)
            t.addToBackStack("fragmentDescricaoRoteiro")
            t.commit()

        }

        inputSearch = binding.pesquisaRoteiros

        //Listener para o inputSearch
        inputSearch.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                "test"
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                "test"
            }

            //Método que ativa a filtragem contida no RoteiroAdapter
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                roteiroAdapter!!.filter.filter(s)
            }

        })
        // Inflate the layout for this fragment
        return binding.root
    }

    //Método que permite a criação de um roteiro. Se o utilizador estiver logado é aberto um novo layout de criação de roteiro
    //Caso contrário é requerido ao utilizador criar um conta/logar-se
    private fun adicionarRoteiro() {
        if (FirebaseAuth.getInstance().currentUser?.displayName != null) {
            criarRoteiro = CriarRoteiroCidade()

            parentFragmentManager.beginTransaction()
                .replace(R.id.frame_layout, criarRoteiro)
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .commit()
        } else {
            launchSignIn()
        }
    }

    //Método de colocação de informação dentro de um bundle para ser passado entre argumentos
    private fun AddInfoIntoIntent(bundle: Bundle, roteiro: RoteiroClass) {

        bundle.putString("nomeRoteiro", roteiro.nomeRoteiro)
        bundle.putString("paisRoteiro", roteiro.paisRoteiro)
        bundle.putString("classificacaoRoteiro", roteiro.classificacaoRoteiro)
        bundle.putString("precoRoteiro", roteiro.precoRoteiro)
        bundle.putString("hashtagRoteiro", roteiro.hashtags)
        bundle.putString("criadorRoteiro", roteiro.criadorRoteiro)
        bundle.putString("descricaoRoteiro", roteiro.descricaoRoteiro)
        bundle.putString("cidadeRoteiro", roteiro.localRoteiro)
        bundle.putStringArrayList("restaurantes", roteiro.restaurantes)

    }

    override fun update(o: Observable?, arg: Any?) {
        roteiroAdapter?.clear()

        var data = RoteiroModel.getData()
        if (data != null) {
            Log.e("TESTE", "TESTE, PASSASTE????????")
            roteiroAdapter!!.clear()
            roteiroAdapter!!.addAll(data)
            roteiroAdapter!!.notifyDataSetChanged()
        }
    }

    override fun onResume() {
        super.onResume()
        RoteiroModel.addObserver(this)
    }

    override fun onPause() {
        super.onPause()
        RoteiroModel.deleteObserver(this)
    }

    override fun onStop() {
        super.onStop()
        RoteiroModel.deleteObserver(this)
    }

    //Método de execução de login/criação de conta
    private fun launchSignIn() {
        // Give users the option to sign in / register with their email or Google account.
        // If users choose to register with their email,
        // they will need to create a password as well.
        val providers = arrayListOf(
            AuthUI.IdpConfig.EmailBuilder().build(), AuthUI.IdpConfig.GoogleBuilder().build()

            // This is where you can provide more ways for users to register and
            // sign in.
        )

        // Create and launch the sign-in intent.
        // We listen to the response of this activity with the
        // SIGN_IN_REQUEST_CODE.
        startActivityForResult(
            AuthUI.getInstance()
                .createSignInIntentBuilder()
                .setAvailableProviders(providers)
                .build(), MainActivity.SIGN_IN_RESULT_CODE
        )

        (activity as MainActivity?)!!.changeLoginTrue()
    }

    override fun onStart() {
        super.onStart()

        Log.e("Start", "No Start")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.e("Start", "No Destrói")
    }

}
