import { createApp } from './';
// import "../assets/scss/main.scss";


(await createApp(globalThis.PATH_TO_PAGE)).app.mount('#app')
