/* item_sect - cenblock 사용 */
var ITEM_SECT = {
    SPOT: '00', // spot 상품구분
    LOCAL: '09',
    FUT: '20', // 선물 상품
    INS: '30' // 보험 상품
};


/* CURRENCY list */
var CURRENCY_LIST = ["USD", "KRW", "JPY", "CNY"];


var REAL_KEYS = {
    juche: "JUCH",
    hoga: "0013",
    sise: "0012",
    gong: "GONG"
}
var fmarket_GB;
var CODE_TYPE = 1; // btc/krw형태, 1-1BTCKRWK 형태
var g_errMsg = {};

// 시세Pool 타이머 아이디
var commAPI = {
    timerID: 0,
    setTime: 500,
};
var g_coinScreenList = []; // 체결통보 팝업 데이터 객체
var g_poolControl = []; // 시세Pool 관리객체
var g_hi5MaxQueue = 0; // 데이터 처리 최대 초과시에 데이터 버퍼링 한다.


// 호가컬럼정보JSON Hoga Col 
var _JCol = {
    price: 0, // 호가가격(문자)
    qty: 1, // 호가수량(문자)
    liq_qty: 2, // 청산가격수량(숫자)
    count: 3, // 호가건수(숫자)       -- 실시간 End 
    myqty: 4, // 내주문수량(숫자)     
    _sum: 5, //누적수량합계 (문자)  
    _rate: 6, //누적수량합계비율(숫자)
    _last_qty: 7 // 직전잔량(숫자)
};


/*"ord_prc", "ord_qty", "liq_ord_qty", "ord_num", "my_ord_qty"*/
/*"ord_qty_sum","rate"*/
// var hoga = _oBooks._orderBooks

var _oBooks = window._oBooks || {};

(function ($) {
    'use strict';
    // 생성자
    var _orderBooks = _oBooks._orderBooks = function (option) {
        this.symbol = "",
            this.trcode = "",
            this._orderBookdata = {};
        this._callBack = null; // depthChart 데이터 전송

        if (option && option.trcode) {
            this.trcode = option.trcode; // 102032 시세( 시세,지수,호가)
        }
    };
    // 호가 데이터를 공유설정
    _orderBooks.setShareData = function (option) {
        let objData = option.data,
            askPrice = objData.asks.length > 0 ? objData.asks[0][0] : "",
            bidPrice = objData.bids.length > 0 ? objData.bids[0][0] : "";
        commAPI.getShareData({
            code: objData.code,
            JSON: true,
            ask1: askPrice,
            bid1: bidPrice
        });
    };

    _orderBooks.prototype = {
        _callback_fn: function () {
            // 콜백함수 등록 및 해제기능
            if (arguments.length == 0)
                return this._callBack;
            else if (arguments.length == 1) {
                this._callBack = arguments[0];
            }
        },
        setDataClear: function (close) {
            if (close) {
                this._callBack = null;

                // 종료시에 실시간 해제 한다.
                let symbol = this.getSymbol();
                if (symbol != "") {
                    this.SBC([symbol]);
                }
            };
            this._orderBookdata = {}; // 호가가격 key
        },

        getCodeData: function () {
            return this._orderBookdata;
        },

        getLastQty: function (price) {
            if (hi5.WTS_MODE == WTS_TYPE.MTS) return 0;
            var rec = this._orderBookdata[price] || null;
            if (rec) {
                return rec.qty_diff !== undefined ? rec.qty_diff : 0;
            }
            return 0;
        },

        setHogaDataCal: function (option, max_qty) {
            var objData = option.data,
                colCount,
                ask_qty = 0,
                bid_qty = 0,
                asks = objData.asks,
                bids = objData.bids;

            colCount = asks.length > 0 ? asks[0].length : bids.length > 0 ? bids[0].length : 4;
            // 각 호가별 누적잔량
            ask_qty = getHogaSum(asks, colCount, max_qty);
            bid_qty = getHogaSum(bids, colCount, max_qty);

            if (max_qty === undefined) {
                max_qty = Math.max(bid_qty, ask_qty);
                // 각 호가별 (그래프%)
                getHogaRate(asks, max_qty, colCount);
                getHogaRate(bids, max_qty, colCount);
            }
            // 수량,합계 부분을 문자열로 변환
            //this.setDataFormat( asks ); 
            //this.setDataFormat( bids ); 
        },

        setDataQty: function (option) {
            var objData = option.data,
                symbol = objData.code,
                price, qty,
                bReal = (option.realType || option._PB) ? true : false;
            // 모바일은 경우 총합데이터 반환
            if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                return Math.max(objData.bids_sum[1], objData.asks_sum[1]);
            }

            var arData = [objData.asks, objData.bids],
                arSum = [0, 0],
                objCode = this._orderBookdata;
            for (var i = 0; i < arData.length; i++) {
                arData[i].forEach(function (rec) {
                    price = rec[_JCol.price], qty = rec[_JCol.qty]; // 호가가격, 호가수량
                    var objRec = objCode[price] || {};
                    if (bReal) {
                        // 직전수량 = 실시간 수량 - 직전수량
                        objRec['qty_diff'] = qty - (objRec.last_qty != undefined ? objRec.last_qty : qty);
                        objRec['last_qty'] = qty; // 수량(직전수량)
                    } else {
                        objRec['qty_diff'] = 0;
                        objRec['last_qty'] = qty; // 수량(직전수량)
                    }
                    arSum[i] = arSum[i] + qty;
                    objCode[price] = objRec;
                });
            }

            return Math.max(arSum[0], arSum[1]);
        },
        commRq: function (InRec, cb, dataInfo) {
            var objTranData = {
                    trcode: this.trcode != "" ? this.trcode : "66129",
                    input: {
                        InRec1: InRec
                    }
                    //hv_v_accn: "20000100773", // 계좌번호( 로그인한경우)
                    //hv_hoga_rank: "100",  // 데이터 건수
                    //hv_mod_value: "", // 빈값이면 기본 : 0.5,...
                    //hv_code: "BTC/FUT"   // 종목코드
                },
                self = this;

            // 부가정보
            if (dataInfo) {
                objTranData['dataInfo'] = dataInfo;
            }

            commAPI.commTranRQ(objTranData, function (option) {
                self.symbol = option.data.code;
                // 이전호가 가격 데이터 정보를 지운다.
                var dataInfo = option.dataInfo,
                    bReal = dataInfo && dataInfo.comType == "PB" ? true : false;
                if (!bReal) self.setDataClear(); // 호가모아보기 반복조회시는 스킵

                if (option.status == "success") {
                    option["_PB"] = bReal;
                    var max_qty = self.setDataQty(option); // 각 호가별 직전수량 변경
                    self.setHogaDataCal(option, max_qty);
                    // depathChart 용 데이터 송수신
                    let cbfn = self._callBack;
                    if (cbfn) {
                        cbfn.call(self, option);
                    }
                    // 수량,합계 부분을 문자열로 변환
                    self.setDataFormat(option.data.asks);
                    self.setDataFormat(option.data.bids);

                } else {
                    option.data['asks'] = option.data['bids'] = [];
                }
                if (cb) {
                    cb.call(this, option);
                }
            });
        },
        /* 한번만 처리 */
        OnRealShareData: function (option) {
            if (option.realType == HOGA_PB.h20) {
                var objData = option.data,
                    colCount,
                    asks = objData.asks,
                    bids = objData.bids;
                colCount = asks.length > 0 ? asks[0].length : bids.length > 0 ? bids[0].length : 4;
                if (colCount <= 4) {
                    var max_qty = this.setDataQty(option); // 각 호가별 직전수량 변경
                    // 호가수량 합계 , 그래프 잔량등을 갱신한다.
                    this.setHogaDataCal(option, max_qty);
                    // depathChart 용 데이터 송수신
                    let cbfn = this._callBack;
                    if (cbfn) {
                        cbfn.call(this, option);
                    }
                    // 수량,합계 부분을 문자열로 변환
                    this.setDataFormat(option.data.asks);
                    this.setDataFormat(option.data.bids);
                }
            }
        },

        OnRealData: function (option) {
            //console.log(option);
            // 화면 전송
            if (this.OnPB) {
                this.OnPB.call(this, option);
            }
        },

        SB: function (keylist, PBList) {
            //{realtype: ["100", "200"], keylist: ["ABCD", "XYZ"],obj: this}
            var objMgn = {
                realtype: PBList ? PBList : [HOGA_PB.h20],
                keylist: keylist,
                obj: this
            };
            commAPI.commRealRegister(true, objMgn)
        },
        SBC: function (keylist, PBList) {
            var objMgn = {
                realtype: PBList ? PBList : [HOGA_PB.h20],
                keylist: keylist,
                obj: this
            };
            commAPI.commRealRegister(false, objMgn)
        },

        getMyOrderUpdate: function (hoga, arMyOrder) {
            // 가격으로 내주문 수량 체크(4) -> price 가격으로 myOrdQty 항목취득
            if (!arMyOrder) return [];
            var upDateRow = [];
            arMyOrder.findIndex(function (item, nIdx) {
                hoga.forEach(function (rec, idx) {
                    if (item.price == rec[_JCol.price]) {
                        rec[_JCol.myqty] = item.qty; // 내주문 수량을 갱신
                        upDateRow.push(idx);
                    }
                })
            });
            return upDateRow;
        },
        getMyOrderChange: function (hoga, arMyOrder) {
            var count = 0,
                price;
            hoga.forEach(function (rec, idx) {
                rec[_JCol.myqty] = 0;
                price = rec[_JCol.price];
                if (price !== "" && arMyOrder && arMyOrder[price] !== undefined) {
                    rec[_JCol.myqty] = arMyOrder[price]; // 내주문 수량을 갱신
                    count++;
                }
            });
            return count;
        },
        getDataFormat: function (rec) {
            var _unit = hi5.getHogaUnit(this.symbol),
                myqty = rec[_JCol.myqty].toFixed(_unit.qty), // 내주문수량
                liq_qty = rec[_JCol.liq_qty].toFixed(_unit.qty); // 청산수량
            return {
                myqty: myqty,
                liq_qty: liq_qty
            }
        },

        setDataFormat: function (arData, end) {
            if (arData.length <= 0) return;
            var _unit = hi5.getHogaUnit(this.symbol),
                end = end === undefined ? arData.length : end,
                i = 0;
            // 각 호가별 문자열로 변환
            for (i = 0; i < end; i++) {
                arData[i][_JCol.qty] = arData[i][_JCol.qty].toFixed(_unit.qty); // 수량
                arData[i][_JCol._sum] = arData[i][_JCol._sum].toFixed(_unit.qty); // 호가별수량합 
            }
        },

        getDataChane: function (grid, rt, arMyOrder, kind) {
            var d_count = grid.length,
                rtCount = rt.length,
                updateInfo = [], // 갱신된 위치정보
                dif = rtCount - d_count,
                end, // 0 > 추가, <삭제, 0 = 갱신
                self = this;
            //console.log( "grid before-->", kind, JSON.parse(JSON.stringify(grid)));

            rt.forEach(function (rec, idx) {
                var difQty = 0, // 직전수량 
                    myOrdQty = rec[_JCol.myqty] !== undefined ? rec[_JCol.myqty] : 0;
                if (arMyOrder && arMyOrder[rec[_JCol.price]] !== undefined)
                    myOrdQty = arMyOrder[rec[_JCol.price]]; // 내주문 수량을 갱신

                // 호가가격으로 직전수량 정보를 취득한다.
                difQty = self.getLastQty(rec[_JCol.price]);
                //if ( grid[idx] && grid[idx][_JCol.price] !="" ){  
                //    updateInfo.push({idx:idx, mode:"U"});
                //}else{
                //    updateInfo.push({idx:idx, mode:"I"});
                //}
                end = idx;
                grid[idx] = rec.slice(0); // 실시간 데이터 복사
                grid[idx][_JCol.myqty] = myOrdQty; // 내주문 수량을 갱신
                grid[idx][_JCol._last_qty] = difQty; // 직전수량
            });

            // 수량과 합 문자열로 변환
            if (end !== undefined) {
                if (hi5.isNumber(grid[end][_JCol.qty])) {
                    this.setDataFormat(grid, end + 1);
                }
            }

            // 호가 데이터가 삭제된 경우
            if (dif < 0) {
                for (var idx = rtCount; idx < grid.length; idx++) {
                    if (grid[idx] && idx < grid.length) {
                        // 0,1,5 문자열
                        grid[idx] = ["", "", 0, 0, 0, "", 0, 0];
                        //updateInfo.push({idx:idx, mode:"D"});
                    }
                }
            }
            //            if ( updateInfo.length )
            //               console.log("업데이트-->",updateInfo  );
            //          console.log( "after-->",kind,  grid);
            //            return updateInfo;            
        },
        getSymbol: function () {
            return this.symbol;
        },

        setDataCreate: function (objData, count) {
            setDataCount(objData, count);
        },

    }

    /*"ord_prc", "ord_qty", "liq_ord_qty", "ord_num", "my_ord_qty"*/
    /*"ord_qty_sum","rate"*/
    var getHogaSum = function (ar, ColCount, maxQty) {
        var sum = 0,
            bRate = maxQty !== undefined ? true : false;
        ar.forEach(function (rec) {
            sum += rec[_JCol.qty]; // 호가잔량합
            if (ColCount <= _JCol.myqty) { // 실시간은 4개(내주문)
                rec[_JCol.myqty] = 0;
            }

            rec[_JCol._sum] = sum; // 호가잔량합
            if (bRate) {
                rec[_JCol._rate] = maxQty > 0 ? Math.floor((sum / maxQty) * 100) : 0;
            }
        });
        return sum;
    }

    // 호가별 % 값
    var getHogaRate = function (ar, maxQty, col) {
        var col = _JCol._rate;
        ar.forEach(function (rec) {
            rec[col] = maxQty > 0 ? Math.floor((rec[col - 1] / maxQty) * 100) : 0;
        });
    }

    var setCountEmpty = function (arData, count) {
        // 가격,수량,청산가격건수,건수,내주문수량,호가별 합, %, 직전수량정보
        for (var i = 0; i < count; i++) {
            arData.push(["", "", 0, 0, 0, "", 0, 0]);
        }
    }


    var setDataCount = function (option, maxCount) {
        // 매도호가 건수조정
        var dif = maxCount - option.asks.length;
        if (dif > 0) {
            setCountEmpty(option.asks, dif);
        }
        // 매수호가 건수 조정
        dif = maxCount - option.bids.length;
        if (dif > 0) {
            setCountEmpty(option.bids, dif);
        }
    }

})(jQuery);


function hi5_objBeforeReal() {

    Object.defineProperties(this, {
        control: {
            enumerable: true,
            value: setControl,
        },
        SBC: {
            enumerable: true,
            value: SBC
        },
        SB: {
            enumerable: true,
            value: SB
        },
        register: {
            enumerable: true,
            value: function (bReg, option) {
                if (bReg) {
                    this.SB(option);
                } else {
                    this.SBC(option);
                }
            }
        },
        skip: {
            enumerable: true,
            value: skip
        }
    });

    var m_control = [];

    function setControl(bReg, rd) {
        if (bReg) {
            rd.keylist.forEach(function (val) { // 컨트롤의 종목코드 갱신
                if (rd.obj.realkeys.indexOf(val) == -1) {
                    rd.obj.realkeys.push(val);
                }
            });
            rd.realtype.forEach(function (val) { // 컨트롤의 자동갱신 타입 갱신
                if (rd.obj.realitem.indexOf(val) == -1) {
                    rd.obj.realitem.push(val);
                }
            });
        } else {
            rd.obj.realkeys = [];
            rd.obj.realitem = [];
        }

        if (m_control.indexOf(rd.obj) == -1)
            m_control.push(rd.obj);
    }

    function SBC(options) {
        var self = this;
        m_control = [];
        options.forEach(function (rd, idx) {
            self.control(false, rd);
            commAPI.commRealRegister(false, rd);
        });
    }

    function SB(options) {
        var self = this;
        m_control = [];
        options.forEach(function (rd, idx) {
            self.control(true, rd);
            commAPI.commRealRegister(true, rd);
        });
    }

    function skip(objCtl) {
        return m_control.indexOf(objCtl) >= 0 ? true : false;
    }
}



function hi5_realMng() {
    Object.defineProperties(this, {
        setData: {
            enumerable: true,
            value: setData,
        },
        getdata: {
            enumerable: true,
            value: getData,
        },
        send: {
            enumerable: true,
            value: onRealSend
        },
        init: {
            enumerable: true,
            value: init
        },
        count: {
            enumerable: true,
            value: count
        },
        clear: {
            enumerable: true,
            value: clear
        },
        destroy: {
            enumerable: true,
            value: function () {
                if (m_self.control)
                    commAPI.SetRealTimer(false, m_self.control);
            }
        }
        // etc. etc.
    });


    var m_self = {
        realType: {}, // { type :{ [code] }}
        count: 0,
        update: true, // update, insert 구분값
        control: null
    };

    function init(option) {
        for (var key in option) {
            if (typeof (option[key]) != "function") {
                if (option.hasOwnProperty(key)) {
                    m_self[key] = option[key];
                }
            }
        }
        if (m_self.control)
            commAPI.SetRealTimer(true, m_self.control);
    }

    function clear() {
        m_self.realtype = {};
        //delete m_self.realtype;
        m_self.count = 0;
    }

    function getData() {
        return m_self;
    }

    function count() {
        return m_self.count;
    }

    function setData(option) {
        if (g_hi5MaxQueue <= 0) return false;

        var realType = option.realType,
            key = option.key,
            obj = m_self.realType[realType] == undefined ? {} : m_self.realType[realType];
        var keys = obj["keys"] || [];

        if (option.countQueue >= g_hi5MaxQueue) {
            var idx = -1;
            idx = keys.findIndex(function (key) {
                return key == option.key;
            });
            if (idx == -1) {
                keys.push(option.key);
                obj["keys"] = keys;
                m_self.realType[realType] = obj;
            }
            m_self.count++;
            return m_self.count > 0 ? true : false;
        }
        return m_self.count > 0 ? true : false;
    }

    function onRealSend(queueCount) {
        if (m_self.count <= 0) return;

        var ctl = m_self.control;
        if (ctl && ctl.OnRealTime) {
            if (m_self.update) {
                var realTypes = Object.keys(m_self.realType);
                realTypes.forEach(function (rt) {
                    var objCode = m_self.realType[rt];

                    // 공유매모리에서 데이터를 취득한다.
                    var arRealData = commAPI.getPoolData({
                        realType: rt,
                        key: objCode.keys
                    });
                    if (arRealData) {
                        arRealData.forEach(function (option, idx, ar) {
                            ctl.OnRealTime(option);
                        });
                    }
                });
            } else {
                ctl.OnRealTime({});
            }
        }
        this.clear();
    }
}


var g_queueCount = {
    GET: 0,
    PUT: 0,
    SECCNT: {
        cnt: 0,
        size: 0
    }
};




/* hoga_json */
var HOGA_PB = {
    h20: "h_json_20#",
};

var HTScoinSB = {
    getRTType: function (key, type) {
        return this.realtype[key] ? this.realtype[key] : null;
    },
    realtype: {
        "0013": {
            type: "00000002", // 호가(구조체)
            trcode: 50000
        },
        "0012": { // 체결
            type: "00000001",
            trcode: 50000
        },
        "JISU": {
            type: "00000008", // 지수
            trcode: 50000
        },
        "0015": {
            type: "00000001",
            trcode: 50000
        },
        "0016": {
            type: "00000002",
            trcode: 50000
        },
        "JUCH": {
            type: "00000008",
            trcode: 50002
        },
        "0010": {
            type: "00000008",
            trcode: 50000
        },
        "GONG": {
            type: "00000008",
            trcode: 50002
        }
    },
    keylen: {
        50000: {
            keylen: 16,
            typelen: 8
        },
        50002: {
            keylen: 60,
            typelen: 8
        }
    }
};

// "h_json_20#" //HOGA_PB.h20(51015)
HTScoinSB.realtype[HOGA_PB.h20] = {
    type: "00008192", // 호가(JSON)
    trcode: 50000
};

// 공유메모리 관리객체
var hi5_poolMng = {
    "0013": {
        update: true
    }, // 호가 업데이트
    setKeyNum: function (option, objData) {
        if (this[option.realType] == undefined)
            this[option.realType] = {};

        var obj = this[option.realType],
            key = option.key;
        if (obj) {
            obj["sizeRec"] = objData.sizeRec;
            option["hashKey"] = {
                update: obj.update
            };
            option["json"] = option.json;
            return option.hashKey;
        }
        return null;
    },

    getRecordSize: function (option) {
        var obj = this[option.realType];
        if (obj) {
            return obj.sizeRec;
        }
        return 0;
    },
    getKeyNum: function (option) {
        var obj = this[option.realType],
            key = option.key;
        if (obj) {
            return obj;
        }
        return NULL;
    }
}
// 동적으로 생성을 한다.
hi5_poolMng[HOGA_PB.h20] = {
    update: true,
    json: true
}

