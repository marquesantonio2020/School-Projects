package com.example.roadtip.restaurantes

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.roadtip.R

class recyclerViewAdapter(val restauranteList: ArrayList<restauranteClass>) :
    RecyclerView.Adapter<recyclerViewAdapter.ViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        var view = LayoutInflater.from(parent.context).inflate(R.layout.lista_restaurantes, parent, false)

        return ViewHolder(view)
    }

    override fun getItemCount(): Int {
        return restauranteList.size
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val restauranteModel: restauranteClass = restauranteList[position]

        holder.nomeRestaurante.text = restauranteModel.nomeRestaurante
        holder.criador.text = restauranteModel.dono
        holder.hashTags.text = restauranteModel.hashtag
        holder.precoMedio.text = restauranteModel.precoMedio.plus("€")
        holder.localidade.text = restauranteModel.localizacao

        holder.imagemRestaurante.setImageResource(R.drawable.img_slider_3)
        holder.iconClassificacao.setImageResource(R.drawable.fui_ic_check_circle_black_128dp)
    }

    class ViewHolder(item: View) : RecyclerView.ViewHolder(item){
        var nomeRestaurante: TextView = item.findViewById(R.id.titulo_restaurante)
        var precoMedio: TextView = item.findViewById(R.id.precomedio)
        var localidade: TextView = item.findViewById(R.id.localizacao)
        var hashTags: TextView = item.findViewById(R.id.hashtags)
        var criador: TextView = item.findViewById(R.id.criador)

        var imagemRestaurante: ImageView = item.findViewById(R.id.imagem_restaurante)
        var iconClassificacao: ImageView = item.findViewById(R.id.icon_classificacao)

    }
    
}