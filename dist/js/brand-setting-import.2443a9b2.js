(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["brand-setting-import"],{1988:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("st-panel",{class:t.b(),attrs:{app:""}},[a("div",{staticClass:"page-header"},[a("st-t2",[t._v("\n      导入记录\n    ")]),a("div",{staticClass:"row-tip-btn"},[a("st-refresh-btn",{attrs:{action:t.refresh}})],1)],1),a("st-table",{attrs:{page:t.page,loading:t.loading.getList,columns:t.columns,dataSource:t.list,rowKey:"id"},on:{change:t.onTableChange},scopedSlots:t._u([{key:"excel_operate_status",fn:function(e,s){return[a("span",{class:{import:s.excel_operate_status.id===t.IMPORT_STATUS.IMPORTING,error:s.excel_operate_status.id===t.IMPORT_STATUS.ERROR}},[t._v("\n        "+t._s(s.excel_operate_status.name)+"\n      ")]),3===s.excel_operate_status.id&&s.excel_operate_status.content?a("st-help-popover",[a("span",{attrs:{slot:"content"},slot:"content"},[t._v(t._s(s.excel_operate_status.content))])]):t._e()]}},{key:"import_type",fn:function(e,s){return[a("span",[t._v(t._s(s.import_type.name))])]}},{key:"input_error_num",fn:function(e,s){return[a("span",[t._v(t._s(e))]),s.input_error_num>0?a("a",{on:{click:function(e){return t.downloadErrorData(s.input_file_error_resource)}}},[t._v("\n        下载错误数据\n      ")]):t._e()]}}])})],1)},n=[],i=a("b6b0"),r=a("e69b"),o=a("ea3e"),l=function(){return[{title:"时间",dataIndex:"import_time"},{title:"导入状态",dataIndex:"excel_operate_status",scopedSlots:{customRender:"excel_operate_status"}},{title:"导入数据类型",dataIndex:"import_type",scopedSlots:{customRender:"import_type"}},{title:"新增数据",dataIndex:"input_created_num"},{title:"更新数据",dataIndex:"input_updated_num"},{title:"错误数据",dataIndex:"input_error_num",scopedSlots:{customRender:"input_error_num"}},{title:"操作人",dataIndex:"operator_name"}]},c=a("b76d"),d={bem:{b:"page-setting-record"},mixins:[o["a"]],serviceInject:function(){return{recordService:i["RecordService"],messageService:r["a"]}},rxState:function(){return{list:this.recordService.list$,page:this.recordService.page$,loading:this.recordService.loading$}},data:function(){return{IMPORT_STATUS:c["b"]}},computed:{columns:l},methods:{downloadErrorData:function(t){window.open(t)},getList:function(){this.$router.reload()},refresh:function(){return this.recordService.getList()}}},u=d,b=a("2877"),p=Object(b["a"])(u,s,n,!1,null,null,null);e["default"]=p.exports},"1f72":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("st-panel",{attrs:{app:""}},[a("import-tip"),a("div",{class:t.bHeader()},[a("st-t2",[t._v("\n      导入售出\n    ")]),a("label",{class:t.bHeader("desc")},[t._v("售出的卡、课记录")])],1),a("div",[t._v("\n    请选择需要导入的门店:\n    "),a("a-select",{staticClass:"select",attrs:{placeholder:"请选择门店",allowClear:!0},model:{value:t.shopId,callback:function(e){t.shopId=e},expression:"shopId"}},t._l(t.shopList,(function(e,s){return a("a-select-option",{key:s,attrs:{value:+e.shop_id}},[t._v("\n        "+t._s(e.shop_name)+"\n      ")])})),1)],1),a("p",{staticClass:"page-tip"},[t._v("\n    请选择一项需要导入的内容，下载对应模板\n  ")]),a("a-radio-group",{model:{value:t.selectedValue,callback:function(e){t.selectedValue=e},expression:"selectedValue"}},[a("div",{class:t.bTable()},[a("div",{class:t.bTable("left")},[t._v(t._s(t.$c("member_card")))]),a("div",{class:t.bTable("right")},[a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.SOLD_MEMBER_CARD}},[t._v("\n            "+t._s(t.$c("member_card"))+"\n          ")]),a("label",{class:t.bTable("desc")},[t._v("\n            包含期卡和次卡——默认不限制入场时间\n          ")])],1),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.FAMILY_CARD}},[t._v("\n            多人"+t._s(t.$c("member_card"))+"\n          ")]),a("label",{class:t.bTable("desc")},[t._v("\n            包含期卡和次卡——默认不限制入场时间\n          ")])],1),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.SOLD_MEMBER_CARD_ENTER_TIME}},[a("span",[t._v(t._s(t.$c("member_card"))+"入场时间")])]),a("label",{class:t.bTable("desc")},[t._v("\n            售出的"+t._s(t.$c("member_card"))+"限制入场时间，请批量导入入场时间\n          ")])],1)])]),a("a-row",{class:t.bTable()},[a("div",{class:t.bTable("left")},[t._v("储值卡")]),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.SOLD_DEPOSIT}},[t._v("储值卡")]),a("label",{class:t.bTable("desc")},[t._v("\n          全部售出信息\n        ")])],1)]),a("a-row",{class:t.bTable()},[a("div",{class:t.bTable("left")},[t._v("私教课")]),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.SOLD_PERSONAL_COURSE}},[t._v("私教课")])],1)]),a("a-row",{class:t.bTable()},[a("div",{class:t.bTable("left")},[t._v("课程包")]),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.SOLD_PACKAGE}},[t._v("限定范围课程包")]),a("label",{class:t.bTable("desc")},[t._v("\n          导入前请确认课程包已经在导入门店设置完成\n        ")])],1)]),a("a-row",{class:[t.bTable()," bottom-line"]},[a("div",{class:t.bTable("left")},[t._v("租赁柜")]),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.SOLD_LEASE}},[t._v("租赁柜")]),a("label",{class:t.bTable("desc")},[t._v("\n          导入前请预先设置柜子所在区域和柜号\n          ")])],1)])],1),a("div",{staticClass:"page-footer"},[a("st-button",{staticClass:"download",attrs:{type:"primary"},on:{click:t.fetchDownloadFileInfo}},[t._v("\n      下载模板\n    ")]),a("st-button",{on:{click:t.uploadFile}},[t._v("上传文件")])],1)],1)},n=[],i=a("b76d"),r=a("0e29"),o=a("d1f7"),l=a("2138"),c=a("b1a7"),d=a("e69b"),u={bem:{bHeader:"page-header",bTable:"page-table-row"},modals:{BrandSettingImport:o["a"]},serviceInject:function(){return{importService:r["ImportService"],messageService:d["a"],userService:l["a"]}},rxState:function(){return{shopList:this.userService.shopList$}},components:{ImportTip:c["a"]},data:function(){return{IMPORT:i["a"],selectedValue:i["a"].SOLD_MEMBER_CARD,shopId:void 0}},methods:{fetchDownloadFileInfo:function(){this.importService.fetchDownloadFileInfo(this.selectedValue).subscribe((function(t){window.open(t.url)}))},uploadFile:function(){var t=this;this.shopId?this.$modalRouter.push({name:"brand-setting-import",props:{type:this.selectedValue,shopId:this.shopId},on:{success:function(){t.$router.push({path:"/brand/setting/import/record"})}}}):this.messageService.error({content:"请选择门店"})}}},b=u,p=a("2877"),_=Object(p["a"])(b,s,n,!1,null,null,null);e["default"]=_.exports},4214:function(t,e,a){"use strict";a.r(e),a.d(e,"ExplainService",(function(){return l}));var s,n=a("d225"),i=a("9ab4"),r=a("0cd5"),o=a("2cbb"),l=function t(e){Object(n["a"])(this,t),this.authService=e,this.auth$=this.authService.authMap$({staff:"brand:setting:import|import_staff",product:"brand:setting:import|import_product",member:"brand:setting:import|import_member",sold:"brand:setting:import|import_sold"})};l=Object(i["b"])([Object(r["b"])(),Object(i["d"])("design:paramtypes",["function"===typeof(s="undefined"!==typeof o["a"]&&o["a"])?s:Object])],l)},4946:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("st-panel",{attrs:{app:""}},[a("import-tip"),a("div",{class:t.bHeader()},[a("st-t2",[t._v("\n      导入员工\n    ")]),a("label",{class:t.bHeader("desc")},[t._v("\n      您需要预先设置以下内容，才能进行员工的导入～\n    ")])],1),a("div",{class:t.bRow()},[a("p",{class:t.bRow("content")},[t._v("\n      1）\n      "),a("router-link",{attrs:{to:{path:"/brand/staff/department"},target:"_blank"}},[t._v("\n        设置\n      ")]),t._v("\n      员工所在部门（必须预先设置）\n    ")],1),a("p",{class:t.bRow("content")},[t._v("\n      2）\n      "),a("router-link",{attrs:{to:{path:"/brand/setting/general/coach-level"},target:"_blank"}},[t._v("\n        设置\n      ")]),t._v("\n      设置"+t._s(t.$c("coach"))+"等级（若不需要导入"+t._s(t.$c("coach"))+"等级，可忽略）\n    ")],1)]),a("div",{staticClass:"page-footer"},[a("st-button",{staticClass:"download",attrs:{type:"primary"},on:{click:t.fetchDownloadFileInfo}},[t._v("\n      下载模板\n    ")]),a("st-button",{on:{click:t.uploadFile}},[t._v("上传文件")])],1)],1)},n=[],i=a("0e29"),r=a("d1f7"),o=a("b76d"),l=a("b1a7"),c={bem:{bHeader:"page-header",bRow:"row"},serviceInject:function(){return{importService:i["ImportService"]}},rxState:function(){return{}},modals:{BrandSettingImport:r["a"]},components:{ImportTip:l["a"]},data:function(){return{IMPORT:o["a"]}},methods:{fetchDownloadFileInfo:function(){this.importService.fetchDownloadFileInfo(this.IMPORT.STAFF).subscribe((function(t){window.open(t.url)}))},uploadFile:function(){var t=this;this.$modalRouter.push({name:"brand-setting-import",props:{type:this.IMPORT.STAFF},on:{success:function(){t.$router.push({path:"/brand/setting/import/record"})}}})}}},d=c,u=a("2877"),b=Object(u["a"])(d,s,n,!1,null,null,null);e["default"]=b.exports},"5ad2":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("st-panel",{attrs:{app:""}},[a("import-tip"),a("div",{class:t.bHeader()},[a("st-t2",[t._v("\n      导入商品\n    ")]),a("label",{class:t.bHeader("desc")},[t._v("卡、课都属于商品")])],1),a("p",{staticClass:"page-tip"},[t._v("\n    请选择一项需要导入的内容，下载对应模板\n  ")]),a("a-radio-group",{model:{value:t.selectedValue,callback:function(e){t.selectedValue=e},expression:"selectedValue"}},[a("div",{class:t.bTable()},[a("div",{class:t.bTable("left")},[t._v(t._s(t.$c("member_card")))]),a("div",{class:t.bTable("right")},[a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.MEMBER_CARD_BASIC}},[t._v("基础信息")]),a("label",{class:t.bTable("desc")},[t._v("\n            仅导入"+t._s(t.$c("member_card"))+"基础信息，不导入价格，默认"+t._s(t.$c("member_card"))+"支持单店入场，全门店售卖\n          ")])],1),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.MEMBER_CARD_PRICE}},[t._v("价格信息")]),a("label",{class:t.bTable("desc")},[t._v("\n            "+t._s(t.$c("member_card"))+"的价格信息，请在录入卡基础信息后进行导入\n          ")])],1)])]),a("div",{class:t.bTable()},[a("div",{class:t.bTable("left")},[t._v("储值卡")]),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.DEPOSIT}},[t._v("储值卡信息")]),a("label",{class:t.bTable("desc")},[t._v("\n          默认储值卡卡支持单店消费，全门店售卖\n        ")])],1)]),a("div",{class:t.bTable()},[a("div",{class:t.bTable("left")},[t._v("团体课")]),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.TEAM_COURSE}},[t._v("团体课信息")]),a("label",{class:t.bTable("desc")},[t._v("\n          包含团体课所有信息，其中课程类型和目的仅支持导入已设置选项，请预先进行\n          "),a("router-link",{staticClass:"btn",attrs:{to:{path:"/brand/setting/app/course/category"},target:"_blank"}},[t._v("\n            设置\n          ")]),a("st-help-tooltip",{attrs:{id:"ISS001"}})],1)],1)]),a("div",{class:t.bTable()},[a("div",{class:t.bTable("left")},[t._v("私教课")]),a("div",{class:t.bTable("right")},[a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.PERSONAL_BASIC}},[t._v("基础信息")]),a("label",{class:t.bTable("desc")},[t._v("\n            包含课程名称、课程类型、课程目的、时长等基础信息，其中课程类型和目的仅支持导入已设置选项，请预先进行\n            "),a("router-link",{attrs:{to:{path:"/brand/setting/app/course/category"},target:"_blank"}},[t._v("\n              设置\n            ")])],1)],1),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.PERSONAL_PRICE}},[t._v("价格信息")]),a("label",{class:t.bTable("desc")},[t._v("\n            私教课的价格信息，请在录入课程基础信息后导入。\n          ")])],1)])]),a("div",{class:[t.bTable()," bottom-line"]},[a("div",{class:t.bTable("left")},[t._v("\n        与门店关系\n      ")]),a("div",{class:t.bTable("right")},[a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.SUPPORT_CONSUME_SHOP}},[a("span",[t._v("支持消费的门店")])]),a("label",{class:t.bTable("desc")},[t._v("\n            若"+t._s(t.$c("member_card"))+"、储值卡支持多店消费，或者团体课支持上课门店为多店，请导入卡课支持消费的门店\n          ")])],1),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.SUPPORT_SOLD_SHOP}},[t._v("支持售卖的门店")]),a("label",{class:t.bTable("desc")},[t._v("\n            若"+t._s(t.$c("member_card"))+"、储值卡不支持全门店售卖，或者私教课不支持全门店售卖，请导入卡课支持售卖的门店\n          ")])],1)])])]),a("div",{staticClass:"page-footer"},[a("st-button",{staticClass:"download",attrs:{type:"primary"},on:{click:t.fetchDownloadFileInfo}},[t._v("\n      下载模板\n    ")]),a("st-button",{on:{click:t.uploadFile}},[t._v("上传文件")])],1)],1)},n=[],i=a("b76d"),r=a("0e29"),o=a("d1f7"),l=a("b1a7"),c={bem:{bHeader:"page-header",bTable:"page-table-row"},modals:{BrandSettingImport:o["a"]},serviceInject:function(){return{importService:r["ImportService"]}},rxState:function(){return{}},data:function(){return{IMPORT:i["a"],selectedValue:i["a"].MEMBER_CARD_BASIC}},components:{ImportTip:l["a"]},methods:{fetchDownloadFileInfo:function(){this.importService.fetchDownloadFileInfo(this.selectedValue).subscribe((function(t){window.open(t.url)}))},uploadFile:function(){var t=this;this.$modalRouter.push({name:"brand-setting-import",props:{type:this.selectedValue},on:{success:function(){t.$router.push({path:"/brand/setting/import/record"})}}})}}},d=c,u=a("2877"),b=Object(u["a"])(d,s,n,!1,null,null,null);e["default"]=b.exports},b131:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("st-panel",{attrs:{app:""}},[a("import-tip"),a("a-row",{class:t.bHeader()},[a("st-t2",[t._v("\n      导入用户\n    ")]),a("label",{class:t.bHeader("desc")},[t._v("\n      门店会员（潜在会员、正式会员、流失会员）\n    ")])],1),a("div",{class:[t.bTable()," bottom-line"]},[a("a-radio-group",{class:t.bTable("right"),model:{value:t.user,callback:function(e){t.user=e},expression:"user"}},[a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.MEMBER_BASIC}},[t._v("\n          用户基础信息\n        ")])],1),a("div",{class:t.bTable("content")},[a("a-radio",{attrs:{value:t.IMPORT.MEMBER_RECORD}},[t._v("\n          用户跟进员工\n        ")]),a("label",{class:t.bTable("desc")},[t._v("\n          门店维度下，跟进的"+t._s(t.$c("coach"))+"或销售\n        ")])],1)])],1),a("a-row",{staticClass:"page-footer"},[a("st-button",{staticClass:"download",attrs:{type:"primary"},on:{click:t.fetchDownloadFileInfo}},[t._v("\n      下载模板\n    ")]),a("st-button",{on:{click:t.uploadFile}},[t._v("上传文件")])],1)],1)},n=[],i=a("b76d"),r=a("0e29"),o=a("d1f7"),l=a("b1a7"),c={bem:{bHeader:"page-header",bTable:"page-table-row"},modals:{BrandSettingImport:o["a"]},serviceInject:function(){return{importService:r["ImportService"]}},rxState:function(){return{}},components:{ImportTip:l["a"]},data:function(){return{IMPORT:i["a"],user:i["a"].MEMBER_BASIC}},methods:{fetchDownloadFileInfo:function(){this.importService.fetchDownloadFileInfo(this.user).subscribe((function(t){window.open(t.url)}))},uploadFile:function(){var t=this;this.$modalRouter.push({name:"brand-setting-import",props:{type:this.user},on:{success:function(){t.$router.push({path:"/brand/setting/import/record"})}}})}}},d=c,u=a("2877"),b=Object(u["a"])(d,s,n,!1,null,null,null);e["default"]=b.exports},b1a7:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("st-alert",{staticClass:"import-tip"},[t._v("\n  请务必使用系统下载的模板，补充信息后上传。您可以在次日检查导入结果哦～\n")])},n=[],i=a("2877"),r={},o=Object(i["a"])(r,s,n,!1,null,null,null);e["a"]=o.exports},b6b0:function(t,e,a){"use strict";a.r(e),a.d(e,"RecordService",(function(){return b}));var s,n,i=a("d225"),r=a("b0b4"),o=a("9ab4"),l=a("0cd5"),c=a("df29"),d=a("c4cc"),u=a("8b0a"),b=function(){function t(e){Object(i["a"])(this,t),this.importApi=e,this.list$=new c["d"]([]),this.page$=new c["d"]({}),this.loading$=new c["d"]({})}return Object(r["a"])(t,[{key:"getList",value:function(t){var e=this;return this.importApi.excelList(t).pipe(Object(d["a"])((function(t){e.list$.commit((function(){return t.list})),e.page$.commit((function(){return t.page}))})))}},{key:"beforeEach",value:function(t,e){return this.getList(t.meta.query)}}]),t}();Object(o["b"])([Object(c["c"])(),Object(o["d"])("design:type",Function),Object(o["d"])("design:paramtypes",["function"===typeof(s="undefined"!==typeof u["ListParams"]&&u["ListParams"])?s:Object]),Object(o["d"])("design:returntype",void 0)],b.prototype,"getList",null),b=Object(o["b"])([Object(l["b"])(),Object(o["d"])("design:paramtypes",["function"===typeof(n="undefined"!==typeof u["a"]&&u["a"])?n:Object])],b)},b76d:function(t,e,a){"use strict";var s,n;a.d(e,"a",(function(){return s})),a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return i})),function(t){t[t["MEMBER_BASIC"]=1]="MEMBER_BASIC",t[t["MEMBER_RECORD"]=2]="MEMBER_RECORD",t[t["STAFF"]=3]="STAFF",t[t["MEMBER_CARD_BASIC"]=4]="MEMBER_CARD_BASIC",t[t["MEMBER_CARD_PRICE"]=5]="MEMBER_CARD_PRICE",t[t["DEPOSIT"]=16]="DEPOSIT",t[t["TEAM_COURSE"]=15]="TEAM_COURSE",t[t["PERSONAL_BASIC"]=6]="PERSONAL_BASIC",t[t["PERSONAL_PRICE"]=7]="PERSONAL_PRICE",t[t["SUPPORT_SOLD_SHOP"]=8]="SUPPORT_SOLD_SHOP",t[t["SUPPORT_CONSUME_SHOP"]=9]="SUPPORT_CONSUME_SHOP",t[t["SOLD_MEMBER_CARD"]=10]="SOLD_MEMBER_CARD",t[t["SOLD_MEMBER_CARD_ENTER_TIME"]=11]="SOLD_MEMBER_CARD_ENTER_TIME",t[t["SOLD_PERSONAL_COURSE"]=12]="SOLD_PERSONAL_COURSE",t[t["SOLD_PACKAGE"]=17]="SOLD_PACKAGE",t[t["SOLD_LEASE"]=13]="SOLD_LEASE",t[t["SOLD_DEPOSIT"]=14]="SOLD_DEPOSIT",t[t["FILE_SAVE_TYPE"]=1]="FILE_SAVE_TYPE",t[t["FAMILY_CARD"]=18]="FAMILY_CARD"}(s||(s={})),function(t){t[t["SUCCESS"]=1]="SUCCESS",t[t["IMPORTING"]=2]="IMPORTING",t[t["ERROR"]=3]="ERROR"}(n||(n={}));var i=function(t){return{1:"导入用户-基础信息",2:"导入用户-跟进员工",3:"导入员工",4:"导入商品-".concat(t.$c("member_card"),"基础信息"),5:"导入商品-".concat(t.$c("member_card"),"价格信息"),6:"导入商品-私教课基础信息",7:"导入商品-私教课价格信息",8:"导入商品-支持售卖门店",9:"导入商品-支持消费门店",10:"导入售出-".concat(t.$c("member_card")),11:"导入售出-".concat(t.$c("member_card"),"入场时间"),12:"导入售出-私教课",13:"导入售出-租赁柜",14:"导入售出-储值卡",15:"导入商品-团体课信息",16:"导入商品-储值卡信息",17:"导入售出-限定范围课程包",18:"导入售出-多人".concat(t.$c("member_card"))}}},d1f7:function(t,e,a){"use strict";var s,n,i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("st-modal",{attrs:{title:t.importTitle,size:"small",confirmLoading:t.loading.uploadFile,wrapClassName:"modal-brand-setting-import"},on:{ok:t.onSubmit},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[a("section",{class:t.b()},[a("label",{class:t.b("tip")},[t._v("数据处理方式:")]),t.isType?a("div",{class:t.b("content")},[a("p",[t._v("新增数据")]),a("p",[t._v("针对不重复数据，进行新增，重复数据导入失败")]),a("p",[t._v("若一张表格合同编号出现重复，导入失败")])]):a("div",{class:t.b("content")},[a("p",[t._v("新增并覆盖原始数据")]),a("p",[t._v("针对不重复的数据，进行新增")]),a("p",[t._v("针对重复数据，进行覆盖")])]),a("div",{class:t.b("file")},[t.isLoading?a("div",{class:t.b("progress")},[t.isLoading&&100!=t.progress?a("div",{class:t.bProgress("bg"),style:{width:t.progress+"%"}}):t._e(),t.fileList.length>0?a("label",{class:t.bProgress("file-name")},[t._v("\n          "+t._s(t.fileList[0].file_name)+"\n        ")]):t._e(),t.fileList.length>0?a("label",{class:t.bProgress("reselect"),on:{click:t.reSelect}},[t._v("\n          重新选择\n        ")]):t._e()]):a("a-upload",{attrs:{showUploadList:!1,customRequest:t.upload,multiple:!1,accept:"xlsx"}},[a("label",{class:t.b("file-btn")},[t._v("选择文件")])])],1)])])},r=[],o=(a("28a5"),a("7f7f"),a("6762"),a("2fdb"),a("c5f6"),a("d225")),l=a("b0b4"),c=a("9ab4"),d=a("0cd5"),u=a("df29"),b=a("8b0a"),p=function(){function t(e){Object(o["a"])(this,t),this.importApi=e,this.info$=new u["d"]({}),this.loading$=new u["d"]({})}return Object(l["a"])(t,[{key:"uploadFile",value:function(t){return this.importApi.uploadFile(t)}}]),t}();Object(c["b"])([Object(u["c"])(),Object(c["d"])("design:type",Function),Object(c["d"])("design:paramtypes",["function"===typeof(s="undefined"!==typeof b["InputFileParams"]&&b["InputFileParams"])?s:Object]),Object(c["d"])("design:returntype",void 0)],p.prototype,"uploadFile",null),p=Object(c["b"])([Object(d["b"])(),Object(c["d"])("design:paramtypes",["function"===typeof(n="undefined"!==typeof b["a"]&&b["a"])?n:Object])],p);var _=a("e69b"),v=a("da41"),f=a("b76d"),m={name:"ModalBrandSettingImport",bem:{b:"modal-brand-setting-import",bProgress:"modal-brand-setting-import__progress"},serviceInject:function(){return{importService:p,messageService:_["a"],ossService:v["a"]}},rxState:function(){return{loading:this.importService.loading$}},props:{type:{type:Number,default:f["a"].MEMBER_BASIC},shopId:{type:Number}},data:function(){return{IMPORT:f["a"],show:!1,isLoading:!1,progress:0,isPrivate:!0,fileList:[],fileType:["xlsx"]}},computed:{isType:function(){var t=[this.IMPORT.SOLD_MEMBER_CARD,this.IMPORT.SOLD_DEPOSIT,this.IMPORT.SOLD_PERSONAL_COURSE,this.IMPORT.SOLD_PACKAGE,this.IMPORT.SOLD_LEASE];return t.includes(this.type)},importTitle:function(){return Object(f["c"])(this)[this.type]}},methods:{onSubmit:function(){var t=this,e={file_save_type:this.IMPORT.FILE_SAVE_TYPE,file_source:this.fileList[0].file_key,input_type:this.type,shop_id:this.shopId||void 0};this.importService.uploadFile(e).subscribe((function(e){t.show=!1,t.$emit("success")}))},reSelect:function(){this.fileList=[],this.isLoading=!1},upload:function(t){var e=this,a=this.fileCheck(t);a.isValid?(this.isLoading=!0,this.ossService.put({business:"excel",isPrivate:this.isPrivate,file:t.file,uploadProgress:function(t){e.progress=parseInt(t.loaded/t.total*100)}}).subscribe({next:function(t){e.fileList.push({file_key:t.fileKey,file_name:t.fileName,file_host:t.host,file_url:t.url})},error:function(t){e.messageService.error({content:"Error ".concat(t.message)}),e.isLoading=!1}})):this.messageService.error({content:a.msg})},fileCheck:function(t){var e=t.file,a=(e.size,e.name),s=(this.sizeLimit,this.fileType),n=a.split(".");return n.length<=0||!s.includes(n[n.length-1])?{isValid:!1,msg:"请上传".concat(s,"格式的文件")}:{isValid:!0}}}},h=m,S=a("2877"),O=Object(S["a"])(h,i,r,!1,null,null,null);e["a"]=O.exports},f11b:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("st-panel",{attrs:{app:""}},[a("div",{staticClass:"page-header"},[a("st-t2",[t._v("\n      开始使用系统后，以前的数据怎么办？请参照以下说明完成批量导入\n    ")])],1),a("a-row",{class:t.b("row")},[a("p",[t._v("\n      1、门店是所有数据的基础，完成门店设置后进行数据导入。\n      "),a("router-link",{attrs:{to:{path:"/brand/setting/shop/list"},target:"_blank"}},[t._v("\n        尚未完成，去设置？\n      ")])],1),a("p",[t._v("\n      2、导入文件格式仅支持xlxs，每份文件最多支持100000条数据。\n    ")]),a("p",[t._v("\n      3、为了保证系统顺畅，将在系统非繁忙时间内，按照您上传文件的顺序依次进行数据导入，请您在次日检查导入结果。\n    ")]),a("p",[t._v("\n      4、请在导入前阅读\n      "),a("a",{attrs:{href:"https://help.styd.cn/",target:"__blank"}},[t._v("帮助中心导入文档")]),t._v("\n      ，避免出现数据导入错误。\n    ")])]),a("st-container",{staticClass:"bg-gray",attrs:{type:"2"}},[a("div",{staticClass:"mg-b16",class:t.b("item-content")},[a("div",{staticClass:"item"},[a("st-t3",{staticClass:"title"},[t._v("导入员工")]),a("label",{staticClass:"desc"},[t._v("员工基础信息")]),t.auth$.staff?a("st-button",{attrs:{type:"primary"},on:{click:function(e){return t.goRouter("/brand/setting/import/staff")}}},[t._v("\n          导入员工\n        ")]):t._e()],1),a("p",[t._v("若员工数量较少，建议手动新增，无需导入。")])]),a("div",{staticClass:"mg-b16",class:t.b("item-content")},[a("div",{staticClass:"item"},[a("st-t3",{staticClass:"title"},[t._v("导入商品")]),a("label",{staticClass:"desc"},[t._v("卡、课都属于商品")]),t.auth$.product?a("st-button",{attrs:{type:"primary"},on:{click:function(e){return t.goRouter("/brand/setting/import/commodity")}}},[t._v("\n          导入商品\n        ")]):t._e()],1),a("p",[t._v("若卡课数量较少，建议手动新增，无需导入。")])]),a("div",{class:t.b("item")},[a("st-t3",{staticClass:"title"},[t._v("导入用户")]),a("label",{staticClass:"desc"},[t._v("\n        门店会员（潜在会员、正式会员、流失会员）\n      ")]),t.auth$.member?a("st-button",{attrs:{type:"primary"},on:{click:function(e){return t.goRouter("/brand/setting/import/member")}}},[t._v("\n        导入用户\n      ")]):t._e()],1),a("div",{class:t.b("item-content")},[a("div",{staticClass:"item"},[a("st-t3",{staticClass:"title"},[t._v("导入售出")]),a("label",{staticClass:"desc"},[t._v("售出的卡、课记录")]),t.auth$.sold?a("st-button",{attrs:{type:"primary"},on:{click:function(e){return t.goRouter("/brand/setting/import/sold")}}},[t._v("\n          导入售出\n        ")]):t._e()],1),a("p",[t._v("\n        1.请在完成员工、商品、用户的新增后导入售出，否则售出若关联到对应的用户、卡课、将无法成功导入。\n        "),a("br"),t._v("\n        2.导入售出后，若您售卖出新的卡课，请在交易签单中完成售卖，不要通过导入功能进行数据补充，否则会导致数据错乱。\n        "),a("br"),t._v("\n        3.售出会影响门店财务等相关统计，请在确认导入数据无误的情况下进行数据导入。\n      ")])])])],1)},n=[],i=a("4214"),r={bem:{b:"page-setting-explain",bContentItem:"page-setting-explain__item-content"},serviceInject:function(){return{explainService:i["ExplainService"]}},rxState:function(){var t=this.explainService.auth$;return{auth$:t}},data:function(){return{}},methods:{goRouter:function(t){this.$router.push({path:t})}}},o=r,l=a("2877"),c=Object(l["a"])(o,s,n,!1,null,null,null);e["default"]=c.exports}}]);