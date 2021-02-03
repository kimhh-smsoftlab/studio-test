/*!
* Version: 1.0.0
* Author: Kim Chang Ha
* Created: 모듈 데이터 파일 관리 기능
* Revisions:
* 
* Copyright @ Korea Sorimachi Co.,Ltd. All Rights Reserved.
*/

'use strict';
window.hi5_svrmode = document.getElementsByTagName('html')[0].getAttribute('hi5svr') || "";
window.hi5_dev_mode = document.getElementsByTagName('html')[0].getAttribute('dev_mode') || "";
window.hi5app_name = document.getElementsByTagName('html')[0].getAttribute('hi5app');
window.hi5admin = document.getElementsByTagName('html')[0].getAttribute('hi5admin')||"";
window.hi5_WAS = document.getElementsByTagName('html')[0].getAttribute('hi5_WAS');
window.hi5_uimode = document.getElementsByTagName('html')[0].getAttribute('hi5ui') || "";
window.hi5_baseCurr = document.getElementsByTagName('html')[0].getAttribute('basecurr');    // 기초통화 2019.02.19 kws
window.TextEncoder = window.TextDecoder = null;
window.hi5_scrJS = {};

var hi5_cbMng = {};
var hi5_hash = function (options) {
    Object.defineProperties(this, {
        paths: {
            enumerable: true,
            value: getpaths
        },
        cb: {
            value: getCachebuster
        },
        css: {
            enumerable: true,
            value: getCSS
        },
        changecss: {
            enumerable: true,
            value: changeMultiColorCSS
        },
        count: {
            enumerable: true,
            value: getCount
        },
        contents: {
            enumerable: false,
            get: getData,
            set: setData
        },
        record: {
            value: getItem,
        },
        shim: {
            enumerable: false,
            get: getShimData,
            set: setShimData
        },
        lang:{
            value:getLang
        },
        init: {
            enumerable: true,
            writable: true,
            value: init
        }
        // etc. etc.
    });
    
    var self = {},  shim = {};

    for (var prop in options.hash) {
        var obj = options.hash[prop];
        if (obj.mode == undefined || obj.mode == options.mode) {
            self[prop] = obj;
        }
    }

    for (var prop in options.shim) {
        var obj = options.shim[prop];
        if (obj.mode == undefined || obj.mode == options.mode) {
            shim[prop] = obj;
        }
    }

    function getpaths(option) {

        var obj = option.path ? {} : [];
        if (option.key) {
            var data = {}, that = this, deps = hi5.isArray(option.key) ? option.key : option.key.split();
            deps.forEach(function (key) {
                obj = self[key];
                if (obj) {
                    if (option.require) {
                        data[key] = self[key].path;
                    } else {
                        if (option.path)
                            data[key] = { url: hi5_cbMng.getURL({ url: obj.path }), data: obj.data, cb: that.cb({ key: key, json: option.json }) };
                        else
                            data[key] = { url: obj.path, data: obj.data, cb: that.cb({ key: key, json: option.json }) };
                    }
                }
            });
            return data;
        }

        for (var key in self) {
            if (option.local_lang) {
                if (self[key].lang) {
                    obj.push(key);
                }
                continue;
            }

            if (self[key].init != undefined && self[key].init == "N") continue;
            if (typeof (self[key]) != "function" && self[key].data == undefined) {
                if (self.hasOwnProperty(key)) {
                    if (option.path) {
                        obj[key] = self[key].path;
                    } else {
                        obj.push(key);
                    }
                }
            }
        }
        return obj;
    }

    // 언어별 색정보 css 정보를 변경한다.
    function changeMultiColorCSS(option) {
        var key = option.key, theme = "en";
        // 국문/일본어 버전은 ko, 그외: 영문버전
        if (option.lang == 'ko' || option.lang == 'jp')
            theme = "ko";

        var obj = self[key], path = "css/" + theme + "/" + obj.path;
        var href = hi5_cbMng.getURL({ url: path }) + this.cb({ key: key });
        option.id.attr("href", href);
    }

    function getCSS() {
        var paths = [], obj = {};
        for (var key in self) {
            if (typeof (self[key]) != "function" && self[key].data == "css") {
                if (self.hasOwnProperty(key)) {
                    obj = self[key];
                    if (obj.app) {  //거래소별로 각기 다른 css를 호출할 시 2018.09.18 kiwon34
                        if (hi5app_name != obj.app) {
                            continue;
                        }
                    }
                    paths.push({ url: hi5_cbMng.getURL({ url: obj.path }) + this.cb({ key: key }) });
                }
            }
        }
        return paths;
    }

    function getCachebuster(options) {
        var key = options.key, url = options.url;
        var obj = self[key];
        if (obj) {
            var cb = "", val="1";
            // 개발모드
            try {
                if (obj.cb) {
                    if (typeof (obj.cb) === 'string') {
                        val = (obj.cb !== "" ) ? obj.cb : "-";
                    } else if (typeof (obj.cb) === 'object') {
                        val = Object.keys(obj.cb).length == 0 ? "-" : JSON.stringify(obj.cb);
                    }
                    val = (val == "-") ? (new Date()).getTime().toString() : val;
                } else {
                    val = (obj.cb == undefined ? "1" : obj.cb);
                }
             } catch (e) {
                console.log(e);
             }

            cb = options.json == true ? 'cb=' + val : '?cb=' + val;  // $.getJSON() 함수사용시는 cb값만 반환...하니깐 cb가 안붙는다. 2019.08.19 cb=를 붙여줘야한다.
            return cb;
        }
        return "";
    }

    function getCount() {
        var count = 0;
        for (var key in self) {
            if (typeof (self[key]) != "function") {
                if (self.hasOwnProperty(key)) {
                    if (self[key].init != undefined && self[key].init == "N") continue;
                    count++;
                }
            }
        }
        return count;
    }
    function getLang(option) {
        var cb, path = [];
        for (var key in self) {
            if (typeof (self[key]) != "function") {
                var obj;
                if (self.hasOwnProperty(key)) {
                    obj = self[key];
                    if (obj.lang) {
                        obj.path = obj.def + (option.local_lang != undefined ? option.local_lang : document.documentElement.lang || "ko");
                        cb = obj.cb;
                        path.push(obj.path);
                    }
                }
            }
        }
        return {
            cb: cb,
            depths: path
        }
    }

    function init(option) {
        var obj;
        for (var key in self) {
            if (typeof (self[key]) != "function") {
                if (self.hasOwnProperty(key)) {
                    obj = self[key];
                    if (obj.lang) {
                        obj.path = obj.def + (option.local_lang != undefined ? option.local_lang : document.documentElement.lang || "ko");
                        continue;
                    }
                    if (option.local_lang) continue;

                    if (obj.path === "") {
                        if (option.dev) {
                            obj.path = obj.dev;
                        } else {
                            obj.path = obj.real;
                        }
                    }

                    // 파일명을 변경
                    if (key == "memberfile") {
                        obj.path = obj.path.replace("__", hi5app_name);
                    }
                    if (obj.data === "control" && obj.fn === undefined) {
                        obj["fn"] = null;
                    }
                    if ( hi5_dev_mode == "dev" && key == "images_css" )
                    {
                        obj.path = "css/images_local.css";
                    }
                }
            }
        }
    }
    function getItem(key) {
        return self[key] == undefined ? null : self[key];
    }
    function getData() {
        return self;
    }

    function setData(val) {
        self = val;
    }

    function setShimData(val) {
        shim = val;
    }

    function getShimData() {
        return shim;
    }

}

