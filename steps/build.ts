import { logger } from "../dev";
import plugin from 'bun-plugin-vue-sfc'

interface Build {
    entrypoints: string[]
    outdir: string
    target?: 'browser' | 'bun' | 'node'
}

export const builder = async(opts: Build) => {

    
    // logger.start( 'bundling client' );
    const build = await Bun.build( {
        entrypoints: opts.entrypoints,
        outdir: opts.outdir,
        splitting: true,
        target: opts.target ?? 'browser',
        plugins: [
            plugin()

        ],
        // sourcemap: 'external',
        minify: false,
        define: {
            __VUE_OPTIONS_API__: "true",
            __VUE_PROD_DEVTOOLS__: "true"
        }
    } );
    
    return build
}