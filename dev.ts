const timer = Bun.nanoseconds()
import { createConsola } from "consola";
import { vue } from "./plugins/vue";
import * as path from "path";
import { existsSync, readdirSync, rmSync, statSync } from "fs";
import type { ServeOptions } from "bun";
import { renderToString } from "vue/server-renderer";
import { createApp } from "./entry/index";
import { FileSystemRouter } from "bun";
import { scssPlugin} from "./plugins/scss";
const logger = createConsola();


logger.info( 'registering server plugins' );
// run your server plugins before any file/import processing
Bun.plugin( vue( true ) );

logger.success( 'server plugins registered' );


const dogs = 'dogs'


// constants
const isProd = process.env.NODE_ENV === 'production';
const PROJECT_ROOT = import.meta.dir;
const PUBLIC_DIR = path.resolve( PROJECT_ROOT, "public" );
const BUILD_DIR = path.resolve( PROJECT_ROOT, ".build" );
const ASSETS_DIR = path.resolve( PROJECT_ROOT, 'assets' );
const serveDirectories = [ BUILD_DIR + '/client', ASSETS_DIR, PUBLIC_DIR ];
const port = process.env.PORT || 3000
// const indexCSS = '/main.css';

// get the pages from the filesystem to add as entrypoints for our bundler
const srcRouter = new FileSystemRouter( {
  dir: './pages',
  style: "nextjs",
  fileExtensions: [ '.vue' ]
} );

// we want to clear our build directory for the bundling that follows after this
if ( existsSync( BUILD_DIR ) )
  logger.info( 'clearning build dir ', BUILD_DIR );
rmSync( BUILD_DIR, { recursive: true, force: true } );
logger.success( 'build dir cleaned', BUILD_DIR );

// console.log(srcRouter);


// build our vue ssr app
logger.start( 'bundling client' );
const build = await Bun.build( {
  entrypoints: [ import.meta.dir + '/entry/entry-client.ts', ...Object.values( srcRouter.routes )],
  outdir: BUILD_DIR + '/client',
  splitting: true,
  target: 'browser',
  plugins: [
    vue( false ),
    // scssPlugin,
    // otherFiles,
  ],
  minify: false,
  define: {
    __VUE_OPTIONS_API__: "true",
    __VUE_PROD_DEVTOOLS__: "true"
  }
} );

if (!build.success) {
  logger.error(build)
  process.exit(1)
}
// this depends on css extracted from the vue plugin registered in the first build
const secondBuild = await Bun.build( {
  entrypoints: [ import.meta.dir + '/assets/scss/main.scss'],
  outdir: BUILD_DIR + '/client/assets',
  splitting: false,
  target: 'browser',
  plugins: [
    scssPlugin,
    ],
    minify: false,
  } );

  if (secondBuild.success) {
    logger.success( 'client is now bundled' );
  }else{
    logger.error(secondBuild)
    process.exit(1)
  }

// const serverBuild = await Bun.build( {
//   entrypoints: [ import.meta.dir + '/entry/entry-client.ts', ...Object.values( srcRouter.routes ) ],
//   outdir: BUILD_DIR + '/server',
//   splitting: true,
//   // minify: true,
//   plugins: [
//     //  vuePlugin( true )
//     plugin()
//      ],
//   target: 'browser',
//   define: {
//     __VUE_OPTIONS_API__: "true",
//     __VUE_PROD_DEVTOOLS__: "true"
//   }
// } );
// console.log( build );


// if ( !srcRouter.routes )
// {
//   console.log(srcRouter);

//   process.exit( 3 );
// }

// this is the router for built pages
const buildRouter = new Bun.FileSystemRouter( {
  dir: BUILD_DIR + '/client/pages',
  style: "nextjs",
} );



// helper function to find all files in all directories - not currently used
function getAllFiles ( directories: string[] ): string[] {
  let files: string[] = [];

  function traverseDirectory ( dir: string ) {
    const entries = readdirSync( dir, { withFileTypes: true } );

    for ( const entry of entries )
    {
      const fullPath = path.join( dir, entry.name );

      if ( entry.isDirectory() )
      {
        traverseDirectory( fullPath );
      } else
      {
        files.push( fullPath );
      }
    }
  }

  for ( const directory of directories )
  {
    traverseDirectory( directory );
  }

  return files;
}
// helper function to serve files from the directory - .build/assets/public
function serveFromDir (
  serveDirectories: string[],
  reqPath: string
): Response {
  for ( const dir of serveDirectories )
  {
    try
    {
      let pathWithSuffix = path.join( dir, reqPath );
      const stat = statSync( pathWithSuffix );

      if ( stat && stat.isFile() )
      {

        return new Response( Bun.file( pathWithSuffix ) );
      }
      continue;
    } catch ( error )
    {
      //do something here if the file should have been found from the directory
    }
  }
  return null;
}

// helper function to update our html and send it
async function serveFromRouter ( request: Request ) {
  try
  {
    const match = srcRouter.match( request.url );

    if ( match )
    {
      const builtMatch = buildRouter.match( request );

      if ( !builtMatch )
      {
        return new Response( "builtMatch not found", { status: 500 } );
      }

      let html = await Bun.file( './index.html' ).text();
      const css = (await import(BUILD_DIR + '/client/assets/main.js')).default

      const page = await createApp( match.filePath );
   
      
      const stream = await renderToString( page.app );

                  // set the page javascript we want to fetch for client
      html = html.replace( '{{ dynamicPath }}', '/pages/' + builtMatch.src )
                  // add the server side html to the html markup
                 .replace( '<!--htmlIndex-->', stream )
                 // inline the css, i dont know if this is bad or not
                 .replace( '<!--html-head-->', `<style type="text/css">${ css }</style>`);

      // send the finalized html
      return new Response( html, {
        headers: { "Content-Type": "text/html;charset=utf-8" },
      } );
    }
  } catch ( error )
  {
    // do something here if the request should have been processed
  }

}


// basic Bun native server to serve our app
export default {
  port,
  async fetch ( request ) {

    const routerResponse = await serveFromRouter( request );
    if ( routerResponse )
    {
      return routerResponse;
    }
    let reqPath = new URL( request.url ).pathname;
    if ( reqPath === "/" )
    {
      reqPath = "/index.html";
    }

    const serveDirectory = serveFromDir( serveDirectories, reqPath );
    if ( serveDirectory )
    {
      return serveDirectory;
    }

    return new Response( "File not found", {
      status: 404,
    } );
  },
} satisfies ServeOptions;

const end = Bun.nanoseconds()
logger.box( `http://localhost:${port}` , '\nready in', (end - timer) / 1e9);
// logger.log((end - timer) / 1e9);


