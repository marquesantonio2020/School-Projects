<template>
  <v-stepper id="stepper" v-model="e1">
    <v-stepper-header id="header">
      <v-stepper-step color="red" dark :complete="e1 > 1" step="1">Products Edit</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step color="red" dark :complete="e1 > 2" step="2">Products Confirm</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step color="red" dark :complete="e1 > 3" step="3">Email</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step color="red" dark step="4">Payment</v-stepper-step>
    </v-stepper-header>

    <v-stepper-content step="1">
      <template>
        <v-container>
          <v-list v-if="shoppingCart != null" two-line>
            <v-list-item id="item" v-for="(line, index) in shoppingCart" :key="index">
              <v-row>
                <v-avatar tile height="120px" width="200px">
                  <img contain :src="imageSource(index)" alt />
                </v-avatar>

                <v-list-item-content>
                  <v-list-item-title>Show: {{ line.showName }}</v-list-item-title>
                  <v-list-item-title>Date: {{ line.date }} Time: {{line.showTime}}</v-list-item-title>
                  <v-list-item-title>Price: {{ line.price }} €</v-list-item-title>
                </v-list-item-content>

                <div style="display: flex; flex-direction:row; margin-top: 2%;">
                  <v-text-field
                    type="number"
                    min="1"
                    v-model="quantity[index]"
                    @change="modified(index)"
                    label="Quantity:"
                  ></v-text-field>
                </div>

                <v-list-tile-action style="    margin-top: 3%;">
                  <v-btn class="item-close" @click="remove(index)" icon>
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-row>
            </v-list-item>
            <v-divider></v-divider>
          </v-list>
          <v-list v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>No products</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-container>
      </template>

      <v-btn
        style="margin: 1%"
        color="secundary"
        dark
        @click="changeScreenCheckTickets(2)"
      >Go to Confirm Products</v-btn>
    </v-stepper-content>
    <v-stepper-items>
      <v-stepper-content step="2">
        <template>
          <v-container>
            <v-list v-if="shoppingCart != null" two-line>
              <v-list-item id="item" v-for="(line, index) in shoppingCart" :key="index">
                <v-avatar tile height="120px" width="200px">
                  <img contain :src="imageSource(index)" alt />
                </v-avatar>

                <v-list-item-content>
                  <v-list-item-title>Show: {{ line.showName }}</v-list-item-title>
                  <v-list-item-title>Date: {{ line.date }} Time: {{line.showTime}}</v-list-item-title>
                </v-list-item-content>

                <v-list-tile>
                  {{ line.price }} x {{line.quantity}} =
                  {{ line.subtotal }} €
                </v-list-tile>
              </v-list-item>
              <v-divider></v-divider>
            </v-list>
            <v-list v-else>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>No products</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-list-item v-if="shoppingCart != null">
              <v-list-item-content>
                <v-list-item-title>Total:</v-list-item-title>
                <v-list-item-subtitle>{{ shoppingCartTotal }} €</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-container>
        </template>

        <v-btn
          style="margin: 1%"
          color="secundary"
          dark
          @click="changeScreen(3)"
        >Go to Email Definition</v-btn>
        <v-btn style="margin: 1%" @click="e1 = 1" text>Back</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-item-group v-model="emailValue">
          <v-container>
            <v-row style="justify-content: center;">
              <v-item :key="1" v-slot="{ active, toggle }">
                <v-card
                  :color="active ? 'red' : ''"
                  dark
                  @click="toggle"
                  style="padding: 5%; margin: 1%"
                >
                  <v-card-item>
                    <v-card-title>Add Email</v-card-title>
                    <v-divider></v-divider>
                    <v-card-subtitle>
                      <v-text-field type="email" color="red" label="Email"></v-text-field>
                    </v-card-subtitle>
                  </v-card-item>
                </v-card>
              </v-item>
              <v-item :key="2" v-slot="{ active, toggle }">
                <v-card
                  :color="active ? 'red' : ''"
                  dark
                  style="padding: 5%; margin: 1%"
                  @click="toggle"
                >
                  <v-card-item>
                    <v-card-title>User Email</v-card-title>
                    <v-divider></v-divider>
                    <v-card-subtitle style="font-size: 100%">{{ user[0].email }}</v-card-subtitle>
                  </v-card-item>
                </v-card>
              </v-item>
            </v-row>
          </v-container>
        </v-item-group>

        <v-btn
          style="margin: 1%"
          color="secundary"
          dark
          @click="changeScreenVerified(4)"
        >Go to Payment</v-btn>

        <v-btn style="margin: 1%" @click="e1 = 2" text>Back</v-btn>
      </v-stepper-content>

      <v-stepper-content step="4" class="payment_container">
        <v-card style="border: 2px solid rgba(0,0,0, 0.2);">
          <v-tabs color="red" v-model="tabs" fixed-tabs style="margin-top: 1rem;">
            <v-tab href="#mobile-tabs-5-1" class="primary--text">
              <v-img contain src="../../public/mbway.png"></v-img>
            </v-tab>

            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#mobile-tabs-5-2" class="primary--text">
              <v-img contain src="../../public/mbref.png"></v-img>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tabs" style="margin-top: 1rem;">
            <v-tab-item :key="1" :value="'mobile-tabs-5-1'">
              <v-form>
                <v-card flat>
                  <v-card-item>
                    <v-card-subtitle>
                      Total:
                      {{ shoppingCartTotal }} €
                      <v-text-field
                        v-model="numb"
                        ref="numb"
                        :rules="[
                          (numb) => !!numb || 'This field is required',
                          (numb) =>
                            !(numb.length > 9 || numb.length < 9) ||
                            'Phone Number must have 9 numbers',
                        ]"
                        type="number"
                        color="red"
                        label="Phone Number"
                        hint="9 numbers please"
                        required
                        placeholder="999999999"
                        style="width: 12rem; margin-left: auto; margin-right: auto;"
                      ></v-text-field>
                    </v-card-subtitle>
                  </v-card-item>
                </v-card>
                <p style="color: red;">{{error}}</p>
                <v-btn
                  style="margin-bottom: 1%"
                  color="secundary"
                  @click="confirmMbWay()"
                  dark
                >Confirm</v-btn>
              </v-form>
            </v-tab-item>
            <v-tab-item :key="2" :value="'mobile-tabs-5-2'">
              <v-form>
                <v-card flat>
                  <v-card-item>
                    <v-card-subtitle>
                      Entity: 13475
                      <p>Reference: {{ this.ref }}</p>
                      <p>Total: {{ shoppingCartTotal }} €</p>
                    </v-card-subtitle>
                  </v-card-item>
                </v-card>
                <v-btn
                  style="margin-bottom: 1%"
                  color="secundary"
                  @click="confirmMbRef()"
                  dark
                >Confirm</v-btn>
              </v-form>
            </v-tab-item>
          </v-tabs-items>
        </v-card>  
        <v-btn style="margin: 1%" @click="e1 = 3" text>Back</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import Vue from "vue";
