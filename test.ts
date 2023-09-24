// import plugin from "bun-plugin-vue-sfc";
// Bun.plugin(plugin())

// const router = new Bun.FileSystemRouter({
//     style: 'nextjs',
//     dir: './pages',
//     fileExtensions: ['.vue']
// })
// console.log(router);

// const build = await Bun.build( {
//     entrypoints: [...Object.values(router.routes)],
//     outdir: '.sfc',
//     splitting: true,
//     target: 'browser',
//     plugins: [
//         plugin()

//     ],
//     // sourcemap: 'external',
//     minify: false,
//     define: {
//         __VUE_OPTIONS_API__: "true",
//         __VUE_PROD_DEVTOOLS__: "true"
//     }
// } );
// console.log({build});

const page = await import('./pages/index.vue')
console.log(page);


