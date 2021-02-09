<!--Component about the Home page (first page that a user is going to have access too)-->
<template>
  <v-app style="padding: 0px, 30px">
    <v-container id="slideShow">
      <v-carousel
        :continuous="false"
        :cycle="true"
        hide-delimiter-background
        delimiter-icon="mdi-minus"
        show-arrows-on-hover
      >
        <v-carousel-item
          v-for="(item,i) in items"
          :key="i"
          :src="item.src"
          reverse-transition="fade-transition"
          transition="fade-transition"
        ></v-carousel-item>
      </v-carousel>
    </v-container>
    <subtitle Subtitle="Spotlight"/>
    <horizontal-displayer URL = 'http://localhost:3000/api/tp2/shows_spotlight' Color = 'border: solid 2px black'/>
    <subtitle Subtitle="Available Shows"/>
    <vertical-displayer URL= 'http://localhost:3000/api/tp2/shows' Color = 'border: solid 2px black'/>
    
  </v-app>
</template>

<script>
// @ is an alias to /src
import HorizontalDisplayer from '../components/HorizontalDisplayer.vue'
import Subtitle from '../components/Subtitle.vue'
import VerticalDisplayer from '../components/VerticalDisplayer.vue'


export default {
  name: "Home",
  components: {
    HorizontalDisplayer,
    VerticalDisplayer,
    Subtitle
  },
  data: () => ({
    items: [
      {
        src: "https://www.agendartecultura.com.br/wp-content/uploads/2017/07/cinema.jpg",
      },
      {
        src: "https://www.4rentargentina.com/blog/es/wp-content/uploads/Teatro-Colon.jpg",
      },
      {
        src: "https://media-manager.noticiasaominuto.com/naom_58fb8089d66b8.jpg?&w=1920",
      },
      {
        src: "https://th.bing.com/th/id/Rf97427737fc72ae5cb64cda82c8bc7ec?rik=37rQIhMoGxquSw&riu=http%3a%2f%2fcdn.relentlessbeats.com%2fwp-content%2fuploads%2f2017%2f05%2fdimitri-vegas-like-mike-release-170507-030-1200x800.jpg&ehk=NA6h6RyPL48GRbZ8hEFeebfqYACb0mksrCMH86MKWws%3d&risl=&pid=ImgRaw",
      },
    ],
  }),
}
</script>

<style scoped>
#slideShow {
  padding: 5px;
  margin-top:3%;
  max-width: 87%;
}
</style>