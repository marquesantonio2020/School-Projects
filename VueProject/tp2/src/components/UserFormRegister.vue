<!--Component for a register form to create a new user-->
<template>
  <v-container>
    <br>
    <br>
    <h1>{{Text}}</h1>
    <v-form ref="form" lazy-validation>
      <v-stepper v-model="e6" vertical>
        <v-stepper-step color="red" dark :complete="e6 > 1" step="1">
          Personal Information
          <small>All fields are required</small>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-text-field
          style="margin-top: 1%;"
            v-model="userData.name"
            label="Name"
            :rules="[rules.required]"
            hint="Example: Jonh Doe"
            
          ></v-text-field>
          <v-combobox v-model="selection" :items="items" label="City" ></v-combobox>
          <v-text-field
            v-model="userData.email"
            label="Email"
            :rules="[rules.required, rules.emailValidation]"
            hint="Example: example@gmail.com"
            
          ></v-text-field>
          <v-text-field
            v-model="userData.nif"
            label="NIF"
            :rules="[rules.required, rules.nifValidation]"
            hint="Example: 000000000"
            
          ></v-text-field>
          <v-file-input
              label="Add new image"
              prepend-icon="mdi-camera"
              v-model="userData.image"
              style="margin-top: 3%"
            ></v-file-input>
          <v-btn rounded color="red" dark @click="e6=2" style="margin-bottom: 1%">Continue</v-btn>
          <v-btn text style="margin-bottom: 1%" @click="goToHome()">Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-step color="red" dark :complete="e6 > 2" step="2">
          Account Information
          <small>Make sure to have a strong password</small>
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-text-field
          style="margin-top: 1%;"
            v-model="userData.username"
            label="Username"
            :rules="[rules.required, rules.minUser]"
            hint="Example: username_example"
            
          ></v-text-field>
          <v-text-field
            v-model="userData.password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.minPassword]"
            :type="showPassword ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 8 characters"
            @click:append="showPassword = !showPassword"
            
          ></v-text-field>
          <p id="error" v-if="error">{{ error }}</p>
          <v-btn rounded color="red" dark @click="register()" style="margin-bottom: 1%">Submit</v-btn>
          <v-btn text style="margin-bottom: 1%" @click="e6=1">Cancel</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-form>
  </v-container>
</template>

<script>
export default {
  props: {
    Text: String,
  },
  data: () => ({
    e6: 1,
    userData: {
      username: "",
      password: "",
      name: "",
      nif: null,
      email: "",
      idZipCode: "",
      idUserType: null,
      image: null,
    },
    error: "",
    errors: {
      user: "",
      pass: "",
      email: "",
      nif: "",
      combo: "",
      name: "",
    },
    items: [],
    selection: [],
    showPassword: false,
    //Rules for each field of the form -> helps validate and warn the users input before submiting
    rules: {
      required: (value) => !!value || "Required.",
      minPassword: (value) =>
        value.length >= 8 || "Minimum 8 characters for the password",
      minUser: (value) =>
        value.length >= 4 || "Minimum 4 characters for the username",
      nifValidation: (value) => {
        if (!parseInt(value)) {
          return "NIF needs to be numeric.";
        } else {
          if (value < 100000000 || value > 999999999) {
            return "Invalid NIF.";
          }
        }
      },
      emailValidation: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
    },
  }),
  //When component is mounted -> Fetches all zipcodes to insert into a combobox
  mounted() {
    this.$axios
      .get(`http://localhost:3000/api/tp2/zipcode`)
      .then((response) => {
        response.data.forEach((element) => {
          var string = element.idZipCode + " - " + element.city;
          this.items.push(string);
        });
      })
      .catch((error) => console.log(error));
  },
  methods: {
    //Executes the register -> uses api to register a new user
    register() {
      this.userData.image = this.userData.image.name;
      var route = "";
      if (this.checkIfRequiredAreFill()) {
        const zipcode = this.selection.split(" - ");
        this.userData.idZipCode = zipcode[0];
        
        if(localStorage.getItem('user')){
          this.userData.idUserType = 2
          route = '/admin'
        }else{
          this.userData.idUserType = 1
          route = '/'
        }
        this.$axios
          .post(
            `http://localhost:3000/api/tp2/user/registration`,
            this.userData
          )
          .then((response) => {
            if (typeof response.data === "string") {
              this.error = response.data;
            } else {
              this.$router.push({ path: route });
              this.$fire({
          title: "Registration",
          text: "New user created successfully",
          type: "success",
          confirmButtonText: "Confirm",
        });
            }
          })
          .catch((error) => console.log(error));
      } else {
        this.error = "All fields are required";
      }
    },
    goToHome() {
      this.$router.push({ path: "/admin" });
    },
    checkIfRequiredAreFill() {
      if (
        this.userData.username &&
        this.userData.password &&
        this.userData.nif &&
        this.userData.name &&
        this.userData.email &&
        this.selection
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.container {
  padding: 0px;
}

.container > h1 {
  margin-bottom: 15px;
}

#error {
  margin-bottom: 10px;
  color: red;
}
</style>