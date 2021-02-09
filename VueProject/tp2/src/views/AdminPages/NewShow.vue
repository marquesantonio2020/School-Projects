<template>
    <show-form-register  Text="New Show Register"/>
</template>

<script>
import ShowFormRegister from '../../components/ShowFormRegister.vue'
export default {
  components: { ShowFormRegister },
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