// 거래유형정보
var TR_TP = {
    REQUEST: 'Q', // 요청전문
    REPLY: 'R', // 응답전문
    PB: 'P', // 시세정보 PUSH
    INIT: 'I', // MCI INIT
    POLLING: 2, // POLLING
    SB: 'A', // 자동갱신 등록
    SBC: 'B', // 자동해제 등록
    SBCALL: 'C' // 전체 자동갱신 해제
};

// 인터페이스 구분(목적지 서버)
var INFC_SCD = {
    FID: 'F', // 투자정보 FID 서비스
    TRAN: 'T', // 투자정보 TRAN 서비스
    MASTER: 'M', // MCI-MASTER 서비스
    LBS: 'L', // LBS 서비스
    CUSTINFO: 'C', // 고객정보 서비스
    COIN: 'V', // 가상화폐주문 서비스
    WALLET: 'W', // 지갑 서비스
    LOGIN: 'J', // 로그인
    TSISE: 'B' // TSISE
};

// 프레임 분할구분
var FRAME_FLAG = {
    SINGLE: 'S', // 단일패킷
    FIRST: 'F', // 첫번째 패킷
    MIDDLE: 'C', // 연속패킷
    END: 'E' // 마지막 패킷
};

// 요청받은 거래처리 결과
var TR_PRCS_RSLT_SCD = {
    SUCCESS: "0", // 정상처리,
    SYSTEMERROR: "S", // 시스템 오류
    APPERROR: "Y", // APP 오류
    RESERVED: "D" // 예약
}

// 연속거래구분코드
var STND_TMSG_TYPE_SCD = {
    SINGLE: "0", // 연속키 없음
    RQ: {
        START: "1", // 연속거래 시작
        PRE: "2", // 연속거래 이전
        NEXT: "3" // 연속거래 다음
    },
    RP: {
        PRE: "1", // 이전자료 있음
        NEXT: "2", // 다음자료 있음
        PRENEXT: "3", // 이전,다음 자료 있음
        END: "4" // 다음 마지막 자료(다음만 있는 서비스)
    }
}

// 소켓객체
var ws, ws_s; //ws_s(주문관련 서버)


/* hi5 echo timer */
var hi5RpHeader = {};
var g_hi5ScreenList = [];
// hi5 자동갱신 정보

// 통신헤더 구조체(수신전용)
// datatype : 10 filler( 응답시에 파싱을 하지 않는다)
var st_header = {
    "outRec": [{
            "datalen": 4,
            "datatype": FT_ULONG,
            "itemname": "len",
            "offsetlen": 0,
        },
        {
            "datalen": 1,
            "datatype": FT_BYTE,
            "itemname": "crypt",
            "offsetlen": 4
        },
        {
            "datalen": 1,
            "datatype": FT_BYTE,
            "itemname": "commp",
            "offsetlen": 5
        },
        {
            "datalen": 1,
            "datatype": FT_BYTE,
            "itemname": "cont",
            "offsetlen": 6
        },
        {
            "datalen": 1,
            "datatype": FT_STRINGNUM,
            "itemname": "media",
            "offsetlen": 7
        },
        {
            "datalen": 4,
            "datatype": FT_ULONG,
            "itemname": "ucomp",
            "offsetlen": 8
        },
        {
            "datalen": 4,
            "datatype": FT_ULONG,
            "itemname": "svc",
            "offsetlen": 12
        },
        {
            "datalen": 4,
            "datatype": FT_ULONG,
            "itemname": "handle",
            "offsetlen": 16
        },
        {
            "datalen": 4,
            "datatype": FT_ULONG,
            "itemname": "addr",
            "offsetlen": 20
        },
        {
            "datalen": 60,
            "datatype": FT_STRINGNUM,
            "itemname": "userid",
            "offsetlen": 24
        },
        {
            "datalen": 4,
            "datatype": FT_ULONG,
            "itemname": "crptlen",
            "offsetlen": 84
        },
        {
            "datalen": 4,
            "datatype": FT_ULONG,
            "itemname": "seq",
            "offsetlen": 88
        },
        {
            "datalen": 4,
            "datatype": FT_ULONG,
            "itemname": "ret",
            "offsetlen": 92
        },
        {
            "datalen": 2,
            "datatype": FT_STRINGNUM,
            "itemname": "nation",
            "offsetlen": 96
        },
        {
            "datalen": 1,
            "datatype": FT_STRINGNUM,
            "itemname": "err_yn",
            "offsetlen": 98
        },
        {
            "datalen": 1,
            "datatype": FT_STRINGNUM,
            "itemname": "content_type",
            "offsetlen": 99,
            real: true
        },
        {
            "datalen": 4,
            "datatype": FT_ULONG,
            "itemname": "public_addr",
            "offsetlen": 100
        },
        {
            "datalen": 100,
            "datatype": FT_STRING,
            "itemname": "ret_msg",
            "offsetlen": 104
        },
        {
            "datalen": 4,
            "datatype": FT_FILLER,
            "itemname": "session",
            "offsetlen": 204
        },
        {
            "datalen": 1,
            "datatype": FT_BYTE,
            "itemname": "heartbit",
            "offsetlen": 208
        },
        {
            "datalen": 90,
            "datatype": FT_FILLER,
            "itemname": "filler2",
            "offsetlen": 209
        },
        {
            "datalen": 1,
            "datatype": FT_BYTE,
            "itemname": "stx",
            "offsetlen": 299
        },
    ],
    "totlen": 300,
    len: {
        "datalen": 4,
        "datatype": FT_ULONG,
        "itemname": "len",
        "offsetlen": 0
    },
    crypt: {
        "datalen": 1,
        "datatype": FT_BYTE,
        "itemname": "crypt",
        "offsetlen": 4
    },
    commp: {
        "datalen": 1,
        "datatype": FT_BYTE,
        "itemname": "commp",
        "offsetlen": 5,
        real: true
    },
    cont: {
        "datalen": 1,
        "datatype": FT_BYTE,
        "itemname": "cont",
        "offsetlen": 6
    },
    media: {
        "datalen": 1,
        "datatype": FT_STRINGNUM,
        "itemname": "media",
        "offsetlen": 7
    },
    ucomp: {
        "datalen": 4,
        "datatype": FT_ULONG,
        "itemname": "ucomp",
        "offsetlen": 8,
        real: true
    },
    svc: {
        "datalen": 4,
        "datatype": FT_ULONG,
        "itemname": "svc",
        "offsetlen": 12
    },
    handle: {
        "datalen": 4,
        "datatype": FT_ULONG,
        "itemname": "handle",
        "offsetlen": 16
    },
    addr: {
        "datalen": 4,
        "datatype": FT_ULONG,
        "itemname": "addr",
        "offsetlen": 20
    },
    userid: {
        "datalen": 60,
        "datatype": FT_STRINGNUM,
        "itemname": "userid",
        "offsetlen": 24
    },
    crptlen: {
        "datalen": 4,
        "datatype": FT_ULONG,
        "itemname": "crptlen",
        "offsetlen": 84
    },
    seq: {
        "datalen": 4,
        "datatype": FT_ULONG,
        "itemname": "seq",
        "offsetlen": 88
    },
    ret: {
        "datalen": 4,
        "datatype": FT_ULONG,
        "itemname": "ret",
        "offsetlen": 92
    },
    nation: {
        "datalen": 2,
        "datatype": FT_STRINGNUM,
        "itemname": "nation",
        "offsetlen": 96
    },
    err_yn: {
        "datalen": 1,
        "datatype": FT_STRINGNUM,
        "itemname": "err_yn",
        "offsetlen": 98
    },
    content_type: {
        "datalen": 1,
        "datatype": FT_STRINGNUM,
        "itemname": "content_type",
        "offsetlen": 99,
        real: true
    },
    public_addr: {
        "datalen": 4,
        "datatype": FT_ULONG,
        "itemname": "public_addr",
        "offsetlen": 100
    },
    ret_msg: {
        "datalen": 100,
        "datatype": FT_STRING,
        "itemname": "ret_msg",
        "offsetlen": 104
    },
    session: {
        "datalen": 4,
        "datatype": FT_FILLER,
        "itemname": "session",
        "offsetlen": 204
    },
    heartbit: {
        "datalen": 1,
        "datatype": FT_BYTE,
        "itemname": "heartbit",
        "offsetlen": 208
    },
    filler2: {
        "datalen": 90,
        "datatype": FT_FILLER,
        "itemname": "filler2",
        "offsetlen": 209
    },
    stx: {
        "datalen": 1,
        "datatype": FT_BYTE,
        "itemname": "stx",
        "offsetlen": 299
    }
}



/* 호가 단위, 수량 단위 */
var g_masterInfo = {};
var g_upjongInfo = {};
/* 계좌 리스트 */
var g_acclist = [];

// 접속 후 체결내역
var hi5_conclsnList = [];

// 호가모아보기 타입유무
commAPI.isDepthType = function (realType) {
    return realType == "CQ1" ? true : false;
}

