package com.example.roadtip

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import com.example.roadtip.databinding.FragmentInicioBinding

/**Fragmento utilizado para ser possivel a implementação de uma animação*/

class Inicio : Fragment() {

    private lateinit var binding: FragmentInicioBinding

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,savedInstanceState: Bundle?): View? {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_inicio, container, false)

        return binding.root
    }

}