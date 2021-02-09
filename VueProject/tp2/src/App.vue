<template>
  <v-app>
    <v-app-bar
      v-if="user === null || user[0].idUserType === 1"
      app
      color="white"
    >
      <router-link to="/">
        <v-img
          src="@/assets/logo.png"
          max-height="100"
          max-width="100"
          contain
        ></v-img>
      </router-link>
      <v-spacer></v-spacer>

      <v-tabs centered class="ml-n9" color="red darken-1">
        <v-tab to="/">Home</v-tab>
        <v-tab to="/cinema_and_arts">{{ tabItems[0].type }}</v-tab>
        <v-tab to="/musics_and_festivals">{{ tabItems[1].type }}</v-tab>
        <v-tab to="/sports">{{ tabItems[2].type }}</v-tab>
      </v-tabs>

      <v-responsive min-width=20% >
        <v-autocomplete
          dense
          flat
          hide-details
          rounded
          solo-inverted
          v-model="model"
          :items="names"
          :loading="isLoading"
          :search-input.sync="search"
          color="white"
          hide-no-data
          hide-selected
          return-object
          prepend-icon="mdi-magnify"
          placeholder="Show search"
          @change="goToShow(model)"
          id="search"
        ></v-autocomplete>
      </v-responsive>

      <v-btn
        v-if="isAuthenticated && user[0].idUserType === 1"
        @click="changeCartDialog()"
        icon
      >
        <v-icon>mdi-cart-outline</v-icon>
        <span
          v-if="shoppingCart == null || shoppingCartTotal == null"
          class="btn-circle"
          >0</span
        >
        <span v-else class="btn-circle">{{ shoppingCartTotal }}</span>
      </v-btn>

      <span
        style="color: grey; font-size: 10px"
        v-if="user"
        class="btn-circle"
        @click="changeUserDialog()"
        >{{ user[0].name }}</span
      >

      <v-btn
        to="/purchases_table"
        v-if="isAuthenticated && user[0].idUserType === 1"
        icon
      >
        <v-icon>mdi-bag-carry-on-check</v-icon>
      </v-btn>

      <v-btn v-if="isAuthenticated" @click="submit()" href="#" icon>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn v-else @click="changeDialog()" icon>
        <v-icon>mdi-account-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-app-bar v-else app color="white">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

<router-link to="/admin">
      <v-img
        src="@/assets/logo.png"
        max-height="100"
        max-width="100"
        contain
      ></v-img>
</router-link>
      <v-spacer></v-spacer>

      <span
        style="color: grey; font-size: 10px"
        v-if="user"
        class="btn-circle"
        @click="changeUserDialog()"
        >{{ user[0].name }}</span
      >
      <v-btn v-if="isAuthenticated" @click="submit()" href="#" icon>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn v-else @click="changeDialog()" icon>
        <v-icon>mdi-account-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <login v-model="dialog"></login>

    <user-details v-if="isAuthenticated" v-model="userdialog" :USER="user[0]"></user-details>

    <popupcart v-model="cartdialog"></popupcart>
    <v-main>
      <router-view :key="$route.fullPath" @showLoading="showLoading"/>
    </v-main>

    <v-navigation-drawer v-model="drawer"  app>
      <v-list>
        <v-list-item @click="drawer = !drawer" :key="1" to="/admin">
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="drawer = !drawer" :key="2" to="/new_show">
          <v-list-item-content>
            <v-list-item-title>New Show</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="drawer = !drawer" :key="3" to="/table_information">
          <v-list-item-content>
            <v-list-item-title>All Shows</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <br />

    <v-footer id="footer" dark padless>
      <v-card width="100%" color="red" class="white--text text-center">
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            icon
          >
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          21674 - António José Ribeiro Marques
        </v-card-text>
        <v-card-text class="white--text pt-0">
          21751 - Nelson Filipe Faria Campinho
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} —
          <strong>Polytechnic Institute of Viana do Castelo</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>


<style lang="scss">
@import "https://unpkg.com/ionicons@4.2.2/dist/css/ionicons.min.css";
#search{
  font-size: 80%;
}
figure {
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 10px;
  margin-inline-end: 0;
}
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import { mapActions, mapGetters } from "vuex";
import Login from "@/components/Login.vue";
import Popupcart from "@/components/Popupcart.vue";
import UserDetails from "@/components/UserDetails.vue";
import Vue from "vue";
import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);

export default {
  components: {
    Login,
    Popupcart,
    UserDetails,
  },
  data() {
    return {
      dialog: false,
      cartdialog: false,
      userdialog: false,
      snackbardialog: false,
      tabItems: [],
      drawer: false,
      icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
      names: [],
    };
  },
  beforeMount: function () {
    this.getTabItems();
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      user: "auth/userData",
      shoppingCart: "cart/getPurchaseLine",
      shoppingCartTotal: "cart/getTotalProducts",
    }),
  },
  methods: {
    ...mapActions({
      logout: "auth/logout",
      clearCart: "cart/insertCart",
    }),
    submit() {
      if (this.user[0].idUserType === 1) {
        this.$fire({
          title: "Logout",
          text: "Logout sucess",
          type: "success",
          confirmButtonText: "Confirm",
          color: "red",
        });
        this.logout(null);
        this.clearCart(null);
      } else {
        this.logout(null);
        this.drawer = false;
        this.$fire({
          title: "Logout",
          text: "Logout sucess",
          type: "success",
          confirmButtonText: "Confirm",
          color: "red",
        });      
      }
      this.$router.push({ path: "/" });
    },
    changeDialog() {
      this.dialog = !this.dialog;
    },
    changeCartDialog() {
      this.cartdialog = !this.cartdialog;
    },
    changeUserDialog() {
      this.userdialog = !this.userdialog;
    },
    getTabItems() {
      this.$axios
        .get("http://localhost:3000/api/tp2/types")
        .then((response) => response)
        .then((data) => {
          this.tabItems = data.data;
        })
        .catch((error) => console.log(error));
    },
    goToShow(model) {
      var show = model.split(" - ")
      
      this.$router.push({
        path: "/show/" + show[0] + "/show_info",
      });
    },
  },
  created() {
    this.$axios
      .get("http://localhost:3000/api/tp2/shows/names")
      .then((response) => response)
      .then((data) => {
        var res = null;
        res = data.data;
        res.map(
          (element) => (this.names.push(element.idShow + " - " + element.showName))
        );
      })
      .catch((error) => console.log(error));
    0;
  },
};
</script>
