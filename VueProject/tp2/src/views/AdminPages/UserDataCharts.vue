<template>
<v-container>
  <br>
    <br>
    <h1>Users</h1>
<div class="graph-area">

 <line-chart :chart-data="datacollection" />

</div>
   </v-container>
  
</template>

<script>
import LineChart from "../../components/Charts/LineChart.js";
export default {
  components: { LineChart },
  data() {
    return {
      datacollection: null,
      loaded: false,
    };
  },
  mounted() {
    this.checkValidAccess()
    this.fetchChartData();
  },
  methods: {
    fetchChartData() {
      this.$axios
      .get("http://localhost:3000/api/tp2/user/type/count")
      .then((response) => {
          console.log(response)
      this.datacollection= {
        labels: [response.data[0].idUserType, response.data[1].idUserType],
        datasets: [
          {
            label: "Users",
            backgroundColor: "rgba(255,0,0,0.2)",
            borderColor: "red",
            pointBackgroundColor: "blue",
            borderWidth: 1,
            pointBorderColor: "blue",
            data: [response.data[0].count, response.data[1].count],
          },
        ],
      };
      this.loaded = true;
       })
      .catch((error) => console.log(error));
    },
    checkValidAccess(){
      if(!localStorage.getItem('user') || localStorage.getItem('user').idUserType === 1){
        this.$router.push( {path: '/' })
      }
    }
  },
};
</script>

<style scoped>
.graph-area{
    width: 500px!important;
    height: 300px!important;
    margin-right: auto;
    margin-left: auto;
    margin-top: 50px;
    margin-bottom: 200px;
}
</style>