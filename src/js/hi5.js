/*
 * 전역기능 정의 파일
 * Version: 1.0.1.0
 * Author: Sohn Kiwon
 * Created: 2017.5.24
 * Revisions:
 *  1) getJSONData() $.ajaxSetup() 삭제 - temp성으로 변경 ( 2018/10/1)
 * Copyright @ Korea Sorimachi Co.,Ltd. All Rights Reserved.
 */

"use strict";
/*
(function ($, name) {
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var hi5_winresize = function (func, threshold, execAsap) {
        var timeout;

        return function debounce() {
            var obj = this, args = arguments;
            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // hi5_resize
    $.fn[name] = function (fn) {
        return fn ? this.bind('resize', hi5_winresize(fn, 200)) : this.trigger(name);
    };

})($, 'hi5_resize');

$(window).hi5_resize(function (e) {
    debugger;
})
*/

/* transfer module */
var WTS_TYPE = {
    MDI: 'M', // MDI모드(데스크탑)
    SPA: 'S', // 싱글페이지(데스크탑)
    MTS: 'T' // 싱글페이지(모바일용)
};

//공통정보
var hi5 = {
    SHMEM: {
        "acclist": [] // 계좌정보 초기화
            ,
        "margin": {
            advantageous: 110,
            market: 130,
            top_priority: 110
        },
        "user_setting": {
            general: {
                currency: "USD",
                theme: "dark", // 결함번호 979
                mode: "basic",
                network: "Y",
                animation: "Y",
                comma: "Y"
            },
            email_noti: {
                ydeposit_ok: "Y",
                ymargincall: "Y",
                ydleverage: "Y",
                ywithdraw_ok: "Y",
                ywithdraw_cancel: "Y",
                ywithdraw_accept: "Y"
            },
            confirm: {
                allorders: "Y"
            }
        }
    },
    WTS_MODE: 'M', // M: MDI모드, S:SDI
    MEMB_FLAG: '',
    jsonType: true
};

(function ($) {
    var _hi5 = $.hi5 = $.hi5 || {};
    _hi5.regional = {};


    $.extend({
        playSound: function () {
            return $(
                '<audio class="sound-player" autoplay="autoplay" style="display:none;">' +
                '<source src="' + arguments[0] + '" />' +
                '<embed src="' + arguments[0] + '" hidden="true" autostart="true" loop="false"/>' +
                '</audio>'
            ).appendTo('body');
        },
        stopSound: function () {
            $(".sound-player").remove();
        }
    });
})(jQuery);

/*
//https://github.com/englercj/jquery-ajax-progress
(function ($, window, undefined) {
    //is onprogress supported by browser?
    var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

    //If not supported, do nothing
    if (!hasOnProgress) {
        return;
    }

    //patch ajax settings to call a progress callback
    var oldXHR = $.ajaxSettings.xhr;
    $.ajaxSettings.xhr = function () {
        var xhr = oldXHR.apply(this, arguments);
        if (xhr instanceof window.XMLHttpRequest) {
            xhr.addEventListener('progress', this.progress, false);
        }
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', this.progress, false);
        }
        return xhr;
    };
})(jQuery, window);
*/

//Polyfill
// Overwrites native 'children' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.

;
(function (constructor) {
    if (constructor &&
        constructor.prototype &&
        constructor.prototype.children == null) {
        Object.defineProperty(constructor.prototype, 'children', {
            get: function () {
                var i = 0,
                    node, nodes = this.childNodes,
                    children = [];
                while (node = nodes[i++]) {
                    if (node.nodeType === 1) {
                        children.push(node);
                    }
                }
                return children;
            }
        });
    }
})(window.Node || window.Element);

if (!Object.is) {
    Object.is = function (x, y) {
        // SameValue algorithm
        if (x === y) { // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            return x !== 0 || 1 / x === 1 / y;
        } else {
            // Step 6.a: NaN == NaN
            return x !== x && y !== y;
        }
    };
}

//Polyfill
if (!Math._trunc) {
    Math._trunc = function (x, digit, fixed) {
        var fPow = Math.pow(10, digit),
            val = Math.floor((x) * fPow) / fPow;
        if (fixed) {
            return val.toFixed(fixed);
        }
        return val.toString();
    };
}
/*$(domEle).click(function(event) {
      //prints out everything up to domEle     
      console.log(hi5_atPt.fromEvent(event, domEle));      
});
$(window).click(function(event) {
      //prints out everything up to domEle     
      console.log(hi5_atPt.fromEvent(event));      
});
*/
/*
;(function(){
    //test for ie: turn on conditional comments
    var jscript//@cc_on=@_jscript_version@;
    var styleProp = (jscript) ? "display" : "pointerEvents";

    var hi5_atPt = function() {};
    hi5_atPt.prototype.fromEvent = function(e, lastElement) {
        e = e || window.event; //IE for window.event
        return this.atPoint(e.clientX, e.clientY, lastElement);
    };

    hi5_atPt.prototype.atPoint = function(clientX, clientY, lastElement) {
        //support for child iframes
        var d = (lastElement) ? lastElement.ownerDocument : document;
        //the last element in the list
        lastElement = lastElement || d.getElementsByTagName("html")[0];

        var element = d.elementFromPoint(clientX, clientY);
        if(element === lastElement || element.nodeName === "HTML") {
            return [element];
        } else {
            var style= element.style[styleProp];
            element.style[styleProp]="none"; //let us peak at the next layer
            var result = [element].concat(this.atPoint(clientX,clientY,lastElement));
            element.style[styleProp]= style; //restore
            return result;
        }
    };
    window["hi5_atPt"] = new hi5_atPt();
})(); 
*/
// array binarySearch 
if (!Array.prototype.binarySearch) {
    Object.defineProperty(Array.prototype, "binarySearch", {
        value: function (target, comparator) {
            var l = 0,
                h = this.length - 1,
                m, comparison;
            comparator = comparator || function (a, b) {
                return (a < b ? -1 : (a > b ? 1 : 0));
            };


            while (l <= h) {
                m = (l + h) >>> 1;

                comparison = comparator(this[m], target);
                if (comparison < 0) {
                    l = m + 1;
                } else if (comparison > 0) {
                    h = m - 1;
                } else {
                    return m;
                }
            }
            //The bitwise complement of 0 is -1, the bitwise complement of 1 is -2, 2 is -3, and so on. To get the bitwise complement of a number in JavaScript, use the ~ operator.
            return ~l;
        }
    });
}

/*컨트롤 복수로 이벤트 처리시에 이벤트 등록*/
if (!Array.prototype._on) {
    Object.defineProperty(Array.prototype, '_on', {
        value: function (cb) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype._on called on null or undefined');
            }
            if (typeof cb !== 'function') {
                throw new TypeError('cb must be a function');
            }
            var list = Object(this),
                length = list.length >>> 0,
                fnName = arguments[1],
                objCtl;

            for (var i = 0; i < length; i++) {
                objCtl = list[i];
                if (typeof objCtl !== 'object') {
                    throw new TypeError('Array Data  must be a object ');
                }
                objCtl[fnName] = cb;
            }
            return;
        },
        enumerable: false,
        configurable: false,
        writable: false
    });
}

if (!Array.prototype.move) {
    Array.prototype.move = function (from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
        return this;
    };
}
// ECMA-262 5판, 15.4.4.21항의 작성 과정
// 참고: http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (callback /*, initialValue*/ ) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        var t = Object(this),
            len = t.length >>> 0,
            k = 0,
            value;
        if (arguments.length == 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in t)) {
                k++;
            }
            if (k >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
        }
        for (; k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };
}

// ie 11 polyfill (Array.prototype.includes)
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement) {
        if (this == null) {
            throw new TypeError('Array.prototype.includes called on null or undefined');
        }

        var O = Object(this);
        var len = parseInt(O.length, 10) || 0;
        if (len === 0) return false;

        var n = parseInt(arguments[1], 10) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    }
}

/*
   "hello {} and {}<br />".format("you", "bob")
   "hello {0} and {1}<br />".format("you", "bob")
   "hello {0} and {1} and {key}<br />".format("you", "bob", {key:"mary"})
   "hello {0} and {1} and {key} and {2}<br />".format("you", "bob", "jill", {key:"mary"})
*/

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments,
            self = this;
        //debugger;
        if (typeof (this) == "string") {
            self = new String(this);
        }

        self.unkeyed_index = 0;
        return this.replace(/\{(\w*)\}/g, function (match, key) {
            if (key === '') {
                key = self.unkeyed_index;
                self.unkeyed_index++
            }
            if (key == +key) {
                return args[key] !== 'undefined' ?
                    args[key] :
                    match;
            } else {
                for (var i = 0; i < args.length; i++) {
                    if (typeof args[i] === 'object' && typeof args[i][key] !== 'undefined') {
                        return args[i][key];
                    }
                }
                return match;
            }
        }.bind(this));
    }
}


if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var str = '' + this;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var rpt = '';
        for (var i = 0; i < count; i++) {
            rpt += str;
        }
        return rpt;
    }
}

// 정규식
//^ : 문자열의 시작
//\s* : 임의의 개수의 공백 문자, \s 가 공백, * 가 임의의 개수
//| : OR 기호
//$ : 문자열의 끝
//g : 문자열의 모든 부분에 걸쳐 치환
//'' : 치환할 빈 문자열
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

if (!String.prototype.ltrim) {
    String.prototype.ltrim = function (chars) {
        // 정규식
        //return this.replace(/^\s+/, '');
        // 일반형식
        var end = this.length,
            idx = 0;
        if (end <= 0) return this.valueOf();
        chars = chars || " ";

        end = this.length - 1;
        while (this[idx] === chars && idx <= end) {
            idx++;
        }
        return idx > 0 ? this.substr(idx) : this.valueOf();
    };
}

if (!String.prototype.rtrim) {
    String.prototype.rtrim = function (chars) {
        // 정규식
        //return this.replace(/\s+$/, '');
        var end = this.length,
            idx = 0;
        if (end <= 0) return this.valueOf();

        chars = chars || " ";
        end = this.length - 1;
        for (; end >= 0; end--) {
            if (this[end] !== chars) break;
            idx--;
        }
        return idx >= 0 ? this.valueOf() : this.substr(0, this.length + idx);
    };
}


if (!String.prototype.Ntrim) {
    String.prototype.Ntrim = function () {
        var i, end = this.length;
        if (end <= 1) return this.valueOf();

        var s = this.charCodeAt(0),
            e = this.charCodeAt(end - 1);
        if (s == 32 || s == 0 || e == 32 || e == 0) {
            var start = -1;
            // min화시에 ; 부분 삭제하지 말것
            while (this.charCodeAt(--end) < 33);
            while (this.charCodeAt(++start) < 33);
            var s = this.slice(start, end + 1);
            if (!hi5.isString(s))
                s = "";
            return s;
        }
        return this.valueOf();
    };
}

if (!Date.prototype.curDate) {
    Date.prototype.curDate = function () {
        return hi5.sprintf("%04d%02d%02d", this.getFullYear(), this.getMonth() + 1, this.getDate());
    };
}



