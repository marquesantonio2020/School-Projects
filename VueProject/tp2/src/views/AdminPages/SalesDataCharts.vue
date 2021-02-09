<template>
  <v-container>
    <p></p>
    <h1>Sales</h1>
    <v-row justify="space-around">
      <v-col cols="12" md="4">
        <div class="graph-area">
          <h5>Sales by year</h5>
          <v-container class="horizontal_display">
            <v-text-field type="number" v-model="year" label="Year"></v-text-field>
            <v-btn rounded color="red" dark @click="submitYear()" style="margin-bottom: 1%">Submit</v-btn>
          </v-container>

          <bar-chart :chart-data="datacollection" />
        </div>
        <div class="graph-area">
          <h5>Sales by month</h5>
          <v-container class="horizontal_display">
            <v-menu
              v-model="showMonth"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="year_month" v-bind="attrs" v-on="on" label="Month" readonly></v-text-field>
              </template>
              <v-date-picker
                v-model="year_month"
                type="month"
                color="red"
                @input="showMonth=!showMonth"
              ></v-date-picker>
            </v-menu>

            <v-btn
              rounded
              color="red"
              dark
              @click="submitYearMonth()"
              style="margin-bottom: 1%"
            >Submit</v-btn>
          </v-container>

          <bar-chart :chart-data="datacollection_ym" />
        </div>

        <div class="graph-area">
          <h5>Between months</h5>
          <v-container class="horizontal_display">
            <v-text-field type="number" v-model="yearBetween1" label="Year"></v-text-field>
            <v-text-field
              style="margin-left: 0.8rem;"
              type="number"
              v-model="yearBetween2"
              label="Year"
            ></v-text-field>
            <v-btn
              rounded
              color="red"
              dark
              @click="submitBetweenMonth()"
              style="margin-bottom: 1%"
            >Submit</v-btn>
          </v-container>
          <line-chart :chart-data="datacollection_between_m" />
        </div>
        <div class="graph-area">
          <h5>Sales (€) between years</h5>
          <v-container class="horizontal_display">
            <v-text-field type="number" v-model="yearPrice1" label="Year"></v-text-field>
            <v-text-field
              style="margin-left: 0.8rem;"
              type="number"
              v-model="yearPrice2"
              label="Year"
            ></v-text-field>
            <v-btn
              rounded
              color="red"
              dark
              @click="submitYearPrice()"
              style="margin-bottom: 1%"
            >Submit</v-btn>
          </v-container>

          <line-chart :chart-data="datacollection_earns" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BarChart from "../../components/Charts/BarChart.js";
