(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["brand-stat-orders"],{"0f91":function(e,t,r){"use strict";r.d(t,"a",(function(){return l}));r("6b54"),r("2397");var n=r("d225"),a=r("b0b4"),o=r("308d"),c=r("6bb5"),i=r("4e2b"),d=r("de46");function u(e){return function(){var t,r=Object(c["a"])(e);if(s()){var n=Object(c["a"])(this).constructor;t=Reflect.construct(r,arguments,n)}else t=r.apply(this,arguments);return Object(o["a"])(this,t)}}function s(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}var l=function(e){Object(i["a"])(r,e);var t=u(r);function r(){return Object(n["a"])(this,r),t.apply(this,arguments)}return Object(a["a"])(r,[{key:"getChart",value:function(e){return this.http.get("/v1/report/order-collect/brand/summer",{query:e})}},{key:"getData",value:function(e){return this.http.get("/v1/report/order-collect/brand/list",{query:e})}},{key:"getDataTotal",value:function(e){return this.http.get("/v1/report/order-collect/brand/list_total",{query:e})}},{key:"getAnalyseData",value:function(e){return this.http.get("/v1/report/order-analysis/brand/list",{query:e})}}]),r}(d["a"])},2700:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{class:e.b()},[r("div",{class:e.b("section")},[r("header",{class:e.bHeader("header")},[r("div",{class:e.bHeader("button-wapper")},[e.auth.export?r("st-button",{directives:[{name:"export-excel",rawName:"v-export-excel",value:{type:"brand/order_collect_export",query:e.$searchQuery},expression:"{\n            type: 'brand/order_collect_export',\n            query: $searchQuery\n          }"}],attrs:{type:"primary"}},[e._v("\n          全部导出\n        ")]):e._e()],1),r("div",{class:e.bHeader("actions")},[r("shop-select",{on:{change:function(t){return e.onSingleSearch("shop_id",t)}},model:{value:e.$searchQuery.shop_id,callback:function(t){e.$set(e.$searchQuery,"shop_id",t)},expression:"$searchQuery.shop_id"}}),r("st-recent-radio-group",{attrs:{value:e.$searchQuery},on:{change:e.onChangeDataDays}})],1)]),r("st-total",{class:e.b("total"),attrs:{indexs:e.totalColumns,dataSource:e.total,slidesPerView:"auto",hasTitle:""},scopedSlots:e._u([{key:"order_num",fn:function(t){return r("a",{on:{click:function(r){return e.showOrdersModal(t,-1)}}},[r("st-total-item",{attrs:{unit:t.unit,label:t.label,value:t.value}})],1)}},{key:"order_completed_num",fn:function(t){return r("a",{on:{click:function(r){return e.showOrdersModal(t,2)}}},[r("st-total-item",{attrs:{unit:t.unit,label:t.label,value:t.value}})],1)}},{key:"order_uncompleted_num",fn:function(t){return r("a",{on:{click:function(r){return e.showOrdersModal(t,1)}}},[r("st-total-item",{attrs:{unit:t.unit,label:t.label,value:t.value}})],1)}},{key:"order_refund_num",fn:function(t){return r("a",{on:{click:function(r){return e.showOrdersModal(t,4)}}},[r("st-total-item",{attrs:{unit:t.unit,label:t.label,value:t.value}})],1)}},{key:"order_cancel_num",fn:function(t){return r("a",{on:{click:function(r){return e.showOrdersModal(t,3)}}},[r("st-total-item",{attrs:{unit:t.unit,label:t.label,value:t.value}})],1)}},{key:"order_part_refund_num",fn:function(t){return r("a",{on:{click:function(r){return e.showOrdersModal(t,5)}}},[r("st-total-item",{attrs:{unit:t.unit,label:t.label,value:t.value}})],1)}}])}),r("st-table",{staticClass:"mg-t16",attrs:{rowKey:function(e,t){return t},loading:e.loading.getList,columns:e.columns,scroll:{x:1400},dataSource:e.list,stripe:!1,rowSpanKey:[{key:"transfer_type",formatter:function(t){return e.transferType[t]}}]},on:{change:e.onTableChange},scopedSlots:e._u([{key:"product_type",fn:function(t){return r("span",{},[e._v("\n        "+e._s(e._f("enumFilter")(t,"report.revenue_product_type"))+"\n      ")])}},{key:"order_num",fn:function(t,n){return r("a",{on:{click:function(t){return e.showOrdersModal(n,-1,"table")}}},[e._v("\n        "+e._s(t)+"\n      ")])}},{key:"order_completed_num",fn:function(t,n){return r("a",{on:{click:function(t){return e.showOrdersModal(n,2,"table")}}},[e._v("\n        "+e._s(t)+"\n      ")])}},{key:"order_uncompleted_num",fn:function(t,n){return r("a",{on:{click:function(t){return e.showOrdersModal(n,1,"table")}}},[e._v("\n        "+e._s(t)+"\n      ")])}},{key:"order_refund_num",fn:function(t,n){return r("a",{on:{click:function(t){return e.showOrdersModal(n,4,"table")}}},[e._v("\n        "+e._s(t)+"\n      ")])}},{key:"order_cancel_num",fn:function(t,n){return r("a",{on:{click:function(t){return e.showOrdersModal(n,3,"table")}}},[e._v("\n        "+e._s(t)+"\n      ")])}},{key:"order_part_refund_num",fn:function(t,n){return r("a",{on:{click:function(t){return e.showOrdersModal(n,5,"table")}}},[e._v("\n        "+e._s(t)+"\n      ")])}}])})],1)])},a=[],o=(r("8e6e"),r("ac6a"),r("456d"),r("bd86")),c=r("b346"),i=r("1044"),d=r("b513"),u=r("f35f"),s=r("356b"),l=r("ea3e"),p=function(e){return[{title:"订单类型",width:80,align:"center",dataIndex:"transfer_type"},{title:"商品类型",scopedSlots:{customRender:"product_type"},width:120,dataIndex:"product_type"},{title:"订单总数",scopedSlots:{customRender:"order_num"},width:100,dataIndex:"order_num"},{title:"已完成订单",scopedSlots:{customRender:"order_completed_num"},width:100,dataIndex:"order_completed_num"},{title:"未完成订单",scopedSlots:{customRender:"order_uncompleted_num"},width:100,dataIndex:"order_uncompleted_num"},{title:"已退款订单",scopedSlots:{customRender:"order_refund_num"},width:100,dataIndex:"order_refund_num"},{title:"部分退款订单",scopedSlots:{customRender:"order_part_refund_num"},width:100,dataIndex:"order_part_refund_num"},{title:"已取消订单",scopedSlots:{customRender:"order_cancel_num"},width:100,dataIndex:"order_cancel_num"},{title:"实收金额(元)",width:100,dataIndex:"paid_price"},{title:"剩余应收(元)",width:100,dataIndex:"remainder_price"},{title:"退款(元)",width:100,dataIndex:"refund_price"},{title:"原价(元)",width:100,dataIndex:"total_price"},{title:"营销优惠(元)",width:100,dataIndex:"order_discount"},{title:"商家减免(元)",width:100,dataIndex:"reduce_price"}]},f=function(){return[{title:"订单总数",scopedSlots:{customRender:"order_num"},dataIndex:"order_num"},{title:"已完成订单",scopedSlots:{customRender:"order_completed_num"},dataIndex:"order_completed_num"},{title:"未完成订单",scopedSlots:{customRender:"order_uncompleted_num"},dataIndex:"order_uncompleted_num"},{title:"已退款订单",scopedSlots:{customRender:"order_refund_num"},dataIndex:"order_refund_num"},{title:"部分退款订单",scopedSlots:{customRender:"order_part_refund_num"},dataIndex:"order_part_refund_num"},{title:"已取消订单",scopedSlots:{customRender:"order_cancel_num"},dataIndex:"order_cancel_num"},{title:"实收金额",unit:"¥",dataIndex:"paid_price"},{title:"剩余应收",unit:"¥",dataIndex:"remainder_price"},{title:"退款",unit:"¥",dataIndex:"refund_price"},{title:"原价",unit:"¥",dataIndex:"total_price"},{title:"营销优惠",unit:"¥",dataIndex:"order_discount"},{title:"商家减免",unit:"¥",dataIndex:"reduce_price"}]},h=r("c32d"),_=r.n(h);function y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function b(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?y(Object(r),!0).forEach((function(t){Object(o["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):y(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var m={name:"BrandStatOrdersGather",mixins:[l["a"]],modals:{StatDetailListModal:u["a"]},serviceInject:function(){return{gatherService:s["GatherService"]}},rxState:function(){var e=this.gatherService,t=e.list$,r=e.transferType$,n=e.total$,a=e.auth$,o=e.loading$;return{list:t,transferType:r,total:n,auth:a,loading:o}},bem:{b:"page-brand-stat-orders-gather",bHeader:"page-brand-stat-header"},data:function(){return{}},computed:{columns:p,totalColumns:f},created:function(){},methods:{moment:_.a,onChangeDataDays:function(e){this.$searchQuery.day=e.recently_day||void 0,this.$searchQuery.start_date=e.start_date||void 0,this.$searchQuery.end_date=e.end_date||void 0,this.onSearch()},showOrdersModal:function(e,t,r){var n="table"===r?{product_type:e.product_type,transfer_type:e.transfer_type}:{};this.$modalRouter.push({name:"stat-detail-list-modal",props:{query:b({},this.$searchQuery,{order_status:t},n),title:"订单明细",type:"brand-orders-gather"}})}},components:{shopSelect:c["a"],StTotal:i["a"],StTotalItem:d["a"]}},v=m,O=r("2877"),g=Object(O["a"])(v,n,a,!1,null,null,null);t["default"]=g.exports},"356b":function(e,t,r){"use strict";r.r(t),r.d(t,"GatherService",(function(){return m}));var n,a,o,c,i=r("75fc"),d=r("d225"),u=r("b0b4"),s=r("9ab4"),l=r("0cd5"),p=r("df29"),f=r("c4cc"),h=r("0f91"),_=r("2138"),y=r("2cbb"),b=r("c170"),m=function(){function e(t,r,n){Object(d["a"])(this,e),this.orderApi=t,this.userService=r,this.authService=n,this.loading$=new p["d"]({}),this.list$=new p["d"]([]),this.total$=new p["d"]({}),this.transferType$=this.userService.getEnumValue$("report.report_transfer_type"),this.auth$=this.authService.authMap$({export:"brand:stat:order|collect_export"})}return Object(u["a"])(e,[{key:"getList",value:function(e){var t=this;return this.orderApi.getData(e).pipe(Object(f["a"])((function(e){var r=[];e.list.map((function(e){return r=[].concat(Object(i["a"])(r),Object(i["a"])(e.list))})),t.list$.commit((function(){return r}))})))}},{key:"getDataTotal",value:function(e){var t=this;return this.orderApi.getDataTotal(e).pipe(Object(f["a"])((function(e){t.total$.commit((function(){return e.info}))})))}},{key:"beforeEach",value:function(e,t){return Object(b["a"])(this.getList(e.meta.query),this.getDataTotal(e.meta.query))}}]),e}();Object(s["b"])([Object(p["c"])(),Object(s["d"])("design:type",Function),Object(s["d"])("design:paramtypes",["function"===typeof(n="undefined"!==typeof h["OrderDataParams"]&&h["OrderDataParams"])?n:Object]),Object(s["d"])("design:returntype",void 0)],m.prototype,"getList",null),m=Object(s["b"])([Object(l["b"])(),Object(s["d"])("design:paramtypes",["function"===typeof(a="undefined"!==typeof h["a"]&&h["a"])?a:Object,"function"===typeof(o="undefined"!==typeof _["a"]&&_["a"])?o:Object,"function"===typeof(c="undefined"!==typeof y["a"]&&y["a"])?c:Object])],m)},b346:function(e,t,r){"use strict";var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("a-select",{style:{width:e.width},attrs:{mode:e.mode,placeholder:e.placeholder||"请选择门店",value:e.cValue,dropdownMatchSelectWidth:!1,defaultValue:e.defaultValue,disabled:e.disabled,options:e.shopOptions},on:{change:e.onChange}})},a=[],o=(r("c5f6"),r("75fc")),c=r("2138"),i={model:{prop:"value",event:"change"},name:"ShopSelect",serviceInject:function(){return{userService:c["a"]}},rxState:function(){return{shopList:this.userService.shopList$}},computed:{cValue:{set:function(e){this.$emit("change",e)},get:function(){return this.value||this.defaultValue}},shopOptions:function(){var e="form"===this.useType?[]:[{label:"全部门店",value:-1}];return[].concat(e,Object(o["a"])(this.shopList.map((function(e){return{label:e.shop_name,value:e.shop_id}}))))}},props:{mode:{type:String},placeholder:{type:String},useType:{type:String},width:{type:String,default:"150px"},value:{type:[Number,String,Array]},defaultValue:Number,disabled:{type:Boolean,default:!1}},methods:{onChange:function(e){this.$emit("change",e)}}},d=i,u=r("2877"),s=Object(u["a"])(d,n,a,!1,null,null,null);t["a"]=s.exports},f161:function(e,t,r){"use strict";r.r(t),r.d(t,"AnalyseService",(function(){return h}));var n,a,o,c=r("d225"),i=r("b0b4"),d=r("9ab4"),u=r("0cd5"),s=r("df29"),l=r("c4cc"),p=r("0f91"),f=r("2cbb"),h=function(){function e(t,r){Object(c["a"])(this,e),this.orderApi=t,this.authService=r,this.loading$=new s["d"]({}),this.list$=new s["d"]([]),this.auth$=this.authService.authMap$({export:"brand:stat:order|analysis_export"})}return Object(i["a"])(e,[{key:"getList",value:function(e){var t=this;return this.orderApi.getAnalyseData(e).pipe(Object(l["a"])((function(e){t.list$.commit((function(){return e.list}))})))}},{key:"beforeEach",value:function(e,t){return this.getList(e.meta.query)}}]),e}();Object(d["b"])([Object(s["c"])(),Object(d["d"])("design:type",Function),Object(d["d"])("design:paramtypes",["function"===typeof(n="undefined"!==typeof p["OrderDataParams"]&&p["OrderDataParams"])?n:Object]),Object(d["d"])("design:returntype",void 0)],h.prototype,"getList",null),h=Object(d["b"])([Object(u["b"])(),Object(d["d"])("design:paramtypes",["function"===typeof(a="undefined"!==typeof p["a"]&&p["a"])?a:Object,"function"===typeof(o="undefined"!==typeof f["a"]&&f["a"])?o:Object])],h)},f32b:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{class:e.b()},[r("div",{class:e.b("section")},[r("header",{class:e.bHeader("header")},[r("div",{class:e.bHeader("button-wapper")},[e.auth.export?r("st-button",{directives:[{name:"export-excel",rawName:"v-export-excel",value:{type:"brand/order_analysis_export",query:e.$searchQuery},expression:"{\n            type: 'brand/order_analysis_export',\n            query: $searchQuery\n          }"}],attrs:{type:"primary"}},[e._v("\n          全部导出\n        ")]):e._e()],1),r("div",{class:e.bHeader("actions")},[r("shop-select",{on:{change:function(t){return e.onSingleSearch("shop_id",t)}},model:{value:e.$searchQuery.shop_id,callback:function(t){e.$set(e.$searchQuery,"shop_id",t)},expression:"$searchQuery.shop_id"}}),r("st-recent-radio-group",{attrs:{value:e.$searchQuery},on:{change:e.onChangeDataDays}})],1)]),r("st-table",{staticClass:"mg-t16",attrs:{rowKey:function(e,t){return t},loading:e.loading.getList,columns:e.columns,scroll:{x:1e3},page:!1,dataSource:e.list},on:{change:e.onTableChange},scopedSlots:e._u([{key:"product_type",fn:function(t){return r("span",{},[e._v("\n        "+e._s(e._f("enumFilter")(t,"report.revenue_product_type"))+"\n      ")])}},{key:"order_per_price",fn:function(t,n){return r("a",{directives:[{name:"modal-link",rawName:"v-modal-link",value:{name:"stat-per-detail-list-modal",props:{query:Object.assign({},e.$searchQuery,{product_type:n.product_type}),title:"客单价日明细",type:"brand-orders-analyse"}},expression:"{\n          name: 'stat-per-detail-list-modal',\n          props: {\n            query: {\n              ...$searchQuery,\n              product_type: record.product_type\n            },\n            title: '客单价日明细',\n            type: 'brand-orders-analyse'\n          }\n        }"}]},[e._v("\n        "+e._s(t)+"\n      ")])}},{key:"order_num",fn:function(t,n){return r("a",{on:{click:function(t){return e.showOrdersModal(n)}}},[e._v("\n        "+e._s(t)+"\n      ")])}},{key:"online_total_num",fn:function(t,n){return r("a",{on:{click:function(t){return e.showOrdersModal(n,2)}}},[e._v("\n        "+e._s(t)+"\n      ")])}}])})],1)])},a=[],o=(r("8e6e"),r("ac6a"),r("456d"),r("bd86")),c=r("b346"),i=r("f35f"),d=r("919a"),u=r("f161"),s=r("ea3e"),l=function(){return[{title:"商品类型",scopedSlots:{customRender:"product_type"},width:120,dataIndex:"product_type"},{title:"客单价(元)",scopedSlots:{customRender:"order_per_price"},width:100,dataIndex:"order_per_price"},{title:"总成单数",scopedSlots:{customRender:"order_num"},width:100,dataIndex:"order_num"},{title:"日均单量",width:100,dataIndex:"day_per_order_num"},{title:"实收金额(元)",width:100,dataIndex:"paid_price"},{title:"原价(元)",width:100,dataIndex:"total_price"},{title:"折扣",width:80,dataIndex:"discount_percentage"},{title:"单日最高(元)",width:100,dataIndex:"day_max_price"},{title:"线上成单",scopedSlots:{customRender:"online_total_num"},width:100,dataIndex:"online_total_num"},{title:"线上实收(元)",width:100,dataIndex:"online_paid_price"}]},p=r("c32d"),f=r.n(p);function h(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function _(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?h(Object(r),!0).forEach((function(t){Object(o["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):h(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var y={name:"BrandStatOrdersAnalyse",mixins:[s["a"]],modals:{StatOrdersDetailListModal:i["a"],StatPerDetailListModal:d["a"]},serviceInject:function(){return{analyseService:u["AnalyseService"]}},rxState:function(){var e=this.analyseService,t=e.list$,r=e.auth$,n=e.loading$;return{list:t,auth:r,loading:n}},bem:{b:"page-brand-stat-orders-analyse",bHeader:"page-brand-stat-header"},data:function(){return{}},computed:{columns:l},created:function(){},methods:{moment:f.a,onChangeDataDays:function(e){this.$searchQuery.day=e.recently_day||void 0,this.$searchQuery.start_date=e.start_date||void 0,this.$searchQuery.end_date=e.end_date||void 0,this.onSearch()},showOrdersModal:function(e,t){this.$modalRouter.push({name:"stat-orders-detail-list-modal",props:{query:_({},this.$searchQuery,{product_type:e.product_type,order_source:t}),title:"订单明细",type:"brand-orders-analyse"}})}},components:{shopSelect:c["a"]}},b=y,m=r("2877"),v=Object(m["a"])(b,n,a,!1,null,null,null);t["default"]=v.exports}}]);