if (!String.prototype.ArrayBuffer) {
    String.prototype.ArrayBuffer = function () {
        var array = new Uint8Array(this.length);
        for (var i = 0; i < this.length; i++) {
            array[i] = this.charCodeAt(i);
        }
        return array.buffer
    };
}

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        var k;

        // 1. 이 값을 인수로 전달하는 ToObject를 호출 한 결과를
        // o라고합니다.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. lenValue를 Get 함수를 호출 한 결과로 둡니다.
        // 인수가 "length"인 o의 내부 메소드.
        // 3. len을 ToUint32 (lenValue)로 지정합니다.
        var len = o.length >>> 0;

        // 4. len이 0이면 -1을 반환합니다.
        if (len === 0) {
            return -1;
        }

        // 5.Index에서 인수가 전달 된 경우 n을
        // ToInteger (fromIndex); 그렇지 않으면 n은 0이됩니다.
        var n = fromIndex | 0;

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. n> = 0 인 경우 k를 n이라고 합니다.
        // 8. 그렇지 않으면 n <0, k는 len - abs (n)이됩니다.
        // k가 0보다 작은 경우 k를 0으로 만듭니다.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. k <len 인 동안 반복한다.
        while (k < len) {
            // a. Pk를 ToString (k)이라고합시다.
            // 이것은 in 연산자의 LHS 피연산자에 대해 암시 적입니다.
            // b. kPresent를 호출 한 결과라고합시다.
            // Hasproperty 인수에 Pk가있는 o의 내부 메소드.
            //이 단계는 c와 결합 될 수 있습니다.
            // c. kPresent가 참이면
            // i. elementK를 Get을 호출 한 결과로합시다.
            // ToString (k) 인수를 가진 o의 내부 메쏘드.
            // ii. 적용한 결과와 동일하게 봅시다.
            // 엄격한 평등 비교 알고리즘
            // searchElement 및 elementK.
            // iii. 동일하면 k를 반환합니다.
            if (k in o && o[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

// 모든문자열 치환
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (target, replacement) {
        return this.split(target).join(replacement);
        //var tmp = eval("/\\" + str1 + "/g");
        //return this.replace(tmp, str2);
    };
}
/*
(function (prototype) {
    var removeAll = prototype.removeAll;
    prototype.removeAll = function (str) {
        var s  = this.replaceAll(str=',', "");
        return s;
    }
}(String.prototype));
*/

if (!String.prototype.removeAll) {
    String.prototype.removeAll = function (str) {
        str = str ? str : ","; // 기본값을 ','로한다
        return this.replaceAll(str, "");
    };
}

// 숫자중에 양수,음수인경우 부호 반환
// "-0.0000" 인경우 "-" 반환
String.prototype.signCheck = function () {
    if (this.length <= 0) return "";
    if (this[0] == '-') {
        return "-";
    }
    var val = parseFloat(this, 10);
    if (val > 0) {
        return "+";
    } else if (val < 0) {
        return "-";
    }
    return "";
};

Number.prototype.signCheck = function () {
    if (this > 0) {
        return "+";
    } else if (this < 0) {
        return "-";
    }
    return "";
};


// 숫자형 반올림( 연산시에 사용)
if (!Number.prototype.roundup) {
    Number.prototype.roundup = function (digit) {
        var x = this,
            fPow = Math.pow(10, digit);
        return (Math.ceil((x) * fPow) / fPow);
    };
}

if (!Number.prototype.atof) {
    Number.prototype.atof = function () {
        return parseFloat(this);
    };
}

if (!Number.prototype.atoi) {
    Number.prototype.atoi = function () {
        return parseInt(this, 10);
    };
}


if (!String.prototype.atof) {
    String.prototype.atof = function () {
        if (this === undefined || this === "") return 0;
        // [,]제거기능
        var s = this.removeAll();
        if (s.length <= 0) return 0;
        return parseFloat(s);
    };
}

if (!String.prototype.atoi) {
    String.prototype.atoi = function () {
        if (this === undefined || this === "") return 0;
        if (isNaN(parseInt(this, 10))) return 0;
        // [,]제거기능
        var s = this.removeAll();
        if (s.length <= 0) return 0;
        return parseInt(s, 10);
    };
}

// 반올림 함수(최대 소수점 8자리)
// http://www.jacklmoore.com/notes/rounding-in-javascript/ 참고
// 문자열에 트림은 안함
if (!String.prototype.round) {
    String.prototype.round = function (decimals) {
        if (this === "") return "";
        decimals = decimals || 0;
        return Number(Math.round(this + 'e' + decimals) + 'e-' + decimals).toFixed(decimals);
    };
}

/*
if (!String.prototype.round) {
    String.prototype.round = function (digits) {
        if (this === "" || digits === undefined) return;

        var n = parseFloat(this);
        if (digits >= 0) return parseFloat(n.toFixed(digits)).toString();   // 소수부 반올림

        digits = Math.pow(10, digits); // 정수부 반올림
        var t = Math.round(n * digits) / digits;

        return parseFloat(t.toFixed(0)).toString();
    };
}
*/

// 000123.00000000 ->123.00000000, 00000000(Coin용)
if (!String.prototype.str2float) {
    String.prototype.str2float = function (digits) {
        if (this === "") return;
        var values = this.split(".");
        if (values != undefined) {
            digits = digits || 8;
            values[1] = hi5.RPAD(values[1], digits, "0");
            return parseInt(values[0], 10) + "." + values[1];
        }
        return this;
    };
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (fn, context) {
        for (var i = 0, len = this.length, item; i < len; i++) {
            item = this[i];
            if (fn.call(context, item, i, this)) {
                return i
            }
        }
        return -1
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function (fn, context) {
        var i, value, result = [],
            length = this.length;
        for (i = 0; i < length; i++) {
            if (this.hasOwnProperty(i)) {
                value = this[i];
                if (fn.call(context, value, i, this)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}

// Array Remove - By John Resig (MIT Licensed)
//  Remove the second item from the array array.remove(1);
// Remove the second-to-last item from the arrayarray.remove(-2);
// Remove the second and third items from the arrayarray.remove(1,2);
// Remove the last and second-to-last items from the array array.remove(-2,-1);
if (!Array.prototype.remove) {
    Array.prototype.remove = function (from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
}

// --> [Edit] 수정자:kim changa 일시:2019/03/28
// 수정내용> 모바일 디바이스 유무
var hi5_isMoble = false;
hi5_isMoble = 'ontouchstart' in window;
// <-- [Edit] kim changa 2019/03/28

var allCtlList = [];
var g_mStockCode = null;
/*숫자형으로 색상정보 취득기능*/
hi5.getData_CLS = function (data1, data2) {
    var cls = "",
        sign;
    if (data1 === undefined && data2 === undefined) return cls;

    if (data1 !== undefined && data2 === undefined) { // 양수/음수로 판단
        sign = data1;
    } else {
        sign = data1 - data2;
    }
    if (sign == undefined || sign == 0) return cls;
    cls = sign > 0 ? " pq-grid-highlight_up" : " pq-grid-highlight_low";
    return cls;
}

var g_calendar_Text = {};
hi5.initLocaleChange = function () {

    $.extend(true, $hi5_regional, $.hi5.regional[local_lang]);
    //$.extend(top.datepicker_regional, $hi5_regional.datepicker);
    //$hi5_regional = $.hi5.regional[local_lang];
    if (top.datepicker_regional == undefined) top.datepicker_regional = $hi5_regional.datepicker;

    // pq그리드 local 변경

    // --> [Edit] 수정자:kim changa 일시:2019/11/04
    // 수정내용> ver 6.2.4 local 속성기능 변경
    //$.extend($.paramquery.pqGrid.prototype.options, $.paramquery.pqGrid.regional[local_lang]);
    // <-- [Edit] kim changa 2019/11/04

    //var regional = $.paramquery.pqGrid.regional[local_lang];
    //$.extend($.paramquery.pqPager.prototype.options, $.paramquery.pqPager.regional[local_lang]);
    // 달력컨트롤
    $.extend($.datepicker._defaults, $hi5_regional.datepicker);
    ////////////////////////////////////////////////////////////////////////////

    // 그리드 메뉴아이콘 속성 기본값 변경
    var menuUI = $.extend(true, $.paramquery.pqGrid.prototype.options.menuUI, {
        gridOptions: {
            width: "100%",
            rowHt: 25,
            rowBorders: true,
            stripeRows: false,
            _cls: "hi5_grid_menu_popup", // 커스텀 클래스명 지정
            columnTemplate: {
                align: "left",
                halign: "center"
            }
        }
    });

    // 초기화 및 기본값 작업
    $.extend($.paramquery.pqGrid.prototype.options, {
        // --> [Edit] 수정자:kim changa 일시:2019/11/04
        // 수정내용> ver 6.2.4 local 속성기능 변경 fni.setLocale() 
        locale: local_lang || "ko", // local 부분을 기본값을 국문
        // <-- [Edit] kim changa 2019/11/04

        wrap: false, //기본값: true
        autoRow: false, // 기본값: true
        hwrap: false, //기본값 :
        autoRowHead: false,
        // --> [Edit] 수정자:kim changa 일시:2019/06/24
        // 수정내용> 복수셀 선택후 Drag시에 자동으로 선택된 셀 값이 자동으로 복사되는 현상방지
        autofill: false, // 기본값 : true-> false 변경 Drag 시에 자동으로 셀 정보가 복사 되는 현상 ( onStop 함수 )
        // <-- [Edit] kim changa 2019/06/24

        // 5.6.1 버전
        animModel: {
            on: true,
            events: "beforeSortDone",
            eventsH: ""
        },
        fillHandle: "", //기본값 : ""
        // fillHandle: "all",       //기본값 : "all"
        //formulasModel: { on: hi5.WTS_MODE == WTS_TYPE.MDI ? true : false  },  // 5.6.1 버전 : 기본값: true
        formulasModel: {
            on: true
        }, // 5.6.1 버전 : 기본값: true
        loading: hi5.WTS_MODE == WTS_TYPE.MDI ? true : false, // MDI 모드만 조회중 표시
        lastautofit: true, // scrollModel autofit false인 경우 
        // 5.0> 추가속성
        // --> [Edit] 수정자:kim changa 일시:2019/10/24
        // 수정내용> 
        nofocus: hi5.WTS_MODE == WTS_TYPE.MTS ? true : false, // fn.focus 함수
        layer: hi5.WTS_MODE == WTS_TYPE.MDI ? true : false, // cCells속성 addBlock 함수
        // <-- [Edit] kim changa 2019/10/24
        rowHt: 25,
        rowHtHead: hi5.WTS_MODE == WTS_TYPE.MDI ? 25 : 30,
        rowHtSum: 25,
        minColWidth: 16, // 기본값 50( flex모드 최소값)
        hoverMode: "row", // 기본값 : "null"

        /////
        flex: hi5.WTS_MODE == WTS_TYPE.MDI ? {
            on: true,
            one: true,
            all: true
        } : {
            on: true,
            one: false,
            all: false
        }, // 기본값 : {on: true, one: false, all: true}
        //virtualY: true,->5.0 삭제
        //virtualX: true,
        editable: false,
        collapsible: {
            on: false,
            toggle: true,
            collapsed: false,
            refreshAfterExpand: true,
            css: {
                zIndex: 1000
            }
        },
        filterModel: {
            on: false,
            newDI: [],
            smode: "AND",
            header: false,
            timeout: 400,
            type: 'local'
        },

        // --> [Edit] 수정자:kim changa 일시:2019/07/17
        // 수정내용> editable 기본값을 false에서 undeined로 변경
        //columnTemplate: { editable: false, align: "right", halign: "center" },
        columnTemplate: {
            align: "right",
            halign: "center"
        },
        // <-- [Edit] kim changa 2019/07/17
        menuUI: menuUI,
        showBottom: false,
        showHeader: true,
        showTitle: false,
        showToolbar: false,
        showTop: false,
        //columnBorders : false, // false 초기값
        numberCell: {
            width: 30, // 기본넓이
            title: hi5.WTS_MODE == WTS_TYPE.MDI ? "#" : "",
            resizable: true,
            minWidth: 30,
            maxWidth: 100,
            show: false // 직원용인 경우 넘버표시 기본
        },
        editModel: {
            cellBorderWidth: 1, // 기본값:0->1
            pressToEdit: true,
            // --> [Edit] 수정자:kim changa 일시:2019/06/24
            // 수정내용> CheckBox가 존재하는경우 clicksToEdit값이 1인 경우 선택이 한번에 안되는 현상건으로 clicksToEdit 기본값을 2로 변경을 한다.
            clicksToEdit: hi5.WTS_MODE == WTS_TYPE.MDI ? 2 : 1, // 체크박스만 존재하는 경우 때문에 Edit만 사용하는 경우에 화면에서 변경1값으로 변경을 한다.
            // <-- [Edit] kim changa 2019/06/24
            filterKeys: true,
            keyUpDown: true,
            reInt: /^([\-]?[1-9][0-9]*|[\-]?[0-9]?)$/,
            reFloat: /^[\-]?[0-9]*\.?[0-9]*$/,
            onBlur: "validate",
            saveKey: $.ui.keyCode.ENTER,
            onSave: "nextFocus",
            onTab: "nextFocus",
            allowInvalid: false,
            invalidClass: "pq-cell-red-tr pq-has-tooltip",
            warnClass: "pq-cell-blue-tr pq-has-tooltip",
            validate: true,
            charsAllow: ["0123456789.-=eE+", "0123456789-=eE+"]
        },
        mergeCells: [],
        sortModel: {
            cancel: true,
            ignoreCase: false,
            multiKey: 'shiftKey',
            number: true,
            on: false,
            single: true,
            sorter: [],
            space: false,
            type: 'local'
        },
        //selectionModel: { type: "row",  onTab: "nextFocus", row: true,  mode: "single"  }
        selectionModel: {
            all: true,
            row: false,
            type: "cell",
            mode: "block"
        }
        //selectionModel: hi5.WTS_MODE == WTS_TYPE.MDI ? { all: true, row: false, type: "cell", mode: "block" } : { type: "row",  onTab: "nextFocus", row: true,  mode: "single"  }
    });

    //var cVirtual = pq.cVirtual;
    //alert(cVirtual.SBDIM);


    g_calendar_Text = {
        buttonText: "Open Calendar",
        changeMonth: true,
        changeYear: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        closeText: $hi5_regional.datepicker.closeText,
        prevText: $hi5_regional.datepicker.prevText,
        nextText: $hi5_regional.datepicker.nextText,
        currentText: $hi5_regional.datepicker.currentText,
        monthNames: $hi5_regional.datepicker.monthNames,
        monthNamesShort: $hi5_regional.datepicker.monthNamesShort,
        dayNames: $hi5_regional.datepicker.dayNames,
        dayNamesShort: $hi5_regional.datepicker.dayNamesShort,
        dayNamesMin: $hi5_regional.datepicker.dayNamesMin,
        weekHeader: $hi5_regional.datepicker.weekHeader,
        firstDay: $hi5_regional.datepicker.firstDay,
        isRTL: $hi5_regional.datepicker.isRTL,
        showMonthAfterYear: $hi5_regional.datepicker.showMonthAfterYear,
        yearSuffix: $hi5_regional.datepicker.yearSuffix
    }
}

hi5.colorInitChange = function (bRealTran) {
    // --> [Edit] 수정자:kim changa 일시:2019/09/26
    // 수정내용> 실시간 구조체 최적화 처리( 최적화 처리) - bispex 거래소만 적용
    /*
        if (bRealTran) {
            // 지수 데이터 필요데이터만 정의
            var obj0010 = { "code": 1, "upjisu": 1, "funding_rate": 1, "base_upjisu": 1, "exp_funding_rate":1},
                rd = top.realstruct["0010"].out;
            $.each(rd, function (idx, item) {
                if (!obj0010[item.itemname]) {
                    item.datatype = FT_FILLER;
                }
            });

            // 필러항목으로 지정하고자 하는 항목
            // -->잠시 원복..
            //var obj0013_filler = { "hogatime": 1 }
            // <--잠시 원복..

            // 호가(건수 사용안함)askcntXX, bidcntXX
            rd = top.realstruct["0013"].out;
            $.each(rd, function (idx, item) {
                if (item.itemname.length >= 6) {
                    var val = item.itemname.slice(0, 6);
                    if (val == "aslcnt" || val == "bidcnt")
                        item.datatype = FT_FILLER;
                }
                // 필러항목
                // -->잠시 원복..
                // if (!obj0013_filler[item.itemname]) {
                //     item.datatype = FT_FILLER;
                // }
                // <--잠시 원복..
            });

            // -->잠시 원복..
            // 체결 데이터 필러지정 항목
            // var obj0012 = { "jggb": 1, "time": 1, "dt_work": 1, "fill_rt": 1 },
            //     rd = top.realstruct["0012"].out;
            // $.each(rd, function (idx, item) {
            //     if (obj0012[item.itemname]) {
            //         item.datatype = FT_FILLER;
            //     }
            // });
            // <--잠시 원복..

        }
    */
    // <-- [Edit] kim changa 2019/09/26

    var contents = hi5_hash.contents;
    $.each(contents, function (key, rec) {
        if (rec.fn && rec.fn.prototype._initColorInfo) {
            rec.fn.prototype._initColorInfo();
        }
    })
}

// 다위환산기능 
const units = ['', 'K', 'M', 'B', 'T']
hi5.calcTurnover = function (x, option) {
    let i = 0,
        unit = (option && option.unit) ? option.unit : 1000,
        n = hi5.isNumber(x) ? x : (parseInt(x, 10) || 0);

    while (n > unit && ++i) {
        n = n / unit;
        if (option && option.limit == units[i]) break;
    }

    i = Math.min(i, units.length - 1);
    return {
        value: n, // 원데이터
        text: Math.floor(n).toFixed(0), // 정수문자열
        unit: units[i] // 단위
    }
}

hi5.playSound = function (file) {
    var url = this.getURL({
        url: "published/sound/" + file
    });
    $.playSound(url);
}

hi5.stopSound = function () {
    //Stop Sound
    $.stopSound();
}

// 2차 컨트롤 구조 변경
hi5.getById = function (id) {
    return document.getElementById(id)
}
hi5.getOrderQty = function (strCode, qty) {
    if (strCode == "" || qty === 0) return 0;
    var codeObj = hi5.GetCodeInfo(strCode, {
        itemname: ["min_order_volume", "decnum"]
    });
    var minVol = codeObj.min_order_volume || 1;
    var decnum = parseInt(codeObj.decnum) || 0;
    if (typeof (qty) == "string") qty = parseFloat(qty);
    qty = qty.toFixed(decnum + 1);
    if (minVol > 1) {
        qty -= (qty % minVol).toFixed(decnum + 1);
    }

    return hi5.setDecimalLen(qty.toString(), decnum);
    //return (qty - remainer).toFixed(decnum);
    //return qty - (qty % minVol);
}

// 스타일 검색기능
hi5.getStyle = function (element, styleProp) {
    var style, view = element.ownerDocument.defaultView;
    if (!view || !view.opener) {
        view = window;
    }
    style = view.getComputedStyle(element, null);
    if (style && styleProp) {
        return style.getPropertyValue(styleProp);
    }
    return style;
}

////////////////////////////////////
hi5.GetAllFormObjData = function () {
    return top.allCtlList;
}
hi5.GetObjData = function (id) {
    var ctlObj = null;
    for (var x = 0; x < top.allCtlList.length; x++) {
        var jsondata = top.allCtlList[x];
        if (jsondata.id == id) {
            ctlObj = jsondata.obj;
            break;
        }
    }

    return ctlObj;
}
hi5.SetObjData = function (id, obj) {
    var jsondata = {
        'id': id,
        'obj': obj
    };

    for (var i = 0; i < top.allCtlList.length; i++) {
        if (top.allCtlList[i].id == id) {
            top.allCtlList.splice(i, 1);
            break;
        }
    }

    top.allCtlList.push(jsondata);
}
hi5.RemoveObjData = function (id) {
    for (var i = 0; i < top.allCtlList.length; i++) {
        if (top.allCtlList[i].id == id) {
            top.allCtlList.splice(i, 1);
            break;
        }
    }
}
hi5.GetFormObjData = function (id) {
    var formele = $("#" + id).closest(".form");

    var formobjid = formele.id;

    var formobj = hi5.GetObjData(formobjid);

    return formobj;
}
hi5.RemoveAllObjData = function () {
    // iframe load 시 전체 리스트 삭제 방지
    if (window.self == window.top)
        top.allCtlList = [];
}

hi5.GetCurrentPos = function (obj) {
    var element = document.getElementById(obj.id);
    if (hi5.WTS_MODE == WTS_TYPE.MDI) {
        var windowMain = $(element).closest('.hi5_win_main');
        var offsetLeft = $(windowMain).offset().left;
        var offsetTop = $(windowMain).offset().top;

        var scrollLeft = $("#hi5_content").scrollLeft();
        var scrollTop = $("#hi5_content").scrollTop();

        var parentOffset = $(element).offsetParent().offset();

        var parentTop = 0;
        var parentLeft = 0;
        if (parentOffset) {
            parentTop = parentOffset.top;
            parentLeft = parentOffset.left;
        }
        var topEle = element.offsetTop;
        var leftEle = element.offsetLeft;
        var eleHeight = element.clientHeight - 2;

        return {
            'top': scrollTop + parentTop - eleHeight - 20 - 2,
            'left': scrollLeft + parentLeft + leftEle
        };
    }

    var selfformid = obj.formid;

    var offsetTop = 0,
        offsetLeft = 0;
    var topYN = 0;
    var loopcnt = 0;
    if (window.self != window.top) {
        var parentwindow = window.parent;
        while (1) {
            var parentframes = parentwindow.document.getElementsByTagName('iframe');
            for (var x = 0; x < parentframes.length; x++) {
                var parentframe = parentframes[x];
                var subforms = $(parentframe).contents().find(".form");
                for (var j = 0; j < subforms.length; j++) {
                    if (subforms[j].id == selfformid) {
                        var divelement = parentframe.parentNode;
                        var parentform = $(divelement).closest('.form')[0];

                        offsetTop += divelement.getBoundingClientRect().top;
                        offsetLeft += divelement.getBoundingClientRect().left;

                        parentwindow = parentwindow.parent;
                        if (parentwindow == undefined) {
                            break;
                        }

                        if (parentform == undefined) {
                            topYN++;
                            break;
                        }

                        var parentformid = parentform.id;
                        selfformid = parentformid;

                        break;
                    }
                }
            }

            if (topYN > 0) break;

            //무한루프 방지
            loopcnt++;
            if (loopcnt > 50) break;
        }
    }

    /*
    var divs = window.top.document.getElementsByTagName('div');
    for (var x = 0; x < divs.length; x++) {
        var divelement = divs[x];
        if (divelement.className == "top_bar") {
            offsetTop += divelement.clientHeight - 1;
            break;
        }
    }
    */
    var topPos = offsetTop + element.getBoundingClientRect().top - window.pageYOffset;
    var leftPos = offsetLeft + element.getBoundingClientRect().left - window.pageXOffset;

    return {
        'top': topPos,
        'left': leftPos
    };
}

/// <member id="getJSONParse" kind="method">
/// <summary>JSON 형식의 문자열을 Object로 변환하는 함수</summary>
/// <param name = "strJSON" type="string">JSON 형식문자열  </param>
/// <returns type="object"> JSON형식의 object</returns>
/// <example><![CDATA[
///
/// //Json 형식의 문자열을 객체 형식으로 반환하는 예제
/// var text =  '{"employees":[' +
///             '{"firstName":"John","lastName":"Doe" },' +
///             '{"firstName":"Anna","lastName":"Smith" },' +
///             '{"firstName":"Peter","lastName":"Jones" }]}';
///
/// var obj = hi5.getJSONParse(text);
/// ]]></example>
/// </member>
hi5.getJSONParse = function (value, bSkip) {
    // --> [Edit] 수정자:kim changa 일시:2019/07/24
    // 수정내용> 입력값이 객체인 경우 바로 반환( tooltip 수정건)
    var obj = value;
    if (value != undefined && hi5.isString(value)) {
        if (bSkip)
            return JSON.parse(value);

        var text = value.replace(/\'/g, "\"");
        obj = JSON.parse(text);
    }
    return obj;
    // <-- [Edit] kim changa 2019/07/24
}

/// <member id="isNumber" kind="method">
/// <summary>입력문자열이 숫자형 유무를 판단하는 함수</summary>
/// <param name = "str" type="string">  </param>
/// <returns type="boolean"> true : 숫자형, false:숫자형아님</returns>
/// <example><![CDATA[
/// var b = hi5.getByteLen("12345");
/// //반환값은 true
/// ]]></example>
/// </member>
hi5.isNumber = function (a) {
    return !!a && a === Number || a.constructor === Number;
}

//hi5.isNumber = function (str) {
//   return str.match(/^[-]*[0-9,]+([\.]{1}[0-9]+)*$/gim) ? true : false;
//}

hi5.isFloatNumber = function (v) {
    return v.match(/^[0-9]+([\.]{1}[0-9]+)*$/gim) ? true : false;
}

hi5.isMail = function (v) {
    return v.match(/(.{3,}[@]{1}.+([\.]+[a-zA-Z0-9]+)$)/gim) ? true : false;
}

/// <member id="getByteLen" kind="method">
/// <summary>입력문자열의 Byte단위 길이값을 반환하는 함수</summary>
/// <param name = "str" type="string">  </param>
/// <returns type="number"> 문자열 Byte길이</returns>
/// <example><![CDATA[
/// var nLen = hi5.getByteLen("대한민국");
///  //반환값은 8
/// ]]>/</example>
/// </member>
hi5.getByteLen = function (str) {
    if (str == "")
        return 0;

    var stringLength = str.length;
    var stringByteLength = 0;

    stringByteLength = (function (s, b, i, c) {
        // min화시에 ; 부분 삭제하지 말것
        for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
        return b;
    })(str);

    return stringByteLength;
    /*
        str = String(str);
        var Len = str.length;
        var Length = 0;
        for (var i = 0; i < Len; i++) {
            if (str.charCodeAt(i) > 255) Length++;
            Length++;
        }
        return Length;
    */
}


/// <member id="sprintf" kind="method">
/// <summary>Format 형식으로 문자열을 반환하는 기능</summary>
/// <param name = "fmt" type="string"> 문자열 형식</param>
/// <param name = "argument" type="string|number"> 문자열 형식</param>
/// <returns type="string"> 변환된 문자열</returns>
/// <example><![CDATA[
/// var str = hi5.sprintf("최대길이%d, 최소길이%d글자로 입력 바랍니다", 10, 1 );
/// 반환값은 최대길이10, 최소길이1 글자로 입력 바랍니다.
/// ]]></example>
/// </member>
hi5.sprintf = function () {
    var sf = window.sprintf;
    return sf.apply(null, arguments);
}

hi5.vsprintf = function (fmt, argv) {
    var vsf = window.vsprintf;
    return vsf(fmt, argv);
}

hi5.GetMaxZindex = function () {
    if (hi5.CheckCookie() == false) {
        //alert($hi5_regional.cookie.alertMsg);
        return;
    }
    var zmax = sessionStorage.getItem("hi5-zindex");
    //console.log('1 - zmax : ' + zmax);
    if (zmax == null || zmax == "") {
        zmax = 1;
    } else {
        zmax = parseInt(zmax) + 1;
        if (zmax > 999999999) {
            zmax = 1;
        }
    }
    //console.log('2 - zmax : ' + zmax);
    sessionStorage.setItem("hi5-zindex", zmax.toString());

    return zmax;
}

hi5.addWinindex = function () {
    if (hi5.CheckCookie() == false) {
        //alert($hi5_regional.cookie.alertMsg);
        return;
    }
    var winIndex = sessionStorage.getItem("hi5-winindex");
    if (winIndex == null || winIndex == "") {
        winIndex = 1;
    } else {
        winIndex = parseInt(winIndex) + 1;
        if (winIndex > 999999999) {
            winIndex = 1;
        }
    }
    sessionStorage.setItem("hi5-winindex", winIndex.toString());
    return winIndex;
}

hi5.GetCurWinindex = function () {
    if (hi5.CheckCookie() == false) {
        //alert($hi5_regional.cookie.alertMsg);
        return;
    }
    var winIndex = sessionStorage.getItem("hi5-winindex");
    if (winIndex == undefined) {
        sessionStorage.setItem("hi5-winindex", "1");
        winIndex = "1";
    }
    return winIndex;
}

hi5.GetScreenIndex = function (flag) {
    if (hi5.CheckCookie() == false) {
        //alert($hi5_regional.cookie.alertMsg);
        return;
    }
    var d = sessionStorage.getItem("hi5-screenindex");
    if (d == undefined) {
        sessionStorage.setItem("hi5-screenindex", "1");
    }

    //console.log('1 - screenindex : ' + d);
    if (flag == "GET") {
        return parseInt(d);
    } else {
        if (d == null || d == "") {
            d = 1;
        } else {
            d = parseInt(d) + 1;
            if (d > 999999999) {
                d = 1;
            }
        }
        //console.log('2 - screenindex : ' + d);
        sessionStorage.setItem("hi5-screenindex", d.toString());
    }

    return d;
}

/// <member id="getJSONData" kind="method">
/// <summary>JSON 형식으로 데이터를 요청하는 함수</summary>
/// <remarks>상세내용 기술</remarks>
/// <param name = "url" type="string"> URL 주소(상태주소 /시작)</param>
/// <param name = "data" type="object"> 인자객체 { key:val,...}</param>
/// <param name = "callback" type="function"> callback함수</param>
/// <returns type="object"> jqxhr 객체</returns>
/// <example><![CDATA[
///     var url = "/api/stat/allcoin?", data={mrkt_id:"1", sort_code:"001", lang_type:""};
///     hi5.getJSONData( url, data).done( function(json) {
///        var list = json.list;  // 배열 데이터(한글데이터는 decodeURIComponent() 변환)
///     }).fail( function( jqxhr, textStatus, error ){
///         // 에러발생
///         var err = textStatus + ", " + error;
///         console.log( "Request Failed: " + err );
///     });
/// ]]></example>
/// </member>
hi5.getJSONData = function (url, data, callback) {
    var lang = local_lang == "ko" ? "KR" : "EN";
    var flickerAPI = window.location.origin + url;

    //if (hi5_dev_mode == "dev")
    //    flickerAPI = "http://wwwdev.hi5.com" + url;


    if (data.lang_type != undefined) // 언어구분
        data.lang_type = lang;

    //if (data.mrkt_id != undefined) {  // MarketID
    //data.mrkt_id = local_lang == "ko" ? "1" : "2";
    //}
    if (data.user_set_sdpr != undefined) // 기준시간
        data.user_set_sdpr = g_hi5_config.baseTime.toString();

    //   debugger;
    //    $.ajaxSetup({
    //        headers: {
    //           'lang_type': local_lang
    //     }
    //    });
    //    var jqxhr = $.getJSON(flickerAPI, data, callback);

    var jqxhr = $.ajax({
        headers: {
            'lang_type': local_lang
        },
        method: "GET",
        url: flickerAPI,
        dataType: "JSON",
        data: data
    })
    return jqxhr;
}

hi5.getHTMLData = function (option, callback) {
    var url = 'published/html/' + local_lang + '/' + option.filename;
    url = hi5.getURL({
        url: url
    }); // 2019.02.27 kws
    $.ajax({
        url: url,
        success: function (data) {
            if (callback) callback(data);
            else {
                if (option.$id) {
                    option.$id.append(data);
                }
            }
        },
        error: function (e) {
            if (callback) callback([]);
        }
    });
    return;
}

/// <member id="arrToObj" kind="method">
/// <summary>배열을 json형태로 바꿔주는 함수</summary>
/// <remarks>key값 array와 data값 array를 결합하여 json형태로 변환</remarks>
/// <param name="keys" type="array">json key들의 배열값</param>
/// <param name="arr" type="array">data들의 2차배열</param>
/// <returns type="array">json형태의 배열</returns>
/// <example><![CDATA[
///     var keys = ["name", "id", "age", ....];
///     var arr = [["Mike", "aaa1", "30", ....], ["John", "bbb2", "34", ....], .....];
///
///     var jsonarr = hi5.arrToObj(keys, arr);
///     //jsonarr = [{"name":"Mike", "id":"aaa1", "age": "30", ....}, {"name":"John", "id":"bbb2", "age": "34", ....}, ....];
/// ]]></example>
/// </member>
hi5.arrToObj = function (keys, arr, option) {
    var nCnt = arguments.length;

    if (nCnt == 3) {
        var dataLen = arr.length,
            record, outRec = {};
        if (dataLen > 0) {
            for (var x = 0; x < dataLen; x++) {
                record = arr[x];
                var value = record[keys];
                outRec[value] = record;
                delete record[keys];
            }
        }
        return outRec;
    }

    var result = [];
    var tmp = {};
    //var keys = arr[0];
    for (var i = 0; i < arr.length; i++) {
        var valarr = arr[i];
        for (var j = 0; j < valarr.length; j++) {
            tmp[keys[j]] = valarr[j];
        }
        result.push(tmp);
        tmp = {};
    }
    return result;
}

/// <member id="SetToast" kind="method">
/// <summary>토스트 형태의 메시지 띄워주기(모바일용)</summary>
/// <remarks><![CDATA[
///     타이머 단위는 초 단위
///     형식: SetToast( nType, strText [,nTimeout] )
/// ]]></remarks>
/// <param name = "nType" type="string">메시지 표시 여부 0:미표시 그외 표시</param>
/// <param name = "strText" type="string">표시될 메시지</param>
/// <param name = "nTimeout" type="number" default="5" option="true">타이머 시간(단위:초)</param>
/// <example><![CDATA[
///  // 3초간 유지하는 경우
///  hi5.SetToast(1, strMsg, 3); // 메시지박스 3초 유지
///
/// // 시간 미지정한 경우 기본값 5초
///  hi5.SetToast(1, strMsg); // 메시지박스 3초 유지
/// ]]></example>
/// </member>
hi5.SetToast = function (nType, strText, nTimeout) {
    if (nType == 0) return;

    var messagebox = document.getElementById("timeoutmessage");
    if (messagebox == undefined) {
        messagebox = document.createElement('div');
        messagebox.id = "timeoutmessage";
        messagebox.innerHTML = strText;
        messagebox.className = "show";
        $("body").append(messagebox);
    } else {
        messagebox.className = "show";
    }
    var nTime = 5000;
    if (nTimeout != undefined)
        nTime = nTimeout * 1000;

    setTimeout(function () {
        messagebox.className = messagebox.className.replace("show", "");
    }, nTime);
}
// --> [Edit] 수정자:kim changa 일시:2020/02/04
// 수정내용> SPA모드에서 토스트개수를 관리하는 기능
var g_toastData = [],
    g_toastTimerID = 0;
hi5.displayToast = function (obj) {

    if (!obj.time) { // 시간을 입력 받지 않았으면 현재시각으로 표시
        var timeObj = hi5.getUTCLocalTime(new Date().getTime());
        obj["time"] = timeObj.local.h + ":" + timeObj.local.m + ":" + timeObj.local.s;
    }

    if (!obj.sec) {
        obj["sec"] = 5; //기본값으로 5초
    }
    obj["sec"] = obj["sec"] * 1000;

    toastr.options = {
        //progressBar: hi5.WTS_MODE == WTS_TYPE.SPA ? true : false,   // progress바 표시 옵션기능
        progressBar: false,
        debug: false,
        preventDuplicates: false,
        timeOut: obj["sec"],
        showMethod: 'slideDown',
        positionClass: "toast-top-right",
        showDuration: 500, // 바로표시기능
        hideDuration: 500,
        closeButton: true,
        onCloseClick: function () {
            if (hi5.WTS_MODE == WTS_TYPE.SPA) {
                if (g_toastData.length > 0) {
                    hi5.displayToast(g_toastData.shift());
                }
            }
        }
    };

    if (hi5.WTS_MODE == WTS_TYPE.MTS) {
        toastr.options.showOnlyNewest = true; // 모바일은 항상 최신꺼 하나만 보여주도록 한다.
        toastr.options.positionClass = 'toast-top-center'; // 모바일은 상단 가운데 표시
        toastr.options.swipe = true; // 모바일은 swipe 액션 추가
    }

    if (obj.options) {
        toastr.options = $.extend(true, toastr.options, obj.options);
    }
    var nType = obj.type;
    if (nType == 0) {
        /* 파란색(체크모양) Order Filled */
        toastr.success(obj.text, obj.title, obj.time);
    } else if (nType == 1) {
        /* 빨간색(느낌표) Liquidation Notice */
        toastr.error(obj.text, obj.title, obj.time);
    } else if (nType == 2) {
        /* 주황색(느낌표) Order Error */
        toastr.warning(obj.text, obj.title, obj.time);
    } else if (nType == 3) {
        /* 초록색(알람) Margin Transferred */
        toastr.alarm(obj.text, obj.title, obj.time);
    } else if (nType == 4) {
        /* 보라색(취소) Order Canceled */
        toastr.cancel(obj.text, obj.title, obj.time);
    } else {
        /* Normal(느낌표) Notice */
        toastr.info(obj.text, obj.title, obj.time);
    }

}
// <-- [Edit] kim changa 2020/02/04

/// <member id="showToast" kind="method">
/// <summary>toast 형태로 표시되는 메시지</summary>
/// <remarks>타입에 따라 보여지는 toast 형태가 다르다.</remarks>
/// <param name="obj" type="object">{type : 종류, title: 제목, text: 내용, sec:유지시간(초), time:표시시각(hh:mm:ss)}</param>
/// <example>
/// var obj = {type : 종류, title: 제목, text: 내용, sec:유지시간(초), time:표시시각(hh:mm:ss)};
///  hi5.showToast(obj);
/// </example>
/// </member>


hi5.showToast = function (obj) {
    if (!obj) return;
    /*
    obj = {type : 종류, title: 제목, text: 내용, sec:유지시간(초), time:표시시각(hh:mm:ss)}
    */
    if (!obj.text) return; // 내용이 비었으면 return, 딴건 다 비어도 됨.
    /*
    // SPA모드에서 토스트 개수를 순차작으로 표시를 한다.
    if (hi5.WTS_MODE == WTS_TYPE.SPA) {
        //if (g_toastData.length >= 10  && obj.sec) {
        //    obj.sec = 3; // 6개 이상이면 3초로 변경을 한다.
       // }
        obj['sec'] = 5;

        //obj.text = obj.text + "[" + (g_toastData.length + 1) + "]";
        var objData, count;
        if (hi5_DebugLevel && hi5_DebugLevel.toast_debug) {
            if (window.g_toastIndex === undefined) window['g_toastIndex'] = 0;
            g_toastIndex = g_toastIndex + 1;
            obj.title = obj.title + "[" + g_toastIndex + "]"
        }
        count = g_toastData.push(obj);
        if ($("#toast-container").children().length < toastr.maxshow) {
            hi5.displayToast(g_toastData.shift());
        }
        // 1초 타이머 기능
        if (g_toastTimerID > 0) return;
            g_toastTimerID = setInterval(function () {
            if (g_toastData.length > 0) {
                count = $("#toast-container").children().length;
                console.log(count);
                //count = $("#toast-container").children('.toast').length;
                if (count < toastr.maxshow) {
                    objData = g_toastData.shift();
                    hi5.displayToast(objData);
                }
            }
        }, 500)
        return;
    }
    */
    hi5.displayToast(obj);

}

/// <member id="MessageBox" kind="method">
/// <summary>메시지 박스를 옵션에 따라 표시</summary>
/// <remarks>타입에 따라 보여지는 메시지 박스 형태가 다르다.</remarks>
/// <param name="strText" type="string">표시될 메시지</param>
/// <param name="strTitle" type="string">타이틀</param>
/// <param name="nType" type="number">메시지박스 종류(0:닫기,1:확인/취소,2:예/아니오,3:확인)</param>
/// <param name="fn" type="function">버튼 클릭시 callback 함수</param>
/// <param name="position" type="object">표시위치 {within: formObject_id }</param>
/// <example>
///  hi5.MessageBox(strMsg,strTitle,0,function(fn){ }); fn으로 버튼 클릭한 값이 들어옴.
/// </example>
/// </member>
var hi5_pwCheck = 0;
hi5.MessageBox = function (strText, strTitle, nType, fn, position, formid) {
    var rtn = "0";
    var type = "";

    if (strTitle == "") {
        strTitle = $hi5_regional.title.warning;
    }
    var okText = $hi5_regional.button.okText;
    var confirmText = $hi5_regional.button.confirmText;
    var cancelText = $hi5_regional.button.cancelText;
    var yesText = $hi5_regional.button.yesText;
    var noText = $hi5_regional.button.noText;
    var closeText = $hi5_regional.button.closeText;

    strText = x2h.getMultiLineText(strText);

    var posObj;
    if (!position || position == "center") {
        posObj = {
            my: "center",
            at: "center",
            of: window
        };
    }
    if (position == "form") {
        posObj = {
            my: "center",
            at: "center",
            of: "#" + formid
        };
    }
    var dialogOptions = {
        modal: true,
        title: strTitle,
        //minHeight: 150,
        //minWidth: 400,
        position: posObj
    };
    if (hi5.WTS_MODE != WTS_TYPE.MTS) {
        dialogOptions["minHeight"] = "150";
        dialogOptions["minWidth"] = "400";
        if (position == "form" && formid) {
            dialogOptions["minWidth"] = "260";
            dialogOptions["width"] = "260";
        }
    }

    var messagebox = document.getElementById("hi5_msgbox");
    if (messagebox == undefined) {
        messagebox = document.createElement('div');
        messagebox.id = "hi5_msgbox";
        if (position == "form" && formid) {
            $("#" + formid).append(messagebox);
        } else
            $("body").append(messagebox);

        var ptag = document.createElement('p');
        messagebox.appendChild(ptag);
    }
    $("#hi5_msgbox > p").html(strText);

    if (nType == 0) {
        dialogOptions["buttons"] = [{
            class: 'hi5_dialogBtn_ok',
            text: closeText,
            //create: function () {
            //    console.log('create');
            //    //$(".ui-dialog-buttonset button").focus();
            //    $(".ui-dialog-buttonset button").on("keyup", function (e) {
            //        console.log(e);
            //        if (e.keyCode == $.ui.keyCode.ENTER) {
            //            //$(this).parent().find("button:eq(0)").trigger("click");
            //            $(this).trigger("click");
            //
            //        }
            //    });
            //},
            click: function () {
                hi5_pwCheck = 1;
                $(this).dialog("close");
                //if (fn) fn("1");
            }
        }];
        // dialogOptions["close"] = function() {
        //     hi5_pwCheck=1;
        //     if (fn) fn("1");
        // }
    } else if (nType == 1) {
        dialogOptions["buttons"] = [{
                text: cancelText,
                class: 'hi5_dialogBtn_close',
                click: function () {
                    $(this).dialog("close");
                    if (fn) fn("0");
                }
            },
            {
                text: confirmText,
                class: 'hi5_dialogBtn_ok',
                click: function () {
                    $(this).dialog("close");
                    if (fn) fn("1");
                }
            }
        ];
    } else if (nType == 2) {
        dialogOptions["buttons"] = [{
                text: noText,
                class: 'hi5_dialogBtn_close',
                click: function () {
                    $(this).dialog("close");
                    if (fn) fn("0");
                }
            },
            {
                text: yesText,
                class: 'hi5_dialogBtn_ok',
                click: function () {
                    $(this).dialog("close");
                    if (fn) fn("1");
                }
            }
        ];
    } else if (nType == 3) {
        dialogOptions["buttons"] = [{
            text: okText,
            class: 'hi5_dialogBtn_ok',
            click: function () {
                $(this).dialog("close");
                if (fn) fn("1");
            }
        }];
    }

    // dialogOptions["close"] 를 초기화 시키지 않으면, 다른 타입에서 close할때 이벤트가 계속 남아있어서, 엉뚱한 callback function을 호출하게 된다.
    // 따라서 다른 Type일때, close option을 초기화 시킨다.
    if (nType == 0) {
        dialogOptions["close"] = function () {
            hi5_pwCheck = 1;
            if (fn) fn("1");
        }
    } else {
        dialogOptions["close"] = "";
    }

    $("#hi5_msgbox").dialog(dialogOptions);
    //$(".ui-dialog").css({ "font-size": "13px", "border": "0", "border-radius": "0", "padding": "0" });
    //$(".ui-dialog-title").css({ "margin-top": "8px" });
    $(".ui-dialog > .ui-dialog-titlebar").addClass("hi5_title_bg");
    //$(".ui-dialog > .ui-dialog-titlebar").css({ "height": "35px", "background-color": "#4764bf", "color": "rgb(242,242,242)", "border": "0", "padding": "0", "border-radius": "0", "margin" : "6px" });
    //$(".ui-dialog > .ui-dialog-titlebar > .ui-dialog-title").css({ "margin-left": "5px", "font-size": "14px", "padding-left": "10px" });
    $("#hi5_msgbox").css({
        "min-height": "",
        "text-align": "center"
    });
    //$(".ui-dialog-buttonset").css({ "text-align": "center", "float" : "none" });
    //$(".ui-dialog-buttonset button").css({ "border-style": "none", "font-size": "16px", "color": "#fff", "background-color": "#999", "width": "120px" });
    //$(".ui-dialog-buttonset button").css({ "border": "1px solid #d2d3d7", "font-size": "16px", "width": "120px" });
    //$(".ui-dialog-titlebar button .ui-button-icon").css({ "background-image": "url(../fosc_dev/images/ui-icons_ffffff_256x240.png)" });
    $(".ui-dialog-titlebar button .ui-button-icon").addClass("hi5_dialog_button");
    //var browserObj = hi5.GetMediaInfo();
    //console.log(browserObj);
    //if (browserObj) {
    //    if (browserObj.browserinfo.indexOf("IE ") > -1) {
    //$(".ui-dialog-content.ui-widget-content").css({ "overflow": "hidden" });
    //    }
    //    else {
    //        $(".ui-dialog-content.ui-widget-content").css({ "overflow": "unset" });
    //    }
    //}
    //else
    //    $(".ui-dialog-content.ui-widget-content").css({ "overflow": "unset" });

    if (hi5.WTS_MODE == WTS_TYPE.MTS) {
        $("#hi5_msgbox").css({
            height: "250px",
            'text-align': 'left'
        });
        //$(".ui-dialog .ui-widget-content, .ui-dialog.ui-widget-content").css({background : "#273a63"});
        //$(".hi5_title_bg").css({'background-color' : "#273a63!important", 'color' : '#ffffff'});
        $(".ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable").css({
            //top : '50%',
            top: '88px',
            //left : '50%',
            left: '16px'
            //transform: 'translate(-50%,-50%)',
            //'-webkit-transform': 'translate(-50%,-50%)',
            //'-ms-transform': 'translate(-50%,-50%)',
            //'-webkit-font-smoothing': 'subpixel-antialiased'
        });
        //$(".ui-dialog-buttonset button").css({'background-color': 'rgba(255, 255, 255, 0.1) !important'});

        $(".ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable").css({
            width: (document.body.clientWidth - 32) + 'px'
        });
        //if(document.body.clientWidth >= 360){
        //    $(".ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable").css({width : '350px'});
        //}
        //else{
        //    $(".ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable").css({width : '90%'});
        //}
    }

    //close button
    var btn_color = "#9eaab9";
    if (hi5.SHMEM.user_setting.general.theme == "light") btn_color = "#333333";
    //$(".hi5_title_bg button").html('<i class="fa fa-times" style="color:'+btn_color+';font-size: 22px;cursor: pointer;position: absolute;text-indent: 0px;"></i>');
    $(".hi5_title_bg button").html('');
    //$(".ui-dialog .ui-dialog-titlebar-close").css({border: 'none', "background-color" : "transparent", "top" : '20%', right : '10px'});
    $(".ui-dialog .ui-dialog-titlebar-close").css({
        border: 'none'
    });

    return rtn;
}


/// <member id="RPAD" kind="method">
/// <summary>해당 값 우측으로 공백또는 지정한 문자로 채우는 기능</summary>
/// <remarks>입력받은 문자열 우측으로 공백 채우기(구조체 통신용)</remarks>
/// <param name = "str" type="string"> RPAD처리 할 문자열 </param>
/// <param name = "len" type="number"> 해당 문자열이 RPAD처리 후의 총 길이 </param>
/// <param name = "defval" type="string" default = "true" option=" "> 기본값은 공백 </param>
/// <returns type="string"> RPAD처리 된 문자열 </returns>
/// <example><![CDATA[
///     var str = "abc";
///     var len = 10;
///     var newstr = hi5.RPAD(str,len);     // "abc       "
///     //만약에 원 문자열의 길이가 입력한 길이보다 초과하면 길이에 맞게 잘라서 return해준다.
/// ]]></example>
/// </member>
hi5.RPAD = function (str, len, defval) {
    if (str == undefined || str == null) str = "";
    str = str.toString();
    var strlen = str.length;
    var val = defval === undefined ? " " : defval;

    for (var x = strlen; x < len; x++) {
        str += val;
    }

    str = str.substring(0, len);

    return str;
}

hi5.RPADbuff = function (buff, len) {
    if (buff == undefined) {
        var buff = new Array(len);
        var bufflen = 0;
    } else {
        var bufflen = buff.length;
    }

    for (var x = bufflen; x < len; x++) {
        buff[x] = 32; // 공백
    }
    return buff;
}

hi5.LPADbuff = function (buff, len) {
    if (buff == undefined) {
        var buff = new Array(len);
        var bufflen = 0;
    } else {
        var bufflen = buff.length;
    }

    for (var x = 0; x < len - bufflen; x++) {
        buff.unshift(32); // 앞에 추가
    }
    return buff;
}

/// <member id="LPAD" kind="method">
/// <summary>해당 값 좌측으로 공백또는지정한 문자로 채우는 기능</summary>
/// <remarks>입력받은 문자열 좌측으로 공백 채우기(구조체 통신용)</remarks>
/// <param name = "str" type="string"> LPAD처리 할 문자열 </param>
/// <param name = "len" type="number"> 해당 문자열이 LPAD처리 후의 총 길이 </param>
/// <param name = "defval" type="string" default = "true" option=" "> 기본값은 공백 </param>
/// <returns type="string"> LPAD처리 된 문자열 </returns>
/// <example><![CDATA[
///     var str = "abc";
///     var len = 10;
///     var newstr = hi5.LPAD(str,len);     // "       abc"
///     //만약에 원 문자열의 길이가 입력한 길이보다 초과하면 길이에 맞게 잘라서 return해준다.
/// ]]></example>
/// </member>
hi5.LPAD = function (str, len, defval) {
    if (str == undefined || str == null) str = "";
    str = str.toString();
    var strlen = str.length;
    var val = defval === undefined ? " " : defval;

    for (var x = 0; x < len - strlen; x++) {
        str = val + str;;
    }

    str = str.substring(0, len);

    return str;
}


/// <member id="GetCodeInfo" kind="method">
/// <summary>종목코드 및 취득하고자하는 아이템명을 포함한 객체 입력 후 종목정보 취득하는 함수</summary>
/// <remarks><![CDATA[
/// 종목코드 입력 후 맞는 정보가 있으면 아래와 같은 스트링 또는 객체가 리턴된다.
/// 화면에서 종목코드정보로 통신 요청, 종목연동등의 기능을 사용하는 경우
/// var object = {itemname:"name"} Or var object = {itemname:["name","symbol" ... ]}
/// var obj = hi5.GetCodeInfo(code, object);
/// - obj 종목 객체 상세 설명
///    <b>code</b>
///     Type: string
///     종목코드
///    <b>name</b>
///     Type: string
///     종목명
///    <b>symbol</b>
///     Type: string
///     시장구분명
///    <b>mktgbcd</b>
///     Type: string
///     시장구분코드
///
///    만약 정보가 없으면 빈 객체로 반환
/// ]]></remarks>
/// <param name = "code" type="string"> 종목마스터 </param>
/// <returns type="string|object"> 종목 정보가 String || Object형태로 리턴, 정보가 없으면 빈 객체로 반환</returns>
/// <example><![CDATA[
/// //한개의 아이템만 필요할 경우 string 으로 리턴된다.
/// var objInfo = { itemname: "name" };
/// var codename = hi5.GetCodeInfo(code, objInfo);
///
/// //복수개의 아이템이 필요한경우 itemname 어레이를 넘기면, 객체로 리턴된다.
/// var objInfo = { itemname: ["name", "min_order_volume", "lstn_code"] };
/// var obj = hi5.GetCodeInfo(code , objInfo);
///
/// //code만 주면 해당 code의 종목정보 전체를 리턴한다.
/// var obj = hi5.GetCodeInfo(code);
///
/// //error 인경우 빈값을 리턴한다.
/// var objInfo = { itemname: "name" };
/// var codename = hi5.GetCodeInfo("", objInfo);
///
/// ]]></example>
/// <see cref="../Method/dispidisEmpty.htm">hi5.isEmpty() 빈값 체크함수</see>
/// </member>

hi5.GetCodeInfo = function (code, obj, ins) {
    //코드가 없으면 빈값으로 리턴시킨다
    if (!code && code == "")
        return "";

    var codeObj = g_masterInfo[code];

    //마스터에 해당 코드의 정보가 없는경우 빈값 리턴
    if (!codeObj)
        return "";

    //코드만 넘긴경우 해당 코드의 정보를 전부 리턴한다.  returnType : Object
    if (!obj || obj == "") {
        return codeObj;
    }
    //특정 아이템 1개만 찾을경우 해당 값만 리턴한다. returnType : String
    else if (typeof (obj.itemname) == "string") {
        if (codeObj[obj.itemname]) {
            if (obj.itemname == "codename") {
                return local_lang == "ko" ? codeObj["codename"] : codeObj["codename"];
            } else if (obj.itemname == "min_order_volume") {
                return codeObj[obj.itemname];
                //var basicPrice = codeObj["coin_sdpr"];  //기준가 정보를 가져와서 최소주문수량을 구해준다.
                //var minOrderVol = "";
                //basicPrice = parseFloat(basicPrice);
                //if (basicPrice > 1000000)    //백만원 초과 = 최소주문수량 0.0001
                //    minOrderVol = "0.0001";
                //else if (1000000 >= basicPrice > 100000)    //백만원 이하 10만원 초과 = 최소주문수량 0.001
                //    minOrderVol = "0.001";
                //else if (100000 >= basicPrice > 10000)    //십만원 이하 1만원 초과 = 최소주문수량 0.01
                //    minOrderVol = "0.01";
                //else if (10000 >= basicPrice > 1000)    //만원 이하 천원 초과 = 최소주문수량 0.1
                //    minOrderVol = "0.1";
                //else if (1000 >= basicPrice )    //천원 이하 = 최소주문수량 1
                //    minOrderVol = "1";
                //
                //return minOrderVol;
            } else
                return codeObj[obj.itemname];
        } else if (obj.itemname == "base_coincode") {
            var basecode = codeObj["base_currency_co"];
            if (basecode && basecode != "") {
                var baseMarket = g_hi5_config.currency_market == undefined ? hi5_baseCurr : g_hi5_config.currency_market;
                if (basecode == baseMarket)
                    return "";
                else {
                    //var c_code = baseMarket == 'BTC' ? 'BTC/' : 'ETH/';
                    //c_code += hi5_baseCurr;
                    //return c_code;
                    if (hi5_baseCurr == "USD") return basecode += "/USDT";
                    basecode += "/" + hi5_baseCurr;
                    return basecode;
                }
            }
        } else
            return "";
    }
    //특정 아이템 복수개를 찾을경우 해당 값들을 리턴한다. returnType : Object
    else {
        var itemname, masterObj = {};
        itemname = obj.itemname;
        for (var i = 0; i < itemname.length; i++) {
            if (codeObj[itemname[i]])
                masterObj[itemname[i]] = codeObj[itemname[i]];
        }
        return masterObj;
    }
}


/// <member id="isEmpty" kind="method">
/// <summary>어떤값이 자료형에 상관없이 빈값인지를 체크하는 함수</summary>
/// <remarks><![CDATA[
///    빈 문자열(''), null값, 미정의값(undefined) 빈값으로 처리-> 반환값 true
///    빈 배열([]), 빈 객체( {} ) 도 빈값으로 처리 -> 반환값 true
///
/// ]]></remarks>
/// <param name = "value" type="string|object|array"> 문자, 배열, 객체 자료형 데이터 </param>
/// <returns type="boolean"> 빈값이 아니면 false, 빈값이면 true</returns>
/// <example><![CDATA[
///  // 빈 값인 경우
///  var value;
///  alert(hi5.isEmpty(value));   // 선언만 된경우라서 true 반환
///
///  value = "";
///  alert(hi5.isEmpty(value));   //  빈문자열('')라서 true 반환
///
///  value = 0;
///  alert(hi5.isEmpty(value));   //  어떤 결과가 나올까요?
///
///  alert(hi5.isEmpty({}));     //  빈객체라서 true 반환
///
///  alert(hi5.isEmpty([]));     //  빈Array라서 true 반환
///
/// ]]></example>
/// </member>
hi5.isEmpty = function (value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true;
    }
    return false;
}

/// <member id="clone" kind="method">
/// <summary>오브젝트 객체 복사기능</summary>
/// <remarks>사용자 오브젝트를 복사하는 기능</remarks>
/// <param name = "obj" type="object"> 오브젝트 타입</param>
/// <returns type="object"> 복사한 객체</returns>
/// <example><![CDATA[
///  // foo객체를 생성
///  var foo = { key: 'value', data:'123' };
///  // foo 객체를 bar 객체로 복사
///  var bar = hi5.clone(foo);
///  foo.key = 'other value';
///  // 로그출력
///  console.log(foo);
///  console.log(bar);
/// ]]></example>
/// </member>
hi5.clone = function (obj) {
    if (obj === null || typeof (obj) !== 'object') return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            //copy[attr] = obj[attr];
            copy[attr] = hi5.clone(obj[attr]);
        }
    }
    return copy;
}

hi5.checksum = function (ab) {
    var checksum = 0; //mod = g_media == 'W' ? 191 : 257;
    var mod = 191,
        i, len, val;
    if (hi5.isArrayBuffer(ab)) {
        len = ab.byteLength;
        var target = new Uint8Array(ab);
        for (i = 0; i < len; i++) {
            val = target[i];
            checksum += val;
        }
    } else if (hi5.isArray(ab)) {
        len = ab.length;
        for (i = 0; i < len; i++) {
            val = ab[i];
            checksum += val;
        }
    } else if (ab instanceof Uint8Array || ab instanceof Int8Array) {
        len = ab.byteLength;
        for (i = 0; i < len; i++) {
            val = ab[i];
            checksum += val;
        }
    } else {
        console.assert(false, "checksum....type error!")
    }
    //return checksum > 0 ? checksum % mod : 0;
    return checksum % mod; // 2019.08.06 kws -> 한글입력이 많은 경우 checksum 값이 minus가 된다. 서버에서는 해당 minus를 unsigned int로 치환해서 다시 계산하지만 javascript로는 힘들기 때문에 헤더에서 crypt가 0x03인 경우 마이너스 checksum도 수용하기로 추가함.
}

hi5.strToBool = function (str) {
    if (hi5.isBool(str)) return str;

    switch (str.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return Boolean(str);
    }
}

hi5.isBool = function (bool) {
    return typeof bool === 'boolean' ||
        (typeof bool === 'object' &&
            bool !== null &&
            typeof bool.valueOf() === 'boolean');
}

hi5.isString = function (a) {
    return !!a && (a === String || a.constructor === String);
}

hi5.isArrayBuffer = function (a) {
    return !!a && (a === ArrayBuffer || a.constructor === ArrayBuffer);
}

hi5.isObject = function (a) {
    return !!a && (a === Object || a.constructor === Object);
}

hi5.isFunction = function (a) {
    return !!a && (a === Function || a.constructor === Function);
}

hi5.isArray = function (a) {
    //return Array.isArray(a);
    return !!a && (a === Array || a.constructor === Array);
}

// utf8->arrayBuf(Uint8Array)
hi5.utf2Array = function (str) {
    var utf8 = [],
        c;
    for (var i = 0; i < str.length; i++) {
        c = str.charCodeAt(i);
        if (c < 0x80) utf8.push(c);
        else if (c < 0x800) {
            utf8.push(0xc0 | (c >> 6),
                0x80 | (c & 0x3f));
        } else if (c < 0xd800 || c >= 0xe000) {
            utf8.push(0xe0 | (c >> 12),
                0x80 | ((c >> 6) & 0x3f),
                0x80 | (c & 0x3f));
        } else {
            i++;
            c = ((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
            utf8.push(0xf0 | (c >> 18),
                0x80 | ((c >> 12) & 0x3f),
                0x80 | ((c >> 6) & 0x3f),
                0x80 | (c & 0x3f));
        }
    }
    return new Uint8Array(uint8);
}

hi5.utf2Str = function (uint8) {
    var str = "",
        i = 0,
        len, c, c2, c3;
    len = uint8.length;
    while (i < len) {
        c = uint8[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                str += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                c2 = uint8[i++];
                str += String.fromCharCode(((c & 0x1F) << 6) | (c2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                c2 = uint8[i++];
                c3 = uint8[i++];
                str += String.fromCharCode(((c & 0x0F) << 12) | ((c2 & 0x3F) << 6) | ((c3 & 0x3F) << 0));
                break;
        }
    }
    return str;
}

//Converts from MultiByte to UTF-8
hi5.A2U = function (uint8, option) {
    // --> [Edit] 수정자:kim changa 일시:2019/02/27
    // 수정내용>  UTF8 변환작업
    /*var str ="";
    var encoding = (option == undefined) ? "euc-kr" : option;

    try{
        str = new TextDecoder(encoding).decode(uint8);
    } catch (e) {
        debugger;
        console.log(e);
    }
    */
    //var y = string.indexOf(String.fromCharCode(0));
    //if (y > 0) string = string.slice(0, y);
    let str = hi5.utf2Str(uint8); // 서버에서 UTF8로 인코딩한 경우

    // <-- [Edit] kim changa 2019/02/27
    return str;
}

//Converts from UTF-8 to MultiByte
hi5.U2A = function (str, option) {
    // --> [Edit] 수정자:kim changa 일시:2019/02/27
    // 수정내용>  UTF8 변환작업
    /*var encoding = (option == undefined) ? "euc-kr" : option;
    var uint8 = new TextEncoder(encoding, { NONSTANDARD_allowLegacyEncoding: true }).encode(str);
    return uint8;*/

    var utf8 = unescape(encodeURIComponent(str));
    var arr = [];
    for (var i = 0; i < utf8.length; i++) {
        arr.push(utf8.charCodeAt(i));
    }
    var uint8 = new Uint8Array(arr);

    return uint8;
}

//Converts from byte array to int
hi5.B2I = function (buff) {
    var result = "";

    for (var x = 0; x < buff.length; x++) {
        var hex = buff[x].toString(16);
        if (hex.length == 1) hex = "0" + hex;

        result += hex;
    }

    var d = parseInt(result, 16);

    return d;
}
//Converts from byte array to string
hi5.B2S = function (buff) {
    var result = "";

    for (var i = 0, l = buff.length; i < l; i++) {
        var hex = String.fromCharCode(buff[i]);
        result += hex;
    }
    return result;
}

// ip문자열을 uint값으로 반환(little-edian)
hi5.ip2int = function (ip) {
    return ip.split('.').reduce(function (ipInt, octet) {
        return (ipInt << 8) + parseInt(octet, 10)
    }, 0) >>> 0;
}

// ip정수값을 문자열로 반환
hi5.int2ip = function (ipInt) {
    return ((ipInt >>> 24) + '.' + (ipInt >> 16 & 255) + '.' + (ipInt >> 8 & 255) + '.' + (ipInt & 255));
}

// 비밀번호 암호화된 문자열 반환하는 함수
hi5.GetEncriptionValue = function (str) {
    //var val = str;
    // HTSCoin인 경우에  SHA256 암호화 로직을 사용한다.
    var val = SHA256(str);
    return val;
}

//hi5.SHA256 = function (str) {
//   return SHA256(str);
//}

hi5.encode = function (strings) {
    var encoder, encoded, len, i, bytes, view, offset;
    encoder = new TextEncoder();
    encoded = [];
    len = Uint32Array.BYTES_PER_ELEMENT;
    for (i = 0; i < strings.length; i += 1) {
        len += Uint32Array.BYTES_PER_ELEMENT;
        encoded[i] = new TextEncoder().encode(strings[i]);
        len += encoded[i].byteLength;
    }

    bytes = new Uint8Array(len);
    view = new DataView(bytes.buffer);
    offset = 0;
    view.setUint32(offset, strings.length);
    offset += Uint32Array.BYTES_PER_ELEMENT;
    for (i = 0; i < encoded.length; i += 1) {
        len = encoded[i].byteLength;
        view.setUint32(offset, len);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        bytes.set(encoded[i], offset);
        offset += len;
    }
    return bytes.buffer;
}

hi5.decode = function (buffer, encoding) {
    var decoder, view, offset, num_strings, strings, i, len;
    decoder = new TextDecoder(encoding);
    view = new DataView(buffer);

    offset = 0;
    strings = [];
    num_strings = view.getUint32(offset);
    offset += Uint32Array.BYTES_PER_ELEMENT;
    for (i = 0; i < num_strings; i += 1) {
        len = view.getUint32(offset);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        strings[i] = decoder.decode(
            new DataView(view.buffer, offset, len));
        offset += len;
    }
    return strings;
}


hi5.swap16 = function (val) {
    return ((val & 0xFF) << 8) | ((val >> 8) & 0xFF);
}

hi5.swap32 = function (val) {
    return ((val & 0xFF) << 24) |
        ((val & 0xFF00) << 8) |
        ((val >> 8) & 0xFF00) |
        ((val >> 24) & 0xFF);
}

// endianness  : true is Little-endian
hi5.strToCharCodeArr = function (str) {
    str = str.toString();
    var arr = [],
        len = str.length,
        idx = 0;

    while (idx < len) {
        arr[idx] = str.charCodeAt(idx);
        idx++;
    }
    return arr;
}

// performance pollyfill
/*
(function () {
    if ("performance" in window == false) {
        window.performance = {};
    }
    Date.now = (Date.now || function () {  // thanks IE8
        return new Date().getTime();
    });

    if ("now" in window.performance == false) {

        var nowOffset = Date.now();

        if (performance.timing && performance.timing.navigationStart) {
            nowOffset = performance.timing.navigationStart
        }

        window.performance.now = function now() {
            return Date.now() - nowOffset;
        }
    }
})();
*/

var hi5ElapsedTime = {};
/// <member id="timeElapsed" kind="method">
/// <summary>시간측정을 나타내는 함수</summary>
/// <remarks><![CDATA[
///  함수구간 또는 모듈처리 시간을 표현하는 함수
///  형식 :  hi5.timeElapsed({ name : "이름", start:true });
///  option 객체 설명
///  start: true : 시작의미( 시작인 경우만 지정)
///  name : 구간 측정 이름 지정(필수)
/// ]]></remarks>
/// <param name = "option" type="object"> 입력옵션정보</param>
/// <example><![CDATA[
///  // 예제
///  hi5.timeElapsed({start: true, name:"통신구간"});
///     // dofunction()........
///  hi5.timeElapsed({name:"통신구간"});
///  // 결과는 colsole 창에 표시
///  // ==== timeElapsed[통신구간=0.054999999999381544] ms
/// ]]></example>
/// </member>
hi5.timeElapsed = function (option) {
    if (hi5_DebugLevel && hi5_DebugLevel.timeElapsed) {
        if (option.start) {
            hi5ElapsedTime[option.name] = performance.now();
        } else {
            if (hi5ElapsedTime[option.name]) {
                var end = performance.now() - hi5ElapsedTime[option.name];
                console.log("====timeElapsed[" + option.name + "]===" + end + " ms");
                delete hi5ElapsedTime[option.name];
            }
        }
    }
}


// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
if (!Uint8Array.prototype.slice) {
    Object.defineProperty(Uint8Array.prototype, 'slice', {
        value: Array.prototype.slice
    });
}

if (!ArrayBuffer.prototype.string) {
    ArrayBuffer.prototype.string = function () {
        var str = "";
        if (this != undefined && this.byteLength > 0) {
            str = String.fromCharCode.apply(null, new Uint8Array(this));
        }
        return str;
    };
}

// 서버에서응답중에 슷자형을 구하는 경우에 사용
hi5.A2Uint = function (arBuf, start, end) {
    if (arBuf instanceof Uint8Array) {
        return String.fromCharCode.apply(null, arBuf.subarray(start, end)).Ntrim().atoi();
    }
    return arBuf.slice(start, end).string().Ntrim().atoi();
}

hi5.A2UByte = function (arBuf, start, end) {
    if (arBuf instanceof Uint8Array) {
        return String.fromCharCode.apply(null, arBuf.subarray(start, end));
    }
    return arBuf.slice(start, end).string();
}

// server->client
hi5.A2UBin = function (arBuf, dv, item, endian) {
    var dataLen = item.datalen,
        dataType = item.datatype == undefined ? FT_STRING : item.datatype,
        byteOffset = item.offsetlen,
        encode = item.encoding;
    var endianness = endian === undefined && false || endian; // true is Little-endian
    var sign = 0;
    if (item.attr != undefined && item.attr == 1) sign = 1;

    //Indicates whether the 32-bit float is stored in little- or big-endian format. If false or undefined, a big-endian value is read.
    switch (dataType) { // unsigned char(8bit)
        case FT_BYTE:
            //return String.fromCharCode(dv.getUint8(byteOffset));
            return arBuf.slice(byteOffset, byteOffset + dataLen).string();
            break; // unsigned char(8bit)
        case FT_SHORT: // int16
            return dv.getInt16(byteOffset, endianness);
            break;
        case FT_USHORT: // unsigned int16
            return dv.getUint16(byteOffset, endianness);
            break;
        case FT_FILLER: // filler
            return "";
        case FT_LONG: // int32
        case FT_DAY: // 일자형
        case FT_TIME: // 시간형
            return dv.getInt32(byteOffset, endianness);
            break;
        case FT_ULONG: // unsigned int32
            return dv.getUint32(byteOffset, endianness);
            break;
        case FT_FLOAT: // float  (4 bytes)
            return dv.getFloat32(byteOffset, endianness);
            break;
        case FT_DOUBLE: // double (8 bytes)
        case FT_LONGLONG: // int64  (8 bytes)
            return dv.getFloat64(byteOffset, endianness);
            break;
        case FT_STRINGNUM: // 숫자형 문자열
            if (sign == 1)
                return arBuf.slice(byteOffset, byteOffset + dataLen).string();
            return arBuf.slice(byteOffset, byteOffset + dataLen).string().Ntrim();
            break;
        case FT_STRING: // 일반 텍스트(좌측정렬)
            if (sign == 1)
                return hi5.A2U(arBuf.slice(byteOffset, byteOffset + dataLen), encode);
            return hi5.A2U(arBuf.slice(byteOffset, byteOffset + dataLen), encode).Ntrim();
            break;
        default:
            break;
    }
    return "";
}
// client to server
hi5.U2ABin = function (val, item, endian) {
    var itemName = item.itemname,
        dataLen = item.datalen,
        dataType = item.datatype == undefined ? FT_STRING : item.datatype,
        uint8, arBuf = [],
        encode = item.encoding;;
    var endianness = endian === undefined && true || endian; // true is Little-endian

    switch (dataType) { // unsigned char(8bit)
        case FT_BYTE:
            uint8 = new Uint8Array(1);
            if (val.length > 0) uint8[0] = val.charCodeAt(0);
            arBuf = [].slice.call(uint8);
            break; // unsigned char(8bit)
        case FT_SHORT: // int16
            uint8 = new int16Array(1);

            break;
        case FT_USHORT: // unsigned int16
            uint8 = new Uint16Array(1);
            break;
        case FT_LONG: // int32
            //case FT_DATE:	                // 날자형
        case FT_DAY: // 일자형
        case FT_TIME: // 시간형
        case FT_FLOAT: // float  (4 bytes)
            uint8 = new int32Array(1);
            break;
        case FT_ULONG: // unsigned int32
            uint8 = new int32Array(1);
            break;
        case FT_DOUBLE: // double (8 bytes)
        case FT_LONGLONG: // int64  (8 bytes)
            break;
        case FT_STRING: // 일반 텍스트(좌측정렬)
            uint8 = hi5.U2A(val, encode);
            arBuf = hi5.RPADbuff([].slice.call(uint8), dataLen);
            break;
        case FT_STRINGNUM: // 숫자형 문자열(우측정렬) 변환작업 없음
            arBuf = hi5.RPADbuff(hi5.strToCharCodeArr(val), dataLen);
            break;
        case FT_FILLER: // filler
            for (var i = 0; i < dataLen; i++) {
                arBuf.push(0x20); // NULL
            }
            break;
        default:
            break;
    }
    return arBuf;
}

// Hex 표시기능( 디버그용)
var CHUNK_SIZE = 1024;
var curBuffer;
var startAt;

function intToHexString(i, digits) {
    function toHexDigit(x) {
        if (x < 10)
            return x;
        return String.fromCharCode('A'.charCodeAt(0) + x - 10);
    }

    var hexStr = "";
    while (i > 0) {
        hexStr = toHexDigit(i & 0xF) + hexStr;
        i = i >> 4;
    }
    var paddingLength = digits - hexStr.length;
    for (var x = 0; x < paddingLength; x++) {
        hexStr = "0" + hexStr;
    }
    return hexStr;
}

function charForInt(i) {
    if (i < 32 || i >= 0x7F) return ".";
    return String.fromCharCode(i);
}

// Convert a chunk of binary data from buffer with given offset to Hex string
function getHexChunk(buffer, startAt) {
    var chunkLength = Math.min(CHUNK_SIZE, buffer.byteLength - startAt)

    var uints = new Uint8Array(buffer, startAt, chunkLength);
    var rowString = "";
    for (var row = 0; row < uints.length; row += 16) {
        var remaining = uints.length - row;
        rowString += intToHexString(row + startAt, 8);
        rowString += "  ";
        for (var offset = 0; offset < 8; offset++) {
            if (offset < remaining) rowString += intToHexString(uints[row + offset], 2) + " ";
            else rowString += "   ";
        }

        rowString += " ";
        for (; offset < 16; offset++) {
            if (offset < remaining) rowString += intToHexString(uints[row + offset], 2) + " ";
            else rowString += "   ";
        }
        rowString += "  ";
        for (var offset = 0; offset < 8; offset++) {
            rowString += charForInt(uints[row + offset]);
        }
        for (; offset < 16; offset++) {
            rowString += charForInt(uints[row + offset]);
        }
        rowString += "\n";
    }
    return rowString;
}
//Converts from ANSI to UTF-8
//hi5.A2U = function (str) {

// return UTF8.encode(str);
//}
// HTScoin
var Base64 = {
    // 키
    _keyStr: "CD012EFGABHIJKLYZabcdefgopqrstuMNOPQRSTUVlmn678WXvwxyz345hijk9+/=",

    // 인코딩
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // 디코딩
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9+/=]/g, "");

        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        return output;
    }
}

/*
//인코드, 디코드 ex
function encodeDecodeData(obj) {
    var encodeStr = Base64.encode(obj);
    var uriEncode = encodeURIComponent(encodeStr);
    var uriDecode = decodeURIComponent(uriEncode);
    var decodeStr = Base64.decode(uriDecode)
    alert("encodeStr : " + encodeStr + ", uriEncoding : " + uriEncode + ",decodeURI : " + uriDecode + ", decodeStr : " + decodeStr);
}
*/


/// <member id="SetSharedMemory" kind="method">
/// <summary>SHARED MEMORY 정보 세팅</summary>
/// <remarks>공용 정보를 SHARED MEMORY에 저장을 하여 모든 곳에서 사용 가능</remarks>
/// <param name = "key" type="string"> key 명칭</param>
/// <param name = "value" type="string|array|object"> 공유메모리에 담을 정보</param>
/// <example><![CDATA[
///  // USER ID를 저장
///     var userid = 'abc123';
///     hi5.SetSharedMemory('@USER_ID', userid);
/// ]]></example>
/// </member>
hi5.SetSharedMemory = function (key, value) {
    if (g_objEncriptItem.indexOf(key) != -1) {
        if (value === "") {
            hi5.SHMEM[key] = "";
            return;
        }
        hi5.SHMEM[key] = Base64.encode(value);
        return;
    }
    hi5.SHMEM[key] = value;
}



/// <member id="GetSharedMemory" kind="method">
/// <summary>SHARED MEMORY 정보 취득</summary>
/// <remarks>원하는 공용 정보를 SHARED MEMORY에서 취득
/// 태그명에 <B>@</B>가 있는 시스템 공유메모리는 삭제안됨
/// </remarks>
/// <param name = "key" type="string"> key 명칭</param>
/// <param name = "option" type="boolean" default="false" > true 이면 메로리값을 헤제한다.</param>
/// <returns type="string|array|object"> 취득 정보(string or array or object 형태)</returns>
/// <example><![CDATA[
///  // USER ID를 저장
///     var userid = hi5.GetSharedMemory('@USER_ID');
///     cosnole.log(userid);    // userid = 'abc123';
/// ]]></example>
/// </member>
hi5.GetSharedMemory = function (key, option) {
    if (key == "@FID_LANG") // FID언어구분(5254FID)
    {
        value = local_lang == "ko" ? "1" : "2";
        // 1: 한글, 2: 영어
        return value;
    }

    var value = hi5.SHMEM[key];
    if (value == undefined) return "";
    if (option == true) {
        delete hi5.SHMEM.key;
    }
    if (value !== "" && g_objEncriptItem.indexOf(key) != -1) {
        value = Base64.decode(value);
    }

    return value;
}

//cookie 관련

/// <member id="SetCookie" kind="method">
/// <summary>쿠키 정보 저장하는 기능</summary>
/// <remarks> <![CDATA[
/// option 객체 상세 설명
/// <b>expires</b>
///      Type: number
///      쿠기만기일 지정 0 :브라우저 종료시 소멸, 미지정:만기일없음
/// <b>json</b>
///      Type: boolean
///      true : JSON 형식저장(입력값이 JSON객체 )
/// ]]></remarks>
/// <param name="key" type="string"> 쿠키 키값</param>
/// <param name="value" type="string|object"> 쿠키 정보</param>
/// <param name="option" type="object" option="true"> 옵션정보</param>
/// <example><![CDATA[
/// 예) 브라우저 종료시에 소멸되는 경우
/// hi5.SetCookie(key,value,{expires : 0 } );
///
/// 예) 만기일 미지정하는 경우
/// hi5.SetCookie(key,value  );
/// 예) JSON 형식으로 지정하는 경우
/// hi5.SetCookie("key",{"item":10, "ar":["a","b"]},{expires : 0 }  );
/// 취득하는 예제
/// var obj = hi5.GetCookie("key");
/// if ( !hi5.isEmpty(obj)){  // 빈 객체여부 판단
///     console.log(JSON.stringify(obj)) 로 데이터 확인
/// }
/// ]]></example>
/// <see cref="../Method/dispidGetCookie.htm">GetCookie 함수 참고</see>
/// <see cref="../Method/dispidDeleteCookie.htm">DeleteCookie 함수 참고</see>
/// <see cref="../Method/dispidisEmpty.htm">isEmpty 함수 참고</see>
/// </member>
hi5.SetCookie = function (key, value, config) {
    if (hi5.CheckCookie() == false) {
        alert($hi5_regional.cookie.alertMsg);
        return;
    }

    // 2^31 - 1 = 2147483647 = 2038-01-19 04:14:07
    // expires: 2147483647
    var expires = 365 * 10;
    $.cookie.raw = false, $.cookie.json = false;
    if (config != undefined) {
        if (config.json != undefined) $.cookie.json = config.json;
        if (config.raw != undefined) $.cookie.raw = config.raw;
        expires = config.expires === undefined ? 365 * 10 : config.expires;
    }

    // data 암호화
    if (g_objEncriptItem.indexOf(key) != -1) {
        if (value !== "")
            value = Base64.encode(value);
    }
    if ($.cookie.json == true) $.cookie.raw = true;


    var options = {
        //      path:'/',
        expires: expires
    }

    $.cookie(key, value, options);

}

/// <member id="GetCookie" kind="method">
/// <summary>쿠키 정보 취득하는 기능</summary>
/// <remarks> <![CDATA[
/// option 객체 상세 설명
/// <b>json</b>
///      Type: boolean
///      true : JSON 형식저장(입력값이 JSON객체 )
/// ]]></remarks>
/// <param name="key" type="string"> 쿠키 키값</param>
/// <param name="option" type="object" > 옵션정보</param>
/// <returns type="string|object"> 변환된 문자열 또는 객체</returns>
/// <example><![CDATA[
/// 예) 반환값이 문자열인경우
/// var value = hi5.GetCookie(key);
/// //값이 없으면 빈값으로 반환.
///
/// 예) 반환값이 객체인경우
/// var obj = hi5.GetCookie(key,{expires : 0 } );
/// if ( !hi5.isEmpty(obj)){  // 빈 객체여부 판단
///     console.log(JSON.stringify(obj)) 로 데이터 확인
/// }
/// ]]></example>
/// <see cref="../Method/dispidSetCookie.htm">SetCookie 함수 참고</see>
/// <see cref="../Method/dispidDeleteCookie.htm">DeleteCookie 함수 참고</see>
/// <see cref="../Method/dispidisEmpty.htm">isEmpty 함수 참고</see>
/// </member>
hi5.GetCookie = function (key, config) {
    if (hi5.CheckCookie() == false) {
        alert($hi5_regional.cookie.alertMsg);
        return "";
    }

    $.cookie.raw = false, $.cookie.json = false;
    if (config != undefined) {
        if (config.json != undefined) $.cookie.json = config.json;
        if (config.raw != undefined) $.cookie.raw = config.raw;
    }

    var value;
    value = $.cookie(key);
    if (value == undefined) {
        if ($.cookie.json) return {};
        return "";
    }
    // Data 복호화
    if (value !== "" && g_objEncriptItem.indexOf(key) != -1) {
        value = Base64.decode(value);
    }
    return value;
}

/// <member id="DeleteCookie" kind="method">
/// <summary>쿠키 정보 삭제하는 기능</summary>
/// <param name="key" type="string"> 쿠키 키값</param>
/// <example><![CDATA[
/// hi5.DeleteCookie(key);
/// //해당 키값의 쿠키를 삭제.
/// ]]></example>
/// </member>
hi5.DeleteCookie = function (key) {
    if (hi5.CheckCookie() == false) {
        alert($hi5_regional.cookie.alertMsg);
        return;
    }
    //$.removeCookie(key, {path:'/'} ); // => true
    $.removeCookie(key); // => true
}

hi5.CheckCookie = function () {
    return navigator.cookieEnabled;
}

// 쿠키 저장시에 아이디 값으로 키 이름을 만드는 함수
hi5.GetCookieKeyName = function (name) {
    var userid = hi5.GetSharedMemory("@USER_ID"); // 공유변수에서 취득
    if (userid === "") return "";

    // userid = Base64.encode(userid);
    var key = userid + "_" + name;
    return key;
}


/// <member id="SetStorage" kind="method">
/// <summary>Web Storage 에 데이터를 저장하는 함수</summary>
/// <remarks>Web Storage 에 시스템 정보 또는 사용자 정보 데이터를 저장하는 기능</remarks>
/// <param name = "key" type="string"> 키 문자열</param>
/// <param name = "value" type="string|object"> 문자열 또는 JSON객체 데이터미 미지정이면 해당 키 값을 지운다</param>
/// <returns type="string|boolean"> true : 저장성공, false : 저장실패</returns>
/// <example><![CDATA[
///   //예)key1 이름으로 { "a":1, "b":2} 객체 저장하는 예제
///   var bRet = hi5.SetStorage ( "key1", { "a":1, "b":2} );
/// ]]></example>
/// </member>
hi5.SetStorage = function (key, value) {
    return simpleStorage.set(key, value);
}


/// <member id="GetStorage" kind="method">
/// <summary>Web Storage에 저장된 데이터를 취득하는 함수</summary>
/// <remarks>Web Storage에 저장된 시스템 정보 또는 사용자 정보를 취득하는 기능</remarks>
/// <param name = "key" type="string"> 키값 문자열</param>
/// <returns type="string|object"> 키 값의 반환값 , 키 값이 미 존재하는경우undefined 반환 </returns>
/// <example><![CDATA[
///   //예)key1 이름으로 { "a":1, "b":2} 객체 저장하는 예제
///   var bRet = hi5.SetStorage ( "key1", { "a":1, "b":2} );
///   // 저장값을 취득하는 예제
///   var objData = hi5.SetStorage ( "key1");
/// ]]></example>
/// </member>
hi5.GetStorage = function (key) {
    return simpleStorage.get(key);
}


/// <member id="DeleteStorage" kind="method">
/// <summary>Web Storage에 저장된 데이터를 삭제하는 함수</summary>
/// <remarks>지정한 키 값에 해당하는 데이터를 삭제하는 기능</remarks>
/// <param name = "key" type="string"> 키 값의 문자열</param>
/// <returns type="string|boolean"> true : 저장성공, false : 저장실패</returns>
/// <example><![CDATA[
/// // key값을 삭제하는 예제
/// hi5.DeleteStorage( "key1");
/// ]]></example>
/// </member>
hi5.DeleteStorage = function (key) {
    return simpleStorage.deleteKey(key);
}


/// <member id="priceF" kind="method">
/// <summary>서버에서 넘어온 가격 데이터를 가공</summary>
/// <remarks>HTScoin에서 오는 가격 데이터에서 뒤에 8자리를 자른다.</remarks>
/// <param name = "code" type="string">가상화폐 코드</param>
/// <param name = "price" type="string">가격</param>
/// <param name = "comma" type="boolean">천단위 표시여부</param>
/// <returns type="string">가공된 가격 데이터</returns>
/// <example><![CDATA[
///     var price = "823000000000000";
///     var code = "1BTCKRWK";
///     var newprice = hi5.priceF(code, price);
///     // newprice == "8230000"
///     var newprice = hi5.priceF(code, price, true);
///     // newprice == "8,230,000"
/// ]]></example>
/// </member>
hi5.priceF = function (code, price, comma, pointzero) {
    if (price == undefined || price === "") return "";
    if (!code || code == "") {
        code = hi5.SHMEM.symbol.code;
    }
    var hogaunit = 0;
    if (g_masterInfo && code != "") {
        if (g_masterInfo[code]) {
            hogaunit = parseInt(g_masterInfo[code].prc_danwi);
        }
    }

    //if (!hogaunit || hogaunit == 0) {
    //    hogaunit = 8;   //기본값은 8자리
    //}
    if (price[0] == " ") {
        price = price.rtrim(price);
        if (price === "") return "";
    }

    var values = price.split(".");
    if (pointzero !== undefined) {
        var str = price;
        if (hogaunit > 0 && values.length > 0) {
            if (values[1]) {
                values[1] = values[1].substr(0, hogaunit).rtrim("0");

                if (values[1].length == 0)
                    str = (+(values[0])).toFixed();
                else
                    str = (+(values[0])).toFixed() + "." + values[1];
            }
        }

        if (comma) { //천단위 마스킹
            return putThousandsSeparators(str);
        }
        return str;
    }

    if (values == undefined || values.length == 1) {
        if (hogaunit > 0) { //2019.02.25 kws 소숫점 단위가 있어야하는 가격인데 정수형으로 들어온 경우.
            //console.log(hogaunit, price);
            price += "." + hi5.RPAD("", hogaunit, "0");
            if (comma) { //천단위 마스킹
                price = putThousandsSeparators(price);
            }
            return price;
        }
        //price = (parseInt(price)).toString();
        //if (price.length > hogaunit) {
        //    price = price.substring(0, price.length - hogaunit);
        //    return Number(price).toString();
        //}
        //else {
        //    price = "0." + hi5.LPAD(parseInt(values, 10).toString(), hogaunit, "0");
        //    //price = parseInt(values, 10).toString();  // 가격이 8자리 이내인경우 안됨
        //    //price = hi5.RPAD(parseInt(values, 10).toString(), hogaunit, "0");
        //}
    } else {
        if (hogaunit > 0) {
            values[0] = values[0] == "" ? "0" : values[0];
            //- 부호가 있는 경우 parseInt를 하면 부호가 사라지는 현상 때문에 앞에 - 부호를 다시 붙여준다...
            //- 부호는 가장 첫 인덱스에 붙어온다는 가정으로 0 비교처리함..
            // parseInt를 할때 -0인경우만 부호가 삭제된다.. 이때만 앞에 - 부호를 붙여주면된다
            // 혹시 데이터에 - 가 있는 경우가 있는지 확인 필요
            //if(values[0].indexOf("-") != -1)            //
            price = parseInt(values[0], 10).toString() + "." + values[1].substring(0, hogaunit);
            if (values[0].indexOf("-") == 0 && parseInt(values[0], 10) == 0) {
                price = "-" + price;
            }
            // var intval = values[0];
            // if (parseInt(values[0]) != 0)
            //     intval = parseInt(intval, 10).toString()

            // price = intval + "." + values[1].substring(0, hogaunit);
        } else {
            price = parseInt(values[0], 10).toString();
        }
    }

    //if (price.length > parseInt(hogaunit)) {
    //    price = price.substring(0, price.length - parseInt(hogaunit));
    //}

    if (comma) { //천단위 마스킹
        price = putThousandsSeparators(price);
    }
    return price;
}

/// <member id="setQtyF" kind="method">
/// <summary>서버에서 넘어온 수량 데이터를 가공</summary>
/// <remarks>HTScoin에서 오는 수량 데이터에서 뒤에서 8자리에 .을 붙여서 소숫점 형태로 만든다.</remarks>
/// <param name = "code" type="string">가상화폐 코드</param>
/// <param name = "qty" type="string">수량</param>
/// <param name = "option" type="object">기타정보</param>
/// <returns type="string">가공된 데이터</returns>
/// <example><![CDATA[
///     var qty = "17230000";
///     var code = "1BTCKRWK";
///     var newqty = hi5.setQtyF(code, qty);
///     // newqty == "0.17230000"
/// ]]></example>
/// </member>
//hi5.setQtyF = function (code, qty, option) {
//    if (qty  == undefined || qty == "") return "";
//    var qtyunit = 0;
//    //if (g_masterInfo && code != "") {
//    //    if (g_masterInfo[code]) {
//    //        qtyunit = g_masterInfo[code].qtyunit;
//    //    }
//    //}
//
//    if (qtyunit == 0) {
//        qtyunit = 8;   //기본값은 8자리
//    }
//
//    if (qty[0] == " ") {
//        qty = qty.rtrim(qty); if (qty  === "") return "";
//    }
//
//    var values = qty.split(".");
//    if (values == undefined || values.length == 1) {   // .이 없는경우
//        if (qty.length < qtyunit + 1) {
//            if (option && option.type == "Int" && qty != "0") {
//                return (qty/100000000).toFixed(8);
//            }
//            //var d = hi5.LPAD(qty, qtyunit, "0");
//            //qty = "0." + d;
//            var d = hi5.RPAD("0", qtyunit, "0");
//            qty = qty + "." + d;
//        }
//        else {
//            var d = qty.substring(0, qty.length - qtyunit);
//            var e = qty.substring(qty.length - qtyunit, qty.length);
//            qty = parseInt(d,10) + "." + e;
//        }
//    }
//    else
//    {
//        values[0] = values[0] == "" ? "0" : values[0];
//        values[1] = hi5.RPAD(values[1], qtyunit, "0");
//        return parseInt(values[0], 10) + "." + values[1];
//    }
//    return qty;
//}
hi5.setQtyF = function (code, qty, int, comma) {
    if (qty == undefined || qty == "") return "";

    var qtyunit = 0;
    if (g_masterInfo) {
        if (code == "") {
            code = hi5.SHMEM.symbol.code;
        }
        if (g_masterInfo[code]) {
            qtyunit = g_masterInfo[code].qty_danwi;
        }
    }

    if (qty[0] == " ") {
        qty = qty.rtrim(qty);
        if (qty === "") return "";
    }

    if (typeof (qty) == "number")
        qty = qty.toString();

    var values = qty.split(".");
    if (values == undefined || values.length == 1) { // .이 없는경우
        if (int) {
            if (qty.length < parseInt(qtyunit) + 1) {
                var d = hi5.LPAD(qty, parseInt(qtyunit), "0");
                qty = "0." + d;
            } else {
                var d = qty.substring(0, qty.length - parseInt(qtyunit));
                var e = qty.substring(qty.length - parseInt(qtyunit), qty.length);

                qty = parseInt(d, 10) + "." + e;
            }
        } else {
            if (qtyunit > 0) {
                qty = values[0] + "." + hi5.RPAD("0", qtyunit, "0");
            } else {
                qty = (parseInt(values[0])).toString();
            }
        }
        //if (qty.length < parseInt(qtyunit) + 1) {
        //    var d = hi5.LPAD(qty, parseInt(qtyunit), "0");
        //    qty = "0." + d;
        //}
        //else {
        //    var d = qty.substring(0, qty.length - parseInt(qtyunit));
        //    var e = qty.substring(qty.length - parseInt(qtyunit), qty.length);
        //
        //    qty = parseInt(d,10) + "." + e;
        //}
    } else {
        var sign = "";
        values[0] = values[0] == "" ? "0" : values[0];
        if (values[0].length == 1 && values[0] == "-") {
            values[0] = "0";
            sign = "-";
        }

        //if(isNaN(parseInt(values[0]))) values[0] = "0";

        if (qtyunit > 0) {
            values[1] = hi5.RPAD(values[1], qtyunit, "0");
            qty = parseInt(values[0]) + "." + values[1];
        } else {
            qty = (parseInt(values[0])).toString();
        }

        qty = sign + qty;
        //return parseInt(values[0], 10) + "." + values[1];
    }
    if (comma) { //천단위 마스킹
        qty = putThousandsSeparators(qty);
    }
    return qty;
}

// HTSCoin사용
hi5.GetMediaInfo = function () {
    var user = detect.parse(navigator.userAgent);

    var osinfo = user.os.family || user.os.name;
    var browserinfo = user.browser.name;
    var versioninfo = "v1.0.0";

    return {
        osinfo: osinfo,
        browserinfo: browserinfo,
        versioninfo: versioninfo
    };
}

hi5.GetMobile_info = function () {
    if (hi5.WTS_MODE == WTS_TYPE.MTS) {
        var mobile = 'A'
        if (navigator.userAgent.match(/iPhone/i)) {
            mobile = 'I'
        }
        return mobile;
    } else {
        return false;
    }
}

//현재가(4),전일대비(5),전일대비부호(6),등락률(7),거래량(11)
if (!String.prototype.codeMaster) {
    String.prototype.hi5CodeMaster = function (key) {
        if (this === "") return "";
        var val = "";
        if (g_masterInfo[this] != undefined && g_masterInfo[this][key] != undefined) {
            val = g_masterInfo[this][key];
            val = hi5.priceF(this, val);
        }
        return val;
    };
}

if (!String.prototype.orderQty) {
    String.prototype.orderQty = function () {
        var price = this;
        var p = price.split(".");
        var decimal;
        if (p[1]) {
            decimal = hi5.RPAD(p[1], 8, "0");
        } else
            decimal = "00000000";

        price = p[0] + decimal;
        price = hi5.LPAD(price, 20, "0");
        return price;
    };
}

if (!String.prototype.orderPrice) {
    String.prototype.orderPrice = function () {
        var price = this;
        var p = price.split(".");
        var decimal;
        if (p[1]) {
            decimal = hi5.RPAD(p[1], 8, "0");
        } else
            decimal = "00000000";

        price = p[0] + decimal;
        price = hi5.LPAD(price, 20, "0");
        return price;

        // 9007199254740991
        // 19자리 = "000"+ 가격+"00000000"
        //return hi5.sprintf("%011d00000000", Number(this));
    };
}

if (!String.prototype.strToNum) {
    String.prototype.strToNum = function (len) {
        var s = this,
            fmt;
        if (this == undefined || this.length == 0) s = "0";
        s = s.removeAll("."), fmt = "%0" + len + "d";

        return hi5.sprintf(fmt, Number(s));
    };
}

// hi5cb Object = cachebuster 관리
var hi5cb = {};
hi5cb.getCacheBuster = function (option) {
    var cachebuster;
    if (option.data == "data") {
        try {
            cachebuster = _CACHE_BUSTER_DATA;
        } catch (e) {
            cachebuster = hi5cb.getDayCacheBuster();
        }
        return {
            cb: cachebuster
        };
    } else if (option.data == "jsapp") {
        try {
            cachebuster = _CACHE_BUSTER_JSAPP;
        } catch (e) {
            cachebuster = hi5cb.getDayCacheBuster();
        }
        return {
            cb: "cb=" + cachebuster
        };
    } else if (option.data == "control") {
        try {
            cachebuster = _CACHE_BUSTER_CONTROL;
        } catch (e) {
            cachebuster = hi5cb.getDayCacheBuster();
        }
        return "cb=" + cachebuster;
    } else if (option.data == "js") {
        try {
            cachebuster = _CACHE_BUSTER_APP;
        } catch (e) {
            cachebuster = hi5cb.getDayCacheBuster();
        }
        return {
            cb: "cb=" + cachebuster
        };
    } else if (option.data == "map") {
        if (g_hi5ScreenVersion) {
            if (g_hi5ScreenVersion[option.mapfile]) {
                cachebuster = g_hi5ScreenVersion[option.mapfile].cb ? g_hi5ScreenVersion[option.mapfile].cb : g_hi5ScreenVersion[option.mapfile];
            } else {
                cachebuster = hi5cb.getDayCacheBuster(); // 서버정보로 부터 비교처리
            }
        } else
            cachebuster = hi5cb.getDayCacheBuster(); // 서버정보로 부터 비교처리

        return {
            cb: "?cb=" + cachebuster
        };
    }
};

hi5cb.getDayCacheBuster = function () {
    function cb(date) {
        var month = date.getMonth();
        month = month + 1; //javascript date goes from 0 to 11
        if (month < 10) month = "0" + month; //adding the prefix
        var year = date.getFullYear();
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        minutes = minutes - (minutes % 30); // 30분 단위
        var seconds = date.getSeconds();
        seconds = seconds - (seconds % 1); // 1초 단위
        return [year, month, day, hour, minutes, seconds].join("");
        //return [year, month, day, hour, minutes].join("");
    }
    return cb(new Date());
    /*
        var cachebuster, dateObj;
        dateObj = new Date();
        cachebuster = dateObj.getFullYear().toString() + (dateObj.getMonth() + 1).toString() + dateObj.getDate().toString() + dateObj.getTime().toString();
        return cachebuster;
    */
}

/// <member id="requireJS" kind="method">
/// <summary>화면에서 js 파일을 동적으로 로드하는 함수</summary>
/// <remarks> <![CDATA[
/// require를 이용한 js 파일을 동적으로 로드하는 함수
/// 구문 : hi5.requireJS ( ["jsapp/xxx", function() {
///                          // 로드후, 초기화 처리
///                                      }, {cb:"cachebuster값지정"});
/// option 객체 상세 설명
/// <b>data</b>
///      type: string
///      js 파일의 종류 지정 ( jsapp: 화면확장js파일, "js": 외부lib 파일)
/// ]]></remarks>
/// <param name = "deps" type="array"> 키 이름으로 지정 </param>
/// <param name = "callback" type="object"> callback 함수명(필수지정)</param>
/// <param name = "option" type="object" }"> cachebuster값 지정 { cb: "값지정"}</param>
/// <example><![CDATA[
///  1) 실시잔 잔고화면에서 잔고처리js 파일 동적로딩하는 예
///  var self = this;  // form 객체 재 정의
///  var deps = ['coinbalance'];  // jsapp/coinbalance.js 파일 로딩
///  hi5.requireJS(deps, function (Balance) {
///       // jsapp/coinbalance.js 파일 로딩후, 처리
///       objBalance = new Balance;
///       objBalance.form = self;
///       objBalance.grid = self.GetControl("grd_gango");
///       form.RealSB({}, true); // 주문체결 실시간 등록
///       btn_rq.OnClick();       // 조회처리 호출
///  });
///
///  2) 실시잔 잔고화면에서 잔고처리js 파일 동적로딩하는 (option정보 미지정하는 경우)
///  var self = this;  // form 객체 재 정의
///  var deps = ['coinbalance'];  // jsapp/coinbalance.js 파일 로딩
///  hi5.requireJS(deps, function (Balance) {
///       // jsapp/coinbalance.js 파일 로딩후, 처리
///       objBalance = new Balance;
///       objBalance.form = self;
///       objBalance.grid = self.GetControl("grd_gango");
///       form.RealSB({}, true); // 주문체결 실시간 등록
///       btn_rq.OnClick();       // 조회처리 호출
///  });
///  1),2) 결과는 동일 (2)예 사용
///
/// 3) js 파일명을 직접지정하는 경우
///  var self = this;
///  var deps = ['jsapp/coinbalance.js '];  // jsapp/coinbalance.js 파일 로딩
///  hi5.requireJS(deps, function (Balance) {
///       // jsapp/coinbalance.js 파일 로딩후, 처리
///       objBalance = new Balance;
///       objBalance.form = self;
///       objBalance.grid = self.GetControl("grd_gango");
///       form.RealSB({}, true); // 주문체결 실시간 등록
///       btn_rq.OnClick();       // 조회처리 호출
///  }, {cb:"cachebutster값지정"});
///
///
/// ]]></example>
/// </member>

hi5.requireJS = function (deps, callback, option) {
    deps = hi5.isArray(deps) ? deps : deps.split();
    var paths = {},
        urlArgs;
    if (option != undefined && option.cb) {
        urlArgs = "cb=" + option.cb;
    }

    var cbfn = function (id, url) {
        var that = this;
        if (url.indexOf('@') >= 0) return "";
        var cb = hi5_hash.cb({
            key: id,
            url: url
        });
        //if (  hi5_dev_mode == "dev")
        //     console.log('<<<<<<<<<<<<<<<  hi5.requireJS urlArgs cb=[' + cb + '] + id=[' + id + '] url=[' + url + ']');
        return cb;
    }

    var cfg = {
        waitSeconds: 0,
        baseUrl: window.hi5_baseURL,
    };

    if (!urlArgs) {
        paths = hi5_hash.paths({
            require: true,
            key: deps
        });
        cfg["paths"] = paths;
    }
    cfg["urlArgs"] = (urlArgs == undefined) ? cbfn : urlArgs;

    var regJS = require.config(cfg);
    regJS(deps, callback);
    /*
    var cfg = {
        waitSeconds: 0,
        baseUrl: window.hi5_baseURL,
        hi5_Model: option,

        urlArgs: function (id, url) {
            var that = this;
            if (url.indexOf('@') >= 0) return "";
            if (that.hi5_Model && that.hi5_Model.key) {

                cbs = hi5_hash.cb({ key: id, url: url });
                console.log('<<<<<<<<<<<<<<<  hi5.requireJS urlArgs cb=[' + cbs + '] + id=[' + id + '] url=[' + url + ']');
            } else {
                var cbs = hi5.isObject(cb) ? cb.cb.toString() : cb.toString();
                cbs = (cbs.indexOf('?') === -1 ? '?cb=' + cbs : '');
                console.log('<<<<<<<<<<<<<<<  hi5.requireJS urlArgs cb=[' + cbs + '] + id=[' + id + '] url=[' + url + ']');
            }
            return cbs;
        },
        //urlArgs: hi5.isObject(cb)? cb.cb.toString(): cb.toString()
    };


    if (option != undefined) {
        if (option.key) {
            paths = hi5_hash.paths({ require: true, key: deps });
            cfg["paths"] = paths;
        } else {
            cb = hi5cb.getCacheBuster(option);
        }
    } else {
        cb = hi5cb.getCacheBuster({ data:"jsapp"})
    }


    var regJS = require.config( cfg );
    regJS(deps, callback);
    */
}

/// <member id="SetWaitCursor" kind="method">
/// <summary>공통 Wait처리 기능</summary>
/// <remarks><![CDATA[
///  조회요청시에 조회처리를 지정한 시간동안 재 조회를 막는 기능
///  기본값은 1초
///  option 인자 상세설명:
///  <b> wait</b>
///     type: number
///    1: 조회요청의미 2:통신응답의미 3:타이머 발생의미 1,3 인경우 arctl =[]로 컨크롤명 지정
///  <b> form</b>
///     type: object
///     form 컨트롤 지정
///  <b> timerid</b>
///     type: number
///     타이머 아이디값( 필수지정)
///  <b> timesec</b>
///     type: number
///     타이머 초( 미 지정한 경우 1초 처리)
/// ]]></remarks>
/// <param name = "option" type="object"> 옵션정보 {wait:제어값, form:form컨트롤, timerid: 타이머id  }</param>
/// <param name = "arctl" type="array"> 제어할 컨트롤명 배열 option.wait = 1, 3 인경우만 유효</param>
/// <returns type="string|number|object|array|boolean"> 반환값 정보기숳</returns>
/// <example><![CDATA[
///            이부분에 예제내용 기술한다...
/// ]]></example>
/// </member>
hi5.SetWaitCursor = function (option, arctl) {
    if (option.form == undefined) return;

    var i, len = arctl != undefined ? arctl.length : 0,
        timesec, ctlObj, id, form = option.form;
    if (option.wait == 1) {
        for (i = 0; i < len; i++) {
            id = arctl[i];
            if (!idpattern.test(id)) id = "{{id.}}" + id;
            id = x2h.getUniqID(id, form);
            ctlObj = form.GetObjData(id);
            if (ctlObj.SetProp) ctlObj.SetProp("disabled", true);
        }
        timesec = option.timesec == undefined ? 1000 : option.timesec;
        form.SetTimer(option.timerid, 1, timesec);
        form.SetProp("waiting", "1");
    } else if (option.wait == 2) {
        form.SetProp("waiting", "2");
    } else if (option.wait == 3) {
        var wait = form.GetProp("waiting");
        if (wait == "2") {
            form.SetTimer(option.timerid, 0);
            for (i = 0; i < len; i++) {
                id = arctl[i];
                if (!idpattern.test(id)) id = "{{id.}}" + id;
                id = x2h.getUniqID(id, form);
                ctlObj = form.GetObjData(id);
                if (ctlObj.SetProp) ctlObj.SetProp("disabled", false);
            }
        }
    }
}


/// <member id="appendBuffers" kind="method">
/// <summary>Buffer 혹은 ArrayBuffer끼리 합치는 메소드</summary>
/// <remarks>buffer1 과 buffer2가 array 혹은 arraybuffer 타입일 때 두 개의 인자를 합쳐서 arraybuffer형태로 리턴</remarks>
/// <param name="buffer1" type="array"> 첫번째 arraybuffer 혹은 array</param>
/// <param name="buffer2" type="array"> 두번째 arraybuffer 혹은 array</param>
/// <returns type="arraybuffer">합쳐진 arraybuffer</returns>
/// <example><![CDATA[
///            var arraybuffer = hi5.appendBuffers(buffer1, buffer2);
/// ]]></example>
/// </member>
hi5.appendBuffers = function (a, b, type) {
    if (!hi5.isArrayBuffer(a)) {
        a = a.buffer;
    }

    if (!hi5.isArrayBuffer(b)) {
        b = b.buffer;
    }
    if (b instanceof Int8Array || type) {
        var c = new Int8Array(a.byteLength + b.byteLength);
        c.set(new Int8Array(a), 0);
        c.set(new Int8Array(b), a.byteLength);
    } else {
        var c = new Uint8Array(a.byteLength + b.byteLength);
        c.set(new Uint8Array(a), 0);
        c.set(new Uint8Array(b), a.byteLength);
    }
    return c.buffer;
}

hi5.logTrace = function (option) {
    //20190927 lee nohan 체결통보 실시간은 debuglevel과 상관없이 무조건 찍도록 type 10번으로 새로 반영한다.
    if (!hi5_DebugLevel && option.type != 10) return;

    // 2019.11.29 kws
    // 운영에서 로그 찍기 위한 조건을 추가한다.
    if (hi5_svrmode == "real" && option.type == 10) {
        if (!hi5_DebugLevel) return;
    }
    var value, text = "";
    if (option.type == 1 && option.tr_tp) { // 통신로그 작성
        switch (option.tr_tp) {
            case TR_TP.INIT: // MCI INIT
            case TR_TP.REQUEST: // 요청전문
                if (!hi5_DebugLevel.RQ) return;
                text = "RQ";
                break;
            case TR_TP.REPLY: // 응답전문
                if (!hi5_DebugLevel.RP) return;
                text = "RP";
                break;
            case TR_TP.PB: // 시세정보 PUSH
                if (!hi5_DebugLevel.PB) return;
                text = "PB";
                break;
            case TR_TP.SB: // 자동갱신 등록
                if (!hi5_DebugLevel.SB) return;
                text = "SB";
                break;
            case TR_TP.SBC: // 자동해제 등록
                if (!hi5_DebugLevel.SBC) return;
                text = "SBC";
                break;
            default:
                return;
                break;
        }
        if (option.dataType == undefined) {
            CHUNK_SIZE = option.data.byteLength;
            curBuffer = option.data;
            startAt = 0;
            value = getHexChunk(curBuffer, startAt);
        } else if (option.dataType == "JSON") {
            value = JSON.parse(JSON.stringify(option.data));
        }

        // console.log( text + "Start ==========> " + option.message + "<============");
        // console.log(value);
        // console.log( text + "End ==========> " + option.message + "<============");
        console.log(text + " ==> " + option.message + "<==", value);
    }
    //20190927 lee nohan 체결통보 실시간은 debuglevel과 상관없이 무조건 찍도록 type 10번으로 새로 반영한다.
    else if (option.type == 10) {
        value = JSON.parse(JSON.stringify(option.data));
        // console.log("UM ==========>Start " + option.message + "<============");
        // console.log(value);
        // console.log("UM  ==========>End " + option.message + "<============");
        console.log("UM  ==> " + option.message + "<==", value);
    } else if (hi5_DebugLevel.UM) {
        if (option.type == 3) {
            if (!hi5_DebugLevel.JSON) return;
            if (hi5_DebugLevel.pbKey.type && hi5_DebugLevel.pbKey.type != option.data.realType) return;
            if (hi5_DebugLevel.pbKey.key && hi5_DebugLevel.pbKey.key != option.data.key) return;
        } else if (option.type == 4) {
            console.log(option.message, JSON.parse(JSON.stringify(option.data)));
            return;
        }
        value = JSON.parse(JSON.stringify(option.data));
        // console.log("UM ==========>Start " + option.message + "<============");
        // console.log(value);
        // console.log("UM  ==========>End " + option.message + "<============");
        console.log("UM  ==> " + option.message + "<==", value);
    }
}

/// <member id="zeroTrim" kind="method">
/// <summary>공통 0 Trim 기능</summary>
/// <remarks><![CDATA[
///  서비스에서 가격조회시 자릿수에 맞춰 0이 채워져 내려오는 경우, 앞에 0제거해주는 함수
/// ]]></remarks>
/// <param name = "value" type="string"> 변환할 값 </param>
/// <returns type="string"> 반환값 정보기술 </returns>
/// <example><![CDATA[
///            이부분에 예제내용 기술한다...
/// ]]></example>
/// </member>
hi5.zeroTrim = function (value) {
    if (!value) return "";

    if (typeof (value) == "number") {
        value = value.toString();
    }

    var tempVal = value.split(".");

    if (tempVal == undefined || tempVal.length == 1) // .이 없는경우
        return parseInt(tempVal).toString();
    else {
        tempVal[0] = tempVal[0] == "" ? "0" : tempVal[0];
        return parseInt(tempVal[0]) + "." + tempVal[1];
    }
}

/// <member id="floatToInt" kind="method">
/// <summary>실수형을 정수형으로 변환하는 기능</summary>
/// <remarks>소수점 자리수가 동일</remarks>
/// <param name = "value" type="string|number"> 입력값</param>
/// <returns type="number"> 정수형 값</returns>
/// </member>
hi5.floatToInt = function (value) {
    if (!value) return 0;
    var values = value.split(".");
    if (values.length == 2) {
        return parseInt(value.removeAll("."));
    } else if (values.length == 1) {
        return parseInt(value);
    }
    return 0;
}

hi5.traceTitle = function (obj) {
    function niceBytes(x) {
        var l = 0,
            n = parseInt(x, 10) || 0;
        while (n >= 1024 && ++l)
            n = n / 1024;
        return (n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
    };
    if (!obj) return;

    if (hi5_DebugLevel && obj.QUEUE) {
        if (obj.QUEUE.GET) {
            g_queueCount.GET = obj.QUEUE.GET;
        }

        if (obj.QUEUE.PUT) {
            g_queueCount.PUT = obj.QUEUE.PUT;
        }

        if (obj.QUEUE.SECCNT) {
            g_queueCount.SECCNT = obj.QUEUE.SECCNT;
        }

        var titleText = "";
        if (hi5_DebugLevel.QUEUE) {
            if (hi5_DebugLevel.QUEUE.GET) {
                titleText += " GET:" + g_queueCount.GET.toString();
            }
            if (hi5_DebugLevel.QUEUE.PUT) {
                titleText += " PUT:" + g_queueCount.PUT.toString();
            }
            if (hi5_DebugLevel.QUEUE.SECCNT) {
                var units = ['byte', 'KB', 'MB', 'GB', 'TB'];
                titleText += " " + g_queueCount.SECCNT.cnt.toString() + "건/sec " + niceBytes(g_queueCount.SECCNT.size);
            }

            if (titleText.length > 0) {
                //titleText = "QUEUE - " + titleText;
                if (document.title != titleText) {
                    document.title = titleText;
                }
            }
        }
    }
}

/// <member id="noLoginScreen" kind="method">
/// <summary>로그인이 안되어있을 시 해당 영역 disable 및 로그인/회원가입 표시</summary>
/// <remarks>해당영역을 disable 시킴</remarks>
/// <param name = "id" type="string">영역 id</param>
/// <param name = "bText" type="boolean">텍스트 표시 여부</param>
/// </member>
hi5.noLoginScreen = function (id, bText) {
    var gbTag = document.getElementById(id);
    if (!gbTag) {
        return;
    }

    var divTag = document.createElement('div');
    divTag.className = "hi5_nologin";
    gbTag.appendChild(divTag);

    if (bText) {

        var textTag = document.createElement('div');
        textTag.className = "hi5_nologin_text";
        var text = $hi5_regional.text.needLogin;
        textTag.innerHTML = text;
        divTag.appendChild(textTag);
        var linkTag = document.createElement('div');
        linkTag.className = "hi5_nologin_btn";
        divTag.appendChild(linkTag);

        var regText = $hi5_regional.text.register;
        var loginText = $hi5_regional.text.login;
        var regButton = "<button href='#' class = 'noLoginbtn rslbtn signbtn'>" + regText + "</button>";
        var loginButton = "<button href='#' class = 'noLoginbtn rslbtn loginbtn'>" + loginText + "</button>";


        linkTag.innerHTML = regButton + loginButton;
        $('.noLoginbtn.signbtn').off("click");
        $('.noLoginbtn.signbtn').click(function () {
            hi5.changeURL({
                page: 'register'
            });
        });
        $('.noLoginbtn.loginbtn').off("click");
        $('.noLoginbtn.loginbtn').click(function () {
            hi5.changeURL({
                page: 'login'
            });
        });
    }
}


/// <member id="getConvertPrice" kind="method">
/// <summary>환산가격을 취득하는 함수</summary>
/// <remarks><![CDATA[
///  멀티마켓 시장에서 기초자산 가격으로 환산 가격을 계산해서 처리하는 기능
///  - 입력option 객체설명:
///  <b> symbol</b>
///     type: string
///     코인코드명 지정
///  <b> price</b>
///     type: string
///     코인시장 가격
///  <b> baseprice</b>
///     type: string
///     기준시장 코인의 가격
///  <b>s_cp</b>
///     type: string
///     서버에서 �����신한 환산가격 데이터
///
/// ]]></remarks>
/// <returns type="string"> 반환값 객체</returns>
/// <example><![CDATA[
///      // BTC 시장에서 ETH인 경우
///     var price = hi5.getConvertPrice ( { symbol :"ETH/BTC", price:"12345" , baseprice : "124545"});
///     alert(price);
///
/// ]]></example>
/// </member>
hi5.getConvertPrice = function (option) {
    // 마켓시장을 취득한다.
    var bcc = hi5.GetCodeInfo(option.symbol, {
            itemname: "base_currency_co"
        }),
        cp = 0,
        format, nofixformat, nofixformat2;
    if (bcc == "") return "";

    format = {
        comma: 1,
        decimal: 1,
        decnum: 2,
        grid: {
            pointdel: false
        }, // 소수점이하 처리안함(US 시장인경우 소수점 2자리로 변경가능)
        prefix: "≈ ", // 앞첨자
        sufix: " " + hi5_baseCurr // 뒤첨자
    };

    nofixformat = {
        comma: 1,
        decimal: 1,
        decnum: 2,
        prefix: "＄ ",
        grid: {
            pointdel: false
        }, // 소수점이하 처리안함(US 시장인경우 소수점 2자리로 변경가능)
    };

    nofixformat2 = {
        comma: 1,
        decimal: 1,
        decnum: 2,
        prefix: "≈ ＄ ",
        grid: {
            pointdel: false
        }, // 소수점이하 처리안함(US 시장인경우 소수점 2자리로 변경가능)
    };

    // 2019.08.30 kws 통화 설정 값을 취득한다.
    var currency = hi5.SHMEM.user_setting.general.currency || "USD";
    var currrate = "1";
    if (hi5.SHMEM.currencyObj[currency]) {
        currrate = parseFloat(hi5.SHMEM.currencyObj[currency].curr);
        nofixformat.prefix = hi5.SHMEM.currencyObj[currency].symbol + " ";
        nofixformat2.prefix = "≈ " + hi5.SHMEM.currencyObj[currency].symbol + " ";
    }

    // 2019.08.30 kws
    // USDT 코인이나 선물종목은 기본이 USD다. 고로 환율만 곱해서 처리하면 된다.
    if (bcc == "USDT" || bcc == "FUT" || bcc == "INS") {
        cp = option.price * currrate;
        if (option.mask == "3") {
            nofixformat2.decnum = 2;
            return cp = maskstr.GetNumberFormat(nofixformat2, cp.toString());
        } else if (option.mask == "2") {
            nofixformat.decnum = 2;
            return cp = maskstr.GetNumberFormat(nofixformat, cp.toString());
        } else {
            format = {
                gubun: 1,
                comma: 1,
                decimal: 1,
                decnum: 2,
                prefix: "≈ ",
                sufix: " USD"
            };
            return cp = maskstr.GetNumberFormat(format, cp.toString());
        }
    } else { // 그 외에 조건에서는 기초자산 현재가를 취득한다. 그 후에 환율 곱한다.
        //기초자산현재가가 비어있는 경우, 메모리에서 값을 취득한다.
        if (!option.baseprice || option.baseprice == "") {
            option.baseprice = "1";
            var baseCode = hi5.GetCodeInfo(option.symbol, {
                itemname: "base_coincode"
            });
            if (g_masterInfo[baseCode]) {
                //option.baseprice = hi5.priceF(option.symbol, g_masterInfo[baseCode]["price"]);    // 결함번호 1100 왜 호가단위로 소수점 처리를 하고 있지....
                if (g_masterInfo[baseCode]["price"])
                    option.baseprice = g_masterInfo[baseCode]["price"];
            };
        }
        // USD 환산가격(BTC 기준가격 x BTC/USDT 현재가)
        cp = parseFloat(option.price) * parseFloat(option.baseprice) * currrate;

        // --> [Edit] 수정자:kim changa 일시:2019/12/19
        // 수정내용> 결함번호 1110 정수가 0일 때 소수점 6자리까지 일괄표시
        if (cp < 1.0) {
            return nofixformat.prefix + cp.toFixed(6);
        }
        // <-- [Edit] kim changa 2019/12/19

        //option mask 값이 1 이면 마스킹 없이 그냥 숫자(String Type)만 넘겨준다
        if (option.mask == "1")
            return cp.toFixed(8);
        //option mask 값이 2 이면 prefix, sufix 가 없는 마스킹 형태로 넘겨준다
        else if (option.mask == "2")
            return cp = maskstr.GetNumberFormat(nofixformat, cp.toString());
        else if (option.mask == "3")
            return cp = maskstr.GetNumberFormat(nofixformat2, cp.toString());
        else
            return cp = maskstr.GetNumberFormat(format, cp.toString());
    }
    // 2019.08.30 kws 이후 처리는 막아놓는다.
    /*
        // --> [Edit] 2019.08.16 kws
        // hi5_baseCurr 기준으로 비교하여 처리
        if (bcc == hi5_baseCurr || bcc == "USDT") {  // USD로 환산처리
            if(bcc == "USDT") bcc = "USD";
            if (!hi5.SHMEM.currencyObj[bcc].curr) return "";
            cp = option.price / hi5.SHMEM.currencyObj[bcc].curr;
            //cp = '≈ ' + maskstr.GetMaskValue({ gubun: 1, comma: 1, decimal: 1, decnum: 3 }, cp) + " USD";
            if (option.mask == "2"){
                nofixformat.decnum = 3;
                cp = parseFloat(cp) * currrate; // 2019.08.30 kws 통화 환율 처리
                return cp = maskstr.GetNumberFormat(nofixformat, cp.toString());
            }else{
                format = { gubun: 1, comma: 1, decimal: 1, decnum: 3,prefix: "≈ ", sufix: " USD"};
                return cp = maskstr.GetNumberFormat(format, cp.toString());
            }
            //return cp;
        }

        //if (g_hi5_config.currency_market == "USD") g_hi5_config.currency_market = "KRW";
        if (g_hi5_config.currency_market == undefined || g_hi5_config.currency_market == "USD") {
            if (g_hi5_config.currency_market == undefined)
                g_hi5_config.currency_market = "USD";

            if (g_hi5_config.currency_market == bcc) {
                return "";
            }
            //if (bcc == 'FUT') return "";
            if (bcc == "USDT") {
                cp = option.price * hi5.SHMEM.currencylist[2].curr;
                //cp = '≈ ' + maskstr.GetMaskValue({ gubun: 1, comma: 1, decimal: 1 }, cp) + " KRW";
                if (option.mask == "2"){
                    nofixformat = { gubun: 1, comma: 1, decimal: 1 , prefix: "￦ "};
                    return cp = maskstr.GetNumberFormat(nofixformat, cp.toString());
                }else{
                    format = { gubun: 1, comma: 1, decimal: 1,prefix: "≈ ", sufix: " KRW"};
                    return cp = maskstr.GetNumberFormat(format, cp.toString());

                }
                return cp;
            }
            if (option.s_cp) {  // 서버에서 내려준 환산가격 데이터인 경우
                cp = option.s_cp != "" ? parseFloat(option.s_cp) : 0;
            } else {            // 단말계산용 환산가격
                //기초자산현재가가 비어있는 경우, 메모리에서 값을 취득한다.
                if (!option.baseprice || option.baseprice == "") {
                    var baseCode = hi5.GetCodeInfo(option.symbol, { itemname: "base_coincode" });
                    if(!g_masterInfo[baseCode]) return "";
                    option.baseprice = hi5.priceF(option.symbol, g_masterInfo[baseCode]["price"]);
                }
                // KRW 환산가격(BTC 기준가격 x BTC/KRW 현재가)
                cp = (parseFloat(option.price) * parseFloat(option.baseprice));
            }
            if (cp <= 0) return "";

            // 100 이하이면 소수점 2자리까지 표시
            //if (cp < 100) {
            //    format.grid.pointdel = false;
            //   format.decimal = 1;
            //   format.decnum  = 2;  // 소수점이하 2자리까지만 표시
            //}

            //option mask 값이 1 이면 마스킹 없이 그냥 숫자(String Type)만 넘겨준다
            if (option.mask == "1")
                return cp.toFixed(8);
                //option mask 값이 2 이면 prefix, sufix 가 없는 마스킹 형태로 넘겨준다
            else if (option.mask == "2")
                return cp = maskstr.GetNumberFormat(nofixformat, cp.toString());
            else
                return cp = maskstr.GetNumberFormat(format, cp.toString());
        }
        else return "";*/
}


/// <member id="getMarketList" kind="method">
/// <summary>거래 시장 리스트를 반환한다.</summary>
/// <remarks>거래 가능 시장 리스트를 Array로 반환하거나 특정 시장구분에 대한 정보를 반환.</remarks>
/// <returns type="array|object"> 시장 리스트를 value와 text로 반환하거나 market_code에 해당하는 명칭을 반환.</returns>
/// <example><![CDATA[
///             var marketlist = hi5.getMarketList();
///             // marketlist = [{value : "1", title : "KRW"}, {value : "A", title : "BTC"}, {value : "B", title : "ETH"}];
///
///             var market_name = hi5.getMarketList("1");
///             // market_name = "KRW"
/// ]]></example>
/// </member>
hi5.getMarketList = function (market_code, itemsect, code) {
    var marketlist = [];
    var codelist = Object.keys(g_masterInfo);
    var tempList = [];
    if (itemsect) {
        var productList = [];
        for (var x = 0; x < codelist.length; x++) {
            var codeObj = g_masterInfo[codelist[x]];
            if (itemsect == codeObj.accttype) {
                productList[codelist[x]] = codeObj;
            }
        }
        codelist = Object.keys(productList);
    }
    for (var x = 0; x < codelist.length; x++) {
        var codeObj = g_masterInfo[codelist[x]];
        if (code && code != codeObj.code_only) continue; // 2019.08.29 kws -> code가 존재하는 마켓리스트를 취득하기위하여 추가. 'BTC' 'ETH' 등
        if (!codeObj.base_currency_co || tempList.indexOf(codeObj.base_currency_co) > -1) continue;
        tempList.push(codeObj.base_currency_co);
        var marketObj = {
            'value': codeObj.market,
            'title': codeObj.base_currency_co,
            'code': codelist[x],
            'item_sect': codeObj.item_sect
        };
        if (!market_code && market_code != 'undefined' && market_code == codeObj.market) {
            return codeObj.base_currency_co;
        }
        marketlist.push(marketObj);
    }
    return marketlist;
}

/// <member id="getMarketCodeList" kind="method">
/// <summary>대상 거래 시장의 코드리스트(3자리)를 반환한다.</summary>
/// <remarks>대상 거래 시장의 코드리스트(3자리)를 Array로 반환한다.</remarks>
/// <returns type="array"> 코드리스트(중복제외)를 value와 text로 반환한다.</returns>
/// <example><![CDATA[
///             var market = "BTC"; // "0" : 전체, "1" : 원화마켓, "A",
///             var codelist = hi5.getMarketCodeList(market);
///             // codelist = [{value : "BCH", title : "비트코인캐시"}, {value : "ETH", title : "이더리움"}, {value : "XRP", title : "리플"}];
/// ]]></example>
/// </member>
hi5.getMarketCodeList = function (market, currency) {
    var marketlist = [];
    var codelist = Object.keys(g_masterInfo);
    var tempList = [];
    for (var x = 0; x < codelist.length; x++) {
        var codeObj = g_masterInfo[codelist[x]];
        if (market != "" && market != "0" && market) {
            if (market == ITEM_SECT.SPOT || market == ITEM_SECT.LOCAL || market == ITEM_SECT.FUT) {
                if (codeObj.item_sect != market) continue;

                //결함번호997 수정(use_yn이 Y가 아닐경우 콤보에 표시하지 않음)
                if (hi5.WTS_MODE != WTS_TYPE.MDI && codeObj.use_yn != "Y") continue;
            } else if (codeObj.market != market) {
                if (codeObj.base_currency_co != market) continue;
            }
            if (currency) {
                if (codeObj.currency != currency) continue;
            }
            //if (tempList.indexOf(codeObj.code_only) > -1) continue;
        }
        //if (tempList.indexOf(codeObj.code_only) > -1) continue;

        tempList.push(codeObj.code_only);
        var codename = codeObj.codename;
        var marketObj = {
            'value': codeObj.code_only,
            'codename': codename,
            'title': codename,
            'code': codelist[x],
            'price': codeObj.price,
            'change': codeObj.change,
            'sign': codeObj.sign,
            'rate': codeObj.rate,
            'symbol': codelist[x],
            'gvol': codeObj.gvol,
            'h24_gvol': codeObj.h24_gvol,
            'upjongcode': codeObj.upjongcode || '',
            coin_type: codeObj.coin_type || ''
        };
        marketlist.push(marketObj);
    }

    // 2019.09.25 kws
    // marketlist를 value 기준으로 소팅을 해준다.
    function customSort(a, b) {
        if (a.value == b.value) {
            return 0
        }
        return a.value > b.value ? 1 : -1;
    }
    marketlist.sort(customSort);


    return marketlist;
}

/// <member id="getTickValue" kind="method">
/// <summary>해당 가격기준에 해당하는 틱데이터에 맞게 처리.</summary>
/// <remarks>해당 가격기준에 해당하는 틱데이터에 맞게 처리.</remarks>
/// <returns type="string"> 틱단위로 맞춰서 value를 반환한다.</returns>
/// <example><![CDATA[
///             var codelist = hi5.getTickValue(code, "1000005");
/// ]]></example>
/// </member>
hi5.getTickValue = function (code, value, up) {
    if (!code) return value;
    if (typeof (value) == "string") {
        value = value.replaceAll(",", "");
        value = parseFloat(value);
    }

    // 소수점 자리수 및 호가 단위를 취득한다.
    var codeObj = hi5.GetCodeInfo(code, {
        itemname: ["priceunit", "prc_danwi"]
    });
    var tickData = codeObj.priceunit;
    if (!tickData) {
        if (value >= 1000000) {
            //tickData = 2000;
            tickData = 1000;
        } else if (value >= 500000 && value < 1000000) {
            tickData = 1000;
        } else if (value >= 100000 && value < 500000) {
            tickData = 500;
        } else if (value >= 50000 && value < 100000) {
            tickData = 100;
        } else if (value >= 10000 && value < 50000) {
            tickData = 50;
        } else if (value >= 5000 && value < 10000) {
            tickData = 10;
        } else if (value >= 1000 && value < 5000) {
            tickData = 5;
        } else {
            tickData = 1;
        }
    }

    var decnum = parseInt(codeObj.prc_danwi) || 0;
    var newValue = value * Math.pow(10, decnum);
    tickData = tickData * Math.pow(10, decnum);
    if (newValue % tickData == 0) return value; // 2019.11.20 kws 가격이 호가단위에 맞으면 계산 안하고 리턴한다.
    value = newValue - (newValue % tickData);

    //if(value != 0)  
    if (up) value += tickData;

    value = value / Math.pow(10, decnum);
    return value;

    /*
    var newvalue = value.toString();
    var p = newvalue.split(".");
    if (p[1]) {
        decnum = 8;
        tickData = 1;
        value = value * 100000000;
    }

    value = value - (value % tickData);
    if (up) value += tickData;

    if (decnum > 0) {
        value = value / 100000000;
    }
    return value;*/
}
/*해당 심볼에 호가단위 ( 가격과 수량) 
반환값은 {price:가격단위 숫자,
         qty:수량단위 숫자  }
var objUnit = hi5.getHogaUnit ( "BTC/USDT");
//objUnit.price  
//objUnit.qty
*/

hi5.getHogaUnit = function (symbol) {
    var rec = g_masterInfo[symbol];
    return {
        price: rec ? +(rec.prc_danwi) : 0,
        qty: rec ? +(rec.qty_danwi) : 0
    };
}

/// <member id="getTickValue" kind="method">
/// <summary>해당 가격기준에 해당하는 틱데이터에 맞게 처리.</summary>
/// <remarks>해당 가격기준에 해당하는 틱데이터에 맞게 처리.</remarks>
/// <returns type="string"> 틱단위로 맞춰서 value를 반환한다.</returns>
/// <example><![CDATA[
///             var codelist = hi5.getTickValue(code, "1000005");
/// ]]></example>
/// </member>
hi5.getTickValueEx = function (code, value, up) {
    if (!code) return value;
    if (typeof (value) == "string") {
        value = value.replaceAll(",", "");
        value = parseFloat(value);
    }

    // 소수점 자리수 및 호가 단위를 취득한다.
    var codeObj = hi5.GetCodeInfo(code, {
        itemname: ["priceunit", "prc_danwi"]
    });
    var tickData = codeObj.priceunit;
    if (!tickData) {
        if (value >= 1000000) {
            //tickData = 2000;
            tickData = 1000;
        } else if (value >= 500000 && value < 1000000) {
            tickData = 1000;
        } else if (value >= 100000 && value < 500000) {
            tickData = 500;
        } else if (value >= 50000 && value < 100000) {
            tickData = 100;
        } else if (value >= 10000 && value < 50000) {
            tickData = 50;
        } else if (value >= 5000 && value < 10000) {
            tickData = 10;
        } else if (value >= 1000 && value < 5000) {
            tickData = 5;
        } else {
            tickData = 1;
        }
    }

    var decnum = parseInt(codeObj.prc_danwi) || 0;
    var newValue = value * Math.pow(10, decnum);
    tickData = tickData * Math.pow(10, decnum);
    value = newValue - (newValue % tickData);

    if (newValue % tickData != 0)
        if (up) value += tickData;

    value = value / Math.pow(10, decnum);
    return value;
}

/// <member id="setDecimalLen" kind="method">
/// <summary>소수점 길이를 지정해서, 버림처리하는 함수.</summary>
/// <remarks>value값을 decnum길이에 맞게 소수점 버림처리하는 함수</remarks>
/// <returns type="string"> decnum길이로 맞춰서 value를 반환한다.</returns>
/// <example><![CDATA[
///             var obj = hi5.setDecimalLen("1.2356", 2);
///             return obj;
///             "1.23" 값이 반환된다.
/// ]]></example>
/// </member>
hi5.setDecimalLen = function (value, decnum, comma) {
    if (typeof (value) != "string")
        value = value.toString();

    if (comma) { //천단위 마스킹
        value = putThousandsSeparators(value);
    }

    var temp = value.split(".");
    if (decnum == 0) {
        return temp[0];
    } else {
        if (temp[1]) {
            temp[1] = temp[1].substr(0, decnum);
            return temp[0] + "." + temp[1];
        } else {
            temp[1] = hi5.RPAD("0", decnum, "0");
            return temp[0] + "." + temp[1];
        }
    }
    return value;
}

hi5.getURL = function (option) {
    return hi5_cbMng.getURL(option);
    //if (hi5_dev_mode == "dev" && hi5_svrmode =="") return option.url;
    //
    //var url = hi5_baseURL == "" ? "" :  hi5_baseURL;
    //if (option.url) {
    //    if (option.url[0] == '/') {
    //        url = url + option.url;
    //    } else if (option.url[0] == '.') {  // ./xxx
    //        url = url + option.url.substr(1);
    //    } else {
    //        if (url[url.length - 1] == '/') {
    //            url = url + option.url;
    //        } else {
    //            url = url + "/" + option.url;
    //        }
    //    }
    //}
    //return url;
}

// 실시간 글자색 변경 처리함수
hi5.updateClass = function ($e, css) {
    var element = $e.length > 0 ? $e[0] : $e,
        cls;
    cls = element.getAttribute('hi5_css') || "";
    if (cls != css) {
        $e.removeClass(cls).addClass(css);
        element.setAttribute('hi5_css', css);
    }
};

hi5.getElements = function (id) {
    if (typeof id == "object") {
        return [id];
    } else {
        return document.querySelectorAll(id);
    }
};

hi5.hashClass = function (sel, cls) {
    return hi5.hashClassElements(hi5.getElements(sel), cls);
}

hi5.hashClassElements = function (elements, name) {
    var i, l = elements.length,
        contains = false;;
    for (i = 0; i < l; i++) {
        contains = hi5.hashClassElement(elements[i], name);
        if (contains) return contains;
    }
    return contains;
};

hi5.hashClassElement = function (element, name) {
    var _cls = name.split(' ').filter(function (item, idx) {
        if (item !== "") return item;
    });
    var contains = false;
    if (_cls.length <= 0) return contains;

    for (let index = 0; index < _cls.length; index++) {
        if (element.classList.contains(_cls[index])) {
            contains = true;
            break;
        }
    }
    return contains;
};


hi5.addClass = function (sel, name) {
    hi5.addClassElements(hi5.getElements(sel), name);
};

hi5.addClassElements = function (elements, name) {
    var i, l = elements.length;
    for (i = 0; i < l; i++) {
        hi5.addClassElement(elements[i], name);
    }
};

hi5.addClassElement = function (element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
            element.className += " " + arr2[i];
        }
    }
};

hi5.removeClass = function (sel, name) {
    hi5.removeClassElements(hi5.getElements(sel), name);
};

hi5.removeClassElements = function (elements, name) {
    var i, l = elements.length,
        arr1, arr2, j;
    for (i = 0; i < l; i++) {
        hi5.removeClassElement(elements[i], name);
    }
};

hi5.removeClassElement = function (element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
};

var hi5_getMulti = $.ajax;
// --> [Edit] 수정자:kim changa 일시:2019/03/29
// 수정내용> 맵 파일을 미리 다운로드 하는 기능(preload 키값이 존재하는 경우만 추린다)
hi5.getPreLoadMapInfo = function (objScr) {
    var objData = {};
    if (objScr) {
        $.each(objScr, function (key, obj) {
            if (obj.preload) {
                objData[key] = obj;
            }
        });
        // 다운로드 대상 파일들을 구성한다.
        return Object.keys(objData).length > 0 ? hi5.clone(objData) : null;
    }
    return null;
}
// <-- [Edit] kim changa 2019/03/29

hi5.getAllScreenLoad = function (scrInfo, callback) {
    var cb, path;
    $.each(scrInfo, function (key, value) {
        var cb = hi5cb.getCacheBuster({
                data: "map",
                mapfile: key
            }),
            strUrl = hi5.getURL({
                url: "screen/" + key + ".xml"
            }) + cb.cb;
        hi5.getScreenLoad({
            mapName: key,
            cb: cb.cb,
            url: strUrl
        }, callback);
    })
}
// xml, js 파일을 로드하는 함수
hi5.getScreenLoad = function (opt, callback, optionData) {
    var resources = [],
        deferreds = [],
        idx = 0,
        counter = 0,
        jsURL;

    jsURL = hi5.getURL({
        url: "screen/" + opt.mapName + ".js"
    }) + opt.cb;
    // --> [Edit] 수정자:kim changa 일시:2019/04/08
    // 메모리 관련부분 수정(hi5_scrJS제거)
    /*
        if (!hi5_scrJS[opt.mapName] ) {
            hi5_scrJS[opt.mapName] = { script: null, cb: null };
        }

        if (hi5_scrJS[opt.mapName].cb == opt.cb) {
            var xhr = {
                readyState: 4,
                status: 200,
                key: opt.mapName,
                jsURL: jsURL,                        // js url(화면스크립트 )
                script: hi5_scrJS[opt.mapName]._script,
                responseXML: hi5_scrJS[opt.mapName].responseXML  //xml
                //responseXML: $.parseXML(hi5_scrJS[opt.mapName].responseXML)  //xml
            };
            callback && callback(xhr, optionData);
            return;
        } else {
            hi5_scrJS[opt.mapName].script = null;
        }
      */
    resources.push(opt.url); // xml url
    resources.push(jsURL); // js  url

    var handler = function () {
        var self = this,
            args = arguments;
        counter++;
    };
    /*
        //https://github.com/englercj/jquery-ajax-progress
        var progress = function (e) {
            debugger;
            if (e.lengthComputable) {
                var pct = (e.loaded / e.total) * 100;
            } else {
                console.warn('Content Length not reported!');
            }
        };
    */
    //crossDomain: true
    var configs = {
        dataType: "text",
        global: false,
        success: handler
    };


    var fname = function (url) {
        return url ? url.split('/').pop().split('#').shift().split('?').shift() : null
    }

    for (; idx < resources.length; idx++) {
        var obj = new hi5_getMulti(resources[idx], configs);
        obj['url'] = resources[idx];
        deferreds.push(obj);
    }

    jQuery.when.apply(null, deferreds)
        .then(function () {
            var self = this,
                args = arguments;
            var xhr = {
                readyState: args[0][2].readyState,
                status: args[0][2].status,
                statusText: args[0][2].statusText,
                key: opt.mapName,
                jsURL: jsURL //js url(화면스크립트 )
            };

            self.forEach(function (rd, idx) {
                var ext = fname(rd.url).split('.').pop();
                if (ext == 'xml') {
                    //hi5_scrJS[opt.mapName]['responseXML'] = args[idx][0];  // 화면정보 hash

                    //console.time("xml parser==" + opt.mapName);
                    xhr['responseText'] = args[idx][0]; //text
                    xhr['responseXML'] = $.parseXML(args[idx][0]); //xml
                    //console.timeEnd("xml parser==" + opt.mapName);

                } else {
                    xhr['script'] = args[idx][0]; // 화면용 Javascript
                }
            });
            /*
                    hi5_scrJS[opt.mapName].cb = opt.cb;  // cachebuster 저장
                    hi5_scrJS[opt.mapName]['responseXML'] = xhr['responseXML'];  // 화면정보 hash
                    hi5_scrJS[opt.mapName]['_script'] = xhr['script'];
            */

            callback && callback(xhr, optionData);
        })
        .fail(function () {
            var self = this,
                args = arguments,
                defs = deferreds,
                cont = counter;
            var xhr = {
                readyState: args[0].readyState,
                status: args[0].status,
                statusText: args[0].statusText
            };

            callback && callback(xhr, optionData);
        });
    // <-- [Edit] kim changa 2019/04/08    

}

/// <member id="setCtrlsOption" kind="method">
/// <summary>컨트롤 Array를 받아서 type별로 setStyle, Setprop, SetBaseCode 등의 처리를 하는 함수</summary>
/// <remarks>화면에서 각각 처리하는 방식은 스크립트 양만 많아지는 결과가 나와서, 하나의 함수로 처리한다.</remarks>
/// <returns type=""> 없음 </returns>
/// <example><![CDATA[
///             var obj = [ctrl1, ctrl2, ctrl3, ctrl4];
///             var option = {type:"style",prop:"visibility",value:"hidden"};
///             hi5.setCtrlsOption(obj, option);
///             obj로 넘긴 컨트롤들을 option에 담긴값으로 일괄 처리한다.
/// ]]></example>
/// </member>
hi5.setCtrlsOption = function (objCtrls, option) {
    if (objCtrls.length > 0) {
        objCtrls.forEach(function (obj, idx) {
            if (option.type == "style") {
                if (hi5.isArray(option.value)) {
                    obj.SetStyle(option.prop, option.value[idx]);
                } else {
                    obj.SetStyle(option.prop, option.value);
                }
            } else if (option.type == "prop") {
                if (hi5.isArray(option.value)) {
                    obj.SetProp(option.prop, option.value[idx]);
                } else {
                    obj.SetProp(option.prop, option.value);
                }
            } else if (option.type == "check") {
                if (hi5.isArray(option.value)) {
                    obj.SetProp(option.prop, option.value[idx]);
                } else {
                    obj.SetProp(option.prop, option.value);
                }
            } else if (option.type == "basecode") {
                obj.SetBaseCode(option.code);
            } else if (option.type == "class") {
                if (option.value) {
                    $("#" + obj.id).addClass(option.name);
                } else {
                    $("#" + obj.id).removeClass(option.name);
                }
            } else if (option.type == "option") {
                obj.SetOptions(option.value);
            }
        });
    }
}

//var $hi5 = {
//    //element, event, handler, capture
//    on: function (elem, types, fn) {
//        var type;
//        // Types can be a map of types/handlers
//        if (typeof types === "object") {
//            for (type in types) {
//                this.on(elem, type, types[type]);
//            }
//            return elem;
//        }
//        elem.addEventListener(types, fn);
//    }
//};


/// <member id="on" kind="method">
/// <summary>HTML  요소별로 이벤트를 할당하는 함수</summary>
/// <remarks>JavaScript addEventListener() 함수기능으로 JQuery.on() 기능과 동일 </remarks>
/// <param name = "elem" type="object"> HTML Element 객체 </param>
/// <param name = "types" type="string|object"> 이벤트명, 이벤트 객체 정보</param>
/// <param name = "evtfn" type="function"> 이벤트 발생시에 이벤트 구현하는 함수명 </param>
/// <example><![CDATA[
///  예1) 버튼 건트롤의 click이벤트 등록기능
///   hi5.on(button._html, "click", function(evt){
///        //... 이벤트 처리 기술...
///   });
///
///  예2) 버튼 건트롤의  mouseenter, mouseleave 이벤트 등록 기능
///  hi5.on(button._html, {
///    mouseenter: function (evt) {
///       var $target = $(evt.target);
///       //... 이벤트 처리 기술...
///    },
///    mouseleave: function (evt) {
///      var $target = $(evt.target);
///      //... 이벤트 처리 기술...
///    }
///  });
/// ]]></example>
/// </member>
hi5.on = function (elem, types, evtfn) {
    var type;
    // Types can be a map of types/handlers
    if (typeof types === "object") {
        for (type in types) {
            hi5.on(elem, type, types[type]);
        }
        return elem;
    }
    elem.addEventListener(types, evtfn);
}

/// <member id="value" kind="method">
/// <summary>HTML Input 속성의 값을 설정및 취득하는 기능</summary>
/// <remarks>$id.value() 기능 대체</remarks>
/// <param name = "elem" type="object"> HTML 요소</param>
/// <param name = "value" type="string"> 입력문자열 또는 미 입력</param>
/// <returns type="string"> 값 취득시에 반환</returns>
/// <example><![CDATA[
///    // 예1)  Input 요소에 값을 설정하는 기능
///     hi5.value( element, "123");
///    // 예2)  Input 요소에 값을 취득하는 기능
///    var s = hi5.value( element);
//     // "123" 값이 취득
/// ]]></example>
/// </member>
hi5.value = function (elem, value) {
    if (value === undefined) {
        return elem.value;
    }
    elem.value = value;
}

/// <member id="getCustomStyle" kind="method">
/// <summary>컨트롤별로 custom color 값 취득하는 메소드</summary>
/// <remarks>특정 동작별(disable, active, hover) 등에 대한 색깔을 취득</remarks>
/// <param name = "that" type="object"> 컨트롤 객체 </param>
/// <param name = "type" type="string"> default, disable, active, mouseover 등</param>
/// <param name = "bString" type="boolean"> true시 string값으로 리턴, false시 object형태</param>
/// <example><![CDATA[
///     var cssstyle = hi5.getCustomStyle(cal_1, "disable");
///     // 기본 background, border, color에 대해 값을 취득한다.
/// ]]></example>
/// </member>
hi5.getCustomStyle = function (that, type, bString) {
    function getDefaultColor(obj, key) {
        if (obj.styleColor) {
            return obj.styleColor[key] ? obj.styleColor[key] : null;
        }
        return null;
    }

    function getCustomColor(obj, key) {
        if (obj.customColor) {
            return obj.customColor[key] ? obj.customColor[key] : null;
        }
        return null;
    }

    //var styletypes = ["disable", "active", "over"];
    var self = that;

    var bgcolor, fgcolor, bdcolor;
    var styleJson = {
        "background-color": "",
        "color": "",
        "border-color": ""
    };
    if (type == "default") {
        bgcolor = getDefaultColor(self, "background-color");
        fgcolor = getDefaultColor(self, "color");
        bdcolor = getDefaultColor(self, "border-color");
    } else {
        bgcolor = getCustomColor(self, type + "bgcolor");
        fgcolor = getCustomColor(self, type + "fgcolor");
        bdcolor = getCustomColor(self, type + "bdcolor");
    }

    if (that.ctlName == "button" && type == "active") {
        //g_button_DS[actiontype][buttontype]
        //var cssstyle = g_button_DS[type][that.btntype];
        //if (!bgcolor) bgcolor = cssstyle["background-color"];
        //if (!bdcolor) bdcolor = cssstyle["border-color"];
        //if (!fgcolor) fgcolor = cssstyle["color"];
    }

    var str = "";
    if (bgcolor) {
        styleJson["background-color"] = bgcolor; // background-color-> backgroundColor // $.camelCase( "background-color")
        str += "background-color:" + bgcolor + ";";
    }
    if (fgcolor) {
        styleJson["color"] = fgcolor;
        str += "color:" + fgcolor + ";";
    }
    if (bdcolor) {
        styleJson["border-color"] = bdcolor; // border-color->borderColor
        str += "border-color:" + bdcolor + ";";
    }

    if (bString) styleJson = str;

    return styleJson;
}

hi5.getConvertMarket = function (value) {
    if (hi5app_name == "bitpax") {
        if (value == "1") value = "2";
        else if (value == "A") value = "C";
        else if (value == "B") value = "D";
    }

    return value;
}

hi5.getPriceDecnum = function (strCode, price) {
    var mrkDecnum = 8;
    if (hi5.GetCodeInfo(strCode, {
            "itemname": "base_currency_co"
        }) == "KRW") {
        mrkDecnum = 0;
        var prcS = price.split(".");
        if (prcS[1]) {
            mrkDecnum = prcS[1].length;
        }
    }
    //krw 마켓이 아닐경우, 소수점을 8넘겨준다
    return mrkDecnum;
}


/// <member id="SetCurrency" kind="method">
/// <summary>통화코드 변경하는 메소드</summary>
/// <remarks>통화코드를 변경했을 때 메모리 값을 변경한다.</remarks>
/// <param name = "currency" type="string"> 통화코드 "KRW" </param>
/// <param name = "fn" type="callback"> callback 함수 </param>
/// <example><![CDATA[
///     hi5.SetCurrency("KRW", function(ret){
///         if(ret){
///             //성공
///         }
///         else{
///             //실패
///         }
///     });
/// ]]></example>
/// </member>
hi5.SetCurrency = function (currency, fn) {
    var ret = 0;
    if (currency == "USDT")
        currency = "USD";
    for (var x = 0; x < hi5.SHMEM.currencylist.length; x++) {
        if (hi5.SHMEM.currencylist[x].currency == currency) {
            hi5.SetSharedMemory("@BASE_CURRENCY", currency);
            hi5.SetSharedMemory("@BASE_CURRRATE", hi5.SHMEM.currencylist[x].curr);
            ret = 1;
            break;
        }
    }

    if (fn) {
        fn(ret);
    }
}

hi5.convertCurrency = function (currency, data, realType) {
    if (currency == 'USD') return data;
    var pdata = {
        'JUCH': ['conclsn_prc'],
        '0012': ['price', 'ask', 'bid', 'open', 'high', 'low', 'gamt', 'h24_gamt', 'h24_diff'],
        '0013': ['ask1', 'ask2', 'ask3', 'ask4', 'ask5', 'ask6', 'ask7', 'ask8', 'ask9', 'ask10', 'ask11', 'ask12', 'ask13', 'ask14', 'ask15', 'ask16', 'ask17', 'ask18', 'ask19', 'ask20',
            'bid1', 'bid2', 'bid3', 'bid4', 'bid5', 'bid6', 'bid7', 'bid8', 'bid9', 'bid10', 'bid11', 'bid12', 'bid13', 'bid14', 'bid15', 'bid16', 'bid17', 'bid18', 'bid19', 'bid20'
        ]
    };

    var curr;
    for (var x = 0; x < hi5.SHMEM.currencylist.length; x++) {
        if (hi5.SHMEM.currencylist[x].currency == currency) {
            curr = hi5.SHMEM.currencylist[x].curr;
            break;
        }
    };
    for (var x = 0; x < pdata[realType].length; x++) {
        var convertData = data[0][pdata[realType][x]];
        if (convertData) {
            var cdata = convertData.split('.');
            var flength = cdata[0].length;
            var slength = (cdata[1]) ? cdata[1].length : 0;

            convertData = parseFloat(convertData);
            convertData = (convertData * curr).toFixed(slength);
            var cdata1 = convertData.split('.');
            var flength1 = cdata1[0].length;
            var str = ""
            for (var i = 0; i < flength - flength1; i++) {
                str = str + "0";
            }
            convertData = str + cdata1[0] + '.' + cdata1[1];
            data[0][pdata[realType][x]] = convertData;
        }
    }
    return data;

}

/// <member id="isLogin" kind="method">
/// <summary>로그인 여부 판별 함수(서버방식 별로 상이)</summary>
/// <remarks>로그인 여부 판별 함수(서버방식 별로 상이)</remarks>
/// <returns type="boolean">true or false</returns>
/// <example><![CDATA[
///     var ret = hi5.isLogin();   //로그인 여부 취득
///     //ret = true or false;
/// ]]></example>
/// </member>
hi5.isLogin = function () {
    var bLogin = false;
    if (typeof IsLogin == "function") { // 홈페이지 사용 로그인 판별 여부 common.js에 선언
        bLogin = IsLogin(true);
    } else {
        bLogin = ws.loginState();
    }

    return bLogin;
}

/*
onlyHeader : true
var objTranData = {
              trcode: "105112",  // 일자별
               input: {
                   "InRec1": { "flag":"0", "symbol":"BTC/PHP"}   // 필수입력값
                }
		};
		// 통신요청
         var bRet = hi5.commRq(objTran, function (rpData) {
	       debugger;
		  console.log(rpData);
		  if ( rpData.status == "success"){  // 정상데이터
			var var data = rpData.data; // 실제 데이터
		  }else{   // 오류
		        //rpData.msgHeader.MSG_COD    // 오류코드
			   //rpData.msgHeader. MSG_CTNS   // 오류메세지
		  }
	    });
        if ( !bRet ){
            // 시스템 오류
            //bRet 값이 false이면 트랜정보 실패
        }
*/

hi5.commRq = function (objData, cb) {
    return commAPI.commTranRQ(objData, cb);
}

/// <member id="getAcctType" kind="method">
/// <summary>계좌종류(type)을 입력하면 해당하는 계좌정보를 취득</summary>
/// <remarks>계좌종류(type 00, 09, 11)을 입력하면 해당하는 계좌정보를 취득</remarks>
/// <returns type="object">계좌정보 객체</returns>
/// <example><![CDATA[
///     var obj = hi5.getAcctType('09');   //캐시 계좌 정보
///     //obj = {acctname : XXXXX, acctno : 계좌번호, currency : 계좌통화.....};
/// ]]></example>
/// </member>
hi5.getAcctType = function (type) {
    var accObj = {};
    for (var x = 0; x < hi5.SHMEM.acclist.length; x++) {
        if (type == hi5.SHMEM.acclist[x].type) {
            accObj = hi5.SHMEM.acclist[x];
            break;
        }
    }

    return accObj;
}

/// <member id="changeURL" kind="method">
/// <summary>홈페이지에서 로그인, 회원가입등의 페이지로 이동 시 호출</summary>
/// <remarks>홈페이지에서 로그인, 회원가입등의 페이지로 이동 시 호출(없을 시에는 로컬 로그인 페이지로 이동)</remarks>
/// <example><![CDATA[
///     hi5.changeURL({page : 'login'});   //로그인 페이지로 이동
/// ]]></example>
/// </member>
hi5.changeURL = function (obj) {
    var urlPages = {
        'login': {
            url: 'Login', //홈페이지 주소
            fn: loginWindow() // localhost에서 테스트시 호출되는 함수
        },
        'register': {
            url: 'Signup', // 홈페이지 주소
            fn: loginWindow() // localhost에서 테스트시 호출되는 함수
        }
    }
    if (typeof window.frontRouterChange == "function") {
        window.frontRouterChange(urlPages[obj.page].url);
    } else {
        urlPages[obj.page].fn;
    }
}

/// <member id="callMenu" kind="method">
/// <summary>모바일에서 메뉴번호로 해당 화면 호출</summary>
/// <remarks>모바일에서 메뉴번호로 해당 화면 호출(없을 시에는 로컬 로그인 페이지로 이동)</remarks>
/// <example><![CDATA[
///     hi5.callMenu(101, initObj);   //Spot Trade로 이동
/// ]]></example>
/// </member>
hi5.callMenu = function (menuId, initObj) {
    var menuObj = hi5_MTSPages[menuId];
    if (!menuObj) return;
    if (typeof window.mobileRouterChange == "function") {
        window.mobileRouterChange(menuObj.url, initObj);
    }
}

/// <member id="getDatePeriod" kind="method">
/// <summary>기간설정시 from 날짜 반환 함수</summary>
/// <param name="period" type="string"> 기간설정 값</param>
/// <param name="toDate" type="string"> 기준이 되는 날짜 값</param>
/// <returns type="string">기준이 되는 날짜에서 기간만큼 뺀 from 날짜를 반환</returns>
/// <example><![CDATA[
///            var fromData = hi5.getDatePeriod(period, toDate);
/// ]]></example>
/// </member>
hi5.getDatePeriod = function (period, toDate) {
    //toDate = toDate.replaceAll("/", "-");
    toDate = new Date(toDate);
    var fromDate = new Date(toDate);
    toDate.setDate(toDate.getDate() - Number(period));
    //debugger;
    return toDate;
}

/// <member id="Mask" kind="method">
/// <summary>마스킹 관련 함수</summary>
/// <param name="value" type="string"> Masking 해야하는 값</param>
/// <param name="option" type="string"> Masking 조건 값</param>
/// <returns type="string">조건에 따라서 Mask 값 반환</returns>
/// <example><![CDATA[
///            var fromData = hi5.Mask(value, option);
/// ]]></example>
/// </member>
hi5.Mask = function (value, option) {

    if (value.acc && option == false) {
        var masking = value.acc;
        value.acc = masking.replace(/^(\d{3})-?(\d{1,2})\d{2}-?\d{3}(\d{3})/g, '$1-***-***$3');
    }
    if (value.username && option == false) {
        var masking = value.username;
        if (masking.length == 3) {
            value.username = masking.replace(/.{2}$/g, "**");
        }
        if (masking.length == 2) {
            value.username = masking.replace(/.{1}$/g, "*");
        }
        if (masking.length == 1) {
            value.username = masking.replace(/./g, "*");
        }
        if (masking.length > 3) {
            var masking = value.username;
            var len = masking.length - 2;
            var msstring = "";
            for (var i = 0; i < len; i++) {
                msstring += "*";
            }
            value.username = masking.replace(new RegExp('.{' + len + '}$', 'g'), msstring);
        }
    }
    if (value.post && option == false) {
        var masking = value.post;
        value.post = masking.replace(/.{4}$/gi, "****");
    }
    if (value.phone && option == false) {
        var masking = value.phone;
        var pattern = /[)]/g;
        if (pattern.test(masking)) {
            var s = masking.split(')');
            s[1] = s[1].replace(/^(\d{2,3})(\d{3,4})(\d{4})/g, ' ******* $3');

            value.phone = s[0] + ")" + s[1];
        }
        value.phone = masking.replace(/^(\d{2,3})(\d{3,4})(\d{4})/g, ' ******* $3');
    }
    if (value.phone && option == true) {
        var masking = value.phone;
        var pattern = /[)]/g;
        if (pattern.test(masking)) {
            var s = masking.split(')');
            s[1] = s[1].replace(/^(\d{2,3})(\d{3,4})(\d{4})/g, '$1-$2-$3');

            value.phone = s[0] + ")" + s[1];
        }
        value = masking.replace(/^(\d{2,3})(\d{3,4})(\d{4})/g, '$1-$2-$3');
    }
    if (value.jumin && option == false) {
        var masking = value.jumin;
        value.jumin = masking.replace(/^(\d{6})-(\d{1})\d{6}/g, '$1-$2******');
    }
    if (value.email && option == false) {
        var masking = value.email;
        var len = masking.split('@')[0].length - 3; // ******@gmail.com
        masking = masking.replace(new RegExp('.(?=.{0,' + len + '}@)', 'g'), '*');
        var masking1 = masking.split('@')[0]


        var domain = masking.split('@')[1]; //gmail.com
        var domain2 = domain.split('.');
        var a = domain2[0];
        var len2 = a.length - 2;
        var scount = '';
        for (var i = 0; i < len2; i++) {
            scount = scount + '*';
        }
        if (domain2.length == 2) {
            domain2[0] = domain2[0].replace(new RegExp('.{' + len2 + '}$', 'g'), scount);
            value.email = masking1 + '@' + domain2[0] + '.' + domain2[1];
        } else if (domain2.length == 3) {
            domain2[0] = domain2[0].replace(new RegExp('.{' + len2 + '}$', 'g'), scount);

            value.email = masking1 + '@' + domain2[0] + '.' + domain2[1] + '.' + domain2[2];

        }
    }
    if (value.arr && option == false) {
        var masking = value.arr;
        value.arr = masking.replace(/.{4}$/gi, "****");
    }
    if (value.datetime) {
        var masking = value.datetime;
        if (option == 'yyyy/mm/dd hh:mm:ss')
            value.datetime = masking.replace(/^(\d{4})(\d{1,2})(\d{1,2})(\d{1,2})(\d{1,2})(\d{1,2})/g, '$1/$2/$3 $4:$5:$6');
        else if (option == 'yy/mm/dd hh:mm:ss')
            value.datetime = masking.replace(/^(\d{4})(\d{1,2})(\d{1,2})(\d{1,2})(\d{1,2})(\d{1,2})/g, '$2/$3 $4:$5:$6');
    }

    return value;
}

hi5.copyToClipboard = function (text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        //textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.

        textarea.setAttribute('readonly', '');
        textarea.style = {
            position: 'absolute',
            left: '-9999px'
        };
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

hi5.excelDownload = function (objData, success_callback, error_callback) {
    // 서버 데이터 다운로드
    var option = {
        //tran_code : "17227",   // (서버)트랜서비스
        tran_code: objData.tran_code, // (서버)트랜서비스
        //trcode	 : "/callAPI/defectList",   // 서비스이름
        trcode: "/callAPI/atsList", // 서비스이름
        ajaxType: "GET",
        //rqName	: "DEFECT_LIST_SEARCH",  // 통신이름
        param: objData.param ? objData.param : {}
    };

    // 서버전송
    hi5.getAjaxData(option, function (rpObj, opt) {
        // 응답데이터(배열)
        if (!rpObj.error && rpObj.data) {
            var keyArr = rpObj.data.splice(0, 1);
            var data = hi5.arrToObj(keyArr[0], rpObj.data);
            success_callback(data, opt);
        } else if (rpObj.error) {
            error_callback(rpObj, opt);
        }
    }, function (rpObj, opt) {
        error_callback(rpObj, opt);
    });
}

/// <member id="getUTCLocalTime" kind="method">
/// <summary>입력받은 날짜에 로컬시간을 합해서 유닉스타입으로 바꾸기 type이 Array일 경우(from~to계산용) String일 경우 단건</summary>
/// <param name="date" type="string">날짜</param>
/// <returns type="string">입력날짜와 로컬시간의 합을 utc 타입으로 환산한 값을 YYYYMMDD형태로 return</returns>
/// <example><![CDATA[
///            var fromData = hi5.getUTCdate(date);
/// ]]></example>
/// </member>




hi5.getUTCdate = function (date) {
    var string;

    function chdate(oridate) {
        var year = oridate.substring(0, 4);
        var month = oridate.substring(4, 6);
        var day = oridate.substring(6, 8);
        var localhours = new Date().getHours();
        var localminutes = new Date().getMinutes();
        var localseconds = new Date().getSeconds();

        var unixdate = new Date(year, month - 1, day, localhours, localminutes, localseconds);
        unixdate = unixdate.getTime();
        string = hi5.getUTCLocalTime(unixdate / 1000).utc.yy;
        var a = hi5.getUTCLocalTime(unixdate / 1000).utc.mm;
        string += ('0' + a).slice(-2);
        string += hi5.getUTCLocalTime(unixdate / 1000).utc.dd;

        return string
    }
    if (date.constructor == Array) {
        var from, to, arr = [];
        from = chdate(date[0]);
        to = chdate(date[1]);
        arr = [from, to];
        return arr;
    } else {
        return chdate(date);
    }


}

/// <member id="getUTCLocalTime" kind="method">
/// <summary>utc long값으로 들어오는 시간값을 현재 타임존의 시간으로 변경</summary>
/// <param name="utc" type="string">utc 시간값(10자리)</param>
/// <param name="utc" type="string">utc 시간값(10자리)</param>
/// <returns type="string">기준이 되는 날짜에서 기간만큼 뺀 from 날짜를 반환</returns>
/// <example><![CDATA[
///            var fromData = hi5.getDatePeriod(period, toDate);
/// ]]></example>
/// </member>
hi5.getUTCLocalTime = function (utc) {
    if (utc == "" || !utc) return utc;
    if (typeof (utc) == 'object') {
        utc = utc.getTime();
    }
    utc = utc.toString();
    if (utc.length < 10) return utc;
    var newDate;
    if (utc.length == 10)
        newDate = new Date(parseFloat(utc + "000"));
    else
        newDate = new Date(parseFloat(utc)); // 숫자형으로 들어가야된다.

    var utcYear = newDate.getUTCFullYear();
    var utcMonth = newDate.getUTCMonth() + 1;
    var utcDate = newDate.getUTCDate();
    var utcHour = newDate.getUTCHours();
    var utcMin = newDate.getUTCMinutes();
    var utcSec = newDate.getUTCSeconds();

    var utcObj = {
        yy: utcYear.toString(),
        mm: utcMonth >= 10 ? utcMonth.toString() : "0" + utcMonth,
        dd: utcDate >= 10 ? utcDate.toString() : "0" + utcDate,
        h: utcHour >= 10 ? utcHour.toString() : "0" + utcHour,
        m: utcMin >= 10 ? utcMin.toString() : "0" + utcMin,
        s: utcSec >= 10 ? utcSec.toString() : "0" + utcSec
    }

    var offset = new Date().getTimezoneOffset();
    if (g_hi5_config.tzone) {
        var matches = __timeZones.filter(function (zone) {
            return zone.abbr == g_hi5_config.tzone;
        });
        if (matches.length) {
            var tzMinOffset = matches[0].offset;
            offset = tzMinOffset;
        }
    }
    if (hi5.SHMEM.user_setting) { // 2019.09.03 kws -> timezone 설정되어있을 시에 해당 timezone 시간으로 표시
        var timezone = hi5.SHMEM.user_setting.general.timezone;
        if (timezone) {
            var ts = timezone.split('/'); // id/time (124/+0900) 서울일 경우
            if (ts[1]) {
                var t1 = ts[1].substring(0, 1);
                var th = ts[1].substring(1, 3);
                var tm = ts[1].substring(3, 5);

                timezone = parseInt(th) * 60 + parseInt(tm);
                if (t1 == '+') timezone *= -1;
            }

            offset = timezone;
        }
    }
    var localTime = new Date(new Date(utcYear, utcMonth - 1, utcDate, utcHour, utcMin, utcSec).getTime() - (offset * 60 * 1000));
    return {
        utc: utcObj,
        local: {
            yy: localTime.getFullYear().toString(),
            mm: localTime.getMonth() + 1 >= 10 ? (localTime.getMonth() + 1).toString() : "0" + (localTime.getMonth() + 1),
            dd: localTime.getDate() >= 10 ? (localTime.getDate()).toString() : "0" + localTime.getDate(),
            h: localTime.getHours() >= 10 ? (localTime.getHours()).toString() : "0" + localTime.getHours(),
            m: localTime.getMinutes() >= 10 ? (localTime.getMinutes()).toString() : "0" + localTime.getMinutes(),
            s: localTime.getSeconds() >= 10 ? (localTime.getSeconds()).toString() : "0" + localTime.getSeconds()
        }
    }
}

var __timeZones = [{
        abbr: "Local",
        id: 'Local',
        offset: 0,
        offsetHours: 0,
        displayName: "",
        supportsDaylightSavingTime: false
    },
    {
        abbr: "DST",
        id: 'Dateline Standard Time',
        offset: -720,
        offsetHours: -12,
        displayName: '(UTC-12:00) International Date Line West',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "UTC11",
        id: 'UTC-11',
        offset: -660,
        offsetHours: -11,
        displayName: '(UTC-11:00) Coordinated Universal Time-11',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "HST",
        id: 'Hawaiteratoran Standard Time',
        offset: -600,
        offsetHours: -10,
        displayName: '(UTC-10:00) Hawaiterator',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "AST",
        id: 'Alaskan Standard Time',
        offset: -540,
        offsetHours: -9,
        displayName: '(UTC-09:00) Alaska',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "PST",
        id: 'Pacific Standard Time (Mexico)',
        offset: -480,
        offsetHours: -8,
        displayName: '(UTC-08:00) Baja California',
        supportsDaylightSavingTime: true
    },
    //{ abbr: "PST", id: 'Pacific Standard Time', offset: -480, offsetHours: -8, displayName: '(UTC-08:00) Pacific Time (US & Canada)', supportsDaylightSavingTime: true },
    {
        abbr: "MST",
        id: 'US Mountain Standard Time',
        offset: -420,
        offsetHours: -7,
        displayName: '(UTC-07:00) Arizona',
        supportsDaylightSavingTime: false
    },
    //{ abbr: "MST", id: 'Mountain Standard Time (Mexico)', offset: -420, offsetHours: -7, displayName: '(UTC-07:00) Chihuahua, La Paz, Mazatlan', supportsDaylightSavingTime: true },
    //{ abbr: "MST", id: 'Mountain Standard Time', offset: -420, offsetHours: -7, displayName: '(UTC-07:00) Mountain Time (US & Canada)', supportsDaylightSavingTime: true },
    {
        abbr: "CST",
        id: 'Central Standard Time',
        offset: -360,
        offsetHours: -6,
        displayName: '(UTC-06:00) Central Time (US & Canada)',
        supportsDaylightSavingTime: true
    },
    //{ abbr: "CST", id: 'Central America Standard Time', offset: -360, offsetHours: -6, displayName: '(UTC-06:00) Central America', supportsDaylightSavingTime: false },
    //{ abbr: "CST", id: 'Canada Central Standard Time', offset: -360, offsetHours: -6, displayName: '(UTC-06:00) Saskatchewan', supportsDaylightSavingTime: false },
    //{ abbr: "CST", id: 'Central Standard Time (Mexico)', offset: -360, offsetHours: -6, displayName: '(UTC-06:00) Guadalajara, Mexico City, Monterrey', supportsDaylightSavingTime: true },
    //{ abbr: "EST", id: 'SA Pacific Standard Time', offset: -300, offsetHours: -5, displayName: '(UTC-05:00) Bogota, Lima, Quito, Rio Branco', supportsDaylightSavingTime: false },
    {
        abbr: "EST",
        id: 'Eastern Standard Time',
        offset: -300,
        offsetHours: -5,
        displayName: '(UTC-05:00) Eastern Time (US & Canada)',
        supportsDaylightSavingTime: true
    },
    //{ abbr: "EST", id: 'US Eastern Standard Time', offset: -300, offsetHours: -5, displayName: '(UTC-05:00) Indiana (East)', supportsDaylightSavingTime: true },
    {
        abbr: "VST",
        id: 'Venezuela Standard Time',
        offset: -270,
        offsetHours: -4.5,
        displayName: '(UTC-04:30) Caracas',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "AST",
        id: 'Atlantic Standard Time',
        offset: -240,
        offsetHours: -4,
        displayName: '(UTC-04:00) Atlantic Time (Canada)',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Paraguay Standard Time',
        offset: -240,
        offsetHours: -4,
        displayName: '(UTC-04:00) Asuncion',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Central Brazilian Standard Time',
        offset: -240,
        offsetHours: -4,
        displayName: '(UTC-04:00) Cuiaba',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Pacific SA Standard Time',
        offset: -240,
        offsetHours: -4,
        displayName: '(UTC-04:00) Santiago',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'SA Western Standard Time',
        offset: -240,
        offsetHours: -4,
        displayName: '(UTC-04:00) Georgetown, La Paz, Manaus, San Juan',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Newfoundland Standard Time',
        offset: -210,
        offsetHours: -3.5,
        displayName: '(UTC-03:30) Newfoundland',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'SA Eastern Standard Time',
        offset: -180,
        offsetHours: -3,
        displayName: '(UTC-03:00) Cayenne, Fortaleza',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Argentina Standard Time',
        offset: -180,
        offsetHours: -3,
        displayName: '(UTC-03:00) Buenos Aires',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'E. South America Standard Time',
        offset: -180,
        offsetHours: -3,
        displayName: '(UTC-03:00) Brasilia',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Bahia Standard Time',
        offset: -180,
        offsetHours: -3,
        displayName: '(UTC-03:00) Salvador',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Montevideo Standard Time',
        offset: -180,
        offsetHours: -3,
        displayName: '(UTC-03:00) Montevideo',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Greenland Standard Time',
        offset: -180,
        offsetHours: -3,
        displayName: '(UTC-03:00) Greenland',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'UTC-02',
        offset: -120,
        offsetHours: -2,
        displayName: '(UTC-02:00) Coordinated Universal Time-02',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Mid-Atlantic Standard Time',
        offset: -120,
        offsetHours: -2,
        displayName: '(UTC-02:00) Mid-Atlantic - Old',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Azores Standard Time',
        offset: -60,
        offsetHours: -1,
        displayName: '(UTC-01:00) Azores',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Cape Verde Standard Time',
        offset: -60,
        offsetHours: -1,
        displayName: '(UTC-01:00) Cape Verde Is.',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Morocco Standard Time',
        offset: 0,
        offsetHours: 0,
        displayName: '(UTC) Casablanca',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'UTC',
        offset: 0,
        offsetHours: 0,
        displayName: '(UTC) Coordinated Universal Time',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'GMT Standard Time',
        offset: 0,
        offsetHours: 0,
        displayName: '(UTC) Dublin, Edinburgh, Lisbon, London',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Greenwich Standard Time',
        offset: 0,
        offsetHours: 0,
        displayName: '(UTC) Monrovia, Reykjavik',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Central European Standard Time',
        offset: 60,
        offsetHours: 1,
        displayName: '(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Namibia Standard Time',
        offset: 60,
        offsetHours: 1,
        displayName: '(UTC+01:00) Windhoek',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'W. Central Africa Standard Time',
        offset: 60,
        offsetHours: 1,
        displayName: '(UTC+01:00) West Central Africa',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'W. Europe Standard Time',
        offset: 60,
        offsetHours: 1,
        displayName: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Central Europe Standard Time',
        offset: 60,
        offsetHours: 1,
        displayName: '(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Romance Standard Time',
        offset: 60,
        offsetHours: 1,
        displayName: '(UTC+01:00) Brussels, Copenhagen, Madrid, Paris',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'FLE Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'South Africa Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) Harare, Pretoria',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Turkey Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) Istanbul',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'GTB Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) Athens, Bucharest',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Libya Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) Tripoli',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'E. Europe Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) E. Europe',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Jordan Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) Amman',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Middle East Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) Beirut',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Egypt Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) Cairo',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Syria Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) Damascus',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Israel Standard Time',
        offset: 120,
        offsetHours: 2,
        displayName: '(UTC+02:00) Jerusalem',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Arab Standard Time',
        offset: 180,
        offsetHours: 3,
        displayName: '(UTC+03:00) Kuwait, Riyadh',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'E. Africa Standard Time',
        offset: 180,
        offsetHours: 3,
        displayName: '(UTC+03:00) Nairobi',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Arabic Standard Time',
        offset: 180,
        offsetHours: 3,
        displayName: '(UTC+03:00) Baghdad',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Kaliningrad Standard Time',
        offset: 180,
        offsetHours: 3,
        displayName: '(UTC+03:00) Kaliningrad, Minsk',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Iran Standard Time',
        offset: 210,
        offsetHours: 3.5,
        displayName: '(UTC+03:30) Tehran',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Mauritius Standard Time',
        offset: 240,
        offsetHours: 4,
        displayName: '(UTC+04:00) Port Louis',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Georgian Standard Time',
        offset: 240,
        offsetHours: 4,
        displayName: '(UTC+04:00) Tbilisi',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Caucasus Standard Time',
        offset: 240,
        offsetHours: 4,
        displayName: '(UTC+04:00) Yerevan',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Arabian Standard Time',
        offset: 240,
        offsetHours: 4,
        displayName: '(UTC+04:00) Abu Dhabi, Muscat',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Azerbaijan Standard Time',
        offset: 240,
        offsetHours: 4,
        displayName: '(UTC+04:00) Baku',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Russian Standard Time',
        offset: 240,
        offsetHours: 4,
        displayName: '(UTC+04:00) Moscow, St. Petersburg, Volgograd',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Afghanistan Standard Time',
        offset: 270,
        offsetHours: 4.5,
        displayName: '(UTC+04:30) Kabul',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Pakistan Standard Time',
        offset: 300,
        offsetHours: 5,
        displayName: '(UTC+05:00) Islamabad, Karachi',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'West Asia Standard Time',
        offset: 300,
        offsetHours: 5,
        displayName: '(UTC+05:00) Ashgabat, Tashkent',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'India Standard Time',
        offset: 330,
        offsetHours: 5.5,
        displayName: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Sri Lanka Standard Time',
        offset: 330,
        offsetHours: 5.5,
        displayName: '(UTC+05:30) Sri Jayawardenepura',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Nepal Standard Time',
        offset: 345,
        offsetHours: 5.75,
        displayName: '(UTC+05:45) Kathmandu',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Central Asia Standard Time',
        offset: 360,
        offsetHours: 6,
        displayName: '(UTC+06:00) Astana',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Bangladesh Standard Time',
        offset: 360,
        offsetHours: 6,
        displayName: '(UTC+06:00) Dhaka',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Ekaterinburg Standard Time',
        offset: 360,
        offsetHours: 6,
        displayName: '(UTC+06:00) Ekaterinburg',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Myanmar Standard Time',
        offset: 390,
        offsetHours: 6.5,
        displayName: '(UTC+06:30) Yangon (Rangoon)',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'SE Asia Standard Time',
        offset: 420,
        offsetHours: 7,
        displayName: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'N. Central Asia Standard Time',
        offset: 420,
        offsetHours: 7,
        displayName: '(UTC+07:00) Novosibirsk',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Ulaanbaatar Standard Time',
        offset: 480,
        offsetHours: 8,
        displayName: '(UTC+08:00) Ulaanbaatar',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'China Standard Time',
        offset: 480,
        offsetHours: 8,
        displayName: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Singapore Standard Time',
        offset: 480,
        offsetHours: 8,
        displayName: '(UTC+08:00) Kuala Lumpur, Singapore',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'North Asia Standard Time',
        offset: 480,
        offsetHours: 8,
        displayName: '(UTC+08:00) Krasnoyarsk',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Taipei Standard Time',
        offset: 480,
        offsetHours: 8,
        displayName: '(UTC+08:00) Taipei',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'W. Australia Standard Time',
        offset: 480,
        offsetHours: 8,
        displayName: '(UTC+08:00) Perth',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "KST",
        id: 'Korea Standard Time',
        offset: 540,
        offsetHours: 9,
        displayName: '(UTC+09:00) Seoul',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'North Asia East Standard Time',
        offset: 540,
        offsetHours: 9,
        displayName: '(UTC+09:00) Irkutsk',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Tokyo Standard Time',
        offset: 540,
        offsetHours: 9,
        displayName: '(UTC+09:00) Osaka, Sapporo, Tokyo',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'AUS Central Standard Time',
        offset: 570,
        offsetHours: 9.5,
        displayName: '(UTC+09:30) Darwin',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Cen. Australia Standard Time',
        offset: 570,
        offsetHours: 9.5,
        displayName: '(UTC+09:30) Adelaide',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'West Pacific Standard Time',
        offset: 600,
        offsetHours: 10,
        displayName: '(UTC+10:00) Guam, Port Moresby',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Tasmania Standard Time',
        offset: 600,
        offsetHours: 10,
        displayName: '(UTC+10:00) Hobart',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'E. Australia Standard Time',
        offset: 600,
        offsetHours: 10,
        displayName: '(UTC+10:00) Brisbane',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'AUS Eastern Standard Time',
        offset: 600,
        offsetHours: 10,
        displayName: '(UTC+10:00) Canberra, Melbourne, Sydney',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Yakutsk Standard Time',
        offset: 600,
        offsetHours: 10,
        displayName: '(UTC+10:00) Yakutsk',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Vladivostok Standard Time',
        offset: 660,
        offsetHours: 11,
        displayName: '(UTC+11:00) Vladivostok',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Central Pacific Standard Time',
        offset: 660,
        offsetHours: 11,
        displayName: '(UTC+11:00) Solomon Is., New Caledonia',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "Local",
        id: 'Magadan Standard Time',
        offset: 720,
        offsetHours: 12,
        displayName: '(UTC+12:00) Magadan',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'Kamchatka Standard Time',
        offset: 720,
        offsetHours: 12,
        displayName: '(UTC+12:00) Petropavlovsk-Kamchatsky - Old',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "FST",
        id: 'Fiji Standard Time',
        offset: 720,
        offsetHours: 12,
        displayName: '(UTC+12:00) Fiji',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "NZST",
        id: 'New Zealand Standard Time',
        offset: 720,
        offsetHours: 12,
        displayName: '(UTC+12:00) Auckland, Wellington',
        supportsDaylightSavingTime: true
    },
    {
        abbr: "Local",
        id: 'UTC+12',
        offset: 720,
        offsetHours: 12,
        displayName: '(UTC+12:00) Coordinated Universal Time+12',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "TST",
        id: 'Tonga Standard Time',
        offset: 780,
        offsetHours: 13,
        displayName: '(UTC+13:00) Nuku\'alofa',
        supportsDaylightSavingTime: false
    },
    {
        abbr: "SST",
        id: 'Samoa Standard Time',
        offset: 780,
        offsetHours: 13,
        displayName: '(UTC+13:00) Samoa',
        supportsDaylightSavingTime: true
    }
];
hi5.getCheckDate = function (fromDate, toDate) {
    var from = fromDate.GetProp('value');
    var from_date = new Date(from.substr(0, 4), (Number(from.substr(4, 2)) - 1).toString(), from.substr(6, 2));
    if (toDate) {
        var to = toDate.GetProp('value');
        var to_date = new Date(to.substr(0, 4), (Number(to.substr(4, 2)) - 1).toString(), to.substr(6, 2));
    }
    /*var today = new Date();


    var textObj = { ko: "From 날짜가 To날짜보다 큽니다.", en: "The From date is greater than the To date.", zh: "开始日期大于上次日期" };
    var text1Obj = { ko: "입력 날짜가 오늘 날짜보다 큽니다.", en: "The input date is greater than today's date.", zh: "输入日期大于今天的日期。" };
    var text2Obj = { ko: "To 날짜가 오늘 날짜보다 큽니다.", en: "To date is greater than today's date.", zh: "最后日期大于今天的日期。" };

    var text = textObj[local_lang];
    var text1 = text1Obj[local_lang];
    var text2 = text2Obj[local_lang];


    if (from_date > today) {
        form.MessageBox(text1, $hi5_regional.title.notice, 0, function (rn) {
            fromDate.SetFocus();
        });
        return false;
    } else if (toDate) {
        if (to_date > today) {
            form.MessageBox(text1, $hi5_regional.title.notice, 0, function (rn) {
                toDate.SetFocus();
            });
            return false;
        }
        else if (from_date > to_date) {
            form.MessageBox(text, $hi5_regional.title.notice, 0, function (rn) {
                fromDate.SetFocus();
            });
            return false;
        }
    }*/
    if (from_date > to_date) {
        return false;
    }
    return true;
}


