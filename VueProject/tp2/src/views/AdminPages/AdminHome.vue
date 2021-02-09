<template>
<v-container>
    <br>
    <br>
    <h1>Dashboard</h1>
    <icon-sheets />
    </v-container>
</template>

<script>
import IconSheets from '../../components/IconSheets.vue'
export default {
  components: { IconSheets },
  created() {
    this.checkValidAccess()
  },
  methods: {
    checkValidAccess(){
      if(!localStorage.getItem('user') || localStorage.getItem('user').idUserType === 1){
        this.$router.push( {path: '/' })
      }
    }
  }
    
}
</script>

<style scoped>

</style>