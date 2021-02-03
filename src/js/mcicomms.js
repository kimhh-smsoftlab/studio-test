//Object.defineProperties() 메서드는 이미 존재하거나 새로운 프로퍼티들의 각종 속성들을 재정의할 수 있습니다.
function Queue() {
    Object.defineProperties(  //defineProperty와 defineProperties는 IE9, FF4+ Chrome 에서만 작동한다. (ECMScript 5)
        this,
        {
            add:{
                enumerable: true,   //enumerable 은 해당 속성이 for...in 루프나 Object.keys() 에서 노출될지 말지를 정의한다.
                writable: false,    // writable 이 false인 경우 해당 속성은 “non-writable” 이라 한다. 이 경우 해당 속성의 값을 재할당할 수 없다.
                value:addToQueue
            },
            next:{
                enumerable:true,
                writable:false,
                value:run
            },
            pop:{
                enumerable: true,
                writable: false,
                value: pop
            },
            length:{
                enumerable: false,
                writable: false,
                value: length
            },
            clear:{
                enumerable:true,
                writable:false,
                value:clearQueue
            },
            contents:{
                enumerable:false,
                get:getQueue,
                set:setQueue
            },
            autoRun:{
                enumerable:true,
                writable:true,
                value:false
            },
            stop:{
                enumerable:true,
                writable:true,
                value:false
            }
        }
    );

    var queue=[];
    var running=false;
    var stop = false;

    function length() {
        return queue.length;
    }

    function clearQueue(){
        queue=[];
        return queue;
    }
    
    function getQueue(){
        return queue;
    }
    
    function setQueue(val){
        queue=val;
        return queue;
    }

    function addToQueue(){
        for(var i in arguments){
            queue.push(arguments[i]);
        }
        if(!running && !this.stop && this.autoRun){
            this.next();
        }

        //console.log("addToQueue....[" + queue.length + "]");
        return queue.length;
    }

    function pop() {
        if (queue.length < 1 || this.stop) {
            return null;
        }
        return queue.shift();
    }

    function run(){
        running=true;
        if(queue.length<1 || this.stop){
            running=false;
            return;
        }
        queue.shift();
        //queue.shift().bind(this)();
    }
}