/// <member id="getCodeConvert" kind="method">
/// <summary>키 값에 해당되는 문자열 취득하는 함수</summary>
/// <remarks>각 언어별로 데이터 파일에서 코드값에 해당되는 타이틀 문자열을 취득하는 기능</remarks>
/// <param name = "option" type="object"> 입력 옵션정보. </param>
/// <returns type="string"> 오류 : 빈 문자열, 정상:해당코드의 문자열.</returns>
/// <example><![CDATA[
///     // data.json 파일에 아래 구조인 경우
///      "tradingType":[
///         {"0":  "전체"},
///         {"1":  "매도"},
///         {"2":  "매수"}
///         ],
///    // 코드값을 "1"로 지정한 경우 반환값은 "매도" 한다.
///    // var text = hi5.getCodeConvert({ key:"tradingType", code:"1", codeDisplay:"true"} ) ;
/// ]]></example>
/// </member>
hi5.getCodeConvert = function (option) {
    if ($hi5_comboJson[option.key] != undefined) {
        var arList = $hi5_comboJson[option.key],
            i = 0;
        if (arList && arList.length > 0) {
            for (i = 0; i < arList.length; i++) {
                if (Object.keys(arList[i]) == option.code) {
                    if (hi5admin) {
                        if (option.codeDisplay == false) { // --> [Edit] 수정자:윤성욱 일시:2019/10/10 코드값 안 보이게 하는 옵션 추가
                            return arList[i][option.code][local_lang];
                        } // <-- [Edit] 수정자:윤성욱 일시:2019/10/10 코드값 안 보이게 하는 옵션 추가
                        return option.code + "." + arList[i][option.code][local_lang];
                    } else
                        return arList[i][option.code][local_lang];
                }
            }
        }
    }
    return option.code;
}
hi5.getContext = function (option) {
    // if ($hi5_comboJson[option.key] != undefined) {
    //     var arList = $hi5_comboJson[option.key][0], i = 0;
    //     if (arList && arList[option.code].length > 0) {

    //         return arList[option.code]

    //     }
    // }
    // return option.code;
    if ($hi5_comboJson[option.key] != undefined) {
        var arList = $hi5_comboJson[option.key][0],
            i = 0;
        if (arList && arList[option.code] && arList[option.code].length > 0) {

            return arList[option.code]

        }
    }
    return [];
}

