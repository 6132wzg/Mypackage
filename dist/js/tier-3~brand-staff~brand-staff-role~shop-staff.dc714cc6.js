(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["tier-3~brand-staff~brand-staff-role~shop-staff"],{"1c4c":function(e,t,n){"use strict";var r=n("9b43"),a=n("5ca1"),i=n("4bf8"),o=n("1fa8"),c=n("33a4"),l=n("9def"),u=n("f1ae"),s=n("27ee");a(a.S+a.F*!n("5cc5")((function(e){Array.from(e)})),"Array",{from:function(e){var t,n,a,f,d=i(e),h="function"==typeof this?this:Array,p=arguments.length,v=p>1?arguments[1]:void 0,m=void 0!==v,y=0,b=s(d);if(m&&(v=r(v,p>2?arguments[2]:void 0,2)),void 0==b||h==Array&&c(b))for(t=l(d.length),n=new h(t);t>y;y++)u(n,y,m?v(d[y],y):d[y]);else for(f=b.call(d),n=new h;!(a=f.next()).done;y++)u(n,y,m?o(f,v,[a.value,y],!0):a.value);return n.length=y,n}})},"3bc6":function(e,t,n){"use strict";n.d(t,"b",(function(){return f}));n("6b54"),n("2397");var r=n("d225"),a=n("b0b4"),i=n("308d"),o=n("6bb5"),c=n("4e2b"),l=n("de46");function u(e){return function(){var t,n=Object(o["a"])(e);if(s()){var r=Object(o["a"])(this).constructor;t=Reflect.construct(n,arguments,r)}else t=n.apply(this,arguments);return Object(i["a"])(this,t)}}function s(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}var f=function(e){Object(c["a"])(n,e);var t=u(n);function n(){return Object(r["a"])(this,n),t.apply(this,arguments)}return Object(a["a"])(n,[{key:"getNormalList",value:function(){return this.http.get("/v1/common/role/normal")}},{key:"getRoleOptions",value:function(e){return this.http.get("/v1/common/role/".concat(e,"/staff"))}},{key:"getAllList",value:function(){return this.http.get("/v1/common/role/all")}},{key:"getInitInfo",value:function(e){return this.http.get("/v1/common/role/init",{query:e})}},{key:"getInfo",value:function(e){return this.http.get("/v1/common/role/setting/".concat(e.role_id))}},{key:"add",value:function(e){return this.http.post("/v1/common/role",{params:e})}},{key:"del",value:function(e){return this.http.delete("/v1/common/role/".concat(e.role_id))}},{key:"update",value:function(e){return this.http.put("/v1/common/role/".concat(e.id),{params:e})}}]),n}(l["a"])},"9e5b":function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a-tree-select",{style:{width:e.size},attrs:{showSearch:"",value:e.value,dropdownStyle:{maxHeight:"400px",overflow:"auto"},placeholder:e.placeholder,allowClear:"",labelInValue:e.labelInValue,showCheckedStrategy:e.SHOW_PARENT,treeCheckable:e.treeCheckable,treeDefaultExpandAll:""},on:{change:e.onChange}},e._l(e.departmentOptions,(function(t){return n("a-tree-select-node",{key:t.id,attrs:{value:t.id,title:t.name}},e._l(t.children,(function(t){return n("a-tree-select-node",{key:t.id,attrs:{value:t.id,title:t.name}},e._l(t.children,(function(t){return n("a-tree-select-node",{key:t.id,attrs:{value:t.id,title:t.name}},e._l(t.children,(function(t){return n("a-tree-select-node",{key:t.id,attrs:{value:t.id,title:t.name}},[e._l(t.children,(function(e){return n("a-tree-select-node",{key:e.id,attrs:{value:e.id,title:e.name}})})),e._v("\n          >\n        ")],2)})),1)})),1)})),1)})),1)},a=[],i=(n("7f7f"),n("c5f6"),n("dcb5")),o=n("4e72"),c=o["TreeSelect"].SHOW_PARENT,l={name:"DepartmentSelect",serviceInject:function(){return{staffApi:i["k"]}},model:{prop:"value",event:"change"},props:{mode:{type:String},placeholder:{type:String},useType:{type:String},value:{type:[Number,String,Array]},size:{type:String},labelInValue:{type:Boolean,default:!1},treeCheckable:{type:Boolean}},data:function(){return{departmentOptions:[],SHOW_PARENT:c}},computed:{modelValue:function(){if(this.value)return this.value+""}},methods:{onChange:function(e,t,n){this.$emit("changeLabel",{value:e,lable:t}),this.$emit("change",e)},traverseTree:function(e){var t=this;return e.map((function(e){return e.children?{name:e.name,children:t.traverseTree(e.children),id:e.id+"",count:e.count}:e}))},getDepartmentList:function(){var e=this;this.staffApi.getDepartmentList().subscribe((function(t){e.departmentOptions=e.traverseTree(t.department)}))},init:function(){this.getDepartmentList()}},mounted:function(){this.init()}},u=l,s=n("2877"),f=Object(s["a"])(u,r,a,!1,null,null,null);t["a"]=f.exports}}]);