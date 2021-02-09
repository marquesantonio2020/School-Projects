package com.example.roadtip.perfil

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.roadtip.MainActivity
import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentPerfilBinding
import com.example.roadtip.mainscreen.MainScreen
import com.example.roadtip.models.LoginViewModel
import com.example.roadtip.roteiro.DescricaoRoteiro
import com.example.roadtip.roteiro.RoteiroAdapter
import com.example.roadtip.roteiro.RoteiroClass
import com.example.roadtip.roteiro.RoteiroModel
import com.firebase.ui.auth.AuthUI
import com.firebase.ui.auth.AuthUI.getApplicationContext
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.firebase.auth.FirebaseAuth
import com.squareup.picasso.Picasso
import java.util.*
import kotlin.collections.ArrayList

/**Fragmento da conta do utilizador. É responsável por disponibilizar informação relativa ao utilizador
 * autenticado assim como os roteiros criados pelo mesmo.*/

class Perfil : Fragment(), java.util.Observer {

    private lateinit var binding: FragmentPerfilBinding
    var loginx : Boolean = true

    //Variável que conterá a referência ao view model do login para obter o estado de autenticação
    private lateinit var viewModel : LoginViewModel
    //Variável que conterá a referência ao mainscreen
    lateinit var  mainScreen : MainScreen

    //Variável que conterá a referência à listview contida no layout deste fragmento
    private lateinit var listaRoteiros: ListView
    //Variável que conterá a referência do adaptador AdapterPerfil
    private var roteiroAdapter: RoteiroAdapterPerfil? = null
    private var aux: ViewGroup? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,savedInstanceState: Bundle?): View? {
        viewModel = ViewModelProviders.of(this).get(LoginViewModel::class.java)
        // Inflate the layout for this fragment
        //DataBinding do fragmento
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_perfil, container, false)

        //Nome da conta associada ao login efetuado
        var nomexConta = "${FirebaseAuth.getInstance().currentUser?.displayName}"
        //Email da conta registada no sistema
        var emailxConta = "${FirebaseAuth.getInstance().currentUser?.email}"

        val textView: TextView = this.binding.nomeLayoutConta as TextView
        textView.text = nomexConta

        val textxView: TextView = this.binding.emailLayoutConta as TextView
        textxView.text = emailxConta

        aux = container

        listaRoteiros = binding.roteiroList
        val data: ArrayList<RoteiroClass> = ArrayList()

        /**RoteiroAdapterPerfil é responsável por preparar o layout preparado para receber informações sobre os roteiros
         * do utilizador. É responsável também por atribuir os valores correspondentes às diferentes view que compõem o
         * layout.*/
        roteiroAdapter = RoteiroAdapterPerfil(this.requireContext(), R.layout.lista_roteiros_perfil, data)

        /**listaRoteiros corresponde à listview do layout deste fragmento. É lhe dado o adaptador cujo conteúdo
         * gera a lista da informação que contém.*/
        listaRoteiros.setAdapter(roteiroAdapter)

        //Este setOnClickListener permite que os diversos itens da listview sejam clicáveis
        //Dependendo do item clicádo será gerado uma página de descrição do roteiro diferente
        listaRoteiros.setOnItemClickListener{ parent: AdapterView<*>, view: View, position: Int, id: Long ->

            val descricaoRoteiro: DescricaoRoteiro = DescricaoRoteiro()
            val bundle: Bundle = Bundle()



            val auxiliar : RoteiroClass = roteiroAdapter!!.getInfo(view, position)

            AddInfoIntoIntent(bundle, auxiliar)

            descricaoRoteiro.arguments = bundle

            //Transição para o fragmento DescricaoRoteiros
            val manager = parentFragmentManager
            val t = manager?.beginTransaction()

            t.hide(this)
            t.add(aux!!.id, descricaoRoteiro)
            t.addToBackStack("fragmentDescricaoRoteiro")
            t.commit()

        }




        return binding.root

    }

    //Método de inserção de informação dentro de um bundle para ser passado entre fragmentos
    private fun AddInfoIntoIntent(bundle: Bundle, roteiro: RoteiroClass){

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

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        observeAuthenticationState()
    }

    //Método de observação da autenticação realizada para permitir o termino do sessão
    private fun observeAuthenticationState() {

        viewModel.authenticationState.observe(viewLifecycleOwner, Observer { authenticationState ->
            when (authenticationState) {
                LoginViewModel.AuthenticationState.AUTHENTICATED -> {

                    binding.termSessao.setOnClickListener {
                        AuthUI.getInstance().signOut(this.requireActivity())
                        Toast.makeText(this.context, "Sessão terminada", Toast.LENGTH_SHORT).show()

                        var main = this.activity
                        var bottomBar: BottomNavigationView = main!!.findViewById(R.id.bottom_tabs)
                        bottomBar.menu.findItem(R.id.nav_home).setChecked(true)

                        mainScreen = MainScreen()
                        parentFragmentManager.beginTransaction()
                            .replace(R.id.frame_layout, mainScreen)
                            .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                            .commit()

                        (activity as MainActivity?)!!.changeLogin()

                    }
                }
            }
        })
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

    //Override ao update do lifecycle do fragmento. Permite atualizar a informação da listagem
    //sempre que ocorre uma alteração
    override fun update(o: Observable?, arg: Any?) {
        roteiroAdapter?.clear()

        val data = RoteiroModel.getData()
        val dataRotPerfil = ArrayList<RoteiroClass>();

        //Recebidos somento os roteiros existentes no firebase cujo nome do criados corresponde ao nome do
        //utilizador desta conta.
        for (i in data!!.indices){
            if(data.get(i).criadorRoteiro.equals("${FirebaseAuth.getInstance().currentUser?.displayName}")){
                dataRotPerfil!!.add(data[i])
            }
        }

        //Primeiro é limpada qualquer informação existente e só depois é feito uma
        //nova injeção de dados para a lista.
        if(dataRotPerfil != null){
            roteiroAdapter?.clear()
            roteiroAdapter?.addAll( dataRotPerfil)
            roteiroAdapter?.notifyDataSetChanged()
        }
    }


}


