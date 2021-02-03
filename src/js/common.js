/*
* 공통기능 정의 파일
* Version: 1.0.0
* Author: kim change ha
* Created: 2017.3.15
* Revisions:
*
* Copyright @ Korea Sorimachi Co.,Ltd. All Rights Reserved.
*/

"use strict";

//safari 브라우저 DOMParser 생성
(function(DOMParser) {
    "use strict";
    var DOMParser_proto = DOMParser.prototype
      , real_parseFromString = DOMParser_proto.parseFromString;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (ex) {}

    DOMParser_proto.parseFromString = function(markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var doc = document.implementation.createHTMLDocument("")
              , doc_elt = doc.documentElement
              , first_elt;

            doc_elt.innerHTML = markup;
            first_elt = doc_elt.firstElementChild;

            if (doc_elt.childElementCount === 1
                && first_elt.localName.toLowerCase() === "html") {
                doc.replaceChild(first_elt, doc_elt);
            }

            return doc;
        } else {
            return real_parseFromString.apply(this, arguments);
        }
    };
}(DOMParser));


// 트랜 아이템의 데이터 타입 정의
var  FT_BYTE = 0;              // unsigned char(8bit)
var FT_SHORT = 1;            // int16
var FT_USHORT = 2;           // unsigned int16 
var FT_LONG = 3;             // int32
var FT_ULONG = 4;            // unsigned int32 
var FT_FLOAT = 5;            // float  (4 bytes)
var FT_DOUBLE = 6;           // double (8 bytes)
var FT_LONGLONG = 7;		    // int64  (8 bytes)  
var FT_STRING = 8;			// 일반 텍스트
var FT_STRINGNUM = 9;		    // 숫자형 문자열
var FT_DATE = 10;			    // 날자형
var FT_FILLER = 10;           // Filler
var FT_DAY = 11;				// 일자형 
var FT_TIME = 12;				// 시간형 

// 서버통신시에 데이터 종류
var COOM_DATATYPE_FID = 0;     // FID
var COOM_DATATYPE_TRAN = 1;     // TRAN
var COOM_DATATYPE_JSON = 2;     // JSON



var typeItemdefs = {
    0: 0x20,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: "",
    9: "",
    10: 0,
    11: 0,
    12:0
};

// 화면정보 xml 파일을 HTML형식으로 변환하는 기능
var x2h = {};

// 칼라 인덱스 관련 기능
var clridx = {};

//칼라테마 인덱스
var themeindex = 0;

//Mask 처리
var maskstr = {};

// screenversion Info
var g_hi5ScreenVersion;

(function (global, undefined) {
    "use strict";
    /**
     * @public
     * @constructs Struct
     * @classdesc C-Like Data Structure for JavaScript.
     *
     * @author Joon Kyoung <firejune@gmail.com>
     * @license MIT
     * @version 0.9.1
     * @see Struct.js on GitHub <https://github.com/firejune/struct.js>
     *
     * @param {object} struct
     * @param {*} value
     * @param {boolean} endianness
     *
     */
    var Struct = function (struct, value, endianness) {
        /** @type {boolean} */
        this.endianness = endianness === undefined && true || endianness; // true is Little-endian
        /** @type {*} */
        this.defaultValue = value || 0;

        /** @type {object} */
        this.struct = normalize(struct, this.defaultValue);
        /** @type {number} */
        this.byteLength = getByteLength(this.struct);
        /** @type {arrayBuffer} */
        this.emptyBuffer = new ArrayBuffer(this.byteLength);

        /** @type {object} */
        this.constructor = Struct;
        /**
         * @type {boolean}
         * @private
         */
        this._debug = false;
        /**
         * @type {object}
         * @private
         */
        this._struct = {};

        this._debug && console.log(
            'STRUCT.CREATE'
          , 'defaultValue:', this.defaultValue
          , 'byteLength:', this.byteLength
          , 'endianness:', this.endianness
          , 'struct:', this.struct);
    };


    Struct.prototype = /** @lends Struct# */ {
        /**
         * @param {object} struct object
         * @return {object} updated struct
         */
        update: function (struct) {
            this.struct = update(this.struct, struct || {});
            this.byteLength = getByteLength(this.struct);
            this.emptyBuffer = new ArrayBuffer(this.byteLength);

            return clone(this.struct);
        },

        /**
         * @param {arrayBuffer} buffer
         * @param {number} offset
         * @param {string [optional]} encoding   [A2U, U2A]
         * @return {object} parsed data
         * @exception Will throw an error if uncaught index size
         */
        read: function (arrayBuffer, offset, encoding) {
            if (arrayBuffer === undefined && offset === undefined) {
                return align(this.struct, function (item, prop, struct) {
                    struct[prop] = item[1];
                });
            }

            var that = this
              , encoding = encoding    // U2A, A2A
              , endianness = this.endianness
              , dv = arrayBuffer instanceof DataView && arrayBuffer || new DataView(arrayBuffer);

            if (arrayBuffer.byteLength === 0) {
                return new Error('Uncaught IndexSizeError: Buffer size was zero byte.');
            }

            /*
            if (arrayBuffer.byteLength < this.byteLength) {
              return new Error('Uncaught IndexSizeError: Buffer size was negative.');
            }
            */

            /** @type {number} */
            this.offset = offset || 0;

            this._debug && console.info(
                'STRUCT.READ'
              , 'byteLength:', arrayBuffer.byteLength
              , 'readOffset:', this.offset);

            var readed = align(this.struct
            /** @exception Will throw an error if uncaught index size */
            , function (item, prop, struct) {
                var values = []
                  , typed = item[0]
                  , value = item[1]
                  , length = item[2]
                  , vary = item[3]
                  , size = typedefs[typed] || 1
                  , lengthTyped = 'uint8'
                  , i = 0;

                if (isString(length)) {
                    lengthTyped = length;
                    length = value.byteLength || value.length;
                }

                if (arrayBuffer.byteLength <= that.offset) {
                    return new Error('Uncaught IndexSizeError: Index or size was negative.');
                }

                if (vary === true) {
                    try {
                        // FIXME: throwing RangeError
                        length = dv['get' + capitalize(lengthTyped)](that.offset, endianness) / size;
                    } catch (e) {
                        console.error(e, that.offset, that.offset + size, arrayBuffer.byteLength);
                        return new Error(e);
                    }

                    that.offset += typedefs[lengthTyped];

                    that._struct[prop + 'Size'] = [lengthTyped, length * size];
                    that._debug && console.log(prop + 'Size', that._struct[prop + 'Size'], that.offset);
                }

                if (isArrayBuffer(value)) {
                    var endOffset = that.offset + length * size;

                    if (arrayBuffer.byteLength < endOffset) {
                        return new Error('Uncaught IndexSizeError: Index or size was negative.');
                    }

                    values = arrayBuffer.slice(that.offset, endOffset);
                    //console.log(arrayBuffer.byteLength, values.byteLength, length);
                    that.offset += length * size;
                } else {
                    while (i < length) {
                        if (isStruct(typed)) {
                            var buffer = arrayBuffer.slice(that.offset);
                            values[i] = typed.read(buffer);
                            size = typed.byteLength;
                        } else {
                            if (that.offset + size > arrayBuffer.byteLength) {
                                values[i] = new Error('Uncaught IndexSizeError: Index or size was negative.');
                            } else {
                                values[i] = dv['get' + capitalize(typed)](that.offset, endianness);
                            }
                        }
                        if (isError(values[i])) return values[i];

                        that.offset += size;
                        i++;
                    }
                }

                // for vary types
                if (isArrayBuffer(value) && encoding == "A2U") {
                    struct[prop] = hi5.A2U(values);  // MultiByte->UTF8
                }
                else if (isArrayBuffer(value) && isString(value) || isArray(value) || length > 1) {
                    struct[prop] = isString(value) ? charCodeArrToStr(values) : values;
                } else {
                    struct[prop] = values[0];
                }
                that._struct[prop] = [typed, struct[prop]];
                that._debug && console.log(prop, that._struct[prop], that.offset);
            }); // align

            if (!isError(readed)) {
                this.byteLength = this.offset;
                this.offset != arrayBuffer.byteLength && readed.type >= 200 && this.offset != 6 &&
                  console.warn('Incorrect buffer size readed', this.offset, arrayBuffer.byteLength, readed);
            }

            return isError(readed) && readed || clone(readed);
        },

        /**
         * @param {object} struct object
         * @return {arrayBuffer} wrated buffer
         */
        write: function (struct) {
            var that = this
              , offset = 0
              , endianness = this.endianness;

            if (struct !== undefined) {
                this.update(struct);
            }

            var dataView = new DataView(this.emptyBuffer);

            this._debug && console.info(
                'STRUCT.WRITE'
              , 'byteLength:', this.byteLength);

            align(this.struct, function (item, prop) {
                var values = []
                  , typed = item[0]
                  , value = item[1]
                  , length = item[2]
                  , vary = item[3]
                  , size = typedefs[typed]
                  , lengthTyped = 'uint8'
                  , i = 0;

                if (size === undefined && isStruct(typed)) {
                    lengthTyped = length;
                    length = value.length;
                    size = 1;
                }

                if (isString(length) || isString(value)) {
                    lengthTyped = length;
                    length = value.length;
                }

                if (isArrayBuffer(value)) {
                    length = value.byteLength;
                }

                if (vary === true) {
                    dataView['set' + capitalize(lengthTyped)](offset, length * size, endianness);
                    offset += typedefs[lengthTyped];
                    that._struct[prop + 'Size'] = [lengthTyped, length * size];
                    that._debug && console.log(prop + 'Size', that._struct[prop + 'Size'], offset);
                }

                that._struct[prop] = [typed, value];

                // for vary types
                if (isArrayBuffer(value) || isString(value) || isArray(value) || length > 1) {
                    if (isArrayBuffer(value)) values = arrayBufferToArray(value, typed);
                    if (isFunction(value)) values = [that.defaultValue];
                    if (isArray(value)) values = value;
                    values = value && isString(value) && strToCharCodeArr(value) || values;
                } else {
                    values = [value];
                }

                while (i < length) {
                    if (isStruct(typed)) {
                        var buffer = typed.write(values[i])
                          , tmp = new Uint8Array(buffer)
                          , j = 0;

                        while (j < tmp.length) {
                            dataView.setUint8(offset + j, tmp[j]);
                            j++;
                        }
                        offset += tmp.length;

                    } else {

                        dataView['set' + capitalize(typed)](offset, values[i], endianness);
                        offset += size;
                    }
                    i++;
                }

                that._debug && console.log(prop, that._struct[prop], offset);
            }); // align

            offset != this.emptyBuffer.byteLength && console.warn('Incorrect buffer size writed');
            return dataView.buffer;
        }
    };


    /**
     * Inner functions
     */

    /**
     * @memberof Struct~
     * @enum {number}
     */
    var typedefs = {
        int8: 1, uint8: 1,
        int16: 2, uint16: 2,
        int32: 4, uint32: 4, float32: 4,
        int64: 8, uint64: 8, float64: 8
    };

    /**
     * @memberof Struct~
     * @param {*} object
     * @return {boolean} corrected
     */
    function isStruct(a) {
        return !!a && a.constructor === Struct;
    }

    /**
     * @memberof Struct~
     * @param {*} object
     * @return {boolean} corrected
     */
    function isError(a) {
        return !!a && a.constructor === Error;
    }

    /**
     * @memberof Struct~
     * @param {*} object
     * @return {boolean} corrected
     */
    function isUndefined(a) {
        return a === undefined;
    }

    /**
     * @memberof Struct~
     * @param {*} object
     * @return {boolean} corrected
     */
    function isNull(a) {
        return a === null;
    }

    /**
     * @memberof Struct~
     * @param {*} object
     * @return {boolean} corrected
     */
    function isArray(a) {
        //return Array.isArray(a);
        return !!a && (a === Array || a.constructor === Array);
    }

    /**
     * @memberof Struct~
     * @param {*} object
     * @return {boolean} corrected
     */
    function isObject(a) {
        return !!a && (a === Object || a.constructor === Object);
    }

    /*
    function isNumber(a) {
      return !!a && a === Number || a.constructor === Number;
    }
    */

    /**
     * @memberof Struct~
     * @param {*} object
     * @return {boolean} corrected
     */
    function isString(a) {
        return !!a && (a === String || a.constructor === String);
    }

    /**
     * @memberof Struct~
     * @param {*} object
     * @return {boolean} corrected
     */
    function isFunction(a) {
        return !!a && (a === Function || a.constructor === Function);
    }

    /**
     * @memberof Struct~
     * @param {*} object
     * @return {boolean} corrected
     */
    function isArrayBuffer(a) {
        return !!a && (a === ArrayBuffer || a.constructor === ArrayBuffer);
    }

    /**
     * @memberof Struct~
     * @param {string} name
     * @return {boolean} corrected
     */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * @param {object} struct model
     * @param {function} callback
     * @return {object} struct
     */
    function align(model, callback) {
        var struct = {}
          , error = null;

        for (var p in model) {
            if (model.hasOwnProperty(p)) {
                var item = model[p];
                if (isObject(item)) {
                    struct[p] = align(item, callback);
                } else {
                    error = callback(item, p, struct);
                    if (error) {
                        struct = error;
                        break;
                    }
                }
            }
        }
        return struct;
    }

    /**
     * @memberof Struct~
     * @param {object} source
     * @param {object} target
     * @return {object} mixed
     */
    function update(model, obj) {
        for (var p in obj) {
            if (model.hasOwnProperty(p)) {
                if (isObject(model[p])) {
                    model[p] = update(model[p], obj[p]);
                } else {
                    model[p][1] = obj[p];
                }
            }
        }
        return model;
    }

    /**
     * @memberof Struct~
     * @param {object} source
     * @return {object} cloned struct
     */
    function clone(obj) {
        var struct = {};
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                struct[p] = obj[p];
            }
        }
        return struct;
    }

    /**
     * @memberof Struct~
     * @param {object} model
     * @param {*} value
     * @return {void} nothing
     */
    function normalize(model, defaultValue) {
        return align(model, function (params, prop, struct) {
            // [0] typed, define correct typed string or sctruct object form params
            var _typed = isArray(params) && params[0] || params
              , typed = isStruct(_typed) && _typed || _typed.toLowerCase()
              // [1] value, define single, multiple, vary value form params
              , value = isString(params) ? defaultValue : params[1]
              // [2] length, define correct length of value by typed(not byteLength) or vary typed string
              , length = isArray(params) && params.length >= 3 && params[2]
                || (isString(value) || isArray(value) || isArrayBuffer(value)) && value.length //FIXME 0일 수도 있음
                || isArrayBuffer(value) && value.byteLength || 1
              // [3] vary, define boolean as vary type from params
              , vary = isArray(params) && (isString(length) || length > 1)
                ? isString(length) && params[3] === undefined && true || params[3] : false;

            if (isUndefined(value) || isNull(value)) value = '';

            struct[prop] = [typed, value, length, vary];
        });
    }

    /**
     * @memberof Struct~
     * @param {object} struct
     * @return {number} byte length
     */
    function getByteLength(struct) {
        var byteLength = 0;

        align(struct, function (item) {
            var typed = item[0]
              , value = item[1]
              , length = item[2]
              , vary = item[3]
              , size = typedefs[typed]
              , lengthTyped = 'uint8';

            if (size === undefined && isStruct(typed)) {
                size = typed.byteLength;
            }

            if (isString(length) || isString(value)) {
                lengthTyped = length;
                length = value && value.length || 0;
            }

            if (isArrayBuffer(value)) {
                //length = value.byteLength;
                length = value.byteLength || 0;
            }

            if (vary === true) byteLength += typedefs[lengthTyped];

            byteLength += length * size;
        });

        return byteLength;
    }

    /**
     * @memberof Struct~
     * @param {string} char
     * @return {array.<number>} char codes
     */
    function strToCharCodeArr(str) {
        var arr = []
          , len = str.length
          , idx = 0;

        while (idx < len) {
            arr[idx] = str.charCodeAt(idx);
            idx++;
        }

        return arr;
    }

    /**
     * @memberof Struct~
     * @param {array.<number>}
     * @return {string} char
     */
    function charCodeArrToStr(arr) {
        var str = []
          , len = arr.length
          , idx = 0;

        while (idx < len) {
            str[idx] = String.fromCharCode(arr[idx]);
            idx++;
        }

        return str.join('');
    }

    /**
     * @memberof Struct~
     * @param {arrayBuffer} buffer
     * @param {string} typed
     * @return {array.<number>} typed
     */
    function arrayBufferToArray(buf, typed) {
        return Array.prototype.slice.call(new global[capitalize(typed) + 'Array'](buf));
    }

    /** support 64-bit int shim **/
    if (DataView.prototype.getUint64 === undefined &&
        DataView.prototype.setUint64 === undefined &&
        DataView.prototype.getInt64 === undefined &&
        DataView.prototype.setInt64 === undefined) {

        var pow2 = function (n) {
            return (n >= 0 && n < 31) ? (1 << n) : (pow2[n] || (pow2[n] = Math.pow(2, n) - 1));
        };

        var Uint64 = function (lo, hi) {
            this.lo = lo;
            this.hi = hi;
        };

        Uint64.prototype = {
            valueOf: function () {
                return this.lo + pow2(32) * this.hi;
            },

            toString: function () {
                return Number.prototype.toString.apply(this.valueOf(), arguments);
            }
        };

        Uint64.fromNumber = function (number) {
            var hi = Math.floor(number / pow2(32))
              , lo = number - hi * pow2(32);

            return new Uint64(lo, hi);
        };

        var Int64 = function () {
            Uint64.apply(this, arguments);
        };

        Int64.prototype = 'create' in Object ? Object.create(Uint64.prototype) : new Uint64();

        Int64.prototype.valueOf = function () {
            if (this.hi < pow2(31)) {
                return Uint64.prototype.valueOf.apply(this, arguments);
            }
            return -((pow2(32) - this.lo) + pow2(32) * (pow2(32) - 1 - this.hi));
        };

        Int64.fromNumber = function (number) {
            var lo, hi;
            if (number >= 0) {
                var unsigned = Uint64.fromNumber(number);
                lo = unsigned.lo;
                hi = unsigned.hi;
            } else {
                hi = Math.floor(number / pow2(32));
                lo = number - hi * pow2(32);
                hi += pow2(32);
            }
            return new Int64(lo, hi);
        };

        DataView.prototype.getUint64 = function (byteOffset, endianness) {
            var parts = endianness ? [0, 4] : [4, 0];
            for (var i = 0; i < 2; i++) {
                parts[i] = this.getUint32(byteOffset + parts[i], endianness);
            }
            return new Uint64(parts[0], parts[1]).valueOf();
        };

        DataView.prototype.setUint64 = function (byteOffset, value, endianness) {
            value = Uint64.fromNumber(value);
            var parts = endianness ? { lo: 0, hi: 4 } : { lo: 4, hi: 0 };
            for (var partName in parts) {
                this.setUint32(byteOffset + parts[partName], value[partName], endianness);
            }
        };

        DataView.prototype.getInt64 = function (byteOffset, endianness) {
            var parts = endianness ? [0, 4] : [4, 0];
            for (var i = 0; i < 2; i++) {
                parts[i] = this.getUint32(byteOffset + parts[i], endianness);
            }
            return new Int64(parts[0], parts[1]).valueOf();
        };

        DataView.prototype.setInt64 = function (byteOffset, endianness) {
            value = Int64.fromNumber(value);
            var parts = endianness ? { lo: 0, hi: 4 } : { lo: 4, hi: 0 };
            for (var partName in parts) {
                this.setUint32(byteOffset + parts[partName], value[partName], endianness);
            }
        };
    }

    global.Struct = Struct;

})(this || {});