// URL 정보 취득함수
hi5_cbMng.getURL = function (option) {
    if (option.lang) {
        var lang = local_lang || "ko";
        option.url = option.url.replace("$$", lang);
    }
    if (hi5_dev_mode == "dev" && hi5_svrmode == "" && hi5_baseURL == "") return option.url;
    var url = hi5_baseURL, len =  url.length;
    if ( len > 0 ){
        if (url[len-1] == '/') {
            url = hi5_baseURL.substring(0, len - 1);
        }
    }

    if (option.url) {
        if (option.url[0] == '/') {
            url = url + option.url;
        } else if (option.url[0] == '.') {  // ./xxx
            url = url + option.url.substr(1);
        } else {
            url = url + "/" + option.url;
        }
    }
    return url;
}

// cachebusterfile 로드
hi5_cbMng.cachebusterDownLoad = function (obj, fn, config) {
    var self = this,
        rnd, url = obj.url,
        cb = function (data, config) {
            fn(data, config);
        },
        xhr;

    if (url) {
		if(url.indexOf('/') == 0) url = url.substring(1, url.length);
        rnd = '?cb=' + (obj.cb == undefined ? (new Date()).getTime() : obj.cb);
        xhr = new XMLHttpRequest;

        xhr.open("GET", url + rnd, true);
        xhr.onload = function (e) {
            if (this.status == 200) {
                cb(xhr.response, config )
            }
        };
        xhr.send();
    }
}


