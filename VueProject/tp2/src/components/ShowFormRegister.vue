<template>
  <v-container>
    <br>
    <br>
    <h1 >{{Text}}</h1>

    <v-form ref="form" lazy-validation>
      <v-stepper v-model="e6" vertical>
        <v-stepper-step color="red" dark :complete="e6 > 1" step="1">
          Show Information
          <small>Show Name as short as possible</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-text-field
            v-model="showData.showName"
            label="Show Name"
            
            style="margin-top: 3%"
          ></v-text-field>
          <v-container class="combobox_container">
            <v-combobox
              v-model="selections.selectionLocation"
              :items="items.itemsLocation"
              label="Location"
              
              style="margin-top: 3%"
            ></v-combobox>
            <v-combobox
              v-model="selections.selectionType"
              :items="items.itemsType"
              label="Type"
              
              style="margin-top: 3%"
            ></v-combobox>
          </v-container>
          <v-container class="combobox_container">
            <v-combobox
              v-model="selections.selectionRating"
              :items="items.itemsRating"
              label="Rating"
              
            ></v-combobox>
            <v-combobox
              v-model="selections.selectionSpotlight"
              :items="items.itemsSpotlight"
              label="Is Spotlight?"
              
            ></v-combobox>
          </v-container>
          <v-textarea
            v-model="showData.showDescription"
            outlined
            name="input-7-4"
            label="Show description"
          ></v-textarea>
          <v-btn rounded color="red" dark @click="e6=2" style="margin-bottom: 1%">Continue</v-btn>
          <v-btn text style="margin-bottom: 1%" @click="goToHome()">Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-step color="red" dark :complete="e6 > 2" step="2">Specify quantities</v-stepper-step>

        <v-stepper-content step="2">
          <v-container class="combobox_container">
            <v-text-field
            type="number"
              v-model="showData.price"
              label="Price"
              
              style="margin-top: 3%"
            ></v-text-field>
            <v-text-field
            type="number"
              v-model="showData.availableTickets"
              label="Available Tickets"
              
              style="margin-top: 3%"
            ></v-text-field>
          </v-container>
          <v-btn rounded color="red" dark @click="e6=3" style="margin-bottom: 1%">Continue</v-btn>
          <v-btn text style="margin-bottom: 1%" @click="e6=1">Back</v-btn>
        </v-stepper-content>

        <v-stepper-step color="red" dark :complete="e6 > 3" step="3">Select dates</v-stepper-step>

        <v-stepper-content step="3">
          <v-container class="combobox_container">
            <v-menu
              v-model="dateShow"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateForShow"
                  label="Select a date for the show"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  style="margin-top: 3%"
                ></v-text-field>
              </template>
              <v-date-picker color="red" v-model="dateForShow" @input="dateShow = false"></v-date-picker>
            </v-menu>
            <v-menu
            v-model="datePurchase"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateForPurchase"
                label="Limit for purchase"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                style="margin-top: 3%"
              ></v-text-field>
            </template>
            <v-date-picker color="red" v-model="dateForPurchase" @input="datePurchase= false"></v-date-picker>
          </v-menu>
           

          </v-container>
          <v-container class="combobox_container">
           <v-menu
              v-model="timeShow"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
            <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="showData.showTime"
              label="Time of the show"
              prepend-icon="mdi-clock-time-five-outline"
              v-bind="attrs"
              v-on="on"
              style="max-width: 10rem;"

            ></v-text-field>
            </template>
            <v-time-picker color="red" format="24hr" v-model="showData.showTime" @input="timeShow = false"></v-time-picker>
            </v-menu>
            <v-btn rounded color="red" dark @click="addHour()" style="margin-bottom: 1%">Add</v-btn>
          <div v-if="typedHours.length > 0" style="display: contents;">
            <div v-for="(hour, index) in typedHours" :key="index">
            <p @click="popHour(index)">{{hour}}</p>
            </div>
          </div>
          
          </v-container>

          <v-btn rounded color="red" dark @click="e6=4" style="margin-bottom: 1%">Continue</v-btn>
          <v-btn text style="margin-bottom: 1%" @click="e6=2">Back</v-btn>
        </v-stepper-content>

        <v-stepper-step color="red" dark step="4">
          Choose images
          <small>Horizontal (left) and Vertical (right)</small>
        </v-stepper-step>
        <v-stepper-content step="4">
          <v-container class="combobox_container">
            <v-file-input
              label="Add new image (Horizontal)"
              
              prepend-icon="mdi-camera"
              v-model="showData.imageLocationHorizontal"
              style="margin-top: 3%"
            ></v-file-input>
            <v-file-input
              label="Add new image (Vertical)"
              
              prepend-icon="mdi-camera"
              v-model="showData.imageLocationVertical"
              style="margin-top: 3%"
            ></v-file-input>
          </v-container>
          <v-btn rounded color="red" dark @click="submit()" style="margin-bottom: 1%">Submit</v-btn>
          <v-btn text style="margin-bottom: 1%" @click="e6=3">Back</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-form>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      bottom
      right
    >{{text}}</v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "ShowRegister",
  props: {
    Text: String,
  },
  data: () => ({
    e6: 1,
    typedHours: [],
    showData: {
      showName: "",
      showDate: "",
      showDescription: "",
      availableTickets: null,
      price: null,
      idLocation: null,
      idShowType: null,
      idRating: 0,
      imageLocationHorizontal: "",
      imageLocationVertical: "",
      isSpotlight: 0,
      showTime: "",
      snackbar: false,
      timeout: 2000,
      text: ""
    },
    items: {
      itemsLocation: [],
      itemsRating: [],
      itemsType: [],
      itemsSpotlight: ["Yes", "No"],
    },
    selections: {
      selectionLocation: [],
      selectionRating: [],
      selectionType: [],
      selectionSpotlight: [],
    },
    temp: null,
    dateForShow: new Date().toISOString().substr(0, 10),
    dateShow: false,
    timeShow: false,
    dateForPurchase: new Date().toISOString().substr(0, 10),
    datePurchase: false,
    //Rules for each field of the form -> helps validate and warn the users input before submiting
    rules: {
      required: (value) => !!value || "Required",
    },
  }),

  //When component is mounted -> Fetches all data from different tables to insert into a combobox
  mounted() {
    this.getLocations();
    this.getShowTypes();
    this.getShowRatings();
  },
  methods: {
    getLocations() {
      this.$axios
        .get(`http://localhost:3000/api/tp2/locations`)
        .then((response) => {
          response.data.forEach((element) => {
            this.items.itemsLocation.push(element.building);
          });
        })
        .catch((error) => console.log(error));
    },
    getShowTypes() {
      this.$axios
        .get(`http://localhost:3000/api/tp2/types`)
        .then((response) => {
          response.data.forEach((element) => {
            this.items.itemsType.push(element.type);
          });
        })
        .catch((error) => console.log(error));
    },
    getShowRatings() {
      this.$axios
        .get(`http://localhost:3000/api/tp2/ratings`)
        .then((response) => {
          response.data.forEach((element) => {
            this.items.itemsRating.push(element.rating);
          });
        })
        .catch((error) => console.log(error));
    },
    submit() {
      this.getIdLocation();
      this.getIdRating();
      this.getIdType();

      setTimeout(() => this.createShow(), 1000);
    },
    getIdSpotlight() {
      return this.selections.selectionSpotlight === "Yes" ? 1 : 0;
    },
    getIdRating() {
      var newRatingRequest = this.selections.selectionRating.replace(
        "/",
        "%2F"
      );
      //console.log(newRatingRequest);

      this.$axios
        .get(`http://localhost:3000/api/tp2/rating/` + newRatingRequest)
        .then((response) => {
          response.data.forEach((element) => {
            this.showData.idRating = element.idRating;
          });
        })
        .catch((error) => {
          console.log(error)
           this.$refs["form"].reset();
          this.text = "Empty inputs"
          this.snackbar=true;
          });
    },
    getIdType() {
      this.$axios
        .get(
          `http://localhost:3000/api/tp2/type/` + this.selections.selectionType
        )
        .then((response) => {
          response.data.forEach((element) => {
            this.showData.idShowType = element.idShowType;
          });
        })
        .catch((error) => {
          console.log(error)
           this.$refs["form"].reset();
          this.text = "Empty inputs"
          this.snackbar=true;
          });
    },
    getIdLocation() {
      this.$axios
        .get(
          `http://localhost:3000/api/tp2/location/` +
            this.selections.selectionLocation
        )
        .then((response) => {
          response.data.forEach((element) => {
            this.showData.idLocation = element.idLocation;
          });
        })
        .catch((error) => {
          console.log(error)
           this.$refs["form"].reset();
          this.text = "Empty inputs"
          this.snackbar=true;
          });
    },
    createShow() {
      const requestBody = {
        showName: this.showData.showName,
        showDescription: this.showData.showDescription,
        price: this.showData.price,
        availableTickets: this.showData.availableTickets,
        idRating: this.showData.idRating,
        idShowType: this.showData.idShowType,
        idLocation: this.showData.idLocation,
        limitPurchaseDate: this.dateForPurchase,
        showDate: this.dateForShow,
        isSpotlight: this.getIdSpotlight(),
        image: this.showData.imageLocationHorizontal.name,
        imageVert: this.showData.imageLocationVertical.name,
        showTime: this.typedHours,
      };

      //console.log(requestBody);

      this.$axios
        .post("http://localhost:3000/api/tp2/show/new_show", requestBody)
        .then((response) => {
          this.$refs["form"].reset();
          this.text = "Show inserted with success"
          this.snackbar=true;
          this.e6 = 1;
          this.typedHours = [];
        })
        .catch((error) => {
          console.log(error)
          this.$refs["form"].reset();
          this.text = "Empty inputs"
          this.snackbar=true;
        });
    },
    goToHome() {
      this.$router.push({ path: "/admin" });
    },
    addHour(){
      console.log(this.typedHours.indexOf(this.showData.showTime))
      if(this.typedHours.indexOf(this.showData.showTime) !== -1){
        return;
      }
      this.typedHours.push(this.showData.showTime)
    },
    popHour(index){
      this.typedHours.splice(index, 1)
    }
  },
};
</script>

<style scoped>
.container {
  padding: 0px;
  width: 45%;
}

.combobox_container {
  width: 100%;
  display: flex;
}

.combobox_container > .v-input:nth-child(1n) {
  padding: 0 0px;
  margin-right: 5px !important;
  width: 50% !important;
}

.combobox_container > .v-input:nth-child(2n) {
  padding: 0 0px;
  margin-left: 10px !important;
  width: 50% !important;
}

.container > h1 {
  margin-bottom: 15px;
}

p{
  padding: 8px;
    margin-left: 2%;
    cursor: pointer;
}

p:hover{
  text-decoration: underline;
}

</style>