var WSocket = (function (win, doc) {
    //var ua = window.navigator.userAgent.toLowerCase();
    return function (opt, settings) {
         function init() {
            this.options = {
                socket: null,
                url: '',
                debug: false,
                objAPI: null,
                secure: false,
                binaryType: "arraybuffer",
                timeoutInterval: 2000,
                timeoutID: 0,
                msgCount: 0,
                bufferSize: 0,      //초당 buffer 누적 사이즈 - 2018.9.20 kiwon34
                rptimerid: 0,
                relogin: false,   // 재 접속 상태유무
                viewOnly : false,  // 조회전용
                loginSuccess: false,
                tokenData: "",
                ticket:"",
                commheader: {},       // 통신헤더 공통값
                rqMng: {},            // 조회요청및 응답관리(키: 조회ID, 정보객체)
                pbMng: new pbMng,     // 자동갱신 관리 매니저
                logOut: false,

                onopen: function () {; },
                onmessage: function () {; },
                onclose: function () {; },
                onerror: function () {; },
                ontimeout: function () {; }
            };

            this.timedOut = false;
            this.forcedClose = false;

            extend.call(this.options, settings);

            extend.call(this.options, opt);
            if (this.options.debug) console.log(JSON.stringify(this.options));

            window.WebSocket && start.call(this.options);
            return this;
        };

        init.prototype = {
            send: send,
            commheader: commHeader,
            socket: getSocket,
            rqidRegister: rqidRegister,
            rqidDelete: rqidDelete,
            connect: connectState,
            loginState: loginState,
            commReal: pbMngRegister,
            poolData: getPoolData,
            setRealData: setRealData,
            getRealData: getRealData,
            close: close,
            tokenData: tokenData,
            ticket : ticket,
            debuge: debug,
            viewOnly:viewOnly,
            relogin:relogin,
            readyState:readyState,
            clear:clear,
            rqTimeOut:rqTimeOut
        };

        return new init();
    }

    function clear() {
        this.options.logOut = true;
        this.options.commheader = {};
        this.options.pbMng = {};   // 자동갱신 객체
        this.options.tokenData = "";
        this.options.ticket = "";
        this.options.viewOnly = false;
        this.options.relogin = false;
        this.options.loginSuccess = false;
    }

    function tokenData(data) {
        if (arguments.length == 0) {
            return this.options != undefined ? this.options.tokenData : "";
        }
        this.options.tokenData = data;
    }
    
    function ticket(data) {
        if (arguments.length == 0) {
            return this.options != undefined ? this.options.ticket : "";
        }
        this.options.ticket = data;
    }
    // readyState == WebSocket.CONNECTING, OPEN, CLOSING, CLOSED  
    function debug(bOnOff) {
        this.options.debug = bOnOff;
    }

    // Socket 종료함수
    function close(code, reason) {
        if (typeof code == 'undefined') {
            code = 1000;
        }
        if (this.connect()) {
            this.options.socket.close(code, reason);
        }
    }

    function getRealData(option, fn) {
        var pbMng = this.options.pbMng;
        if (pbMng) {
            return pbMng.getRealData(option,fn);
        }
        return null;
    }
    function setRealData(option, objData) {
        var pbMng = this.options.pbMng;
        if (pbMng) {
            return pbMng.setRealData(option, objData);
        }
        return false;
    }

    // poolData 취득
    function getPoolData(options) {
        var pbMng = this.options.pbMng;
        if (pbMng) {
            return pbMng.CommRealObject(options, true); // {realtype:XXX, push_key:xxx} 
        }
        return null;
    }

    // nType = 0: 리얼해제, 1:리얼등록, 2: 자동갱신 취득
    function pbMngRegister(nType, options) {
        if (this.options.logOut) return [];

        var pbMng = this.options.pbMng, objData;
        if (nType == 1) {
            objData = pbMng.CommSB(options);
        } else if (nType == 0) {
            objData = pbMng.CommSBC(options);
        } else if (nType == 2) {
            // 반환값 배열
            objData = pbMng.CommRealObject(options); // {realtype:XXX, push_key:xxx} 
        }
        return objData;
    }

    function start() {
        var self = this;
        try{
            this.socket = new WebSocket(this.url);
            this.socket.binaryType = this.binaryType;
        } catch (e) {
            console.log(e);
            debugger;
        }

        appendEvents.call(this, this.socket);
        this.timeoutID = setTimeout(function () {
            if (self.debug) {
                console.log('start -> connection-timeout' + self.url);
            }
            timedOut = true;
            //this.socket.close();
//            if (this.socket.readyState != OPEN) {
//                alert("Problem connection, kindly contact system admin...");
 //           }
            timedOut = false;
        }, self.timeoutInterval);
    }

    function appendEvents(socket) {
        var that = this;
        bind(socket, 'open', function (e) {
            if (that.timeoutID != 0) clearTimeout(that.timeoutID);
            that.onopen.call(socket, e, that);
        });
        bind(socket, 'message', function (e) {
            if (that.logOut) return;  // 로그아웃 상태이면 수신 데이터를 버린다.
			if (that.debug) {
                console.log('onmessage: 수신시간:[' + e.timeStamp  + '] byteLength=[ ' + e.data.byteLength + ']');
            }

            that.onmessage.call(socket, e.data, that);

            //var data = e.data;
            //for(var x = 0; x < data.byteLength;x++) {
            //    if (x == 0) {
            //        var firstdata = data.slice(0, data.byteLength - 30);
            //        that.onmessage.call(socket, firstdata, that);
            //        x = data.byteLength - 31;
            //   }
            //    else {
            //        var seconddata = data.slice(x, x + 1);
            //        that.onmessage.call(socket, seconddata, that);
            //    }
            //}
            //var d1 = data.slice(0, data.byteLength - 50);
            //that.onmessage.call(socket, d1, that);

            //var d2 = data.slice(d1.byteLength);
            //that.onmessage.call(socket, d2, that);

        });
        bind(socket, 'close', function (e) {
            clearTimeout(that.timeoutID);
            // 이벤트 발생
            that.onclose.call(socket, e, that);
        });
        bind(socket, 'error', function (e) {
            that.onerror.call(socket, e, that);
        });
        //bind(socket, 'timeout', function (e) {
        //    that.ontimeout.call(socket, e, that);
        //});
    }
    function viewOnly(data) {
        if (arguments.length == 0) {
            return this.options != undefined ? this.options.viewOnly : false;
        }
        this.options.viewOnly = data;
    }

    function relogin(bRelogin) {
        if (arguments.length == 0) {
            return this.options != undefined ? this.options.relogin : false;
        }
        this.options.relogin = bRelogin;
    }
    function loginState(bSuccess) {
        if (arguments.length == 0) {
            return this.options != undefined ? this.options.loginSuccess : false;
        }
        this.options.loginSuccess = bSuccess;
    }

    function readyState() {
        //WebSocket.CONNECTING   0	연결이 수립되지 않은 상태입니다.
        //WebSocket.OPEN	     1	연결이 수립되어 데이터가 오고갈 수 있는 상태입니다.
        //WebSocket.CLOSING	     2	연결이 닫히는 중 입니다.
        //WebSocket.CLOSED	     3	연결이 종료되었거나, 연결에 실패한 경우입니다.
        return this.options.socket ? this.options.socket.readyState : 0;
    }

    // 접속상태 취득
    function connectState() {
        if (this.options && this.options.socket && this.options.socket.readyState == WebSocket.OPEN)
            return true;
        return false;
    }

    // 조회ID 관리(조회 및 추가)
    function rqidRegister(rqid, options) {
        if (arguments.length > 1) {    // Write
            // 이전것이 있으면 삭제를 한다.
            if (this.options.rqMng[rqid])
                delete this.options.rqMng[rqid];

            this.options.rqMng[rqid] = options;
            if (this.options.debug) {
                console.log("rqMngProc: " + this.options.rqMng);
            }
        } else {                        // Read 
            if (this.options.rqMng[rqid] == undefined) return null;
            // 조회 수신시간깂을 0으로 초기화 한다.
            var obj = this.options.rqMng[rqid];
            if (obj.timeout != undefined) obj.timeout = 0;
            return this.options.rqMng[rqid];
        }
    }

    // 조회응답 수신시간체크
    function updateTimeOut() {
        var obj;
        if (window.hi5_DebugLevel && window.hi5_DebugLevel.QUEUE && window.hi5_DebugLevel.QUEUE.SECCNT) {
            hi5.traceTitle({ QUEUE: { SECCNT: { cnt: this.options.msgCount, size: this.options.bufferSize }} });
        }
        this.options.msgCount = 0; // 초당 자동갱신 개수
        this.options.bufferSize = 0;    //초당 buffer 누적 size 초기화 - 2018.9.20 kiwon34

        for (var key in this.options.rqMng) {
            var obj = this.options.rqMng[key];
            if (obj.timeout != undefined && obj.timeout > 0) {
                obj.timeout--;
                if (obj.timeout <= 0) {
                    this.options.ontimeout.call(this.options, { rqid: Number(key), rpMng: obj }, this.options);
                    delete this.options.rqMng[key];
                }
            }
        }
    }
    // 조회응답 타이머 기능
    function rqTimeOut(start) {
        if (start) {
            setTimeout(updateTimeOut.bind(this));       // first time.
            this.options.rptimerid = setInterval(updateTimeOut.bind(this), 1000);
        } else {
            this.options.rqMng = {};
            clearInterval(this.options.rptimerid);
        }
    }

    // 조회ID 객체삭제
    function rqidDelete(rqid, bAll) {
        if (bAll) {
            this.options.rqMng = {};
            return;
        }

        if (this.options.rqMng[rqid]) {
            if (this.options.debug) {
                console.log("rqid Object Delete: " + rqid);
            }
            delete this.options.rqMng[rqid];
        }
    }

    // 통신정보 공통정보 객체
    function commHeader(key, options) {
        // Write
        if (arguments.length > 1) {
            var objTarget = this.options.commheader;
            if (typeof options == "object") {   // 객체복사
                for (var item in options) {
                    objTarget[item] = options[item];
                }
            } else {
                objTarget[item] = options;
            }

            if (this.options.debug) {
                console.log("commheader: " + JSON.stringify(this.options.commheader));
            }
        } else {
            return this.options.commheader[key] == undefined ? "" : this.options.commheader[key];
        }
    }

    function send(msg) {
        if (this.options.debug && this.options.socket.bufferedAmount > 0) {
            console.log('bufferedAmount before send: ' + this.options.socket.bufferedAmount);
        }

        if (this.options.socket && this.options.socket.readyState == WebSocket.OPEN)
            this.options.socket.send(msg);

        if (this.options.debug && this.options.socket.bufferedAmount > 0)
            console.log('bufferedAmount after send: ' + this.options.socket.bufferedAmount);
    }

    function getSocket() {
        return this.options.socket;
    }

    // 객체 상속 함수
    function extend() {
        var target = this
        , opts = []
        , src = null
        , copy = null;
        for (var i = 0, length = arguments.length; i < length; i++) {
            opts = arguments[i];
            for (var n in opts) {
                src = target[n];
                copy = opts[n];
                if (src === copy) continue;
                if (copy) target[n] = copy;
            }
        }
    };

})(window, document);

