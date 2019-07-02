# Living Archive

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Environment variables

Rename the example `.env-example` file to `.env` and add the necessary secret keys.

- `MAPTILER_KEY`: your [Maptiler Cloud](https://www.maptiler.com/cloud/) key.
- `BASE_URL`: base URL to the application root (defaults to `http://localhost:3000`).
- `RDF_URL`: base URL for the RDF server.
- `ELASTIC_ENDPOINT`: base URL for the ElasticSearch server.
