(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["tier-2~brand-marketing-plugin-activity-registration~brand-setting-shop"],{"99c0":function(t,e,s){"use strict";var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{class:t.mapButton(),on:{click:t.map}},[t.isAdd?s("div",{class:t.mapButton("add")},[s("st-icon",{class:t.mapButton("icon"),attrs:{type:"location",size:"32px"}}),s("p",[t._v(t._s(t.addText))])],1):s("div",{class:t.mapButton("update")},[s("p",[t._v(t._s(t.province.name+" "+t.city.name+" "+t.district.name))]),s("p",[t._v(t._s(t.pureAddress))])])])},a=[],n=(s("7f7f"),s("a481"),function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("st-modal",{attrs:{title:t.title,footer:null,wrapClassName:"st-modal-map",width:"484px"},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[s("div",{class:t.map("search")},[s("a-cascader",{class:t.map("cascader"),attrs:{options:t.regions,fieldNames:t.fieldNames},on:{change:t.cascaderChange},model:{value:t.PC,callback:function(e){t.PC=e},expression:"PC"}},[s("a",{class:t.map("cascader__btn"),attrs:{href:"javascript:void(0)"}},[t._v("\n        "+t._s(t.selectCity)+"\n        "),s("st-icon",{class:t.map("icon"),attrs:{type:"down",size:"12px"}})],1)]),s("div",{class:t.map("search-input")},[s("a-dropdown",{attrs:{trigger:["click"]},model:{value:t.dropdownVisible,callback:function(e){t.dropdownVisible=e},expression:"dropdownVisible"}},[s("a-input-search",{class:{error:!t.latlngIsOk},attrs:{placeholder:"请输入街道、小区或商圈名称"},on:{change:t.onChange,input:t.searchInput,search:t.onSearch},model:{value:t.searchText,callback:function(e){t.searchText=e},expression:"searchText"}}),s("ul",{directives:[{name:"scrollBar",rawName:"v-scrollBar",value:{stopPropagation:!0},expression:"{ stopPropagation: true }"}],class:t.map("search-menu"),attrs:{slot:"overlay"},slot:"overlay"},[t.poisList.length?t._e():s("li",{class:t.map("search-faild")},[t._v("无结果")]),t.poisList.length?t._l(t.poisList,(function(e,i){return s("li",{key:i,class:t.map("search-item"),on:{click:function(s){return t.selectLocation(e)}}},[s("p",{class:t.map("search-title")},[t._v(t._s(e.name))]),e.location?s("span",{class:t.map("search-describe")},[t._v("\n                "+t._s(e.location.detail.detail.split(",").reverse().join(""))+"\n              ")]):t._e()])})):t._e()],2)],1)],1)],1),s("div",{class:t.map("map"),attrs:{id:"mapcontainer"}}),s("div",{class:t.map("address")},[s("a-textarea",{class:{error:!t.addressIsOk},attrs:{placeholder:"详细地址，例：16号楼5层502",rows:3},model:{value:t.st_address,callback:function(e){t.st_address=e},expression:"st_address"}})],1),s("div",{class:t.map("button")},[t.latlngIsOk&&t.addressIsOk?t._e():s("span",{class:t.map("error-info")},[t._v("\n      "+t._s(t.errorText)+"\n    ")]),s("st-button",{attrs:{type:"primary"},on:{click:t.handleOk}},[t._v("提交")])],1)])}),c=[],r=(s("386d"),s("ac6a"),s("62eb")),o=s("45e9"),l=s("74d8"),d=s("5c8a"),p=s("1c8f"),h={bem:{map:"st-modal-map"},name:"StModalMap",serviceInject:function(){return{regionService:r["a"],appConfig:l["a"],qqMapService:o["a"]}},computed:{isAdd:function(){return""===this.lat||""===this.lng}},props:{title:{type:String,default:function(){return"门店定位"}},address:{type:String,default:function(){return"无"}},province:{type:Object,default:function(){return{}}},city:{type:Object,default:function(){return{}}},district:{type:Object,default:function(){return{}}},lat:{type:String,default:function(){return""}},lng:{type:String,default:function(){return""}}},data:function(){return{show:!1,dropdownVisible:!1,errorText:"",latlngIsOk:!0,addressIsOk:!0,fieldNames:{label:"name",value:"id",children:"children"},regions:[],searchText:"",selectCity:"上海市",PC:[31e4,310100],st_address:"",st_province:{},st_city:{},st_district:{},locationData:{},locationObject:null,poisList:[],selectData:{province:{},city:{},district:{},address:"",lat:"",lng:""}}},mounted:function(){this.init()},watch:{st_address:function(t,e){this.selectData.address=t,this.addressIsOk=!0,this.errorText=this.latlngIsOk?"":"请选择具体地址!"}},methods:{init:function(){var t=this;if(this.getRegions(),this.st_address=this.address,this.st_province=Object(d["a"])(this.province),this.st_city=Object(d["a"])(this.city),this.st_district=Object(d["a"])(this.district),this.isAdd)this.qqMapService.getLocation("https://apis.map.qq.com/ws/location/v1/ip?output=jsonp&key=".concat(this.appConfig.QQ_MAP_KEY,"&callback=")).subscribe((function(e){if(0===e.status){var s=e.result.ad_info.adcode,i="".concat(s).substr(0,2)+"0000",a="".concat(s).substr(0,4)+"00";t.selectData.province={id:+i,name:e.result.ad_info.province},t.selectData.city={id:+a,name:e.result.ad_info.city},t.PC=[+i,+a,e.result.ad_info.adcode],t.selectCity=e.result.ad_info.city,t.locationData=Object(d["a"])(e.result)}else t.locationFailed(),t.locationData={location:{lat:"31.230350",lng:"121.473720"}};var n=t.locationData.location,c=n.lat,r=n.lng;t.qqMapService.init({lat:c,lng:r}).then((function(){t.initSearch({location:t.selectCity})}))}));else{this.selectData.province=Object(d["a"])(this.st_province),this.selectData.city=Object(d["a"])(this.st_city),this.PC=[this.st_province.id,this.st_city.id],this.selectCity=this.st_city.name,this.locationData={location:{lat:this.lat,lng:this.lng}};var e=this.locationData.location,s=e.lat,i=e.lng;this.qqMapService.init({lat:s,lng:i}).then((function(){t.initSearch({location:t.selectCity})}))}},getRegions:function(){var t=this;this.regionService.getRegionPC().subscribe((function(e){t.regions=e}))},locationFailed:function(){this.selectData.province={id:31e4,name:"上海市"},this.selectData.city={id:310100,name:"上海市"},this.selectCity="上海市"},cascaderChange:function(t){var e=Object(d["a"])(this.regions[Object(p["a"])(this.regions,(function(e){return e.id===t[0]}))]),s=Object(d["a"])(e.children[Object(p["a"])(e.children,(function(e){return e.id===t[1]}))]);this.selectData.province={id:t[0],name:e.name},this.selectData.city={id:t[1],name:s.name},this.selectCity=s.name,this.searchText="",this.poisList=[],this.selectData.address=this.st_address="",this.selectData.lat="",this.selectData.lng=""},initSearch:function(t){t.location;var e=this;this.searchServiceObject=new qq.maps.SearchService({location:"上海市",autoExtend:!1,error:function(t){e.poisList=[]},complete:function(t){"POI_LIST"===t.type?(t.detail.pois.length&&t.detail.pois.forEach((function(t,s){var i=new qq.maps.LatLng(t.latLng.lat,t.latLng.lng);e.initLocation(s).searchCityByLatLng(i)})),e.poisList=Object(d["a"])(t.detail.pois)):e.poisList=[]}})},initLocation:function(t){var e=this;return new qq.maps.CityService({complete:function(s){e.$set(e.poisList[t],"location",s)}})},onSearch:function(t){this.dropdownVisible=!0,this.searchServiceObject.setLocation(this.selectCity),this.searchServiceObject.search(t)},onChange:function(t){this.dropdownVisible=!0,this.searchServiceObject.setLocation(this.selectCity),this.searchServiceObject.search(t.target.value)},selectLocation:function(t){this.dropdownVisible=!1,this.searchText=t.name,this.selectData.address=this.st_address=t.address;var e=new qq.maps.LatLng(t.latLng.lat,t.latLng.lng);this.qqMapService.resetMap(e),this.selectData.lat=String(t.latLng.lat),this.selectData.lng=String(t.latLng.lng)},searchInput:function(){this.latlngIsOk=!0,this.errorText=this.addressIsOk?"":"请输入详细地址！"},handleOk:function(){var t=this;this.latlngIsOk=""!==this.selectData.lat&&""!==this.selectData.lng,this.addressIsOk=""!==this.selectData.address,this.latlngIsOk||this.addressIsOk?this.latlngIsOk?this.addressIsOk?this.qqMapService.getLocation("https://apis.map.qq.com/ws/geocoder/v1/?location=".concat(this.selectData.lat,",").concat(this.selectData.lng,"&output=jsonp&key=").concat(this.appConfig.QQ_MAP_KEY,"&callback=")).subscribe((function(e){var s=e.result.ad_info.adcode,i="".concat(s).substr(0,2)+"0000",a="".concat(s).substr(0,4)+"00";t.selectData.province.id=+i,t.selectData.province.name=e.result.ad_info.province,t.selectData.city.id=+a,t.selectData.city.name=e.result.ad_info.city,t.selectData.district.id=+e.result.ad_info.adcode,t.selectData.district.name=e.result.ad_info.district,t.selectData.district.id=+e.result.ad_info.adcode,t.selectData.district.name=e.result.ad_info.district,t.$emit("ok",t.selectData),t.show=!1})):this.errorText="请输入详细地址!":this.errorText="请选择具体地址!":this.errorText="请选择具体地址并输入详细地址!"}}},u=h,f=s("2877"),m=Object(f["a"])(u,n,c,!1,null,null,null),v=m.exports,g={bem:{mapButton:"st-map-button"},name:"StMapButton",modals:{ShopMap:v},props:{addText:{type:String,default:function(){return"设置门店地址"}},address:{type:String,default:function(){return"无"}},province:{type:Object,default:function(){return{}}},city:{type:Object,default:function(){return{}}},district:{type:Object,default:function(){return{}}},lat:{type:String,default:function(){return""}},lng:{type:String,default:function(){return""}}},computed:{isAdd:function(){return""===this.lat||""===this.lng},st_province:function(){return this.province},st_city:function(){return this.city},st_district:function(){return this.district},pureAddress:function(){return this.address.replace(this.province.name,"").replace(this.city.name,"").replace(this.district.name,"")}},methods:{map:function(){this.$modalRouter.push({name:"shop-map",props:{lat:this.lat,lng:this.lng,province:this.st_province,city:this.st_city,district:this.st_district,address:this.address},on:{ok:this.mapOk}})},mapOk:function(t){this.$emit("select",t),this.$emit("change",t)}}},_=g,b=Object(f["a"])(_,i,a,!1,null,null,null);e["a"]=b.exports}}]);