// cachebuster 정보파일 다운받은것을 처리하는 함수
function hi5_loadStart(config) {
    //var cbdata = JSON.parse(text);
    
    hi5_hash = new hi5_hash({ hash: g_hi5_hash.hi5_hash_data, mode: config.type, shim: g_hi5_hash.shim });

    // 초기처리(패스변경등)
    hi5_hash.init({ dev: (hi5_dev_mode == "dev" || hi5_svrmode == "dev") ? true : false });
    //var obj = hi5_hash.contents;

    // css file Include
    var cssimports = hi5_hash.css();
    cssimports.forEach(function (obj, idx) {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", obj.url);

        document.getElementsByTagName("head")[0].appendChild(fileref);
    })
    var objItem = hi5_hash.record(config.mode);

    // hi5_ㅡmode.js 파일 로드
    //hi5_loadScript({ url: hi5_cbMng.getURL({ url: objItem.path }), cb: hi5_hash.cb({ key: config.mode, json: true }) });

    var paths = {};
    paths[config.mode] = objItem.path.split('.').shift();
    var cfg = {
        waitSeconds: 0,
        paths: paths,
        baseUrl: window.hi5_baseURL,
        urlArgs: hi5_hash.cb({ key: config.mode, json: true })
    };

    var regJS = require.config(cfg);
    regJS(config.mode.split());
}

hi5_cbMng.start = function (config) {
    hi5_loadStart(config);
}


function hi5_startLoad(config) {
    hi5_cbMng.start(config);
}

// 컨트롤 객체 취득 및 등록
function hi5_controlExpert(ctlName, fn) {
    var obj = hi5_hash.record(ctlName)
    if (!obj) {
        return null;
    }
    if (fn) {
        obj.fn = fn;
    }
    return obj.fn;
}

// 익명 즉시실행함수(immediately-invoked function expression)
(function() {
    var scripts = document.getElementsByTagName('script'), ele, config = {mode:'',type:''};
    for (var i = 0; i < scripts.length; ++i) {
        ele = scripts[i];
        if (ele.getAttribute('id') === "hi5_filemng") {
            config.mode = ele.getAttribute('mode');
            config.type = ele.getAttribute('appmode');
            window.hi5_baseURL = ele.getAttribute('baseurl') === undefined ? "" : ele.getAttribute('baseurl');
            window.hi5_ajaxURL = ele.getAttribute('ajaxurl') === undefined ? "" : ele.getAttribute('ajaxurl');
            break;
        }
    }

    if (config.mode != '') {
        hi5_cbMng.start(config);
    }
})();