hi5.inputDataCheck = function (objCtrls) {
    if (objCtrls) {
        for (var a = 0; a < objCtrls.length; a++) {
            for (var b = 0; b < objCtrls[a].control.length; b++) {
                var data = objCtrls[a].control[b].GetProp('value', true) || objCtrls[a].control[b].GetProp('caption');
                if (!data || data == "") {
                    var text = (!objCtrls[a].text || objCtrls[a].text == "") ? '' : objCtrls[a].text;
                    text = text + $hi5_regional.text.bincheck;
                    form.MessageBox(text, $hi5_regional.title.notice, 0, function (rn) {
                        objCtrls[a].control[b].SetFocus();
                    });
                    return false;
                }
            }
        }
    }
    return true;
}

hi5.nextFocusCheck = function (that, currenttabindex, nextfocusobj, prefocusobj, prev) {
    var elem = $("#" + nextfocusobj.id)[0];
    if (!elem) return;
    var bDisabled = elem.getAttribute("disabled") == "disabled" ? true : false || elem.disabled == true;
    if (elem.style.visibility == "hidden" || elem.style.display == "none" || bDisabled) {
        if (nextfocusobj == prefocusobj) return;
        if (prev)
            that.MoveToPreFocus(currenttabindex - 1, nextfocusobj);
        else
            that.MoveToNextFocus(currenttabindex + 1, nextfocusobj);
    } else {
        if (nextfocusobj != null && nextfocusobj.SetFocus) {
            // 2019.09.04 kws
            // 상위 그룹박스가 display none일 경우에 SetFocus가 유실된다.
            // 상위 그룹박스들 중 하나라도 display none일 경우 다음 컨트롤을 찾는다.
            var $groupBoxs = nextfocusobj.$html.parents('.hi5_groupbox');
            if ($groupBoxs && $groupBoxs.length > 0) {
                for (var x = 0; x < $groupBoxs.length; x++) {
                    var $groupBox = $groupBoxs[x];
                    if ($($groupBox).css('display') == 'none') {
                        if (prev)
                            that.MoveToPreFocus(currenttabindex - 1, nextfocusobj);
                        else
                            that.MoveToNextFocus(currenttabindex + 1, nextfocusobj);
                        return;
                    }
                }
            }
            nextfocusobj.SetFocus();
        }

        return;
    }
}
hi5.getAjaxData = function (option, success_callback, error_callback) {
    if (!option.trcode) return false;

    var apiurl, apipath = "",
        apiparam = {};
    // 엑셀 다운로드 서비스 인경우 로그인 사용자ID와 접속매체 전송
    if (option.trcode == "/callAPI/atsList") {
        option.param['_userid'] = hi5.GetSharedMemory("@USER_ID") || "";
        option.param['sso_media'] = hi5.WTS_MODE == WTS_TYPE.MDI ? "a" : 'W';
    }
    //입력값 확인
    if (option.path) {
        for (var y = 0; y < option.path.length; y++) {
            var pathname = option.path[y];
            apipath += "/" + encodeURIComponent(encodeURIComponent(pathname));
            //apipath += "/" + pathname;
        }
    }
    if (!option.ajaxType) option.ajaxType = "GET";
    if (option.trcode) {
        apiurl = option.trcode + apipath;
    } else {
        apiurl = option.trcode + apipath;
    }

    var href = $(location).attr('hostname');
    if (href == 'localhost') apiurl = "http://106.10.34.106" + apiurl;

    var sendData = option.param;
    if (sendData) {
        sendData["ver"] = (new Date()).getTime().toString();
        if (option.ajaxType == "POST") {
            sendData = JSON.stringify(sendData);
        }
    } else {
        sendData = {
            ver: (new Date()).getTime().toString()
        };
    }
    var ajaxOptions = {
        type: option.ajaxType,
        //crossOrigin : true,
        url: apiurl,
        headers: hi5.getHttpHeader(),
        data: sendData,
        timeout: 40000, //20초 타임아웃 20초 -> 30초 -> 40초
        contentType: "application/json;", //전송데이터 방식
        dataType: "text", //응답받을 데이터 방식
        global: false, // 항상고정
        beforeSend: function (xhr) {
            return true;
        },
        complete: function (xhr, stat) {
            return true;
        },

        success: function (rpObj, textStatus, jqXHR) {
            //console.log('--------------------HTTP RESPONSE-------------------------');
            //성공시 반환
            //console.log(rpObj);
            if (rpObj != "") {
                rpObj = JSON.parse(rpObj);
            }
            //console.log(rpObj);
            hi5.logTrace({
                tr_tp: TR_TP.REPLY,
                dataType: "JSON",
                data: {
                    objJSON: rpObj,
                    responseText: jqXHR.responseText
                },
                message: "##comm##  " + textStatus
            });
            if (success_callback) {
                success_callback(rpObj, option);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log('--------------------HTTP RESPONSE ERROR!!!----------------------');
            //에러시 반환
            //console.log(textStatus);
            //console.log(errorThrown);
            //console.log(jqXHR.responseText);
            var msgObj;
            if (textStatus == "timeout") { // 2019.03.20 kws -> timeout시에는 responseText가 undefined이다.
                msgObj = {
                    "reason": "System",
                    "messageNo": -1,
                    "message": "Service Timeout."
                };
            } else {
                if (!jqXHR.responseText) {
                    msgObj = {
                        "reason": "System",
                        "messageNo": -1,
                        "message": "Service Error!!!"
                    };
                } else {
                    if (jqXHR.responseText.substring(0, 1) == "<") {
                        msgObj = {
                            "reason": "System",
                            "messageNo": -1,
                            "message": "Page Not Found"
                        };
                    } else {
                        try {
                            msgObj = JSON.parse(jqXHR.responseText);
                        } catch (e) {
                            msgObj = {
                                "reason": jqXHR.responseText,
                                "messageNo": -1,
                                "message": jqXHR.responseText
                            };
                        }
                    }
                }
            }
            hi5.logTrace({
                tr_tp: TR_TP.REPLY,
                dataType: "JSON",
                data: {
                    objJSON: msgObj,
                    jqXHR: jqXHR
                },
                message: "##comm##  " + textStatus
            });

            //var msgObj = JSON.parse(jqXHR.responseText);
            if (error_callback)
                error_callback(msgObj, textStatus, errorThrown, option);
        }
    };
    //console.log("##comm##  " + JSON.stringify(ajaxOptions));
    hi5.logTrace({
        tr_tp: TR_TP.REQUEST,
        dataType: "JSON",
        data: ajaxOptions,
        message: "##comm##  "
    });

    //var jqxhr = $.ajax(ajaxOptions);
    var jqxhr = $.ajax(ajaxOptions);
    return jqxhr;
}

hi5.getHttpHeader = function () {
    return this.httpHeader || {};
}

hi5.pageDisplay = function (objCtrls) {
    if (objCtrls) {
        var displayData = objCtrls.GetProp('caption');
        if (displayData == '0' || displayData == '' || !displayData)
            objCtrls.SetProp('caption', '20');
    }
}

hi5.ajaxPage = function (control, data) {
    if (control.pagination) {
        if (control._gPQ && control._gPQ.options && control._gPQ.options.scrollModel)
            control._gPQ.options.scrollModel.autoFit = false;
        //debugger;
        let totalRecords;
        let pageNum = control.pageNum;
        let pFlag = control.pFlag;
        let rpp = data.numberOfElements; // 한번에 불러올 데이터 양
        let pagecount = control.pagecount; // 페이지네이션 버튼 갯수
        let curPage = control.curPage;
        let initdata = data;
        if (data.number == 0) { // 최초조회
            pageNum = null;
        }
        // 예외처리
        if (pageNum === null) { // 최초조회
            //debugger;
            totalRecords = data.totalElements ? data.totalElements : null;
            if (totalRecords) {
                pageNum = Math.ceil(totalRecords / rpp);
                control.pageNum = pageNum;

                let option = {
                    rpp: rpp,
                    curPage: 1,
                    pagecount: pagecount,
                    pFlag: true
                };
                control.setPagination(initdata, option, 'ajax');

            }
        } else { // 페이지 변경
            let option = {
                rpp: rpp,
                curPage: curPage,
                pagecount: pagecount,
                pageNum: pageNum,
                pFlag: pFlag
            };
            control.setPagination(initdata, option, 'ajax');

        }

    }

}
hi5.copyToClipboard = function (text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        //textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.

        textarea.setAttribute('readonly', '');
        textarea.style = {
            position: 'absolute',
            left: '-9999px'
        };
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}
hi5.contextAction = function (evt, ui, item) {
    var obj = {
        code: ui.rowData.userid || ui.rowData.usid,
        menuid: item.menuid,
        tabid: item.tabid
    };
    var openmenu = g_mdiArray.filter(function (menu) {
        return menu.menuId == obj.menuid
    });
    if (openmenu.length == 0 || g_hi5_config.newContext == true)
        form.OpenScreen({
            menuid: obj.menuid,
            tagName: "open",
            initdata: obj
        });
    else {
        $(".hi5_win_main").removeClass('active');
        $("#" + openmenu[0].id).addClass('active');
        $("#" + openmenu[0].id).css('z-index', hi5.GetMaxZindex());
        focusedWindow = openmenu[0].id;
        form.PostLinkData("contextmenu", obj, {
            allSend: true
        });
    }
}

/// <member id="getAPI" kind="method">
/// <summary>타사 api 호출시 사용</summary>
/// <param name="url" type="array">api를 배열로 요청[주소1, 주소2,...]</param>
/// <param name="success_callback" type="function">성공시 callback 함수</param>
/// <param name="error_callback" type="function">에러시 callback 함수</param>
/// <example><![CDATA[
///         var sendata = [
///             "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
///             "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
///             ];
///         hi5.getAPI(senddata, function(data){ }, function(error){ });
/// ]]></example>
/// </member>
hi5.getAPI = function (urlArr, success_callback, error_callback) {
    var binanceUrl = 'http://106.10.34.106:8080/getApi';
    if (hi5_dev_mode != "dev") binanceUrl = 'https://www.bispex.com:8080/getApi';
    $.ajax({
        type: 'POST',
        url: binanceUrl,
        data: JSON.stringify(urlArr),
        contentType: 'application/json',
        dataType: 'json',
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log('--------------------HTTP RESPONSE ERROR!!!----------------------');
            //에러시 반환
            var msgObj;
            if (textStatus == "timeout") { // 2019.03.20 kws -> timeout시에는 responseText가 undefined이다.
                msgObj = {
                    "reason": "System",
                    "messageNo": -1,
                    "message": "Service Timeout."
                };
            } else {
                if (!jqXHR.responseText) {
                    msgObj = {
                        "reason": "System",
                        "messageNo": -1,
                        "message": "Service Error!!!"
                    };
                } else {
                    if (jqXHR.responseText.substring(0, 1) == "<") {
                        msgObj = {
                            "reason": "System",
                            "messageNo": -1,
                            "message": "Page Not Found"
                        };
                    } else {
                        msgObj = JSON.parse(jqXHR.responseText);
                    }
                }
            }

            //var msgObj = JSON.parse(jqXHR.responseText);
            if (error_callback)
                error_callback(msgObj, textStatus, errorThrown);
        },
        success: function (rpObj, textStatus, jqXHR) {
            //console.log('--------------------HTTP RESPONSE-------------------------');
            //성공시 반환
            try {
                rpObj = JSON.parse(rpObj);
                if (success_callback) {
                    success_callback(rpObj);
                }
            } catch (e) {
                if (success_callback) {
                    success_callback(rpObj);
                }
            }
        },
        fail: function (err) {
            console.log(err);
        }
    });
}

