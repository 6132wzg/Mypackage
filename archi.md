# saas-pro 架构

## 技术栈

### 前端
* [webpack](https://webpack.js.org/)
* [vue-cli](https://cli.vuejs.org/)

* [typescript]
* [vue-service-app](./vue-service-app/readme.md)
* [rx-state](./rx-state/readme.md)

* [ant-design-vue](https://www.npmjs.com/package/ant-design-vue)
- [vue](https://cn.vuejs.org/)
- [vue-modal-router](https://www.npmjs.com/package/vue-modal-router)

## 环境
### 开发环境
* 域名 https://saas.dev.styd.cn
* 服务器 saas-dev
* jenkins fe-pro-web

### test环境
* 域名 https://saas.test.styd.cn
* 服务器 saas-test
* jenkins fe-pro-web

### pre环境
* 域名 https://saas.pre.styd.cn
* 服务器 saas-pre
* jenkins fe-pro-web

### 生产环境
* 域名 https://pro.styd.cn
* 分支 master
* 服务器 saas-nginx-m
* jenkins prod-web-m

## 服务器nginx配置路径
/application/openresty/nginx/conf/extra/saas.conf
