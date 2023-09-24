import { createApp } from './';
// const bootstrap = require('bootstrap')
// import "../assets/scss/main.scss";


(await createApp(globalThis.PATH_TO_PAGE)).app.mount('#app')
