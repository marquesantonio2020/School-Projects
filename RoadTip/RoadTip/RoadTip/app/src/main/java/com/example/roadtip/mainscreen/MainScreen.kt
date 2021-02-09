package com.example.roadtip.mainscreen


import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.ViewFlipper
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.FragmentTransaction
import com.example.roadtip.R
import com.example.roadtip.databinding.FragmentMainScreenBinding
import com.example.roadtip.restaurantes.Restaurantes
import com.example.roadtip.transportes.Transportes
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.firebase.auth.FirebaseAuth

/**
 * Fragmento inicial aquando o acesso à aplicação. Este fragmento contém vários botões para a navegação
 * entre várias categorias de pesquisa como por exemplo, restaurantes, transportes, hotéis, etc.
 */
class MainScreen : Fragment() {
    //Variável tipo ViewFlipper. Permite a alternância de imagens de forma automática num determinado espaço
    lateinit var v_flipper : ViewFlipper
    lateinit var images : Array<Int>
    private lateinit var transportesButton: ImageButton



    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        //Databinding do layout correspondente a este fragmento
        val binding = DataBindingUtil.inflate<FragmentMainScreenBinding>(inflater, R.layout.fragment_main_screen, container, false)

        /**Verificação da existência de um login efetuado. Caso verdadeiro então o item
         * da bottom navigation bar correspondente ao login deve apresentar o nome do utilizador.
         * Caso contrário o nome do item deve ser "Conta"*/
        if(FirebaseAuth.getInstance().currentUser?.displayName != null) {
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
        else{
            var main = this.activity
            var bottomBar: BottomNavigationView = main!!.findViewById(R.id.bottom_tabs)
            bottomBar.menu.findItem(R.id.nav_account).title = "Conta"
        }

        //As imagens "imagens" são colocadas dentro do ViewFlipper
        images = arrayOf(R.drawable.img_slider_1, R.drawable.img_slider_2, R.drawable.img_slider_3)
        v_flipper = binding.flipperPrincipal

        for(image in images){
            ImageSlider(image)
        }

        transportesButton = binding.transportesButton

        //Ação do botão transportes. Encaminha o utilizador para o layout de escolha de transportes para obtenção de horários
        transportesButton.setOnClickListener{ListaTransportes()}

        val restaurantes = binding.restaurantesButton

        //Ação do botão restaurantes. Encaminha o utilizador para o layout de escolha de restaurantes dos quais podem ser selecionados
        //para obtenção de informação extra
        restaurantes.setOnClickListener{Rest()}

        // Inflate the layout for this fragment
        return binding.root
    }

    //Método que injeta as imagens para o flipper
    fun ImageSlider(image : Int){
        val imageView : ImageView = ImageView(this.requireContext())
        imageView.setBackgroundResource(image)

        //Imagem adicionada no ViewFlipper
        v_flipper.addView(imageView)
        //4000ms -> 4s ---> duração de cada imagens antes de ser  alterada
        v_flipper.flipInterval = 4000
        //Transição entre imagens automática
        v_flipper.isAutoStart = true

        //Direção da animação de transição -> da direita para a esquerda
        v_flipper.setInAnimation(this.requireContext(), android.R.anim.slide_in_left)
        v_flipper.setOutAnimation(this.requireContext(), android.R.anim.slide_out_right)

    }

    //Método de transição do mainscreen para o layout dos transportes
    private fun ListaTransportes(){
        val transportes = Transportes()

        parentFragmentManager.beginTransaction()
            .replace(R.id.frame_layout, transportes)
            .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
            .commit()
    }
    //Método de transição do mainscreen para o layout dos restaurantes
    private fun Rest(){
        val rest = Restaurantes(false)

        parentFragmentManager.beginTransaction()
            .replace(R.id.frame_layout, rest)
            .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
            .commit()

    }


}
