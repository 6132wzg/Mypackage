(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["tier-2~brand-marketing-plugin-crowd~brand-setting-sms"],{ab47:function(e,t,r){"use strict";var n,s,i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("st-modal",{class:e.bModal(),attrs:{title:"群发短信",width:"502px"},on:{ok:e.save,cancel:e.cancel},model:{value:e.show,callback:function(t){e.show=t},expression:"show"}},[r("st-form",{attrs:{form:e.form}},[r("st-form-item",{class:e.bModal("form"),attrs:{labelWidth:"70px",label:"接受对象"}},[r("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:e.decorators.user_type,expression:"decorators.user_type"}],on:{change:e.getCurPrizUserType}},e._l(e.userType,(function(t,n){return r("a-radio",{key:n,attrs:{value:t.value}},[e._v("\n          "+e._s(t.label)+"\n        ")])})),1),e.curUser===e.USER_TYPES.USER?r("st-textarea",{staticClass:"mg-t8",attrs:{"max-rows":1e3,autosize:{minRows:2,maxRows:4},placeholder:"输入手机号,每行一个"},model:{value:e.tel,callback:function(t){e.tel=t},expression:"tel"}}):e._e(),r("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:e.decorators.send_value,expression:"decorators.send_value"},{name:"show",rawName:"v-show",value:e.curUser===e.USER_TYPES.CROWD,expression:"curUser === USER_TYPES.CROWD"}],class:e.bModal("scroll")},e._l(e.crowdList,(function(t,n){return r("a-radio-button",{key:n,staticClass:"mg-r8",class:e.bModal("scroll-btn"),attrs:{value:t.crowd_id}},[e._v("\n          "+e._s(t.crowd_name)+"\n        ")])})),1),e.curUser===e.USER_TYPES.CROWD?r("span",{class:e.bModal("scroll-add")},[r("span",{class:e.bModal("scroll-not")},[e._v("不满足?")]),r("a",{staticClass:"cursor-pointer",on:{click:e.goCrowd}},[e._v("\n          去新增人群>\n        ")])]):e._e()],1),r("st-form-item",{attrs:{labelWidth:"70px",label:"发送时间"}},[r("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:e.decorators.send_type,expression:"decorators.send_type"}],on:{change:e.getCurTimeType}},e._l(e.sendType,(function(t,n){return r("a-radio",{key:n,attrs:{value:t.value}},[e._v("\n          "+e._s(t.label)+"\n        ")])})),1),r("a-date-picker",{directives:[{name:"show",rawName:"v-show",value:e.curTime===e.SEND_TYPES.ONTIME,expression:"curTime === SEND_TYPES.ONTIME"},{name:"decorator",rawName:"v-decorator",value:e.decorators.send_time,expression:"decorators.send_time"}],staticStyle:{width:"144px"},attrs:{disabledDate:e.disabledStartDate,placeholder:"请选择时间",format:"YYYY-MM-DD HH:mm",showTime:""}})],1),r("st-form-item",{staticClass:"mg-b0",attrs:{labelWidth:"70px",label:"编辑短信"}},[r("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:e.decorators.tmpl_type,expression:"decorators.tmpl_type"}],on:{change:e.getCurTemType}},e._l(e.tmplType,(function(t,n){return r("a-radio",{key:n,attrs:{value:t.value}},[e._v("\n          "+e._s(t.label)+"\n        ")])})),1),e.curTem===e.TMPL_TYPES.PERSONAL?[r("st-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:e.decorators.content,expression:"decorators.content"}],staticClass:"mg-t8",attrs:{autosize:{minRows:2,maxRows:4},maxlength:278-e.sign.length,suffix:e.sign,placeholder:"输入短信内容，短信签名默认尾部展示"},on:{change:e.calcSmsNum}}),r("div",{staticClass:"st-des mg-b8"},[e._v("\n          短信超过70个字按每67个字计费1条，当前将产生"+e._s(e.smsNumber)+"条短信\n        ")])]:e._e(),e.curTem===e.TMPL_TYPES.PERSONAL?r("div",{class:e.bModal("save")},[r("a-checkbox",{directives:[{name:"decorator",rawName:"v-decorator",value:e.decorators.is_save,expression:"decorators.is_save"}],class:e.bModal("save-btn"),on:{change:e.isSave}},[e._v("\n          存为模板\n        ")]),r("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:e.decorators.title,expression:"decorators.title"}],attrs:{disabled:!e.isSaveChecked,placeholder:"请输入模版标题"}})],1):e._e(),r("a-select",{directives:[{name:"show",rawName:"v-show",value:e.curTem===e.TMPL_TYPES.CUSTOM,expression:"curTem === TMPL_TYPES.CUSTOM"},{name:"decorator",rawName:"v-decorator",value:e.decorators.tmpl_id,expression:"decorators.tmpl_id"}],staticClass:"mg-b8",staticStyle:{width:"120px"},attrs:{placeholder:"请选择模版"},on:{change:e.getCurTemContent}},e._l(e.templateList,(function(t){return r("a-select-option",{key:t.tmpl_id,attrs:{value:t.tmpl_id}},[e._v("\n          "+e._s(t.title)+"\n        ")])})),1),e.curTem===e.TMPL_TYPES.CUSTOM?[r("st-textarea",{attrs:{maxlength:278-e.sign.length,autosize:{minRows:2,maxRows:4},suffix:e.sign,plcaeholder:"输入短信内容，短信签名默认尾部展示"},model:{value:e.temContent,callback:function(t){e.temContent=t},expression:"temContent"}}),r("span",{staticClass:"st-des"},[e._v("\n          短信超过70个字按每67个字计费1条，当前将产生"+e._s(e.tempSmsNum)+"条短信\n        ")])]:e._e()],2)],1)],1)},o=[],a=(r("8e6e"),r("ac6a"),r("456d"),r("bd86")),c=(r("28a5"),r("c5f6"),function(e){e.pattern;return{user_type:{initialValue:1,rules:[{required:!0,message:"请选择接收对象"}]},send_value:{rules:[{required:!0,message:"请输入内容"}]},send_type:{initialValue:1,rules:[{required:!0,message:""}]},send_time:{rules:[{required:!0,message:"请选择时间"}]},title:{},tmpl_type:{initialValue:1,rules:[{required:!0,message:"请选择模版类型"}]},content:{},is_save:{initialValue:0},tmpl_id:{}}}),u=r("d225"),l=r("b0b4"),E=r("9ab4"),p=r("0cd5"),d=r("df29"),m=r("bde4"),S=r("2138"),_=r("c4cc"),f=function(){function e(t,r){Object(u["a"])(this,e),this.GroupApi=t,this.userService=r,this.loading$=new d["d"]({}),this.crowdList$=new d["d"]({}),this.templateList$=new d["d"]([]),this.info$=new d["d"]([]),this.sign$=new d["d"]({}),this.userType$=this.userService.getOptions$("sms_group.user_type"),this.tmplType$=this.userService.getOptions$("sms_group.tmpl_type"),this.sendType$=this.userService.getOptions$("sms_group.send_type")}return Object(l["a"])(e,[{key:"getCrowdList",value:function(e){var t=this;return this.GroupApi.getCrowdList(e).pipe(Object(_["a"])((function(e){t.crowdList$.commit((function(){return e.list}))})))}},{key:"getTemplateOptionList",value:function(e){var t=this;return this.GroupApi.getTemplateOptionList(e).pipe(Object(_["a"])((function(e){t.templateList$.commit((function(){return e.list}))})))}},{key:"addGroup",value:function(e){return this.GroupApi.addGroup(e).pipe(Object(_["a"])((function(e){})))}},{key:"editGroup",value:function(e){return this.GroupApi.editGroup(e).pipe(Object(_["a"])((function(e){})))}},{key:"getEditInfo",value:function(e){return this.GroupApi.getEditInfo(e)}},{key:"getSmsSign",value:function(){var e=this;return this.GroupApi.getSmsSign().pipe(Object(_["a"])((function(t){e.sign$.commit((function(){return t.info.sign_name}))})))}}]),e}();Object(E["b"])([Object(d["c"])(),Object(E["d"])("design:type",Function),Object(E["d"])("design:paramtypes",[Object]),Object(E["d"])("design:returntype",void 0)],f.prototype,"getCrowdList",null),f=Object(E["b"])([Object(p["b"])(),Object(E["d"])("design:paramtypes",["function"===typeof(n="undefined"!==typeof m["a"]&&m["a"])?n:Object,"function"===typeof(s="undefined"!==typeof S["a"]&&S["a"])?s:Object])],f);var g=r("dfda"),v=r("e69b"),h=r("2527");function R(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function C(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?R(Object(r),!0).forEach((function(t){Object(a["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):R(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var O={name:"SettingSmsGroup",bem:{bModal:"setting-sms-group"},serviceInject:function(){return{groupService:f,messageService:v["a"],pattern:h["a"]}},rxState:function(){return{loading:this.groupService.loading$,templateList:this.groupService.templateList$,userType:this.groupService.userType$,tmplType:this.groupService.tmplType$,sendType:this.groupService.sendType$,crowdList:this.groupService.crowdList$,sign:this.groupService.sign$}},props:{id:{type:Number},tmpl:{type:Object},crowd:{type:Object}},data:function(){var e=this.$stForm.create(),t=e.decorators(c);return{form:e,decorators:t,USER_TYPES:g["g"],SEND_TYPES:g["d"],TMPL_TYPES:g["f"],show:!1,curUser:g["g"].USER,curTem:g["f"].PERSONAL,curTime:g["d"].NOW,temContent:"",tel:"",info:{},time:"",isSaveChecked:!1,singleSmsLength:67,smsNumber:1}},created:function(){this.getCrowdList(),this.getTemplateOptionList(),this.getSmsSign()},computed:{tempSmsNum:function(){var e=this.sign.length+2;return this.temContent.length+e>70?Math.ceil((this.temContent.length+e)/this.singleSmsLength):1}},mounted:function(){this.id&&this.getEditInfo(this.id),this.tmpl&&(this.form.setFieldsValue({tmpl_type:2,tmpl_id:this.tmpl.tmpl_id}),this.curTem=2,this.temContent=this.tmpl.content,this.calcSmsNum(this.temContent)),this.crowd&&(this.form.setFieldsValue({user_type:2,send_value:this.crowd.send_value}),this.curUser=2)},methods:{cancel:function(){},getCrowdList:function(){return this.groupService.getCrowdList().subscribe()},getSmsSign:function(){return this.groupService.getSmsSign().subscribe()},getTemplateOptionList:function(){return this.groupService.getTemplateOptionList().subscribe()},getCurPrizUserType:function(e){this.curUser=e.target.value},getCurTemType:function(e){this.curTem=e.target.value},getCurTimeType:function(e){this.curTime=e.target.value},calcSmsNum:function(e){var t=this.sign.length+2;this.smsNumber=e.length+t>70?Math.ceil((e.length+t)/this.singleSmsLength):1},getCurTemContent:function(e){var t=this;this.templateList.map((function(r){r.tmpl_id===e&&(t.temContent=r.content)}))},isSave:function(e){this.isSaveChecked=!e.target.value},getEditInfo:function(e){var t=this;return this.groupService.getEditInfo(e).subscribe((function(e){t.form.setFieldsValue({user_type:e.info.user_type,send_value:e.info.send_value,send_type:e.info.send_type,send_time:moment(e.info.send_time),title:e.info.title,content:e.info.content,tmpl_id:e.info.tmpl_id,is_save:0,tmpl_type:e.info.tmpl_type}),t.curUser=e.info.user_type,t.curTime=e.info.send_type,t.curTem=e.info.tmpl_type,t.temContent=e.info.content,e.info.user_type===t.USER_TYPES.USER&&(t.tel=e.info.send_value),e.info.tmpl_type===t.TMPL_TYPES.CUSTOM&&t.getCurTemContent(e.info.tmpl_id)}))},goCrowd:function(){this.$router.push('/brand/marketing/plugin/crowd/index?type=100003"'),this.show=!1},disabledStartDate:function(e){return e&&e.format("YYYY-MM-DD")<moment().add(0,"days").format("YYYY-MM-DD")},save:function(){var e=this;this.form.validate((function(t,r){if(r.send_time&&(r.send_time=r.send_time.format("YYYY-MM-DD HH:mm")),e.curUser===e.USER_TYPES.USER){if(!e.tel)return void e.messageService.warn({content:"请输入手机号"});for(var n=e.tel.split(/[\n]/),s=0;s<n.length;s++)if(!e.pattern.MOBILE.test(n[s].trim()))return void e.messageService.warn({content:"请输入正确格式手机号"});r.send_value=e.tel}if(e.curUser!==e.USER_TYPES.CROWD||r.send_value){if(e.curTem===e.TMPL_TYPES.PERSONAL){if(e.isSaveChecked&&!r.title)return void e.messageService.warn({content:"请输入模板标题"});if(!r.content)return void e.messageService.warn({content:"请输入模板内容"})}else{if(!e.temContent)return void e.messageService.warn({content:"请填写模板内容"});r.content=e.temContent}return e.id?(r.group_id=e.id,e.groupService.editGroup(C({},r)).subscribe((function(t){e.messageService.success({content:"编辑成功"}),e.$emit("success"),e.show=!1}))):e.groupService.addGroup(C({},r)).subscribe((function(t){e.messageService.success({content:"新增成功"}),e.$emit("success"),e.show=!1}))}e.messageService.warn({content:"请选择人群"})}))}}},b=O,y=r("2877"),T=Object(y["a"])(b,i,o,!1,null,null,null);t["a"]=T.exports},bde4:function(e,t,r){"use strict";r.d(t,"a",(function(){return E}));r("6b54"),r("2397");var n=r("d225"),s=r("b0b4"),i=r("308d"),o=r("6bb5"),a=r("4e2b"),c=r("de46");function u(e){return function(){var t,r=Object(o["a"])(e);if(l()){var n=Object(o["a"])(this).constructor;t=Reflect.construct(r,arguments,n)}else t=r.apply(this,arguments);return Object(i["a"])(this,t)}}function l(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}var E=function(e){Object(a["a"])(r,e);var t=u(r);function r(){return Object(n["a"])(this,r),t.apply(this,arguments)}return Object(s["a"])(r,[{key:"getGroupList",value:function(e){return this.http.get("/v1/setting/sms/group",{query:e})}},{key:"getTemplateList",value:function(e){return this.http.get("/v1/setting/sms/template",{query:e})}},{key:"getTemplateOptionList",value:function(e){return this.http.get("/v1/setting/sms/template/options",{query:e})}},{key:"onReset",value:function(e){return this.http.delete("/v1/setting/sms/group/cancel/"+e)}},{key:"onDelete",value:function(e){return this.http.delete("/v1/setting/sms/template/"+e)}},{key:"addTemplate",value:function(e){return this.http.post("/v1/setting/sms/template",{params:e})}},{key:"editTemplate",value:function(e){return this.http.put("/v1/setting/sms/template",{params:e})}},{key:"getCrowdList",value:function(e){return this.http.get("/v1/setting/sms/group/crowd",{query:e})}},{key:"addGroup",value:function(e){return this.http.post("/v1/setting/sms/group",{params:e})}},{key:"editGroup",value:function(e){return this.http.put("/v1/setting/sms/group",{params:e})}},{key:"getEditInfo",value:function(e){return this.http.get("/v1/setting/sms/group/info/"+e)}},{key:"getReceiveNumList",value:function(e){return this.http.get("/v1/setting/sms/group/user/"+e.id,{query:e})}},{key:"getSmsSign",value:function(){return this.http.get("/v1/setting/sms/sign")}}]),r}(c["a"])},dfda:function(e,t,r){"use strict";var n,s,i,o,a,c,u;r.d(t,"e",(function(){return n})),r.d(t,"g",(function(){return s})),r.d(t,"d",(function(){return i})),r.d(t,"f",(function(){return o})),r.d(t,"c",(function(){return a})),r.d(t,"a",(function(){return c})),r.d(t,"b",(function(){return u})),function(e){e[e["WECHAT"]=1]="WECHAT",e[e["ALIPAY"]=2]="ALIPAY"}(n||(n={})),function(e){e[e["USER"]=1]="USER",e[e["CROWD"]=2]="CROWD",e[e["ALL"]=3]="ALL"}(s||(s={})),function(e){e[e["NOW"]=1]="NOW",e[e["ONTIME"]=2]="ONTIME"}(i||(i={})),function(e){e[e["CUSTOM"]=2]="CUSTOM",e[e["PERSONAL"]=1]="PERSONAL"}(o||(o={})),function(e){e[e["MEMBER"]=1]="MEMBER",e[e["SHOP"]=2]="SHOP"}(a||(a={})),function(e){e[e["RESERVE_SUCCESS"]=1]="RESERVE_SUCCESS",e[e["RESERVE_CANCEL"]=2]="RESERVE_CANCEL",e[e["RESERVE_CHANGE"]=3]="RESERVE_CHANGE",e[e["RESERVE_EXPIRE"]=4]="RESERVE_EXPIRE",e[e["UPGRADE_FORMAL"]=5]="UPGRADE_FORMAL",e[e["GOODS_EXPIRE"]=6]="GOODS_EXPIRE",e[e["GOODS_CONSUME"]=7]="GOODS_CONSUME",e[e["OPEN_CARD"]=8]="OPEN_CARD",e[e["PAY_SUCCESS"]=9]="PAY_SUCCESS",e[e["TREADMILL_END"]=10]="TREADMILL_END",e[e["VENUES_RESERVE_SUCCESS"]=20]="VENUES_RESERVE_SUCCESS",e[e["VENUES_RESERVE_CANCEL"]=21]="VENUES_RESERVE_CANCEL",e[e["VENUES_RESERVE_DEADLINE"]=22]="VENUES_RESERVE_DEADLINE"}(c||(c={})),function(e){e[e["RESERVE_SUCCESS"]=1]="RESERVE_SUCCESS",e[e["RESERVE_CANCEL"]=2]="RESERVE_CANCEL",e[e["RESERVE_OVERDUE"]=3]="RESERVE_OVERDUE",e[e["NEW_ORDER"]=4]="NEW_ORDER",e[e["ORDER_CANCEL"]=5]="ORDER_CANCEL",e[e["ORDER_SUCCESS"]=6]="ORDER_SUCCESS",e[e["ORDER_REFUND"]=7]="ORDER_REFUND",e[e["ASSIGN_SELLER"]=8]="ASSIGN_SELLER",e[e["ASSIGN_COACH"]=9]="ASSIGN_COACH",e[e["MEMBER_EXPIRE_DUE"]=10]="MEMBER_EXPIRE_DUE",e[e["MEMBER_EXPIRE"]=11]="MEMBER_EXPIRE",e[e["MEMBER_FLOW_DUE"]=12]="MEMBER_FLOW_DUE",e[e["MEMBER_FLOW"]=13]="MEMBER_FLOW",e[e["MEMBER_COURSE_EXPIRE_DUE"]=14]="MEMBER_COURSE_EXPIRE_DUE",e[e["MEMBER_COURSE_EXPIRE"]=15]="MEMBER_COURSE_EXPIRE",e[e["VENUES_RESERVE_SUCCESS"]=20]="VENUES_RESERVE_SUCCESS",e[e["VENUES_RESERVE_CANCEL"]=21]="VENUES_RESERVE_CANCEL",e[e["MEMBER_ENTRANCE_SUCCESS"]=24]="MEMBER_ENTRANCE_SUCCESS",e[e["BATCH_OPERATE"]=23]="BATCH_OPERATE"}(u||(u={}))}}]);