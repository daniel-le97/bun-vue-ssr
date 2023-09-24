import { BunPlugin } from "bun";
import { basename } from "path";
import { compileScript, compileStyle, compileTemplate, parse, rewriteDefault } from "@vue/compiler-sfc";

// import { Plugin } from "vue";
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

// let ComponentImports = [{kind: '', path: '', parent: ''}]

const transpileTS = ( code: string ) => {
    const transpiler = new Bun.Transpiler( { loader: "ts" } );
    // const imports = transpiler.scan(code)
   
    // console.log(imports);
    const content = transpiler.transformSync( code );
    // console.log(content);
    
    return content;
};

const idStore = new Map<string, string>();
export const cssCache = []

// const setCache = ( code: string, id: string ) => {
//     const codes = cssCache.set( id, code );
//     // console.log( { code, id } );

// };






export const vue = ( ssr = true ) => {
    const vue: BunPlugin = {
        name: 'bun-vue',
        async setup ( build ) {
            
            const isBun = typeof Bun !== 'undefined';
            const isNode = process && !isBun;

            build.onLoad( { filter: /\.vue$/ }, async ( args ) => {
                // const transpiler = new Bun.Transpiler( { loader: "ts" } );
                // console.log(args);
                

                let code: string = '';
                code = await Bun.file( args.path ).text();
                
                // console.log(dogs);
                
                const parsed = parse( code, {
                    filename: basename( args.path ),
                } );

                let id = idStore.get( args.path ) ?? "v" + makeId( 5 );
                idStore.set( args.path, id );

                let isProd = process.env.NODE_ENV == "production" ? true : false;
                if ( parsed.descriptor.scriptSetup?.setup )
                {
                    // vue setup
                    let { content: code2 } = compileScript( parsed.descriptor, {
                        id,
                        inlineTemplate: true, // SSR friendly
                        isProd,
                        templateOptions: {
                            filename: basename( args.path ),
                            ssr,
                            ssrCssVars: []
                        }
                    } );

                    code = code2.replace( "export default ", "let sfc = " );
                    code += ";\n";

                } else
                {
                    // vue without setup

                    let template = compileTemplate( {
                        isProd,
                        ssr,
                        id,
                        filename: basename( args.path ),
                        ssrCssVars: [],
                        source: parsed.descriptor.template?.content ?? "",
                        scoped: true
                    } );

                    let script = compileScript( parsed.descriptor, {
                        id
                    } );

                    code = rewriteDefault( script.content, "sfc" );
                    code += template.code.replace( "export function", "function" );

                    if ( ssr )
                    {
                        code += "\nsfc.ssrRender = ssrRender;\n";

                    } else
                    {
                        code += "\nsfc.render = render;\n";
                    }

                }
                let styles = [];
                parsed.descriptor.styles[ 0 ].scoped;


                if ( !ssr )
                {
                    for ( const i in parsed.descriptor.styles )
                    {
                        styles.push( compileStyle( {
                            id,
                            source: parsed.descriptor.styles[ i ].content,
                            filename: basename( args.path ),
                            isProd,
                            scoped: parsed.descriptor.styles[ i ].scoped
                        } ).code );
                    }

                    if ( styles.length )
                    {
                        // const compiled = sass.compileString(styles.join('\n'))

                        cssCache.push(styles.join())
                        // console.log(cssCache);
                        
                        // const styleCode = `const style${ id } = document.createElement("style");\nstyle${ id }.innerHTML = \`${ styles.join( "\n" ) }\`;\ndocument.head.appendChild(style${ id });\n`;
                        // console.log(styleCode, compiled.css);

                        // code += styleCode;
                        // console.log(styleCode);
                        
                        // const file = Bun.file( "./globals.css" );
                        // const text = await file.text()
                        // const sass = await import('sass')
                        // const writer = file.writer();
                        // sass.compileString(text + styles.join('\n'))
                        // writer.write( sass.compileString(text + styles.join('\n'), {style: 'compressed', 'syntax': 'css'}).css) 
                        // writer.flush();
                        // writer.end();
                        // console.log(cssCache);
                        

                    }
                }
                code += 'export default sfc;';
             
              
                // console.log(code);
                
                return {
                    contents: transpileTS( code ),
                    loader: "js"
                };

            } );
            // console.log( cssCache.forEach( css => console.log( css )))




        }
    };

    return vue;
};