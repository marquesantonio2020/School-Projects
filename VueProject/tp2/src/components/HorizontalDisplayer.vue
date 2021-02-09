<template>
  <v-container v-if="showItems!==null" id="horizontalDisplay">
    <v-sheet class="mx-auto" elevation="0">
      <v-slide-group show-arrows>
        <v-slide-item v-for="(show, index) in showItems" :key="index" :loading="loading">
          <v-card >
            <template slot="progress">
              <v-progress-linear color="red" height="2" indeterminate></v-progress-linear>
            </template>

            <v-img max-height="200" :src="imageSource(index)" ></v-img>

            <v-card-title>{{show[0].item.showName}}</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0">
                <v-rating :value="show[0].item.valueRating" color="amber" dense half-increments readonly size="14"></v-rating>

                <div class="grey--text ml-6">{{show[0].item.valueRating}}</div>
              </v-row>
              
              <div align=left class="my-4">Price: {{show[0].item.price}} €</div>
              <div class="my-2 subtitle-1">{{show[0].item.type}} - {{show[0].item.rating}}</div>


              <div>
                Limite Purchase: {{show[0].item.limitPurchaseDate}}
                <br />
                Show Date: {{show[0].item.date}}
              </div>
            </v-card-text>
            <v-divider class="mx-12"></v-divider>

            <v-divider class="mx-12"></v-divider>

            <v-card-text>
              <v-chip-group
                v-model="selection[index]"
                active-class="red accent-4 white--text"
                column
              >
                <v-chip v-for="(hour, index) in show" :key="index">{{hour.item.showTime}}</v-chip>
              </v-chip-group>
            </v-card-text>

            <v-card-actions >
               <v-btn v-if="detectDate(show[0].item.limitPurchaseDate) > 0 && show[0].item.availableTickets > 0 " color="red lighten-2" text @click="purchase(show[0].item.idShow,index)">Add To Cart</v-btn>
               <v-spacer></v-spacer>
              <v-btn class="detail" color="red lighten-2" text :to="'/show/'+ show[0].item.idShow +'/show_info'">Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
    

    <login v-model="dialog"></login>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      bottom
      right
    >Product added to cart</v-snackbar>
  </v-container>
  <v-container v-else id="horizontalDisplay">
    No data spotlighted
  </v-container>
  
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapActions } from "vuex";
import Login from "@/components/Login.vue";
import Vue from "vue";
import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);
export default {
  name: "HorizontalDisplayer",
  components: {
    Login,
  },
  props: {
    URL: String,
    Color: String
  },
  name: "Horizontal Displayer",
  data: () => ({
    dialog: false,
    showItems: [],
    purchaseItem: {},
    items: [
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg",
      },
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg",
      },
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
      },
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
      },
    ],
    loading: false,
    selection: [],
    snackbar: false,
      timeout: 2000,
  }),
  created() {
    this.getShows();
  },
  computed: {
    ...mapGetters({
      user: "auth/userData",
      shoppingCart: "cart/getPurchaseLine",
    }),
    allShows() {
      return this.showItems;
    },
    style (){
      return this.Color
    }
  },
  methods: {
    ...mapActions({
      insertCart: 'cart/fetchProducts',
    }),
    //Inserts ticket into a shopping cart
    purchase(id, index){
      if (localStorage.getItem("user")) {
        if(this.showItems[id][this.selection[index]]!=null){
        this.loading = true;
        const selectedItem = this.showItems[id][this.selection[index]];
        const requestBody = {
          idShow: selectedItem.item.idShow,
          idUser: this.user[0].idUser,
          quantity: 1,
          subtotal: selectedItem.item.price,
          idDate: selectedItem.item.idDate,
        };
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
        }else{
          this.$fire({
            title: "Cart",
            text: "Select an hour to add show to cart",
            type: "error",
            confirmButtonText: "Confirm",
          });
        }
      } else {
        this.loading = true;
        this.dialog = !this.dialog;
        setTimeout(() => (this.loading = false), 2000);
      }
    },
    //Uses API to get all shows on the database
    getShows() {
      this.$axios
        .get(this.URL)
        .then((response) => response)
        .then((data) => {
          this.showItems = data.data;
          console.log(this.showItems)
        })
        .catch((error) => console.log(error));
    },
    imageSource(index){
      return require("../../public/images/" + this.showItems[index][0].item.image)
    },
    detectDate(showLimitDate){
      var now = new Date().getTime();
      var finalTime = [];
      finalTime = showLimitDate.split('-')
      finalTime[1] = finalTime[1] - 1;
      var limitDate = new Date(finalTime[0], finalTime[1], finalTime[2], '23', '59', '59', '59').getTime() 
      var tester = limitDate - now;
      return tester;
    }
  },
};
</script>

<style scoped>
#horizontalDisplay {
  display: block;
  max-width: 90%;
}
.v-card {
  max-width: 350px;
  float: left;
  margin: 0px 10px 10px 0px;
}

.v-card__title {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: 0.0125em;
    line-height: 2rem;
    height: 85px;
    word-break: normal;
}

.v-card:first-child{
  margin-left: 10px;
}

v-card:last-child{
  margin-right: 10px;
}
.v-application--is-ltr .v-card__actions > .v-btn.v-btn + .v-btn {
    margin-left: auto;
}

</style>