export default {

  target: 'server',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - HappyMatchPanel',
    title: 'HappyMatchPanel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  // plugins: [
  // ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // Doc: https://http.nuxtjs.org
    '@nuxt/http',
    // https://www.npmjs.com/package/@nuxtjs/toast
    '@nuxtjs/toast',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
   axios: {
     baseURL: 'https://hmb-eta.vercel.app', },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  toast: {
    position: 'top-right',
    register: [ // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error'
        }
      }
    ]
},

router: {
  middleware: 'redirects',
  extendRoutes (routes, resolve) {
    routes.push({
      name: 'custom',
      path: '*',
      component: resolve(__dirname, 'pages/404.vue')
    })
  }
},

  serverMiddleware: ['~/api/index.js'],
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
