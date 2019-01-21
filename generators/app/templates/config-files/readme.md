# <%= websiteFullName %>

This is a React Typescript based project using [Next.js](https://github.com/zeit/next.js) framework to allow server side rendering and improving SEO on our site.

The app is set as a PWA (Progressive Web App) providing:

- Server-side rendering with Next.js
- Offline support with a service worker for HTTPS
- A manifest and robots.txt files
- Linting & code formatting with Eslint, Prettier, Airbnb rules ...
- Styling with SCSS files and with Autoprefixer. As well allows also to add custom PostCSS config.
- A small Node.js Express server with gzip compression
- In the server an example small API has been defined to deliver content to the client
- A Redux store to get the content from the API, with examples of querying the content on start

### Development

Start a live-reload development server:

```sh
yarn dev
```

Generate a production build:

```sh
yarn build
```

### Prismic

This version of the project uses Prismic as Headless CMS
In order to work with it the project needs the following information to be set as environment variables:

```sh
CONTENT_API_URL=https://{prismic-project-name}.cdn.prismic.io/api/v2
CONTENT_API_TOKEN={prismic-project-content-api-token}
```

The idea behind this example is to create a Prismic repeatable document called `Page`. This type would contain different slides for any component block needed.

By defining such components inside the components folder and adding them in `ContentBlock` component, you will have them dynamic appear when the user adds them in any slide of any Page.

As well there are some other fixed (non-repeatable) types needed like `Navbar`, `Footer` & `Page-404`.

### Sitemap creation

For the sitemap automatic creation the following information is needed to be set as environment variables:

```sh
SITE_ROOT={project-root-url}
```

#### Do not forget

- Define 404 page
- Define Open graph images
- Legal pages
- Cookie disclaimer (if needed)
- Favicon/Logo in several sizes for manifest
- Define a colour for the manifest (used in Android for the Chrome search-bar)
