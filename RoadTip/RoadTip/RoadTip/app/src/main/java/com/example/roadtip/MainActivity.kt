package com.example.roadtip

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.FragmentTransaction
import com.example.roadtip.mainscreen.MainScreen
import com.example.roadtip.roteiro.Roteiros
import com.example.roadtip.databinding.ActivityMainBinding
import com.example.roadtip.perfil.Perfil
import com.firebase.ui.auth.AuthUI
import com.firebase.ui.auth.IdpResponse
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.firebase.auth.FirebaseAuth


class MainActivity : AppCompatActivity() {
    companion object {
        const val TAG = "ERRO!"
        const val SIGN_IN_RESULT_CODE = 1001
        const val PERMISSION_REQUEST = 10

    }
    private var permissions = arrayOf(Manifest.permission.ACCESS_FINE_LOCATION)
    private var allSuccess:Boolean = false
    //Variável que guardará uma referência para a barra de tabs
    lateinit var bottomNav : BottomNavigationView
    //Variável que guardará uma instância do fragmento MainScreen
    lateinit var  mainScreen : MainScreen
    lateinit var routeScreen : Roteiros
    lateinit var perfilScreen : Perfil
    lateinit var inicioScreen : Inicio
    var login : Boolean = false
    lateinit var binding : ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


//        bottomNav.menu.findItem(R.id.nav_home).setVisible(false)
//        bottomNav.menu.findItem(R.id.nav_account).setVisible(false)
//        bottomNav.menu.findItem(R.id.nav_route).setVisible(false)

        inicioScreen = Inicio()
        supportFragmentManager.beginTransaction()
            .replace(R.id.frame_layout, inicioScreen)
            .setCustomAnimations(R.anim.fadein, R.anim.fadeout)
            .commit()


        binding = DataBindingUtil.setContentView<ActivityMainBinding>(this, R.layout.activity_main)

        //Referência da barra de tabs
        bottomNav = findViewById(R.id.bottom_tabs)
        bottomNav.menu.findItem(R.id.nav_home).setVisible(true)
        bottomNav.menu.findItem(R.id.nav_account).setVisible(true)
        bottomNav.menu.findItem(R.id.nav_route).setVisible(true)

        //Instânciamento do fragmento MAinScreen
        mainScreen = MainScreen()

        Handler().postDelayed({
            /**Funcionalidade de troca de fragmentos visivéis. Ocorre a troca sobre o FrameLayout do activity_main.xml
             * diretamente para o fragmento MainScreen quando se abre a aplicação*/
            supportFragmentManager.beginTransaction()
                .replace(R.id.frame_layout, mainScreen)
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .commit()
        }, 3000)

        /**Atribuição de clicabilidade aos tabs. Dependendo do item do tab selecionado é criado uma instância de um fragmento diferente
         * e devida transação entre fragmentos*/
        bottomNav.setOnNavigationItemSelectedListener { item ->
            when(item.itemId){
                R.id.nav_home -> {
                    mainScreen = MainScreen()
                    supportFragmentManager.beginTransaction()
                        .replace(R.id.frame_layout, mainScreen)
                        .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                        .commit()
                }
                R.id.nav_route -> {
                    routeScreen = Roteiros()
                    supportFragmentManager.beginTransaction()
                        .replace(R.id.frame_layout, routeScreen)
                        .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                        .commit()
                }
                R.id.nav_account -> {
                    if(FirebaseAuth.getInstance().currentUser == null){
                        changeLogin()
                    }else{
                        login = true
                    }
                    if(!login){
                        //método que abre a página para se efetuar o login/sign in
                        launchSignIn()
                    }
                    else{
                        var nomeConta = "${FirebaseAuth.getInstance().currentUser?.displayName}"
                        val strings = nomeConta.split(" ").toTypedArray()
                        bottomNav.menu.findItem(R.id.nav_account).title = strings[0]
                        perfilScreen = Perfil()

                        supportFragmentManager.beginTransaction()
                            .replace(R.id.frame_layout, perfilScreen)
                            .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                            .commit()

                    }
                }
            }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (checkPermission(this, permissions)) {

                    } else {
                        requestPermissions(permissions, PERMISSION_REQUEST)
                    }
                }


            true
        }
    }

    fun changeLogin() {
        login=false
        bottomNav.menu.findItem(R.id.nav_account).title = "Conta"
    }

    fun changeLoginTrue() {
        login=true
        var nomeConta = "${FirebaseAuth.getInstance().currentUser?.displayName}"
        val strings = nomeConta.split(" ").toTypedArray()
        bottomNav.menu.findItem(R.id.nav_account).title = strings[0]
    }



    fun launchSignIn(){
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
                .build(), SIGN_IN_RESULT_CODE
        )
    }

    //Método da verificação do login a ser efetuado
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == SIGN_IN_RESULT_CODE) {
            val response = IdpResponse.fromResultIntent(data)
            if (resultCode == Activity.RESULT_OK) {
                var nomeConta = "${FirebaseAuth.getInstance().currentUser?.displayName}"

                /**Cada conta de email tem um nome associado, seja este nome constituido por uma unica string ou por um array de strings
                 *De forma a que o nome do utilizador apareça aquando o login é efetuado é feito um split ao nome associado ao email.
                 * O split é feito através dos espaços entre o nome */
                val strings = nomeConta.split(" ").toTypedArray()

                /**Altera o nome do icone "Conta" para o nome do utilizador que se encontra na primeira
                 * posição da lista de strings  (ou seja o nome selecionado é o primeiro nome do utilizador)*/
                bottomNav.menu.findItem(R.id.nav_account).title = strings[0]
                bottomNav.menu.findItem(R.id.nav_home).setChecked(true)
                mainScreen = MainScreen()
                supportFragmentManager.beginTransaction()
                    .replace(R.id.frame_layout, mainScreen)
                    .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                    .commit()
                login = true
            } else {
                // Sign in failed. If response is null, the user canceled the
                // sign-in flow using the back button. Otherwise, check
                // the error code and handle the error.
                bottomNav.menu.findItem(R.id.nav_account).title = "Conta"
            }
        }
    }

    fun checkPermission(context: Context, permissionArray: Array<String>): Boolean{
        allSuccess = true

        for(i in permissionArray.indices){
            if(checkCallingOrSelfPermission(permissions[i]) == PackageManager.PERMISSION_DENIED){
                allSuccess = false
            }
        }
        return allSuccess
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if(requestCode == PERMISSION_REQUEST){
            var allSuccess = true
            for(i in permissions.indices){
                allSuccess = false
                var requestAgain = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && shouldShowRequestPermissionRationale(permissions[i])
                if(requestAgain){
                }else{
                }
            }
            if(allSuccess){
            }
        }

    }

}