hi5.SlideToggle = function (mainCtr, subCtr) {
    mainCtr.$html.click(function () {
        subCtr.$html.slideToggle('fast', function (a) {
            if (subCtr.$html.is(":hidden")) {

            } else {

            }
        });

    });
}

hi5.changePosition = function (theme) {
    var p_obj = hi5.theme_position[theme];
    var cls_array = Object.keys(p_obj);
    for (var a = 0; a < cls_array.length; a++) {
        var cls = cls_array[a];

        if (p_obj[cls].position)
            $("." + cls).css(p_obj[cls].position);
        if (p_obj[cls].size)
            $("." + cls).css(p_obj[cls].size);
        if (p_obj[cls].style)
            $("." + cls).css(p_obj[cls].style);

    }
    /*클릭주문 강제 보기*/
    if (window.hi5_DebugLevel) {
        if (window.hi5_DebugLevel.CLICK) {
            if (theme == 'expert')
                $('.righttab').css({
                    'display': 'block',
                    'z-index': '2'
                });
            else
                $('.righttab').css('display', 'none');
        }
    }
}

/// <member id="getBalance" kind="method">
/// <summary>cenblock 17213 서비스 호출</summary>
/// <param name="input" type="object">입력값을 추가로 넣을수 있도록 객체를 넘긴다.</param>
/// <param name="fn" type="function">callback 함수</param>
/// <example><![CDATA[
///         hi5.getBalance(input, function(data){ });
/// ]]></example>
/// </member>
hi5.getBalance = function (input, fn) {
    var fireCallbackFunc = function () {
        if (!fn) return false;
        if (input.get) { // 메모리에서 가져오도록 하는 옵션. 단, 메모리에 없으면 서비스를 호출.
            if (hi5.SHMEM.balance) { // 메모리에 값이 있으면 메모리에서 빼오는 옵션이다.
                fn(hi5.SHMEM.balance);
                return true;
            }
        }
        if (input.back) {
            if (hi5.SHMEM.balance2) { //outrec2에 해당하는 데이터
                fn(hi5.SHMEM.balance2);
                return true;
            }
        }
        return false;
    };

    if (fireCallbackFunc()) return;

    if (hi5.GetSharedMemory("@USER_ID") == "") return;
    var objTranData = {
        trcode: "17213", // balance 화면
        input: {
            "InRec1": {
                "usid": hi5.GetSharedMemory("@USER_ID"),
                "proc_gb": "2"
            } // 필수입력값
        }
    };
    $.extend(true, objTranData.input, input);
    hi5.commRq(objTranData, function (retObj) {
        if (retObj.status == 'success') {
            hi5.SHMEM["balance2"] = retObj.data.OutRec2;
            var balanceObj = retObj.data.OutRec1;
            balanceObj["totalJan"] = 0;
            balanceObj["availableJan"] = 0;
            var btcRate = balanceObj.btc_curprice;
            for (var key in balanceObj) {
                if (key != 'btc_curprice' && key != 'totalJan' && key != 'availableJan') {
                    balanceObj[key + "_btc"] = parseFloat(balanceObj[key]) * parseFloat(btcRate);
                    if (key == "local_jqty" || key == "fut_jqty" || key == "ins_jqty") { // 값은 직접 넣어줘야한다.
                        balanceObj.totalJan += parseFloat(balanceObj[key]); // 총 자산 btc
                    } else if (key == "local_transfer_jqty" || key == "fut_transfer_jqty" || key == "ins_transfer_jqty") {
                        balanceObj.availableJan += parseFloat(balanceObj[key]); // 총 주문가능 자산 btc
                    }
                }
            }
            balanceObj["totalJan_btc"] = balanceObj.totalJan * parseFloat(btcRate);
            balanceObj["availableJan_btc"] = balanceObj.availableJan * parseFloat(btcRate);
            hi5.SHMEM["balance"] = balanceObj;


        }

        if (!fireCallbackFunc()) {
            if (fn) fn(retObj);
        }
    })
}

