<template>
<div class="text-center">
<v-menu
      v-model="value"
      :position-x="1500"
      :position-y="60"
    >
    <v-card>
        <v-list>
          <v-list-item >
            <v-avatar contain height=130px width=160px>
              <img :src="imageSource(USER)" alt="">
            </v-avatar>

            <v-list-item-content>
              <v-list-item-title>Name: {{USER.name}}</v-list-item-title>
              <v-list-item-subtitle>Username: {{USER.username}}</v-list-item-subtitle>
              <v-list-item-subtitle>NIF: {{USER.nif}}</v-list-item-subtitle>
              <v-list-item-subtitle>Email: {{USER.email}}</v-list-item-subtitle>
              <v-list-item-subtitle>ZipCode: {{USER.idZipCode}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item >
        </v-list>
    <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn @click="close()">Close</v-btn>
    </v-card-actions>
    </v-card>
</v-menu>
</div>
</template>
<script>
//Imports getter and actions from the vuex store
import { mapGetters, mapActions } from 'vuex';
export default {
  name: "Modal",
  props: {
    value: {
      required: true,
    },
     USER: Object,
  },
  methods: {
    close() {
      this.$emit("input", !this.value);
    },
    imageSource(user){
      return require("../../public/personImages/" + user.image)
    },
    
  },
};
</script>
<style scoped>
  #item{
  margin-bottom:1%
}
</style>