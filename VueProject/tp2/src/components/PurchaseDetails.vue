<template>
  <v-row justify="center">
    <v-dialog v-model="value" persistent max-width="600px">
      <v-card>
        <v-card-title id="cardTitle">
          <h1 class="headline">Purchase Details</h1>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-list>
              <v-list-item
                id="item"
                v-for="(line, index) in this.LINES"
                :key="index"
              >
                <v-avatar tile height="120px" width="200px">
                  <img contain :src="imageSource(index)" alt="" />
                </v-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    >Show: {{ line.showName }}</v-list-item-title
                  >
                  <v-list-item-subtitle
                    >Date: {{ line.date }}  | Time: {{line.showTime}}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle
                    >{{ line.price }} x {{ line.quantity }} =
                    {{ line.subtotal }} €</v-list-item-subtitle
                  >
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn class="item-close" @click="detailsShow(index)" icon>
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
            </v-list>
          </v-container>
        </v-card-text>
      </v-card>
      <button
        @click.prevent="close"
        class="border-b border-teal font-semibold"
        id="close"
      >
        Close
      </button>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
    },
    getPurchaseLines() {
      this.$axios
        .get(`http://localhost:3000/api/tp2/user/purchaselines/` + this.ID)
        .then((response) => {
          this.lines = response.data;
        })
        .catch((error) => console.log(error));
    },
    LINES: Object,
  },
  data: () => ({}),
  methods: {
    close() {
      this.$emit("input", !this.value);
    },
    imageSource(index) {
      return require("../../public/images/" + this.LINES[index].image);
    },
    detailsShow(index) {
      this.$router.push({
        path: "/show/" + this.LINES[index].idShow + "/show_info",
      });
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