hi5.uiTooltip = function ($tp, tooltip, fn, show) {
    var option = tooltip.option ? tooltip.option : null;

    if (option) {
        if (!option.items)
            option['items'] = '.hi5-c-ui-tooltip[title]';
    } else {
        option = {};
        option['items'] = '.hi5-c-ui-tooltip[title]';
    }

    $tp.attr("title", "");
    var tooltip = $tp.tooltip(option),
        instance;
    instance = $tp.tooltip("instance");

    if (!option.content) {
        $tp.tooltip("option", "content", function () {
            var $target = $(this);
            instance = $target.tooltip("instance");

            instance.liveRegion.remove();
            if (fn) {
                return fn($target);
            }
            //return '</span><div class="tooltipTitle">' + that.customtooltip.caption + '</div>' + that.customtooltip.title + '</span>'
        })
    }
    // 바로 툴팁을 표시한다.
    if (show) {
        $tp.tooltip("open")
        $tp.attr("title", "");
    }
    return instance;

}

hi5.getInsuranceCode = function (itemName) {
    for (var key in g_masterInfo) {
        if (g_masterInfo[key].item_sect == ITEM_SECT.FUT && g_masterInfo[key].insurance_yn == "Y") {
            if (itemName) return g_masterInfo[key][itemName];
            else return g_masterInfo[key];
        }
    }
}

