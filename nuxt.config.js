const pkg = require('./package')
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
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vue-d3',
    '~/plugins/vue-fragment',
    {
      src: '~/plugins/vue-layers',
      ssr: false
    }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    'nuxt-leaflet',
    '~/modules/vue-layers'
  ],

  /*
   ** Environment variables
   */
  env: {
    MAPTILER_KEY: process.env.MAPTILER_KEY,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    RDF_URL: process.env.RDF_URL,
    ELASTIC_URL: process.env.ELASTIC_URL
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  styleResources: {
    scss: ['~/assets/css/variables.scss', '~/assets/css/mixins.scss']
  },

  /*
   ** Build configuration
   */
  build: {
    splitChunks: { layouts: true },
    extend(config) {
      config.devtool = 'source-map'

      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))

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
                  delim: '-'
                }
              },
              { cleanupIDs: { remove: false, minify: false } }
            ]
          }
        }
      })
    }
  }
}
