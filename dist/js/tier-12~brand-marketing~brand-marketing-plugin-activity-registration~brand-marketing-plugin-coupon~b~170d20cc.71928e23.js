(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["tier-12~brand-marketing~brand-marketing-plugin-activity-registration~brand-marketing-plugin-coupon~b~170d20cc"],{7213:function(t,e,n){"use strict";n.d(e,"e",(function(){return h}));n("6b54"),n("2397");var i=n("d225"),u=n("b0b4"),a=n("308d"),r=n("6bb5"),s=n("4e2b"),o=n("de46");function c(t){return function(){var e,n=Object(r["a"])(t);if(g()){var i=Object(r["a"])(this).constructor;e=Reflect.construct(n,arguments,i)}else e=n.apply(this,arguments);return Object(a["a"])(this,e)}}function g(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}var h=function(t){Object(s["a"])(n,t);var e=c(n);function n(){return Object(i["a"])(this,n),e.apply(this,arguments)}return Object(u["a"])(n,[{key:"getInfo",value:function(){return this.http.get("/v1/setting/mina/index")}},{key:"callback",value:function(t){return this.http.post("/v1/setting/mina/callback",{params:t})}},{key:"saveMch",value:function(t){return this.http.post("/v1/setting/mina/save_mch",{params:t})}},{key:"payMch",value:function(){return this.http.get("/v1/setting/mina/pay_mch")}},{key:"subAudit",value:function(){return this.http.post("/v1/setting/mina/sub_audit")}},{key:"getH5Info",value:function(t){return this.http.get("/v1/setting/mina/setting",{query:t})}},{key:"getCoachInfo",value:function(t){return this.http.get("/v1/setting/mina/coach",{query:t})}},{key:"getMenu",value:function(){return this.http.get("/v1/setting/mina/tabbar")}},{key:"saveMenu",value:function(t){return this.http.post("/v1/setting/mina/tabbar",{params:t})}},{key:"save",value:function(t){return this.http.post("/v1/setting/mina/main_set",{params:t})}},{key:"saveReserve",value:function(t){return this.http.post("/v1/setting/mina/course",{params:t})}},{key:"getActivityList",value:function(){return this.http.get("/v1/setting/mina/activity_list")}},{key:"getPathList",value:function(){return this.http.get("/v1/setting/mina/menu")}},{key:"getComponentList",value:function(t){return this.http.get("/v1/setting/mina/component",{query:t})}},{key:"getShopComponentList",value:function(t){return this.http.get("/v1/setting/mina/config",{query:t})}},{key:"postShopComponentList",value:function(t){return this.http.post("/v1/setting/mina/config",{params:t})}},{key:"getCardList",value:function(t){return this.http.get("/v1/setting/mina/cards",{query:t})}},{key:"getPersonalCourseList",value:function(t){return this.http.get("/v1/setting/mina/personal",{query:t})}},{key:"getSmallCourseList",value:function(t){return this.http.get("/v1/setting/mina/small",{query:t})}},{key:"getTeamCourseList",value:function(t){return this.http.get("/v1/setting/mina/team",{query:t})}},{key:"getPackageList",value:function(t){return this.http.get("/v1/setting/mina/package",{query:t})}},{key:"getCoachList",value:function(t){return this.http.get("/v1/setting/mina/coaches",{query:t})}},{key:"getCouponList",value:function(t){return this.http.get("/v1/setting/mina/coupon",{query:t})}},{key:"getPreview",value:function(t){return this.http.get("/v1/setting/mina/preview",{query:t})}},{key:"getLinkPathList",value:function(){return this.http.get("/v1/setting/mina/path")}}]),n}(o["a"])}}]);