# <%= websiteFullName %>

### Installation

Clone repo:

```sh
git clone <%= githubRepoUrl %>
cd <%= websiteName %>
```

Install the dependencies:

```sh
npm run install
```


### Development

Start a live-reload development server:

```sh
npm run dev
```

### Deployment

Create a file called `.env`, with the following contents:

.env

```sh
CONTENT_API_URL=<%= prismicApiURL %>
CONTENT_API_TOKEN=<%= prismicApiToken %>
SITE_ROOT=<%= websiteURL %>
``` 

Generate a production build:

```sh
npm run build
```

Run the app:

```sh
npm run start
```

App will be served on port 3000.
