<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="purchases"
      item-key="idPurchase"
      class="elevation-1"
    >
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn rounded color="red" dark @click="showPurchase(item)"
      >See Purchase</v-btn>
    </template>
      <template>
        <tr>
          <td></td>
          <td colspan="4"></td>
        </tr>
      </template>
    </v-data-table>
    <purchase-details :LINES="lines" v-model="dialog"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PurchaseDetails from '../components/PurchaseDetails.vue';

export default {
  components: { PurchaseDetails},
  name: "table_of_contents",
  data: () => ({
    purchases: [],
    dialog: false,
    id : null,
    lines: null
  }),
  created() {
    this.getPurchases();
  },
  computed: {
    ...mapGetters({
      user: "auth/userData",
    }),
    headers() {
      return [
        {
          text: "Purchase Number",
          align: "start",
          value: "idPurchase",
        },
        { text: "Purchase Date", value: "purchaseDate" },
        { text: "Payments Method", value: "paymentMethod" },
        { text: "Total (€)", value: "totalPayed" },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
    },
    allPurchases() {
      return this.purchases;
    },
  },
  methods: {//Uses API to get all purchases on the database
    getPurchases() {
      this.$axios
        .get("http://localhost:3000/api/tp2/user/purchase/" + this.user[0].idUser)
        .then((response) => response)
        .then((data) => {
          var temp = Object.values(data.data);
          this.purchases = temp.map((element) => {
            var temp = element;
            var date = null;
            var hour = null;

            if (temp.paymentMethod === 1) {
              temp.paymentMethod = "MBWay";
            } else {
              temp.paymentMethod = "Bank Reference";
            }

            date = (temp.purchaseDate).split("T")[0];
            hour = ((temp.purchaseDate).split("T")[1]).split(".")[0];

            temp.purchaseDate = date + " | " + hour;

            return temp;
          });
          console.log(this.purchases);
        })
        .catch((error) => console.log(error));
    },
    getPurchaseLines(id) {
      this.$axios
        .get(`http://localhost:3000/api/tp2/user/purchaselines/` + id)
        .then((response) => {
          this.lines = response.data;
        })
        .catch((error) => console.log(error));
    },
    showPurchase (item) {
        this.getPurchaseLines(item.idPurchase)
        this.dialog = !this.dialog;
      },
  },
};
</script>

<style scoped>
.v-data-table {
  margin: 5%;
}

</style>