//TP/SL 컬럼 표시방식 변경
//stls_bbgb(청산구분) - 1:청산(Close On Trigger), 2:신규, 8:주문StopLoss, 9:잔고StopLoss( 잔고포지션 변경)
//값이 2일때는 익절가,손절가 둘중 하나만 표기(데이터가 있는걸로)
// 1,8,9 일때는 지금과 같이 익절가 / 손절가 로 표시
// 그 외의 값일때는 ""로 표시
hi5.getRenderTpsl = function (rowObj) {
    if (rowObj) {
        var gb = rowObj.stls_bbgb,
            slby_gb = rowObj.slby_gb,
            stgb = rowObj.stls_stgb;
        var formatStlsPrc = {
            gubun: 1,
            comma: 1,
            decimal: 0
        };
        //매수 매도 구분에 따라, 이익일때 >=, 손절일때 <= 부호 표기
        if (gb == "2") { //신규 , 익/손절 둘중 하나만 표기
            if (slby_gb == "1") { //매도일때
                if (stgb == "2") formatStlsPrc.prefix = "<= "; //손절
                else if (stgb == "1") formatStlsPrc.prefix = ">= "; //익절
            } else if (slby_gb == "2") { //매수일때
                if (stgb == "2") formatStlsPrc.prefix = ">= "; //익절
                else if (stgb == "1") formatStlsPrc.prefix = "<= "; //손절
            }

            if (rowObj.ik_near_prc.atof() != 0) {
                return maskstr.GetMaskValue(formatStlsPrc, rowObj.ik_near_prc);;
            } else if (rowObj.lo_near_prc.atof() != 0) {
                return maskstr.GetMaskValue(formatStlsPrc, rowObj.lo_near_prc);;
            } else {
                return "-";
            }
        } else if (gb == "1" || gb == "8" || gb == "9") {
            var loPrc, ikPrc;
            if (rowObj.lo_near_prc == 0 || rowObj.lo_near_prc == '-') {
                loPrc = '-';
            } else {
                loPrc = maskstr.GetMaskValue(formatStlsPrc, rowObj.lo_near_prc);
            }

            if (rowObj.ik_near_prc == 0 || rowObj.ik_near_prc == '-') {
                ikPrc = '-';
            } else {
                ikPrc = maskstr.GetMaskValue(formatStlsPrc, rowObj.ik_near_prc);
            }
            return ikPrc + ' / ' + loPrc;
        }
    }
    return "";
}

