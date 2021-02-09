import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  watch: {
    'chartdata': {
      handler(newOption, oldOption) {
        this._chart.destroy()
        this.renderChart(this.chartData, this.options)
      },
    },
  },
  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}