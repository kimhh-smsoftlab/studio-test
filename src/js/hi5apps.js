// hi5 project용 개발 JS file 
'use strict';
// 개인정보 암호화 정보 항목
window.g_objEncriptItem = [];

//var g_sdiReady = false;

// hi5용 js 모듈 다운로드 상태정보
window.hi5_download_status = false;

//var hi5 = document.getElementsByTagName('html')[0].getAttribute('hi5app');
// 저장소명 정의
window.hi5_storage_name = hi5app_name + "_spa"; //document.getElementsByTagName('html')[0].getAttribute('hi5app');
//window.hi5_appName = window.hi5_storage_name;
if (window.hi5_dev_mode != "")
    window.hi5_storage_name += "_" + window.hi5_dev_mode;


// 초기값 정의
var formQueue = null;
var portFolio = null;
var form = null; // 전역객체
var realstruct; // real Data
var $hi5_regional = {}; // 시스템 다국어 정보객체

var g_hi5_config = {
    //tzone : 'KST',
    baseTime: 1, // 1 : 달력기준, 2 : 12시간전기준, 3 : 24시간전기준
    login_alarm: "N", //로그인알림('Y' : 알림받기,  'N' : 알림X)
    cash_inout_alarm: "N", //원화입출금알림('Y' : 알림받기,  'N' : 알림X)
    coin_inout_alarm: "N", //코인입출금알림('Y' : 알림받기,  'N' : 알림X)
    info_change_alarm: "N", //정보변경알림('Y' : 알림받기,  'N' : 알림X)
    news_alarm: "N", //(홈페이지만 해당)뉴스레터 및 프로모션알림('Y' : 알림받기,  'N' : 알림X)
    currency_market: "USD", // 통화시장(KRW:1, USD:2)
    base_curr: "2" //기준통화(KRW:1, USD:2),
};

// 다운로그 상태
var hi5_downloadStatus = function (option) {
    var total = option.total,
        curcount = option.curcount; // 전체건수/현재건수
    //   console.log("hi5_downloadStatus");
    //   console.log(option);

    // 모듈 다운로드 상태 완료
    //debugger;
    var percent = parseInt(curcount / total * 100);
    //document.getElementById("loadingPer").innerHTML = percent + "%";
    if (total == curcount) {
        //debugger;
        $("#myProgress").remove();
        hi5_download_status = true;
    }
    // 진행상태 표시
    //if (typeof (window.CoredaxWeb_Spinner) == 'function') {
    //    window.CoredaxWeb_Spinner("hi5_progress", option);
    //}
};

//requireJS 기본 설정 부분
requirejs.config({
    /*
        baseUrl:
        JavaScript 파일이 있는 기본 경로를 설정한다.
        만약 data-main 속성이 사용되었다면, 그 경로가 baseUrl이 된다.
        data-main 속성은 require.js를 위한 특별한 속성으로 require.js는 스크립트 로딩을 시작하기 위해 이 부분을 체크한다.
    */
    baseUrl: window.hi5_baseURL,
    waitSeconds: 0,

    /*
    paths: 
    path는 baseUrl 아래에서 직접적으로 찾을 수 없는 모듈명들을 위해 경로를 매핑해주는 속성이다.
    "/"로 시작하거나 "http" 등으로 시작하지 않으면, 기본적으로는 baseUrl에 상대적으로 설정하게 된다.
    
    paths: {
        "exam": "aaaa/bbbb"
    }
    
    의 형태로 설정한 뒤에, define에서 "exam/module" 로 불러오게 되면, 스크립트 태그에서는 실제로는 src="aaaa/bbbb/module.js" 로 잡을 것이다.
    path는 또한 아래와 같이 특정 라이브러리 경로 선언을 위해 사용될 수 있는데, path 매핑 코드는 자동적으로 .js 확장자를 붙여서 모듈명을 매핑한다.
    */
    paths: hi5_hash.paths({
        path: true
    }),
    /*
        shim:
        AMD 형식을 지원하지 않는 라이브러리의 경우 아래와 같이 shim을 사용해서 모듈로 불러올 수 있다.
        참고 : http://gregfranko.com/blog/require-dot-js-2-dot-0-shim-configuration/
    */
    shim: hi5_hash.shim,

    // 모듈 위치 URL뒤에 덧붙여질 쿼리를 설정한다. (브라우저 캐시를 회피하기 위해, 새로 로드)
    //  urlArgs: 'cb=' + _CACHE_BUSTER_APP,
    urlArgs: function (id, url) {
        if (url.indexOf('@') >= 0) return "";
        var self = this,
            cb = hi5_hash.cb({
                key: id,
                url: url
            }); //'?cb=' + _CACHE_BUSTER_APP;
        //  console.log('<<<<<<<<<<<<<<<  urlArgs cb=[' + cb + '] + id=[' + id + '] url=[' + url + ']');
        return cb;
    },


    /* ... 진행상태 표시 paths, shims, etc. */
    onNodeCreated: function (node, config, moduleName, url) {
        //     console.log('===>onNodeCreated [' + moduleName + '] url=[' + url + ']');
        node.addEventListener('load', function () {
            var elem = document.getElementsByTagName('html')[0]
            if (elem) {
                var totLen = elem.getAttribute("hi5_total");
                if (totLen == undefined) {
                    totLen = hi5_hash.count();
                    //form갯수 +1
                    totLen++;
                    elem.setAttribute("hi5_total", totLen.toString());
                } else {
                    totLen = parseInt(totLen);
                }

                var count = elem.getAttribute("hi5_count");
                count = (count == undefined) ? 0 : parseInt(count);
                count++;
                elem.setAttribute("hi5_count", count.toString());
                hi5_downloadStatus({
                    total: totLen,
                    curcount: count
                });
                if (totLen == count) {
                    delete config.onNodeCreated;
                }
                //  console.log('module [' + moduleName + '] url=[' + url + ']....has been loaded count=' + count);

                //var width = ((count / totLen) * 100).toFixed(0) + '%';
                //elem.setAttribute("progress", width);
            } else {
                console.log('<<<<<<<<<<<<<<<  onNodeCreated error Tag [' + moduleName + '] url=[' + url + ']');
            }
        });

        node.addEventListener('error', function () {
            console.log('----------------> module ' + moduleName + ' could not be loaded');
        });
    }

});

