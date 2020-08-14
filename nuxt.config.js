const pkg = require('./package')
const webpack = require('webpack')
const { basename } = require('path')
require('dotenv').config()

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@mgiraldo' },
      { name: 'twitter:creator', content: '@mgiraldo' },
      { name: 'twitter:title', content: 'Living Archive' },
      { name: 'twitter:description', content: pkg.description },
      {
        name: 'twitter:image',
        content: process.env.BASE_URL + '/screenshot.png',
      },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'rgb(232, 232, 232)' },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vue-d3',
    {
      src: '~/plugins/vue-mapboxgl',
      ssr: false,
    },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
  ],

  /*
   ** Environment variables
   */
  env: {
    MAPTILER_KEY: process.env.MAPTILER_KEY,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    RDF_URL: process.env.RDF_URL,
    ELASTIC_URL: process.env.ELASTIC_URL,
    ELASTIC_BASIC_AUTH: process.env.ELASTIC_BASIC_AUTH,
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Server middleware for export
   */
  serverMiddleware: [{ path: '/export', handler: '~/export/index.js' }],

  styleResources: {
    scss: ['~/assets/css/variables.scss', '~/assets/css/mixins.scss'],
  },

  /*
   ** Build configuration
   */
  build: {
    splitChunks: { layouts: true },
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: 'mapbox-gl',
      }),
    ],
    extend(config) {
      config.devtool = 'source-map'

      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))

      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader',
        options: {
          svgo: {
            plugins: [
              { collapseGroups: false },
              { removeEmptyContainers: false },
              {
                prefixIds: {
                  prefix: (node, { path }) => basename(path, '.svg'),
                  delim: '-',
                },
              },
              { cleanupIDs: { remove: false, minify: false } },
            ],
          },
        },
      })
    },
  },
}
