(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["tier-2~brand-app-venue~shop-app-venue"],{"0bba":function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));n("6b54"),n("2397");var s=n("d225"),i=n("b0b4"),r=n("308d"),a=n("6bb5"),c=n("4e2b"),o=n("de46");function u(e){return function(){var t,n=Object(a["a"])(e);if(l()){var s=Object(a["a"])(this).constructor;t=Reflect.construct(n,arguments,s)}else t=n.apply(this,arguments);return Object(r["a"])(this,t)}}function l(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}var p=function(e){Object(c["a"])(n,e);var t=u(n);function n(){return Object(s["a"])(this,n),t.apply(this,arguments)}return Object(i["a"])(n,[{key:"getInfo",value:function(e){return this.http.get("/v1/setting/app/common",{query:e})}},{key:"update",value:function(e){return this.http.post("/v1/setting/app/edit",{params:e})}}]),n}(o["a"])},7815:function(e,t,n){"use strict";var s,i,r,a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("st-modal",{staticClass:"modal-personal-order-setting",attrs:{title:"场地预约设置",confirmLoading:e.loading.update},on:{ok:e.save,cancel:e.cancel},model:{value:e.show,callback:function(t){e.show=t},expression:"show"}},[n("div",[n("st-form",{attrs:{form:e.form,labelWidth:"56px"}},[n("st-form-item",{attrs:{label:"预约范围"}},[n("div",[n("span",[e._v("用户可预约")]),n("a-select",{staticClass:"mg-l8",staticStyle:{width:"100px"},model:{value:e.info.venues_reserve_start,callback:function(t){e.$set(e.info,"venues_reserve_start",t)},expression:"info.venues_reserve_start"}},e._l(e.reserveStarts,(function(t,s){return n("a-select-option",{key:+s,attrs:{value:+t.value}},[e._v("\n              "+e._s(t.label)+"\n            ")])})),1),n("span",{staticClass:"mg-l8"},[e._v("到")]),n("a-select",{staticClass:"mg-l8",staticStyle:{width:"70px"},model:{value:e.info.venues_reserve_end,callback:function(t){e.$set(e.info,"venues_reserve_end",t)},expression:"info.venues_reserve_end"}},e._l(e.reserveRanges,(function(t,s){return n("a-select-option",{key:+s,attrs:{value:+t.value}},[e._v("\n              "+e._s(t.label)+"\n            ")])})),1),n("span",{staticClass:"mg-l8"},[e._v("以内的场地，员工代预约不受此限制")])],1)]),n("st-form-item",{attrs:{label:"取消预约"}},[n("div",[n("span",[e._v("允许用户在场地预约开始前")]),n("a-select",{staticClass:"mg-l8",staticStyle:{width:"100px"},model:{value:e.info.venues_cancel_limit,callback:function(t){e.$set(e.info,"venues_cancel_limit",t)},expression:"info.venues_cancel_limit"}},e._l(e.cancelReserves,(function(t,s){return n("a-select-option",{key:+s,attrs:{value:+t.value}},[e._v("\n              "+e._s(t.label)+"\n            ")])})),1),n("span",{staticClass:"mg-l8"},[e._v("取消预约，员工代取消不受此限制")])],1)])],1)],1)])},c=[],o=(n("8e6e"),n("ac6a"),n("456d"),n("bd86")),u=n("e69b"),l=n("d225"),p=n("b0b4"),v=n("9ab4"),f=n("0cd5"),b=n("df29"),d=n("0bba"),g=n("2138"),h=function(){function e(t,n){Object(l["a"])(this,e),this.appApi=t,this.userService=n,this.loading$=new b["d"]({}),this.reserveStarts$=this.userService.getOptions$("venues_reserve.venues_reserve_start"),this.reserveRanges$=this.userService.getOptions$("setting.reserve_range"),this.cancelReserves$=this.userService.getOptions$("venues_reserve.venues_cancel_limit"),this.signTimes$=this.userService.getOptions$("setting.sign_time"),this.autoSignLimits$=this.userService.getOptions$("setting.auto_sign_limit")}return Object(p["a"])(e,[{key:"getInfo",value:function(e){return this.appApi.getInfo(e)}},{key:"update",value:function(e){return this.appApi.update(e)}}]),e}();Object(v["b"])([Object(b["c"])(),Object(v["d"])("design:type",Function),Object(v["d"])("design:paramtypes",["function"===typeof(s="undefined"!==typeof d["UpdateInput"]&&d["UpdateInput"])?s:Object]),Object(v["d"])("design:returntype",void 0)],h.prototype,"update",null),h=Object(v["b"])([Object(f["b"])(),Object(v["d"])("design:paramtypes",["function"===typeof(i="undefined"!==typeof d["a"]&&d["a"])?i:Object,"function"===typeof(r="undefined"!==typeof g["a"]&&g["a"])?r:Object])],h);var m=n("9cb4");function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,s)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?_(Object(n),!0).forEach((function(t){Object(o["a"])(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var y={serviceInject:function(){return{messageService:u["a"],settingService:h}},rxState:function(){return{loading:this.settingService.loading$,reserveStarts:this.settingService.reserveStarts$,reserveRanges:this.settingService.reserveRanges$,cancelReserves:this.settingService.cancelReserves$,signTimes:this.settingService.signTimes$,autoSignLimits:this.settingService.autoSignLimits$}},data:function(){return{show:!1,form:this.$form.createForm(this),info:{}}},created:function(){var e=this;this.settingService.getInfo({application_type:m["a"].VENUES}).subscribe((function(t){e.info=t.info}))},methods:{onCheckboxChange:function(e){this.info[e]=+!this.info[e]},cancel:function(){this.show=!1},save:function(){var e=this;this.settingService.update(O({},this.info,{application_type:m["a"].VENUES})).subscribe((function(){e.messageService.success({content:"提交成功"}),e.show=!1,e.$emit("change")}))}}},j=y,S=n("2877"),$=Object(S["a"])(j,a,c,!1,null,null,null);t["a"]=$.exports}}]);