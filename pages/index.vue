<script setup lang="ts">
    import { computed, ref } from "vue";
    import HelloWorld from "../components/HelloWorld.vue";

    let routes = ['/no-setup', '/only-script', '/only-template', '/script-setup']
    const count = ref(0);
    const increment = () => {
        count.value += 1
    };
    const countValue = computed( () => count.value)
</script>

<template>
    <div>
        <button @click="increment" class="bg-blue text-light blue">Increment</button>
        <h3>{{ countValue }}</h3>
        <li v-for="route in routes">
            <a :href="route">{{ route }}</a>
</li>
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
