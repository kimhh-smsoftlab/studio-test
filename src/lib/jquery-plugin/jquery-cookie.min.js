/*
 jQuery Cookie Plugin v1.4.1
 https://github.com/carhartl/jquery-cookie

 Copyright 2006, 2014 Klaus Hartl
 Released under the MIT license
*/
(function(c){"function"===typeof define&&define.amd?define(["jquery"],c):"object"===typeof exports?module.exports=c(require("jquery")):c(jQuery)})(function(c){function m(a){return e.raw?a:decodeURIComponent(a)}function q(a){a=e.json?JSON.stringify(a):String(a);return e.raw?a:encodeURIComponent(a)}function n(a,d){if(e.raw)var b=a;else a:{0===a.indexOf('"')&&(a=a.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{a=decodeURIComponent(a.replace(k," "));b=e.json?JSON.parse(a):a;break a}catch(h){}b=
void 0}return c.isFunction(d)?d(b):b}var k=/\+/g,e=c.cookie=function(a,d,b){if(1<arguments.length&&!c.isFunction(d)){b=c.extend({},e.defaults,b);if("number"===typeof b.expires){var h=b.expires,f=b.expires=new Date;f.setMilliseconds(f.getMilliseconds()+864E5*h)}return document.cookie=[e.raw?a:encodeURIComponent(a),"=",q(d),b.expires?"; expires="+b.expires.toUTCString():"",b.path?"; path="+b.path:"",b.domain?"; domain="+b.domain:"",b.secure?"; secure":""].join("")}h=a?void 0:{};f=document.cookie?document.cookie.split("; "):
[];for(var l=0,k=f.length;l<k;l++){var g=f[l].split("="),p=m(g.shift());g=g.join("=");if(a===p){h=n(g,d);break}a||void 0===(g=n(g))||(h[p]=g)}return h};e.defaults={};c.removeAllCookie=function(a){for(var d=document.cookie?document.cookie.split("; "):[],b=0,e=d.length;b<e;b++){var f=d[b].split("=");f=m(f.shift());c.cookie(f,"",c.extend({},a,{expires:-1}))}};c.removeCookie=function(a,d){c.cookie(a,"",c.extend({},d,{expires:-1}));return!c.cookie(a)}});