function webSocket(option) {
    var self;
    self = WSocket({
        onopen: function (e, that) {
            self.rqTimeOut(true);
            if (that.objAPI)
                that.objAPI.onopen(self);
        },

        arrayBufferConcat : function(){
            var arrays = [].slice.call(arguments);
            if (arrays.length <= 0 ) {
                return new Uint8Array(0).buffer
            }

            var arrayBuffer = arrays.reduce(function (cbuf, buf, i) {
                if (i === 0) return cbuf

                var tmp = new Uint8Array(cbuf.byteLength + buf.byteLength)
                tmp.set(new Uint8Array(cbuf), 0)
                tmp.set(new Uint8Array(buf), cbuf.byteLength)

                return tmp.buffer
            }, arrays[0])
            return arrayBuffer;
        },

        onmessage: function (chunk, that) {
            //console.log(chunk);
            if (chunk instanceof ArrayBuffer) {
                that.msgCount++;
                that.bufferSize += chunk.byteLength;

                if (that.gBuffer) {
                    that.gBuffer = hi5.appendBuffers(that.gBuffer, chunk);
                    if (that.gBufferLen < 1) {  // 가끔 1바이트만 잘려서 남는경우가 있어서....2018.12.13 kws
                        // 숫자형으로 변환
                        if (!that.fd) {
                            that.fd = new FastDataView;
                        }
                        //st_header.len; // 통신전문 길이정보(4) -> data부 길이(헤더길이 제외)
                        var ui8a = new Uint8Array(that.gBuffer, 0, 4);
                        that.fd.setBuffer(ui8a, 0, ui8a.byteLength);

                        var item = st_header["len"];
                        var bufferLen = that.fd.A2UBin(ui8a, item); //데이터부 길이만 들어있다.

                        that["gBufferLen"] = bufferLen + st_header.totlen;  //헤더길이 + 데이터부길이
                    }
                }
                else {
                    // 숫자형으로 변환
                    if (!that.fd) {
                        that.fd = new FastDataView;
                    }
                    //st_header.len; // 통신전문 길이정보(4) -> data부 길이(헤더길이 제외)
                    //var ui8a = new Uint8Array(chunk, st_header.len.offsetlen, st_header.len.offsetlen + st_header.len.datalen);
                    var ui8a = new Uint8Array(chunk, 0, 4);
                    that.fd.setBuffer(ui8a, 0, ui8a.byteLength);

                    var item = st_header["len"];
                    var bufferLen = that.fd.A2UBin(ui8a, item); //데이터부 길이만 들어있다.

                    that["gBuffer"]    = chunk;
                    that["gBufferLen"] = bufferLen + st_header.totlen;  //헤더길이 + 데이터부길이
                }

                if (that.gBufferLen > 0) {
                    if (that.gBufferLen <= that.gBuffer.byteLength) {
                        var recvchunk = that.gBuffer;
                        delete that.gBuffer;
                        that.gBufferLen = 0;

                        var whilecnt = 0;
                        while (1) {
                            whilecnt++;
                            // packet 단위로 처리를 한다.
                            var uint8 = new Uint8Array(recvchunk);
                            recvchunk = that.onArrayBufPacket(that, recvchunk, uint8);
                            uint8 = null;
                            if (recvchunk == null) break;
                            if (whilecnt >= 50) {
                                break;
                            }
                        }
                    }
                }
            }
            else {
                //var msgObj = JSON.parse(chunk);
                //if (msgObj.ipaddr) {
                //    hi5.SetSharedMemory("@IP_ADD", msgObj.ipaddr);
                //    commAPI.onopen();
                //}
            }
        },
        onArrayBufPacket: function (that, chunk, uint8) {
            var fixLen = st_header.len.datalen; // 통신전문 길이정보(4)
            that.fd.setBuffer(uint8, 0, fixLen);
            var item = st_header["len"];
            var packetlen = that.fd.A2UBin(uint8, item);

            var recvchunk = chunk.slice(0, packetlen + st_header.totlen);
            var remainchunk = chunk.slice(packetlen + st_header.totlen, chunk.byteLength);
            if (packetlen + st_header.totlen > recvchunk.byteLength) {
                that.gBufferLen = packetlen;
                that.gBuffer = recvchunk;
                return null;
            }

            that.fd.setBuffer(uint8, 0, st_header.svc.datalen);
            var item = st_header["svc"];
            var tr_tp = that.fd.A2UBin(uint8, item);
            //console.log(tr_tp);
            //var tr_tp = hi5.A2Uint(uint8, 12, 16);// svc
            // 로그표시
            hi5.logTrace({ type: 1, message: "socket on message", data: recvchunk, tr_tp: tr_tp });

            // POLLING 처리
            //if (tr_tp == TR_TP.POLLING) { // (H) POLLING
            //    self.send(recvchunk);
            //    if (remainchunk.byteLength > 0) return remainchunk;
            //    return null;
            //}
            var uint8Buf = uint8.subarray(0, packetlen + st_header.totlen);
            that.objAPI.onPacket({ tr_tp: tr_tp, msg: uint8Buf, socket: self });

            if (remainchunk.byteLength > 0) {
                return remainchunk;
            }

            return null;
        },

        onclose: function (e, that) {
            if (that.debug)
                console.log('WebSocket closed with code: ' + e.code + ' reason: ' + e.reason);
            //debugger;
            // 통신 단절시에 초기화 처리
            self.rqTimeOut(false);
            //self.clear();

            if (that.objAPI)
                that.objAPI.onclose(e, this, self);
        },
        onerror: function (e, that) {
            if (that.objAPI)
                that.objAPI.onerror(e, this, self);
            //alert('error');
        },
        ontimeout: function (e, that) {
            if (that.objAPI)
                that.objAPI.ontimeout(e, this, self);
        }
    }, option);

    return self;
};

