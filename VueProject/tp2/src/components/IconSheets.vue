<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="12" md="4">
         <v-hover v-slot="{ hover }">
        <v-sheet color="red" dark :elevation="hover ? 12 : 12"
              :class="{ 'on-hover': hover }"  class="mx-auto" @click="toUserData()">
          <v-icon>mdi-account-group</v-icon>
          <h3>Users</h3>
        </v-sheet>
         </v-hover>
         <v-hover v-slot="{ hover }">
        <v-sheet color="green" dark :elevation="hover ? 12 : 12"
              :class="{ 'on-hover': hover }" class="mx-auto" @click="toSalesData()">
          <v-icon>mdi-cart</v-icon>
          <h3>Sales</h3>
        </v-sheet>
        </v-hover>
        <v-hover v-slot="{ hover }">
        <v-sheet color="blue" dark :elevation="hover ? 12 : 12"
              :class="{ 'on-hover': hover }" class="mx-auto" @click="toGeneralData()">
          <v-icon>mdi-chart-line-variant</v-icon>
          <h3>General Data</h3>
        </v-sheet>
        </v-hover>
        <v-hover v-slot="{ hover }">
        <v-sheet color="yellow" dark :elevation="hover ? 12 : 12"
              :class="{ 'on-hover': hover }" class="mx-auto" @click="toAddNewAdmin()">
          <v-icon>mdi-account-plus</v-icon>
          <h3>Add new admin</h3>
        </v-sheet>
        </v-hover>
        <v-hover v-slot="{ hover }">
        <v-sheet color="gray" dark :elevation="hover ? 12 : 12"
              :class="{ 'on-hover': hover }"  class="mx-auto" @click="logout()">
          <v-icon>mdi-logout</v-icon>
          <h3>Logout</h3>
        </v-sheet>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { mapActions } from 'vuex'
export default {
  methods: {
     ...mapActions({
      loggingOut: "auth/logout",
    }),
    toUserData() {
      this.$router.push({ path: "/admin/user_chart_data" });
    },
    toSalesData() {
      this.$router.push({ path: "/admin/sales_chart_data" });
    },
    toGeneralData() {
      this.$router.push({ path: "/admin/general_chart_data" });
    },
    toAddNewAdmin(){
      this.$router.push({ path: "/login/register" })
    },
    logout(){
      this.loggingOut(null)
      this.$fire({
          title: "Logout",
          text: "Logout sucess",
          type: "success",
          confirmButtonText: "Confirm",
          color: "red",
        });
      this.$router.push({ path: "/" });
    }
  },
};
</script>

<style scoped>
.row {
  display: inline-flex !important;
  float: left;
}
.v-application .mx-auto {
  margin: 3% 1% !important;
  width: 19rem;
  height: 15rem;
  border-radius: 20px;
}
.col-12 {
  display: contents;
}
.v-icon.v-icon {
  font-size: 200px !important;
}
h1 {
  padding-bottom: 100%;
}
.on-hover{
  opacity: 0.5;
}
</style>