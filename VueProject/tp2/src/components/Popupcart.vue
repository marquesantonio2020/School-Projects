<!--Component to create a window popup regarding the itens existing on the shopping cart-->
<template>
  <div class="text-center">
    <v-menu v-model="value" :position-x="1500" :position-y="60">
      <v-card>
        <v-list v-if="shoppingCart !== null">
          <v-list-item id="item" v-for="(line,index) in shoppingCart" :key="index">
            <v-avatar tile height="120px" width="200px">
              <img contain :src="imageSource(index)" alt />
            </v-avatar>

            <v-list-item-content>
              <v-list-item-title>Show: {{line.showName}}</v-list-item-title>
              <v-list-item-subtitle>Date: {{line.date}} | Time: {{line.showTime}}</v-list-item-subtitle>
              <v-list-item-subtitle>{{line.price}} x {{ line.quantity}} = {{ line.subtotal }} €</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn class="item-close" @click="remove(index)" icon>
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
        
        <v-list v-else-if="shoppingCart === null || shoppingCart.length === 0">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>No products</v-list-item-title>
              <v-list-item-subtitle>Add products to shopping cart</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list-item v-if="shoppingCart !== null">
          <v-list-item-content>
            <v-list-item-title>Total:</v-list-item-title>
            <v-list-item-subtitle>{{shoppingCartTotal}} €</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <v-btn v-if="shoppingCart != null" color="red" dark @click="removeAll()">Clean Cart</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="shoppingCart != null"
            color="secundary"
            dark
            to="/checkout"
            @click="close()"
          >CheckOut</v-btn>
          <v-btn @click="close()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      bottom
      right
    >{{text}}</v-snackbar>
  </div>
</template>

<script>
//Imports getter and actions from the vuex store
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    Text: String,
  },
  name: "Modal",
  props: {
    value: {
      required: true,
    },
  },
  data: () => ({
    text: "",
    snackbarx: false,
    snackbar: false,
      timeout: 2000,
  }),
  computed: {
    ...mapGetters({
      shoppingCart: "cart/getPurchaseLine",
      shoppingCartTotal: "cart/getTotal",
    }),
  },
  methods: {
    ...mapActions({
      updateCart: "cart/insertCart",
    }),
    close() {
      this.$emit("input", !this.value);
    },
    remove(index) {
      const requestBody = {
        idUser: this.shoppingCart[index].idUser,
        idShow: this.shoppingCart[index].idShow,
        idDate: this.shoppingCart[index].idDate,
      };
      this.$axios
        .post(
          `http://localhost:3000/api/tp2/user/purchase/deleteTempLine`,
          requestBody
        )
        .then((response) => response)
        .then((data) => {
          if (data.statusText == "OK") {
            const removedItem = this.shoppingCart.splice(index, 1)[0];
            var temp = this.shoppingCart.map((element) => {
              if (element != removedItem) {
                return element;
              }
            });
            
            if(this.shoppingCart.length == 0){
              this.text = "Cart successfully cleaned"
              this.snackbar=true;
              this.updateCart(null);
            }else{
              this.text = "Cart item successfully removed"
              this.snackbar=true;
              this.updateCart(temp);
            }
            
          }
        })
        .catch((error) => console.log(error));
    },
    removeAll() {
      console.log(this.shoppingCart[0].idUser);
      const requestBody = {
        idUser: this.shoppingCart[0].idUser,
      };
      this.$axios
        .post(
          `http://localhost:3000/api/tp2/user/purchase/deleteAllLines`,
          requestBody
        )
        .then((response) => response)
        .then((data) => {
          if (data.statusText === "OK") {
            this.text = "Cart successfully cleaned"
            this.snackbar=true;
            this.updateCart(null);
          }
        })
        .catch((error) => console.log(error));
    },
    imageSource(index) {
      return require("../../public/images/" +
        this.shoppingCart[index].image);
    },
  },
};
</script>

<style scoped>
#item {
  margin-bottom: 2%;
  box-shadow: 0px 0px 0px 0.2px #888888;
}

.v-list {
    padding: 0px 0px 8px 0px !important;
}

.v-list-item {
    padding: 0px 16px 0px 0px !important;
}
</style>