(function (global, undefined) {
    "use strict";


    var _pbKeyData = function () {
        this.objCtls = [];
        this.RefCount = 0;
    };

    _pbKeyData.prototype = {
        Add: function (strKey, ctlObj) {
            var bFind = false;
            for (var i = 0 ; i < this.objCtls.length; i++) {
                if (ctlObj == this.objCtls[i]) {
                    this.RefCount++;
                    return ;
                }
            }
            // 컨트롤을 등록한다.
            this.objCtls.push(ctlObj);
            this.RefCount++;
        },

        Remove: function (ctlObj) {
            var i; ;
            for (i = 0; i < this.objCtls.length; i++) {
                if (ctlObj == this.objCtls[i]) {
                    this.RefCount--;
                    var ctrlIdx = this.objCtls.indexOf(ctlObj);
                    if (ctrlIdx > -1) {
                        this.objCtls.splice(ctrlIdx, 1);
                    }
                    return this.RefCount;
                }
            }
            return this.RefCount;
        },
        count: function () {
            return {
                length : this.objCtls.length,
                RefCount: this.RefCount
            }
        }
    };
    
    var pbMng = function () {
        this._pbKeyMap = {};
        //this._pbKeyData = new _pbKeyData;
    };

    pbMng.prototype = {
        addHash: function (isByteArray, objKeyData, objData, option) {
            var begin = 0,ar;
            if (isByteArray) {
                if (!objKeyData.hashData) {
                    objKeyData["hashData"] = [];
                }

                //objData.length   // 건수
                //objData.sizeRec  // 레코드 사이즈
                //objData.data     // 실제데이터
                if (option.hashKey.update) {
                    if ( option.json ){
                        objKeyData.hashData[0] = objData.data.slice(0);    
                    }else{
                        begin = objData.length > 1 ? objData.sizeRec * (objData.length - 1) : 0;
                        //objKeyData.hashData[0] = objData.data.subarray(begin);    // 익스플로러는 해당 지원 안함
                        objKeyData.hashData[0] = objData.data.subarray ? objData.data.subarray(begin) : objData.data.slice(begin);
                    }
                } else {
                    if (objData.length == 1) {
                        objKeyData.hashData.push(objData.data);
                        return;
                    }
                    // 배열 데이터를 분리해서 저장을 한다.
                    for (var i = 0; i < objData.length; i++) {
                        begin = i * objData.sizeRec;
                        //ar = objData.data.subarray(begin, begin + objData.sizeRec);   // 익스플로러는 해당 지원 안함
                        ar = objData.data.subarray ? objData.data.subarray(begin, begin + objData.sizeRec) : objData.data.slice(begin, begin + objData.sizeRec);
                        objKeyData.hashData.push(ar);
                    }
                }
            }
        },
        setRealData: function (option, objData) {
            var strKey = option.realType + option.key;
            var objKeyData = this._pbKeyMap[strKey];  // 배열 하나만 사용을 한다.
            if (!objKeyData) return false;

            //var isByteArray = (objData.data instanceof Uint8Array) || objData.data.buffer;
            var isByteArray = (objData.data instanceof Uint8Array) || (objData.data instanceof Array);

            if (!objKeyData.hashData) {
                this.addHash(isByteArray, objKeyData, objData, option);
                return true;
            } 
            this.addHash(isByteArray, objKeyData, objData, option);
            return false;
        },

        getRealData: function (option, fn) {
            var objKeyData, strKey;
            strKey = option.realType + option.key;

            objKeyData = this._pbKeyMap[strKey];
            if (objKeyData && objKeyData.hashData) {
                if (fn) {
                    fn.call(this, option, objKeyData);
                    objKeyData.hashData = null;
                    return;
                } 
                /*
                var isByteArray = (objKeyData.hashData instanceof Uint8Array) || objKeyData.hashData.buffer;
                if (isByteArray) {
                    option['data'] = objKeyData.hashData; objKeyData.hashData = null;
                } else {
                    option['realCount'] = objKeyData.hashData.length;
                    option['data'] = objKeyData.hashData; objKeyData.hashData = [];
                }
                */
                //option['countQueue'] = queue.length();
            }
            return null;
        },

        CommRealObject: function (options, bPoolData) {
            var strKey, objKeyData;
            if (bPoolData) {
                var keys = [], arData=[];
                if (!hi5.isArray(options.key))
                    keys.push(options.key);
                else
                    keys = options.key;
               
                for (var i = 0 ; i < keys.length; i++) {
                    strKey = options.realType + keys[i];
                    objKeyData = this._pbKeyMap[strKey];

                    if (objKeyData && objKeyData["poolData"])
                        arData.push(objKeyData.poolData);
                };
                return arData;
            };

            strKey = options.realType + options.key;
            objKeyData = this._pbKeyMap[strKey];
            if (objKeyData) {
                // 시세Pool 데이터를 설정
                //if (options.realType == "C00" || options.realType == "C01") { // 체결,호가
                if (commAPI.isGetPoolData(options.realType)) { // 시세pool 사용자동갱신 타입을 비교한다.
                    var objData = { realType: options.realType, key: options.key, data:[],realCount: 1 };

                    objData.data.push(options.data[0]);

                    if (objKeyData["poolData"] != undefined) {
                        objKeyData["poolData"] = objData;
                    } else {
                        objKeyData["poolData"] = objData;
                    }

                }
                return objKeyData.objCtls;
            }
            return bPoolData ? null: [];
        },
        // 실시간 등록 및 해제시에 종목퍼리
        codeAdd: function (code, realType) {
            if (realType == "C03") {
                code += "/" + hi5.SCI_INDEX;
            } else {
                var codes = [];
                if ( commAPI.isDepthType(realType) ) {
                    codes = code.split('/');
                    if (codes.length <= 1) {
                        console.log("-----The item code information is set incorrectly.---- " + code);
                    }
                    code = codes[0] +"/"+ codes[1];
                }
                var mrkt_code = hi5.GetCodeInfo(code, { "itemname": "market" });
                if (mrkt_code != "") {
                    code += "/" + mrkt_code;
                }

                // 호가모아보기 타입은 종목코드/시장구분/레벨 순으로 구성
                if (commAPI.isDepthType(realType)) {
                    code += "/" + codes[2];
                }
            }
            return code
        },
        CommSB: function (options) {
            var arKeyType = options.realtype,
                arCodeList = options.keylist,
                ctlObj = options.obj;

            var map = {}, key, code, bNotkey = false, exist;
            if (hi5.isString(options.realtype)) {
                arKeyType = []; arKeyType.push(options.realtype);
            }

            if (hi5.isString(options.keylist)) {
                arCodeList = []; arCodeList.push(options.keylist);
            }

            if (arCodeList.length == 0) { // Key 값이 한개도 없으면 임의 한개 만들어 준다.
                arCodeList.push(""); bNotkey = true;
            }

            for (var i = 0; i < arKeyType.length; i++) {
                key = arKeyType[i];
                var codeList = [], exist = false;
                for (var j = 0; j < arCodeList.length; j++) {
                    code = arCodeList[j];
                    if (this.AddRequest(key, code, ctlObj) == 0) {
                        exist = true;
                        if (!bNotkey) {
                            //code = this.codeAdd(code, key);
                            codeList.push(code);
                        }
                    }
                }
                if (exist)
                    map[key] = codeList;
            }
            return map;
        },

        CommSBC: function (options) {
            var arKeyType = options.realtype,
                arCodeList = options.keylist,
                ctlObj = options.obj;

            //arCodeList가 없을경우 return
            if (!arCodeList)
                return {};

            if (hi5.isString(options.realtype)) {
                arKeyType = []; arKeyType.push(options.realtype);
            }

            if (hi5.isString(options.keylist)) {
                arCodeList = [];
                arCodeList.push(options.keylist);
            }

            var map = {}, key, code, exist, bNotkey = false;
            if (arCodeList.length == 0) { // Key 값이 한개도 없으면 임의 한개 만들어 준다.
                arCodeList.push(""); bNotkey = true;
            }

            for (var i = 0; i < arKeyType.length; i++) {
                key = arKeyType[i];
                var codeList = [], exist = false;
                for (var j = 0; j < arCodeList.length; j++) {
                    code = arCodeList[j];
                    var nRefCount = this.RemoveRequest(key, code, ctlObj);
                    if (nRefCount == 0 ) {
                        if (!bNotkey) {
                            //code = this.codeAdd(code, key);
                            codeList.push(code);
                        }
                        exist = true;
                    }
                }
                if (exist)
                    map[key] = codeList;
            }
            return map;
        },

        RemoveRequest : function (key, code, ctlObj) {
            var strKey = key + code, count;
            var objKeyData = this._pbKeyMap[strKey];
            if (objKeyData) {
                if (hi5.isArray(ctlObj)) {
                    ctlObj.forEach(function (obj) {
                        objKeyData.Remove(obj);
                    })
                    count = objKeyData.count().length;
                    if (count <= 0) {
                        delete this._pbKeyMap[strKey];
                        return count;
                    }
                }
                else {
                    count = objKeyData.Remove(ctlObj);
                    if (count <= 0) {  // SBC 요청
                        //delete objKeyData;
                        delete this._pbKeyMap[strKey];
                        return count;
                    }
                }
            }
            return -1;
        },

        AddRequest: function (key, code, ctlObj) {
            var strKey = key + code, objKeyData, obj;
            if (hi5.isArray(ctlObj)) {
                var nExist = 1;
                for (var i = 0 ; i < ctlObj.length; i++) {
                    obj = ctlObj[i];
                    objKeyData = this._pbKeyMap[strKey];
                    if (objKeyData) {
                        objKeyData.Add(strKey, obj );
                    } else {  // 신규등록(SB요청)
                        objKeyData = new _pbKeyData;;
                        objKeyData.Add(strKey, obj);
                        this._pbKeyMap[strKey] = objKeyData;

                        nExist = 0;
                    }
                }
                return nExist;
            }
            else {
                objKeyData = this._pbKeyMap[strKey];
                if (objKeyData) {
                    objKeyData.Add(strKey, ctlObj);
                } else {  // 신규등록(SB요청)
                    objKeyData = new _pbKeyData;;
                    objKeyData.Add(strKey, ctlObj);

                    this._pbKeyMap[strKey] = objKeyData;
                    return 0;
                }
                return 1;
            }
        }
      
    };
    //Inner functions
    global.pbMng = pbMng;
})(this || {});



//var obj = $(window).bind("loadcustom", webSocket);

/*
bind(window, 'loadcustom', webSocket);
*/

// 이벤트 할당
function bind(elem, type, handler, capture) {
    type = typeof type === 'string' && type || '';
    handler = handler || function () {; };

    if (elem.addEventListener) {
        elem.addEventListener(type, handler, capture);
    }
    else if (elem.attachEvent) {
        elem.attachEvent('on' + type, handler);
    }
    return elem;
};
