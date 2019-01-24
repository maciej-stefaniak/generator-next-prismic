# generator-next-prismic

> Create a next-prismic project with yo

This generator will create a project with React, Typescript and Next.js to allow server side rendering and improving SEO on our site.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-next-prismic using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
```

Then clone this repository and link the generator

```bash
git clone https://github.com/jonanderdev/generator-next-prismic
cd generator-next-prismic
yarn install
npm link
```

Then to generate your new project (in any other folder) run the following:

```bash
yo next-prismic
```

## About the generated project

It will create a React Typescript based project using Next.js framework to allow server side rendering and improving SEO on the site.

The app is set as a PWA (Progressive Web App) providing:

- Server-side rendering with Next.js
- Offline support with a service worker
- A manifest and robots.txt files
- Linting & code formatting with Eslint, Prettier, Airbnb rules ...
- Styling with SCSS files and with Autoprefixer. Also allows to add custom PostCSS config.
- A small Node.js Express server with gzip compression
- In the server an example small API has been defined to deliver content to the client
- A Redux store to get the content from the API, with examples of querying the content on start

## About the generator

In order to stay up to date with the last version of this generator, go to the folder containing your clonned version of this repository pull the changes and link it again.

To achieve that, run the following on the terminal inside your cloned folder `generator-next-prismic`:

```bash
git pull origin master
yarn install
npm link
```

The generator is done with Yeoman. [Learn more about Yeoman](http://yeoman.io/).

## License

MIT © [Jon Ander Pérez]()
