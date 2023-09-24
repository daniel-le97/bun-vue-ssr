<script setup lang="ts">
    import { computed, ref } from "vue";
    import HelloWorld from "../components/HelloWorld.vue";

    // import Layout from '../layouts/main.vue'
    const count = ref(0);
    const increment = () => {
        count.value += 1
    };
    const countValue = computed( () => count.value)
</script>

<template>
    <div>
        <button @click="increment" class="bg-blue text-light blue">Increment</button>
        <h3>{{ countValue }} or {{ count }}</h3>
        <hello-world/>
        <footer class="bg-dark text-light">
    Made with 💖 by daniel
  </footer>
    </div>
    
</template>
<style>
body {
    margin: 0;
    padding: 0;
}

* {
    font-family: 'IBM Plex Sans';
}

.blue{
    background-color: blue;
    color: blue;
}
</style>
