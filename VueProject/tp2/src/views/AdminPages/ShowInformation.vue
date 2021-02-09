<template>
<table-of-information Text="All Shows Registered"/>
</template>

<script>
import TableOfInformation from '../../components/TableOfInformation.vue'
export default {
  components: { TableOfInformation },
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