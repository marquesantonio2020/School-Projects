<template>
<v-app>
    <subtitle Subtitle="Spotlight"/>
    <horizontal-displayer URL = 'http://localhost:3000/api/tp2/show_spotlight/type/2' Color = 'border: solid 2px blue'/>
    <subtitle Subtitle="Available Shows"/>
    <vertical-displayer URL= 'http://localhost:3000/api/tp2/show/type/2' Color = 'border: solid 2px blue'/>
</v-app>
</template>

<script>
import HorizontalDisplayer from '../components/HorizontalDisplayer.vue'
import VerticalDisplayer from '../components/VerticalDisplayer.vue'
import Subtitle from '../components/Subtitle.vue'
export default {
    components: {
        HorizontalDisplayer,
        VerticalDisplayer,
        Subtitle
    }
}
</script>

<style scoped>

</style>