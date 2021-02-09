package com.example.roadtip.models

import androidx.lifecycle.ViewModel
import com.example.roadtip.firebase.FirebaseUserLiveData
import androidx.lifecycle.map

/**ViewModel do login. Permite obter informação relativas a autenticação do utilizador*/

class LoginViewModel : ViewModel() {
    enum class AuthenticationState {
        //Tipos de autenticação que podem existir ---> Autênticado ou não Autênticado
        AUTHENTICATED, UNAUTHENTICATED
    }

    /**Verificação da existência de um utilizador ativo na aplicação.
     * Caso exista o Estado de autenticação é AUTHENTICATED caso contrário UNAUTHENTICATED*/
    val authenticationState = FirebaseUserLiveData().map{ user ->
        if (user != null) {
            AuthenticationState.AUTHENTICATED
        } else {
            AuthenticationState.UNAUTHENTICATED
        }
    }
}