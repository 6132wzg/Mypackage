(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["notify-activity"],{ae59:function(t,i,e){"use strict";e.r(i);var s=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("st-modal",{attrs:{wrapClassName:t.b(),width:"640px",footer:null},model:{value:t.show,callback:function(i){t.show=i},expression:"show"}},[e("div",{class:t.b("arrow-left"),on:{click:t.onClickLeft}},[e("st-icon",{staticClass:"arrow-left-out",attrs:{type:"arrow-left"}})],1),e("div",{class:t.b("notify-img")},[e("swiper",{ref:"swiper",attrs:{options:t.sliderOptions}},[t._l(t.list,(function(t,i){return e("swiper-slide",{key:i},[e("div",[t.announcement_link.length>0?e("a",{attrs:{href:t.announcement_link,target:"_blank"}},[e("img",{attrs:{src:t.image_key,alt:"",width:"728",height:"400"}})]):e("a",[e("img",{attrs:{src:t.image_key,alt:"",width:"728",height:"400"}})])])])})),e("div",{staticClass:"swiper-pagination swiper-pagination-h",attrs:{slot:"pagination"},slot:"pagination"})],2)],1),e("div",{class:t.b("arrow-right"),on:{click:t.onClickRight}},[e("st-icon",{staticClass:"arrow-left-out",attrs:{type:"arrow-right"}})],1)])},n=[],a=e("7212"),o=(e("dfa4"),{name:"ModalActivity",bem:{b:"modal-common-notify-activity"},components:{swiper:a["swiper"],swiperSlide:a["swiperSlide"]},props:{list:Array},computed:{sliderOptions:function(){return{pagination:{el:".swiper-pagination-h",clickable:!0},autoplay:{delay:5e3,disableOnInteraction:!1},loop:!0,spaceBetween:30,centeredSlides:!0}}},data:function(){return{show:!0,notifyConfig:{}}},methods:{onClickLeft:function(){this.$refs.swiper.swiper.slidePrev()},onClickRight:function(){this.$refs.swiper.swiper.slideNext()}},created:function(){this.$emit("success")}}),r=o,l=e("2877"),c=Object(l["a"])(r,s,n,!1,null,null,null);i["default"]=c.exports}}]);