//requireJS를 활용하여 모듈 로드
requirejs(hi5_hash.paths({}),
    //디펜던시 로드뒤 콜백함수. 로드된 디펜던시들은 콜백함수의 인자로 넣어줄 수 있다.
    function () {
        $(document).ready(function () {
            //formQueue = new Queue; //create a new queue instance

            //Check if local storage can be used
            var bCheck = simpleStorage.canUse();
            // Debug Level "0" : 로그사용 안함, "1":통신로그,"2":로그사용 
            window.hi5_DebugLevel = null;
            if (window.hi5_dev_mode == "dev") {
                window.hi5_DebugLevel = {
                    UM: false,
                    RQ: false,
                    RP: false,
                    SB: false,
                    SBC: false,
                    PB: false,
                    JSON: false,
                    timeCheck: false, // 컨트롤 속도체크
                    pbKey: {}, // 실시간종목 필터링{"type":"COO", "key":"BTC"}
                    timeElapsed: true, // 실시간 처리응답시간 체크
                    QUEUE: {
                        GET: false,
                        PUT: false
                    } //큐 GET: 쌓인 순간 갯수, PUT: 처리 후 갯수
                };
            }
            // M: MDI모드(어드민)
            hi5.WTS_MODE = WTS_TYPE.MTS;

            //hi5.SetSharedMemory("@BASE_CURRENCY", g_hi5_config.currency_market);
            //hi5.SetSharedMemory("@BASE_CURRENCY", "USD");
            var ua = navigator.userAgent;
            var pf = String(navigator.platform).toLowerCase();
            var loc = document.location.toString();

            var iswindow;
            if (pf.indexOf('macintel') != -1) {
                window.gPlatformType = 'mac';
                iswindow = false;
            } else if (pf.indexOf('linux i686') != -1 || pf.indexOf('linux armv7l') != -1 || pf.indexOf('linux') != -1) {
                window.gPlatformType = 'linux';
                iswindow = false;
            } else {
                window.gPlatformType = '';
                iswindow = true;
            };

            // --> [Edit] 수정자:kim changa 일시:2019/03/28
            // 수정내용> 이부분 삭제
            /*
                        var ismobile;
                        if (
                            ua.match(/iPhone|iPod|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null ||
                            ua.match(/LG|SAMSUNG|Samsung/) != null
                        ) {
                            window.gIsMobile = ismobile = true;
            
                            // LG노트북의경우 userAgent에 LG라는 문자열을 포함하여 모바일로 인식
                            if (ua.match(/MALGJS/) != null || ua.match(/LG_UA/) != null) {
                                window.gIsMobile = ismobile = false;
                            }
                        } else {
                            window.gIsMobile = ismobile = false;
                        };
            */
            // <-- [Edit] kim changa 2019/03/28

            window.hi5_deviceType = "W";
            // URL정보에서 입력한 정보인가?
            $.urlParam = function (name) {
                var href = decodeURIComponent($(location).attr('href'));
                var ret = new RegExp('[\?&]' + name + '=([^&#]*)').exec(href);
                if (ret)
                    return ret[1] || 0;
                return null;
            }

            // 쿠키정보에서 언어 정의값 취득
            var lang = $.cookie("lang");
            if (lang != undefined && lang != window.local_lang) {
                window.local_lang = lang;
                document.documentElement.lang = lang;
            }
            // example.com?param1=name&param2=&id=6
            //$.urlParam('param1'); // name
            //$.urlParam('id');        // 6
            //$.urlParam('param2');   // null
            var lang = $.urlParam('lang');
            if (lang) {
                lang = $.trim(lang);
                if (document.documentElement.lang != lang) {
                    document.documentElement.lang = lang;
                }
            }

            window.local_lang = document.documentElement.lang || "en"; //기본 영어
            if (window.local_lang != 'ko' && window.local_lang != 'en') window.local_lang = 'ko';
            //portFolio = new hi5_portFolio();

            window.local_lang = 'ko'; // 2019.08.26 kws 기본 언어는 한글

            // common.js 언어변경       
            HI5LocalChange(local_lang, function () {
                var cookieEnabled = navigator.cookieEnabled;
                if (cookieEnabled == false) {
                    alert($hi5_regional.cookie.alertMsg);
                }
                //commAPI.serverConnect();
                loadFullWindow();
            }, {
                init: true
            });
        });
    }
);



