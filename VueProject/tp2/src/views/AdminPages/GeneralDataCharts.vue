<template>
  <v-container>
    <br>
    <br>
    <h1>General Data</h1>
    <v-row justify="space-around">
      <v-col cols="12" md="4">
        <div class="graph-area">
          <h5>Sales by year</h5>
          <v-container class="horizontal_display">
            <v-text-field type="number" v-model="year" label="Year" ></v-text-field>
            <v-btn
              rounded
              color="red"
              dark
              @click="submitRankingTypes()"
              style="margin-bottom: 1%"
            >Submit</v-btn>
          </v-container>

          <pie-chart :chart-data="datacollection" />
        </div>
        <div class="graph-area">
          <h5>Sales by year</h5>
          <v-container class="horizontal_display">
            <v-text-field type="number" v-model="yearComp1" label="Year" style="margin-right: 0.8rem;"></v-text-field>
            <v-text-field type="number" v-model="yearComp2" label="Year" ></v-text-field>
            <v-btn
              rounded
              color="red"
              dark
              @click="submitComparingTypes()"
              style="margin-bottom: 1%"
            >Submit</v-btn>
          </v-container>

          <line-chart :chart-data="datacollection_comp" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PieChart from "../../components/Charts/PieChart.js";
import LineChart from "../../components/Charts/LineChart.js";
export default {
  components: { PieChart, LineChart },
  data: () => ({
    year: new Date().getFullYear(),
    yearComp1: new Date().getFullYear() - 1,
    yearComp2: new Date().getFullYear(),
    datacollection: null,
    datacollection_comp: null,
    loaded: false,
    chart_labels: [],
    chart_data: [],
    chart_labels_comp: ['Cinema and Arts', 'Sports', 'Music and Festivals'],
    chart_data_comp: [],
    charts_background: [
      "rgba(255,0,0,0.5)",
      "rgba(0,255,0,0.5)",
      "rgba(0,0,255,0.5)",
      "rgba(255,255,0,0.5)",
    ],
    charts_line_color: [
      "rgba(255,0,0,1)",
      "rgba(0,255,0,1)",
      "rgba(0,0,255,1)",
      "rgba(255,255,0,1)",
    ],
  }),
  mounted() {
    this.checkValidAccess();
    this.submitRankingTypes();
    this.submitComparingTypes();
  },
  methods: {
    /**Data for yearly bar chart */
    submitRankingTypes() {
      this.chart_labels = [];
      this.chart_data = [];
      this.fetchChartTypeYear(this.year);
    },
    fetchChartTypeYear(year) {
      this.$axios
        .get("http://localhost:3000/api/tp2/purchase/count/byTypeYear/" + year)
        .then((response) => {
          console.log(response);
          if (response.data.length === 0 || response.data.length > 4) {
            this.datacollection = {
              labels: [],
              datasets: [
                {
                  label: "Yearly purchases by Type",
                  data: [],
                },
              ],
            };
          } else {
            response.data.forEach((element) => {
              this.chart_labels.push(element.type);
              this.chart_data.push(element.count);
            });

            this.datacollection = {
              labels: this.chart_labels,
              datasets: [
                {
                  label: "Yearly purchases by Type",
                  backgroundColor: this.charts_background,
                  borderColor: this.charts_line_color,
                  pointBackgroundColor: "blue",
                  borderWidth: 1,
                  pointBorderColor: "blue",
                  data: this.chart_data,
                },
              ],
            };
          }

          this.loaded = true;
        })
        .catch((error) => console.log(error));
    },
    /**------------------------------------------- */
    /**Data for comparing bar chart */
    submitComparingTypes() {
      this.fetchChartTypeComparing(this.yearComp1, this.yearComp2);
    },
    fetchChartTypeComparing(year1, year2) {
      this.$axios
        .get(
          `http://localhost:3000/api/tp2/purchase/count/byTypeCompare/${year1},${year2}`
        )
        .then((response) => {
          var j = 0
          if (response.data.length === 0) {
            this.datacollection_comp = {
              labels: [],
              datasets: [
                {
                  label: "Type Comparison: No Data",
                  data: [],
                },
              ],
            };
          } else {
            
            var auxDataset = []

            for(var i = parseInt(year1); i<= parseInt(year2); i++){
              var auxData = []
              var auxDatasetItem
              
              response.data.forEach((element) => {
                if(element.year === i){
                  auxData.push(element.count)
                }
              })
              auxDatasetItem = {
                  label: "Purchases of: " + i,
                  backgroundColor: "rgba(255,255,255,0)",
                  borderColor: this.charts_line_color[j],
                  pointBackgroundColor: this.charts_background[j],
                  borderWidth: 1,
                  pointBorderColor: this.charts_background[j],
                  data: auxData,
                },
              auxDataset.push(auxDatasetItem)
              j = j + 1
            }

            this.datacollection_comp = {
              labels: this.chart_labels_comp,
              datasets: auxDataset,
            };
          }

          this.loaded = true;
        })
        .catch((error) => console.log(error));
    },
    /**------------------------------------------- */
    checkValidAccess(){
      if(!localStorage.getItem('user') || localStorage.getItem('user').idUserType === 1){
        this.$router.push( {path: '/' })
      }
    }
  },
};
</script>

<style scoped>
.graph-area {
  width: 33% !important;
  /*height: 150px !important;*/
  margin-right: auto;
  margin-left: auto;
  margin-top: 50px;
  /*margin-bottom: 300px;*/
  padding: 2%;
}
.horizontal_display {
  width: 90%;
  display: flex;
  float: left;
}
.v-btn {
  margin-top: 0.7rem;
  margin-left: 0.1rem;
}

.col-12 {
  display: contents;
}
</style>