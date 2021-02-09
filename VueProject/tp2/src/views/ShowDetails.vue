<template>
  <v-container>
    <horizontal-card :ID="this.showId"></horizontal-card>
    <comments :ID="this.showId"></comments>
  </v-container>
</template>

<script>
import HorizontalCard from "../components/HorizontalCard.vue";
import Comments from "../components/Comments.vue";


export default {
  components: { HorizontalCard, Comments},
  props: ["showId"],
};
</script>

<style scoped>
</style>