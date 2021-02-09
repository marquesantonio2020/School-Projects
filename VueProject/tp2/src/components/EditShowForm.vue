<template>
  <v-row justify="center">
    <v-dialog v-model="value" persistent max-width="600px">
      <v-card>
        <v-card-title id="cardTitle">
          <h1 class="headline">Edit Show</h1>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation>
              <fieldset>
                <legend>Show Information</legend>
                <v-text-field
                  v-model="editedShow.showName"
                  label="Show Name"
                  style="margin-top: 3%"
                ></v-text-field>
                <v-container class="combobox_container">
                  <v-combobox
                    v-model="editedSelections.selectionLocation"
                    :items="editedItems.itemsLocation"
                    label="Location"
                    style="margin-top: 3%"
                  ></v-combobox>
                  <v-combobox
                    v-model="editedSelections.selectionType"
                    :items="editedItems.itemsType"
                    label="Type"
                    style="margin-top: 3%"
                  ></v-combobox>
                </v-container>
                <v-container class="combobox_container">
                  <v-combobox
                    v-model="editedSelections.selectionRating"
                    :items="editedItems.itemsRating"
                    label="Rating"
                  ></v-combobox>
                  <v-combobox
                    v-model="editedSelections.selectionSpotlight"
                    :items="editedItems.itemsSpotlight"
                    label="Is Spotlight?"
                  ></v-combobox>
                </v-container>
                <v-textarea
                  v-model="editedShow.showDescription"
                  name="input-7-4"
                  label="Show description"
                ></v-textarea>
              </fieldset>
              <fieldset style="padding: 10px">
                <legend>Quantities</legend>
                <v-container class="combobox_container">
                  <v-text-field
                    v-model="editedShow.price"
                    label="Price"
                    type="number"
                    style="margin-top: 3%"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedShow.availableTickets"
                    label="Available Tickets"
                    type="number"
                    style="margin-top: 3%"
                  ></v-text-field>
                </v-container>
              </fieldset>
              <fieldset>
                <legend>Show Dates</legend>
                <v-container class="combobox_container">
                  <v-menu
                    v-model="editedDateShow"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="editedShow.date"
                        label="Select a date for the show"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        style="margin-top: 3%"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="red"
                      v-model="editedShow.date"
                      @input="editedDateShow = false"
                    ></v-date-picker>
                  </v-menu>

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
                        v-model="editedShow.showTime"
                        label="Time of the show"
                        prepend-icon="mdi-clock-time-five-outline"
                        v-bind="attrs"
                        v-on="on"
                        style="margin-top: 3%"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      color="red"
                      format="24hr"
                      v-model="editedShow.showTime"
                      @input="timeShow = false"
                    ></v-time-picker>
                  </v-menu>
                </v-container>
                <v-menu
                  v-model="editedDatePurchase"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedShow.limitPurchaseDate"
                      label="Limit for purchase"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="red"
                    v-model="editedShow.limitPurchaseDate"
                    @input="editedDatePurchase= false"
                  ></v-date-picker>
                </v-menu>
              </fieldset>

              <fieldset>
                <legend>Images</legend>
                <v-container class="combobox_container">
                  <v-file-input
                    label="Add new image (Horizontal)"
                    prepend-icon="mdi-camera"
                    v-model="editedShow.image"
                    :value="editedShow.image"
                    style="margin-top: 3%"
                  ></v-file-input>
                </v-container>
                <v-container class="combobox_container">
                  <v-file-input
                    label="Add new image (Vertical)"
                    prepend-icon="mdi-camera"
                    v-model="editedShow.imageVert"
                    :value="editedShow.imageVert"
                    style="margin-top: 3%"
                  ></v-file-input>
                </v-container>
              </fieldset>
            </v-form>
          </v-container>
        </v-card-text>
        <v-btn rounded color="red" dark @click="submit()" style="margin-bottom: 1%">Submit</v-btn>
      </v-card>
      <button @click.prevent="close" class="border-b border-teal font-semibold" id="close">Close</button>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
    },
    editedShow: Object,
    editedSelections: Object,
  },
  data: () => ({
    image: null,
    imageVert: null,
    editedItems: {
      itemsLocation: [],
      itemsRating: [],
      itemsType: [],
      itemsSpotlight: ["Yes", "No"],
    },
    editedDateForShow: new Date().toISOString().substr(0, 10),
    editedDateShow: false,
    editedDateForPurchase: new Date().toISOString().substr(0, 10),
    editedDatePurchase: false,
    timeShow: false,
  }),
  //When component is mounted -> Fetches all data from different tables to insert into a combobox
  mounted() {
    this.getLocations();
    this.getShowTypes();
    this.getShowRatings();

    this.image = this.editedShow.image;
    this.imageVert = this.editedShow.imageVert;
  },
  created() {
    this.image = this.editedShow.image;
    this.imageVert = this.editedShow.imageVert;
  },
  watch() {
    this.image = this.editedShow.image;
    this.imageVert = this.editedShow.imageVert;
  },

  methods: {
    close() {
      this.$emit("input", !this.value);
    },
    getLocations() {
      this.$axios
        .get(`http://localhost:3000/api/tp2/locations`)
        .then((response) => {
          response.data.forEach((element) => {
            this.editedItems.itemsLocation.push(element.building);
          });
        })
        .catch((error) => console.log(error));
    },
    getShowTypes() {
      this.$axios
        .get(`http://localhost:3000/api/tp2/types`)
        .then((response) => {
          response.data.forEach((element) => {
            this.editedItems.itemsType.push(element.type);
          });
        })
        .catch((error) => console.log(error));
    },
    getShowRatings() {
      this.$axios
        .get(`http://localhost:3000/api/tp2/ratings`)
        .then((response) => {
          response.data.forEach((element) => {
            this.editedItems.itemsRating.push(element.rating);
          });
        })
        .catch((error) => console.log(error));
    },
    submit() {
      this.getIdLocation();
      this.getIdRating();
      this.getIdType();
      //this.getHour();
      setTimeout(() => this.createShow(), 1000);
    },
    getIdRating() {
      var newRatingRequest = this.editedSelections.selectionRating.replace(
        "/",
        "%2F"
      );

      this.$axios
        .get(`http://localhost:3000/api/tp2/rating/` + newRatingRequest)
        .then((response) => {
          response.data.forEach((element) => {
            this.editedShow.idRating = element.idRating;
          });
        })
        .catch((error) => console.log(error));
    },
    getIdType() {
      this.$axios
        .get(
          `http://localhost:3000/api/tp2/type/` +
            this.editedSelections.selectionType
        )
        .then((response) => {
          response.data.forEach((element) => {
            this.editedShow.idShowType = element.idShowType;
          });
        })
        .catch((error) => console.log(error));
    },
    getIdSpotlight() {
      return this.editedShow.isSpotlight === "Yes" ? 1 : 0;
    },
    getIdLocation() {
      this.$axios
        .get(
          `http://localhost:3000/api/tp2/location/` +
            this.editedSelections.selectionLocation
        )
        .then((response) => {
          response.data.forEach((element) => {
            this.editedShow.idLocation = element.idLocation;
          });
        })
        .catch((error) => console.log(error));
    },
    createShow() {
      const requestBody = {
        idShow: this.editedShow.idShow,
        idDate: this.editedShow.idDate,
        showName: this.editedShow.showName,
        showDescription: this.editedShow.showDescription,
        price: this.editedShow.price,
        availableTickets: this.editedShow.availableTickets,
        idRating: this.editedShow.idRating,
        idShowType: this.editedShow.idShowType,
        idLocation: this.editedShow.idLocation,
        limitPurchaseDate: this.editedShow.limitPurchaseDate,
        showDate: this.editedShow.date,
        isSpotlight: this.getIdSpotlight(),
        image: this.editedShow.image.name,
        imageVert: this.editedShow.imageVert.name,
        showTime: this.editedShow.showTime,
      };
      var state = false;
      this.$axios
        .post("http://localhost:3000/api/tp2/show/update_show", requestBody)
        .then((response) => response)
        .catch((error) => {
          state = true;
          this.$emit("input", !this.value);
          this.$fire({
            title: "Error",
            text: "Editing Error",
            type: "error",
            confirmButtonText: "Confirm",
          });
          console.log(error);
        });

      if (!state) {
        this.$emit("input", !this.value);
        this.$fire({
          title: "Show edited",
          text: "Show edited with sucess",
          type: "success",
          confirmButtonText: "Confirm",
        });
      }
    },

  },
};
</script>

<style scoped>
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

.v-form > fieldset {
  padding: 10px;
  margin-bottom: 1%;
}
</style>