// local 변경
var HI5LocalChange = function (lang, callback, option) {
    // 화면정보 초기화
    hi5_scrJS = {};

    local_lang = document.documentElement.lang = lang;

    // 언어정보만 설정후 패스와 cb값을 취득한다.
    var objLang = hi5_hash.lang({
        local_lang: local_lang
    });

    $.cookie("lang", local_lang);
    var objPaths = hi5_hash.paths({
        path: false,
        local_lang: true
    });
    hi5.requireJS(objLang.depths, function () {
        hi5.initLocaleChange();

        if (option && option.init) {
            var cookieEnabled = navigator.cookieEnabled;
            if (cookieEnabled == false) {
                alert($hi5_regional.cookie.alertMsg);
            }

            var formLoadCB = function () {
                var control;
                for (var i = 0; i < arguments.length; i++) {
                    control = arguments[i].ctlName;
                    hi5_controlExpert(control, arguments[i]);
                }

                form = new(hi5_controlExpert("form"));
                if (callback) {
                    callback(lang);
                }
            }

            // form // Form 파일을 로드
            hi5.requireJS(["form"], formLoadCB);

            // <-- [Edit] kim changa 2019/03/29
        } else {
            // CallBack 함수가 있으면 호출을 한다.
            if (callback) {
                callback(lang);
            }
        }
    }, {
        cb: objLang.cb
    });
}

function loadFullWindow(screenId) {
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1] || 0;
        }
    }

    if(!screenId){
        screenId = $.urlParam("uiId");
        if(!screenId)
            screenId = $.urlParam("screenId");
    }

    // CacheBuster
    var cb = hi5cb.getCacheBuster({
        data: "map",
        mapfile: screenId
    });
    var path = "screen/" + screenId + ".xml";
    var strUrl = hi5.getURL({
        url: path + cb.cb
    });

    var curWinindex = hi5.GetCurWinindex();
    var itemId = screenId + '_' + curWinindex;

    hi5.getScreenLoad({
        mapName: screenId,
        cb: cb.cb,
        url: strUrl
    }, function (xhr, objData) {
        // 맵이름을 지정후 오류시에 표시.
        //    x2h.requestURL(strUrl, function (xhr, objData) {
        try {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var xmlDoc = xhr.responseXML; //httpRequest.responseText;  // Text Data
                    if (xmlDoc == null) {
                        throw "mapfile responseXML Error!!!"
                    }
                    //var xmlFormDoc = xmlDoc.getElementsByTagName(FORM)[0];
                    //var formSize = x2h.defaultStyle(xmlFormDoc);

                    // form 객체 취득
                    var winForm = new(hi5_controlExpert("form"));
                    if (winForm) {
                        winForm.id = itemId + "_form";

                        // --> [Edit] 수정자:kim changa 일시:2019/03/15
                        // 수정내용> 메뉴별 등록/수정 권한 설정 
                        winForm.mainform = true; // MainForm

                        // <-- [Edit] kim changa 2019/03/15
                        // loading 상태 표시
                        winForm.showLoading();

                        hi5.SetObjData(winForm.id, winForm);
                        var options = {
                            form: winForm,
                            itemId: itemId
                        };
                        winForm.LoadMapXML(xhr, options);

                        //$("#hi5_loading").remove();
                    };
                } else {
                    // 맵 이름과 상태코드 표시
                    if (objData.div) {
                        objData.div.remove();
                    }
                    var msg = "Page Not Found!!...map=" + (objData.map ? objData.map : "") + "\r\n";
                    msg += "status : " + xhr.status + "\r\n";
                    msg += "statusText:" + xhr.statusText;
                    hi5.MessageBox(msg, "Error", 0, function (ret) {
                        return false;
                    });
                    return false;
                }
            }
        } catch (e) {
            var msg = "error =" + (objData && objData.map ? objData.map : "") + "\r\n";
            msg += "message: " + (e.message == undefined ? e : e.message);
            msg = '데이터가 없습니다.';

            if(msg.trim() == "error =".trim()){
                msg = '데이터가 없습니다.';
            }
            hi5.MessageBox(msg, "알림", 3, function (ret) {
                return false;
            });

            console.log(e);
            console.log("error : " + e.message);
            console.log("error==>screeDownLoad : " + e.message);
            return false;
        }
        return true;
    });
}