(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-home-login"],{"2adf":function(t,e,n){"use strict";var a=n("7be4"),r=n.n(a);r.a},"5d1b":function(t,e,n){"use strict";var a;n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return i})),n.d(e,"a",(function(){return a}));var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"content"},[n("v-uni-image",{staticClass:"logo",attrs:{src:"/static/logo.png"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.login.apply(void 0,arguments)}}}),n("v-uni-view",{staticClass:"text-area"},[n("v-uni-text",{staticClass:"title"},[t._v(t._s(t.title))])],1),t.user?n("div",{staticClass:"user"},[n("div",[t._v(t._s(t.user.username))]),n("div",[t._v(t._s(t.user.status))]),n("div",[t._v(t._s(t.user.token))])]):t._e()],1)},i=[]},"7be4":function(t,e,n){var a=n("b54b");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var r=n("4f06").default;r("cd38a780",a,!0,{sourceMap:!1,shadowMode:!1})},"85e6":function(t,e,n){"use strict";n.r(e);var a=n("fb60"),r=n.n(a);for(var i in a)"default"!==i&&function(t){n.d(e,t,(function(){return a[t]}))}(i);e["default"]=r.a},b54b:function(t,e,n){var a=n("24fb");e=a(!1),e.push([t.i,".content[data-v-7a55a052]{display:flex;flex-direction:column;align-items:center;justify-content:center}.logo[data-v-7a55a052]{height:%?200?%;width:%?200?%;margin-top:%?200?%;margin-left:auto;margin-right:auto;margin-bottom:%?50?%}.text-area[data-v-7a55a052]{display:flex;justify-content:center}.title[data-v-7a55a052]{font-size:%?36?%;color:#8f8f94}",""]),t.exports=e},ed95:function(t,e,n){"use strict";n.r(e);var a=n("5d1b"),r=n("85e6");for(var i in r)"default"!==i&&function(t){n.d(e,t,(function(){return r[t]}))}(i);n("2adf");var o,s=n("f0c5"),u=Object(s["a"])(r["default"],a["b"],a["c"],!1,null,"7a55a052",null,!1,a["a"],o);e["default"]=u.exports},fb60:function(t,e,n){"use strict";var a=n("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n("96cf");var r=a(n("1da1")),i={data:function(){return{title:"Hello",user:null}},onLoad:function(){},methods:{login:function(){var t=this;return(0,r.default)(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.Api.sendUniCloud(t,{model:"login",event:{username:"admin",password:"123456"}});case 2:n=e.sent,console.log(n,"res"),t.user=n.data;case 5:case"end":return e.stop()}}),e)})))()}}};e.default=i}}]);