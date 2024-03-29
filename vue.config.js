const path = require('path')
const fs = require('fs')
const Path = require('path')
const IgnoreNotFoundExportPlugin = require('./build/ignore-not-found-plugin')
const LessPluginFunction = require('less-plugin-functions')
const { mockerApi } = require('webpack-mocker-api')
const WebpackHotRelease = require('webpack-hot-release/plugin')
const WebpackExternalVendorPlugin = require('webpack-external-vendor-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const openInEditor = require('express-open-in-editor')

const resolve = dir => path.resolve(__dirname, dir)

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOCAL_API_ENV: process.env.LOCAL_API_ENV || 'dev',
  PAGE_ENV: process.env.PAGE_ENV || ''
}

const IS_DEV = env.NODE_ENV !== 'production'
const IS_PROD = env.NODE_ENV === 'production'

const localApiEnvHostTarget = {
  dev: 'https://saas.dev.styd.cn',
  test: 'https://saas.test.styd.cn',
  pre: 'https://saas.pre.styd.cn',
  prod: 'https://pro.styd.cn'
}[env.LOCAL_API_ENV]

const LOCAL_WS_HOST = {
  dev: 'wss://api-saas-dev.styd.cn',
  test: 'wss://api-saas-test.styd.cn',
  pre: 'wss://api-saas-pre.styd.cn',
  prod: 'wss://api-saas.styd.cn'
}[env.LOCAL_API_ENV]

const YapiHost = 'https://doc.styd.cn'

const createTieredCacheGroups = () => {
  const _config = {
    default: false,
    vendors: false
  }
  for (let i = 99; i > 1; i--) {
    _config['tier-' + i] = {
      reuseExistingChunk: true,
      minChunks: i
    }
  }
  return _config
}

module.exports = {
  pages: {
    app: {
      entry: 'src-entries/app/index.ts',
      template: 'src-entries/app/index.html',
      filename: 'index.html',
      inject: false
    },
    account: {
      entry: 'src-entries/account/index.ts',
      template: 'src-entries/account/index.html',
      filename: 'account/index.html',
      inject: false
    },
    ticket: {
      entry: 'src-entries/ticket/index.ts',
      template: 'src-entries/ticket/index.html',
      filename: 'ticket/index.html',
      inject: false
    }
  },

  lintOnSave: false,
  css: {
    sourceMap: IS_DEV,
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        plugins: [new LessPluginFunction()]
      }
    }
  },
  productionSourceMap: IS_DEV,
  pluginOptions: {
    // https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        resolve('src/style/_vars.less'),
        resolve('src/style/_mixins.less')
      ]
    }
  },
  devServer: {
    disableHostCheck: true,
    watchContentBase: true,
    proxy: {
      '/_api': {
        target: localApiEnvHostTarget,
        changeOrigin: true
      },
      '/mock': {
        target: YapiHost,
        changeOrigin: true
      }
    },
    before(app) {
      if (!fs.existsSync('./mock/index.js')) {
        throw new Error(
          '[saas-pro] 没有发现mock/index.js 请从mock-tpl.js 复制一份到mock/index.js'
        )
      }
      mockerApi(app, Path.resolve('./mock/index.js'))
      app.use(
        '/_editor',
        openInEditor({
          editor: 'code'
        })
      )
    },
    port: 8060
  },
  // webpack-chain docs see https://www.npmjs.com/package/webpack-chain
  chainWebpack: config => {
    // 去除preload
    config.plugins.delete('preload-app')
    // 去除prefetch
    config.plugins.delete('prefetch-app')
    // 去除preload
    config.plugins.delete('preload-account')
    // 去除prefetch
    config.plugins.delete('prefetch-account')
    // 去除preload
    config.plugins.delete('preload-ticket')
    // 去除prefetch
    config.plugins.delete('prefetch-ticket')

    // 默认4096
    // config.module
    //   .rule('images')
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .tap(options => Object.assign(options, { limit: 4096 }))

    config.when(IS_PROD, config => {
      config.toConfig().optimization.minimizer[0].options.terserOptions.compress.drop_console = true

      const splitConfig = {
        chunks: 'all',
        minSize: 4096, // 最小size 4kb 即只要分包大于4kb就分离
        minChunks: 1,
        maxAsyncRequests: 99, // 最大的
        maxInitialRequests: 99,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: createTieredCacheGroups()
      }
      for (let k in splitConfig) {
        config.toConfig().optimization.splitChunks[k] = splitConfig[k]
      }

      // config
      //   .plugin('compression')
      //   .use(CompressionWebpackPlugin, [
      //     {
      //       test: /\.(js|css|html|svg)$/,
      //       algorithm: 'gzip',
      //       cache: true,
      //       threshold: 10240,
      //       deleteOriginalAssets: false
      //     }
      //   ])
      //   .end()
    })

    // 默认未开启
    config.module
      .rule('svg')
      .use('file-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }))

    config
      .externals({
        vue: 'window.Vue',
        'vue-router': 'window.VueRouter',
        moment: 'window.moment',
        'ant-design-vue': 'window.antd',
        immer: 'window.immer'
      })
      .plugin('hot-release')
      .use(WebpackHotRelease)
      .end()
      .plugin('external-vendor')
      .use(WebpackExternalVendorPlugin, [
        {
          filename: 'js/[name].[hash:8][ext]',
          entry: {
            'base-vendors': [
              IS_DEV ? 'vue/dist/vue.js' : 'vue/dist/vue.min.js',
              IS_DEV
                ? 'vue-router/dist/vue-router.js'
                : 'vue-router/dist/vue-router.min.js',
              'moment/min/moment.min.js',
              'moment/locale/zh-cn.js',
              IS_DEV
                ? 'ant-design-vue/dist/antd.js'
                : 'ant-design-vue/dist/antd.min.js',
              'immer/dist/immer.umd.js'
              // IS_DEV // IS_DEV
              //   ? 'rxjs/bundles/rxjs.umd.js'
              //   : 'rxjs/bundles/rxjs.umd.min.js'
              // IS_DEV ? 'lodash/lodash.js' : 'lodash/lodash.min.js'
            ],
            'base-style': ['./antd.css']
          }
        }
      ])
      .end()

    // ignore no export warning by ts
    config
      .plugin('ignore-not-found-export')
      .before('vue-loader')
      .use(IgnoreNotFoundExportPlugin)
      .end()

    config.when(IS_DEV, config => {
      config.module.rules.delete('eslint')
    })
    config.plugin('define').tap(definitions => {
      definitions[0] = Object.assign(definitions[0], {
        'process.env': {
          BASE_URL: JSON.stringify('/'),
          NODE_ENV: JSON.stringify(env.NODE_ENV),
          LOCAL_API_ENV: JSON.stringify(env.LOCAL_API_ENV),
          LOCAL_WS_HOST: JSON.stringify(LOCAL_WS_HOST),
          PAGE_ENV: JSON.stringify(env.PAGE_ENV)
        }
      })
      return definitions
    })
    // config.plugins.delete('progress')
    config.resolve.alias.set(
      'vue-service-app',
      path.join(__dirname, '/vue-service-app')
    )
    config.resolve.alias.set('rx-state', path.join(__dirname, '/rx-state'))

    config.module.noParse(
      content => /st-g2/.test(content) || /st-data-set/.test(content)
    )
    return config
  }
}
