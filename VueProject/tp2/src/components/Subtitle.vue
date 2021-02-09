<template>
    <div class="subtitle_area">
        <div class="subtitle_area_float"><p4 class="subtitle">{{Subtitle}}</p4></div>
    </div>
</template>
<script>
export default {
    name: 'subtitle',
    props: {
        Subtitle: String
    }
}
</script>
<style scoped>
.subtitle_area{
    margin: 2.5% 4% 2% 4%;
    border-bottom: solid 4px grey;
}
.subtitle{
    background:gray;
    color: white;
    padding: 0.5rem;
}
.subtitle_area_float{
     float: left;
}
</style>