//jmcombo.js
(function () {
    'use strict';
    var jmcombo = function () {
        this.class = [];
        this.itemflag = "1";

        //control custom value
        this.ctrltype = "normal";
        this.placeholder = "";
        this.markettype = "1";
        this.jmclabel = "";
        this.marketcatalog = [];
        this.linkinfo = "";
        this.jmcode = "";
        this.jmname = "";
    }

    jmcombo.prototype = {
        propertyLoad: function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_jmcombo"], // 클래스 정보명
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "", disabled: "" }, // HTML Attri 정의하는 정보 설정
                dataCell = "";  // caption

            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            var objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                return ["multi_lang", "placeholder"];
            });

            if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                cls[0] = "hi5_jmcombo_WTS";
            }
            else if (hi5.WTS_MODE == WTS_TYPE.SPA) {
                cls[0] = "hi5_jmcombo_SPA";
            }
            else if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                cls[0] = "hi5_jmcombo_MTS";
            }

            if (cls.length > 1) {
                this.class = cls;
            }

            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);

            if (this.linkinfo != "") {
                this.linkinfo = hi5.getJSONParse(this.linkinfo);
            }

            if (this.markettype == "1") {
                this.marketcatalog = ["STK01", "STK02", "STK05"];
            }
            else if (this.markettype == "2") {
                this.marketcatalog = ["FO24", "FO25"];
            }
            else if (this.markettype == "3") {
                this.marketcatalog = ["STK6"];
            }
            else if (this.markettype == "4") {
                this.marketcatalog = ["UP26", "UP27"];
            }
            else if (this.markettype == "9") {   //crypto currency
                this.marketcatalog = ["BIT90"];
            }

            //매체별로 생성방법이 다름 - 각 extend.js 파일에 정의
            jmcombo_extend.createJmCombo.apply(this, [xmlHolderElement]);

            if (objXML.disabled) {
                this.Disabled(true);
            }
        },

        onInitAfter: function () {
            var obj = this;

            // 화면 로드시 최초 종목 정보 세팅
            if (this.linkinfo.GET) {
                if (this.linkinfo.GET.length > 0) {
                    var objdata = obj.objParentForm.getLastCodeFind();
                    if (objdata != "") {
                        this.setMasterCode({ code: objdata, GET: true, init: true });
                    } else {
                        objdata = this.GetLinkinfoData();
                        if (objdata) {
                            this.setMasterCode({ code: objdata.code || objdata.jmcode || objdata, GET: true, init: true });
                        }
                    }
                }
            }

            if (obj.markettype == "9") {
                if (this.jmcode == "" && this.linkinfo.GET) {
                    this.setMasterCode({ code: hi5.SHMEM.symbol.code, GET: true, init: true });
                }
            }

            jmcombo_extend._bindEvents.apply(this);
        },

        //OnSetEvents: function () {
            //종목 히스토리 리스트, 검색창, 검색리스트 최초 실행시 한번만 body에 생성
        //    if (hi5.WTS_MODE == WTS_TYPE.MDI) {
        //        jmcombo_extend.setEventOnce.apply(this);
        //    }
        //},

        // jmcombo에 연결된 label에 종목명을 세팅한다.
        setJmcLabel: function (jmname, symbol) {
            var obj = this;
            var labelid = obj.jmclabel;
            if (labelid != "") {
                if (!idpattern.test(labelid))
                    labelid = "{{id.}}" + labelid;

                labelid = x2h.getUniqID(labelid, this.objParentForm);

                var labelObj = this.objParentForm.GetObjData(labelid);
                if (labelObj) {
                    labelObj.SetProp("btcaption", { name: jmname, symbol: symbol == undefined ? "" : symbol });
                }
            }
        },

        // 메모리에 조회 종목을 저장하고 모든 jmcombo에 동일 종목코드를 공유
        //jmcombo.prototype.setMasterCode = function (jmcode, jmname, initFlag) {
        setMasterCode: function (option) {
            var obj = this, jmcode = option.code || option.jmcode, jmname = option.name ? option.name : "";

            //////////////////////////////////////
            if(!jmcode){
                obj.jmcode = "";
                obj.jmname = "";
                obj.jmmarket = "";

                var jminfo = { "jmcode": "", "jmname": "", "market": "", "accttype": "" };

                // 연동PUT인 경우만 저장
                if (option.PUT || (obj.linkinfo.PUT != undefined && obj.linkinfo.PUT.length > 0)) {
                    obj.SaveLinkInfoHistory(jminfo);
                }

                if (obj.OnCodeChange && !option.init)
                    obj.OnCodeChange.call(obj, jmcode);
                return true;
            }
            if (jmcode.length > 0) {
                var symbol = "", mktgbcd = "", market = "", accttype = "";
                var bFind = false;
                var mstcodelist = [];
                if (this.markettype == "9") {   //가상화폐
                    //mstcodelist = cryptocode;
                    if (g_masterInfo) {
                        var codelist = Object.keys(g_masterInfo);
                        for (var x = 0; x < codelist.length; x++) {
                            var symbol = codelist[x];
                            var priceObj = g_masterInfo[symbol];
                            var symbolName = priceObj.codename;
                            mstcodelist.push({
                                name: symbolName,
                                code: symbol,
                                symbol: 'CRYPTO',
                                csname: '',
                                mktgbcd: 'X',
                                upcode: symbol,
                                market: priceObj.market,
                                accttype : priceObj.accttype
                            });
                        }
                    }
                    else {
                        mstcodelist = cryptocode;
                    }
                }
                else {
                    mstcodelist = top.mastercode;
                }

                for (var x = 0; x < mstcodelist.length; x++) {
                    if (mstcodelist[x].code == jmcode) {
                        symbol = mstcodelist[x].symbol;
                        mktgbcd = mstcodelist[x].mktgbcd;
                        market = mstcodelist[x].market;
                        accttype = mstcodelist[x].accttype;
                        if (jmname == "" || !jmname) jmname = mstcodelist[x].name;
                        //marketcode = ConvertMarketCode(mstcodelist[x].mktgbcd);
                        bFind = true;
                        break;
                    }
                }

                if (bFind == false) return false;

                //var jminfo = { "code": jmcode, "name": jmname, "symbol": symbol, "mktgbcd": mktgbcd, "marketcode": marketcode };
                var jminfo = { "jmcode": jmcode, "jmname": jmname, "market": market, "accttype": accttype };
                //obj.SetHistoryData(jminfo);

                // 마지막 조회 종목과 동일하면 pass
                if (obj.jmcode == jmcode && !option.init) return false;

                // 선물종목과 현물종목이 바뀔때마다 form.onConfigChange를 호출해서 재조회하도록한다. 2018.12.5 kws
                if (obj.accttype != accttype) {
                    if (obj.objParentForm.onConfigChange)
                        obj.objParentForm.onConfigChange({ 'market': market, 'accttype' : accttype });
                }

                obj.jmcode = jmcode;
                obj.jmname = jmname;
                obj.jmmarket = market;
                obj.accttype = accttype;

                //컨트롤에 정보 표시
                jmcombo_extend.setJmCode.apply(this, [jmcode, jmname]);

                // 연동PUT인 경우만 저장
                if (option.PUT || (obj.linkinfo.PUT != undefined && obj.linkinfo.PUT.length > 0)) {
                    obj.SaveLinkInfoHistory(jminfo);
                }

                if (obj.linkinfo.PUT != undefined) {
                    if (obj.linkinfo.PUT.length > 0) {  //linkinfo_history에 저장
                        if (option.PUT) {
                            // 부모화면으로 적용연동을 개시한다.
                            //this.objParentForm.SetCodeDataLink("JMCOMBO-LINKINFO", jminfo);
                        }
                    }
                }

                if (obj.OnCodeChange && !option.init)
                    obj.OnCodeChange.call(obj, jmcode);
                return true;
            }
            return false;
        },

        // HTML 요소객체 취득
        GetElemnt: function () {
            return this.$html;
        },

        // disabled 됐을때 동작(css disabled 동일)
        Disabled: function (state) {
            if (state == undefined) return;

            var cssstyle = {};
            var $element = this.GetElemnt();
            if (state == true || state == "disabled" || state == "true") {
                //하위 컨트롤들 disable시켜야함
                $("#" + this.id + " input").attr("disabled", true);
                cssstyle = hi5.getCustomStyle(this, "disable");
            }
            else {
                //하위 컨트롤들 enable시켜야함
                $("#" + this.id + " input").attr("disabled", false);
                cssstyle = hi5.getCustomStyle(this, "default");
            }

            if (cssstyle)
                $element.css(cssstyle);
        },

        // 연결정보 함수
        SaveLinkInfoHistory: function (objdata) {
            this.jmcode = objdata.jmcode;
            this.jmname = objdata.jmname;

            hi5.SHMEM["symbol"] = { code: objdata.jmcode, name: objdata.jmname };
        },

        GetLinkinfoData: function () {
            var objdata = hi5.SHMEM["symbol"];
            if (!objdata) {
                this.jmcode = "BTC/" + hi5_baseCurr;
            }
            else {
                this.jmcode = objdata.code;
            }
            if(this.jmcode == "") return hi5.SHMEM["symbol"];
            //this.jmcode = "BTC/" + hi5_baseCurr;

            if (hi5.isEmpty(g_masterInfo)) return;
            try {
                this.jmname = g_masterInfo[this.jmcode].codename || "";
            } catch (e) {
                //debugger;
                console.log(e);
            }
            hi5.SHMEM["symbol"] = { code: this.jmcode, name: this.jmname };

            return hi5.SHMEM["symbol"];
        },

        // 종료직전의 종목을 취득한다.
        OnGetLastLinkInfo: function () {
            return this.jmcode;
        },

        // OnGetLinkInfo 함수 추가 - 2017.06.13 add
        OnGetLinkInfo: function (tagName, objData) {
            if (tagName != "JMCOMBO-LINKINFO") return false;
            var obj = this;

            if (obj.linkinfo.REAL == undefined) return false;
            if (obj.GetProp("disabled") == true) return false;

            // 종목연동으로 들어온 부분
            if (obj.linkinfo.REAL) {
                return obj.setMasterCode({ code: objData.code || objData.jmcode, REAL: true });
            }
            return false;
        },

        // autosave
        AutoSaveCtrl: function () {
            return "";
        },

        /* method */
        /// <member id="GetStyle" kind="method">
        /// <summary>스타일 정보를 취득하는 함수</summary>
        /// <remarks>스타일명으로 모든 스타일을 취득하는 함수 </remarks>
        /// <param name = "style" type="string|object"> 스타일 정보</param>
        /// <returns type="string|object"> 스타일 정보를 반환</returns>
        /// </member>
        GetStyle: function (style) {
            var $element = this.GetElemnt(), val;
            val = $element.css(style);

            return val;
        },

        /// <member id="SetStyle" kind="method">
        /// <summary>스타일 정보를 변경하는 함수</summary>
        /// <remarks>스타일명으로 모든 스타일을 제어하는 함수
        /// 색정보( color, background-Color등 색정보변경시에는 
        /// 1. 컬러 인덱스 사용하는 경우 value 인자값에 {컬러인덱스} 지정
        /// 2. 사용자 색을 지정하는 경우  value 인자값에 RGB(0,0,0) 색 정보를 지정
        /// </remarks>
        /// <param name = "style" type="string|object"> 스타일 정보</param>
        /// <param name = "value" type="string" option="true"> 셀 아이템명</param>
        /// </member>
        SetStyle: function (style, value) {
            var $element = this.GetElemnt();
            typeof (style) === "object" ? $element.css(style) : $element.css(style, value);
            return;
        },

        /// <member id="GetProp" kind="method">
        /// <summary>속성정보를 취득하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 취득 </remarks>
        /// <param name = "propName" type="string|array"> 속성 정보</param>
        /// <returns type="string|array"> 속성정보를 반환</returns>
        /// </member>
        GetProp: function (propName) {
            var $element = this.GetElemnt(), val;

            if (propName == "caption" || propName == "value") {
                if (this.ctrltype == "normal") {
                    val = this.jmcode;
                }
                else {
                    if (propName == "caption") {
                        if (this.class.indexOf("totaltrade2") > -1) {
                            val = $("#" + this.id + " .code_name").html();
                        }
                        else {
                            val = $element[0].getElementsByClassName("jmcombo_input")[0].innerHTML();
                        }
                    }
                    else {
                        val = this.jmcode;
                    }
                }
            }
            else {
                val = $element.attr(propName);
                if (propName == "disabled") {
                    if (val == "disabled") return true;
                    return false;
                }

            }
            return val;
        },

        /// <member id="SetProp" kind="method">
        /// <summary>속성 정보를 변경하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 제어하는 함수</remarks>
        /// <param name = "propName" type="string"> 스타일 정보</param>
        /// <param name = "value" type="string||object"> 셀 아이템명</param>
        /// <example>jmc_1.SetProp(propName,value);
        ///             기본적으로 종목콤보에서 코드를 변경했을 시, string ("BTC/KRW") 로 넘어온다.
        ///             postlinkdata 에서 코드를 받아서 종목콤보에 값을 밀어줄때, 
        ///             특정스크립트를 발생시키지 않으려할때 jmc_1.SetProp("objValue",{code:value}); 형식으로 오브젝트로 넘겨주면 된다
        /// </example>
        /// </member>
        SetProp: function (propName, Value) {
            var $element = this.GetElemnt();

            if (propName == "objValue") {
                this.setMasterCode({ code: Value, PUT: true, init: true });

                if (this.OnCodeChange)
                    this.OnCodeChange.call(this, Value);
            }
            else if (propName == "caption" || propName == "value") {
                //this.setMasterCode({ code: Value, PUT: true });
                //컨트롤에 정보 표시
                if(Value == ""){
                    this.jmcode = "";
                    this.jmmarket = "";
                    this.jmclabel = "";
                }
                jmcombo_extend.setJmCode.apply(this, [Value]);
            }
            else if (propName == "tabindex") {
                $("#" + this.id + " .jmcombo_input").attr('tabindex', Value);
            }
            else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
                if (propName == "disabled") {
                    this.Disabled(Value);
                }
            }
        },

        /// <member id="SetFocus" kind="method">
        /// <summary>해당 컨트롤 focus 주기</summary>
        /// <remarks>해당 컨트롤 focus 주기</remarks>
        /// </member>
        SetFocus: function () {
            $("#" + this.id + " .jmcombo_input").focus();
        }
    }

    function ConvertMarketCode(marketgubun) {
        var marketgubunjson = {
            'J': 'STK01',
            'Q': 'STK02',
            'M': 'STK04',
            'B': 'STK05',
            'X': 'BIT90'
        };

        var marketcode = marketgubunjson[marketgubun];
        return marketcode;
    }

    /* events */
    /// <member id="OnCodeChange" kind="event" default="true">
    /// <summary>종목 변경시 발생하는 이벤트</summary>
    /// <remarks>종목 변경시 발생하는 이벤트</remarks>
    /// <param name="strCode" type="string"> 종목코드 </param>
    /// <example>jmc_1.OnCodeChange(strCode);
    /// </example>
    /// </member>
    //jmcombo.prototype.OnCodeChange = function (strCode) {
    //    var fn = this.objParentForm.getIsEventName(this.id, "OnCodeChange");
    //   if (fn != null) fn(strCode);
    //}

    /// <member id="OnBtnClick" kind="event">
    /// <summary>종목컨트롤내에 버튼 클릭시 발생되는 이벤트</summary>
    /// <remarks>종목컨트롤내에 버튼 클릭시 발생되는 이벤트
    /// nBtnType: 0-종목검색창, 1-히스토리내역, 2-종목정보 팝업창</remarks>
    /// <param name="nBtnType" type="number">버튼종류</param>
    /// <example>jmc_1.OnBtnClick(nBtnType);
    /// </example>
    /// </member>
    //jmcombo.prototype.OnBtnClick = function (nBtnType) {
    //    var fn = this.objParentForm.getIsEventName(this.id, "OnBtnClick");
    //    if (fn != null) fn(nBtnType);
    //}
    jmcombo.ctlName = "jmcombo";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(jmcombo.ctlName, jmcombo);
    return jmcombo;
}());