/**
(function (global, undefined) {
    "use strict";
    
    var commOptionInfo = function (option, value, debug) {
        this.rqname = ""
        , this.prevnext = 0
        , this.trcode = ""
        , this.ctrlname = ""
        , this.encrypt = 0 // 암호화 사용유무
        , this.cert = 0  // 공인인증사용유무
        , this.compress = 0 //압축사용유무
        , this.notify = 1   // 서버응답 유무
        , this.datatype = 0 // 0:FID, 1:트랜, 2:JSON 형식
        , this.destination = "";  // 서버목적지 정보

        this.defaultValue = value || 0;
        this._debug = debug || false;

        this.option = normalize(option, this.defaultValue);
        this.commOption = {};

        this._debug && console.log(
           'commOptionInfo.CREATE'
          , 'defaultValue:', this.defaultValue
          , 'option:', this.option);

    };

    // prototype
    commOptionInfo.prototype = {

        update: function (option) {
            this.commOption = update(this.commOption, option || {});
            return clone(this.commOption);
        },
   };

    function isString(a) {
        return !!a && (a === String || a.constructor === String);
    }

    function isObject(a) {
        return !!a && (a === Object || a.constructor === Object);
    }

    function isArray(a) {
        //return Array.isArray(a);
        return !!a && (a === Array || a.constructor === Array);
    }

    function isUndefined(a) {
        return a === undefined;
    }
    function isNull(a) {
        return a === null;
    }

    function isError(a) {
        return !!a && a.constructor === Error;
    }

    function update(model, obj) {
        for (var p in obj) {
            if (model.hasOwnProperty(p)) {
                if (isObject(model[p])) {
                    model[p] = update(model[p], obj[p]);
                } else {
                    model[p][1] = obj[p];
                }
            }
        }
        return model;
    }

    function clone(obj) {
        var option = {};
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                option[p] = obj[p];
            }
        }
        return option;
    }

    function align(model, callback) {
        var option = {}, error = null;
        for (var p in model) {
            if (model.hasOwnProperty(p)) {
                var item = model[p];
                if (isObject(item)) {
                    option[p] = align(item, callback);
                } else {
                    error = callback(item, p, option);
                    if (error) {
                        option = error;
                        break;
                    }
                }
            }
        }
        return option;
    }

    function normalize(model, defaultValue) {
        return align(model, function (params, prop, option) {
            // [0] value, define single, multiple, vary value form params
            var value = isString(params) ? params[0] : defaultValue

            if (isUndefined(value) || isNull(value)) value = '';

            option[prop] = value;
        });
    }
    global.commOptionInfo = commOptionInfo;
})(this || {});
*/


// url 정보를 요청하는 기능
x2h.requestURL = function (strURL, callback, objExtraData) {
    var xhr = null;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        xhr = new XMLHttpRequest();
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/xml');
        }
    }
    else if (window.ActiveXObject) { // IE
        try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); }
        catch (e) {
            try { xhr = new ActiveXObject("Microsoft.XMLHTTP"); }
            catch (e) {
                alert('error ==>Unsupported object of  XMLHttpRequest ');
            }
        }
    }
    if (!xhr) {
        return false;
    }

    xhr.onreadystatechange = function () { callback(xhr, objExtraData); };
    xhr.open('GET', strURL, true);

    //xhr.withCredentials = false;
    //xhr.setRequestHeader('Cookie', '');
   
    xhr.send(null);

    return true;

}

// 서버로 부터 파일다운로드  응답처리기능
x2h.screeDownLoad = function (httpRequest, htmlDom) {

    try {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
                var strText = httpRequest.responseText;  // 일반text 문자열
                return x2h.loadXMLDom(httpRequest.responseXML, htmlDom);
            } else {
                return false;
            }
        }
    }
    catch (e) {
        return false;
    }
}

x2h.createHTMLDOM = function (strHTML) {
    var parser = new DOMParser();
    var htmlDOM = parser.parseFromString(strHTML, "text/html");

    return htmlDOM;
}
// XML 문서로  XMLDom을 구성하는 기능
x2h.createXMLDOM = function (strXML) {
    if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.loadXML(strXML);
        return xmlDoc;
    }
    else if (document.implementation && document.implementation.createDocument) {
        var parser = new DOMParser();
        return parser.parseFromString(strXML, "text/xml");
    }
    else {
        return null;
    }
}


// XML에서 Document객체를 취득하는 기능
x2h.getXmlDocNode = function (htmlDom) {
    if (htmlDom.nodeType == 9 ) // DocumentType.DOCUMENT_NODE = 9
        return htmlDom;
    else
        return htmlDom.ownerDocument;
}

// XML 요소를 생성해서 반환하는 기능
x2h.createXmlElement = function (htmlDom, strTagName ) {
    var xmlElement;
    xmlElement = x2h.getXmlDocNode(htmlDom).createElement(strTagName);
    return xmlElement;
}

// XML TextNode를 생성해서 반환하는 기능
x2h.createTextNode = function (htmlDom, strText) {

    var textNode;
    textNode = x2h.getXmlDocNode(htmlDom).createTextNode(strText);

    return textNode;
}

// nodeValue 정보를 취득하는 기능
x2h.GetTextNode = function (xmlElement) {
    return xmlElement.nodeValue;
}


// XML CDATASection를 생성해서 반환하는 기능
x2h.createCDATASection = function (htmlDom, strDATAText) {

    var newCDATA;
    newCDATA = x2h.getXmlDocNode(htmlDom).createCDATASection(strDATAText);

    return newCDATA;
}

//XML 요소의 CDDATA또는 text 값을 취득하는 함수(<item> 데이터</item>)
// tagName 값이 undefined 이면 node에서 검색을 한다.
x2h.xmlGetText = function (xmlElement, tagName, bMulti) {
    var childNode, i, len, txt = "";
    if (tagName) {
        var x = xmlElement.getElementsByTagName(tagName);
        if (x) {
            len = x.length;
            if (bMulti && len > 1)   // 탭 내부 서브컨트롤의 개수 
                len = 1;
            for (i = 0; i < len; i++) {
                childNode = x.item(i);
                txt += childNode.textContent;
            }
        }
    }
    else
    {
        for (i = 0; xmlElement.childNodes && i < xmlElement.childNodes.length; ++i) {
            childNode = xmlElement.childNodes.item(i);
            if (childNode.nodeType == 4) {
                txt = childNode.textContent;
                return txt;
            }
        }
    }
    return txt;
}

// xml 요소에 있는 태그에 포함된 JSON객체를 반환하는 경우에 사용
x2h.xmlJSONData = function (xmlElement, tagName) {
    var x = x2h.xmlGetText(xmlElement, tagName, tagName == "multi_lang" ? true : false ), obj = {};
    if (x != "") {
        if (tagName == "multi_lang")
            return hi5.getJSONParse(x, true) || {};
        obj = hi5.getJSONParse(x) || {};
    }
    return obj;
}

