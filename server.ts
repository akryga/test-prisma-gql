import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import "reflect-metadata";
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { createYoga, createSchema } from 'graphql-yoga';
import { resolvers } from "./prisma/generated/type-graphql/index";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "@prisma/client";


import { fileURLToPath } from 'node:url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The Express app is exported so that it can be used by serverless Functions.
export async function app() {

 
// Bind GraphQL Yoga to the graphql endpoint to avoid rendering the playground on any path

  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const prisma = new PrismaClient();
  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);
  const schema = await buildSchema({
    resolvers,
    validate: false,
  });

  //  const schema = makeExecutableSchema({ resolvers });

  const yoga = createYoga({
    schema, 
    context: () => ({ prisma })
  })
  server.use(yoga.graphqlEndpoint, yoga)
  
  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  
  const port = process.env['PORT'] || 4000;
    server.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  // return server;
}

app()
  .catch(console.error)

// function run(): void {
//   const port = process.env['PORT'] || 4000;

//   // Start up the Node server
//   const server = app();
//   server.listen(port, () => {
//     console.log(`Node Express server listening on http://localhost:${port}`);
//   });
// }

// run();

