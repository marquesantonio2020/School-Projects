<template>
  <v-container v-if="visibleShows!==null" style="max-width: 87%;">
    
    <v-row>
      <template>
        <v-col v-for="(show, index) in visibleShows" :key="index" :loading="loading" cols="10" md="3">
          <v-sheet max-width="350px" elevation="2">
            <template slot="progress">
              <v-progress-linear color="red" height="10" indeterminate></v-progress-linear>
            </template>

            <v-img max-height="200" :src="imageSource(index)"></v-img>

            <v-card-title>{{show[0].item.showName}}</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0">
                <v-rating
                  :value="show[0].item.valueRating"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
                ></v-rating>
                <!--VER RATING-->

                <div class="grey--text ml-6">{{show[0].item.valueRating}}</div>
              </v-row>

              <div align="left" class="my-4">Price: {{show[0].item.price}} €</div>
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
               <v-btn v-if="detectDate(show[0].item.limitPurchaseDate) > 0 && show[0].item.availableTickets>0 " color="red lighten-2" text @click="purchase(show[0].item.idShow, index)">Add To Cart</v-btn>
               <v-spacer></v-spacer>
              <v-btn class="detail" color="red lighten-2" text :to="'/show/'+ show[0].item.idShow +'/show_info'">Details</v-btn>
            </v-card-actions>
          </v-sheet>
        </v-col>
      </template>
    </v-row>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      bottom
      right
    >Product added to cart</v-snackbar>

    <login v-model="dialog"></login>
    <v-pagination
    style="margin-top: 3%;"
      v-model="page"
      :length="numberPages"
      circle
      color="red lighten-2"
    ></v-pagination>
  </v-container>
  <v-container v-else>No data to show</v-container>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapActions } from "vuex";
import Login from "@/components/Login.vue";
export default {
  name: "VerticalDisplayer",
  components: {
    Login,
  },
  props: {
    URL: String,
    Color: String,
  },
  data: () => ({
    dialog: false,
    showItems: [],
    page: 1,
    numberPages: 0,
    purchaseItem: {},
    currentPage: 0,
    pageSize: 12,
    visibleShows: [],
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
  beforeMount() {
    this.getShows();
    setTimeout(() => (this.updateVisibleShows()), 1000)
  },
  computed: {
    ...mapGetters({
      user: "auth/userData",
      shoppingCart: "cart/getPurchaseLine",
    }),
    allShows() {
      //return this.showItems;
    },
    style() {
      return this.Color;
    },
  },
  watch: {
    page: function(){
      this.updatePage(this.page)
    }
  },
  methods: {
    ...mapActions({
      insertCart: "cart/fetchProducts",
    }),
    //Inserts ticket into a shopping cart
    purchase(id, index) {
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
            if (data.statusText === "OK") {
              this.insertCart(this.user[0].idUser);
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
          console.log(data.data)
          this.showItems = data.data;
        })
        .catch((error) => console.log(error));
      
    },
    imageSource(index) {
      return require("../../public/images/" +
        this.visibleShows[index][0].item.image);
    },
    detectDate(showLimitDate){
      var now = new Date().getTime();
      var finalTime = [];
      finalTime = showLimitDate.split('-')
      finalTime[1] = finalTime[1] - 1;
      var limitDate = new Date(finalTime[0], finalTime[1], finalTime[2], '23', '59', '59', '59').getTime() 
      //console.log(limitDate)
      //console.log(now)
      var tester = limitDate - now;
      //console.log(tester)
      return tester;
    },
    updatePage(pageNumber){
      this.currentPage = pageNumber-1;
      this.updateVisibleShows()
    },
    updateVisibleShows(){
      var tempArray = []
      tempArray = Object.values(JSON.parse(JSON.stringify(this.showItems)))
      tempArray = tempArray.reverse()
      this.numberPages = Math.ceil(tempArray.length / this.pageSize);
      this.visibleShows = tempArray.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize);
      //In case there are no more items left to page
      if(this.visibleShows.length == 0 && this.currentPage > 0){
        this.updatePage(this.currentPage - 1)
      }
    }
  },
};
</script>

<style scoped>
.v-card {
  max-width: 350px;
  float: left;
  margin: 0px 4.21rem 2rem 0px;
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

.v-application--is-ltr .v-card__actions > .v-btn.v-btn + .v-btn {
  margin-left: auto;
}

#showDisplay {
  margin-bottom: 20px;
  padding: 0px;
  display: block;
}
</style>