// 객체에 키값으로 각 언어에 해당하는 텍스트값을 반환
//var caption = { ko: "한글", en: "영어", jp: "일본어".... };
x2h.xmlGetMultiLangText = function (obj, key) {
    var s = "";
    var objData = (key !== undefined) ? obj[key] : obj;
    if (objData == undefined) return s;
    if (objData[local_lang] != undefined) {
        s = objData[local_lang];
    } else {
        if (objData.ko != undefined)
            s = objData.ko;
    }
    return s;
/*
    for (var i = 0, len = Object.keys(obj[key]).length; i < len; i++) {
        if (Object.keys(obj[key])[i] == local_lang) {
            s = Object.values(obj[key])[i]; return s;
        }
    }

    //타 언어가 없을 때는 ko를 기본으로.
    if (obj[key]) {
        if (obj[key].ko) return obj[key].ko;
    }

    return s;
*/
    
}

// Attribute 정보를 설정하는 기능
x2h.xmlSetAttr = function (xmlElement, strAttrName, strAttrValue) {
    xmlElement.setAttribute(strAttrName, strAttrValue);
}

// Attribute 정보를 취득하는 기능
// (defValue값이 존재하면 기본값 변경)
x2h.xmlGetAttr = function (xmlElement, strAttrName, defValue) {
    var str = "";
    if (xmlElement.hasAttribute(strAttrName)) {
        str = xmlElement.getAttribute(strAttrName);
    }

    if (defValue != undefined && str == "") {
         return defValue;
    }

    if (defValue != undefined) {  //  && typeof (defValue) == "number") {
        //xmlElement.removeAttribute(strAttrName);  -> XML 해쉬처리로 인해서 지우지 않는다.
        if (defValue === "" || hi5.isString(defValue))
            return str;
        if ( hi5.isNumber(defValue) )
            return Number(str);
        if (hi5.isObject(defValue)) 
            return hi5.getJSONParse(str);
        if (hi5.isBool(defValue))
            return hi5.strToBool(str);
    }
    return str;
}

x2h.removeAttr = function ( xmlElement, attrList)
{
    var i, attriName;
    for (i = 0 ; i < attrList.length; i++) {
        attriName = attrList[i];
        if (xmlElement.hasAttribute(attriName)) xmlElement.removeAttribute(attriName);
    }
    return xmlElement.attributes;
}

x2h.changeAttri = function (xEle, hEle, xmlAttrName, htmAttrName) {
    var str;
    if (xEle.hasAttribute(xmlAttrName)) {
        str = xEle.getAttribute(xmlAttrName);

        hEle.setAttribute(htmAttrName, str);
    }

    return;
}

//
x2h.getFindElement = function (xmlDom, tagName, attrName, findText) {
    var x = xmlDom.getElementsByTagName(tagName);
    for (var i = 0; i < x.length; i++) {
        if (x[i].getAttribute(attrName)) {
            if ( x[i].getAttribute(attrName) == findText ) return x[i];
        }
    }
    return null;
}

x2h.getAttributes = function (node) {
    var obj = {};
    $.each(node.attributes, function (index, attribute) {
        //console.log(attribute.name + ':' + attribute.value);
        if (attribute.name == 'stylecolor' || attribute.name == 'customcolor') {
            obj[attribute.name] = x2h.getColorReplace(attribute.value);   // {color}값을 취환하는 기능
        } else {
            obj[attribute.name] = attribute.value;
        }
    });
    // --> 창민 수정 : 콤보박스 options 속성 처리 추가
    // json, fid 데이터 
    if(node.tagName == 'combo'){
        var options = "";
        options = node.innerHTML.toString().trim();
        if(options.length == 0) return;

        var optionData = options.substring(18,options.length-13);
        var data = hi5.getJSONParse(optionData);// options 파싱 완료

        obj["datatype"] = data.datatype;
        obj["displaytype"] = data.displaytype;
        obj["initindex"] = data.initindex;

        // datatype에 따른 데이터 구분
        switch(data.datatype){
            case "0":
                obj["listitem"] = data.listitem;
                break;
            case "1":
                obj["listitem"] = data.inidata;
                break;
            case "2":
                break;
        }
        // console.log(data);
    }
    return obj;
}

// <-- [Edit] kim changa 2019/07/24
// --> [Edit] 수정자:kim changa 일시:2019/07/24
// 수정내용> XML 정보를 JSON 형식으로 변환하는 기능( tooltip 수정건)
// attr속성에 이름과 데이터를 지정하는 기능
x2h.setAttriCustomToolTip = function ($element, objAttr) {
    if (objAttr) {
        $.each(objAttr, function (key, data) {
            $element.attr(key, data);
        })
    }
}

x2h.getXML2JSON = function (node, that, attr, cls, style, fncb) {
    var objXML = x2h.getAttributes(node) || {}, key, val;
    if (fncb) {
        var tagNames = fncb.call(objXML, node), children = node.children, childNode, json;
        //tagNames.forEach(function (name) {
        for (var i = 0; i < children.length; ++i) {
            childNode = children[i];
            if (childNode.nodeType == 1) {                  // DocumentType.ELEMENT_NODE = 1
                name = x2h.getNodeName(childNode);
                if (tagNames && tagNames.length > 0) {
                    if (tagNames.indexOf(name) >= 0) {
                        json = hi5.getJSONParse(childNode.textContent, true);
                        objXML[name] = json;
                    }
                } else {
                    json = hi5.getJSONParse(childNode.textContent, true);
                    objXML[name] = json;
                }
            }
        }
    }

    for (key in objXML) {
        val = objXML[key];
        if (attr[key] !== undefined) {      // HTML Attr표시용
            if (that && key == "id") {      // ID값은 Form에서 XML ID에서 원본ID를 
                attr[key] = that.id ? that.id : val;
                continue;
            } else {
                attr[key] = val;
            }
        }
        if (that && that[key] !== undefined) {
            if (hi5.isObject(that[key])) {
                that[key] = hi5.getJSONParse(val);
            } else {
                if (hi5.isNumber(that[key])) {
                    that[key] = Number(val);
                } else if (hi5.isBool(that[key])) {
                    that[key] = hi5.strToBool(val);
                } else {
                    that[key] = val;
                }
            }
        }
    }
    // style 속성(문자열)
    if (objXML.style) {
        style.push(objXML.style);
    }

    // Style Color
    if (objXML.stylecolor) {
        style.push(objXML.stylecolor);
    }

    // custom Color string->object
    if (objXML.customcolor) {
        if (that)
            that.customColor = x2h.defaultStyle(objXML.customcolor, false);
    }

    // class
    if (objXML.class) {
        cls.push(objXML.class);
    }
    return objXML;
}
// x2h.getXML2Control 아래 함수는 이후 삭제 예정
// <-- [Edit] kim changa 2019/07/24

x2h.getXML2Control = function (node, that, attr, cls, style, fncb) {
    var objXML = x2h.getAttributes(node) || {}, key, val;
    if (fncb) {
        var tagNames = fncb.call(objXML, "CDDATA"), children = node.children, childNode, json;
        tagNames.forEach(function (name) {
            for (var i = 0; i < children.length; ++i) {
                childNode = children[0];
                if (childNode.nodeType == 1) {                  // DocumentType.ELEMENT_NODE = 1
                    if (x2h.getNodeName(childNode) == name) {
                        json = hi5.getJSONParse(childNode.textContent, true);
                        objXML[name] = json;
                    }
                }
            }
        })
    }

    for (key in objXML) {
        val = objXML[key];
        if (attr[key] !== undefined) {      // HTML Attr표시용
            if (that && key == "id") {      // ID값은 Form에서 XML ID에서 원본ID를 
                attr[key] = that.id ? that.id : val;
                continue;
            } else {
                attr[key] = val;
            }
        }
        if (that && that[key] !== undefined) {
            if (hi5.isObject(that[key])) {
                that[key] = hi5.getJSONParse(val);
            } else {
                if (hi5.isNumber(that[key])) {
                    that[key] = Number(val);
                } else if (hi5.isBool(that[key])) {
                    that[key] = hi5.strToBool(val);
                } else {
                    that[key] = val;
                }
            }
        }
    }
    /*
    $.each(objXML, function (key, val) {
        if (attr[key] !== undefined) {      // HTML Attr표시용
            if (that && key == "id") {      // ID값은 Form에서 XML ID에서 원본ID를 
                attr[key] = that.id ? that.id : val;
            } else {
                attr[key] = val;
            }
        }

        if (that && that[key] !== undefined) {
            if (hi5.isObject(that[key])) {
                that[key] = hi5.getJSONParse(val);
            } else {
                if (hi5.isNumber(that[key])) {
                    that[key] = Number(val);
                } else if (hi5.isBool(that[key])) {
                    that[key] = hi5.strToBool(val);
                } else {
                    that[key] = val;
                }
            }
        }
    })
    */
    // style 속성(문자열)
    if (objXML.style) {
        style.push(objXML.style);
    }

    // Style Color
    if (objXML.stylecolor) {
        style.push(objXML.stylecolor);
    }

    // custom Color string->object
    if (objXML.customcolor) {
        if (that)
            that.customColor = x2h.defaultStyle(objXML.customcolor, false);
    }

    // class
    if (objXML.class) {
        cls.push(objXML.class);
    }

    return objXML;
}

// HTML Attribute 속성을 지정( attr{ id:val, style:val...} )
x2h.attri = function (element, attr) {
    var name, value;
    for( name in attr) {
        value = attr[name];
        if (value !== "")
            element.setAttribute(name, value);
    }
    return element.style;
}

// HTML style 속성변경기능( css{ border-color:"#FFFFFF", display:""...} )
x2h.css = function (element, css) {
    var name, key, style = element.style;
    for (key in css) {
        name = $.camelCase(key);   // border-color->borderColor 변환;
        if (style[name] !==undefined )
            style[name] = css[key];
    }
    return element.style;
}

// 
x2h.getUniqID = function (str, objForm) {
    var self = objForm;
    function fnIDChange(match) {
        var parentid = self.orgid != "" ? self.orgid + "_" : "";
        switch (match) {
            case "{{id.}}":
                return self.m_sScreenID + "_" + parentid + self.m_nScreenIndex + "_";   //[서브화면].index
        }
        return match;
    }
    var res = str.replace(/{{id.}}/g, fnIDChange);
    return res;
}



// 멀티라인 텍스트 반환
x2h.getMultiLineText = function (str) {
    return str = str.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>");
}

// XML의 Node이름을 반환하는 기능
x2h.getNodeName = function (node) {
    var nodeLocalName = "";
    if (node.nodeType == 1) {        // DocumentType.ELEMENT_NODE = 1
        nodeLocalName = node.localName;
        if (nodeLocalName == null)                          // Yeah, this is IE!!
            nodeLocalName = node.baseName;
        if (nodeLocalName == null || nodeLocalName == "") // =="" is IE too
            nodeLocalName = node.nodeName;
    }
    else
    {
        console.log("Error===> x2h.getNodeName nodetype=" + node.nodeType);
    }
    return nodeLocalName;
}


x2h.allSetAttr = function (attributes, xmlDoc) {
    var i, attri;
    for (i = 0 ; i < attributes.length; i++) {
        attri = attributes.item(i);
        xmlDoc.setAttribute(attri.nodeName, attri.nodeValue)
    }
}

// 화면정보(XML)를 HTML로 변환하는 기능
x2h.loadXMLDom = function (xmlDoc, htmlDom) {
    if (xmlDoc) {
        // Screen Info


        // Form Info
        var xmlFormDoc = xmlDoc.getElementsByTagName("form")[0];

        // Script Info

    }
}

// XMLDom객체내용을 문자열로 반환하는 기능
x2h.xml2str = function (xmlNode) {
    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}

x2h.defaultStyle = function (obj, colorID) {
    var props = {}, str = "";

    if (typeof (obj) === "object")
        str = x2h.xmlGetAttr(obj, "style");
    else if (typeof (obj) === "string") {
        str = obj;
    }

    if (str != "") {
        // 모든컬러 정보를 치환시킨다.
        if (colorID === undefined || colorID)
            str = x2h.getColorReplace(str);

        // 속도개선
        var styles = str.split(';'), property, value, style;
        styles.forEach(function (rd) {
            if (rd.length > 0 ) {
                style = rd.split(':');
                if (style.length > 1) {
                    property = style[0].Ntrim();
                    value = style[1].Ntrim();
                    if (property.length > 0 && value.length > 0) {
                        props[property] = value;
                    }
                }
            }
        })
    }

    if (props.overflow) {
        if (props.overflow == "overflow-y") {
            props["overflow-y"] = "auto";
            delete props["overflow"];
        } else if (props.overflow == "overflow-x") {
            props["overflow-x"] = "auto";
            delete props["overflow"];
        }
    }

    return props;
}
//스타일 없으면 지정
x2h.setStyleDefault = function (props, proname, defvalue )
{
    if (props[proname] == undefined && defvalue !="") {
        props[proname] = defvalue;
    }
}
//스타일 강제 지정
x2h.setStyleForce = function (props, proname, defvalue) {
    if (defvalue != "") {
        props[proname] = defvalue;
    }
}

x2h.getStyleValue = function (props, proname) {
    if (props[proname] != undefined ) {
        return props[proname];
    }
    return "";
}

