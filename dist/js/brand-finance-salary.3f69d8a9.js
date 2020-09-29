(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["brand-finance-salary"],{"265e":function(t,e,n){"use strict";n.r(e);var i,s,a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("st-panel-layout",{class:t.b()},[n("st-panel",{attrs:{app:""}},[n("div",{class:t.b("action")},[n("a-select",{class:t.b("select"),attrs:{placeholder:"请选择部门"},on:{change:function(e){return t.onSingleSearch("department_id",e)}},model:{value:t.$searchQuery.department_id,callback:function(e){t.$set(t.$searchQuery,"department_id",e)},expression:"$searchQuery.department_id"}},[n("a-select-option",{attrs:{value:-1}},[t._v("\n          全部部门\n        ")]),t._l(t.department,(function(e,i){return n("a-select-option",{key:i,attrs:{value:e.id}},[t._v("\n          "+t._s(e.name)+"\n        ")])}))],2),n("a-select",{class:t.b("select"),attrs:{placeholder:"请选择门店"},on:{change:function(e){return t.onSingleSearch("shop_id",e)}},model:{value:t.$searchQuery.shop_id,callback:function(e){t.$set(t.$searchQuery,"shop_id",e)},expression:"$searchQuery.shop_id"}},[n("a-select-option",{attrs:{value:-1}},[t._v("\n          全部门店\n        ")]),t._l(t.shopList,(function(e,i){return n("a-select-option",{key:i,attrs:{value:e.shop_id}},[t._v("\n          "+t._s(e.shop_name)+"\n        ")])}))],2),n("a-month-picker",{class:t.b("range"),attrs:{placeholder:"开始月份",disabledDate:t.disabledStartDate},on:{change:t.change},model:{value:t.start_month,callback:function(e){t.start_month=e},expression:"start_month"}}),t._v("\n      ~\n      "),n("a-month-picker",{class:t.b("range"),attrs:{placeholder:"结束月份",disabledDate:t.disabledEndDate},on:{change:t.change},model:{value:t.end_month,callback:function(e){t.end_month=e},expression:"end_month"}}),n("st-input-search",{class:t.b("search"),staticStyle:{width:"255px"},attrs:{placeholder:"搜索员工姓名、手机号及工号"},on:{search:function(e){return t.onKeywordsSearch("search",e)}},model:{value:t.$searchQuery.search,callback:function(e){t.$set(t.$searchQuery,"search",e)},expression:"$searchQuery.search"}})],1),n("st-table",{attrs:{page:t.page,loading:t.loading.getList,columns:t.columns,dataSource:t.list,rowKey:"id"},on:{change:t.onTableChange},scopedSlots:t._u([{key:"staff_num",fn:function(e){return n("span",{staticClass:"word-break"},[t._v("\n        "+t._s(e)+"\n      ")])}},{key:"shop",fn:function(e,i){return[e.count>1?n("a",{directives:[{name:"modal-link",rawName:"v-modal-link",value:{name:"brand-finance-staff-shop",props:{id:i.id}},expression:"{\n            name: 'brand-finance-staff-shop',\n            props: {\n              id: record.id\n            }\n          }"}]},[t._v("\n          共"+t._s(e.count)+"家门店\n        ")]):n("span",[t._v("\n          "+t._s(e.name)+"\n        ")])]}},{key:"sales_commission",fn:function(e,i){return[n("a",{directives:[{name:"modal-link",rawName:"v-modal-link",value:{name:"brand-finance-sale-commission",props:{id:i.id}},expression:"{\n            name: 'brand-finance-sale-commission',\n            props: {\n              id: record.id\n            }\n          }"}]},[t._v("\n          "+t._s(e)+"\n        ")])]}},{key:"course_commission",fn:function(e,i){return[n("a",{directives:[{name:"modal-link",rawName:"v-modal-link",value:{name:"brand-finance-class-commission",props:{id:i.id}},expression:"{\n            name: 'brand-finance-class-commission',\n            props: {\n              id: record.id\n            }\n          }"}]},[t._v("\n          "+t._s(e)+"\n        ")])]}}])})],1)],1)},r=[],o=n("f190"),c=function(){return[{title:"结算月份",fixed:"left",width:80,dataIndex:"settle_month"},{title:"员工姓名",fixed:"left",width:90,dataIndex:"staff_name"},{title:"工号",width:90,dataIndex:"staff_num",scopedSlots:{customRender:"staff_num"}},{title:"员工身份",dataIndex:"staff_identity"},{title:"所属部门",dataIndex:"department_name"},{title:"所在门店",width:175,dataIndex:"shop",scopedSlots:{customRender:"shop"}},{title:"底薪(元)",dataIndex:"salary_basic"},{title:"销售提成(元)",dataIndex:"sales_commission",scopedSlots:{customRender:"sales_commission"},sorter:!0},{title:"上课提成(元)",dataIndex:"course_commission",scopedSlots:{customRender:"course_commission"},sorter:!0},{title:"结算薪资(元)",dataIndex:"settle_salary",sorter:!0}]},u=n("ea3e"),l=n("2138"),d=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("st-modal",{attrs:{title:t.title,footer:null,wrapClassName:"scroll-modal"},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[n("div",{class:t.b("total")},[n("div",{class:t.b("num")},[t._v(t._s(t.info.checkin_amount))]),n("div",{class:t.b("num")},[t._v("\n      "+t._s(t.info.royalty_price)+"\n      "),2===t.info.royalty_mode_exist?n("label",{class:t.b("tip")},[t._v("\n        （该员工当月未设置提成模板）\n      ")]):t._e()])]),n("div",{staticClass:"mg-b16"},[n("a-select",{staticStyle:{width:"120px"},attrs:{placeholder:"请选择课程类型",options:t.courseTypeList},on:{change:t.onChangeCourseType},model:{value:t.course_type,callback:function(e){t.course_type=e},expression:"course_type"}})],1),n("st-table",{class:t.list.length>0?"st-scroll-data":"",attrs:{rowKey:"id",loading:t.loading.getList,dataSource:t.list,columns:t.columns,scroll:{x:2===t.info.royalty_mode?1200:700,y:230},simplePage:!0,page:t.page},on:{change:t.onPageChange}})],1)},h=[],m=(n("c5f6"),n("d225")),p=n("b0b4"),f=n("9ab4"),_=n("0cd5"),b=n("df29"),y=n("da2b"),g=n("c4cc"),v=function(){function t(e,n){Object(m["a"])(this,t),this.salaryApi=e,this.userService=n,this.loading$=new b["d"]({}),this.list$=new b["d"]([]),this.info$=new b["d"]({}),this.page$=new b["d"]({current_page:1,size:20,total_counts:1,total_pages:1}),this.courseTypeList$=this.userService.getOptions$("schedule.course_type")}return Object(p["a"])(t,[{key:"getList",value:function(t){var e=this;return this.salaryApi.getClassCommissionList(t).pipe(Object(g["a"])((function(t){e.info$.commit((function(){return t.info})),e.list$.commit((function(){return t.list})),e.page$.commit((function(){return t.page}))})))}}]),t}();Object(f["b"])([Object(b["c"])(),Object(f["d"])("design:type",Function),Object(f["d"])("design:paramtypes",[Object]),Object(f["d"])("design:returntype",void 0)],v.prototype,"getList",null),v=Object(f["b"])([Object(_["b"])(),Object(f["d"])("design:paramtypes",["function"===typeof(i="undefined"!==typeof y["a"]&&y["a"])?i:Object,"function"===typeof(s="undefined"!==typeof l["a"]&&l["a"])?s:Object])],v);var S,O=function(t){var e=[{title:"课程名称",dataIndex:"course_name",width:"200px"},{title:"上课时间",dataIndex:"course_time",width:"200px"},{title:"预约人数",dataIndex:"reserved_num",width:"200px"},{title:"签到人数",dataIndex:"checkin_num",width:"200px"}],n=[{title:"课程名称",dataIndex:"course_name",width:"200px"},{title:"上课时间",dataIndex:"course_time",width:"200px"},{title:"签到时间",dataIndex:"checkin_time",width:"200px"},{title:"预约人姓名",dataIndex:"reserve_name",width:"200px"},{title:"签到人数",dataIndex:"checkin_num",width:"200px"},{title:"消费方式",dataIndex:"consume_type",width:"200px"},{title:"消课价值",dataIndex:"consume_amount",width:"200px"}];return t.info&&1===t.info.royalty_mode?e:n},x=n("5664"),j={name:"ModalBrandFinanceClassCommission",bem:{b:"modal-brand-finance"},serviceInject:function(){return{classCommissionService:v}},rxState:function(){return{loading:this.classCommissionService.loading$,info:this.classCommissionService.info$,list:this.classCommissionService.list$,page:this.classCommissionService.page$,courseTypeList:this.classCommissionService.courseTypeList$}},computed:{columns:O,title:function(){return 1===this.info.royalty_mode?"上课提成(按上课节数计算)":this.info.royalty_mode_text?"上课提成(按消课价值计算/".concat(this.info.royalty_mode_text,")"):"上课提成(按消课价值计算)"}},props:{id:{type:[String,Number]}},data:function(){return{COURSE_TYPE:x["a"],show:!1,course_type:x["a"].PERSONAL}},created:function(){this.getList({monthly_summary_id:this.id,course_type:this.course_type,size:20,current_page:1})},methods:{onChangeCourseType:function(t){this.course_type=t,this.getList({monthly_summary_id:this.id,course_type:this.course_type,size:20,current_page:1})},getList:function(t){return this.classCommissionService.getList(t).subscribe()},onPageChange:function(t){this.getList({monthly_summary_id:this.id,course_type:this.course_type,size:t.pageSize,current_page:t.current})}}},$=j,w=n("2877"),L=Object(w["a"])($,d,h,!1,null,null,null),C=L.exports,k=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("st-modal",{attrs:{title:t.title,footer:null,wrapClassName:"scroll-modal"},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[n("div",{class:t.b("total")},[n("div",{class:t.b("num")},[t._v(t._s(t.info.sale_price))]),n("div",{class:t.b("num")},[t._v("\n      "+t._s(t.info.royalty_price)+"\n      "),2===t.info.royalty_mode_exist?n("label",{class:t.b("tip")},[t._v("\n        （该员工当月未设置提成模板）\n      ")]):t._e()])]),n("st-table",{class:t.list.length>0?"st-scroll-data":"",attrs:{rowKey:"id",loading:t.loading.getList,dataSource:t.list,columns:t.columns,scroll:{x:1200,y:230},simplePage:"",page:t.page},on:{change:t.onPageChange},scopedSlots:t._u([{key:"product_name",fn:function(t,e){return[n("st-overflow-text",{attrs:{title:"签单商品",value:e.product_name,maxWidth:"100px"}})]}}])})],1)},I=[],E=function(){function t(e){Object(m["a"])(this,t),this.salaryApi=e,this.loading$=new b["d"]({}),this.list$=new b["d"]([]),this.info$=new b["d"]({}),this.page$=new b["d"]({current_page:1,size:20,total_counts:1,total_pages:1})}return Object(p["a"])(t,[{key:"getList",value:function(t){var e=this;return this.salaryApi.getSaleCommissionList(t).pipe(Object(g["a"])((function(t){e.info$.commit((function(){return t.info})),e.list$.commit((function(){return t.list})),e.page$.commit((function(){return t.page}))})))}}]),t}();Object(f["b"])([Object(b["c"])(),Object(f["d"])("design:type",Function),Object(f["d"])("design:paramtypes",[Object]),Object(f["d"])("design:returntype",void 0)],E.prototype,"getList",null),E=Object(f["b"])([Object(_["b"])(),Object(f["d"])("design:paramtypes",["function"===typeof(S="undefined"!==typeof y["a"]&&y["a"])?S:Object])],E);var A,Q=function(t){return[{title:"成单时间",dataIndex:"created_time",width:"200px"},{title:"签单时间",dataIndex:"order_time",width:"200px"},{title:"签单商品",dataIndex:"product_name",width:"200px",scopedSlots:{customRender:"product_name"}},{title:"会员姓名",dataIndex:"member_name",width:"200px"},{title:"订单总价",dataIndex:"total_price",width:"200px"},{title:"实收金额",dataIndex:"actual_price",width:"200px"},{title:"业绩金额",dataIndex:"sale_price",width:"200px"}]},T={name:"ModalBrandFinanceClassCommission",bem:{b:"modal-brand-finance"},serviceInject:function(){return{saleCommissionService:E}},rxState:function(){return{loading:this.saleCommissionService.loading$,info:this.saleCommissionService.info$,list:this.saleCommissionService.list$,page:this.saleCommissionService.page$}},computed:{columns:Q,title:function(){return this.info.royalty_mode_text?"销售提成(".concat(this.info.royalty_mode_text,")"):"销售提成"}},props:{id:{type:[String,Number]}},data:function(){return{show:!1}},created:function(){this.getList({monthly_summary_id:this.id,size:20,current_page:1})},methods:{onChangeCourseType:function(t){this.course_type=t,this.getList({monthly_summary_id:this.id,size:20,current_page:1})},getList:function(t){return this.saleCommissionService.getList(t).subscribe()},onPageChange:function(t){this.getList({monthly_summary_id:this.id,size:t.pageSize,current_page:t.current})}}},P=T,R=Object(w["a"])(P,k,I,!1,null,null,null),z=R.exports,N=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("st-modal",{attrs:{title:"所属门店",footer:null,wrapClassName:"scroll-modal"},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[n("st-table",{class:t.list.length>0?"st-scroll-data":"",attrs:{rowKey:"id",loading:t.loading.getList,dataSource:t.list,columns:t.columns,scroll:{y:230},simplePage:!0,page:t.page},on:{change:t.onPageChange}})],1)},M=[],Y=function(){function t(e){Object(m["a"])(this,t),this.salaryApi=e,this.loading$=new b["d"]({}),this.list$=new b["d"]([]),this.page$=new b["d"]({current_page:1,size:20,total_counts:1,total_pages:1})}return Object(p["a"])(t,[{key:"getList",value:function(t){var e=this;return this.salaryApi.getStaffShopList(t).pipe(Object(g["a"])((function(t){e.list$.commit((function(){return t.list})),e.page$.commit((function(){return t.page}))})))}}]),t}();Object(f["b"])([Object(b["c"])(),Object(f["d"])("design:type",Function),Object(f["d"])("design:paramtypes",[Object]),Object(f["d"])("design:returntype",void 0)],Y.prototype,"getList",null),Y=Object(f["b"])([Object(_["b"])(),Object(f["d"])("design:paramtypes",["function"===typeof(A="undefined"!==typeof y["a"]&&y["a"])?A:Object])],Y);var D=function(t){return[{title:"省",dataIndex:"province_name"},{title:"市",dataIndex:"city_name"},{title:"区",dataIndex:"district_name"},{title:"门店名称",dataIndex:"shop_name"}]},F={name:"ModalBrandFinanceStaffShop",bem:{b:"modal-brand-finance"},serviceInject:function(){return{staffShopService:Y}},rxState:function(){return{loading:this.staffShopService.loading$,list:this.staffShopService.list$,page:this.staffShopService.page$}},computed:{columns:D},props:{id:{type:[String,Number]}},data:function(){return{show:!1}},created:function(){this.getList({monthly_summary_id:this.id,size:20,current_page:1})},methods:{onChangeCourseType:function(t){this.course_type=t,this.getList({monthly_summary_id:this.id,size:20,current_page:1})},getList:function(t){return this.staffShopService.getList(t).subscribe()},onPageChange:function(t){this.getList({monthly_summary_id:this.id,size:t.pageSize,current_page:t.current})}}},B=F,q=Object(w["a"])(B,N,M,!1,null,null,null),K=q.exports,G=n("c32d"),J=n.n(G),U=n("5c8a"),W={name:"BrandFinanceSalary",mixins:[u["a"]],data:function(){return{monthRange:[],start_month:null,end_month:null}},bem:{b:"page-brand-finance-salary",bDate:"st-recent-radio-group"},modals:{BrandFinanceClassCommission:C,BrandFinanceSaleCommission:z,BrandFinanceStaffShop:K},serviceInject:function(){return{listService:o["ListService"],userService:l["a"]}},rxState:function(){return{list:this.listService.list$,page:this.listService.page$,loading:this.listService.loading$,info:this.listService.info$,department:this.listService.department$,shopList:this.userService.shopList$,auth:this.listService.auth$}},computed:{columns:c},mounted:function(){this.setQueryParams()},watch:{$searchQuery:function(){this.setQueryParams()}},methods:{setQueryParams:function(){this.start_month=null,this.end_month=null,this.$searchQuery.start_month&&this.$searchQuery.end_month&&(this.start_month=J()(this.$searchQuery.start_month),this.end_month=J()(this.$searchQuery.end_month))},change:function(){this.start_month&&this.end_month&&(this.$searchQuery.start_month=this.start_month.format("YYYY-MM"),this.$searchQuery.end_month=this.end_month.format("YYYY-MM"),this.onSearch()),this.start_month||this.end_month||(this.$searchQuery.start_month="",this.$searchQuery.end_month="",this.onSearch())},disabledStartDate:function(t){if(this.end_month){var e=Object(U["a"])(t).startOf("month"),n=Object(U["a"])(this.end_month).startOf("month");return e>Object(U["a"])(this.end_month).startOf("month")||e<=n.subtract(12,"M")}return!1},disabledEndDate:function(t){if(this.start_month){var e=Object(U["a"])(this.start_month).startOf("month"),n=Object(U["a"])(t).startOf("month");return n<Object(U["a"])(this.start_month).startOf("month")||n>=e.add(1,"y")}return!1}}},H=W,V=Object(w["a"])(H,a,r,!1,null,null,null);e["default"]=V.exports},5664:function(t,e,n){"use strict";var i,s;n.d(e,"a",(function(){return i})),n.d(e,"b",(function(){return s})),function(t){t[t["PERSONAL"]=1]="PERSONAL",t[t["PERSONAL_TEAM"]=2]="PERSONAL_TEAM",t[t["TEAM"]=3]="TEAM",t[t["SMALL"]=5]="SMALL"}(i||(i={})),function(t){t[t["SINGLE"]=1]="SINGLE",t[t["CYCLE"]=2]="CYCLE",t[t["ALL_CYCLE"]=3]="ALL_CYCLE"}(s||(s={}))},"7eb2":function(t,e,n){"use strict";n.r(e),n.d(e,"TemplateService",(function(){return c}));var i,s=n("d225"),a=n("9ab4"),r=n("0cd5"),o=n("2cbb"),c=function t(e){Object(s["a"])(this,t),this.authService=e,this.authTabs$=this.authService.getAuthTabs$("brand-finance-salary-template")};c=Object(a["b"])([Object(r["b"])(),Object(a["d"])("design:paramtypes",["function"===typeof(i="undefined"!==typeof o["a"]&&o["a"])?i:Object])],c)},"8e09":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("st-panel",{attrs:{tabs:t.authTabs,app:""}},[n("div",{attrs:{slot:"actions"},slot:"actions"}),n("router-view")],1)},s=[],a=n("7eb2"),r={serviceInject:function(){return{templateService:a["TemplateService"]}},rxState:function(){return{authTabs:this.templateService.authTabs$}}},o=r,c=n("2877"),u=Object(c["a"])(o,i,s,!1,null,null,null);e["default"]=u.exports},da2b:function(t,e,n){"use strict";n.d(e,"a",(function(){return d}));n("6b54"),n("2397");var i=n("d225"),s=n("b0b4"),a=n("308d"),r=n("6bb5"),o=n("4e2b"),c=n("de46");function u(t){return function(){var e,n=Object(r["a"])(t);if(l()){var i=Object(r["a"])(this).constructor;e=Reflect.construct(n,arguments,i)}else e=n.apply(this,arguments);return Object(a["a"])(this,e)}}function l(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}var d=function(t){Object(o["a"])(n,t);var e=u(n);function n(){return Object(i["a"])(this,n),e.apply(this,arguments)}return Object(s["a"])(n,[{key:"getList",value:function(t){return this.http.get("/v1/stat/salary/brand",{query:t})}},{key:"getClassCommissionList",value:function(t){return this.http.get("/v1/stat/salary/brand/course_commissions/".concat(t.monthly_summary_id),{query:t})}},{key:"getSaleCommissionList",value:function(t){return this.http.get("/v1/stat/salary/brand/sale_commissions/".concat(t.monthly_summary_id),{query:t})}},{key:"getStaffShopList",value:function(t){return this.http.get("/v1/stat/salary/staff_shop/".concat(t.monthly_summary_id),{query:t})}}]),n}(c["a"])},f190:function(t,e,n){"use strict";n.r(e),n.d(e,"ListService",(function(){return _}));var i,s,a,r=n("d225"),o=n("b0b4"),c=n("9ab4"),u=n("0cd5"),l=n("da2b"),d=n("54da"),h=n("c4cc"),m=n("df29"),p=n("2cbb"),f=n("cc76"),_=function(){function t(e,n,i){Object(r["a"])(this,t),this.authService=e,this.salaryApi=n,this.shopStaffApi=i,this.list$=new m["d"]([]),this.page$=new m["d"]({}),this.loading$=new m["d"]({}),this.info$=new m["d"]({}),this.department$=new m["d"]([]),this.auth$=this.authService.authMap$({add:"brand:activity:turn|add",destory:"brand:activity:prize|add"})}return Object(o["a"])(t,[{key:"getList",value:function(t){var e=this;return this.salaryApi.getList(t).pipe(Object(h["a"])((function(t){e.list$.commit((function(){return t.list})),e.page$.commit((function(){return t.page}))})))}},{key:"getDepartmentList",value:function(){var t=this;return this.shopStaffApi.searchDepartment().pipe(Object(h["a"])((function(e){t.department$.commit((function(){return e.department}))})))}},{key:"init",value:function(t){return Object(d["a"])(this.getList(t),this.getDepartmentList())}},{key:"beforeEach",value:function(t,e){return this.init(t.meta.query)}}]),t}();Object(c["b"])([Object(m["c"])(),Object(c["d"])("design:type",Function),Object(c["d"])("design:paramtypes",[Object]),Object(c["d"])("design:returntype",void 0)],_.prototype,"getList",null),_=Object(c["b"])([Object(u["b"])(),Object(c["d"])("design:paramtypes",["function"===typeof(i="undefined"!==typeof p["a"]&&p["a"])?i:Object,"function"===typeof(s="undefined"!==typeof l["a"]&&l["a"])?s:Object,"function"===typeof(a="undefined"!==typeof f["g"]&&f["g"])?a:Object])],_)}}]);