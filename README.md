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

It will create a React Typescript based project using Next.js framework to allow server side rendering and improving SEO on the site.

The app is set as a PWA (Progressive Web App) providing:

- Server-side rendering with Next.js
- A Node.js Express server with gzip compression
- In the server an API connected to Prismic to deliver content to the client
- Offline support with a service worker
- A manifest and robots.txt files
- Linting & code formatting with Eslint, Prettier, Airbnb rules ...
- Styling with SCSS files and with Autoprefixer. Also allows to add custom PostCSS config.
- A Redux store to get the content from the API

## About the generator

The generator is done with Yeoman. [Learn more about Yeoman](http://yeoman.io/).

## Stay up to date

In order to stay up to date with the last version of this generator, run the following:

```bash
npm update -g generator-next-prismic
```

## License

MIT © [Jon Ander Pérez]()