x2h.getStyleString = function (props) {
    var str ="";
    for (var key in props) {
        str += key + ":" + props[key] + "; ";
    }
    return $.trim(str);
}


// {colorIndex?RGB(0,0,0)} 패턴 
x2h.getColorReplace = function (str) {
    function fnColorChange(match) {
        var color = match;
        color = match.replace('{', '').replace('}', '');
        var colors = color.split("?"), colorIndex="";
        if (colors.length == 1) {
            colorIndex = colors[0];
        } else  if (colors.length == 2) {
            if (colors[0] != "" && colors[0] != "0") colorIndex = colors[0];
            else if (colors[1] != "") color = colors[1];
        }

        if (colorIndex != "") {
            if (g_colorpal[colorIndex] == undefined) { return match;}
            color = g_colorpal[colorIndex][themeindex];
        }

        //if ( color != undefined)
            
        return color;
    }

    //var res = str.replace(/{\w+}/g, fnColorChange);
    //.*-> 한번만 *->반복
    var res = str.replace(/{[^][^{]*?}/g, fnColorChange);
   
    return res;
}

//colorindex에 해당되는 실제 칼라값 취득
//? 구분자가 있으면 사용자색상 -> 두번째 칼라값으로 사용
//? 구분자가 없으면 칼라인덱스 -> json에서 검색
//json에서도 없으면 그냥 해당 값 리턴
//2017.04.26 확정
clridx.getColorIndex = function (value, propname) {
    if (!hi5.isString(value))
        value = value.toString();

    if (propname == "border") {
        var newvalue = "";
        var colorvalue = value.split(" ");
        for (var x = 0; x < colorvalue.length; x++) {
            if (g_colorpal[colorvalue[x]] == undefined) {
                newvalue += colorvalue[x];
                newvalue += " ";

                continue;
            }
            var color = g_colorpal[colorvalue[x]][themeindex];
            if (typeof (color) == undefined || color == "") {
                newvalue += colorvalue[x];
            }
            else {
                newvalue += color;
                newvalue += " ";
            }
        }

        return newvalue;
    }
    else {
        if (value.indexOf("?") < 0) {
            if (g_colorpal[value] == undefined) return value;
            var colorvalue = g_colorpal[value][themeindex];
            if (typeof (colorvalue) == undefined || colorvalue == "") return value;
            else return colorvalue;
        }
        else {
            var colorvalue = value.split("?");
            if (colorvalue[1] == "") {
                value = g_colorpal[colorvalue[0]][themeindex];
                return value;
            }
            return colorvalue[1];
        }
    }
}

/*
* JMap
* useage : var map = new JMap
*         map.put("sky", "blue"); map.put("apple", "red"); map.put("banana", "yellow");
* kim chang ha
*/
var JMap = function (obj) {

    // 생성자
    var hashData = (obj != null) ? cloneObject(obj) : new Object();

    // private
    var cloneObject = function (obj) {
        var cloneObj = {};
        for (var key in obj) {
            cloneObj[key] = obj[key];
        }

        return cloneObj;
    }

    // pubilc
    this.put = function (key, value) {
        if (value != null)
            hashData[key] = value;
    }
    this.get = function (key) {
        return hashData[key];
    }
    this.remove = function (key) {
        for (var item in hashData) {
            if (item == key) {
                delete hashData[item]; break;
            }
        }
    }
    this.removeAll = function () {
        for (var key in hashData) {
            delete hashData[key];
        }
    }
    this.keys = function () {
        var keys = [];
        for (var key in hashData) {
            keys.push(key);
        }
        return keys;
    }
    this.values = function () {
        var values = [];
        for (var key in hashData) {
            values.push(hashData[key]);
        }
        return values;
    }

    this.find = function (key) {
        for (var item in hashData) {
            if (item == key) {
                return true;
            }
        }
        return false;
    }
    this.isEmpty = function () {
        return (this.size() == 0);
    }
    this.size = function () {
        var count = 0;
        for (var key in hashData) { count++ };
        return count;
    }

    this.getObject = function () {
        return cloneObject(hashData);
    }
};


// 주문유형
var hi5_OrderType = {
    textcode_ko: { "시장가": "1", "limits": "2" },
    textcode_en: { "Market price": "1", "limits": "2" },
    textcode_jp: { "市場価": "1", "指値": "2" },
    textcode_zh: { "市場価": "1", "指値": "2" },
    codetext_ko: { "1": "시장가", "2": "지정가" },
    codetext_en: { "1": "Market price", "2": "limits" },
    codetext_jp: { "1": "市場価", "2": "指値" },
    codetext_zh: { "1": "市場価", "2": "指値" }
}

if (!String.prototype.OrderType) {
    String.prototype.OrderType = function (option) {
        if (this === "") return this;
        var key = option + "_" + local_lang;

        if (hi5_OrderType[key][this] != undefined) return hi5_OrderType[key][this];
        return this;
    };
}

// 매도수구분
var Coin_sellbuy = {
    textcode_ko: { "매도": "1", "매수": "2" },
    textcode_en: { "sell": "1", "buy": "2" },
    textcode_jp: { "売り": "1", "買い": "2" },
    textcode_zh: { "卖出": "1", "买入": "2" },
    codetext_ko: { "1": "매도", "2": "매수" },
    codetext_en: { "1": "Sell", "2": "Buy" },
    codetext_jp: { "1": "売り", "2": "買い" },
    codetext_zh: { "1": "卖出", "2": "买入" }
}

if (!String.prototype.SellBuy) {
    String.prototype.SellBuy = function (option) {
        if (this === "") return this.valueOf();
        var key = option + "_" + local_lang;

        if (Coin_sellbuy[key][this] != undefined) return Coin_sellbuy[key][this];
        return this.valueOf();
    };
}

if (!String.prototype.acct_fmt) {
    String.prototype.acct_fmt= function () {
        if (this === "") return this.valueOf();
        if (this.length >= 11) {
            return this.substring(0, 3) + "-" + this.substring(3, 5) + "-" + this.substring(5, this.length);
        }
        return this.valueOf();
    }
}

if (!String.prototype.SellBuyCls) {
    String.prototype.SellBuyCls = function () {
        if (this === "") return this.valueOf();
        if (this.length == 1) {
            if (this == "1") return "low_txt";      // sell
            else if (this == "2") return "up_txt";  // buy
        }
        else
        {
            var val = this.SellBuy("textcode");
            if (val == "1") return "low_txt";         // sell
            else if (val == "2") return "up_txt";     // buy
        }
        return this.valueOf();
    };
}

if (!String.prototype.getSignColor) {
    String.prototype.getSignColor = function (option) {
        if (this == "+" || this == "1" || this == "6" || this == "2" || this == "7" || this == "C")      // 상승
            return (option && option.cls) ? option.cls + " up_txt" : "up_txt";
        else if (this == "-" || this == "4" || this == "8" || this == "5" || this == "9" || this == "D") // 하락
            return (option && option.cls) ? option.cls + " low_txt" : "low_txt";
        else
            return (option && option.cls) ? option.cls : "";
    };
}


/// 상승,하락,상한가,하한가 등에 따라서 class이름을 반환한다.
//  representing the primitive value of a string(this.valueOf())
if (!String.prototype.getUpDownSignCls) {
    String.prototype.getUpDownSignCls = function (t) {
        switch (this.valueOf()) {
            case "1":// 상한
            case "6": //기세상한
            case "2":// 상승
            case "7": //기세상승
                return "up_txt up_sign"; break
            case "4":// 하한
            case "8":// 기세하한
            case "5":// 하락
            case "9":// 기세하락
            case "C":// 예상체결상승
                return "low_txt low_sign"; break
            case "D":// 예상체결하락
                return "low_txt y_low_arr"; break
            default:
                return "balance_sign"; break
                break;
        }
        return "";
    };
}
if (!String.prototype.getSignURL) {
    String.prototype.getSignURL = function () {
        switch (this.valueOf()) {
            case "2":// 상승
                return hi5.getURL({ url: "images/control/up_arr.svg" });
                break;
            case "5":// 하락
                return hi5.getURL({ url: "images/control/low_arr.svg" });
                break;
        }
        return "";
    }
}
if (!String.prototype.getUpDownSign) {
    String.prototype.getUpDownSign = function (t) {
        switch (this.valueOf()) {
            case "1":// 상한
            case "6": //기세상한
                return "up_txt up_sign"; break
            case "2":// 상승
            case "7": //기세상승
                if (t) return "up_txt up_sign"; break
                return "up_arr"; break
            case "4":// 하한
            case "8":// 기세하한
                return "low_txt low_sign"; break
            case "5":// 하락
            case "9":// 기세하락
                if (t) return "low_txt low_sign"; break
                return "low_arr"; break
            case "C":// 예상체결상승
                return "up_txt up_sign"; break
            case "D":// 예상체결하락
                return "low_txt low_sign"; break
            default:
                return "balance_sign"; break
                break;
        }
        return "";
    };
}

function  putThousandsSeparators (value, sep) {
    if(hi5.SHMEM){
        if(hi5.SHMEM.user_setting){
            if(hi5.SHMEM.user_setting.general){
                if(hi5.SHMEM.user_setting.general.comma){
                    if(hi5.SHMEM.user_setting.general.comma == "N"){
                        //return value;
                        return value.toString();
                    }
                }
            }
        }
    }
    if (!value || value == "") return value;

    if (sep == null) sep = ',';

    value = value.toString().replace(/,/g, "");
    // check if it needs formatting
    if (value.toString() === value.toLocaleString()) {
        // split decimals
        var parts = value.toString().split('.');
        // format whole numbers
        var minus;  // parts[0] 이 -0 이 되는 경우에 0으로 변경. 결함번호 1122
        if(parts[0].indexOf("-") > -1 && parts[0].atoi() == 0) minus = true;
        parts[0] = parts[0].atoi().toString();
        if(minus) parts[0] = "-" + parts[0];
        //parts[0] = parts[0].atoi().toString();
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
        // put them back together
        value = parts[1] ? parts.join('.') : parts[0];
    } else {
        value = value.toLocaleString();
    }
    return value;
}

// --> [Edit] 수정자:kim changa 일시:2019/02/27
// 수정내용>  UTC 시간으로 일자를 비교
// UTC 타임으로 일자를 비교하는 경우 사용( 그리드)
var getUTCTimeDay= function (option) {
    var t1 = option.ts1, t2 = option.ts2;
    if (option.UTCTime) {
        if (hi5.isString(t1)) {   // 문자열이면 long 변환
            t1 = parseInt(t1), t2 = parseInt(t2);
        }
        // 일자만 반환한다.
        t1 = new Date(t1).getDay(); t2 = new Date(t2).getDay();
    } 
    return { day1: t1, day2: t2 };
}
// <-- [Edit] kim changa 2019/02/27


var _MaskFormat = function (_nformats) {
    return function (format) {
        var obj, m;
        if (format) {
            if (obj = _nformats[format]) {
                return obj
            }
            var p = format[0];    // 파싱 구분자값
            var m = format.split(p);
            if (m && m.length) {
                obj = {
                    gubun: m[1],     //0-문자 1-숫자
                    type: m[2],       //0-일반 1-일자 2-시간 3-일자+시간 4-전화번호
                    format: m[3],     //마스크 형식
                    nozero: m[4],         //"0" 표시하지 않음
                    comma: m[5],      //"," 표시
                    minus: m[6],      //"-" 부호표시
                    decimal: m[7],    //소수점 자리수 표시
                    decnum: m[8] != "" ? Number(m[8]): 0,     //소수점 자리수
                    prefix: m[9],     //문자를 데이터 앞에 표시
                    sufix: m[10]      //문자를 데이터 뒤에 표시
                };
                // 시간,일자,일자+시간 Format함수는 무조건 소문자로 변경한다.
                if (m[2] == '1' || m[2] == '2' || m[2] == '3') {
                    obj.format = obj.format.toLowerCase();
                }

                // 그리드,테이블,호가 마스킹용
                if (m.length > 11) {
                    p = m[11];
                    p = p.replace(/;/g, ',');
                    var ar = [], s;
                    p.split('{').join().split('}').join().split(',').forEach(function (rd, idx) {
                        if (rd.length > 1) {
                            ar.push( "'"+rd.split(':')[0].toString() + "':" + rd.split(':')[1]);
                        }
                    });
                    s = "{" + ar.join(",") + "}"
                    obj['grid']  = hi5.getJSONParse(s);

                    //obj['grid'] = hi5.getJSONParse(p);
                    //obj['grid'] = eval('(' + p + ')');
                }
                _nformats[format] = obj
            }
        }
        obj = obj || {
            gubun: 0,      // 0-문자 1-숫자
            type:  0,       //0-일반 1-일자 2-시간 3-일자+시간 4-전화번호
            format: "",     //마스크 형식
            nozero: '0',    //"0" 표시하지 않음
            comma: '0',      //"," 표시
            minus: "1",      //"-" 부호표시
            decimal: '0',    //소수점 자리수 표시
            decnum: 0,       //소수점 자리수
            prefix: "",     //문자를 데이터 앞에 표시
            sufix: "",      //문자를 데이터 뒤에 표시
            grid: null,     // grid = { 
                                    // zeroadd : true ; 소수점 이하 0으로 채움(12.12->12.120)
                                    // pointdel : true ; 소수점 이하 표시 안하기(11.23->11)
                                    // zeronodsp : true: 소수점 이하 0표시안함(12.120->12.12)
                                    // textcolor : true ; 소수점 작성시에 추가되는 숫자(0) 글자색 변경
                                    // round : true : 반올림 여부
                                    // ltzero : true : '0' 제거 (00001.000->1.000)
                                    // pow : 숫자단위 (=입력값/숫자단위) 금액, 수량단위
                                    // symbol :true ; 심볼값이 있으면 소수점 이하 자동 마스킹
                                    // sign : 3(+,-) 부호를 붙인다.
                            // }
        };
        return obj
    }
}({});

//마스킹 정보
maskstr.SetMask = function ($element, value, option ) {
    if (value == undefined || value == null || option==null) return "";

    var $e = $element, format;
    if ($e.length > 0) {
        format = option.mask ? option.mask : '';
        //format = $e[0].getAttribute('mask') || '';
    }

    //var format= thisctrl.attr('mask');
    if ( !hi5.isString(value) )
        value = value.toString();

    if (format == undefined || format == "") {
        //$e.html(value);
        if ($e.length > 0) {
            //$e[0].innerHTML = value;
            $e[0].textContent = value;
        }
        return value;
    }

    //if ($e.length > 0) {
    //    $e[0].setAttribute('orgvalue', value);
        //thisctrl.attr('orgvalue', value);
    //}

    value = maskstr.GetMaskValue(format, value);
    var sHtml = value, len = 0, count = 0;
    if (option && option.sign) {
        if (option.signChange) {  // 부호가 변경된 경우만 처리
            var s = option.data.getSignURL();
            if (s != "") {
                sHtml = "<img src=" + s + "><span class='hi5_sign'>" +'&nbsp;'+ value +"</span>";
            }
            if ($e.length > 0) {
                $e[0].innerHTML = sHtml;
            }
        } else {
            var elements = $e[0].getElementsByClassName("hi5_sign") || [];
            if (elements.length > 0) {
                elements[0].innerText = " " + value;
            } else {
                $e[0].textContent = value;
            }
        }
        return value;
    }

    // 환산가격 처리
    if (option && option.convertprice) {
        sHtml = value + "<div class='convertprice convertprice_v'>" + option.cp + "</div>";
        if ($e.length > 0)
            $e[0].innerHTML = sHtml;

        //var elements = $e[0].getElementsByClassName("convertprice") || [];
        //if (elements.length > 0) {
        //    elements[0].textContent = option.cp;

        //    elements = $e[0].getElementsByClassName("hi5_cp") || [];
        //    if (elements.length > 0) 
        //        elements[0].textContent = value;
        //} else {
        //    //sHtml = "<div style='display: block;float:left;' class='hi5_cp>" + value + "</div> <div style='display: block;float:left;' class='convertprice convertprice_v'>" + option.cp + "</div>";
        //    sHtml = value + "<div class='convertprice convertprice_v'>" + option.cp + "</div>";
        //    if ($e.length > 0) 
        //        $e[0].innerHTML = sHtml;
        //}
        return value;
    }

    if (value != "" && option != undefined && option.coinqty) {
        // ====> 804 결함 호가테이블 잔량 소수점처리 
        if(option.symbol !=''){
            value = hi5.setDecimalLen(value,hi5.GetCodeInfo(option.symbol).qty_danwi);
        }else{
            value = hi5.setDecimalLen(value,4);
        }
        // <==== 804 결함 호가테이블 잔량 소수점처리 
        var values = value.split("."), str;
        if (values != undefined && values.length > 1 ) {
            len = values[1].length, str = values[1];
            for (var i = len - 1; i >= 0 ; i--) {
                //소수점이 전부 0일경우 처리가 안되서 수정함
                //if ( str[i] != "0" ){
                if ((str[i] != "0") || (str[i] == "0" && i == 0)) {

                    var s1 = str.substring(0, len - count);
                    var s2 = str.substring(len - count);

                    //소수점이 전부 0일경우
                    if (str[i] == "0" && i == 0) {
                        s1 = "";
                        s2 = str;
                    }

                    var s = "";
                    var bTagFlag = false;
                    if (option.hogabar) {   // 호가잔량 표시유뮤
                        var val = values[0] + "." + s1;
                        //[LNH]이미 최초에 element를 구성해놨다면, 다시 구성할필요없이 해당 ele를 찾아서 값과, 잔량바 width만 변경해주고 return 한다. 속도이슈
                        if ($e.children().length > 0) {
                            bTagFlag = true;
                            var child = $e[0].children[0].children;
                            child[0].style.width = option.percent + "%";
                            if (child[1].childNodes.length > 1)
                                child[1].childNodes[0].textContent = val;
                           
                            if (child[1].childNodes.length >= 2)
                                child[1].childNodes[1].textContent = s2;
                        } else {
                            var top = option.top ? option.top : "5px";
                            //option.trade 1 인경우 매도 잔량 색 표시
                            if (option.trade == "1") {
                                //right:-3px
                                if (val == '') val = '&nbsp;';
                                switch (option.hogatype) {
                                    case 0: case 1:
                                        s = "<div class='sell_rest_div'><em class='sell_rest_em' style='width:" + option.percent + "%; height:" + (40 - 2) + "px;'></em>";
                                        s = s + "<span class='rest_span' style='top:" + 0 + ";'>" + val + "<font color='gray'>" + s2 + " </font></span></div>";
                                        break;
                                    case 2:
                                        s = "<div class='buy_rest_div'><em class='buy_rest_em' style='background:rgba(223, 95, 88, 0.15); width:" + option.percent + "%; height:" + (40 - 2) + "px;'></em>";
                                        s = s + "<span class='rest_span' style='top:" + 0 + ";'>" + val + "<font color='gray'>" + s2 + " </font></span></div>";
                                        break;
                                }
                                //option.trade 2 인경우 매수 잔량 색 표시
                            } else if (option.trade == "2") {
                                switch (option.hogatype) {
                                    case 0: case 2:
                                        s = "<div class='buy_rest_div'><em class='buy_rest_em' style='width:" + option.percent + "%; height:" + (40 - 2) + "px;'></em>";
                                        s = s + "<span class='rest_span' style='top:" + 0 + ";'>" + val + "<font color='gray'>" + s2 + " </font></span></div>";
                                        break;
                                    case 1:
                                        s = "<div class='sell_rest_div'><em class='sell_rest_em' style='background:rgba(223, 95, 88, 0.15); width:" + option.percent + "%; height:" + (40 - 2) + "px;'></em>";
                                        s = s + "<span class='rest_span' style='top:" + 0 + ";'>" + val + "<font color='gray'>" + s2 + " </font></span></div>";
                                        break;
                                }
                            }
                        }
                    }
                    else {
                        if ($e.children().length > 0) {
                            bTagFlag = true;
                            $e[0].textContent = values[0] + "." + s1;
                            $e.children()[0].textContent = s2;
                        }else{
                            s = values[0] + "." + s1 + "<span style='color:gray'>" + s2 + "</span>";
                        }
                    }
                    //thisctrl.html(s);
                    if ($e.length > 0 && bTagFlag == false) {
                        $e[0].innerHTML = s;
                    }
                    return value;
                }
                count++;
            }
        }
    }

    if (option && option.coinqty && option.hogabar && len == count) {
        //option.trade 1 인경우 매도 잔량 색 표시
        var bTagFlag = false;

        //[LNH]이미 최초에 element를 구성해놨다면, 다시 구성할필요없이 해당 ele를 찾아서 값과, 잔량바 width만 변경해주고 return 한다. 속도이슈
        if ($e.children().length > 0) {
            bTagFlag = true;
            //$e.children()[0] div class = 'sell_rest_div' && 'byt_rest_div' element
            //$e.children().children() 0 : sell_rest_em 1: rest_span
            //$e.children().children()[0].style.width = option.percent + "%";
            //$e.children().children()[1].textContent = value;
            var child = $e[0].children[0].children;
            child[0].style.width = option.percent + "%";
            if (child[1].childNodes.length > 1)
                child[1].childNodes[0].textContent = value;
            
            if (child[1].childNodes.length >= 2)
                child[1].childNodes[1].textContent = "";
        } else {
            if (value == '') value = '&nbsp;';

            if (option.trade == "1") {
                //right:-3px
                switch (option.hogatype) {
                    case 0: case 1:
                        sHtml = "<div class='sell_rest_div'><em class='sell_rest_em' style='width:" + option.percent + "%; height:" + (40-2) + "px;'></em>";//$element.height()
                        sHtml = sHtml + "<span class='rest_span' style='top:" + 0 + ";'>" + value + "<font color='gray'></font></span></div>"; break;
                    case 2:
                        sHtml = "<div class='buy_rest_div'><em class='buy_rest_em' style='background: rgba(223, 95, 88, 0.15); width:" + option.percent + "%; height:" + (40 - 2) + "px;'></em>";
                        sHtml = sHtml + "<span class='rest_span' style='top:" + 0 + ";'>" + value + "<font color='gray'></font></span></div>"; break;
                }
                //sHtml = sHtml + "<p class='RightQtyText'>" + values[0] + "." + str + "</p></div>";
                //option.trade 2 인경우 매수 잔량 색 표시
            } else if (option.trade == "2") {
                switch (option.hogatype) {
                    case 0: case 2:
                        sHtml = "<div class='buy_rest_div'><em class='buy_rest_em' style='width:" + option.percent + "%; height:" + (40 - 2) + "px;'></em>";
                        sHtml = sHtml + "<span class='rest_span' style='top:" + 0 + ";'>" + value + "<font color='gray'></font></span></div>";
                        break;
                    case 1:
                        sHtml = "<div class='sell_rest_div'><em class='sell_rest_em' style='background: rgba(72, 185, 111, 0.15); width:" + option.percent + "%; height:" + (40 - 2) + "px;'></em>";
                        sHtml = sHtml + "<span class='rest_span' style='top:" + 0 + ";'>" + value + "<font color='gray'></font></span></div>";
                        break;
                }
            }
        }
//        thisctrl.html(sHtml);
        if ($e.length > 0 && bTagFlag == false) {
            $e[0].innerHTML = sHtml;
        }
        return value;
    }

//    thisctrl.html(value);
    if ($e.length > 0) {
        //$e[0].innerHTML = value;
        $e[0].textContent = value;
    }

    return value;
}

/*
maskstr.SetMask = function (element, value, option) {
    if (value == undefined || value == null) return "";
    var thisctrl = element;
    var format = thisctrl.attr('mask');
    if (!hi5.isString(value))
        value = value.toString();

    if (format == undefined || format == "") {
        thisctrl.html(value);

        return value;
    }

    thisctrl.attr('orgvalue', value);
    value = maskstr.GetMaskValue(format, value);

    var sHtml = "", len = 0, count = 0;
    if (option && option.sign) {
        var s = option.data.getSignURL();
        if (s != "") {
            sHtml = "<img src=" + s + ">&nbsp;" + value;
            thisctrl.html(sHtml);
        }
        else {
            thisctrl.html(value);
        }
        return value;
    }

    if (value != "" && option != undefined && option.coinqty) {
        var values = value.split("."), str;
        if (values != undefined && values.length > 1) {
            len = values[1].length, str = values[1];
            for (var i = len - 1; i >= 0 ; i--) {
                if (str[i] != "0") {
                    var s1 = str.substring(0, len - count);
                    var s2 = str.substring(len - count);
                    var s = "";
                    if (option.hogabar) {   // 호가잔량 표시유뮤
                        //var agent = navigator.userAgent.toLowerCase();
                        //if (agent.indexOf("firefox") != -1) //firefox 에서만 display:list-item 체크시, ● 이 보이는 문제가있다
                        //    s = "<div style='position:relative;width:100%;height:100%;display:table'>";
                        //else
                        //    s = "<div style='position:relative;width:100%;height:100%;display: list-item;'>";
                        ////option.trade 1 인경우 매도 잔량 색 표시
                        //if (option.trade == "1") {
                        //    //right:-3px
                        //    switch (option.hogatype) {
                        //        case 0: case 1:
                        //            s = s + "<div style='width:" + option.percent + "%;right:-3px;' class='SellQtyGraph'></div>"; break;
                        //        case 2:
                        //            s = s + "<div style='width:" + option.percent + "%;left:-3px;' class='SellQtyGraph'></div>"; break;
                        //    }
                        //    //option.trade 2 인경우 매수 잔량 색 표시
                        //} else if (option.trade == "2") {
                        //    switch (option.hogatype) {
                        //        case 0: case 2:
                        //            s = s + "<div style='width:" + option.percent + "%; left:-3px;' class='BuyQtyGraph'></div>"; break;
                        //        case 1:
                        //            s = s + "<div style='width:" + option.percent + "%; right:-3px;' class='BuyQtyGraph'></div>"; break;
                        //    }
                        //}
                        //s = s + "<p class='QtyText'>" + values[0] + "." + s1 + "<span style='color:gray;'>" + s2 + "</span></p></div>";

                        //option.trade 1 인경우 매도 잔량 색 표시
                        if (option.trade == "1") {
                            //right:-3px
                            switch (option.hogatype) {
                                case 0: case 1:
                                    s = "<div class='RightQtyDiv'><div style='width:" + option.percent + "%;' class='SellQtyGraph'>-</div>";
                                    s = s + "<p class='RightQtyText'>" + values[0] + "." + str + "</p></div>";
                                    break;
                                case 2:
                                    s = "<div class='LeftQtyDiv'><div style='width:" + option.percent + "%;' class='SellQtyGraph'>-</div>";
                                    s = s + "<p class='LeftQtyText'>" + values[0] + "." + str + "</p></div>";
                                    break;
                            }
                            //option.trade 2 인경우 매수 잔량 색 표시
                        } else if (option.trade == "2") {
                            switch (option.hogatype) {
                                case 0: case 2:
                                    s = "<div class='LeftQtyDiv'><div style='width:" + option.percent + "%;' class='BuyQtyGraph'>-</div>";
                                    s = s + "<p class='LeftQtyText'>" + values[0] + "." + str + "</p></div>";
                                    break;
                                case 1:
                                    s = "<div class='RightQtyDiv'><div style='width:" + option.percent + "%;' class='BuyQtyGraph'>-</div>";
                                    s = s + "<p class='RightQtyText'>" + values[0] + "." + str + "</p></div>";
                                    break;
                            }
                        }
                    }
                    else {
                        var s = values[0] + "." + s1 + "<span style='color:gray'>" + s2 + "</span>";
                    }
                    thisctrl.html(s);
                    return value;
                }
                count++;
            }
        }
    }

    if (option && option.coinqty && option.hogabar && len > 0 && len == count) {
        //var agent = navigator.userAgent.toLowerCase();
        //if (agent.indexOf("firefox") != -1) //firefox 에서만 display:list-item 체크시, ● 이 보이는 문제가있다
        //    sHtml = "<div style='position:relative;width:100%;height:100%;display:table'>";
        //else
        //    sHtml = "<div style='position:relative;width:100%;height:100%;display: list-item;'>";
        //
        ////option.trade 1 인경우 매도 잔량 색 표시
        //if (option.trade == "1") {
        //    switch (option.hogatype) {
        //        case 0: case 1:
        //            sHtml = sHtml + "<div style='width:" + option.percent + "%;right:-3px;' class='SellQtyGraph'></div>"; break;
        //        case 2:
        //            sHtml = sHtml + "<div style='width:" + option.percent + "%;left:-3px;' class='SellQtyGraph'></div>"; break;
        //    }
        //    //sHtml = sHtml + "<div style='width:" + option.percent + "%;right:-3px;' class='SellQtyGraph'></div>";
        //    //option.trade 2 인경우 매수 잔량 색 표시
        //} else if (option.trade == "2") {
        //    switch (option.hogatype) {
        //        case 0: case 2:
        //            sHtml = sHtml + "<div style='width:" + option.percent + "%;left:-3px;' class='BuyQtyGraph'></div>"; break;
        //        case 1:
        //            sHtml = sHtml + "<div style='width:" + option.percent + "%;right:-3px;' class='BuyQtyGraph'></div>"; break;
        //    }
        //   // sHtml = sHtml + "<div style='width:" + option.percent + "%;' class='BuyQtyGraph'></div>";
        //}
        //sHtml = sHtml + "<p class='QtyText'>" + value + "</p></div>";
        //thisctrl.html(sHtml);
        //return value;

        //option.trade 1 인경우 매도 잔량 색 표시
        if (option.trade == "1") {
            //right:-3px
            switch (option.hogatype) {
                case 0: case 1:
                    sHtml = "<div class='RightQtyDiv'><div style='width:" + option.percent + "%;' class='SellQtyGraph'>-</div>"; break;
                case 2:
                    sHtml = "<div class='RightQtyDiv'><div style='width:" + option.percent + "%;' class='SellQtyGraph'>-</div>"; break;
            }
            sHtml = sHtml + "<p class='RightQtyText'>" + values[0] + "." + str + "</p></div>";
            //option.trade 2 인경우 매수 잔량 색 표시
        } else if (option.trade == "2") {
            switch (option.hogatype) {
                case 0: case 2:
                    sHtml = "<div class='LeftQtyDiv'><div style='width:" + option.percent + "%;' class='BuyQtyGraph'>-</div>";
                    sHtml = sHtml + "<p class='LeftQtyText'>" + values[0] + "." + str + "</p></div>";
                    break;
                case 1:
                    sHtml = "<div class='RightQtyDiv'><div style='width:" + option.percent + "%;' class='BuyQtyGraph'>-</div>";
                    sHtml = sHtml + "<p class='RightQtyText'>" + values[0] + "." + str + "</p></div>";
                    break;
            }
        }
        thisctrl.html(sHtml);
        return value;
    }
    thisctrl.html(value);

    return value;
}
*/
maskstr.GetMaskInfo = function (element) {
    var format = x2h.xmlGetAttr(element, "mask");
    if (format == undefined || format == "") return {};

    var obj  = _MaskFormat(format);
    return obj;
}

maskstr.GetMaskValue = function (format, ui) {
    var mask = format;
    if (typeof (format) === "string") {
        mask = _MaskFormat(format);
    }

    var value = ui;
    if (typeof (ui ) === "object") {
        value = ui.text;
    }

    if (value === "" || value == undefined) return "";
    if (Object.keys(mask).length === 0 || mask == undefined) return value;

    value = value.toString();
    if (mask.gubun == 0) {   // 문자열 마스킹
        // --> [Edit] 수정자: 윤성욱 일시:2019/09/24 opCal값 받도록 수정
        if (ui.opCal)
            mask["opCal"] = ui.opCal;
        else
            mask["opCal"] = 0;
        return maskstr.GetStringFormat(mask, value);
        // <--> [Edit] 수정자: 윤성욱 일시:2019/09/24 opCal값 받도록 수정
    }
    else if(mask.gubun == 1) { // 숫자형 마스킹
        return maskstr.GetNumberFormat(mask, value, ui.code, ui);
    }
    else if (mask.gubun == 2) { // Text Trim
        return maskstr.GetTextFormat(mask, value);
    }

    return ui;

}
// Text 중에 ltrim, rttim 처리함수
maskstr.GetTextFormat = function (mask, value) {
    if (value === "" || value == undefined) return "";
    if (Object.keys(mask).length === 0 || mask == undefined) return value;

    value = value.toString();
    var grid = mask.grid || {};
    if (grid.ltrim) {  // Left Trim
        value = value.ltrim(grid.ltrim);
    }
    if (grid.rtrim) { // Right Trim
        value = value.rtrim(grid.rtrim);
    }

    return value;
}

maskstr.GetNumberFormat = function (mask, value, symbol, ui) {
    if (value === "" || value == undefined) return "";
    if (Object.keys(mask).length === 0 || mask == undefined) return value;

    // [Edit] --> 2019.03.20 kws
    // maxlength를 넘어가는 숫자가 입력되었을때 처리
    // 중간에 .을 지웠을때를 대비해서
    if (mask.maxlength){
        if (value.length > mask.maxlength) {
            if (parseInt(value).toString().length > mask.maxlength)
                value = value.substring(0, parseInt(mask.maxlength));
        }
    }

    var nozero = mask.nozero || 0;           //"0" 표시하지 않음
    var maskcomma = mask.comma||0;     //"," 표시
    var maskminus = mask.minus || 0;     //"-" 부호표시
    var maskdecimal = mask.decimal || 0; //소수점 자리수 표시
    var maskdecnum = mask.decnum || 0;   //소수점 자리수
    var maskprefix = mask.prefix || "";   //문자를 데이터 앞에 표시
    var masksufix = mask.sufix || "";     //문자를 데이터 뒤에 표시
    // --> [Edit] 수정자:kim changa 일시:2019/05/28
    // 수정내용> 엑셀내보내기 기능
    // 엑셀보내기시에 콤마를 자동제거를 한다.
    if (ui && ui.Export) {
        maskprefix = "";
        masksufix = "";
        maskcomma = 0;
    }
    // <-- [Edit] kim changa 2019/05/28

    value = value.toString();

    var sign = (value.indexOf('-') > -1 ? '-' : '');
    var grid = mask.grid || {}, val, d;

    // --> [Edit] 수정자:kim changa 일시:2019/10/31
    // 데이터중에 - 가 있으면 무조건 - 붙인다.
    if (sign == '-' && maskminus != "1") {
        maskminus = 1;
    }
    // <-- [Edit] kim changa 2019/02/01

    // --> [Edit] 수정자:kim changa 일시:2019/02/01
    // 수정내용>  +.- 부호를 붙인다
    if (grid.sign == 3) {
        if (sign == '') {
            sign = (value.indexOf('+') > -1 ? '+' : '');
            if (sign == '+') {
                value = value.replace(/\+/, ''); // + 부호제거
            } else if (parseFloat(value) > 0) {
                sign = '+';
            }
        }
        maskminus = 1;
    }
    // <-- [Edit] kim changa 2019/02/01

    if (maskminus != "1") sign = '';

    //value = value.replace(/[^\d\.\-]/g, '');
    value = value.replace(/[^\d\.]/g, '');
    // store the sign

    value = value.replace(/^0+/, '');
    if (value == "" || parseFloat(value) == 0) value = "0";

    if (nozero == "1") {
        var zero = parseFloat(value);
        if(zero == 0) return "";
    }

    // determine the multiplier for rounding
    var parts = value.toString().split('.');
    var integerpart = parts[0];
    if (integerpart == "") integerpart = "0";
    var decimalpart = parts.length > 1 ? parts[1] : "";

    if (grid.pointdel) {  // 소수점 이하 처리안함
        decimalpart = ""; maskdecnum = 0;
    }

    // 심볼값으로 소수점 이하 자동처리
    if (symbol != undefined) {
        maskdecnum  = hi5.GetCodeInfo(symbol, { itemname: "decnum" });
        maskdecimal = maskdecnum > 0 ? "1" : "0";
        if (maskdecnum == 0) decimalpart = ""

    }

    if (maskdecimal == "1") {   //소수점 자리수 처리
        // 소수점 자리수에서 0 추가되는 부분만 색 정보 변경
        if (grid.textcolor) {
            var addzero = maskdecnum;
            if (decimalpart != "") {
                addzero = decimalpart.length >= maskdecnum ? 0 : maskdecnum - decimalpart.length;
                if (addzero == 0)
                    decimalpart = hi5.RPAD(decimalpart, maskdecnum, "0");

            }
            if (addzero > 0 )
                decimalpart += "<span style='color:gray'>" + "0".repeat(addzero) + "</span>";
        } else {
            if (decimalpart != "") {
                if (grid.round) {  // 반올림 처리
                    decimalpart = value.round(maskdecnum).toString().split('.')[1] || "";
                }
                else {
                	if (hi5.WTS_MODE != WTS_TYPE.MDI) {
                    	decimalpart = hi5.RPAD(decimalpart, maskdecnum, "0");
                	}
                }
            } else {

                if (hi5.WTS_MODE != WTS_TYPE.MDI) {
                	decimalpart = hi5.RPAD("", maskdecnum, "0");
                }
                
            }
        }
    }

    if (grid) {
        if (grid.pow) {  // 숫자단위
            val = parseInt(integerpart); d = Math.pow(10, grid.pow);
            if (val > 0) {
                integerpart = (val / Math.pow(10, grid.pow));//.toFixed();
                integerpart = grid.round ? integerpart.toFixed() : Math.floor(integerpart).toString();
            }
        }
    }
  
    if (decimalpart.length > 0) decimalpart = "." + decimalpart;

    if (maskcomma == "1") {
        integerpart = putThousandsSeparators(integerpart);
    }

    function fnw(match) {
        var key = match;
        key = match.replace('{', '').replace('}', '');
        if (g_sufix[key]) {
            key = g_sufix[key][local_lang] ? g_sufix[key][local_lang] : "";
        }
        else {
            return match;
        }
        return key;
    }

    // 뒤 첨자에 정규식 표현여부 처리
    if (masksufix != "" && masksufix.length >= 4) {
        //.*-> 한번만 *->반복
        masksufix = masksufix.replace(/{[^][^{]*?}/g, fnw);
    }

    value = maskprefix + sign + integerpart + decimalpart + masksufix;	//set text

    return value;
}

maskstr.GetMaskEditFormat = function (mask, value) {
    var orgvalue = value;
    var nozero = mask.nozero || 0;           //"0" 표시하지 않음
    var maskcomma = mask.comma || 0;     //"," 표시
    var maskminus = mask.minus || 0;     //"-" 부호표시
    var maskdecimal = mask.decimal || 0; //소수점 자리수 표시
    var maskdecnum = mask.decnum || 0;   //소수점 자리수
    var maskprefix = mask.prefix || "";   //문자를 데이터 앞에 표시
    var masksufix = mask.sufix || "";     //문자를 데이터 뒤에 표시

    var decimalsign = value.indexOf('.');

    var sign = (value.indexOf('-') > -1 ? '-' : '');
    if (maskminus != "1") sign = '';

    //value = value.replace(/[^\d\.\-]/g, '');
    value = value.replace(/[^\d\.]/g, '');
    // store the sign

    value = value.replace(/^0+/, '');
    //if (value == "" || parseFloat(value) == 0) value = "0";
    if (value == "") value = "0";

    if (nozero == "1") {
        var zero = parseFloat(value);
        if (zero == 0) return "";
    }

    // determine the multiplier for rounding
    var parts = value.toString().split('.');
    var integerpart = parts[0];
    if (integerpart == "") integerpart = "0";
    var decimalpart = parts.length > 1 ? parts[1] : "";

    if (maskdecimal == "1" && maskdecnum > 0) {   //소수점 자리수 처리
        if (value.length > 1 || decimalsign > -1) {
            if (value.indexOf('.') == (value.length - 1)) {
                return orgvalue;
            }
        }

        if (decimalpart != "") {
            if (decimalpart.length > maskdecnum)
                decimalpart = decimalpart.substring(0, maskdecnum);
        }
    }

    if (decimalpart.length > 0) decimalpart = "." + decimalpart;

    if (maskcomma == "1") {
        integerpart = putThousandsSeparators(integerpart);
    }

    function fnw(match) {
        var key = match;
        key = match.replace('{', '').replace('}', '');
        if (g_sufix[key]) {
            key = g_sufix[key][local_lang] ? g_sufix[key][local_lang] : "";
        }
        else {
            return match;
        }
        return key;
    }

    // 뒤 첨자에 정규식 표현여부 처리
    if (masksufix != "" && masksufix.length >= 4) {
        
        //.*-> 한번만 *->반복
        masksufix = masksufix.replace(/{[^][^{]*?}/g, fnw);
    }

    value = maskprefix + sign + integerpart + decimalpart + masksufix;	//set text
    return value;
}

var g_sufix = {
    "W6": { ko: " 백만원", en: " One mill\\", jp: " 百万\\" },
    "W7": { ko: " 천만원", en: " Ten mill\\", jp: " 千万\\" },
    "W8": { ko: " 억원", en: " Bill\\", jp: " 億\\" },
    "W9": { ko: " 조원", en: " tril\\", jp: " 兆\\" }
}

// --> [Edit] 수정자:kim changa 일시:2019/01/07
// 수정내용> 문자열 이고 데이터타입별 정의값 
var Hi5_mDataType = {
    MDT_NORMAL: "0",	// 일반(문자)
    MDT_DATAYPE_DAY: "1",		// 일자
    MDT_DATAYPE_TIME: "2",		// 시간
    MDT_DATAYPE_DAYTIME: "3",	// 일자+시간
    MDT_DATAYPE_TELNO: "4",		// 전화번호
    MDT_DATAYPE_ACCTNO: "5",	// 계좌정보 
    MDT_DATAYPE_USERNAME: "6",  //고객이름 
    MDT_DATAYPE_PASSPORT: "7",	//여권번호
    MDT_DATAYPE_HPNO: "8",		//휴대폰번호 
    MDT_DATAYPE_SOCIALSECURITYNO: "9",//주민번호
    MDT_DATAYPE_EMAIL: "10",	//3
    MDT_DATAYPE_POSTCODE: "11"	//우편번호
};
// <-- [Edit] kim changa 2019/01/07


// 시간. 일자. 일자+시간 마스킹 정의
var g_DefDateformat = {
    "hh:mm:ss": { type: 't', format: function (t) { return t.h + ":" + t.m + ":" + t.s } },
    "hh:mm": { type: 't', format: function (t) { return t.h + ":" + t.m } },
    "mm:ss": { type: 't', format: function (t) { return t.m + ":" + t.s } },
    "yyyy/mm/dd": { type: 'd', format: function (d) { return d.y + "/" + d.m + "/" + d.d } },
    "mm/dd/yyyy": { type: 'd', format: function (d) { return d.m + "/" + d.d + "/" + d.y } },
    "yyyy/mm": { type: 'd', format: function (d) { return d.y + "/" + d.m } },
    "yy/mm": { type: 'd', format: function (d) { return d.y.substr(2) + "/" + d.m } },
    "yy/mm/dd": { type: 'd', format: function (d) { return d.y.substr(2) + "/" + d.m + "/" + d.d } },
    "mm/dd": { type: 'd', format: function (d) { return d.m + "/" + d.d } },
    "dd hh:mm": { type: 'dt', format: function (dt) { return dt.dd + " " + dt.h + ":" + dt.m } },
    "mm/dd hh:mm": { type: 'dt', format: function (dt) { return dt.mm + "/" + dt.dd + " " + dt.h + ":" + dt.m } },
    "mm/dd hh:mm:ss": { type: 'dt', format: function (dt) { return dt.mm + "/" + dt.dd + " " + dt.h + ":" + dt.m + ":" + dt.s } },
    "yyyy/mm/dd hh:mm:ss": { type: 'dt', format: function (dt) { return dt.yy + "/" + dt.mm + "/" + dt.dd + " " + dt.h + ":" + dt.m + ":" + dt.s } },
    "yy/mm/dd hh:mm": { type: 'dt', format: function (dt) { return dt.yy.substr(2) + "/" + dt.mm + "/" + dt.dd + " " + dt.h + ":" + dt.m } },
    "yyyy/mm/dd ~ yyyy/mm/dd": { type: 'dd', format: function (dd) { return dd.y + "/" + dd.m + "/" + dd.d + " ~ " + dd.y1 + "/" + dd.m1 + "/" + dd.d1 } },
};


maskstr.GetStringFormat = function (mask, value) {
    if (value === "" || value == undefined) return "";

    // --> [Edit] 2019.03.20 kws
    // 수정내용 : 타입별로 입력제한
    switch (mask.type) {
        case "1":   //Day
        case "2":   //Time
        case "3":   //Day+Time
        case "4":   //Telephone
        case "5":   //ACCT Number
        case "8":   //HandPhone
        case "11":  //Post Code
            value = value.replace(/[^0-9]/gi, '');
            break;
        default:
            break;
    }
    if (mask.type == "99") {
        value = value.replace(/[^A-Za-z0-9]/gi, '');
    }

    if (Object.keys(mask).length === 0 || mask == undefined || mask.format.length <= 0) return value;
    var objDate, dt;

    // --> [Edit] 수정자:kim changa 일시:2019/03/07
    // 수정내용> UTC,시간 처리
    //dt = hi5.getUTCLocalTime(value).utc;
    //dt = hi5.getUTCLocalTime(value).utc;
    if (mask.opCal != "7")//수정전 =="7"  // --> [Edit] 수정자:윤성욱 일시:2019/09/24
        //dt = hi5.getUTCLocalTime(value).utc;  //utc time
        //else
        if(hi5.WTS_MODE == WTS_TYPE.MDI){
            dt = hi5.getUTCLocalTime(value).utc;    // 2019.12.18 어드민은 무조건 utc 시간으로 나와야한다.
        }
        else
            dt = hi5.getUTCLocalTime(value).local;  //local time // <-- [Edit] 수정자:윤성욱 일시:2019/09/24
    // <-- [Edit] kim changa 2019/03/07
    
    //var masktype   = mask.masktype;       //0-일반 1-일자 2-시간 3-일자+시간 4-전화번호
    //var maskstring = mask.format;   //마스크 형식
    //mask.masktype : 0-일반 1-일자 2-시간 3-일자+시간 4-전화번호
    if (mask.type == Hi5_mDataType.MDT_DATAYPE_DAY ) {   // 일자
        //maskstring = "[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}";
        //value = value.replace(/[^0-9]/g, '');
        if (dt === undefined) {
            if (value.length == 4) return value.substr(0, 2) + "/" + value.substr(2, 2);
            if (value.length < 8) return value;
            dt = {
                yy: value.substr(0, 4),
                mm: value.substr(4, 2),
                dd: value.substr(6, 2)
            };
        }
        return dt.yy + "/" + dt.mm + "/" + dt.dd;
    }
    else if (mask.type == Hi5_mDataType.MDT_DATAYPE_TIME) { // 시간
        if (dt === undefined) {
            if (value.length < 5) return value;
            dt = {
                h: value.substr(0, 2),
                m: value.substr(2, 2),
                s: value.substr(4, 2)
            };
        }
        return dt.h + ":" + dt.m + ":" + dt.s;
    }
    else if (mask.type == Hi5_mDataType.MDT_DATAYPE_DAYTIME ) {  // 일자(8)+시간(6)
        //maskstring = "[0-9]{4}/[0-9]{1,2}/[0-9]{1,2} [0-9]{2}:[0-9]{2}";
        //value = value.replace(/[^0-9]/g, '');
        var objDate = g_DefDateformat[mask.format];
        if (objDate) {
            switch (objDate.type) {
                case 'dt':
                    if (dt) {
                        return objDate.format(dt);
                    }
                    if (value.length < 14) {
                        if (value.length != 12) return value;
                        var dt = {
                            yy: value.substr(0, 4),
                            mm: value.substr(4, 2),
                            dd: value.substr(6, 2),
                            h: value.substr(8, 2),
                            m: value.substr(10, 2)
                        };
                        value = objDate.format(dt);
                        break;
                    }
                    else {
                        var dt = {
                            yy: value.substr(0, 4),
                            mm: value.substr(4, 2),
                            dd: value.substr(6, 2),
                            h: value.substr(8, 2),
                            m: value.substr(10, 2),
                            s: value.substr(12, 2)
                        };
                        value = objDate.format(dt);
                        break;
                    }
                case 'dd':
                    if (value.length < 16) return value;
                    var dd = {
                        y: value.substr(0, 4),
                        m: value.substr(4, 2),
                        d: value.substr(6, 2),
                        y1: value.substr(8, 4),
                        m1: value.substr(12, 2),
                        d1: value.substr(14,2)
                    };
                    value = objDate.format(dd);
                    break;
            }

        }
    }
    else {
        // 개인정보 마스킹 정보
        return this.GetPrivacyStringFormat(mask, value, option)
    }

    return value;
}

// 개인정보 관련 마스킹 함수
maskstr.GetPrivacyStringFormat = function (mask, value, option) {
    var unMask = false;
    //  option.unMask 값이 true 이면 unMask 기능 대응
    if (option && option.unMask)
        unMask = true;

    if (mask.type == Hi5_mDataType.MDT_DATAYPE_TELNO) { // 전화번호( 집전화번호)
        //maskstring = "[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}";

        var value1 = value.replace(/[^0-9]/g, '');

        if (value1.length < 9) return value;
        if (value1.length == 11) {
            var tel1 = value1.substring(0, 3);
            var tel2 = value1.substring(3, 7);
            var tel3 = value1.substring(7, 11);

            value1 = tel1 + "-" + tel2 + "-" + tel3;
        }
        else if (value1.length == 10) {
            var tel1 = value1.substring(0, 2);
            var tel2 = value1.substring(2, 6);
            var tel3 = value1.substring(6, 10);
            if (tel1 == "01") {
                tel1 = value1.substring(0, 3);
                tel2 = value1.substring(3, 6);
                tel3 = value1.substring(6, 10);
            }

            value1 = tel1 + "-" + tel2 + "-" + tel3;
        }
        else if (value1.length == 9) {
            var tel1 = value1.substring(0, 2);
            var tel2 = value1.substring(2, 5);
            var tel3 = value1.substring(5, 9);

            value1 = tel1 + "-" + tel2 + "-" + tel3;
        } else return value;

    } else if (mask.type == Hi5_mDataType.MDT_DATAYPE_ACCTNO && unMask == false) {	// 계좌정보
        var value1 = value;
        var regex = /^(\d{3})-?(\d{1,2})\d{2}-?\d{3}(\d{3})/g;
        if (regx.test(value1) == true)
            value = value1.replace(/^(\d{3})-?(\d{1,2})\d{2}-?\d{3}(\d{3})/g, '$1-***-***$3');
        else
            return value;

    } else if (mask.type == Hi5_mDataType.MDT_DATAYPE_USERNAME && unMask == false) {  //고객이름 
        // debugger;

        if (value.length == 3) {
            value = value.replace(/.{2}$/g, "**");
        }
        if (value.length == 2) {
            value = value.replace(/.{1}$/g, "*");
        }
        if (value.length == 1) {
            value = value.replace(/./g, "*");
        }
        if (value.length > 3) {
            var len = value.length - 2;
            var msstring = "";
            for (var i = 0; i < len; i++) {
                msstring += "*";
            }
            value = value.replace(new RegExp('.{' + len + '}$', 'g'), msstring);
        }
    } else if (mask.type == Hi5_mDataType.MDT_DATAYPE_PASSPORT && unMask == false) {	//여권번호
        value = value.replace(/.{4}$/gi, "****");
    } else if (mask.type == Hi5_mDataType.MDT_DATAYPE_HPNO && unMask == false) {		//휴대폰번호 
        var pattern = /[)]/g;
        var patter2 = /^(\d{2,3})(\d{3,4})(\d{4})/g;
        if (pattern.test(value)) {
            var s = value.split(')');
            s[1] = s[1].replace(/^(\d{2,3})(\d{3,4})(\d{4})/g, ' ******* $3');

            value = s[0] + ")" + s[1];
        } else if (pattern2.test(value))
            value = value.replace(/^(\d{2,3})(\d{3,4})(\d{4})/g, ' ******* $3');
        else return value;
    } else if (mask.type == Hi5_mDataType.MDT_DATAYPE_HPNO && unMask == true) {		//휴대폰번호 
        var pattern = /[)]/g;
        if (pattern.test(value)) {
            var s = value.split(')');
            s[1] = s[1].replace(/^(\d{2,3})(\d{3,4})(\d{4})/g, '$1-$2-$3');

            value = s[0] + ")" + s[1];
        }
        value = value.replace(/^(\d{2,3})(\d{3,4})(\d{4})/g, '$1-$2-$3');
    }
    else if (mask.type == Hi5_mDataType.MDT_DATAYPE_SOCIALSECURITYNO && unMask == false) {//주민번호
        var pattern = /^(\d{6})-(\d{1})\d{6}/g;
        if (pattern.test(value))
            value = value.replace(/^(\d{6})-(\d{1})\d{6}/g, '$1-$2******');
        else return value;

    } else if (mask.type == Hi5_mDataType.MDT_DATAYPE_EMAIL && unMask == false) {	//이메일
        if (value.indexOf('@') != -1) {
            var len = value.split('@')[0].length - 3;  // ******@gmail.com
            value = value.replace(new RegExp('.(?=.{0,' + len + '}@)', 'g'), '*');
            var value1 = value.split('@')[0]


            var domain = value.split('@')[1]; //gmail.com
            var domain2 = domain.split('.');
            var a = domain2[0];
            var len2 = a.length - 2;
            var scount = '';
            for (var i = 0; i < len2; i++) {
                scount = scount + '*';
            }
            if (domain2.length == 2) {
                domain2[0] = domain2[0].replace(new RegExp('.{' + len2 + '}$', 'g'), scount);
                value = value1 + '@' + domain2[0] + '.' + domain2[1];
            }
            else if (domain2.length == 3) {
                domain2[0] = domain2[0].replace(new RegExp('.{' + len2 + '}$', 'g'), scount);

                value = value1 + '@' + domain2[0] + '.' + domain2[1] + '.' + domain2[2];
            }
        } else return value;




    } else if (mask.type == Hi5_mDataType.MDT_DATAYPE_POSTCODE && unMask == false) {	//우편번호
        value = value.replace(/.{4}$/gi, "****");
    }
    return value;
}

maskstr.GetUnMaskedValue = function (mask, value) {
    if (value === "" || value == undefined) return "";
    if (!mask || Object.keys(mask).length === 0 || mask == undefined || !mask.gubun) return value;

    if (mask.gubun == 0) {
        var masktype = mask.type;       //0-일반 1-일자 2-시간 3-일자+시간 4-전화번호
        var maskstring = mask.format;   //마스크 형식

        if (masktype == "1") {
            value = value.replace(/\//g, '');
        }
        else if (masktype == "2") {
            value = value.replace(/\:/g, '');
        }
        else if (masktype == "3") {
            value = value.replace(/\:/g, '').replace(/\//g, '');
        }
        else if (masktype == "4") {
            value = value.replace(/\-/g, '');
        }
        return value;
    }
    else {
        if (mask.decimal == "1" && mask.decnum > 0) {   // 2019.03.27 kws -> focus되었을때 콤마만 제거. parseFloat시 값이 변경될수 있음.
            return value.replace(/[^\d\.]/g, '');
        }
        value = parseFloat(value.replace(/[^\d\.]/g, ''));
        return value;
    }
}

maskstr.GridFormat = function (mask, value) {
    var str = this.GetMaskValue(mask, value);
    return str;
    //rowData.pq_cellcls = rowData.pq_cellcls || {};
    //return {
    //    text: "<div style = 'height:100%;overflow:hidden;'>" + ui.cellData + "</div>",
    //    style: "height:30px;"
    //    attr : "up_txt"
    //    cls:'red'
    //};
    //return rowData[rowIndx];
    
}

maskstr.GetMaskMaxLength = function (mask) {
    var len = 0;
    if (mask.gubun == 0) {
        var masktype = mask.type;       //0-일반 1-일자 2-시간 3-일자+시간 4-전화번호
        var maskstring = mask.format;   //마스크 형식

        if (masktype == "1") {
            len = 8;
        }
        else if (masktype == "2") {
            len = 6;
        }
        else if (masktype == "3") {
            len = 14;
        }
        else if (masktype == "4") {
            len = 11;
        }
    }

    return len;
}


// jmcode설정
function hi5_jmcode_save() {
    var objConfig = hi5.SHMEM["symbol"];
    var key = hi5.GetCookieKeyName("_symbol_");
    if (key != "") {
        simpleStorage.set(key, objConfig)
    }
}

// jmcode호출
function hi5_jmcode_load() {
    var key = hi5.GetCookieKeyName("_symbol_");
    if (key == "") return null;

    var obj = simpleStorage.get(key)
    if (!hi5.isEmpty(obj)) {
        hi5.SHMEM["symbol"] = obj;
        return obj;
    }

    return null;
}

// --> [Edit] 20190215 lnh 
// canvas에서 사용하는 함수
// class에 해당하는 style 값을 취득해서 반환해준다
// attrData : canvas에서 기존에 사용하고있던 object를 넘겨준다.
// keyData : attrData중에 color값을 넣고 싶은 key와 classname을 넘겨준다.(object)
function hi5_getMultiColor(id, attrData, keyData) {
    var keyList = Object.keys(keyData), className = "";
    var innerHTML = "<div id='temp"+id+"' style='width:0px;height:0px;'></div>";
    $("body").append(innerHTML);
    keyList.forEach(function (key, idx) {
        $("#temp"+id).removeClass(className);

        var data = keyData[key];
        className = data.class;
        var necColor = data.necColor;
        if(hi5.SHMEM.user_setting && hi5.SHMEM.user_setting.general && hi5.SHMEM.user_setting.general.theme == "light"){
            $("#temp"+id).addClass("theme-light");    
        }
        $("#temp"+id).addClass(className);
        attrData[key] = hi5.getStyle($("#temp"+id)[0], necColor);
    });
    $("div").remove("#temp"+id);
}

// --> [Edit] 20190219 kws
// rgb 값을 hex값으로 변경해주는 함수
// rgb(xxx,xxx,xxx) 형태로 넘기면 #XXXXXX 형태로 리턴
// tradingview 차트에서는 rgb가 인식이 안됨.
function rgb2hex(rgb) {
    if (!rgb) return rgb;
    var hex;
    var a = rgb.split("rgb(");
    if (!a[1]) return rgb;
    var b = a[1].split(",");
    if (b.length < 3) return rgb;
    var red = parseInt(b[0]);
    var green = parseInt(b[1]);
    var blue = parseInt(b[2]);
    rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

function closeBrowser() {
    window.open("about:blank", "_self").close();
}


// table, Hoga공통처리기능
var tbho = {
    initList: ["price", "trade", "cointype", "opcal", "plusminuscolor"],

    comModel: function (that, item, objXML) {
        var colModel = {}, cmp = true;
        this.initList.forEach(function (name) {
            if (objXML[name]) {
                cmp = false;
                colModel[name] = objXML[name];
            }
        });

        colModel["cmp"] = cmp;  // 이전값비교해서 동일하면 처리안함
        if (objXML.mask) {
            colModel["mask"] = objXML.mask;
        }
        that.itemObjs[item] = colModel;
    },
    // 테이블 컬럼 숨김정보
    hideColsHTML: function (self, objXML) {
        var attr = [];
        objXML.cols.split(",").forEach(function (col) {
            attr.push(parseInt(col));
        })
        return attr;
    },

    colgroupHTML: function (self, objXML, hideCols) {
        var attr = [];
        // 원본사이즈 정보
        self.colWidths = objXML.width.split(",");

        $.each(self.colWidths, function (col, width) {
            // 컬럼숨김정보는 값을 0px로 변경을 한다.
            if (hideCols && hideCols.length > 0 && hideCols.includes(col)) {
                attr.push("<col style='width: 0 px'>");
            } else {
                attr.push("<col style='width:" + width + "'>");
            }
        })
        return "<colgroup> " + attr.join("") + "</colgroup>\r\n";
    },

    tbodyHTML: function (xmlNode, that, stl) {
        var tagName = x2h.getNodeName(xmlNode);
        var cls = [], // 클래스 정보명 
            style = stl ? stl : [],  //  Style, 색정보용 Style  정보
            attr = {},
            html = "",
            objXML,
            objCaptionCls,
            objDataCls;
            // 기본 셀에 클래스명을 일괄적용하는 기능
            if (that.fncustom && that.fncustom.cellclass) {
                objCaptionCls = that.fncustom.cellclass.caption;
                objDataCls = that.fncustom.cellclass.data;
            }


            style = style.length ? " style='" + style.join("") + "' " : "";
            html = "<" + tagName + ">";
            if (style.length) {
                html = "<" + tagName + style+ ">";
            }
            var arText = [html];

            tagName = x2h.getNodeName(xmlNode.firstElementChild);
            var i, y, j, langTga;
        // TR
            if (that.ctlName == 'hoga') {
                for (i = 0 ; xmlNode.children && i < xmlNode.children.length; i++) {
                    if (i % 2 == 0) {

                        for (j = 0 ; j < xmlNode.children[i].children.length; j++) {
                            xmlNode.children[i].children[j].className = 'hoga_body_bg_even';
                        }
                    } else {
                        for (j = 0 ; j < xmlNode.children[i].children.length; j++) {
                            xmlNode.children[i].children[j].className = 'hoga_body_bg_odd';
                        }
                    }
                }
            }

            for (i = 0 ; xmlNode.children && i < xmlNode.children.length; i++) {
                y = xmlNode.children.item ? xmlNode.children.item(i) : xmlNode.children[i];
                if (y.nodeType != 1) continue;
                //arText.push("<tr>");
                //arText.push("<" + y.nodeName + ">");
                var s = "<" + y.nodeName + ">";

                cls = []; // 클래스 정보명
                style = [];  //  Style, 색정보용 Style  정보
                attr = { };
                objXML = x2h.getXML2Control(y, null, attr, cls, style);
                if (style.length) {
                    style[0] = x2h.getColorReplace(style[0], true);   // {color}값을 취환하는 기능
                }
                if (Object.keys(objXML).length > 0) {
                     style = style.length ? " style='" + style.join("") + "' " : "";

                    var attrs = [];
                    for (var key in attr) {
                        if (attr[key] !== "") {
                            attrs.push(key + '="' + attr[key] + '"');
                        }
                    }
                    s = ["<" + y.nodeName + " class='", cls.join(" "), "' ", attrs.join(" "), style, ">"].join("");
                }
                arText.push(s);

                // TD
                for (j = 0; y.children && j < y.children.length; j++) {
                    var xmlElement, dataCell = "";
                    xmlElement = y.children.item ? y.children.item(j) : y.children[j];
                    if (xmlElement.nodeType != 1) continue;

                    cls = []; // 클래스 정보명
                    style = [];  //  Style, 색정보용 Style  정보
                    attr = { item: "", colspan: "", rowspan: "" };
                    objXML = x2h.getXML2Control(xmlElement, null, attr, cls, style);

                    if (style.length) {
                        style[0] = x2h.getColorReplace(style[0], true);   // {color}값을 취환하는 기능
                    }
                    // 호가 등락률
                    if (objXML.rate && !that.bHogaRate) {
                        that.bHogaRate = true;
                        if (that.itemObjs["hoga_rate"] == undefined) {
                            // column정보설정
                            this.comModel(that, "hoga_rate", objXML);
                        }
                    }
                    //item 정보
                    if (objXML.item) {
                        cls.push("comitem fid" + objXML.item);  // fid+item(fid)항목설정
                        if (!objXML.itemflag || objXML.itemflag == '2' || objXML.itemflag == '3')
                            that.comm_list.push(objXML.item);  // 사용안함, 입력용인경우 통신을 날리지 않도록 한다.

                        if (objDataCls) {
                            cls.push(objDataCls);
                        }

                        // 호가가격별 환산가격 FID를 설정한다.
                        //if (this.convertprice && x2h.xmlGetAttr(xmlElement, "price") == "1") {
                        if (that.convertprice && objXML.price === "1" && that.maxhoga) {
                            that.comm_list.push(g_Hoga_CPList[objXML.item]);
                        }
                        // column정보설정
                        this.comModel(that, objXML.item, objXML);
                    } else {
                        // 다국어 입력
                        langTga = "caption_" + local_lang;
                        if (objXML[langTga]) {
                            dataCell = objXML[langTga];
                            if (objCaptionCls) {
                                cls.push(objCaptionCls);
                            }
                        }
                    }

                    if (objXML.hover) {
                        cls.push("td_hover");
                    }

                    if (objXML.toggle && that.maxhoga) {
                        cls.push("hoga_tbl_toggle");
                    }

                    // 호가 가격컬럼의 매도매수 호가가격
                    if (that.maxhoga && objXML.price && objXML.trade) {
                        if (objXML.trade == "1") {
                            cls.push("hoga_price_cls hoga_sell_cls");
                        } else if (objXML.trade == "2") {
                            cls.push("hoga_price_cls hoga_buy_cls");
                        }
                    }

                    style = style.length ? " style='" + style.join("") + "' " : "";
                    
                    var attrs = [];
                    for (var key in attr) {
                        if (attr[key] !== "") {
                            attrs.push(key + '="' + attr[key] + '"');
                        }
                    }
                    
                    //var s = ["<td class='", cls.join(" "), "' ", attrs.join(" "), style, " >", dataCell, "</td>"].join("");
                    s = ["<" + xmlElement.nodeName + " class='", cls.join(" "), "' ", attrs.join(" "), style, " >", dataCell, "</" + xmlElement.nodeName + ">"].join("");
                    arText.push(s);
                }
                arText.push("</" + y.nodeName + ">");
            }
            return arText.join(" ");
    }
}