// 2019.09.26 kws
// html 안에 특수기호 치환 자주 쓰는것 위주
// ^ &Hat;
// ' &apos;
// > &gt;
// < &lt;
// ; &semi;
// & &amp;
// " &quot;
// # &num;
hi5.replaceHTMLText = function (str) {
    //str = str.replace(/^/g,"&Hat;");
    str = str.replace(/'/g, "&apos;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/\"/g, "&quot;");
    str = str.replace(/\'/g, "&num;");
    str = str.replace(/\n/g, "<br />");
    return str;
}

// 2019.10.11 kws
// 모바일과 PC에서 전체 로딩바 표시/삭제
hi5.setScreenWait = function (bStart) {
    if (!bStart) bStart = false;
    if (typeof (window.commitVuexData) == 'function')
        window.commitVuexData('setShowLoading', bStart);
}

// 2020-04-10 강평평 
/// <member id="getStrLen" kind="method">
/// <summary>입력문자열의 충길이 및 (언어별 글자수, 숫자개수, space빈간개수, 특수문자개수)를 object로 반환하는 함수</summary>
/// <param name = "str" type="string">  </param>
/// <returns type="object"> 문자열의 충길이, 언어별 문자, 숫자, 빈간, 특수문자</returns>
/// <example><![CDATA[
///  // 예제
/// var nLen = hi5.getStrLen("대한민국23ab中国 人そば");
///  //반환값은 {
///      strLength: 14,
///      chineseCount: 3,              
///      koreaCount: 4,                
///      letterCount: 2,               
///      jepanCount: 2,                
///      numCount: 2,
///      spaceCount: 1,                 
///      specialCharacter: 0                       
///  }
/// var nLen = hi5.getStrLen("대한");
///  //반환값은 {
///      strLength: 2,
///      chineseCount: 0,              
///      koreaCount: 2,                
///      letterCount: 0,               
///      jepanCount: 0,                
///      numCount: 0,   
///      spaceCount: 0,                 
///      specialCharacter: 0     
///   }
/// ]]>/</example>
/// </member>
/* hi5.getStrLen = function (str) {
    if (str == "")
        return 0;

    var totalCount = str.length;
    var reg1 = /[\u4e00-\u9fa5]/g;      // 중국어
    var reg2 = /[\uAC00-\uD7A3]/g;      // 한국어
    var reg3 = /[a-zA-Z]/g;             // 영어
    var reg4 = /[\u0800-\u4e00]/g;      // 일본어
    //var  reg5 = /^[0-9]*$/g;          // 정수숫자(23이면 하나로 체크됨, 2개가 아님)
    var reg6 = /\s/g;                   // 공백체크
    var reg7 = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g;  // 특수문자

    var objCount = {
        strLength: totalCount,         // 입력문자열의 충길이
        chineseCount: 0,               // 중국어 글자수 
        koreaCount: 0,                 // 한국어 글자수
        englishCount: 0,               // 영어   글자수
        jepanCount: 0,                 // 일본어 글자수
        numCount: 0,                   // 숫자  개수
        spaceCount: 0,                 // (space)빈간 개수
        specialCharacter: 0            // 특수문자 개수 
    };
    

    for(var i=0;i<str.length;i++){
        var _char = str.charCodeAt(i);  // 숫자    
   
        if(_char>47 && _char<58){       // 23이면 숫자 2개로 체크됨. 0~9는 48~57 
            objCount.numCount++;          
        }   
    }

    if(str.match(reg1)!=null){
        objCount.chineseCount = str.match(reg1).length;
    }
    if(str.match(reg2)!=null){
        objCount.koreaCount = str.match(reg2).length;
    }
    if(str.match(reg3)!=null){
        objCount.englishCount = str.match(reg3).length;
    }
    if(str.match(reg4)!=null){
        objCount.jepanCount = str.match(reg4).length;
    }
    if(str.match(reg6)!=null){
        objCount.spaceCount = str.match(reg6).length;
    }
    if(str.match(reg7)!=null){
        objCount.specialCharacter = str.match(reg7).length;
    }
     return objCount;
}

*/