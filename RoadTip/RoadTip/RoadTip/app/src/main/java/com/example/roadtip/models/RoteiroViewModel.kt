package com.example.roadtip.models

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider


class RoteiroViewModel(nomeRoteiro: String, localRoteiro: String, paisRoteiro: String) : ViewModel(){
    var _nome = MutableLiveData<String>()
    val nome : LiveData<String>
        get() = _nome;

    var _pais = MutableLiveData<String>()
    val pais : LiveData<String>
        get() = _pais;

    var _localidade = MutableLiveData<String>()
    val localidade : LiveData<String>
        get() = _localidade;

    init {
        _nome.value = nomeRoteiro
        _localidade.value = localRoteiro
        _pais.value = paisRoteiro
    }

}


class RoteiroViewModelFactory(private val nomeRoteiro: String, private val localRoteiro: String, private val paisRoteiro: String) : ViewModelProvider.Factory {
    override fun <T : ViewModel?> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(RoteiroViewModel::class.java)) {
            return RoteiroViewModel(nomeRoteiro, localRoteiro, paisRoteiro) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }

}
