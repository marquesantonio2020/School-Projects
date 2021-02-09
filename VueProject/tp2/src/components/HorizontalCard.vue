<template>
  <v-container>
    <v-card v-model="show" class="mx-auto" max-width="344" outlined>
      <v-img heigth=400 width=400 :src="imageSource(index)" alt=""></v-img>
      <v-container>
        <v-card-item>
        <v-card-title class="mx-0">
          {{show[this.ID][0].item.showName }}
          <div>{{show[this.ID][0].item.type}} - {{show[this.ID][0].item.rating}}</div>
        </v-card-title>
        <v-row align="left" class="mx-3">
          <v-rating :value="show[this.ID][0].item.valueRating" color="amber" dense half-increments readonly size="14"></v-rating>
            <div class="grey--text ml-4">{{show[this.ID][0].item.valueRating}}</div>
        </v-row>

        <v-card-text>
          <v-row align="left" class="mx-2">
            Price: {{show[this.ID][0].item.price}} €
          </v-row>
        </v-card-text>
        <v-card-text class="my-0 mx-2 subtitle-1 sinopse">Sinopse</v-card-text>
        <v-card-text class="my-0 mx-2 ">{{show[this.ID][0].item.showDescription}}</v-card-text>
        <v-divider ></v-divider>
        <br>
        <timer style="width: 300px;
    margin: auto;"
          @changed="active"
         :endtime="show[this.ID][0].item.limitPurchaseDate"
         trans='{  
         "day":"Day",
         "hours":"Hours",
         "minutes":"Minutes",
         "seconds":"Seconds",
         "expired":"Event has been expired.",
         "running":"Till the end of event.",
         "upcoming":"Till start of event.",
         "status": {
            "expired":"Expired",
            "running":"Running",
            "upcoming":"Future"
           }}'
         ></timer>
         </v-card-item>
         <v-card-item v-if="status === 'running' || show[this.ID][0].item.availableTickets>0">
      <v-card-text class="mx-2">
        Availability
        </v-card-text>
        <v-card-text class="my-0">
        <v-chip-group v-model="selection[0]" active-class="red accent-4 white--text" column>
          <v-chip v-for="(hour, index) in show[this.ID]" :key="index">{{ hour.item.showTime }}</v-chip>
        </v-chip-group>
        <v-spacer></v-spacer>
        <v-card-actions v-if="status === 'running' && show[this.ID][0].item.availableTickets>0">
          <v-btn  color="red lighten-2" text @click="purchase()">Add To Cart</v-btn>
        </v-card-actions>
      </v-card-text>
      </v-card-item>
      </v-container>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      bottom
      right
    >Product added to cart</v-snackbar>
    <login v-model="dialog"></login>
  </v-container>
</template>

<script>
import Login from "@/components/Login.vue";
import Timer from "../components/Timer.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "horizontal card",
  props: {
    ID: String,
  },
  components: {
    Login,Timer
  },
  data: () => ({
    show: [],
    selection: [],
    dialog: false,
    status : null,
    snackbar: false,
      timeout: 2000,
  }),
  created() {
    this.getSingleShow();
  },
  computed: {
    ...mapGetters({
      user: "auth/userData",
      shoppingCart: "cart/getPurchaseLine",
    }),
    singleShow() {
      console.log(this.show);
      return this.show;
    },
  },
  methods: {
    ...mapActions({
      insertCart: 'cart/fetchProducts',
    }),
    getSingleShow() {
      this.$axios
        .get("http://localhost:3000/api/tp2/show/" + this.ID)
        .then((response) => response)
        .then((data) => {
          console.log(data.data);
          this.show = data.data;
        })
        .catch((error) => console.log(error));
    },
    purchase() {
      if(this.show[this.ID][this.selection[0]].item.availableTickets >= 1){
      if (localStorage.getItem("user")) {
        this.loading = true;
        const selectedItem = this.show[this.ID][this.selection[0]];
        const requestBody = {
          idShow: selectedItem.item.idShow,
          idUser: this.user[0].idUser,
          quantity: 1,
          subtotal: selectedItem.item.price,
          idDate: selectedItem.item.idDate,
        };
        console.log(requestBody);
        this.$axios
          .post(
            `http://localhost:3000/api/tp2/user/purchase/newTempLine`,
            requestBody
          )
          .then((response) => response)
          .then((data) => {
            if(data.statusText === "OK"){
              this.insertCart(this.user[0].idUser)
              this.snackbar=true;
            }
          })
          .catch((error) => console.log(error));

        setTimeout(() => (this.loading = false), 2000);
      } else {
        this.loading = true;
        this.dialog = !this.dialog;
        setTimeout(() => (this.loading = false), 2000);
      }
      }else{
        this.$fire({
            title: "Cart",
            text: "Tickets unavailable",
            type: "error",
            confirmButtonText: "Confirm",
          });
      }
    },
    imageSource(index){
      return require("../../public/images/" + this.show[this.ID][0].item.imageVert)
    },
    active (value) {
      this.status = value;
    }
  },
  
};
</script>

<style scoped>
#availability{
  display: flex;
  flex-direction: column;
}
.v-card {
  min-width: 100% !important;
  max-width: 100% !important;
  display: inline-flex;
  min-height: 35rem;
  margin-top: 5%;
}

.v-card__title {
  display: flex;
  word-break: break-all;
}
.v-card__title > div {
  margin-left: auto;
  font-size: small;
}
.v-card__text {
  display: flex;
  margin: 3% 0px 1% 0px;
  padding: 1%;
}
.v-card__text .sinopse {
  float: left;
}
.availibility {
  display: block;
  min-height: 0rem !important;
  min-width: 58.8% !important;
  margin-left: 31%;
  font-size: large !important;
  margin-top: 0%!important;
}

.availibility > .v-card__text {
  margin-top: 0px !important;
}

.v-application--is-ltr .v-card__actions > .v-btn.v-btn + .v-btn {
  margin-left: auto;
}

</style>