// 시세풀을 사용시에 자동갱신유형을 검색하는 함수
commAPI.isGetPoolData = function (arRealItem) {
    var poolTypes = {
        "0012": true,
        "0013": true
    }; // 시세,호가

    var bArray = hi5.isArray(arRealItem) ? true : false;
    if (bArray) {
        for (var i = 0; i < poolTypes.length; i++) {
            if (poolTypes[arRealItem[i]])
                return true;
        }
    } else {
        return poolTypes[arRealItem] == undefined ? false : true;

    }
    return false;
}
// string ip를 long형으로 변환하는 함수
commAPI.ip2long = function (ip) {
    var ipl = 0;
    ip.split('.').forEach(function (octet) {
        ipl <<= 8;
        ipl += parseInt(octet);
    });
    return (ipl >>> 0);
}
// 거래소 통신헤더 정의
commAPI.getHeaderStruct = function (comHeader, options, socket) {
    // 통신헤더 전문
    var dataLen = 0, // 자기자신의 길이는 제외

        // --> [Edit] 수정자:kim changa 일시:2019/10/17
        // 수정내용> ._trcode 할당시에 서비스 코드만 변경해서 호출
        rqid = 0,
        value, trcode = (comHeader._trcode === undefined) ? comHeader.trcode : comHeader._trcode; // ._trcode 서버로 전송할 트랜
    // <-- [Edit] kim changa 2019/10/17

    function str2ab(str, len) {
        var buf = new ArrayBuffer(len); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    // 2019.02.21 kws -> 로그인이 안된 상태에서는 userid 필드에 ip를 넣어준다.
    var userid = hi5.GetSharedMemory("@USER_ID");
    if (!hi5.isLogin() || userid == "") {
        if (hi5admin != 'admin' && comHeader.trcode != "20003")
            userid = "guest_" + hi5.GetSharedMemory("@IP_ADD");
    } else {
        userid = userid.trim();
    }

    if (comHeader.trcode == "20003") {
        if (hi5.GetSharedMemory("@IP_ADD") == "") {
            hi5.SetSharedMemory("@IP_ADD", window["@cenbpublicip"]);
        }
        comHeader.public_addr = commAPI.ip2long(hi5.GetSharedMemory("@IP_ADD"));
    }
    //console.log(comHeader.trcode, userid);
    comHeader.userid = str2ab(userid, st_header.userid.datalen); // 사용자ID
    comHeader.media = hi5admin ? 'a' : 'W';
    // 하트비트 사용유무
    if (hi5.WTS_MODE == WTS_TYPE.MTS) comHeader.media = 'm'; // 2019.09.26 kws -> 모바일웹은 소문자 'm'
    comHeader.svc = parseInt(trcode);

    // 개발장비에서 서버에서 하드비트 사용안함으로 설정
    if (hi5_dev_mode == "dev" && (trcode == 20003 || trcode == 20000))
        comHeader.heartbit = 1;


    comHeader.crptlen = 0;
    // 데이터 정보
    if (options) {
        if (options.TLG_LNG) dataLen = Number(options.TLG_LNG); // 순수 데이터 전문
        if (options.rqid) rqid = options.rqid;
    }

    //var lang = local_lang.toUpperCase();
    //switch (lang) {
    //    case "KO":
    //        lang = "KR";   // 언어구분 변경요청(KO->KR)
    //        break;
    //    default:
    //        lang = "EN";
    //        break;
    //}
    //debugger;
    var headerStruct = new Struct({
        len: ['uint32', 0], // 전문길이(데이터부 길이만)
        crypt: ['uint8', 0x02, st_header.crypt.datalen], // 암호화 플래그
        commp: ['uint8', 0x01, st_header.commp.datalen], //압축 여부
        cont: ['uint8', 0x00, st_header.cont.datalen],
        media: ['uint8', '', st_header.media.datalen],
        ucomp: ['uint32', 0],
        svc: ['uint32', 0],
        handle: ['uint32', 0],
        addr: ['uint32', 0],
        userid: ['uint8', 0x00, st_header.userid.datalen],
        crptlen: ['uint32', 0],
        seq: ['uint32', 0],
        ret: ['uint32', 0],
        nation: ['uint8', 0x00, st_header.nation.datalen],
        err_yn: ['uint8', 0x00, st_header.err_yn.datalen],
        content_type: ['uint8', 0x00, st_header.content_type.datalen],
        public_addr: ['uint32', 0],
        ret_msg: ['uint8', 0x00, st_header.ret_msg.datalen],
        session: ['uint8', 0x00, st_header.session.datalen],
        heartbit: ['uint8', 0x0],
        filler2: ['uint8', 0x00, st_header.filler2.datalen],
        stx: ['uint8', 0x02, st_header.stx.datalen]
    }, ' ', false);


    if (!hi5.isEmpty(comHeader)) {
        if (dataLen > 0) {
            comHeader.len = dataLen;
            comHeader.ucomp = dataLen;
            //if (options.dataModel) comHeader.crptlen = hi5.checksum(options.dataModel); // checksum
            //else comHeader.crptlen = dataLen;
        }
        comHeader.handle = rqid; //ulong 화면핸들(rqid)
        comHeader.seq = rqid; //ulong

        var nation = 'KR';
        switch (local_lang) {
            case 'en':
                nation = 'US';
                break;
            case 'kr':
                nation = 'KR';
                break;
            case 'ko':
                nation = 'KR';
                break;
            case 'jp':
                nation = 'JP';
                break;
            case 'zh':
                nation = 'CN';
                break;
            case 'cn':
                nation = 'CN';
                break;
        }
        comHeader.nation = nation;

        //if (comHeader.svc == "102028") {
        //    comHeader.commp = 1;
        //}
        var dataView = null;
        // 헤더값 변경
        if (dataLen) {
            var array = options.dataModel;
            if (hi5.isArrayBuffer(array)) {
                dataView = array;
            } else {
                var length = array.length;
                if (length > 0) {
                    var buffer = new ArrayBuffer(length);
                    dataView = new Int8Array(buffer);
                    for (var i = 0; i < length; i++) {
                        dataView[i] = array[i];
                    }
                }
            }
            comHeader.crptlen = hi5.checksum(dataView); // checksum
            if (comHeader.crptlen < 0) { // 2019.08.06 kws -> checksum이 마이너스일때는 crypt를 0x03 값으로 변경해서 보낸다.
                comHeader.crypt = 3;
            }
        }
        var dv = headerStruct.write(comHeader);
        if (dataView) {
            dv = hi5.appendBuffers(dv, dataView, true);
        }
        // 로그표시
        //hi5.logTrace({ type: 1, message: "socket send", data: dv });
        /*        
                // 전문표시기능
                curBuffer = dv;
                startAt   = 0;
                var str = getHexChunk(curBuffer, startAt);
                console.log(str);
        */
        return dv;
    }
    return headerStruct;
}

// 응답헤더만 파싱하는 부분
commAPI.parseComm = function (bReal, databuff) {
    var datajson = {},
        st_type = st_header;

    var dataLen = databuff.byteLength || databuff.length;
    if (st_type.totlen <= dataLen) {
        var itemcnt = st_type.outRec.length;
        var item, value;
        var fdv = new FastDataView(databuff, 0);

        for (var i = 0; i < itemcnt; i++) {
            item = st_type.outRec[i];
            if (item.datatype != undefined && item.datatype == FT_FILLER) continue;
            if (bReal && !item.real) continue;

            value = fdv.A2UBin(databuff, item);
            datajson[item.itemname] = value;
        }
    }

    return datajson;
}

commAPI.parseTRAN = function (arBuf, tran_group, commHeader) {
    //debugger;
    var outdata = {};
    if (!arBuf) return outdata;
    // JOSN 형식인 경우 
    if (commHeader && commHeader.content_type == "J") {
        var arLen = arBuf.byteLength || arBuf.length,
            str;
        if (arLen > 0) {
            str = String.fromCharCode.apply(null, arBuf);
            try {
                outdata = JSON.parse(str);
            } catch (e) {
                console.log(e);
            }
        }
        return outdata;
    }

    var outRecords = tran_group.outRecords ? tran_group.outRecords : []
    if (outRecords.length <= 0) {
        var IOs = Object.keys(tran_group);
        for (var x = 0; x < IOs.length; x++) {
            var recName = IOs[x];
            var recInfo = tran_group[recName];
            if (recInfo && hi5.isObject(recInfo)) {
                if (recInfo.inout == 1) { // output record
                    outRecords.push(recName);
                }
            }
        }
    }

    for (var x = 0; x < outRecords.length; x++) {
        var recName = outRecords[x];
        var recInfo = tran_group[recName];
        if (recInfo && hi5.isObject(recInfo)) {
            if (recInfo.inout == 1) { // output record
                var arLen = arBuf.byteLength || arBuf.length;
                if (arBuf && arLen > 0) {
                    var reccount = 1,
                        begin = 0,
                        end = 0,
                        arraycntbuff, countref;
                    if (recInfo.array == 0) { //single output
                        begin = 0;
                        end = recInfo.tlen;
                    } else { //array output
                        if (recInfo.array == 1) {
                            if (arLen >= 4) {
                                //arraycntbuff = arBuf.slice(0, 4);
                                arraycntbuff = arBuf.subarray(0, 4);
                                var fdv = new FastDataView(arraycntbuff, 0, 4);
                                reccount = fdv.A2UBin(arraycntbuff, {
                                    datalen: 4,
                                    offsetlen: 0,
                                    datatype: FT_STRINGNUM,
                                    itemname: "arraycnt"
                                });
                                reccount = parseInt(reccount);
                                //reccount = Number(hi5.A2U(arraycntbuff));
                                //arBuf = arBuf.slice(4);
                                arBuf = arBuf.subarray(4);
                                end = reccount * recInfo.tlen;
                            } else {
                                // error
                                return outdata;
                            }
                        } else if (recInfo.array == 3) {
                            countref = recInfo.countref.split(".");
                            reccount = Number(outdata[countref[0]][countref[1]].Ntrim());
                            end = reccount * recInfo.tlen;
                        } else if (recInfo.array == 6) { // 가변길이 (전체사이즈/레코드 단위= 개수)
                            arLen = arBuf.byteLength || arBuf.length;
                            if (recInfo.tlen > 0) {
                                reccount = arLen / recInfo.tlen;
                                end = reccount * recInfo.tlen;
                            } else {
                                if (recInfo.itemlist.length == 1) {
                                    end = arLen;

                                    outdata[recName] = commAPI.arraystruct2json(1, recInfo, arBuf.subarray(begin, end), true);
                                    //outdata[recName] = commAPI.arraystruct2json(1, recInfo, arBuf.slice(begin, end), true);
                                    return outdata;
                                }
                            }
                        } else {
                            continue;
                        }
                        //outdata[recName] = commAPI.arraystruct2json(parseInt(arraycnt), recInfo, arraybuff);
                    }

                    outdata[recName] = commAPI.arraystruct2json(reccount, recInfo, arBuf.subarray(begin, end));
                    //outdata[recName] = commAPI.arraystruct2json(reccount, recInfo, arBuf.slice(begin, end));
                    if (end > 0) arBuf = arBuf.subarray(end);
                    //if (end > 0) arBuf = arBuf.slice(end);
                } else {
                    outdata[recName] = recInfo.array == 0 ? {} : [];
                }
            }
        }
    }
    return outdata;
}


commAPI.arraystruct2json = function (arraycnt, recInfo, arBuf, bSingle) {
    var itemlist = recInfo.itemlist,
        itemname, offset, datalen, itembuff, itemVal;

    var recordarray = [];
    for (var i = 0; i < arraycnt; i++) {
        var recordbuff;
        if (bSingle) {
            recordbuff = arBuf;
        } else {
            //recordbuff = arBuf.slice(i * recInfo.tlen, (i + 1) * recInfo.tlen);
            recordbuff = arBuf.subarray(i * recInfo.tlen, (i + 1) * recInfo.tlen);
            if (recordbuff.byteLength != recInfo.tlen) break;
        }

        // 통신전문 및 데이터 영역에 Binary 데이터를 사용하는 경우가 없으니 DataView() 객체를 사용하지 않는다.
        //var outdata = {}, item, dw = new DataView(recordbuff);
        var outdata = {},
            item, fdv;
        fdv = new FastDataView(recordbuff, 0, recordbuff.byteLength);

        for (var x = 0; x < recInfo.itemlist.length; x++) {
            item = recInfo.itemlist[x];

            if (item.datatype != undefined && item.datatype == FT_FILLER) continue;

            itemname = item.itemname;
            if (bSingle) {
                item.datalen = recordbuff.byteLength;
            }
            outdata[itemname] = fdv.A2UBin(recordbuff, item).Ntrim();
            //outdata[itemname] = hi5.A2UBin(recordbuff, dw, item);

            if (bSingle) {
                item.datalen = 0;
                return outdata;
            }
        }
        recordarray.push(outdata);
    }
    return recInfo.array == 0 ? recordarray[0] : recordarray;

}

commAPI.SetCheJanRegister = function (bReg, objCtl) {
    var i, len = g_coinScreenList.length;
    if (bReg) {
        for (i = 0; i < len; i++) {
            if (g_coinScreenList[i] == objCtl) return;
        }
        g_coinScreenList.push(objCtl);
    } else {
        for (i = 0; i < len; i++) {
            if (g_coinScreenList[i] == objCtl) {
                g_coinScreenList.splice(i, 1);
                return;
            }
        }
    }
}

// 체결데이터 누적



commAPI.onCheJanRealData = function (option) {
    //console.log("체결통보", option.data);
    // 로그표시
    hi5.logTrace({
        type: 10,
        message: "--실시간 체결통보--",
        data: option.data
    });

    // --> [Edit] 수정자:김창하 일시:2020/03/05
    // 수정내용>탭 주문정보 건수표시기능
    if (hi5_OrdMng && hi5_OrdMng.OnOrderRealData)
        hi5_OrdMng.OnOrderRealData(option);
    // <-- [Edit] 김창하 2020/03/05 

    // 체결데이터 누적( 디버그)
    if (hi5_DebugLevel && hi5_DebugLevel.realChe) {
        if (window.g_cheData === undefined) {
            window.g_cheData = [];
        }
        var s = JSON.stringify(option);
        g_cheData.push(JSON.parse(s));
    }

    var i, len = g_coinScreenList.length,
        objCtl;
    for (i = 0; i < len; i++) {
        objCtl = g_coinScreenList[i];
        if (objCtl && objCtl.OnRealData) objCtl.OnRealData(option);
    }

    // 콘솔창에서 직접데이터 전송
    //g_coinScreenList[0].OnRealData(g_cheData)

    //mdi,sdi,mts 모두 sendTicker 함수로 처리, _extend.js 파일에 sendTicker함수가 있어야함. - 2018.09.21 kiwon34
    this.onRealCB(option, function (pbData) {
        sendTicker("JUCH", {
            data: pbData
        });
    });
}

// hi5 자동갱신 등록 및 해제
commAPI.commAllSBC = function (bRegister) {
    // 목적지 구분에 따라서 소켓객체를 취득한다.
    var socket = commAPI.getSocket();
    if (!socket) return;

    // 통신헤더정보
    var commHeaderInfo = {
        TR_TP: TR_TP.SBCALL, // 거래유형
    };

    // 서버로 데이터를 전송한다.
    if (!bRegister) {
        commAPI.onServerSend(socket, commHeaderInfo);
    }

}

// svrTarget : "1" :기본값(미지정), "2": "secure"
commAPI.commRealRegister = function (bRegister, objMgn, svrTarget) {
    // 목적지 구분에 따라서 소켓객체를 취득한다.
    var socket = commAPI.getSocket({
        realType: svrTarget
    });
    if (!socket) return;
    if (!socket.connect()) return; // 소켓연결이 안된경우 무시

    var mapData; //key(자동갱신타입) - 종목코드 배열
    // 자동갱신 등록
    if (bRegister) {
        // var sbData = ws.commReal(1, { realtype: ["100", "200"], keylist: ["ABCD", "XYZ"], obj: this });
        mapData = socket.commReal(1, objMgn);
    } else {
        // 자동갱신 등록
        // var sbcData = ws.commReal(0, { realtype: ["100", "200"], keylist: ["ABCD", "XYZ"], obj: this });
        mapData = socket.commReal(0, objMgn);
    }

    if (hi5.isEmpty(mapData)) {
        return;
    }
    //console.log('commRealRegister', mapData, objMgn);
    // st_sbHeader
    //objMgn.realtype;
    //var objMng = HTScoinSB.realtype[objMgn.realtype];

    var objMng = HTScoinSB.getRTType(objMgn.realtype);

    if (objMng == undefined) return;

    var keylen = HTScoinSB.keylen[objMng.trcode].keylen;
    var typelen = HTScoinSB.keylen[objMng.trcode].typelen;

    var realTypes = Object.keys(mapData);
    var realKeyCount = mapData[realTypes].length;
    var pbid_cnt = hi5.LPAD(realKeyCount.toString(), 3, "0") //(4) 실시간 PBID 갯수 (이 갯수에 따라 아래의 필드가 반복된다.)
    var strData = bRegister ? "Y" : "N";
    strData += pbid_cnt;

    var totlen = strData.length + (realKeyCount * (keylen + typelen));
    var offset = 0;
    var dv = new FastDataView(new ArrayBuffer(totlen));

    var a2b = function (dv, offset, str, maxLen) {
        var values = hi5.strToCharCodeArr(str),
            len, i;
        len = values.length;

        for (i = 0; i < len; i++) {
            dv.setUint8(offset, values[i]);
            offset++;
        }
        for (; i < maxLen; i++)
            offset++;

        return offset;
    }

    offset = a2b(dv, offset, strData, strData.length);
    //for (var i = 0 ; i < count; i++) {
    //    var code = arkeyList[i];   // keylen
    //    offset = a2b(dv, offset, code, keylen);
    //    offset = a2b(dv, offset, objMng.type, typelen);
    //}

    for (var pid in mapData) {
        var arCodeList = mapData[pid];
        // 키 개수는 반드시 존재해야 된다.
        var count = arCodeList.length,
            codeLen = 0;
        if (count <= 0) {
            //console.log("realregister ====> keycount 0====>" + bRegister);
            return;
        }

        var keyData = "",
            code, keyLen = 0;
        for (var i = 0; i < count; i++) {
            code = arCodeList[i];
            offset = a2b(dv, offset, code, keylen);
            offset = a2b(dv, offset, objMng.type, typelen);

            //strData += keyData + hi5.RPAD(code, keylen, " ");
            //strData += objMng.type;
        }
    }

    var inputbuff = dv.buffer;
    if (hi5.isArrayBuffer(dv.buffer)) {
        var uint8 = new Uint8Array(dv.buffer);
        inputbuff = [].slice.call(uint8);
    }

    var uint8 = hi5.U2A(inputbuff);
    // 통신헤더정보
    var commHeaderInfo = {
        trcode: objMng.trcode, // 거래유형
    };

    // 데이터 정보(원본데이터, 데이터길이, 조회ID등) 가공이 필요한 항목들
    //var dataOption = {
    //    dataModel: uint8.buffer,     // 데이터 전문
    //    TLG_LNG: uint8.byteLength    // 데이터 길이
    //}
    var dataOption = {
        dataModel: inputbuff, // 데이터 전문
        TLG_LNG: inputbuff.length // 데이터 길이
    }
    //console.log('2commRealRegister', commHeaderInfo, dataOption);
    // 서버로 데이터를 전송한다.
    commAPI.onServerSend(socket, commHeaderInfo, dataOption);
}

// 조회요청시에 관리객체를 구성한다.
commAPI.GetRQIDInfo = function (formobj, commOptionInfo) {
    var option = commOptionInfo.option;

    // 수신응답시간 설정
    var rqMng = {
        formobj: null,
        timeout: 0,
        option: {}
    };
    if (commOptionInfo.timeout != undefined)
        rqMng.timeout = commOptionInfo.timeout;

    rqMng.formobj = formobj;
    rqMng.option = option;
    rqMng.option["realkeys"] = {
        'IN': commOptionInfo.realkeys_IN,
        'OUT': commOptionInfo.realkeys_OUT
    };
    return rqMng
}

// 화면에서 서버로 데이터를 전송하는 함수
commAPI.commSendRqInfo = function (formobj, commOptionInfo, objInterfaceHeader) {
    // 목적지 구분에 따라서 소켓객체를 취득한다.
    var socket = commAPI.getSocket({
        destsvr: commOptionInfo.destsvr
    });
    if (!socket) return 0;

    // 소켓이 연결된 상태인가를 체크한다.
    if (!socket.connect()) {
        //alert("Socket Closed....");
        return 0;
    }

    var rqid = 0,
        nextInfo = commOptionInfo.option.prevnext;
    var dataCount = commOptionInfo.dataCount ? commOptionInfo.dataCount : 0; // 데이터 요청건수
    // FID 조회는목적지를 'F'로 변경한다.
    if (commOptionInfo && commOptionInfo.datatype == COOM_DATATYPE_FID) {
        commOptionInfo.destsvr = INFC_SCD.FID;
        //switch (nextInfo) {
        //    case 1: nextInfo = 2; break;  // 이전연속거래
        //    case 2: nextInfo = 3; break;  // 다음연속거래
        //    default: break;
        //}
    }

    // 통신헤더정보
    var commHeaderInfo = {
        MXM_PGE_CNT: hi5.LPAD(dataCount.toString(), st_header.MXM_PGE_CNT, "0"), // 데이터 요청건수
        STND_TMSG_TYPE_SCD: '0', // 연속거래구분코드(정의)
        INFC_SCD: commOptionInfo.destsvr // 목적지 구분
    };

    if (commOptionInfo.screenid != "") { // 맵이름
        commHeaderInfo["screenid"] = hi5.RPAD(commOptionInfo.screenid, st_header.screenid);
    }

    if (commOptionInfo.trcode && commOptionInfo.trcode != "") { // 트랜코드
        commHeaderInfo["trcode"] = commOptionInfo.trcode;
    }

    // 주문서비스인경우 통신헤더 정보에 계좌정보 부가정보를 설정한다( 관리자 화면).
    if (objInterfaceHeader != undefined && objInterfaceHeader.header != undefined) {
        if (!hi5.isEmpty(objInterfaceHeader.header)) {
            //dataOption['comm_Header'] = objInterfaceHeader.header;
            if (objInterfaceHeader.header["_trcode"]) {
                var _trcode = objInterfaceHeader.header["_trcode"].toString();
                commHeaderInfo["_trcode"] = _trcode; // 서비스 변경코드 정보
                commOptionInfo.option["_trcode"] = _trcode;
            }
        }
    }

    // 조회ID용 관리 정보를 설정한다.
    rqid = commAPI.getRQID(); // 조회ID 값을 채번한다.
    var rqidMng = commAPI.GetRQIDInfo(formobj, commOptionInfo);

    // 데이터 정보(원본데이터, 데이터길이, 조회ID등) 가공이 필요한 항목들
    var dataOption = {
        dataModel: commOptionInfo.sendbuffer, // 데이터 전문
        TLG_LNG: commOptionInfo.sendbuffer.length, // 레코드 길이
        rqid: rqid, // 조회ID
        rqidMng: rqidMng // 조회ID정보 객체
    }

    // 주문서비스인경우 통신헤더 정보에 계좌정보 부가정보를 설정한다.
    if (objInterfaceHeader != undefined && objInterfaceHeader.header != undefined)
        dataOption['comm_Header'] = objInterfaceHeader.header;

    // 서버로 데이터를 전송한다.
    commAPI.onServerSend(socket, commHeaderInfo, dataOption);

    // WaitCursor 시작
    if (formobj.changeWaitCursor)
        formobj.changeWaitCursor(true, commOptionInfo.option.rqname);

    // 조회ID값을 반환한다.
    commOptionInfo.rqid = rqid;
    return rqid;
}

// 입력용 레코드 전체 길이 및 길이정보 취득
commAPI.GetTotalTranDataLen = function (trInfo, objCommInput) {
    var len = 0,
        count = 0,
        item;
    var objRet = {};

    // 레코드 단위 처리
    for (var recName in trInfo) {
        var objRec = trInfo[recName];
        if (objRec.inout != 0) continue; // 입력용이 아닌경우 무시한다.

        var arItemList = objRec.itemlist || [];
        var objInputRec = objCommInput[recName];

        count = 0;
        var itemcount = arItemList.length;
        if (objRec.array == 0) { // 단일 레코드
            len += objRec.tlen;
        } else { // 배열 레코드(1:문자기본(4), 2:숫자기본, 3:Item지정, 4:배열고정, 5:데이터 사이즈로 계산(단일,배열인 구조만 적용), 6 : 가변레코드 )
            switch (objRec.array) {
                case 1:
                    count = objInputRec.length;
                    len += (objRec.tlen * count);
                    break;
                case 2:
                    count = objInputRec.length;
                    len += (objRec.tlen * count);
                    break;
                case 3:
                    item = trInfo[objRec.refrecname].itemlist[objRec.itempos];
                    var itemName = item.itemname;

                    var val = objCommInput[objRec.refrecname][itemName];
                    count = parseInt(val, 0);
                    len += (objRec.tlen * count);
                    break;
                case 4:
                    break;
                case 5:
                    break;
            }
        }
        objRet[recName] = {
            "count": count
        };
    }

    objRet["totallen"] = len;
    return objRet;
}

// 트랜용 입력 전문을 작성하는 함수(트랜정보,데이터개체, 입력전문길이)
commAPI.json2structApi = function (trInfo, objCommInput, objCount) {
    //debugger;
    var count, x, itemname, datalen, value, i;

    //var arraybuff = new Array(nTotal);
    //var nTotalLen = objCount["totallen"];  // 전체길이

    var arraybuff = new Array(0);
    // 레코드 단위 처리
    for (var recName in trInfo) {
        var objRec = trInfo[recName],
            item, arData;
        if (!hi5.isObject(objRec) || objRec.inout != 0) continue; // 입력용만 처리
        var objInputRec = objCommInput[recName];
        var arItemList = objRec.itemlist || [];
        var itemcount = arItemList.length;
        if (objRec.array == 0) { // 단일 레코드
            for (x = 0; x < itemcount; x++) {
                item = arItemList[x];
                value = objInputRec[item.itemname] == undefined ? "" : objInputRec[item.itemname];
                arData = hi5.U2ABin(value, item);
                arraybuff = arraybuff.concat(arData);
            }
        } else { // 배열 레코드 (1:문자기본(4), 2:숫자기본(long), 3:Item지정, 4:배열고정, 5:데이터 사이즈로 계산(단일,배열인 구조만 적용), 6 : 가변레코드 )
            count = 0;
            if (objCount)
                count = objCount[recName] ? objCount[recName]["count"] : 0;

            switch (objRec.array) {
                case 1: // 문자기본(4)
                    console.assert(count == objInputRec.length, "record count error!!");
                    value = hi5.sprintf("%04d", count);
                    arData = hi5.strToCharCodeArr(value);
                    arraybuff = arraybuff.concat(arData);
                    break;
                case 2: // 숫자기본(long)
                    console.assert(count == objInputRec.length, "record count error!!");

                    var stCount = new Struct({
                        count: ['uint32', count]
                    }, 0, true); // true is Little-endian, false is Big-endian

                    var ar = stCount.write();
                    var obj = stCount.read(ar)

                    var arraybuffer = [].slice.call(ar);
                    var newbuff = hi5.RPADbuff(arraybuffer, datalen);
                    arraybuff = arraybuff.concat(newbuff);
                    break;
                case 6: //가변
                    if (itemcount == 1) {
                        item = arItemList[0];
                        if (item.datalen == 0) {
                            value = objInputRec[item.itemname] == undefined ? "" : objInputRec[item.itemname];
                            if (typeof (value) == "string") {
                                var uint8 = hi5.U2A(value);
                                arData = [].slice.call(uint8);
                            } else {
                                arData = [].slice.call(value);
                            }
                            arraybuff = arraybuff.concat(arData);
                            continue;
                        }
                    }
                    case 3: //3:Item지정
                        break;
                    case 4:
                        break;
                    default:
                        break;
            }

            for (i = 0; i < count; i++) {
                var objOutPut = objInputRec[i];
                for (x = 0; x < itemcount; x++) {
                    item = arItemList[x];
                    value = objOutPut[item.itemname] == undefined ? "" : objOutPut[item.itemname];
                    arData = hi5.U2ABin(value, item);
                    arraybuff = arraybuff.concat(arData);
                }
            }
        }
    }
    return arraybuff;
}

// 전문요청 시간
commAPI.getRQDate = function () {
    var d = new Date(),
        val;
    // 17(YYYYMMDDHHmmssuuu)
    val = hi5.sprintf("%04d%02d%02d%02d%02d%02d%03d", d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    return val;
}

// GUID 취득(32Byte)
commAPI.getGUID = function (option) {
    var d = new Date(),
        val;
    // 20(YYYYMMDDHHmmssuuu000)
    val = hi5.sprintf("%04d%02d%02d%02d%02d%02d%03d", d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) + "000";
    // MCI 핸들(10)
    if (option.socket) {
        val += option.socket.commheader("mcihandle");
    } else {
        val += hi5.RPAD("", st_header.MCI_HLD);
    }
    // 예비(2)
    val += "00";
    return val;
}

// 조회ID값 취득
commAPI.getRQID = function () {
    var rqid = sessionStorage.getItem("hi5-rqid");
    if (rqid == undefined || rqid === "") {
        rqid = "0";
    }

    rqid = Number(rqid) + 1;
    if (rqid >= 99999999) {
        rqid = 1;
    }
    sessionStorage.setItem("hi5-rqid", rqid.toString());
    return rqid;
}

// 조회요청, 실시간등록및 해제시에 서버소켓 객체를 반환하는 함수
commAPI.getSocket = function (option) {
    /*
        // 복수 소켓을사용하는 경우에 아래 목적서버로 분리
        if (option.destsvr != undefined) {
            switch (option.destsvr) {
                case INFC_SCD.FID:       //'F' 투자정보 FID 서비스
                case INFC_SCD.TRAN:      //'T' 투자정보 TRAN 서비스
                case INFC_SCD.MASTER:    //'M' MCI-MASTER 서비스
                case INFC_SCD.LBS:       //'L  LBS 서비스
                case INFC_SCD.CUSTINFO:  //'C' 고객정보 서비스
                    break;
                    //            case INFC_SCD.COIN:   //'V' 가상화폐주문 서비스
                    //            case INFC_SCD.WALLET: //'W' 지갑 서비스
                    //                return ws_s;
                    //                break;
                default:
                    break;
            };
        } else if (option.realType != undefined) {
            if (option.realType == "2")
                return ws_s;
        }
    */
    return ws;
}

// 서버로 전문구성후 전송
commAPI.onServerSend = function (socket, commInfo, options) {
    if (socket && socket.connect()) {
        // 서버로 전송하기 전에 조회ID 관리에 정보를 설정한다(수신응답후 조회ID로 삭제).
        if (options && options.rqid && options.rqidMng) {
            socket.rqidRegister(options.rqid, options.rqidMng);
        }

        // 통신헤더를 구성한다.
        var rqCommData = this.getHeaderStruct(commInfo, options, socket);
        // 서버로 전송한다.
        socket.send(rqCommData);
    }
    /*    else {
            if (typeof window.CENBapplyFunction == "function") {  //소켓 끊겼을때 홈페이지쪽으로 알려줘서 5분후에 쿠키 삭제하는 기능. 2019.03.22 kws
                window.CENBapplyFunction('socketTerminated');
                window.frontRouterChange('Home');
            }

            hi5.MessageBox($hi5_regional.text.disconnect, $hi5_regional.title.notice, 3, function () {
                location.reload();
            });
        }*/
}

// 조회 수신초과 메세지 처리
commAPI.ontimeout = function (e, socket, objws) {
    var rqid = e.rqid,
        rpMng = e.rpMng;
    //console.log("commAPI.ontimeout....id=[" + rqid + "]");
    //console.log(rpMng);
    //var msg = {
    //    ko: "수신응답시간 초과 되었습니다.",
    //    en: "Receive response timeout.",
    //    jp: "受信応答タイムアウトしました。",
    //};

    var formobj = rpMng.formobj;
    if (!formobj) {
        var option = e;
        option['msgHeader'] = {
            "MSG_COD": rpMng.rqname,
            "MSG_CTNS": $hi5_regional.tr.timeout
        };
        // 화면에서 호출한것은 화면으로 전송(rpMng.rqType 키가없음)
        if (rpMng && rpMng.OnRpTimeOut) {
            rpMng.OnRpTimeOut(option);
            return;
        }
    }

    var option = rpMng.option;
    option['msgHeader'] = {
        "MSG_COD": "TimeOut",
        "MSG_CTNS": "[Trcode:" + option.trcode + "]" + $hi5_regional.tr.timeout
    };
    option['dataExist'] = 0;
    option['nextKeyBuf'] = "";
    option['nextKeyLen'] = 0;
    option['success'] = false;
    if (formobj) {
        if (formobj.OnGetData) formobj.OnGetData(option, {});
    }

}


// 트랜응답 처리부
commAPI.onPackTran = function (option, trcode, rqid) {
    var socket = option.socket,
        dataBuf = option.data,
        dataLen = option.dataLen,
        commHeader = option.commHeader;

    var formobj = option.rqidMng.formobj;
    if (formobj == undefined) {
        console.log('No form obj!!');
        return;
    }

    var options = option.rqidMng.option || {};
    var strRQName = options.rqname || '';
    var realkeys = options.realkeys || [];
    var nPrevNext = options.prevnext || 0;
    var doNotShowError = options.doNotShowError || false;

    var bSuccess = true;
    //if (TR_PRCS_RSLT_SCD.SUCCESS != commHeader.ret) {
    if (TR_PRCS_RSLT_SCD.SYSTEMERROR == option.commHeader.err_yn || TR_PRCS_RSLT_SCD.APPERROR == option.commHeader.err_yn) {
        bSuccess = false;
    }
    //if (TR_PRCS_RSLT_SCD.SUCCESS != commHeader.TR_PRCS_RSLT_SCD) {
    //    var obj = option.msgHeader;
    //    obj["errType"] = 0;
    //    if (formobj.OnGetError) formobj.OnGetError(strRQName, obj);
    //    return;
    //}
    // --> [Edit] 수정자:kim changa 일시:2019/10/17
    // 수정내용> ._trcode 할당시에 서비스 코드만 변경해서 호출
    var strTrCode = (options._trcode === undefined) ? trcode.toString() : options._trcode; //통신헤더 tran id
    var strPreTrCode = (options._trcode) ? options.trcode : ""; // 원래 trcode를 들고 있어야겠다.
    // <-- [Edit] kim changa 2019/10/17
    var dataExist = 0;
    var nextKeyBuf = null;
    var nextKeyLen = 0;

    var options = {
        'dataCount': 0,
        'rqname': strRQName,
        'trcode': strTrCode,
        '_trcode': strPreTrCode,
        'realkeys': realkeys,
        'prevnext': nPrevNext,
        'dataExist': dataExist,
        'nextKeyBuf': nextKeyBuf,
        'nextKeyLen': nextKeyLen,
        'msgHeader': option.msgHeader,
        'success': bSuccess,
        content_type: commHeader.content_type, //"J" :JSON 형식
        doNotShowError: doNotShowError
    };

    var tran_group = formobj.tran_group[strTrCode]; //tran info
    if (tran_group == undefined) {
        if (strPreTrCode != "") { // tran_group에는 원래 trcode로 들어있을거다.
            tran_group = formobj.tran_group[strPreTrCode];
        }
        if (tran_group == undefined)
            return;
    }

    //tran to json
    var outData = commAPI.parseTRAN(bSuccess ? dataBuf : null, tran_group, commHeader);
    if (bSuccess) { //연속조회 존재시 데이터부 OutRec1에 nkey 값
        if (outData.OutRec1) {
            if (outData.OutRec1.nkey) {
                options.dataExist = 1;
                options.nextKeyBuf = outData.OutRec1.nkey;
            }
        }
    }

    // 종목리스트에서 거래량 데이터 가공
    // --> [Edit] 수정자:kim changa 일시:2020/02/21
    // 수정내용> 결함화면 1442 티커 거래량기능 변경
    if (strTrCode == 106122) {
        var arData = outData.OutRec1 || [],
            bFuture = false;
        if (arData.length > 0) {
            var rec = g_masterInfo[arData[0].symbol]; // 마스터 레코드
            //if ( rec && rec.futures_yn =="Y"){
            if (rec && rec.item_sect == ITEM_SECT.FUT) {
                bFuture = true;
            }
        }

        arData.forEach(function (obj) {
            var fVal = 0;
            if (bFuture) {
                // 평균진입가 = 24시간 거래대금 / 24시간 거래량
                var fh24_gvol = +(obj.h24_gvol);
                if (fh24_gvol > 0) {
                    var avgAmt = +(obj.h24_gamt) / fh24_gvol;
                    // 24시간 회전율 = 24시간 거래량 / 평균진입가   
                    fVal = fh24_gvol / avgAmt;
                }
            } else {
                fVal = +(obj.price) * +(obj.h24_gvol);
            }
            obj["_h24_gvol"] = fVal;
            //hi5.calcTurnover(fVal);
        })
    }

    if (formobj.OnGetData) {
        formobj.OnGetData(options, outData);
    }
    //commAPI.tranToCtrls(formobj, options, dataBuf);
}


var queue = null;
var hi5_worker = null;

function hi5_startWorker() {
    if (hi5_worker) return;
    var workerUrl = 'js/worker.js';
    workerUrl = hi5_cbMng.getURL({
        url: workerUrl
    });
    if (typeof (Worker) !== "undefined") {
        try {
            hi5_worker = new Worker(workerUrl);
        } catch (e) {
            try {
                var blob;
                try {
                    blob = new Blob(["importScripts('" + workerUrl + "');"], {
                        "type": 'application/javascript'
                    });
                } catch (e1) {
                    var blobBuilder = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
                    blobBuilder.append("importScripts('" + workerUrl + "');");
                    blob = blobBuilder.getBlob('application/javascript');
                }
                var url = window.URL || window.webkitURL;
                var blobUrl = url.createObjectURL(blob);
                hi5_worker = new Worker(blobUrl);
            } catch (e2) {
                //if it still fails, there is nothing much we can do
            }
        }

        hi5_worker.onmessage = function (e) {
            var data = e.data;
            if (data > 0) {
                // 큐에서 최상위 데이터 취득후, 큐개수를 취득한다.
                var countQueue = queue.length(),
                    option = queue.pop(),
                    text = "";
                if (countQueue <= 0) return;
                if (option) {
                    //if (hi5_DebugLevel && hi5_DebugLevel.timeElapsed)
                    //    text = "onRealSend code:" + option.key + " Type:" + option.realType;

                    if (text != "")
                        hi5.timeElapsed({
                            start: true,
                            name: text
                        });

                    hi5.logTrace({
                        type: 3,
                        message: "PB JSON",
                        data: option
                    });

                    option.countQueue = countQueue - 1;
                    commAPI.onRealSend(option);

                    hi5.traceTitle({
                        QUEUE: {
                            PUT: countQueue - 1
                        }
                    });
                    //if (text != "")
                    //    hi5.timeElapsed({ name: text });
                    //nCount = countQueue > 0 ? nCount++ : 0;
                }
                //}
            }
        };
        // time : 100 == 1 second.
        hi5_worker.postMessage({
            cmd: "start",
            time: 50
        }); // Start the worker(20 ms).
    }
}

function hi5_stopWorker() {
    if (hi5_worker != null && hi5_worker != undefined) {
        hi5_worker.terminate();
        hi5_worker = null;
    }
}


// 시세풀 데이터를 취득한다.
// option = { realType :자동갱신타입(문자열) , key: [심볼코드]}
commAPI.getPoolData = function (option) {
    return ws.poolData(option);
}

commAPI.getRealTime = function () {
    return g_hi5MaxQueue;
}

// 각 화면으로 시세Pool데이터 처리 메세지 전송
var g_nPaintMaxCount = 0;

function updatePoolTimeOut() {
    //console.time("updatePoolTimeOut");
    // 큐개수 50개보다 적은경우만 OnRealTime() 함수 호출
    var countQueue = queue.length(),
        count; // 현재큐개수
    if (countQueue >= 200) {
        g_nPaintMaxCount = g_nPaintMaxCount + 1;
        if (g_nPaintMaxCount <= 2) return;
        //if (g_nPaintMaxCount <= ( countQueue / g_hi5MaxQueue)) return;
    }

    g_nPaintMaxCount = 0;
    g_poolControl.forEach(function (objCtl, idx) {
        if (objCtl._realMng) { // 각 컨트롤에게 전송
            count = objCtl._realMng.count();
            if (count > 0) {
                objCtl._realMng.send(countQueue);
            }
        } else {
            if (objCtl.OnRealTime) {
                objCtl.OnRealTime(countQueue);
            }
        }
    });

    //console.timeEnd("updatePoolTimeOut");
}

commAPI.SetRealTimerProc = function (bStart, time) {
    if (bStart) {
        if (commAPI.timerID) {
            clearInterval(commAPI.timerID);
            commAPI.timerID = 0;
        }
        if (g_hi5MaxQueue > 0) {
            commAPI.setTime = time;

            setTimeout(updatePoolTimeOut.bind(this)); // first time.
            commAPI.timerID = setInterval(updatePoolTimeOut.bind(this), time);
        }
    } else {
        commAPI.setTime = 0;
        clearInterval(commAPI.timerID);
        commAPI.timerID = 0;
    }
}

// 시세PoolData Paint 함수 호츌
commAPI.SetRealTimer = function (bReg, objCtl) {
    var idx = g_poolControl.indexOf(objCtl);
    if (bReg) {
        if (idx == -1) {
            g_poolControl.push(objCtl);
        }
    } else {
        if (idx != -1) {
            g_poolControl.splice(idx, 1);
        }
    }
}

// 배열데이터를 역순으로 레코드 단위로 전송하는 기능
commAPI.onRealCB = function (option, callback) {
    var length, i = 0,
        data = option.data;
    if (callback) {
        length = data.length;
        for (i = length - 1; i >= 0; i--) {
            if (callback.call(data[i], data[i], i) === false) {
                return;
            }
        }
    }
}
var hi5_commsDbg = null;

var $orderBoox = _oBooks._orderBooks;
// 실시간 JSON 데이터 파싱 전달후 화면으로 전송
commAPI.onRealJSONData = function (option, objKeyData) {
    var hashData = objKeyData.hashData,
        strJSON, count = hashData.length,
        _objBook;
    if (count > 0) {
        option["data"] = {};
        strJSON = String.fromCharCode.apply(null, hashData[0]);
        try {
            option.data = JSON.parse(strJSON);
            option["_maxCount"] = option.realType == HOGA_PB.h20 ? 20 : 0; // 20호가 데이터 의미
            // 공유호가 가격을 업데이트 한다
            $orderBoox.setShareData(option);

            for (var i = 0; i < objKeyData.objCtls.length; i++) {
                _objBook = objKeyData.objCtls[i];
                if (_objBook.symbol == option.data.code && _objBook.OnRealShareData) {
                    _objBook.OnRealShareData.call(_objBook, option);
                    break;
                }
            }
            // 실시간 데이터를 전달하는 함수
            commAPI.onSendRealData(option, objKeyData.objCtls);
        } catch (e) {
            console.log(e);
            console.log("error--->", strJSON);
        }
    }
}

// 실시간 시세Pool 데이터를 처리하는 함수
commAPI.onRealPullData = function (option, objKeyData) {
    if (option.realType == HOGA_PB.h20) {
        commAPI.onRealJSONData(option, objKeyData)
        return;
    }
    var hashData = objKeyData.hashData,
        arPBMng = objKeyData.objCtls,
        dataBuf, begin = hashData.length - 1;
    //var sizeRec = hi5_poolMng.getRecordSize(option);
    //if (sizeRec <= 0) return;

    option["data"] = [];
    option.realCount = 0;
    option._maxRealCount = 200; // 최대 200건만 처리를 한다.


    var time;
    if (option.realType == "0012" && hashData.length > 1) {
        var upDateMode = true;
        for (var i = 0; i < arPBMng.length; i++) {
            if (arPBMng[i]._realArrayMode) {
                upDateMode = false;
                break;
            }
        }
        // 맨 마지막(최신)데이터만 처리를 한다.
        if (upDateMode) {
            option._maxRealCount = 1; // 최대 200건만 처리를 한다.
        }
        /*
                else {
                    option._count = hashData.length;
                    time = "===> " + JSON.stringify(option) + "<=====";
                    console.time(time);
               }
        */
    }

    var fdv = new FastDataView();
    var realTran = realstruct[option.realType],
        item, value, arRealData = [],
        objData = {};
    var bJuch = option.realType == "JUCH" ? true : false, // 체결통보
        bUpjong = option.realType == "0010" ? true : false; // 업종지수


    for (var j = begin; j >= 0; j--) {
        dataBuf = hashData[j];
        fdv.setBuffer(dataBuf, 0, dataBuf.byteLength);
        for (var x = 0; x < realTran.out.length; x++) {
            item = realTran.out[x];
            if (item.datatype != undefined && item.datatype == FT_FILLER) continue;

            itemName = item.fid != undefined ? item.fid : item.itemname;
            value = fdv.A2UBin(dataBuf, item);
            objData[itemName] = value.Ntrim();
        }

        option.realCount++; // 데이터 건수 설정

        // --> [Edit] lee nohan 20190905
        // 수정내용 : TPSL 취소시, 응답데이터의 svc 항목 값이 2개중 하나로 왔을경우,
        // lo_near_prc = 0 이면 , stgb = 1 로 변경, ik_near_prc = 0 이면 stgb = 2 로 변경해줘야 한다.
        if (bJuch && (objData.svc == "SLJD" || objData.svc == "SLOD")) {
            if (objData.lo_near_prc.atof() == 0)
                objData.stgb = "1";
            else if (objData.ik_near_prc.atof() == 0)
                objData.stgb = "2";
        }

        // <-- [Edit] lee nohan 20190905
        option.data.push(objData);
        if (option.realCount == option._maxRealCount) {
            break;
        } else {
            objData = {};
        }
    }

    if (time !== undefined)
        console.timeEnd(time);

    // 업종시세인경우 지수값이 변경된 경우만 처리( 김창하)
    if (bUpjong) {
        if (hi5_DebugLevel && hi5_DebugLevel.upjong) {
            // 로그표시
            hi5.logTrace({
                type: 4,
                message: "--업종지수--실시간--[" + option.data[0].code + "]---",
                data: option.data[0]
            });
        }
    }

    // 호가매도1, 매수1 호가 설정
    if (option.realType == "0013" /*|| option.realType == "0012"*/ ) {
        var objData = option.data[0],
            rec = g_masterInfo[option.key]; // 마스터 레코드
        if (rec) {
            rec["ask1"] = objData["ask1"]; // 매도1호가
            rec["bid1"] = objData["bid1"]; // 매수1호가
        }
    }

    // 시세 데이터
    // --> [Edit] 수정자:kim changa 일시:2020/02/21
    // 수정내용> 결함화면 1442 티커 거래량기능 변경
    if (option.realType == "0012") {
        // 누적거래량 = 현재가 * 24시간 거래량
        var fPrice = +(option.data[0].price),
            fh24_gvol = +(option.data[0].h24_gvol),
            fval = 0;
        var rec = g_masterInfo[option.data[0].symbol]; // 마스터 레코드
        //if ( rec && rec.futures_yn =="Y"){
        if (rec && rec.item_sect == ITEM_SECT.FUT) {
            // 평균진입가 = 24시간 거래대금 / 24시간 거래량
            if (fh24_gvol > 0) {
                var avgAmt = +(option.data[0].h24_gamt) / fh24_gvol;
                // 24시간 회전율 = 24시간 거래량 / 평균진입가   
                fval = fh24_gvol / avgAmt;
            }
        } else {
            fval = fPrice * fh24_gvol;
        }
        option.data[0]["_h24_gvol"] = fval;
    }
    // <-- [Edit] kim changa 2020/02/21

    if (option.realType == "JUCH")
        option.fn = commAPI.onRealCB;

    if (hi5_DebugLevel && hi5_DebugLevel.noReal) {
        console.log('noReal : ', option);
        return;
    }

    // 실시간 데이터를 모으는 처리( 디버그용)
    if (hi5_commsDbg && hi5_commsDbg._realType) {
        if (hi5_commsDbg._realType.includes(option.realType)) {
            if (hi5_commsDbg["_list"] === undefined) {
                hi5_commsDbg["_list"] = [];
            }

            // 종목코드로 필터링한다.            
            if (hi5_commsDbg._realCode) {
                if (hi5_commsDbg._realCode.includes(option.key))
                    hi5_commsDbg._list.push({
                        realType: option.realType,
                        key: option.key,
                        realCount: option.realCount,
                        data: option.data.slice(0)
                    });
            } else {
                hi5_commsDbg._list.push({
                    realType: option.realType,
                    key: option.key,
                    realCount: option.realCount,
                    data: option.data.slice(0)
                });
            }
        }
    }

    // 실시간 데이터를 전달하는 함수
    commAPI.onSendRealData(option, arPBMng);
}

commAPI.onSendRealData = function (option, arPBMng) {
    // function call 맨 처음 전송
    var nIndex = 0,
        nLen = arPBMng.length,
        objRecvCtl;
    for (nIndex = 0; nIndex < nLen; nIndex++) {
        objRecvCtl = arPBMng[nIndex];
        if (objRecvCtl) {
            if (objRecvCtl.obj && hi5.isFunction(objRecvCtl.obj)) {
                objRecvCtl.obj.call(objRecvCtl.obj, option);
            } else if (objRecvCtl.obj && objRecvCtl.obj.OnRealData) {
                objRecvCtl.obj.OnRealData(option);
            } else if (hi5.isFunction(objRecvCtl)) {
                objRecvCtl.call(objRecvCtl, option);
            } else if (typeof (objRecvCtl) == "object" && hi5.isObject(objRecvCtl) && (objRecvCtl.ctlName != undefined && objRecvCtl.ctlName == "form")) {
                objRecvCtl.OnRealData(option);
            } else if (typeof (objRecvCtl) == "object") {
                if (objRecvCtl.objParentForm) {
                    objRecvCtl.objParentForm.OnRealData(option, objRecvCtl);
                } else if (objRecvCtl.OnRealData) {
                    objRecvCtl.OnRealData(option);
                }
            }
        }
    }
}
// 호가 및 시세 데이터 설정 및 취득기능
// 선물/보험 시세및 호가가격 취득및 설정기능
// { 
//   code: "종목코드",  // codekey만 있으면 취득기능
//   price: "현재가",   // 설정시만
//   ask1:"매도1호가",  // 설정시만
//   bid1:"매수1호가", // 설정시만
// }

commAPI.getShareData = function (option) {
    var rec = g_masterInfo[option.code]; // 마스터 레코드

    if (option['JSON']) {
        rec['ask1'] = option.ask1;
        rec['bid1'] = option.bid1;
        return;
    }

    if (option['price']) {
        rec['price'] = option.price;
        rec['ask1'] = option.ask1;
        rec['bid1'] = option.bid1;
    } else {
        return {
            price: rec.price ? rec.price : "", // 현재가
            ask: rec.ask1 ? rec.ask1 : "", // 매도1호가
            bid: rec.bid1 ? rec.bid1 : "" // 매수1호가
        }
    }
}

commAPI.onRealSend = function (option) {
    // 공유메모리에 데이터를 설정한다.
    // 화면으로 전송할 객체를 취득한다.
    var hash = hi5_poolMng.getKeyNum(option),
        arPBMng;
    //KCU이중접속통보 왔을때, ws.connect()가 끊겨서 false 처리되는 경우발생, 재접속 팝업이 안뜬다...
    //ws 연결 여부 체크 없이, kcu 일때는 처리하도록 변경
    if (hash && option.realType == "KCU") {
        //debugger;
        if (ws.getRealData)
            ws.getRealData(option, this.onRealPullData);
        return;
    }

    if (hash && ws.connect()) {
        ws.getRealData(option, this.onRealPullData);
    }
}


// 통신모듈 팻킷수신처리
commAPI.onPacket = function (option) {
    var socket = option.socket, // socket객체
        chunk = option.msg, // 실제 데이터
        tr_tp = option.tr_tp, // 데이터 구분
        dataLen, bRealData = false,
        bRealJSON = false,
        commHeaderBuff, commHeader, strText, dataBuf;

    // Heardbit
    if (tr_tp == 2) { //echo는 아무 처리 안함
        // overflow날 가능성이있어서 일단 주석 처리. return만 해준다.
        // if (window.heartBit_count === undefined) {
        //     window.heartBit_count = 0;
        // }
        // window.heartBit_count++;
        return;
    }

    // 실시간 타입정의
    if (tr_tp >= 51000 && tr_tp <= 53000) {
        bRealData = true;
    }

    //console.log(tr_tp);
    if ((chunk instanceof Uint8Array) || hi5.isArrayBuffer(chunk)) {
        dataLen = chunk.byteLength - st_header.totlen; //전체길이 - 통신헤더
        commHeaderBuff = chunk.subarray(0, st_header.totlen); //헤더부
        if (bRealData) {
            var item = st_header.content_type;
            strText = String.fromCharCode(chunk.slice(item.offsetlen, item.offsetlen + item.datalen));
            if (strText == "J")
                bRealJSON = true;
        } else {
            commHeader = commAPI.parseComm(bRealData, commHeaderBuff);
        }
        dataBuf = chunk.subarray(st_header.totlen); //데이터부
        // 압축데이터 해제
        if (!bRealData && commHeader.commp == 2) {
            //var strLog = commHeader.svc + "-- decompress before:[" + dataLen + "];after:[" + commHeader.ucomp + "]";
            //console.time(strLog);
            dataLen = commHeader.ucomp; // 원본 데이터길이
            // 압축을 해제한다.
            var outputBuffer = pako.inflate(dataBuf);
            if (outputBuffer.length == 0) {
                console.log('Unzip failed!');
                return;
            }
            dataBuf = outputBuffer;
            //console.timeEnd(strLog);
        }

        var realType = "",
            strRealKey = "",
            nRealCnt = 1,
            bufferLen, realDataBuf = null;
        switch (tr_tp) {
            case 53000: {
                realType = "JUCH";
                var item = realstruct[realType].out[7];
                strRealKey = String.fromCharCode.apply(null, dataBuf.slice(item.offsetlen, item.offsetlen + item.datalen)).Ntrim();
            }
            break;
        case 52000:
            realType = "GONG";
            break;
        case 52001: // 2019.09.25 kws -> 강제종료 신호 수신시, 쿠키 지워주고, 접속종료 팝업창 띄워줘야한다.
            if (typeof window.CENB_DELETE_USER_COOKIE == "function") window.CENB_DELETE_USER_COOKIE(); // 쿠키지워주기
            if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                if (typeof window.mobileRouterChange == "function") window.mobileRouterChange('Home'); // 메인페이지로 이동    
            } else {
                if (typeof window.frontRouterChange == "function") window.frontRouterChange('Home'); // 메인페이지로 이동
            }
            // 통신 강제 끊기 있어야한다.
            ws.loginState(false);
            ws.forcedClose = true;

            ws.clear(); // 통신 정보 삭제
            //ws.close(); // 통신 강제 종료. 근데 종료 신호가 늦게 떨어진다....
            // 서버에서도 끊는 처리를 하는 중.

            // 강제 접속 종료 메시지 띄운다.
            hi5.MessageBox($hi5_regional.text.forceDisconnect, $hi5_regional.title.notice, 3, function () {
                location.reload();
            });
            break;
        default:
            break;
        }

        // 시세 실시간
        if (tr_tp >= 51000 && tr_tp <= 51100) {
            realDataBuf = dataBuf.slice(4); // 4byte 부가정보
            bufferLen = realDataBuf.byteLength || realDataBuf.length;
            if (tr_tp == 51015 && bRealJSON) {
                realType = HOGA_PB.h20; // 20호가 JSON

                //String.fromCharCode.apply(null, realDataBuf);
                strText = String.fromCharCode.apply(null, realDataBuf.slice(0, 44));
                var nFind = strText.indexOf("code");
                if (nFind <= 0) return;
                nFind = nFind + 7;
                strRealKey = strText.substring(nFind, nFind + 15).split("\",")[0];
                //console.log("JSON--->", strRealKey, String.fromCharCode.apply(null, realDataBuf) );

            } else {
                var strType = hi5.B2S(dataBuf.slice(0, 4));
                nRealCnt = +(strType.substring(2, 4));
                realType = "00" + strType.substring(0, 2);
                //var realdata = realstruct[realType];// 종목코드길이
                strRealKey = String.fromCharCode.apply(null, realDataBuf.slice(0, 15)).Ntrim();
            }
        }

        if (realType != "") {
            // 자동갱신 처리
            if (realDataBuf == null) {
                //realDataBuf = new Uint8Array(dataBuf).buffer;
                realDataBuf = dataBuf;
                bufferLen = realDataBuf.byteLength || realDataBuf.length;
            }
            //  var realObj = {
            //      'realType': realType,  // realtype
            //      'realCnt': nRealCnt,
            //      'dataSize': bufferLen.toString(),
            // };
            //var dataJsonArray = commAPI.parseCommRealData(realDataBuf, realObj);

            var option = {
                realType: realType,
                key: strRealKey,
                json: bRealJSON
            };
            var objData = {
                data: realDataBuf,
                length: nRealCnt,
                sizeRec: bRealJSON ? 0 : bufferLen / nRealCnt
            };
            var hash = hi5_poolMng.setKeyNum(option, objData);
            if (hash) {
                // 공유메모리에 설정후 큐데이터 저장한다.
                if (!socket.setRealData(option, objData)) return;
                //continue;
            }
            queue.add(option);
            hi5.traceTitle({
                QUEUE: {
                    GET: queue.length()
                }
            });

            // 화면으로 전송할 객체를 취득한다.
            //var arPBMng = ws.commReal(2, option), objRecvCtl;
            if (!hi5_worker) {
                commAPI.onRealSend(option);
            }
            //}
            return;
        }

        var rqid = commHeader.seq;
        if (rqid == undefined) {
            alert("Response Data communication error (RQID)");
            return;
        }

        //        console.log(g_errMsg[commHeader.ret]);
        // 조회ID객체를 취득한다(조회응답시간을 초기화한다).
        var rqidMng = socket.rqidRegister(rqid);
        if (!rqidMng) {
            //console.log("rqid not find===" + rqid);
            return;
        }


        // --> [Edit] 수정자:kim changa 일시:2019/03/10
        // 수정내용> 서비스 오류가 표시된 경우 Trcode를 표시한다.
        //if (TR_PRCS_RSLT_SCD.SUCCESS != commHeader.ret)
        if (TR_PRCS_RSLT_SCD.SYSTEMERROR == commHeader.err_yn || TR_PRCS_RSLT_SCD.APPERROR == commHeader.err_yn)
            commHeader.ret_msg += "\r\n(Trcode:" + commHeader.svc + ")"; // Trcode 표시

        var optData = {
            socket: socket,
            commHeader: commHeader,
            msgHeader: {
                MSG_COD: commHeader.ret,
                MSG_CTNS: commHeader.ret_msg
            },
            data: dataBuf,
            rqidMng: rqidMng,
            dataLen: dataLen
        };
        // <-- [Edit] kim changa 2019/03/10

        if (rqidMng && hi5.isFunction(rqidMng.OnGetData)) {
            rqidMng.OnGetData.call(rqidMng, optData);
            socket.rqidDelete(rqid);
            return;
        }

        commAPI.onPackTran(optData, commHeader.svc, rqid);

        // 조회ID객체를 삭제한다.
        if (rqidMng)
            socket.rqidDelete(rqid);
    }
}

//REAL Data
commAPI.parseCommRealData = function (buff, realObj) {
    var commdata = {},
        realData = [],
        databuff;
    if (realObj != undefined) {
        databuff = buff;
        commdata = {
            'fw_push_cnt': "1",
            'fw_push_id': realObj.realType, // realtype
            'fw_push_Key': "",
            'fw_rts_st_size': realObj.dataSize,
            'fw_rts_st_cnt': realObj.realCnt,
            'data': ''
        };
    } else {
        var buff_fw_push_cnt = buff.slice(0, 2);
        var fw_push_cnt = hi5.A2U(buff_fw_push_cnt);

        var buff_fw_push_id = buff.slice(2, 5);
        var fw_push_id = hi5.A2U(buff_fw_push_id);

        var buff_fw_push_Key = buff.slice(5, 37);
        var fw_push_Key = hi5.A2U(buff_fw_push_Key);

        var buff_fw_rts_st_size = buff.slice(37, 41);
        var fw_rts_st_size = hi5.A2U(buff_fw_rts_st_size);

        var buff_fw_rts_st_cnt = buff.slice(41, 43);
        var fw_rts_st_cnt = hi5.A2U(buff_fw_rts_st_cnt);

        databuff = buff.slice(43, parseInt(fw_rts_st_size) + 43);

        commdata = {
            'fw_push_cnt': fw_push_cnt.Ntrim(),
            'fw_push_id': fw_push_id.Ntrim(),
            'fw_push_Key': fw_push_Key.Ntrim(),
            'fw_rts_st_size': fw_rts_st_size.Ntrim(),
            'fw_rts_st_cnt': fw_rts_st_cnt.Ntrim(),
            'data': ''
        };
    }
    realData = commAPI.parseRealData(commdata, databuff);
    commdata.data = realData;
    return commdata;
}

commAPI.parseRealData = function (commdata, databuff) {
    var totlen = parseInt(commdata.fw_rts_st_size);
    var realCnt = parseInt(commdata.fw_rts_st_cnt);

    var arraydata = [];
    var data = {};
    //data['type'] = commdata.fw_push_id;

    var realdata = realstruct[commdata.fw_push_id];
    var buffLen = databuff.byteLength || databuff.length;
    if (totlen == buffLen) {
        var out_info = realdata.out_info;
        var keyindex = out_info.keyindex;
        var itemcnt = realdata.out.length;
        var item, value, itemName;

        var realdatalen = out_info.len;
        for (var xx = 0; xx < realCnt; xx++) {
            var newdatabuff = databuff.slice(realdatalen * xx, realdatalen * xx + realdatalen);

            var fdv = new FastDataView(newdatabuff, 0);
            if (keyindex > -1) {
                item = realdata.out[keyindex];
                value = fdv.A2UBin(newdatabuff, item);
                commdata['fw_push_Key'] = value.Ntrim();
                //console.log('parseRealData : ', commdata);
            }
            /*for (var x = 0; x < itemcnt; x++) {
                item = realdata.out[x];
                if (item.datatype != undefined && item.datatype == FT_FILLER) continue;

                var itemName = item.itemname;
                value = fdv.A2UBin(newdatabuff, item);
                if (keyindex == x) {
                    commdata['fw_push_Key'] = value.Ntrim();
                }
                data[itemName] = value.Ntrim();
            }
            arraydata.push(data);*/
        }
    } else {
        //console.log('length does not match - ' + commdata.fw_rts_st_size + '|' + databuff.length);
    }

    return arraydata;
}

// 자동갱신 수신처리 메세지
commAPI.OnRealData = function (option) {
    //var option = { realtype: pbID, push_Key: push_Key, data: [ realData] };
    var pid = option.realType,
        realCount = option.realCount,
        msg;
    if (pid == "0012") {
        // 마스터 정보에 시세데이터를 갱신 시킨다.
        var code = option.key,
            objData = option.data[0];
        //var rec = g_masterInfo[code], fid;  // 마스터 레코드
        // 2019.11.15 kws
        // price만 갱신한다.
        var rec = g_masterInfo[code]; // 마스터 레코드
        if (rec)
            rec["price"] = objData["price"];
        /*
        var outputFID = ["price", "change", "open", "high", "low", "vol", "gamt", "rate", "dt_work"];  // 종목코드,현재가(4),기준시간대비(2985),기준시간대비부호(2986),기준시간등락률(2987),거래량(11)
        for (var i = 0 ; i < outputFID.length; i++) {
            fid = outputFID[i];
            //if (rec[fid] != undefined && objData[fid] != undefined) {
            rec[fid] = objData[fid];
            //if (i < 5) {
            //    rec[fid] = hi5.priceF(code, rec[fid]);
            //}
            //if (fid == "vol") {
            //    rec[fid] = hi5.setQtyF(code, rec[fid]);
            //}
            //}
        }*/
        return;
    }

    if (pid == "JUCH") { // 체결통보 수신
        commAPI.onCheJanRealData(option);
    } else if (pid == "GONG") { // 긴급공지 수신
        hi5.logTrace({
            type: 10,
            message: "--실시간 공지사항--",
            data: option.data
        });
        sendTicker("GONG", option);
    } else if (pid == "U02") { // 마스터 실시간 데이터
        var arrayBuf = option.data;
        commAPI.onopen(ws, {
            master: true,
            type: 1,
            data: arrayBuf
        });
    } else if (pid == "0010") { // 업종 실시간
        // 마스터 정보에 시세데이터를 갱신 시킨다.
        // --> [Edit] 수정자:kim changa 일시:2019/09/26
        // 수정내용> 실시간으로 온 데이터 항목만 갱신 시켜야 한다.
        var code = option.key,
            objData = option.data[0],
            objUpJong = g_upjongInfo[code];
        //upjongInfo[code] = objData;
        for (var key in objData) {
            if (key != "code")
                objUpJong[key] = objData[key];
        }
        // <-- [Edit] kim changa 2019/09/26
        return;
    }
}
// 서비스 오류 메세지창
commAPI.OnErrorMsg = function (option, callback) {
    this.OnWaitScreen(false);
    //var ot = {
    //    login: { ko: "로그인 오류 확인", en: " login errors", jp: "ログインのエラーチェック" },
    //    master: { ko: "마스터정보 오류 확인", en: "Confirm master information error", jp: "マスター情報のエラーチェック" },
    //    acctinfo: { ko: "계좌정보정보 오류 확인", en: "Confirm account information error", jp: "口座情報のエラーチェック" },
    //    siseonly: { ko: "시세조회 접속 오류", en: "Quote connection error", jp: "口座情報のエラーチェック" },
    //    "5000": { ko: "확인", en: "Confirm", jp: "確認" }
    //};

    var msg = $hi5_regional.tr[option.type];
    if (option.data.commHeader) {
        msg = "ErrorCode=[" + option.data.commHeader.ret + "] \r\nMessage=[" + option.data.commHeader.ret_msg + "]";
    }
    hi5.MessageBox(msg, $hi5_regional.title.warning, 0, function (ret) {
        if (callback) callback.call(this, ret);
        return;
    });
}


commAPI.commTranRQ = function (objTran, callback) {
    var self = this;
    // 서비스정보를 취득
    var trObjCode = $hi5_trinfo[objTran.trcode];
    if (trObjCode == undefined) {
        console.assert('No tran info!tran=', objTran.trcode);
        // 서비스정보 취득실패시에 오류처리
        return false;
    }
    // 통신 헤더만 사용하는 경우
    var arBuf = hi5.isEmpty(trObjCode) ? [] : self.json2structApi(trObjCode, objTran.input);

    // 통신헤더정보
    var commHeaderInfo = {
        trcode: objTran.trcode, // 트랜코드
        INFC_SCD: trObjCode.destsvr // 목적지 구분
    };

    // 데이터 정보
    var dataOption = {
        dataModel: arBuf, // 데이터 전문
        TLG_LNG: arBuf.length, // 레코드 길이
        rqid: self.getRQID(), // 조회ID채번
        rqidMng: {
            callfn: callback ? callback : objTran.fn, // callback 함수
            timeout: 10,
            trcode: objTran.trcode, // 수신응답시간 초과지정
            OnRpTimeOut: function (option) {
                if (this.callfn) {
                    this.callfn.call(this, {
                        status: "timeout",
                        data: option,
                        msgHeader: option.msgHeader
                    });
                }
            },
            OnGetData: function (option) {
                var outData = hi5.isEmpty(trObjCode) ? {} : self.parseTRAN(option.data, trObjCode, option.commHeader);
                // 로그인 응답 데이터 처리
                var objData = {
                    status: "success",
                    data: outData,
                    msgHeader: option.msgHeader,
                    dataInfo: this.dataInfo ? this.dataInfo : null
                };


                if (!(TR_PRCS_RSLT_SCD.SYSTEMERROR != option.commHeader.err_yn && TR_PRCS_RSLT_SCD.APPERROR != option.commHeader.err_yn)) {
                    objData.status = "error";
                }

                // commTranRQ 조회응답
                hi5.logTrace({
                    type: 2,
                    message: "==>commTranRP  = trcode [" + this.trcode + "]",
                    data: objData
                });
                if (this.callfn) {
                    this.callfn.call(this, objData);
                }
            }
        }
    };

    // 부가정보를 설정
    if (objTran.dataInfo) {
        dataOption.rqidMng["dataInfo"] = objTran.dataInfo;
    }

    // commTranRQ 조회요청
    hi5.logTrace({
        type: 2,
        message: "<==commTranRQ = trcode [" + objTran.trcode + "]",
        data: objTran
    });

    // 통신헤더와 데이터 객체를 반환
    self.onServerSend(ws, commHeaderInfo, dataOption);

    return true;
}

commAPI.requestCurrency = function (option) {
    var setCurrencyList = function (outData) {
        hi5.SHMEM["currencylist"] = outData.OutRec2;
        hi5.SHMEM["currencyObj"] = {};
        for (var x = 0; x < outData.OutRec2.length; x++) {
            var curObj = outData.OutRec2[x];
            hi5.SHMEM["currencyObj"][curObj.currency] = curObj;
            switch (curObj.currency) {
                case 'KRW':
                    curObj["symbol"] = "￦";
                    break;
                case 'USD':
                    curObj["symbol"] = "$";
                    break;
                case 'JPY':
                    curObj["symbol"] = "￥";
                    break;
                case 'CNY':
                    curObj["symbol"] = "￥";
                    break;
                case 'EUR':
                    curObj["symbol"] = "€";
                    break;
                default:
                    curObj["symbol"] = "$";
                    break;
            }
        }
        hi5.SetCurrency(hi5.SHMEM["@BASE_CURRENCY"]);
    }

    var objTranData = {
        trcode: "66123", // 일자별
        input: {
            "InRec1": {
                "filler": ""
            } // 필수입력값
        }
    };
    // 통신요청
    commAPI.commTranRQ(objTranData, function (rpData) {
        if (rpData.status == "success") { // 정상데이터
            var data = rpData.data; // 실제 데이터
            setCurrencyList(data);
            commAPI.requestMaster(option, function () {
                commAPI.requestUpjong(option);
            });

        } else { // 오류
            var errorcode = rpData.msgHeader.MSG_COD; // 오류코드
            var errormsg = rpData.msgHeader.MSG_CTNS // 오류메세지
            var msg = "[" + errorcode + "]" + errormsg;
            hi5.MessageBox(msg, $hi5_regional.title.notice, 0, function (ret) {

            });
        }
    });
}
commAPI.requestMaster = function (option, fn) {
    debugger;
    var objTranData = {
        trcode: "66122", // 마스터
        input: {
            "InRec1": {
                hv_gb: "8",
                currency: hi5.GetSharedMemory("@BASE_CURRENCY"),
                currency_rt: hi5.GetSharedMemory("@BASE_CURRRATE")
            }
        }
    };

    if (option) {
        if (option.fmarket_GB) {
            if (option.fmarket_GB != "")
                objTranData["InRec1"].market_gb = option.fmarket_GB;
        }
        if (option.coin_market) {
            if (option.coin_market != "")
                objTranData["InRec1"].coin_market = option.coin_market;
        }
    }

    // 통신요청
    commAPI.commTranRQ(objTranData, function (rpData) {
        if (rpData.status == "success") { // 정상데이터
            var data = rpData.data; // 실제 데이터
            commAPI.onMasterComplete(option, data);
            //if (!option.reload) {
            //    if (typeof window.CENBapplyFunction == "function") {
            //        window.CENBapplyFunction('socketConnected');
            //        // window.CENBapplyFunction('moduleLoadFinished');
            //    }
            //}

            if (fn) fn();
        } else { // 오류
            var errorcode = rpData.msgHeader.MSG_COD; // 오류코드
            var errormsg = rpData.msgHeader.MSG_CTNS // 오류메세지
            var msg = "[" + errorcode + "]" + errormsg;
            hi5.MessageBox(msg, $hi5_regional.title.notice, 0, function (ret) {

            });
        }
    });
}
commAPI.requestUpjong = function (option, fn) {
    var objTranData = {
        trcode: "66121", // 업종마스터
        input: {
            "InRec1": {
                hv_gb: "1"
            }
        }
    };

    // 통신요청
    commAPI.commTranRQ(objTranData, function (rpData) {
        if (rpData.status == "success") { // 정상데이터
            var data = rpData.data; // 실제 데이터
            hi5.logTrace({
                type: 10,
                message: "--업종지수정보--",
                data: rpData
            });
            //g_upjongInfo = data.OutRec2;
            //debugger;
            // --> [Edit] 수정자:kim changa 일시:2019/09/26
            // 수정내용> 선물의 업종지수만 실시간 갱신 처리 한다.
            var arUpjongCode = [];
            g_upjongInfo = hi5.arrToObj("code", data.OutRec2, 1);
            for (var code in g_upjongInfo) {
                var type = g_upjongInfo[code]["type"];
                var fut_code = g_upjongInfo[code]["fut_code"];
                // 선물관련 공정지수만 실시간 처리 
                if (type == '3' && fut_code !== "") {
                    if (g_masterInfo[fut_code]) {
                        g_masterInfo[fut_code]["upjongcode"] = code;
                        arUpjongCode.push(code);
                    }
                }
            }
            // 선물관련 지수종목만 실시간 등록하는것으로 변경
            commAPI.requestUpjongReal(arUpjongCode);
            // <-- [Edit] kim changa 2019/09/26

            if (!option.reload) {
                if (typeof window.CENBapplyFunction == "function") {
                    window.CENBapplyFunction('socketConnected');
                    if (typeof (window.setCenbFirstLoaderProgress) == 'function') {
                        window.setCenbFirstLoaderProgress("100%", true);
                    }
                    // window.CENBapplyFunction('moduleLoadFinished');
                }
            }
            if (fn) fn();
        } else { // 오류
            var errorcode = rpData.msgHeader.MSG_COD; // 오류코드
            var errormsg = rpData.msgHeader.MSG_CTNS // 오류메세지
            var msg = "[" + errorcode + "]" + errormsg;
            hi5.MessageBox(msg, $hi5_regional.title.notice, 0, function (ret) {

            });
        }
    });
}

commAPI.onMasterComplete = function (option, rpData) {
    hi5.logTrace({
        type: 10,
        message: "--마스터정보--",
        data: rpData
    });
    //debugger;
    /*console.log("hello {} and {}<br />".format("you", "bob"))
  $.each( rpData.OutRec1, function(idx, ele){
     if( ele.item_sect == "11"){
       ele.qty_danwi = "0";
     }
   })
*/
    g_masterInfo = hi5.arrToObj("symbol", rpData.OutRec1, 1);
    for (var code in g_masterInfo) {
        if (code != "") {
            rec = g_masterInfo[code]; // 마스터 레코드
            if (code.indexOf('/') > -1) {
                g_masterInfo[code]["code_only"] = code.substring(0, code.indexOf('/'));
            } else {
                //g_masterInfo[code]["code_only"] = code.substring(1, 4);
                g_masterInfo[code]["code_only"] = code;
            }
            g_masterInfo[code]["symbol"] = code;
            g_masterInfo[code]["code"] = code;
            g_masterInfo[code]["title"] = g_masterInfo[code].codename;

            g_masterInfo[code]["accttype"] = ITEM_SECT.SPOT;
            if (g_masterInfo[code]["item_sect"] == ITEM_SECT.FUT) {
                g_masterInfo[code]["accttype"] = ITEM_SECT.FUT;
                g_masterInfo[code]["base_currency_co"] = "FUT";
                g_masterInfo[code]["qty_danwi"] = "0";
                g_masterInfo[code]["lowableqty"] = "1";
            }

            if (!g_masterInfo[code]["base_currency_co"]) {
                g_masterInfo[code]["base_currency_co"] = code.substring(code.indexOf('/') + 1, code.length);
                if (g_masterInfo[code]["market"] == 'B') {
                    g_masterInfo[code]["prc_decnum"] = 8;
                    if (hi5_baseCurr == "USD") g_masterInfo[code]["base_coincode"] = "BTC/USDT";
                    else g_masterInfo[code]["base_coincode"] = 'BTC/' + hi5_baseCurr;
                } else if (g_masterInfo[code]["market"] == 'E') {
                    g_masterInfo[code]["prc_decnum"] = 8;
                    if (hi5_baseCurr == "USD") g_masterInfo[code]["base_coincode"] = "ETH/USDT";
                    else g_masterInfo[code]["base_coincode"] = 'ETH/' + hi5_baseCurr;
                } else if (g_masterInfo[code]["market"] == 'T') {
                    g_masterInfo[code]["prc_decnum"] = 3;
                } else if (g_masterInfo[code]["market"] == 'O') {
                    g_masterInfo[code]["prc_decnum"] = 8;
                    if (hi5_baseCurr == "USD") g_masterInfo[code]["base_coincode"] = "EOS/USDT";
                    else g_masterInfo[code]["base_coincode"] = 'EOS/' + hi5_baseCurr;
                } else if (g_masterInfo[code]["market"] == 'F') {
                    g_masterInfo[code]["prc_decnum"] = 8;
                    g_masterInfo[code]["accttype"] = ITEM_SECT.FUT;
                } else {
                    g_masterInfo[code]["accttype"] = ITEM_SECT.SPOT;
                    if (g_masterInfo[code]["market"] == 'K') {
                        g_masterInfo[code]["prc_decnum"] = 0;
                        if (parseFloat(g_masterInfo[code]["price"]) < 100) {
                            g_masterInfo[code]["prc_decnum"] = 2;
                        }
                    } else {
                        g_masterInfo[code]["prc_decnum"] = 2;
                    }
                }
            }
            if (g_masterInfo[code]["lowableqty"]) {
                var p = g_masterInfo[code]["lowableqty"].split(".");
                if (p[1]) {
                    g_masterInfo[code]["decnum"] = (p[1].length).toString();
                } else
                    g_masterInfo[code]["decnum"] = "0";
            }

            g_masterInfo[code]["min_order_volume"] = parseFloat(g_masterInfo[code]["lowableqty"]).toFixed(g_masterInfo[code]["qty_danwi"]).toString();
        }
    }

    if (!option.reload) { //최초에 한번만 실행
        commAPI.requestSiseReal();
        if (hi5.WTS_MODE == WTS_TYPE.SPA) {
            //commAPI.requestSiseReal();
            SPAReady();
        } else if (hi5.WTS_MODE == WTS_TYPE.MTS) {
            // 2019.11.22 kws
            // 모바일 재접속시 실시간 자동 연결
            var arPBMng = option.socket.options.arPBMng;
            if (arPBMng != undefined) {
                arPBMng.forEach(function (rc, idx, ar) {
                    commAPI.commRealRegister(true, {
                        realtype: [rc.pid],
                        keylist: [rc.code],
                        obj: rc.objCtls
                    });
                });
                delete option.socket.options.arPBMng;
            }
            MTSReady();
        } else {
            loadFullWindow();
        }

        commAPI.sendHeartBeat();
    }
}

commAPI.requestLogin = function () {
    var objTranData = {
        trcode: "20003", // 로그인
        input: {
            "InRec1": {
                userid: hi5.GetSharedMemory("@USER_ID"),
                encrypt_pswd: hi5.GetSharedMemory("@PWD"),
                media_info: hi5.GetSharedMemory("@MEDIA_INFO")
            }
        }
    };
    if (hi5admin == 'admin')
        objTranData.trcode = '20000'

    // 통신요청
    commAPI.commTranRQ(objTranData, function (rpData) {
        if (rpData.status == "success") {
            if (objTranData.trcode == '20000') { // 정상데이터, 어드민 로그인은 등급에 따라 막는다.
                if (rpData.data.OutRec1.levl) {
                    var levl = parseInt(rpData.data.OutRec1.levl);
                    if (levl <= 16) { // 아이디 등급에 따라 관리자 권한이 나뉜다.
                        hi5.MessageBox($hi5_regional.admin.loginFail, $hi5_regional.title.notice, 0, function (ret) {

                        });
                        return;
                    }
                }
            }
            //var data = rpData.data; // 실제 데이터
            commAPI.afterLogin(rpData);
        } else { // 오류
            var errorcode = rpData.msgHeader.MSG_COD; // 오류코드
            var errormsg = rpData.msgHeader.MSG_CTNS // 오류메세지
            var msg = "[" + errorcode + "]" + errormsg;
            hi5.MessageBox(msg, $hi5_regional.title.notice, 0, function (ret) {

            });
        }
    });
}
commAPI.requestSiseReal = function () {
    // 마스터 종목시세 등록 - 마스터에는 더이상 실시간을 안받는다.
    //this.commRealRegister(true, { realtype: ["0012"], keylist: Object.keys(g_masterInfo), obj: this.OnRealData });

    if (hi5admin != 'admin') {
        // 기초자산에 대해서는 실시간을 받아야한다. 2019.03.08 kws
        var baseCurList = ["BTC", "ETH", "EOS"];
        var sendlist = [];
        for (var x = 0; x < baseCurList.length; x++) {
            if (hi5_baseCurr == "USD") sendlist.push(baseCurList[x] + "/USDT");
            else sendlist.push(baseCurList[x] + "/" + hi5_baseCurr);
        }

        // 2019.09.04 kws
        // 선물 종목에 대해서는 마스터로 실시간 갱신을 한다.
        for (var key in g_masterInfo) {
            if (g_masterInfo[key].item_sect == ITEM_SECT.FUT) {
                sendlist.push(key);
            }
        }
        this.commRealRegister(true, {
            realtype: ["0012"],
            keylist: sendlist,
            obj: this.OnRealData
        });
    }

    // 긴급공지 자동갱신 등록
    this.commRealRegister(true, {
        realtype: ["GONG"],
        keylist: [],
        obj: this.OnRealData
    });
}
commAPI.requestUpjongReal = function (arKeyList) {
    //debugger;
    // --> [Edit] 수정자:kim changa 일시:2019/09/26
    // 수정내용> 선물관련 업종지수를 실시간 등록한다. 
    // 마스터 업종시세 등록
    if (arKeyList && arKeyList.length > 0) {
        this.commRealRegister(true, {
            realtype: ["0010"],
            keylist: arKeyList,
            obj: this.OnRealData
        });
    } else {
        this.commRealRegister(true, {
            realtype: ["0010"],
            keylist: Object.keys(g_upjongInfo),
            obj: this.OnRealData
        });
    }
    // <-- [Edit] kim changa 2019/09/26
}

commAPI.sendHeartBeat = function () {
    var objws = ws;
    var self = commAPI;

    //시세 전용 로그인 - 2019.02.22 kws
    var hbCommMng = {
        input: function () {
            var objCommInput = {
                "InRec1": {}
            };

            // 데이터전문을 구성한다.
            var trcode = "2";

            // 통신헤더정보
            var commHeaderInfo = {
                trcode: trcode // 트랜코드
            };

            // 데이터 정보
            var dataOption = {
                dataModel: "", // 데이터 전문
                TLG_LNG: 0, // 레코드 길이
                rqid: 0, // 조회ID채번
                rqidMng: {
                    parentObj: this,
                    timeout: 10,
                    rqname: "heartbeat",
                    trcode: trcode, // 수신응답시간 초과지정
                    OnRpTimeOut: function (option) {
                        self.OnErrorMsg({
                            type: "heartbeat",
                            data: option
                        });
                    },
                    OnGetData: function (option) {
                        // 응답 데이터 처리
                        //if (TR_PRCS_RSLT_SCD.SUCCESS == option.commHeader.ret) {
                        if (TR_PRCS_RSLT_SCD.SYSTEMERROR != option.commHeader.err_yn && TR_PRCS_RSLT_SCD.APPERROR != option.commHeader.err_yn) {
                            //setTimeout(commAPI.sendHeartBeat(), 25000);
                        } else {

                        }
                        return;
                    }
                }
            };
            // 통신헤더와 데이터 객체를 반환
            return {
                commHeaderInfo: commHeaderInfo,
                dataOption: dataOption
            };
        },
    }

    var id = setInterval(function () {
        //console.log('send heartbeat....');
        // 전종목시세 관련 통신객체 정보 구성
        var opt = hbCommMng.input();
        commAPI.onServerSend(objws, opt.commHeaderInfo, opt.dataOption);
    }, 30000); // 30sec 마다 하트비트를 날린다.
    /*
        debugger;
        if (hi5.WTS_MODE == WTS_TYPE.MTS) {
            $("#mobileHtml").before("<div id='hi5_m_log' style='position:absolute;color:red; z-index: 999999999999999;'> </div>");
            var _$log = $("#hi5_m_log");
            var idIdle = setInterval(function () {
                //console.log("online Status->", window.navigator.onLine);
                // Heardbit
                if (window.heartBit_count !== undefined) {
                    var text = JSON.stringify({ time: new Date().toLocaleString(), heartBit: heartBit_count, readyState: ws.options.socket.readyState, buffer: ws.options.socket.bufferedAmount })
                    _$log.text(text);
                }
            }, 1000);  // 1sec 마다 하트비트를 날린다.
        }
    */
}

// 2019.08.05 kws -> 로그인 후 사용자 환경 설정 정보 취득
commAPI.requestUserSetting = function (option, fn) {
    var objTranData = {
        trcode: "16307", // 로그인
        input: {
            "InRec1": {
                userid: hi5.GetSharedMemory("@USER_ID")
            }















        }
    };

    objTranData.input.InRec1 = $.extend(true, objTranData.input.InRec1, option);
    // 통신요청
    commAPI.commTranRQ(objTranData, function (rpData) {
        if (rpData.status == "success") {
            var data = rpData.data.OutRec1;

            if (data.length > 0) { // 조회 시
                var settingObj = {};
                for (var x = 0; x < data.length; x++) {
                    var dataObj = data[x];
                    if (!settingObj[dataObj.category]) settingObj[dataObj.category] = {};
                    if (dataObj.category == "general" && dataObj.key == "mode" && dataObj.value == "light")
                        settingObj[dataObj.category][dataObj.key] = "basic";
                    else
                        settingObj[dataObj.category][dataObj.key] = dataObj.value;
                }
                //debugger;
                $.extend(true, hi5.SHMEM.user_setting, settingObj);
            }
            //hi5.SHMEM["user_setting"] = rpData.data.OutRec1;
            if (fn) fn(rpData.status);
        } else { // 오류
            var errorcode = rpData.msgHeader.MSG_COD; // 오류코드
            var errormsg = rpData.msgHeader.MSG_CTNS // 오류메세지
            var msg = "[" + errorcode + "]" + errormsg;
            //hi5.MessageBox(msg, $hi5_regional.title.notice, 0, function (ret) {

            //});
            hi5.showToast({
                type: 2,
                text: msg,
                title: 'Tran Error'
            });
            if (fn) fn(rpData.status);
        }
    });
}

// 2019.11.21 kws -> 로그인정보를 저장하는 함수를 따로 추가함
commAPI.setUserInfo = function (bReg, obj) {
    if (bReg) {
        hi5.SetSharedMemory("@USER_ID", obj.userid);
        hi5.SetSharedMemory("@FLEVL", obj.flevl);
        hi5.SetSharedMemory("@STAKING_FLEVL", obj.staking_flevl);
        hi5.SetSharedMemory("@SPECIAL_FLEVL", obj.special_flevl); // 결함번호 740
        hi5.SetSharedMemory("@OTP_YN", obj.otp_yn); // 결함번호 877
    } else {
        hi5.SetSharedMemory("@USER_ID", "");
        hi5.SetSharedMemory("@FLEVL", "");
        hi5.SetSharedMemory("@STAKING_FLEVL", "");
        hi5.SetSharedMemory("@SPECIAL_FLEVL", ""); // 결함번호 740
        hi5.SetSharedMemory("@OTP_YN", ""); // 결함번호 877
    }
}
// 2019.02.25 kws -> 로그인이 완료된 후에 처리
commAPI.afterLogin = function (obj, fn) {
    var outdata = obj.data;
    //debugger;
    // 계좌정보를 설정한다.
    var setAccountList = function (outData) {
        hi5.SHMEM["acclist"] = [];
        var acctjson;
        var acctOutRec = outData.OutRec2 || outData.OutRec1;
        if (acctOutRec) {
            for (var x = 0; x < acctOutRec.length; x++) {
                var obj = acctOutRec[x];
                var acctno = obj.v_accn.Ntrim();
                var acctname = obj.v_accn_name.Ntrim();
                var acct_type = obj.item_sect;
                if (acct_type == "09") acct_type = ITEM_SECT.SPOT; // 2019.08.08 kws -> 임시처리
                var currency = obj.currency;
                var leverage = obj.leverage;
                acctjson = {
                    acctno: acctno,
                    acctname: acctname,
                    type: acct_type,
                    acctflag: null,
                    currency: currency,
                    leverage: leverage
                };
                hi5.SHMEM["acclist"].push(acctjson);
            }

            if (hi5.WTS_MODE == WTS_TYPE.SPA) {
                var forms = hi5.GetAllFormObjData();
                $(".hi5_account").each(function (index, accobj) {
                    if (accobj.id) {
                        var acctId = accobj.id;

                        for (var x = 0; x < forms.length; x++) {
                            var formObj = forms[x].obj;
                            var acctObj = formObj.GetObjData(acctId);
                            if (acctObj && acctjson) {
                                acctObj.setAccount({
                                    acctno: "",
                                    GET: true,
                                    init: true,
                                    login: true
                                });
                            }
                        }
                    }
                });
            }
        }
        // --> [Edit] 수정자:김창하 일시:2020/03/05
        // 수정내용>탭 주문정보 건수표시기능
        if ((hi5.WTS_MODE == WTS_TYPE.SPA || hi5.WTS_MODE == WTS_TYPE.MTS) && hi5_OrdMng) {
            //var _libNames =( hi5.WTS_MODE == WTS_TYPE.SPA ?  ["balance", "activeorder", "stoploss"] :["balance"] );
            var _libNames = ["balance", "activeorder", "stoploss"];

            hi5_OrdMng.setLibContent(ITEM_SECT.SPOT, _libNames);
            hi5_OrdMng.setLibContent(ITEM_SECT.FUT, _libNames);
            hi5_OrdMng.setLibContent(ITEM_SECT.INS, _libNames);
            // if ( hi5.WTS_MODE == WTS_TYPE.SPA ){
            //     if ( hi5.GetSharedMemory("@USER_ID") == "clrnrqkqh@gmail.com" ||  hi5.GetSharedMemory("@USER_ID") == "bashing2@naver.com"){
            //         hi5_SPAPages["100"].screen = "aaw960002";
            //     }
            // }
        }
        // <-- [Edit] 김창하 2020/03/05 
    }

    ws.loginState(true);

    setAccountList(outdata);
    this.setUserInfo(true, outdata.OutRec1);
    /*hi5.SetSharedMemory("@USER_ID", outdata.OutRec1.userid);
    hi5.SetSharedMemory("@FLEVL", outdata.OutRec1.flevl);
    hi5.SetSharedMemory("@SMARTPAY", outdata.OutRec1.smart_pay_yn);
    hi5.SetSharedMemory("@STAKING_FLEVL", outdata.OutRec1.staking_flevl);
    hi5.SetSharedMemory("@SPECIAL_FLEVL", outdata.OutRec1.special_flevl);   // 결함번호 740*/

    var acclist = hi5.SHMEM.acclist;
    var requestAccList = [];
    for (var x = 0; x < acclist.length; x++) {
        requestAccList.push(acclist[x].acctno);
    }
    requestAccList.push(hi5.GetSharedMemory("@USER_ID"));
    if (hi5.WTS_MODE == WTS_TYPE.SPA || hi5.WTS_MODE == WTS_TYPE.MTS) { // 2019.11.25 kws 관리자에서는 주문체결 실시간 등록 안한다.
        commAPI.commRealRegister(true, {
            realtype: ["JUCH"],
            keylist: requestAccList,
            obj: commAPI.OnRealData
        });
    }
    // 2019.08.05 kws -> 사용자별 환경설정 정보 취득 후 이후 단계 진행.
    commAPI.requestUserSetting({
        flag: '1'
    }, function () {
        if (hi5.WTS_MODE == WTS_TYPE.SPA || hi5.WTS_MODE == WTS_TYPE.MTS) {
            //$("#loginClick").html(outdata.OutRec1.userid);
            //SPA_EnvSet({ refresh: true });
            if (fn) fn();
        } else {
            loadMdiInit(null, null, null, outdata);
        }
        $("#hi5_login_div").remove();
    });
    /*if (hi5.WTS_MODE == WTS_TYPE.SPA) {
        $("#loginClick").html(outdata.OutRec1.userid);
        SPA_EnvSet({ refresh: true });
    }
    else {
        loadMdiInit(null,null,null,outdata);
    }
    $("#hi5_login_div").remove();*/
}
// 2019.02.25 kws -> 로그인이 완료된 후에 처리
commAPI.afterLogout = function (obj) {
    var acclist = hi5.SHMEM.acclist;
    var requestAccList = [];
    for (var x = 0; x < acclist.length; x++) {
        requestAccList.push(acclist[x].acctno);
    }
    requestAccList.push(hi5.GetSharedMemory("@USER_ID"));
    commAPI.commRealRegister(false, {
        realtype: ["JUCH"],
        keylist: requestAccList,
        obj: commAPI.OnRealData
    });

    ws.loginState(false);
    ws.forcedClose = true;

    hi5.SHMEM.acclist = [];

    this.setUserInfo(false); // 2019.11.21 kws -> 로그아웃 후 해제
    /*hi5.SetSharedMemory("@USER_ID", "");
    hi5.SetSharedMemory("@PWD", "");
    hi5.SetSharedMemory("@TRADE_PWD", "");
    hi5.SetSharedMemory("@MEDIA_INFO", "");*/

    //commAPI.onopen(ws, { logout: true });

    //SPA_EnvSet({ refresh: true });
}

// 통신연결 완료 메세지
commAPI.onopen = function (objws, option, fn) {
    if (window['@cenbpublicip']) {
        hi5.SetSharedMemory("@IP_ADD", window['@cenbpublicip']);
    }
    if (objws == undefined) {
        objws = ws;
    }

    if (!option) {
        //if (hi5_svrmode != "real") console.log("commAPI.onopen...");
        commAPI.ShowCommStatus("open");
    }

    var socketOption = option;
    var self = commAPI;

    //시세 전용 로그인 - 2019.02.22 kws
    var siseCommMng = {
        input: function () {
            var objCommInput = {
                "InRec1": {}
            };

            // 데이터전문을 구성한다.
            var trcode = "20"; // 시세전용 조회

            // 통신헤더정보
            var commHeaderInfo = {
                trcode: trcode // 트랜코드
            };

            // 데이터 정보
            var dataOption = {
                dataModel: "", // 데이터 전문
                TLG_LNG: 0, // 레코드 길이
                rqid: self.getRQID(), // 조회ID채번
                rqidMng: {
                    parentObj: this,
                    timeout: 10,
                    rqname: "siseonly",
                    trcode: trcode, // 수신응답시간 초과지정
                    OnRpTimeOut: function (option) {
                        self.OnErrorMsg({
                            type: "siseonly",
                            data: option
                        });
                    },
                    OnGetData: function (option) {
                        // 응답 데이터 처리
                        //if (TR_PRCS_RSLT_SCD.SUCCESS == option.commHeader.ret) {
                        if (TR_PRCS_RSLT_SCD.SYSTEMERROR != option.commHeader.err_yn && TR_PRCS_RSLT_SCD.APPERROR != option.commHeader.err_yn) {
                            if (socketOption) {
                                if (socketOption.logout) return;
                            }
                            if (option.socket.options.mode && option.socket.options.mode == "comm") {
                                commAPI.sendHeartBeat();
                                if (typeof window.CENBapplyFunction == "function") {
                                    window.CENBapplyFunction('moduleLoadFinished');
                                    window.CENBapplyFunction('socketConnected');
                                    if (typeof (window.setCenbFirstLoaderProgress) == 'function') {
                                        window.setCenbFirstLoaderProgress("100%", true);
                                    }
                                }
                                return;
                            }
                            commAPI.requestCurrency(option);
                            // 마스터 조회 서비스 호출
                            //var opt = currencyCommMng.input();
                            //commAPI.onServerSend(objws, opt.commHeaderInfo, opt.dataOption);
                        } else {
                            self.OnErrorMsg({
                                type: "siseonly",
                                data: option
                            });
                        }
                        return;
                    }
                }
            };
            // 통신헤더와 데이터 객체를 반환
            return {
                commHeaderInfo: commHeaderInfo,
                dataOption: dataOption
            };
        },
    }

    // 전종목시세 관련 통신객체 정보 구성
    var opt = siseCommMng.input();
    commAPI.onServerSend(objws, opt.commHeaderInfo, opt.dataOption);
}

//commAPI.onmessage = function (data, socket, objws) {
//    debugger;
//}
commAPI.nReconnectCnt = 0;
commAPI.onclose = function (e, socket, objws) {
    //commAPI.ShowCommStatus("close");
    // 큐 데이터 삭제
    //if (hi5_svrmode != "real") {
    //    console.log("commAPI.onclose...");
    // }

    // --> [Edit] 수정자:kim changa 일시:2020/02/04
    // 수정내용> 통신단절시에 토스트 관리 객체를 초기화 한다.
    if (hi5.WTS_MODE == WTS_TYPE.SPA) {
        if (g_toastData.length)
            g_toastData.remove(0, -1);
    }
    // <-- [Edit] kim changa 2020/02/04

    //queue.clear();
    if (objws && objws.forcedClose) {
        console.log('단말 강제 접속 종료!!');
        console.log(e);
        return;
    }
    console.log("서버 접속 종료다. commAPI.onclose...");
    console.log(e);

    //if (typeof window.CENBapplyFunction == "function") {
    //    window.CENBapplyFunction('moduleLoadFinished');
    //}

    // 자동 재 접속을 시도한다.
    commAPI.OnSocketClose(objws); // 2019.03.07 kws -> 끊어졌을때는 무조건 첫페이지로...
    //alert("Communication with the server has been disconnected.");
}

// 소켓 단절이벤트를 처리한다.
commAPI.OnSocketClose = function (socket) {
    var reconnect = function (socket) {
        var _pbMng = socket.options.pbMng._pbKeyMap,
            pbMng = [];

        for (var key in _pbMng) {
            var pid = key.slice(0, 4);
            var code = key.substr(4);
            var objCtls = _pbMng[key].objCtls;
            pbMng.push({
                pid: pid,
                code: code,
                objCtls: objCtls
            });
        }

        if (pbMng.length == 0) {
            pbMng = socket.options.arPBMng;
        }
        var token = socket.tokenData(),
            option = {
                relogin: true,
                viewOnly: false,
                tokenData: token,
                arPBMng: pbMng,
            };

        // 소켓정보를 클리어 한다.
        socket.clear();

        var id = setInterval(function () {
            commAPI.nReconnectCnt++;
            var nState = socket.readyState();
            //WebSocket.CONNECTING   0	연결이 수립되지 않은 상태입니다.
            //WebSocket.OPEN	     1	연결이 수립되어 데이터가 오고갈 수 있는 상태입니다.
            //WebSocket.CLOSING	     2	연결이 닫히는 중 입니다.
            //WebSocket.CLOSED	     3	연결이 종료되었거나, 연결에 실패한 경우입니다.
            if (nState == 3 || nState == 0) {
                clearInterval(id);
                // 재 접속을 시도한다.
                //commAPI.hi5Login(option);
                commAPI.serverConnect(option);
            }
        }, 1000); // 1sec 마다 통신 상태를 체크한다.
    };

    if (hi5.WTS_MODE == WTS_TYPE.MTS) { // 모바일환경 특성상 자동 재접속 처리가 필요하다.
        if (commAPI.nReconnectCnt < 10) {
            reconnect(socket);
        } else {
            hi5.MessageBox($hi5_regional.text.disconnect, $hi5_regional.title.notice, 3, function () {
                location.reload();
            });
        }
    } else {
        if (typeof window.CENBapplyFunction == "function") { //소켓 끊겼을때 홈페이지쪽으로 알려줘서 5분후에 쿠키 삭제하는 기능. 2019.03.22 kws
            window.CENBapplyFunction('socketTerminated');
            window.frontRouterChange('Home');
        }

        hi5.MessageBox($hi5_regional.text.disconnect, $hi5_regional.title.notice, 3, function () {
            location.reload();
        });
    }
    //    }
    //});
}

commAPI.onerror = function (e, socket, objws) {
    console.log("commAPI.onerror...");
    if (typeof window.CENBapplyFunction == "function") { //소켓 끊겼을때 홈페이지쪽으로 알려줘서 5분후에 쿠키 삭제하는 기능. 2019.03.22 kws
        window.CENBapplyFunction('socketTerminated');
    }
    //hi5.MessageBox("Websocket disconnected...", $hi5_regional.title.notice, 0);
}

// 로그인 함수
commAPI.hi5Login = function (option, cb) {
    // 접속된 이후에 로그인 오류(입력값 오류)가 발생된 경우에 재 로그인 하는 기능
    if (ws && !ws.connect()) {
        // 2019.02.25 로그인 시점에 websocket이 끊어진 상태인지 체크

    }

    if (option.id && option.pwd /* && option.tradepwd*/ ) {
        hi5.SetSharedMemory("@USER_ID", option.id);
        hi5.SetSharedMemory("@PWD", option.pwd);
        //hi5.SetSharedMemory("@TRADE_PWD", option.tradepwd);

        var info = hi5.GetMediaInfo();
        var media_info = info.osinfo + "/" + info.browserinfo + "/" + info.versioninfo;

        hi5.SetSharedMemory("@MEDIA_INFO", media_info.substring(0, 30));
    }

    commAPI.requestLogin();
}

commAPI.serverConnect = function (option) {
    //debugger;
    //WebSocket.CONNECTING   0	연결이 수립되지 않은 상태입니다.
    //WebSocket.OPEN	     1	연결이 수립되어 데이터가 오고갈 수 있는 상태입니다.
    //WebSocket.CLOSING	     2	연결이 닫히는 중 입니다.
    //WebSocket.CLOSED	     3	연결이 종료되었거나, 연결에 실패한 경우입니다.
    if (ws && ws.readyState() == 1) {
        if (hi5_svrmode != "real") console.log("commAPI.serverConnect conneted...");
        return;
    }

    if (!option || (option && option.mode && option.mode != "comm")) {
        if (queue == null)
            queue = new Queue; //create a new queue instance

        this.SetRealTimerProc(true, 500);
        hi5_startWorker();
    }

    var loc = window.location;
    //var url = "ws://neoframe.dyndns.org:17798";  // "ws://echo.websocket.org/"
    //var wp = "ws:",
    //    host = "neoframe.dyndns.org",
    //    port = "17800";
    //

    var wp = "ws:",
        host, href;
    //host = hi5.exchangeObj["IP_ADDR"];
    href = $(location).attr('hostname');

    // ip주소인지 체크
    var expUrl = /^(1|2)?\d?\d([.](1|2)?\d?\d){3}$/;
    // if (href == "localhost" || expUrl.test(href)) {
    //     host = hi5.exchangeObj.host.ip;
    // } else {
    //     host = hi5.exchangeObj.host.name;
    //     if (hi5_dev_mode == "dev") {
    //         host = hi5.exchangeObj.host.ip;
    //     }
    // }
    host = "106.10.55.191";

    // 2019.12.20 kws
    // 개발기에서 테스트 및 운영기로 접속하는 옵션임.
    // 절대로 테스트기나 운영기로 배포되어서는 안됨!!!
    ///*   hi5ws
    if (hi5_dev_mode == "dev") {
        //debugger; 
        var hi5ws = $.urlParam('hi5ws');
        if (hi5ws) {
            if (hi5ws == "test" || hi5ws == "admin_test") host = "101.101.161.93";
            else if (hi5ws == "real") host = "www.bispex.com";
            if (hi5ws == "test") {
                document.title = "BISPEX - " + hi5ws;
            } else if (hi5ws == "admin_test") {
                document.title += "- " + hi5ws;
            }
        }
    }
    //*/
    if (!host) {
        hi5.MessageBox("No connection info!", $hi5_regional.title.notice, 0);
        return;
    }
    // port = hi5.exchangeObj.port.ws;
    // if (loc.protocol === "https:") {
    //     wp = "wss:";
    //     port = hi5.exchangeObj.port.wss;
    // }
    port = 4999;
    url = wp + "//" + host + ":" + port;

    if (hi5_WAS == "use") {
        url = "ws://" + hi5.exchangeObj.was_ip.ip + ":" + hi5.exchangeObj.was_ip.port;
    }

    debugger;
    var config = {
        objAPI: commAPI,
        url: url
    };

    // 2개 객체를 병합시킨다.
    if (option)
        $.extend(true, config, option);

    ws = webSocket(config);
    ws.forcedClose = false;
    //ws = webSocket({ objAPI: commAPI, url: url, tokenData: token });
}

// 통신 재 접속 상태를 표시하는 함수
commAPI.OnWaitScreen = function (bStart, msg) {
    //if (bStart) {
    //    if ( $("#hi5_reconnectDiv").length <= 0 ){
    //        var wholeDiv = document.createElement('div');
    //        wholeDiv.id = "hi5_reconnectDiv";
    //
    //        var spinnerDiv = document.createElement('div');
    //        spinnerDiv.className = "hi5_spinnerDiv";
    //        wholeDiv.appendChild(spinnerDiv);
    //
    //        //var spinner = document.createElement('i');
    //        //spinner.className = "fa fa-spinner fa-spin";
    //
    //        var spinner = document.createElement('div');
    //        //spinner.style.width = "100%";
    //        //spinner.style.height = "100%";
    //        //spinner.style.background = "url(images/mdi/spinner.gif)";
    //        spinnerDiv.appendChild(spinner);
    //
    //        if (msg) {
    //            var t = document.createTextNode(msg);
    //            spinnerDiv.appendChild(t);
    //        }
    //        $("body").prepend(wholeDiv);
    //    }
    //}
    //else {
    //    $("#hi5_reconnectDiv").remove();
    //}
}

commAPI.ShowCommStatus = function (status) {
    var commStatusDiv = document.getElementById('hi5_commstatus');
    if (!commStatusDiv) return;

    commStatusDiv.innerHTML = "";
    var text;
    if (status == "open") {
        text = "<span class='connectOn' title='" + $hi5_regional.tooltip.connecton + "' style='width:20px;height:20px;float:right;display: block;'></span>";
        text += "<span class='connectOff' title='" + $hi5_regional.tooltip.connectoff + "' style='width:20px;height:20px;float:right;display: none;'></span>";
    } else if (status == "close") {
        text = "<span class='connectOn' title='" + $hi5_regional.tooltip.connecton + "' style='width:20px;height:20px;float:right;display: none;'></span>";
        text += "<span class='connectOff' title='" + $hi5_regional.tooltip.connectoff + "' style='width:20px;height:20px;float:right;display: block'></span>";
    }

    commStatusDiv.innerHTML = text;
}

//주문구분코드 1:주문 2:정정 3:취소 4:강제취소(일정기간이 지난 주문)
var ORDER_FLAG = {
    "1": {
        ko: "주문",
        en: "Order",
        jp: "注文"
    },
    "2": {
        ko: "정정",
        en: "Modified",
        jp: "訂正"
    },
    "3": {
        ko: "취소",
        en: "Cancel",
        jp: "キャンセル"
    },
    "4": {
        ko: "강제취소",
        en: "Forced Cancel",
        jp: "強制キャンセル"
    },
    title: function (o, l) {
        return o[l];
    }
};

//체결구분코드 1:확인 2:체결
var CNTG_FLAG = {
    "1": {
        ko: "확인",
        en: "Confirm",
        jp: "確認"
    },
    "2": {
        ko: "체결",
        en: "Conclusion",
        jp: "締結"
    },
    "reject": {
        ko: "거부",
        en: "Reject",
        jp: "拒否"
    },
    title: function (o, l) {
        return o[l];
    }
};

// 체결통보에서 주문타입을 취득한다.
function GetJuChe_Type(pbRec, bText) {
    var type = Number(pbRec.gubn);
    var option = {
        type: 0,
        exchange: false, // 거래소주문유무
        error: false,
        Receipt: false, // 접수
        confirm: false, // 확인
        conclusion: false, // 체결
        cancel: false, // 취소확인
        title: ""
    }
    switch (type) {
        case 1100:
            option.Receipt = true;
            break; //신규주문접수(서버)
        case 1110:
            option.Receipt = true;
            break; //스탑주문접소(서버)
        case 1200:
            option.Receipt = true;
            break; //정정접수(서버)
        case 1300:
            option.Receipt = true;
            break; //취소접수(서버)
        case 2220:
            option.confirm = true;
            option.exchange = true;
            break; //정정확인(거래소)
        case 2320:
            option.confirm = true;
            option.exchange = true;
            option.cancel = true;
            break; //취소확인(거래소)
        case 2110:
            option.conclusion = true;
            option.exchange = true;
            break; //신규체결(거래소)
        case 2210:
            option.conclusion = true;
            option.exchange = true;
            break; //정정체결(거래소)
        default:
            if (type[3] == "1") { // 거부주문 발생
                option.error = true;
                if (bText) {
                    var salegbn = "";
                    if (pbRec.salegbn != "")
                        salegbn = (pbRec.salegbn == "1" ? "2" : "1").SellBuy("codetext"); // 매도/매수명;
                    option.title = salegbn + ORDER_FLAG.title("1", local_lang) + "(" + pbRec.reject + ")";
                    return option;
                }
                return 0;
            }
            break;
    }

    if (bText) {
        var salegbn = "";
        if (pbRec.salegbn != "")
            salegbn = (pbRec.salegbn == "1" ? "2" : "1").SellBuy("codetext"); // 매도/매수명;
        option.title = salegbn + ORDER_FLAG.title(ORDER_FLAG[type.toString()], local_lang);
    }
    option.type = type;
    return option;
}

function hi5_account_check(obj, fn) {
    var accno = obj.accno;
    var pwd = obj.pwd;

    var acclist = hi5.SHMEM["acclist"];
    var accCheck = false;
    var accIndex = 0;
    for (var x = 0; x < acclist.length; x++) {
        if (acclist[x].acctno == accno) {
            accCheck = true;
            accIndex = x;
            break;
        }
    }

    if (!accCheck) {
        if (fn) fn(false);
        return;
    }

    var objTran = {
        //fn : onRpData,
        trcode: "CXB1000Q01",
        input: {
            "InRec1": {
                ACCTNO: accno,
                ACCTNO_PWD: pwd
            }
        }
    };

    commAPI.commTranRQ(objTran, function (objRpData) {
        //console.log(objRpData);
        if (objRpData.status == "success") {
            acclist[accIndex].pw_verify = true;
            if (obj.save) {
                acclist[accIndex].pw_value = pwd;
            } else
                acclist[accIndex].pw_value = "";

            if (fn) fn(true, objRpData.msgHeader);
        } else if (objRpData.status == "error") {
            //alert(objRpData.msgHeader.MSG_CTNS);
            acclist[accIndex].pw_verify = false;
            acclist[accIndex].pw_value = "";
            if (fn) fn(false, objRpData.msgHeader);
        } else {
            //alert("서비스 응답 수신초과");
            acclist[accIndex].pw_verify = false;
            acclist[accIndex].pw_value = "";
            if (fn) fn(false, objRpData.msgHeader);
        }
    });
}

//실시간 체결, 공지, 뉴스 등 플랫폼에 구분되어 처리되는 함수
var sendTicker = function (strRealType, realObj) {
    //2019.12.20 lee nohan 가격 및 수량 소수점 자릿수 수정
    //결함번호 1178
    function checkDec(value, type, code) {
        if (!value || value == "") {
            return value;
        }
        if (type == 'prc')
            value = hi5.priceF(code, value, true);
        else
            value = hi5.setQtyF(code, value, false, true);

        return value;
    }
    // toast로 표시할 내용들
    // strRealType == "JUCH" 1.접수 2.체결 3.거부 4.Transfer 5.취소
    // strRealType == "GONG" 1.일반공지 2.입고/출고 접수 확인
    var nToastType = 0; // 0:파란색(체크모양) 1: 주황색(느낌표) 2:빨간색(느낌표 3:초록색(알람) 4:보라색(취소) 그외:Normal(느낌표)
    var title; // 표시 제목
    var msg; // 표시 내용
    var nToastTime = 3; // 토스트 표시 유지 시간(기본 3초)
    var bRefreshBalance = false; // Trade Balance 잔고 재조회 요청 여부.
    var timeObj; // utc 시간값
    var toastTime; // toast 표시 시간
    if (strRealType == "JUCH") {
        var record = realObj.data; // 배열데이터
        if (record.utctime) {
            timeObj = hi5.getUTCLocalTime(record.utctime);
            if (timeObj.local)
                toastTime = timeObj.local.h + ":" + timeObj.local.m + ":" + timeObj.local.s;
            else {
                function addZero(n) {
                    return n > 9 ? "" + n : "0" + n;
                }
                //console.log(record);
                var newDate = new Date();
                toastTime = addZero(newDate.getHours()) + ":" + addZero(newDate.getMinutes()) + ":" + addZero(newDate.getSeconds());
            }
        }

        var dataJson = GetJuChe_Type(record);
        bRefreshBalance = true;
        ///////// 1차 추가개발 ////////////
        var ord_sect = record.ord_sect;
        if (ord_sect == "1")
            if (record.gubn != "1100") {
                ord_sect = "0";
            }

        if (ord_sect == "1" || ord_sect == "P") { // "1": 마진콜 청산 "P":디레버리지
            if (ord_sect == "P" && !dataJson.conclusion) return; // 2019.11.20 kws 결함번호 872

            // --> [Edit] 수정자:kim changa 일시:2019/12/16
            // 수정내용>결함화면 1156 대응(강제청산시 알림 수정) 
            var symbol = record.symbol,
                codeObj = hi5.GetCodeInfo(symbol),
                price = record.conclsn_prc; // 체결가격
            var memeGb = record.salegbn; // 1:매도 2:매수
            var memeName = memeGb.SellBuy("codetext");

            if (ord_sect == "1") {
                title = $hi5_regional.toastmsg.liquidationTit;
                msg = $hi5_regional.toastmsg.liquidationMsg;
                //price = record.af_margin_price; // 청산가격
                // --> [Edit] 수정자:lee nohan 일시:2019/12/23
                // 수정내용>결함화면 1186 대응(강제청산시 가격 매수, 매도 시 호가단위에 맞게 변경) 
                // 청산가격 호가단위에 맞게 매수면 내림 매도면 올림

                // --> [Edit] 수정자:lee nohan 일지:2020/01/09
                // 수정내용>af_mmgb는 잔고에서 사용하는 매매구분이고, 여기서는 slbygbn값을 보고 사용해야한다.
                //price = hi5.getTickValue(symbol, record.margin_price, (record.af_mmgb == "1") ? true : false ); // 청산발동가격
                price = hi5.getTickValue(symbol, record.margin_price, (record.salegbn == "1") ? true : false); // 청산발동가격
                // 일단 이부분도 디레버리지 쪽이랑 동일하게 맞춰놓는다.
                memeGb = record.af_mmgb; // 1:매도 2:매수
                memeName = memeGb.SellBuy("codetext");
            } else {
                title = $hi5_regional.toastmsg.dleverageTit;
                msg = $hi5_regional.toastmsg.dleverageMsg;
                // 파산가격으로 가격 표시
                // --> [Edit] 수정자:lee nohan 일시:2020/01/02
                // 수정내용>결함화면 1230 대응(디레버리지일 경우 conclsn_prc, conclsn_qty, slbygbn 값을 사용해야함) 
                //price = hi5.getTickValue(symbol, record.af_broken_price, (record.af_mmgb == "1") ? true : false); // 파산가격
                price = hi5.getTickValue(symbol, record.conclsn_prc, (record.salegbn == "1") ? true : false); // 파산가격

                memeGb = record.af_mmgb; // 1:매도 2:매수
                memeName = memeGb.SellBuy("codetext");
            }

            var qty = record.conclsn_qty; // 수량
            qty = checkDec(qty, 'qty', symbol);

            // var memeGb = record.salegbn;    // 1:매도 2:매수
            // var memeName = memeGb.SellBuy("codetext");

            var prc = putThousandsSeparators(price.toFixed(codeObj.prc_danwi));
            //prc = checkDec(prc, 'prc', symbol);
            // <-- [Edit] kim changa 2019/12/16

            msg = msg.format({
                qty: qty,
                code: codeObj.code_only,
                meme: memeName,
                prc: prc
            });
            var toastObj = {
                type: 2,
                text: msg,
                title: title,
                time: toastTime
            };
            hi5.showToast(toastObj);
            return;
        }

        if (record.svc == "TRAN" || record.svc == "MAVT") { // transfer시
            // (결함화면 1463) 수정 ( 펀딩지급인경우 토스트 표시 무시)
            if (record.svc == "TRAN" && record.ord_sect == "F") {
                return;
            }

            title = $hi5_regional.toastmsg.transferTit;
            msg = $hi5_regional.toastmsg.transferMsg;
            var toastObj = {
                type: 3,
                text: msg,
                title: title,
                time: toastTime
            };
            hi5.showToast(toastObj);
            //return;
        }
        if (dataJson.Receipt) { // 접수시
            nToastTime = 2; // 접수는 2초만 보여준다.

            var codeObj = hi5.GetCodeInfo(record.symbol);
            if (codeObj.item_sect == ITEM_SECT.SPOT) {
                msg = $hi5_regional.toastmsg.receiptMsgSpot;
            } else if (codeObj.item_sect == ITEM_SECT.FUT) {
                if (record.acnt_no.substring(0, 2) == ITEM_SECT.INS) { // 보험은 종목이 선물과 동일해서 계좌번호로 비교
                    msg = $hi5_regional.toastmsg.receiptMsgIns;
                } else
                    msg = $hi5_regional.toastmsg.receiptMsgFut;
            } else if (codeObj.item_sect == ITEM_SECT.INS) {
                msg = $hi5_regional.toastmsg.receiptMsgIns;
            }

            var memeGb = record.salegbn; // 1:매도 2:매수
            var memeName = memeGb.SellBuy("codetext");

            var hogaType = record.ord_type; // 1:시장가 2:지정가
            var price = hogaType == "1" ? $hi5_regional.order.marketprice : checkDec(record.conclsn_prc, 'prc', record.symbol);

            var market = codeObj.currency;
            msg = msg.format({
                qty: checkDec(record.conclsn_qty, 'qty', record.symbol),
                code: codeObj.code_only,
                price: price,
                market: market,
                meme: memeName
            });

            if (record.svc == "SL_R" || record.svc == "SLJR" || record.svc == "SLOR") { // 스탑 접수
                title = $hi5_regional.toastmsg.stopReceiptTit;
                bRefreshBalance = false;

                var stls_stgb = record.stgb, // 스탑구분(1:로스컷, 2:이익실현)
                    profit = record.ik_near_prc.atof(), // 익절가
                    losscut = record.lo_near_prc.atof(), // 손절가,
                    bbgb = record.bbgb, // 1:청산(Close On Trigger), 2:신규, 8:주문StopLoss, 9:잔고StopLoss( 잔고포지션 변경)
                    slby_gb = record.salegbn; // 매매구분 (1매도, 2매수)

                var stopType;
                var sign = "",
                    value = "",
                    value1 = "";
                if (profit > 0 && losscut > 0) {
                    value = profit > 0 ? record.ik_near_prc : "-";
                    value1 = losscut > 0 ? record.lo_near_prc : "-";
                }

                if (stls_stgb == '2' && profit > 0) { // 이익실현
                    sign = slby_gb == '2' ? ">=" : "<=";
                    value = profit.toString();

                } else if (stls_stgb == '1' && losscut > 0) { // 로스컷
                    sign = slby_gb == '2' ? "<=" : ">=";
                    value = losscut.toString();
                } else {
                    value = profit > 0 ? profit.toString() : losscut.toString();
                }

                var msg2;
                if (codeObj.item_sect == ITEM_SECT.SPOT) {
                    msg2 = $hi5_regional.toastmsg.stopReceiptMsgSpot;
                } else if (codeObj.item_sect == ITEM_SECT.FUT) {
                    msg2 = $hi5_regional.toastmsg.stopReceiptMsgFut;
                    var triggerTypes = $hi5_comboJson.trigger_type;
                    for (var x = 0; x < triggerTypes.length; x++) {
                        var triggerObj = triggerTypes[x];
                        if (record.trigger_type == Object.keys(triggerObj)[0]) {
                            stopType = triggerObj[record.trigger_type][local_lang];
                            break;
                        }
                    }
                }
                msg2 = msg2.format({
                    stopPrice: value,
                    sign: sign,
                    stopType: stopType
                });
                msg += "<br>" + msg2;
            } else if (record.svc == "FILL") { // 2019.11.28 kws 스탑 발동 시 수정
                title = $hi5_regional.toastmsg.receiptTit;
                if (record.ord_sect == "3") {
                    title = $hi5_regional.toastmsg.stopTriggerTit;
                    if (codeObj.item_sect == ITEM_SECT.SPOT) {
                        msg = $hi5_regional.toastmsg.stopTriggerSpot;
                    } else if (codeObj.item_sect == ITEM_SECT.FUT) {
                        msg = $hi5_regional.toastmsg.stopTriggerFut;
                    }

                    // 매매구분 meme
                    var memeGb = record.salegbn; // 1:매도 2:매수
                    var memeName = memeGb.SellBuy("codetext");

                    // 체결가격 price
                    var price = checkDec(record.conclsn_prc, 'prc', record.symbol); // 체결가격

                    // 체결수량 qty
                    var qty = checkDec(record.conclsn_qty, 'qty', record.symbol);

                    // 마켓 (현물만)
                    var market = codeObj.currency;
                    msg = msg.format({
                        qty: qty,
                        code: codeObj.code_only,
                        price: price,
                        market: market,
                        meme: memeName
                    });
                }
            } else if (record.svc == "SL_D" || record.svc == "SLJD") { // 스탑 취소
                bRefreshBalance = false;
                // --> [Edit] 수정자:kim changa 일시:2019/12/23
                // 수정내용> 결함내용 1181 (스탑주문 취소알림 수정요청)
                title = $hi5_regional.toastmsg.cancelTit; // Stop취소(stopCancelTit)-> 주문취소(cancelTit) 변경
                msg = (codeObj.item_sect == ITEM_SECT.SPOT) ? $hi5_regional.toastmsg.stopCancel_spot_Msg : $hi5_regional.toastmsg.stopCancel_fut_Msg;

                // Stop 취소수량
                var qty = checkDec(record.conclsn_qty, 'qty', record.symbol);
                // Stop 가격
                var st_price = checkDec(record.conclsn_prc, 'prc', record.symbol);
                // 주문유형
                var ord_type = (record.ord_type == "1") ? $hi5_regional.order.marketprice : $hi5_regional.order.limitprice; // 1:시장가 2:지정가

                msg = msg.format({
                    qty: qty,
                    code: record.symbol,
                    market: market,
                    meme: memeName,
                    ord_type: ord_type,
                    price: st_price
                });
                // <-- [Edit] kim changa 2019/12/23

                nToastType = 4;
            } else {
                title = $hi5_regional.toastmsg.receiptTit;
            }

            var toastObj = {
                type: nToastType,
                text: msg,
                title: title,
                time: toastTime
            };
            hi5.showToast(toastObj);
        } else if (dataJson.conclusion) { // 체결시
            title = $hi5_regional.toastmsg.cheTit;
            //if(record.usr_area != ""){  // 스탑 주문 발동
            //    title = $hi5_regional.toastmsg.stopTriggerTit;
            //}
            var codeObj = hi5.GetCodeInfo(record.symbol);
            if (codeObj.item_sect == ITEM_SECT.SPOT) {
                //if(record.usr_area != ""){  // 스탑 주문 발동
                //   msg = $hi5_regional.toastmsg.stopTriggerSpot;
                //}
                //else
                msg = $hi5_regional.toastmsg.cheMsgSpot;
            } else if (codeObj.item_sect == ITEM_SECT.FUT) {
                if (record.acnt_no.substring(0, 2) == ITEM_SECT.INS) { // 보험은 종목이 선물과 동일해서 계좌번호로 비교
                    //title = $hi5_regional.toastmsg.cheTit;
                    //msg = $hi5_regional.toastmsg.cheMsgIns;
                    // 2019.11.27 kws
                    // 결함번호 903번 - 선물과 동일한 형태의 알림으로 처리. 단, 체결시 메시지는 조금 다름.
                    //if(record.usr_area != ""){  // 스탑 주문 발동
                    //    msg = $hi5_regional.toastmsg.stopTriggerFut;
                    //}
                    //else{
                    //title = $hi5_regional.toastmsg.cheTit;
                    msg = $hi5_regional.toastmsg.cheMsgIns;
                    //}
                } else {
                    //if(record.usr_area != ""){  // 스탑 주문 발동
                    //    msg = $hi5_regional.toastmsg.stopTriggerFut;
                    //}
                    //else{
                    //title = $hi5_regional.toastmsg.cheTit;
                    msg = $hi5_regional.toastmsg.cheMsgFut;
                    //}
                }
            } else if (codeObj.item_sect == ITEM_SECT.INS) {
                title = $hi5_regional.toastmsg.cheTit;
                msg = $hi5_regional.toastmsg.cheMsgIns;
            }

            // 매매구분 meme
            var memeGb = record.salegbn; // 1:매도 2:매수
            var memeName = memeGb.SellBuy("codetext");

            // 체결가격 price
            var price = checkDec(record.conclsn_prc, 'prc', record.symbol); // 체결가격

            // 체결수량 qty
            var qty = checkDec(record.conclsn_qty, 'qty', record.symbol);

            // 마켓 (현물만)
            var market = codeObj.currency;
            msg = msg.format({
                qty: qty,
                code: codeObj.code_only,
                price: price,
                market: market,
                meme: memeName
            });

            var toastObj = {
                type: nToastType,
                text: msg,
                title: title,
                time: toastTime
            };
            hi5.showToast(toastObj);
        } else if (dataJson.cancel) { // 취소 확인
            //ord_sect = "3" 스탑주문 취소
            title = $hi5_regional.toastmsg.cancelTit;
            var codeObj = hi5.GetCodeInfo(record.symbol);
            if (codeObj.item_sect == ITEM_SECT.SPOT) {
                msg = $hi5_regional.toastmsg.cancelMsgSpot;
            } else {
                msg = $hi5_regional.toastmsg.cancelMsgFut;
            }

            // 매매구분 meme
            var memeGb = record.salegbn; // 1:매도 2:매수
            var memeName = memeGb.SellBuy("codetext");

            // 체결수량 qty
            var qty = checkDec(record.conclsn_qty, 'qty', record.symbol);

            // 마켓 (현물만)
            var market = codeObj.currency;
            msg = msg.format({
                qty: qty,
                code: codeObj.code_only,
                market: market,
                meme: memeName
            });

            var toastObj = {
                type: 4,
                text: msg,
                title: title,
                time: toastTime
            };
            hi5.showToast(toastObj);
        } else if (dataJson.error) {
            bRefreshBalance = false;
            var errormsg = local_lang == "ko" ? "주문이 거부 되었습니다." : "Order has been rejected.";
            var toastObj = {
                type: 2,
                text: errormsg,
                title: "Order Rejected",
                time: toastTime
            };
            hi5.showToast(toastObj);
        }
    } else if (strRealType == "GONG") {
        nToastType = 3;
        var dataObj = realObj.data[0]; // 배열데이터
        var contentData = dataObj.data;
        var codeObj;
        switch (dataObj.source) {
            case "ydeposit_ok":
            case "ydeposit_hold":
            case "ywithdraw_ok":
            case "ywithdraw_cancel":
            case "ywithdraw_accept":
            case "mento_suik": // 커미션 수령받는 사람에게 들어오는 공지사항
            case "mento_suik_withdrawl": // 커미션 출금되는 사람에게 들어오는 공지사항(토스트 미표시)
                try {
                    contentData = JSON.parse(contentData);
                    codeObj = hi5.GetCodeInfo(contentData.code);
                    bRefreshBalance = true;

                    if (dataObj.source == "ydeposit_ok") { // 입금 완료시
                        title = $hi5_regional.toastmsg.depositTit;
                        msg = $hi5_regional.toastmsg.depositMsg;
                    } else if (dataObj.source == "ydeposit_hold") { // 입금 접수시
                        title = $hi5_regional.toastmsg.depositAcceptTit;
                        msg = $hi5_regional.toastmsg.depositAcceptMsg;
                        bRefreshBalance = false;
                    } else if (dataObj.source == "ywithdraw_ok") { // 출금 완료시
                        title = $hi5_regional.toastmsg.withdrawTit;
                        msg = $hi5_regional.toastmsg.withdrawMsg;
                    } else if (dataObj.source == "ywithdraw_cancel") { // 출금 취소시
                        title = $hi5_regional.toastmsg.withdrawCancelTit;
                        msg = $hi5_regional.toastmsg.withdrawCancelMsg;
                        nToastType = 4; // 보라색
                    } else if (dataObj.source == "ywithdraw_accept") { // 출금 접수시
                        title = $hi5_regional.toastmsg.withdrawAcceptTit;
                        msg = $hi5_regional.toastmsg.withdrawAcceptMsg;
                    } else if (dataObj.source == "mento_suik") { // 커미션 수령받는 사람에게 들어오는 공지사항
                        title = $hi5_regional.toastmsg.referralCommissionTit;
                        msg = $hi5_regional.toastmsg.referralCommissionMsg;
                    } else if (dataObj.source == "mento_suik_withdrawl") { // 커미션 출금되는 사람에게 들어오는 공지사항(토스트 미표시)
                        //title = $hi5_regional.toastmsg.referralCommissionTit;
                        //msg = $hi5_regional.toastmsg.referralCommissionMsg;
                        msg = null;
                    }
                    if (msg)
                        msg = msg.format({
                            qty: contentData.qty,
                            code: codeObj.code_only
                        });

                    // 2019.10.14 kws
                    // 이용가능잔고 실시간 갱신 알림
                    if (bRefreshBalance) {
                        var forms = hi5.GetAllFormObjData();
                        for (var x = 0; x < forms.length; x++) {
                            var formObj = forms[x].obj;
                            if (formObj.onConfigChange) {
                                formObj.onConfigChange({
                                    gong: contentData,
                                    source: dataObj.source
                                }); // 해당 form.onConfigChange 로 신호를 줘서 재조회하도록 한다.
                            }
                        }
                    }
                } catch (e) {
                    msg = hi5.replaceHTMLText(contentData); // 2019.09.26 kws -> 특수기호 포함되서 오는 경우 변환
                }
                break;
            case 'ymargincall':
            case 'ydleverage':
                bRefreshBalance = false;
                break;
            case "Insur.DepositApproved": // 2019.11.18 kws 보험금승인 시 메시지 처리 추가. // 결함번호 830
            case "Insur.Reset": // 2020.04.03 lnh 보험금취소 시 메시지 처리 추가.
                bRefreshBalance = true;

                try {
                    contentData = JSON.parse(contentData);

                    // 2019.10.14 kws
                    // 이용가능잔고 실시간 갱신 알림
                    if (bRefreshBalance) {
                        var forms = hi5.GetAllFormObjData();
                        for (var x = 0; x < forms.length; x++) {
                            var formObj = forms[x].obj;
                            if (formObj.onConfigChange) {
                                formObj.onConfigChange({
                                    gong: contentData,
                                    source: dataObj.source
                                }); // 해당 form.onConfigChange 로 신호를 줘서 재조회하도록 한다.
                            }
                        }
                    }

                    //보험 수령중과 취소시 메세지 구분처리 추가
                    if (dataObj.source == "Insur.DepositApproved") {
                        title = $hi5_regional.toastmsg.refundTit;
                        msg = $hi5_regional.toastmsg.refundMsg;
                        msg = msg.format({
                            qty: contentData.qty
                        });
                    } else if (dataObj.source == "Insur.Reset") {
                        title = $hi5_regional.title.insclear;
                        msg = $hi5_regional.text.insclear;
                    }
                } catch (e) {
                    msg = hi5.replaceHTMLText(contentData); // 2019.09.26 kws -> 특수기호 포함되서 오는 경우 변환
                }
                break;
            default:
                bRefreshBalance = false;
                title = "Notice";
                msg = hi5.replaceHTMLText(contentData); // 2019.09.26 kws -> 특수기호 포함되서 오는 경우 변환
                break;
        }
        if (msg)
            hi5.showToast({
                type: nToastType,
                title: title,
                text: msg
            });
    }

    if (bRefreshBalance) {
        refreshBalance(true);
    }
}

var g_balanceTimerID;
var g_balanceTimerSec = 0;
// Trade 좌측 자산 갱신을 위한 작업
// 실시간 잔고 갱신이 어려워서...잔고 변동에 해당하는 실시간이 오면 타이머를 5초간 걸고 그 후에 조회한다.
function refreshBalance(start) {
    function setBlinkCSS() {
        var $totalBalance = $(".hi5_static.empty2[balance=true]");
        if (!$totalBalance) return;
        g_balanceTimerSec++;
        var $divBal = $totalBalance.children('div').children('div');
        if (g_balanceTimerSec % 2 != 0)
            $divBal.css({
                color: '#3075ee'
            });
        else
            $divBal.css({
                color: ''
            });

        if (g_balanceTimerSec >= 5) { // 5초가 누적이 되면 재조회 날린다. 타이머 클리어.
            $divBal.css({
                color: ''
            });
            g_balanceTimerSec = 0;
            clearInterval(g_balanceTimerID);
            var forms = hi5.GetAllFormObjData();
            for (var x = 0; x < forms.length; x++) {
                var formObj = forms[x].obj;
                if (formObj.onConfigChange) {
                    formObj.onConfigChange({
                        timer: true
                    }); // 해당 form.onConfigChange 로 신호를 줘서 재조회하도록 한다.
                }
            }
        }
    }
    if (hi5.WTS_MODE != WTS_TYPE.SPA) return; // SPA모드일 때만 해당
    g_balanceTimerSec = 0;
    if (g_balanceTimerID) { // 신규 실시간이 들어왔을 때는 타이머를 리셋. 5초를 다시 카운트
        clearInterval(g_balanceTimerID);
        g_balanceTimerSec = -1;
        setBlinkCSS();
    }
    if (start) {
        g_balanceTimerID = setInterval(setBlinkCSS, 1000);
    }
}