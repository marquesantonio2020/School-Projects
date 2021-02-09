<template>
  <div>
    <div v-show="statusType !== 'expired'">
        <v-row>
            <v-col>
      <div class="day">
        <span class="number">{{ days }}</span>
        <div class="format">{{ wordString.day }}</div>
      </div>
      </v-col>
      <v-col>
      <div class="hour">
        <span class="number">{{ hours }}</span>
        <div class="format">{{ wordString.hours }}</div>
      </div>
      </v-col>
      <v-col>
      <div class="min">
        <span class="number">{{ minutes }}</span>
        <div class="format">{{ wordString.minutes }}</div>
      </div>
      </v-col>
      <v-col>
      <div class="sec">
        <span class="number">{{ seconds }}</span>
        <div class="format">{{ wordString.seconds }}</div>
      </div>
      </v-col>
      </v-row>
    </div>
    <div v-if="this.statusType === 'expired'">
    <div class="message">{{ message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["endtime", "trans"],
  data: function () {
    return {
      timer: "",
      wordString: {},
      start: "",
      end: "",
      interval: "",
      days: "",
      minutes: "",
      hours: "",
      seconds: "",
      message: "",
      statusType: "",
      statusText: "",
    };
  },
  created: function () {
    this.wordString = JSON.parse(this.trans);
  },
  mounted() {
    var finalTime = [] 
    finalTime = this.endtime.split("-");
    finalTime[1] = finalTime[1] - 1;
    this.end = new Date(finalTime[0], finalTime[1], finalTime[2], '23', '59', '59', '59').getTime();
    // Update the count down every 1 second
    this.timerCount(this.end);
    this.interval = setInterval(() => {
      this.timerCount(this.end);
    }, 1000);
  },
  methods: {
    timerCount: function (end) {   
    this.start = new Date().getTime();

      // Find the distance between now an the count down date1
      var passTime = end - this.start;

      if (passTime < 0) {
        this.message = this.wordString.expired;
        this.statusType = "expired";
        this.statusText = this.wordString.status.expired;
        clearInterval(this.interval);
        return;
      } else if (passTime > 0) {
        this.calcTime(passTime);
        this.message = this.wordString.running;
        this.statusType = "running";
        this.statusText = this.wordString.status.running;
      }
    },
    calcTime: function (dist) {
      // Time calculations for days, hours, minutes and seconds
      this.days = Math.floor(dist / (1000 * 60 * 60 * 24));
      this.hours = Math.floor(
        (dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((dist % (1000 * 60)) / 1000);
      this.active();
    },
    active (event) {
      this.$emit('changed', this.statusType)
    }
  },
};
</script>

<style scoped>
body {
  background: #004d40;
  text-align: center;
  padding: 50px 0;
}
body h1 {
  font-size: 26px;
  color: #fff;
}

.timer {
  font-size: 20px;
  color: #fff;
  text-align: center;
  margin-top: 50px;
}
.timer .day,
.timer .hour,
.timer .min,
.timer .sec {
  font-size: 30px;
  display: inline-block;
  font-weight: 500;
  text-align: center;
  margin: 0 5px;
}
.timer .day .format,
.timer .hour .format,
.timer .min .format,
.timer .sec .format {
  font-weight: 300;
  font-size: 14px;
  opacity: 0.8;
  width: 60px;
}
.timer .number {
  padding: 0 5px;
  border-radius: 5px;
  display: inline-block;
  width: 60px;
  text-align: center;
}
.timer .message {
  font-size: 14px;
  font-weight: 400;
  margin-top: 5px;
}
.timer .status-tag {
  width: 270px;
  margin: 10px auto;
  padding: 8px 0;
  font-weight: 500;
  color: #000;
  text-align: center;
  border-radius: 15px;
}
.timer .status-tag.upcoming {
  background-color: lightGreen;
}
.timer .status-tag.running {
  background-color: gold;
}
.timer .status-tag.expired {
  background-color: silver;
}
</style>