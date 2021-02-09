package com.example.roadtip.firebase

import androidx.lifecycle.LiveData
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser

/**Classe de acesso a uma instância firebase para obtenção de um utilizador*/

class FirebaseUserLiveData : LiveData<FirebaseUser?>() {
    private val firebaseAuth = FirebaseAuth.getInstance()

    // TODO set the value of this FireUserLiveData object by hooking it up to equal the value of the
    //  current FirebaseUser. You can utilize the FirebaseAuth.AuthStateListener callback to get
    //  updates on the current Firebase user logged into the app.
    /**FirebaseAuth listener é o que mantém registo sobre o facto do utilizador estar login ou não*/
    private val authStateListener = FirebaseAuth.AuthStateListener { firebaseAuth ->
        /**É utilizada a instância do FirebaseAuth, instanciada no início da classe, para receber um ponto
         * de entrada para a Firebase Authentication SDK para ser utilizado pela aplicação
         * Com uma instância do Firebase é possível executar queries para obtenção de um user*/

        value = firebaseAuth.currentUser
    }

    //Quando este objecto contém um observer ativo, é iniciado a observação ao estado do FirebaseAuth
    //para verificar se existe algum utilizador ativo.
    override fun onActive() {
        firebaseAuth.addAuthStateListener(authStateListener)
    }

    //Quando este objeto já não possui nenhum observer ativo, para de observar o estado do FirebaseAuth
    //para prevenir fugas de memória.
    override fun onInactive() {
        firebaseAuth.removeAuthStateListener(authStateListener)
    }


}
