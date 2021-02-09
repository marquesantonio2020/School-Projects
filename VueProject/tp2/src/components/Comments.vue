<template>
  <v-container>
    <v-card>
      <v-card-title> Reviews </v-card-title>
      <v-form ref="form" lazy-validation>
        <v-row
          style="justify-contents: center; padding-right: 2%; padding-left: 2%"
        >
          <p1 style="margin-top: 0.3%; font-size: 16px">Rate the product:</p1>
          <v-rating
            v-model="rating"
            color="yellow darken-2"
            background-color="grey darken-1"
            empty-icon="$ratingFull"
            half-increments
            hover
            size="18"
          ></v-rating>
          <p1 style="margin-top: 0.3%; font-size: 16px">{{ rating }}</p1>
        </v-row>
        <v-row style="padding: 2%">
          <v-textarea
            v-model="commentText"
            :counter="max"
            :rules="rules"
            maxlength="200"
            solo
            name="input-7-4"
            label="Comment........."
          ></v-textarea>
        </v-row>
        <v-row justify="end" style="padding-right: 2%; padding-left: 2%">
          <v-btn rounded color="secundary" dark @click="reset()">Clear</v-btn>
          <v-btn rounded color="red" @click="submit()" dark>Review</v-btn>
        </v-row>
        <p></p>
      </v-form>

      <v-list three-line>
        <v-list-item-group>
          <template>
            <v-list-item v-for="(comment, index) in commentsall" :key="index">
              <v-list-item-avatar>
                <v-img :src="imageSource(comment.image)"></v-img>
              </v-list-item-avatar>

              <v-list-item-content align="left">
                <v-list-item-title
                  ><v-row
                    ><v-col>{{ comment.name }} <v-rating
                    :value="comment.rating" color="amber" dense half-increments readonly size="14"
                    ></v-rating> </v-col>
                    <v-col align="right"
                      ><v-list-item-subtitle
                        >{{ comment.date }} |
                        {{ comment.hour }}</v-list-item-subtitle
                      ></v-col
                    ></v-row
                  ></v-list-item-title
                >
                <v-list-item-subtitle>{{
                  comment.commentText
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
    <login v-model="dialog"></login>
  </v-container>
</template>

<script>
import Vue from "vue";
import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);
import Login from "@/components/Login.vue";

import { mapGetters, mapActions } from "vuex";
export default {
  components:{
    login:Login,
  },
  props: {
    ID: String,
  },
  data: () => ({
    max: 200,
    rating: 0.0,
    commentText: "",
    dialog: false,
  }),
  computed: {
    ...mapGetters({
      commentsall: "comments/getComments",
      user: "auth/userData",
    }),
    rules() {
      const rules = [];
      if (this.max) {
        const rule = (v) =>
          (v || "").length <= this.max ||
          `A maximum of ${this.max} characters is allowed`;
        rules.push(rule);
      }
      return rules;
    },
  },
  watch: {
    max: "validateField",
  },
  methods: {
    validateField() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
      this.rating = 0.0;
    },
    ...mapActions({
      insertComments: "comments/fetchComments",
    }),
    insertingComments() {
      if (this.ID) {
        this.insertComments(this.ID);
      }
    },
    createComment() {
      const requestBody = {
        idUser: this.user[0].idUser,
        idShow: this.ID,
        rating: this.rating,
        commentText: this.commentText,
      };
      this.$axios
        .post(
          "http://localhost:3000/api/tp2/shows/comments/new_comment",
          requestBody
        )
        .then((response) => response)
        .catch((error) => console.log(error));
    },
    submit() {
      if(this.user != null){
      if (!(this.rating == 0.0 || this.commentText == "")) {
        this.createComment();
        this.reset();
        setTimeout(() => this.insertComments(this.ID), 1500);
        this.$fire({
            title: "Review",
            text: "Review completed",
            type: "success",
            confirmButtonText: "Ok"
          })
      }else{
         this.$fire({
            title: "Review",
            text: "Review with unfilled data",
            type: "error",
            confirmButtonText: "Ok"
          })
      }
      }else{
        this.changeDialog();
      }
    },
    changeDialog() {
      this.dialog = !this.dialog;
    },
    imageSource(index){
      return require("../../public/personImages/" + index)
    },
  },
  created() {
    this.insertingComments();
  },
};
</script>

<style scoped>
</style>