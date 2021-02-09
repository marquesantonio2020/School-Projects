package com.example.roadtip.roteiro

/**Classe Roteiro auxiliar à RoteiroClass. Permite aceder à classe Roteiro sem que haja a necessidade de se aceder ao firebase*/
class RoteiroClassAux{
    lateinit var nomeRoteiro: String
    lateinit var precoRoteiro: String
    lateinit var localRoteiro: String
    lateinit var paisRoteiro: String
    lateinit var classificacaoRoteiro: String
    lateinit var descricaoRoteiro: String
    lateinit var restaurantes: ArrayList<String>
    lateinit var hashtags: String
    lateinit var criadorRoteiro: String
}