import LineChart from "../../components/Charts/LineChart.js";
export default {
  components: { BarChart, LineChart },
  data() {
    return {
      showDay: false,
      showMonth: false,
      showMonthv1: false,
      showMonthv2: false,
      year: new Date().getFullYear(),
      year_month: new Date().getFullYear() + "-" + this.getMonth(new Date()),
      yearPrice1: new Date().getFullYear() - 1,
      yearPrice2: new Date().getFullYear(),
      datacollection: null,
      datacollection_ym: null,
      datacollection_between_m: null,
      datacollection_earns: null,
      loaded: false,
      chart_labels: [],
      chart_data: [],
      chart_labels_ym: [],
      chart_data_ym: [],
      chart_data_between_m: [],
      chart_labels_between_m: [],
      chart_labels_earns: [],
      yearBetween1: new Date().getFullYear() - 1,
      yearBetween2: new Date().getFullYear(),
      color: ["red", "blue"],
      charts_background: [
        "rgba(255,0,0,0.2)",
        "rgba(0,255,0,0.2)",
        "rgba(0,0,255,0.2)",
        "rgba(255,255,0,0.2)",
        "rgba(255,0,0,0.2)",
        "rgba(0,255,0,0.2)",
        "rgba(0,0,255,0.2)",
        "rgba(255,255,0,0.2)",
        "rgba(255,0,0,0.2)",
        "rgba(0,255,0,0.2)",
        "rgba(0,0,255,0.2)",
        "rgba(255,255,0,0.2)",
      ],
      charts_line_color: [
        "rgba(255,0,0,1)",
        "rgba(0,255,0,1)",
        "rgba(0,0,255,1)",
        "rgba(255,255,0,1)",
        "rgba(255,0,0,1)",
        "rgba(0,255,0,1)",
        "rgba(0,0,255,1)",
        "rgba(255,255,0,1)",
        "rgba(255,0,0,1)",
        "rgba(0,255,0,1)",
        "rgba(0,0,255,1)",
        "rgba(255,255,0,1)",
      ],
    };
  },
  mounted() {
    this.checkValidAccess();
    this.submitYear();
    this.submitYearMonth();
    this.submitBetweenMonth();
    this.submitYearPrice();
  },
  methods: {
    /**Data for yearly bar chart */
    submitYear() {
      this.chart_labels = [];
      this.chart_data = [];
      this.fetchChartDataYear(this.year);
    },
    fetchChartDataYear(year) {
      this.$axios
        .get("http://localhost:3000/api/tp2/purchase/count/byYear/" + year)
        .then((response) => {
          if (response.data.length === 0) {
            this.datacollection = {
              labels: [],
              datasets: [
                {
                  label: "No data",
                  data: [],
                },
              ],
            };
          } else {
            response.data.forEach((element) => {
              this.chart_labels.push(this.changeLabelsToMonth(element.date));
              this.chart_data.push(element.count);
            });

            this.changeLabelsToMonth();

            this.datacollection = {
              labels: this.chart_labels,
              datasets: [
                {
                  label: "Yearly purchases",
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

    /**Data for Year/Month bar chart */
    submitYearMonth() {
      var insertedDate = this.year_month.split("-");
      this.chart_labels_ym = [];
      this.chart_data_ym = [];
      this.fetchChartDataYearMonth(insertedDate);
    },
    fetchChartDataYearMonth(insertedDate) {
      this.$axios
        .get(
          `http://localhost:3000/api/tp2/purchase/count/byYearMonth/${insertedDate[0]},${insertedDate[1]}`
        )
        .then((response) => {
          if (response.data.length === 0) {
            this.datacollection_ym = {
              labels: [],
              datasets: [
                {
                  label: "No data",
                  data: [],
                },
              ],
            };
          } else {
            response.data.forEach((element) => {
              this.chart_labels_ym.push(element.date);
              this.chart_data_ym.push(element.count);
            });

            this.datacollection_ym = {
              labels: this.chart_labels_ym.reverse(),
              datasets: [
                {
                  label: "Monthly purchases",
                  backgroundColor: this.charts_background[0],
                  borderColor: this.charts_line_color[0],
                  pointBackgroundColor: "blue",
                  borderWidth: 1,
                  pointBorderColor: "blue",
                  data: this.chart_data_ym,
                },
              ],
            };
          }

          this.loaded = true;
        })
        .catch((error) => console.log(error));
    },
    /**------------------------------------------- */
    /** Fetch data to compare between months*/
    submitBetweenMonth() {
      var array_of_years = [this.yearBetween1, this.yearBetween2];

      (this.chart_data_between_m = []), (this.chart_labels_between_m = []);
      this.fetchDataBetweenMonth(array_of_years);
    },
    fetchDataBetweenMonth(array_of_years) {
      this.$axios
        .get(
          `http://localhost:3000/api/tp2/purchase/count/byBetweenMonths/${array_of_years[0]},${array_of_years[1]}`
        )
        .then((response) => {
          var j = 0;
          if (response.data.length === 0) {
            this.datacollection_between_m = {
              labels: [],
              datasets: [
                {
                  label: "No data",
                  data: [],
                },
              ],
            };
          } else {
            this.chart_labels_between_m = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Oct",
              "Nov",
              "Dec",
            ];
            var auxDataset = [];

            for (
              var i = parseInt(array_of_years[1]);
              i >= parseInt(array_of_years[0]);
              i--
            ) {
              var auxData = [];
              var auxDatasetItem;

              response.data.forEach((element) => {
                console.log(element.year, i);
                if (element.year === i) {
                  auxData.push(element.count);
                }
              });
              (auxDatasetItem = {
                label: "Purchases of: " + i,
                backgroundColor: "rgba(255,255,255,0)",
                borderColor: this.charts_line_color[j],
                pointBackgroundColor: this.charts_background[j],
                borderWidth: 1,
                pointBorderColor: this.charts_background[j],
                data: auxData,
              }),
                auxDataset.push(auxDatasetItem);
              j = j + 1;
            }

            this.datacollection_between_m = {
              labels: this.chart_labels_between_m,
              datasets: auxDataset,
            };
          }

          this.loaded = true;
        })
        .catch((error) => console.log(error));
    },
    /**-------------------------------------------- */
    /** Fetch data to compare between months*/
    submitYearPrice() {
      this.fetchMoneyEarnedYear(this.yearPrice1, this.yearPrice2);
    },
    fetchMoneyEarnedYear(yearprice1, yearprice2) {
      console.log(yearprice1, yearprice2);
      this.$axios
        .get(
          `http://localhost:3000/api/tp2/purchase/count/earns_yearly/${yearprice1}, ${yearprice2}`
        )
        .then((response) => {
          var j = 0;
          if (response.data.length === 0) {
            this.datacollection_earns = {
              labels: [],
              datasets: [
                {
                  label: "No data",
                  data: [],
                },
              ],
            };
          } else {
            this.chart_labels_earns = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Oct",
              "Nov",
              "Dec",
            ];
            var auxDataset = [];

            for (var i = parseInt(yearprice1); i <= parseInt(yearprice2); i++) {
              console.log("here");
              var auxData = [];
              var auxDatasetItem;

              response.data.forEach((element) => {
                if (element.year === i) {
                  auxData.push(parseFloat(element.total).toFixed(2));
                }
              });
                (auxDatasetItem = {
                  label: "Purchases of: " + i,
                  backgroundColor: "rgba(255,255,255,0)",
                  borderColor: this.charts_line_color[j],
                  pointBackgroundColor: this.charts_background[j],
                  borderWidth: 1,
                  pointBorderColor: this.charts_background[j],
                  data: auxData,
                })
              
                auxDataset.push(auxDatasetItem);
              j = j + 1;
            }

            this.datacollection_earns = {
              labels: this.chart_labels_earns,
              datasets: auxDataset,
            };
          }

          this.loaded = true;
        })
        .catch((error) => console.log(error));
    },
    changeLabelsToMonth(month) {
      switch (month) {
        case 1:
          return "Jan";
          break;
        case 2:
          return "Feb";
          break;
        case 3:
          return "Mar";
          break;
        case 4:
          return "Apr";
          break;
        case 5:
          return "May";
          break;
        case 6:
          return "Jun";
          break;
        case 7:
          return "Jul";
          break;
        case 8:
          return "Aug";
          break;
        case 9:
          return "Sep";
          break;
        case 10:
          return "Oct";
          break;
        case 11:
          return "Nov";
          break;
        case 12:
          return "Dec";
          break;
      }
    },
    checkValidAccess() {
      if (
        !localStorage.getItem("user") ||
        localStorage.getItem("user").idUserType === 1
      ) {
        this.$router.push({ path: "/" });
      }
    },
    getMonth(date) {
      var month = date.getMonth() + 1;
      return month < 10 ? "0" + month : "" + month; // ('' + month) for string result
    },
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