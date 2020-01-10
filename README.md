# generator-next-prismic

> Create a next-prismic project with yo

This generator will create a project with React, Typescript and Next.js to allow server side rendering and improving SEO on our site. Also the result project will be connected to Prismic.io Headless CMS for retrieving data.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-next-prismic using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-next-prismic
```

Then to generate your new project (in any other folder) run the following:

```bash
yo next-prismic
```

## About the generated project

It will create a React Typescript based project using Next.js framework to allow server side rendering and improving SEO on the site. And all content of the site is fetched from Prismic through a simple API.

The app is set as a PWA (Progressive Web App) providing:

- Server-side rendering with Next.js
- A Node.js Express server with gzip compression
- In the server an API connected to Prismic to deliver content to the client
- Offline support with a service worker
- A manifest and robots.txt files
- Linting & code formatting with Eslint, Prettier, Airbnb rules ...
- Styling with SCSS files and with Autoprefixer. Also allows to add custom PostCSS config.
- A Redux store to get the content from the API

## Next.js dynamic Page content with Prismic (process)

1. Next-routes matches home route and passes control to Page container.
2. Page container calls `getInitialProps` with required path as param.
3. `getInitialProps` function makes path adjustments and dispatches getPage with `${pathId}` as page id and `${lang}` as language of the page
4. `getPage` action makes API call `/api-page?id=...`
   1. server `api-page` passes request to `prismicApi.getDocumentsPage`
   2. `getDocumentsPage` searches in cache `content-result-${page}`
   3. Assuming we don’t have `content-result-${page}` in cache, we’re calling getDocument for `${page}` with the proper language and all entries from COMMON_DOCUMENTS array. `COMMON_DOCUMENTS` entries are Prismic types keys (like `navbar`, `footer` , etc.)
   4. getPage function `assembles` all returned data
5. contentReducer consumes `FETCH_CONTENT` and change store `content`
6. Page component renders page using Helmet, Layout -> ContentBlocks and other components

## Export (Ideal for Serverless approach)

Now there is an option to generate static HTML version of app executing following command.

```bash
npm run export
```

And the app will be built into /build folder. This way we can have in place a system to work with a serverless option.

## About the generator

The generator is done with Yeoman. [Learn more about Yeoman](http://yeoman.io/).

## Stay up to date

In order to stay up to date with the last version of this generator, run the following:

```bash
npm install -g generator-next-prismic
```

## License

MIT © [Appico](http://appico.com)
