
import { BunPlugin } from "bun";
import { basename } from "path";
import { compileScript, compileStyle, compileTemplate, parse, rewriteDefault, SFCScriptCompileOptions, SFCDescriptor } from "@vue/compiler-sfc";
import { logger } from "../dev.js";


// constants
const isProd = process.env.NODE_ENV === 'production'
const makeId = ( length: number ) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while ( counter < length )
    {
        result += characters.charAt( Math.floor( Math.random() * charactersLength ) );
        counter += 1;
    }
    return result;
};

const transpileTS = ( code: string ) => {
    const transpiler = new Bun.Transpiler( { loader: "ts" } );
    const content = transpiler.transformSync( code ); 
    return content;
};

const idStore = new Map<string, string>();
export const cssCache = []
type Target = 'browser' | 'bun'

const resolveScript = (decriptor: SFCDescriptor, opts: SFCScriptCompileOptions, target: Target, path: string ) => {
    const defaults: SFCScriptCompileOptions = {
        'id': idStore.get(path),
        'inlineTemplate': true,
        isProd,
        'templateOptions': {
            ssr: true,
            filename: basename(path)
        }

    }
    
    // const id = idStore.get(path)
    // opts.id! = id
    // opts.isProd = isProd
    // opts.templateOptions
    return compileScript(decriptor, defaults)
}

export const sfcPlugin = (target: Target,opts?:{script: SFCScriptCompileOptions}) => {
    const vue: BunPlugin = {
        name: 'bun-vue',
        target,
        async setup ( build ) {

            
            const isBun = typeof Bun !== 'undefined';
            const isNode = process && !isBun;

            build.onLoad( { filter: /\.vue$/ }, async ( args ) => {
     
                let code: string = '';
                code = await Bun.file( args.path ).text();
     
                const parsed = parse( code, {
                    filename: basename( args.path ),
                } );

                let id = idStore.get( args.path ) ?? "v" + makeId( 5 );
                idStore.set( args.path, id );

                let isProd = process.env.NODE_ENV == "production" ? true : false;
                const scriptBlock = resolveScript(parsed.descriptor, opts?.script, target, args.path)
                
                console.log((scriptBlock.content))
                // if ( parsed.descriptor.scriptSetup?.setup )
                // {
                //     // vue setup
                //     let { content: code2 } = compileScript( parsed.descriptor, {
                //         id,
                //         inlineTemplate: true, // SSR friendly
                //         isProd,
                //         templateOptions: {
                //             filename: basename( args.path ),
                //             ssr,
                //             ssrCssVars: []
                //         }
                //     } );

                //     code = code2.replace( "export default ", "let sfc = " );
                //     code += ";\n";

                // } else
                // {
                //     // vue without setup

                //     let template = compileTemplate( {
                //         isProd,
                //         ssr,
                //         id,
                //         filename: basename( args.path ),
                //         ssrCssVars: [],
                //         source: parsed.descriptor.template?.content ?? "",
                //         scoped: true
                //     } );

                //     let script = compileScript( parsed.descriptor, {
                //         id
                //     } );

                //     code = rewriteDefault( script.content, "sfc" );
                //     code += template.code.replace( "export function", "function" );

                //     if ( ssr )
                //     {
                //         code += "\nsfc.ssrRender = ssrRender;\n";

                //     } else
                //     {
                //         code += "\nsfc.render = render;\n";
                //     }

                // }
                // let styles = [];
                // parsed.descriptor.styles[ 0 ].scoped;


                // if ( !ssr )
                // {
                //     for ( const i in parsed.descriptor.styles )
                //     {
                //         styles.push( compileStyle( {
                //             id,
                //             source: parsed.descriptor.styles[ i ].content,
                //             filename: basename( args.path ),
                //             isProd,
                //             scoped: parsed.descriptor.styles[ i ].scoped
                //         } ).code );
                //     }

                //     if ( styles.length )
                //     {
                //         cssCache.push(styles.join())
                //     }
                // }
                // code += 'export default sfc;';
                return {
                    contents: transpileTS( code ),
                    loader: "js"
                };

            } );

        }
    };

    return vue;
};