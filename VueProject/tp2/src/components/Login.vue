<!--Component that creates a popup window for the user to login-->
<template>
  <v-row justify="center">
    <v-dialog v-model="value" persistent max-width="600px">
      <v-card>
        <v-card-title id="cardTitle">
          <h1 class="headline">LOGIN</h1>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation>
              <v-text-field
              color="red"
                v-model="userData.username"
                label="Username"
                :rules="rules.require"
              ></v-text-field>

              <v-text-field
              color="red"
                v-model="userData.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.minPassword]"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                hint="At least 8 characters"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-form>
            <p id="error" v-if="error">{{ error }}</p>
            <v-btn rounded color="red" dark @click="submit()">Login</v-btn>
          </v-container>
          <small @click="close">
            <router-link style="color: red" to="/login/register">Don't have an account? Sign in here</router-link>
          </small>
        </v-card-text>
      </v-card>
      <button  @click.prevent="close" class="border-b border-teal font-semibold" id="close">Close</button>
    </v-dialog>
  </v-row>
</template>

<script>
//Imports getter and actions from the vuex store
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
export default {
  props: {
    Text: String,
  },
  data: () => ({
    userData: {
      username: "",
      password: "",
      idUserType: 1,
    },
    showPassword: false,
    //Validation rules for the forms fields
    rules: {
      required: (value) => !!value || "Required.",
      minPassword: (value) =>
        value.length >= 8 || "Minimum 8 characters for the password",
      minUser: (value) =>
        value.length >= 4 || "Minimum 4 characters for the username",
    },
  }),
  name: "Modal",
  props: {
    value: {
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      error: "auth/hasError",
      user: "auth/userData",
    }),
  },
  methods: {
    close() {
      this.$emit("input", !this.value);
    },
    ...mapActions({
      login: "auth/login",
      insertCart: "cart/fetchProducts",
    }),
    //Inserts to the shopping cart all items that a certain user has after login
    insertingShoppingCart() {
      if (this.user[0]) {
        this.insertCart(this.user[0].idUser);
      }
    },
    checkUserType() {
      if (localStorage.getItem("user")) {
        if (this.user[0].idUserType === 2) {
          console.log("here");
          this.$router.push({ path: "/admin" });
        } else {
          this.insertingShoppingCart();
        }
      }
    },
    //Submits the login credentials.
    submit() {
      this.login(this.userData);
      setTimeout(() => this.checkUserType(), 1000);
      setTimeout(() => {if(localStorage.getItem('user')){
        this.$emit("input", !this.value);
      }}, 1000)      
      
    },
  },
};
</script>


<style lang="css" scoped>
#cardTitle {
  justify-content: center;
}

.headline {
  font-weight: bold;
}

.headline,
#close,
.modal {
  color: rgba(0, 0, 0, 0.7);
}

button {
  background-color: white;
  padding: 5px;
}

.container {
  padding: 0px;
}

.container > h1 {
  margin-bottom: 15px;
}

.container > a {
  display: block;
  margin-top: 15px;
  color: grey;
}
#error {
  margin-bottom: 10px;
  color: red;
}
</style>