import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);

export default {
  data() {
    return {
      tabs: null,
      e1: 1,
      ref: null,
      numb: null,
      quantity: [],
      emailValue: 1,
      email: null,
      error: null,
    };
  },
  name: "Modal",
  components: {},
  methods: {
    ...mapActions({
      insertCart: "cart/fetchProducts",
      updateCart: "cart/insertCart",
    }),
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
            this.updateCart(temp);
            if (this.shoppingCart.length == 0) {
              this.$router.push({ path: "/" });
            }
          }
        })
        .catch((error) => console.log(error));
    },
    imageSource(index) {
      return require("../../public/images/" + this.shoppingCart[index].image);
    },
    generateRef() {
      this.ref =
        Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
    },
    removeAll() {
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
            this.updateCart(null);
          }
        })
        .catch((error) => console.log(error));
    },
    insertPurchaseLine(idPaymentMethod) {
      const body = {
        shops: this.shoppingCart,
        idPaymentMethod: idPaymentMethod,
        total: this.shoppingCartTotal,
        idUser: this.shoppingCart[0].idUser,
      };
      this.$axios
        .post(
          `http://localhost:3000/api/tp2/user/purchase/newPurchaseLineAll`,
          body
        )
        .then((response) => response)
        .then((data) => {
          if (data.statusText === "OK") {
            console.log("Inseriu Linhas");
          }
        })
        .catch((error) => console.log(error));
    },

    insertPurchase(paymentMethod) {
      const requestBody = {
        idUser: this.shoppingCart[0].idUser,
      };
      this.$axios
        .post(
          `http://localhost:3000/api/tp2/user/purchase/newPurchaseAll`,
          requestBody
        )
        .then((response) => response)
        .then((data) => {
          if (data.statusText === "OK") {
            console.log("Inseriu Compra");
            this.insertPurchaseLine(paymentMethod);
          }
        })
        .catch((error) => console.log(error));
    },
    confirmMbWay() {
      if (this.numb != null) {
        this.error = ''
        if (this.numb.length != 9) {
          alert("Error Number");
          return;
        } else {
          var idPaymentMethod = 1;
          this.insertPurchase(idPaymentMethod);
          this.removeAll();
          this.insertCart(null);
          this.$router.push({ path: "/" });
          this.$fire({
            title: "Payment",
            text: "Transaction Completed",
            type: "success",
            confirmButtonText: "Confirm",
          });
        }
      }else{
        this.error = 'Phone number missing.'
      }
    },
    confirmMbRef() {
      var idPaymentMethod = 2;
      this.insertPurchase(idPaymentMethod);
      this.removeAll();
      this.insertCart(null);
      this.$router.push({ path: "/" });
      this.$fire({
        title: "Payment",
        text: "Transaction Completed",
        type: "success",
        confirmButtonText: "Confirm",
      });
    },
    getQuantities() {
      this.quantity = this.shoppingCart.map((element) => {
        return element.quantity;
      });
    },
    modified(index) {
      const requestBody = {
        idUser: this.shoppingCart[index].idUser,
        idShow: this.shoppingCart[index].idShow,
        idDate: this.shoppingCart[index].idDate,
        price: this.shoppingCart[index].price,
        quantity: parseInt(this.quantity[index]),
      };
      this.shoppingCart[index].quantity = parseInt(this.quantity[index]);
      this.shoppingCart[index].subtotal =
        parseInt(this.quantity[index]) * this.shoppingCart[index].price;
      this.shoppingCart[index].subtotal = parseFloat(
        this.shoppingCart[index].subtotal
      ).toFixed(2);
      this.updateCart(this.shoppingCart);

      this.$axios
        .post(
          "http://localhost:3000/api/tp2/user/purchase/update_purchase_templine",
          requestBody
        )
        .then((response) => response)
        .catch((error) => console.log(error));
    },
    changeScreen(id) {
      this.e1 = id;
    },
    changeScreenCheckTickets(id) {
      var message = "";
      var active = false;
      this.shoppingCart.map((element) => {
        if (element.quantity > element.availableTickets) {
          message += element.showName + ", ";
          active = true;
        }
        if (active) {
          this.$fire({
            title: "Error Quantity",
            text: "Unavailable quantity in: " + message + "please correct.",
            type: "error",
            confirmButtonText: "Confirm",
          });
        } else {
          this.e1 = id;
        }
      });
    },
    changeScreenVerified(id) {
      if (this.emailValue == null) {
        this.$fire({
          title: "Email Definition",
          text: "Define one mail to send products",
          type: "error",
          confirmButtonText: "Confirm",
        });
      } else {
        if (this.emailValue == 1) {
          this.email = this.user[0].email;
        }
        console.log(this.email);
        this.e1 = id;
      }
    },
  },
  computed: {
    ...mapGetters({
      user: "auth/userData",
      shoppingCart: "cart/getPurchaseLine",
      shoppingCartTotal: "cart/getTotal",
    }),
    insertQuantities() {
      return this.quantity;
    },
  },
  created() {
    this.generateRef();
    this.getQuantities();
  },
};
</script>


<style scoped>
#item {
  margin-bottom: 1%;
  margin-bottom: 1.2rem;
  height: 120px;
  box-shadow: 0px 0px 0px 0.2px #888888;
}
#header {
  height: 72px;
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);
}

#stepper {
  margin: 3%;
  padding: 2%;
}

.v-stepper--is-booted .v-stepper__content,
.v-stepper--is-booted .v-stepper__wrapper {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  overflow: inherit !important;
}

@media (min-width: 1264px) {
  .container {
    max-width: 1185px;
  }
}
@media (min-width: 960px) {
  .container {
    max-width: 900px;
  }
}

.payment_container {
  width: 900px;
  margin-left: auto;
  margin-right: auto;
}
</style>
