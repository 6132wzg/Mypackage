(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["tier-2~shop-store~shop-store-data"],{b57f:function(t,e,r){"use strict";r.d(e,"e",(function(){return h}));r("6b54"),r("2397");var o=r("d225"),n=r("b0b4"),u=r("308d"),a=r("6bb5"),c=r("4e2b"),s=r("de46");function i(t){return function(){var e,r=Object(a["a"])(t);if(p()){var o=Object(a["a"])(this).constructor;e=Reflect.construct(r,arguments,o)}else e=r.apply(this,arguments);return Object(u["a"])(this,e)}}function p(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}var h=function(t){Object(c["a"])(r,t);var e=i(r);function r(){return Object(o["a"])(this,r),e.apply(this,arguments)}return Object(n["a"])(r,[{key:"addGoods",value:function(t){return this.http.post("/v1/store/product",{params:t})}},{key:"editGoods",value:function(t,e){return this.http.put("/v1/store/product/".concat(t),{params:e})}},{key:"goodsDetail",value:function(t){return this.http.get("/v1/store/product/".concat(t))}},{key:"addCategory",value:function(t){return this.http.post("/v1/store/product/category",{params:t})}},{key:"editCategory",value:function(t,e){return this.http.put("/v1/store/product/category/".concat(t),{params:e})}},{key:"categoryList",value:function(){return this.http.get("/v1/store/product/category")}},{key:"delCategory",value:function(t){return this.http.delete("/v1/store/product/category/".concat(t))}},{key:"getList",value:function(t){return this.http.get("/v1/store/product",{query:t})}},{key:"dataProfile",value:function(){return this.http.get("/v1/store/data_profile")}},{key:"storeBoard",value:function(t){return this.http.get("/v1/store/board",{query:t})}},{key:"storeSaleList",value:function(t){return this.http.get("/v1/store/sale_list",{query:t})}},{key:"storeCategoryRank",value:function(t){return this.http.get("/v1/store/category_rank",{query:t})}},{key:"storeMemberAnalysis",value:function(t){return this.http.get("/v1/store/member_analysis",{query:t})}},{key:"delProduct",value:function(t){return this.http.delete("/v1/store/product/".concat(t))}},{key:"onShelf",value:function(t,e){return this.http.put("/v1/store/product/".concat(t),{params:e})}},{key:"getCategory",value:function(){return this.http.get("/v1/store/product/category")}}]),r}(s["a"])}}]);