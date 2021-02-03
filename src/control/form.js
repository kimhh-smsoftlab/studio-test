//******************************************************************/
// /
//******************************************************************/
/*! form.js
/*! cb - 10
//******************************************************************/
// 수정자 : Kiwon Sohn
// 수정일자 : 2018/9/13
// 수정내용 : onRealTime 추가 및 timer 등록/해제
/*******************************************************************/
var FORM = "form";
var idpattern = (/{{id.}}/g);
var funcdelimiter = "$$";
var Names = [];

define(function () {
    "use strict";

    var form = function () {

        this.mapCtlList = new JMap();
        this.mapTimerList = null;
        //this.fn_OnTimerChange = null;
        //this.fn_OnFormClose = null;
        this.mapSubForm = new JMap();
        this.objContainer = null;
        this.version = "1";
        //this.ctrllist = [];

        //------- 변수 정의부  ----------------------------
        this.divTag = ""; // SPA모드에서 div tag이름
        this.id = "";
        this.ctlName = "form";
        this.parent_ctlName = "";
        this.script = "";
        this._style = "";

        this.height = "";
        this.autoHeight = "";
        this.windowWidth; // form 원본넓이값
        this.windowHeight; // form 원본높이값

        this.caption = "";
        this.backcolor = 0;
        this.m_sMenuID = "";
        this.m_sScreenID = "";
        this.m_sScreenNm = "";
        this.m_nScreenIndex = 0;

        //this.parent_ctrl_id = "";
        this.orgid = "";
        this.dlgMode = false;
        this.objDlgForm = null;
        this.objPopupForm = null;
        this.objParentForm = null;
        this.parentWindow = null;

        this._taborders = []; //탭오더에 포함된 컨트롤 목록
        this.tabstartindex = 0; //해당 폼 시작 index

        //autosave
        this._autosavelist = {
            'ctrllist': [],
            'globalvars': []
        };

        //comms_info
        this.tran_group = {};
        this.comms_info = {};
        this.bCheJan = false;
        this.bGong = false;
        //real item
        this.realitems = {};
        this.realitem = {};
        this.option = {};

        //this.realctrls.rqname.trcode = [출력컨트롤 목록]
        this.realctrls = {};
        this.waitMng = {};
        this.string_table = {};
        this.mainform = false;
        //this.trDataMng = {};  // 트랜응답 데이터 관리(통신이름키)

        // show message at frame - only in mdi
        this.showstatus = false;
        this.openStatus = false; // 화면Open 상태유무
        this.linkcode = false;

        this.$loading = null; // 화면로딩 이미지

        this._realMng = null;
    }

    form.prototype = {
        /*
            // ctrl default style properties
            getDefaultStyle: function (props) {
                var that = self;
                var styleJSON = {
                    "width": "100%",
                };

                $.each( styleJSON, function(key, value){
                    if (props[key] === undefined) {
                        props[key] = value;
                    }
                })
                return props;
            },
        */
        load_DlgHTMLDom: function (xhr, options) {
            var xmlDoc = xhr.responseXML;
            if (xmlDoc) {
                var strHTML = "<div> </div>",
                    htmlDom = x2h.createHTMLDOM(strHTML);

                var head = document.getElementsByTagName('head')[0];

                // ScreenInfo
                var scrXMLInfoNode = xmlDoc.getElementsByTagName("scrinfo")[0];

                // Form info
                var xmlFormDoc = xmlDoc.getElementsByTagName(FORM)[0];
                var htmlNode = htmlDom.getElementsByTagName("div")[0];

                this.xmlParser(xmlFormDoc, htmlNode, scrXMLInfoNode);

                var dlgContainer;
                var topForm;
                if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                    dlgContainer = this.GetDialogContainer(htmlNode, options);
                    topForm = $("#hi5_content");
                } else {
                    dlgContainer = this.GetSPADialogContainer(htmlNode, options);
                    if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                        topForm = $("body");
                    } else {
                        topForm = $("body");
                    }
                }
                topForm.append(dlgContainer);

                var formid = this.id,
                    self = this;
                var dlgTop, contentName;
                if (hi5.WTS_MODE != WTS_TYPE.MDI) {
                    dlgTop = $(".hi5_spa_dlg");
                    contentName = "hi5_contents";
                } else {
                    dlgTop = $(".hi5_dlg");
                    contentName = "hi5_content";
                }
                dlgContainer.addEventListener("keyup", function (e) {
                    //jquery_ui.js 파일 정의 
                    if (e.keyCode === $.ui.keyCode.ESCAPE) { // ESC(27)로 Dialog 종료처리
                        self.CloseScreen(""); // 컨트롤 객체 종료후 HTML태그를 종료한다.
                        $(".hi5_dlg_container").remove();

                    }
                });
                dlgTop.attr("hi5_tagname", options.tagName);

                // 화면사이즈 변경
                var windowHeight = parseInt(this.windowHeight) + 25 + 'px';
                if (this.windowHeight == "") { // 다이얼로그에 높이가 지정 안되어있는 경우
                    windowHeight = dlgTop.outerHeight() + 'px';
                }
                if (options.dlgTitle) {
                    windowHeight = parseInt(windowHeight) + 40 + 'px';
                }
                if (hi5.WTS_MODE != WTS_TYPE.MTS || this.windowHeight != "")
                    dlgTop.css({
                        height: windowHeight,
                        width: this.windowWidth
                    });
                else
                    dlgTop.css({
                        width: this.windowWidth
                    });

                if (options.position == "center") {
                    if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                        var docwidth = $("#" + contentName).css('width').replace(/[^-\d\.]/g, '');
                        var docheight = $("#" + contentName).css('height').replace(/[^-\d\.]/g, '');
                        var docleft = parseFloat(docwidth) / 2 - parseFloat(this.windowWidth) / 2;
                        var doctop = parseFloat(docheight) / 2 - parseFloat(windowHeight) / 2;

                        var posoff = {
                            left: docleft,
                            top: doctop
                        }; //$("#"+posid).height();

                        dlgTop.css(posoff);
                    } else {
                        if (hi5.WTS_MODE != WTS_TYPE.MTS) {
                            var winWidth = $(window).width();
                            var winHeight = $(window).height();

                            var docleft = (parseFloat(winWidth) - parseFloat(this.windowWidth)) / 2;
                            var doctop = parseFloat(winHeight) / 2 - parseFloat(windowHeight) / 2;
                            if (parseFloat(windowHeight) > parseFloat(winHeight))
                                doctop = parseFloat(windowHeight) / 2 - parseFloat(winHeight) / 2;
                            var posoff = {
                                left: docleft,
                                top: doctop,
                                height: ''
                            };

                            dlgTop.css(posoff);
                        }
                    }
                } else if (options.position == "bottom") {
                    var posoff = {
                        left: 0,
                        bottom: 0,
                        margin: 0,
                        top: '',
                        width: '100%',
                        height: this.height
                    };
                    dlgTop.css(posoff);
                }

                this.screenLoadInit(xmlDoc, xhr, function () {
                    // 탭오더
                    self.tabOrderInit();

                    // OnFormInit() 이벤트 함수 발생
                    if (self.OnFormInit) {
                        if (options.callback) self.callback = options.callback;
                        self._fireFormInit(options.tagName, options.initdata);
                        //self.OnFormInit.call(self, options.tagName, options.initdata);
                    }

                    $("#hi5_loading").remove();
                });
            }
        },

        load_PopupHTMLDom: function (xhr, options) {
            var xmlDoc = xhr.responseXML;
            if (xmlDoc) {
                var strHTML = "<div> </div>",
                    htmlDom = x2h.createHTMLDOM(strHTML);

                var head = document.getElementsByTagName('head')[0];

                // ScreenInfo
                var scrXMLInfoNode = xmlDoc.getElementsByTagName("scrinfo")[0];

                // Form info
                var xmlFormDoc = xmlDoc.getElementsByTagName(FORM)[0];
                var htmlNode = htmlDom.getElementsByTagName("div")[0];

                this.xmlParser(xmlFormDoc, htmlNode, scrXMLInfoNode);

                var popupContent = this.GetMobilePopupContainer(htmlNode, options);
                $("body").append(popupContent);
                $(popupContent).show('slow');
                //popupContent.innerHTML = "";
                //popupContent.appendChild(htmlNode);
                //$(".popupWindow").css("display", "block");
                var self = this;
                this.screenLoadInit(xmlDoc, xhr, function () {

                    // 탭오더
                    self.tabOrderInit();

                    //$(".loading_img").remove();

                    // OnFormInit() 이벤트 함수 발생
                    if (self.OnFormInit)
                        self._fireFormInit(options.tagName, options.initdata);
                    //self.OnFormInit.call(self, options.tagName, options.initdata);
                    $("#hi5_loading").remove();
                });
            }
        },

        TranInfoLoad: function (xmlDoc, form) {
            var that = this;
            // Script id값을 일괄변경한다.

            // 통신정보
            var tran_group = x2h.xmlGetText(xmlDoc, "tran_group");
            if (tran_group != "") {
                form.tran_group = JSON.parse(tran_group);
            }

            var val = x2h.xmlGetText(xmlDoc, "stringtable");
            if (val != "") form.string_table = JSON.parse(val);

            val = x2h.xmlGetText(xmlDoc, "comms_info");
            if (val != "") {
                form.comms_info = JSON.parse(val);

                // 서비스별 자동갱신용 레코드 및 아이템 항목을 취득하는 기능
                form.comms_info.getRealKeyInfo = function (formobj, rqName, trcode, inout) {
                    var cp = {};
                    var comm_property = "comm_property";
                    if (formobj.comms_info.fid_info) {
                        if (formobj.comms_info.fid_info[rqName]) {
                            cp = formobj.comms_info.fid_info[rqName][0][comm_property];
                            if (cp.realkey) {
                                for (var y = 0; y < cp.realkey.length; y++) {
                                    if (inout == 0 && cp.realkey[y].IO == inout) { // INPUT
                                        return {
                                            "gid": rec,
                                            "fid": cp.realkey[y].fid
                                        };
                                    } else if (inout == 1 && cp.realkey[y].IO == inout) { // OUTPUT
                                        return {
                                            "gid": rec,
                                            "fid": cp.realkey[y].fid
                                        };
                                    }
                                }
                            }
                            return null;
                        }
                    }

                    if (formobj.comms_info.tran_info) {
                        var obj = formobj.comms_info.tran_info[rqName] || [];
                        for (var j = 0; j < obj.length; j++) {
                            var info = Object.keys(obj[j]) || [];
                            for (var x = 0; x < info.length; x++) {
                                if (trcode == info[x]) {
                                    cp = obj[j].comm_property;
                                    if (cp.realkey) {
                                        for (var y = 0; y < cp.realkey.length; y++) {
                                            if (inout == 0 && cp.realkey[y].IO == inout) { // INPUT
                                                var rec = cp.realkey[y].rec == undefined ? "InRec1" : cp.realkey[y].rec;
                                                return {
                                                    "recName": rec,
                                                    "item": cp.realkey[y].fid
                                                };
                                            } else if (inout == 1 && cp.realkey[y].IO == inout) { // OUTPUT
                                                var rec = cp.realkey[y].rec == undefined ? "OutRec1" : cp.realkey[y].rec;
                                                return {
                                                    "recName": rec,
                                                    "item": cp.realkey[y].fid
                                                };
                                            }
                                        }
                                    }
                                    return null;
                                }
                            }
                        }
                    }
                    return null;
                }

                // 통신이름으로 해당 서비스 정보를 취득
                form.comms_info.getTrCodeList = function (formobj, rqName) {
                    var tranInfo = {
                        fidYN: false,
                        trlist: []
                    };

                    if (formobj.comms_info.fid_info) {
                        if (formobj.comms_info.fid_info[rqName]) {
                            tranInfo = formobj.comms_info.fid_info;
                            tranInfo.fidYN = true;
                            return tranInfo;
                        }
                    }

                    if (formobj.comms_info.tran_info) {
                        var obj = formobj.comms_info.tran_info[rqName] || [];
                        for (var j = 0; j < obj.length; j++) {
                            var info = Object.keys(obj[j]) || [];
                            for (var x = 0; x < info.length; x++) {
                                var trcode = info[x];
                                if (trcode == "comm_property") continue;
                                tranInfo.trlist.push(trcode);
                                tranInfo[trcode] = obj[j];
                            }
                        }
                    }
                    return tranInfo;
                };

                // 통신요청시에 서비스 레코드정보 취득
                form.comms_info.getRecordInfo = function (formobj, obj, trcode, inout) {
                    var objRecInfo = {};
                    for (var p in obj) {
                        if (obj.hasOwnProperty(p) && p == trcode) {
                            var objRecName = obj[p];
                            if (!!objRecName && (objRecName === Object || objRecName.constructor === Object)) {
                                for (var rec in objRecName) {
                                    if (objRecName.hasOwnProperty(rec)) {
                                        var r = objRecName[rec];
                                        if (inout == 0 && r.IO == 0) {
                                            objRecInfo[rec] = r.array == 0 ? {} : [];
                                            for (var j = 0, len = r.array > 0 ? r["item"].length : 0; j < len; j++) {
                                                var item = r["item"][j];
                                                // 트랜정보에서 해당 레코드의 Item정보를 취득한다.
                                                var arItemList = formobj.tran_group[trcode][rec].itemlist || [];
                                                var trItem = arItemList.find(function (arItem) {
                                                    if (arItem.itemname == item.name)
                                                        //console.log(arItem);
                                                        return arItem;
                                                });

                                                // 데이터 타입별로 초기값 지정
                                                var val = typeItemdefs[trItem.datatype];
                                                objRecInfo[rec][item.name] = val;
                                            }
                                        } else if (inout == 1 && r.IO == 1) { // OutOut
                                            objRecInfo[rec] = r;
                                            if (r.record != undefined) {
                                                var objCtl, ar = [];
                                                for (var i = 0; i < r.record.length; i++) {
                                                    var id = r.record[i];
                                                    if (!idpattern.test(id)) id = "{{id.}}" + id;
                                                    id = x2h.getUniqID(id, formobj);
                                                    objCtl = formobj.GetObjData(id);
                                                    ar.push(objCtl);
                                                }
                                                objRecInfo[rec]["outctl"] = ar;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return objRecInfo;
                }
            }
        },

        // 컨트롤을 동적으로 로드하는 함수
        LoadMapXML: function (xhr, options) {
            var xmlDoc = xhr.responseXML;
            var self = this;
            //debugger;
            if (xmlDoc) {
                var scrXMLNode = xmlDoc.getElementsByTagName("scrinfo")[0];
                var ctl = x2h.xmlGetAttr(scrXMLNode, "control") || "";
                var deps = [];
                if (ctl.length > 0) {
                    var arList = ctl.split(",");
                    $.each(arList, function (i, ctlName) {
                        //if (hi5_ctlListinfo[ctlName].fn == undefined) {
                        try {
                            if (hi5_controlExpert(ctlName) == undefined) {
                                //if (hi5_hash.record(ctlName).fn == undefined) {
                                //nameKey[key] = ctlName;
                                //paths[ctlName] = "control/" + ctlName;
                                deps.push(ctlName);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });

                    if (deps.length <= 0) {
                        self.load_HTMLDom(xhr, options);
                        return;
                    }

                    hi5.requireJS(deps, function () {
                        var control;
                        for (var i = 0; i < arguments.length; i++) {
                            if (arguments[i]) {
                                control = arguments[i].ctlName;
                                hi5_controlExpert(control, arguments[i]);
                                //hi5_hash.record(control).fn = arguments[i];
                            }
                        }
                        self.load_HTMLDom(xhr, options);
                    });
                } else {
                    self.load_HTMLDom(xhr, options);
                }
            }
        },

        load_HTMLDom: function (xhr, options) {
            var xmlDoc = xhr.responseXML;

            if (xmlDoc) {

                var formobj = this;
                //console.time("load_HTMLDom");
                if (this.dlgMode) {
                    this.load_DlgHTMLDom(xhr, options);
                    this.openStatus = true;
                    // 부모화면이 오픈되기전에 서브화면을 오픈하는 경우
                    this.setHashOpenProc();
                    //console.timeEnd("load_HTMLDom");
                    return;
                } else if (this.popupMode) {
                    this.load_PopupHTMLDom(xhr, options);
                    this.openStatus = true;
                    this.setHashOpenProc();
                    return;
                }

                this._style = "";
                this.mapCtlList.removeAll();
                this.mapSubForm.removeAll();

                var head = document.getElementsByTagName('head')[0];

                // 이전 스크립트 내용을 제거한다.
                var formid = this.id;

                var bSubForm = false;
                var idFormlink = "";
                if (this.objContainer != null) {
                    if (options.tabcontentid != undefined && options.tabcontentid != "")
                        idFormlink = options.tabcontentid;
                    else
                        idFormlink = this.objContainer.id;

                    bSubForm = true;
                }

                if (!bSubForm) {
                    if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                        hi5.RemoveAllObjData();
                        $(".screen-script").remove();
                        $(".screen-style").remove();
                    }
                } else {
                    // 이전 script와 style 정보를 지운다.
                    if (formid != "" && options.itemId == undefined) {
                        $('#' + formid + '_script').remove();
                        $('#' + formid + '_style').remove();
                    }
                }

                var strHTML = "<div> </div>",
                    htmlDom = x2h.createHTMLDOM(strHTML);
                // ScreenInfo
                var scrXMLInfoNode = xmlDoc.getElementsByTagName("scrinfo")[0];
                // Form info
                var xmlFormDoc = xmlDoc.getElementsByTagName(FORM)[0];
                //if (parent) {
                //    var windowSize = x2h.defaultStyle(xmlFormDoc);
                //     this.windowHeight = windowSize.height;
                //    this.windowWidth = windowSize.width;
                // }
                // 속도체크 시간표시
                var objTime = {};
                objTime = formTimeCheck(objTime);

                var htmlNode = htmlDom.getElementsByTagName("div")[0];

                this.xmlParser(xmlFormDoc, htmlNode, scrXMLInfoNode);
                if (objTime) {
                    objTime["text"] = "form:==>" + this.m_sScreenID + "--> load==>"
                }

                formid = this.id;

                var value;
                if (options.sdidiv) {
                    htmlNode.style.height = this.windowHeight;
                    htmlNode.style.width = this.windowWidth;
                    $("#" + options.sdidiv).html("");
                    $("#" + options.sdidiv).append(htmlNode);
                } else if (options.mtsdiv) { // 2019.09.09 kws -> 모바일웹 화면 영역별 loading
                    if (options.pos) { // 2019.09.10 kws -> 해당 컨트롤 밑으로 표시되도록
                        var offsetObj = $("#" + options.pos.id).offset();
                        var posHeight = $("#" + options.pos.id).outerHeight();

                        htmlNode.style.top = (offsetObj.top + posHeight) + "px";
                        htmlNode.style.backgroundColor = '#fff';
                        htmlNode.style.position = "fixed";
                        htmlNode.style.zIndex = "999999";
                        htmlNode.style.width = "100%";
                        htmlNode.style.height = "100%";
                        $("#" + options.mtsdiv).append(htmlNode);

                        this["mtsPopup"] = true;
                        this["popupObj"] = options.pos;
                    } else {
                        htmlNode.style.width = "100%";
                        $("#" + options.mtsdiv).html("");
                        $("#" + options.mtsdiv).append(htmlNode);
                    }
                } else {
                    if (bSubForm) {
                        if (idFormlink !== "") { // formlink 화면은 여기로 로딩
                            var $formlink = $("#" + idFormlink);
                            $formlink.empty();
                            $formlink.append(htmlNode);
                        }
                    } else {
                        var $formlayout = $("#hi5_content");
                        $formlayout.empty();
                        $formlayout.append(htmlNode);
                        //뒤로기기 기능을 위한 history 객체 저장
                        if (window.scrHistory) {
                            if (window.scrHistory.length > 0 && window.scrHistory[window.scrHistory.length - 1].screenid == options.form["m_sScreenID"]) {

                            } else {
                                var historyObj = {
                                    screenid: options.form["m_sScreenID"],
                                    title: options.form["m_sScreenNm"]
                                };
                                //console.log("push");
                                window.scrHistory.push(historyObj);
                                //console.log(window.scrHistory);
                            }
                        }
                    }
                }

                //$(".loading_img").remove();
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                this.screenLoadInit(xmlDoc, xhr, function () {
                    //////////////////////////////////////////////////////////////////////////
                    if (parent.initWindowSize) {
                        if (window.windowInited !== true) {
                            window.windowInited = true;
                            //console.log("inited!!!");
                            parent.initWindowSize(this.m_nScreenIndex, this.windowHeight, this.windowWidth);
                        }
                    }

                    // formlink컨트롤에 페이지 완료를 통보한다.
                    if (this.objContainer != null) {
                        if (this.objContainer.OnScreenLoad)
                            this.objContainer.OnScreenLoad.call(this, this.m_sScreenID);
                    }

                    // 탭오더
                    this.tabOrderInit();

                    // 관심그룹 변경시 처리이벤트

                    /// <member id="OnPortFolioGroupChange" kind="event">
                    /// <summary>관심설정창에서 그룹변경시 발생되는 이벤트 함수</summary>
                    /// <remarks>관심설정창에서 그룹변경 또는 종목변경시 발생되는 이벤트 함수</remarks>
                    /// <example><![CDATA[
                    /// 예) 관심콤보 변경후 통신요청
                    /// form.OnPortFolioGroupChange = function (){
                    ///      //관심콤보 변경후 통신처리 
                    /// }
                    /// ]]></example>
                    /// </member>
                    if (this.OnPortFolioGroupChange) {
                        portFolio.SetRegister(true, this);
                    }

                    // OnFormInit() 이벤트 함수 발생
                    if (hi5.WTS_MODE == WTS_TYPE.SPA) {
                        if (this.OnFormInit) {
                            this._fireFormInit(options.tagName, options.initdata);
                        }
                    } else {
                        this.openStatus = true;
                        if (this.OnFormInit)
                            this._fireFormInit(options.tagName, options.initdata);
                        //this.OnFormInit.call(this, options.tagName, options.initdata);
                    }

                    // 속도체크 시간표시
                    if (objTime) {
                        objTime = formTimeCheck(objTime);
                        this["performance"] = objTime.end;
                    }

                    this.openStatus = true;
                    // 부모화면이 오픈되기전에 서브화면을 오픈하는 경우
                    this.setHashOpenProc();
                    $("#hi5_loading").remove();
                });
            } else {
                throw new Error("Response Error");
            }
        },

        _fireFormInit: function (tagName, initdata) {
            var objTime = {};
            objTime = formTimeCheck(objTime);
            if (objTime) {
                objTime["text"] = this.ctlName + "-->" + this.id + ":OnformInit==>"
            }
            this.OnFormInit.call(this, tagName, initdata);

            if (objTime) {
                objTime = formTimeCheck(objTime);
                this["forminit_time"] = objTime.end;
            }
        },

        // 부모화면이 오픈되기전에 서브 화면을 오픈하는 처리
        setHashOpenProc: function () {
            if (this._hash) {
                var option;
                while (this._hash.length) {
                    option = this._hash.shift();
                    if (option._hash)
                        option.form.OpenSubScreen("", option);
                }
            }
        },

        // 공통기능 처리
        screenLoadInit: function (xmlDoc, xhr, callback) {
            var self = this,
                _html = this._html;

            // Script 오류 메세지 표시
            window.onerror = function (msg, url, lineNo, columnNo, error) {
                var string = msg.toLowerCase();
                var substring = "script error";
                if (string.indexOf(substring) > -1) {
                    //alert('Script Error: See Browser Console for Detail');
                    console.log("hi5studio -> Script Error: See Browser Console for Detail");
                } else {
                    // 디버그창 옵션유무
                    var editor, debcon, body, debexplain, deb_closebtn;
                    var message = [
                        'Message: ' + msg,
                        'Line: ' + lineNo,
                        'Column: ' + columnNo,
                        'URL: ' + url,
                        'Error object: ' + JSON.stringify(error)
                    ].join(' - ');
                    console.log("hi5studio -> Script Error:" + message);
                }
                //var suppressErrorAlert = true;
                // If you return true, then error alerts (like in older versions of Internet Explorer) will be suppressed.
                //return suppressErrorAlert;
                return;
            };

            // 트랜정보 로등;
            this.TranInfoLoad(xmlDoc, this);

            // Script에 컨트롤을 바인딩 시킨다.
            //var ctlscript = this.SetControlBind(xmlDoc, xhr);

            function _SetControlBind(self) {
                // 임시 컨트롤 binding 객체
                self._ctlBind = {};

                // 탭오더 객체 할당
                var tabs = self._taborders.slice(),
                    nFind, ctrlObj, id;
                // AutoSave 객체할당
                var autoSaveList = (self._autosavelist.ctrllist || []).slice();
                var ctrlObjs = self.mapCtlList.getObject();

                for (id in ctrlObjs) {
                    ctrlObj = ctrlObjs[id];
                    // 탭오더 순서에서 컨트롤 삭제
                    if (tabs.length > 0) {
                        nFind = tabs.indexOf(ctrlObj.orgid);
                        if (nFind >= 0) {
                            self._taborders[nFind] = ctrlObj;
                        }
                    }

                    if (autoSaveList.length > 0) {
                        nFind = tabs.indexOf(ctrlObj.orgid);
                        if (nFind >= 0) {
                            self._autosavelist.ctrllist[nFind] = ctrlObj;
                        }
                    }
                    self._ctlBind[ctrlObj.orgid] = ctrlObj;
                }
            };
            _SetControlBind(self, xmlDoc);

            function _scriptBind(xhr, nonce, cbfn) {
                // --> [Edit] 수정자:kim changa 일시:2019/04/08
                // 메모리 관련부분 수정
                if (xhr.script.indexOf("form._ctlBind") < 0) {
                    cbfn();
                } else {
                    let script = '\r\n' + xhr.script + '\r\n';
                    var func = new Function(script);
                    // Script Bind 처리
                    try {
                        // 디버그용 저장
                        if (hi5_DebugLevel && hi5_DebugLevel.script) {
                            hi5_scrJS[xhr.key] = func;
                        }
                        cbfn(func);
                    } catch (e) {
                        console.log(e);
                        console.log(xhr.key);
                    }
                }
                // <-- [Edit] kim changa 2019/04/08            
            }
            _scriptBind(xhr, "hi5", function (jsFn) {
                if (xhr.script.indexOf("form._ctlBind") < 0) {
                    let script = '\r\n' + xhr.script + '\r\n';
                    let ctlInfo = Object.assign({}, self._ctlBind);
                    let ctlList = Object.keys(ctlInfo),
                        arCtl = [];
                    ctlList.forEach(function (key) {
                        arCtl.push(ctlInfo[key]);
                    });
                    //let fn = new Function(ctlList, "debugger;\n" + script);
                    let fn = new Function(ctlList, script);
                    var objRet = fn.apply(null, arCtl) || null;
                } else {
                    var objRet = jsFn.call(self) || null;
                }
                self._ctlBind = {}; // 속도체크시에 코멘트처리(화면에서 사용)

                // 모든컨트롤에 OnInitAfter() 함수 호출
                self.SetAllControlInitAfter();

                // XML에 존재하는 스타일 정보
                var xmlStyle = x2h.xmlGetText(xmlDoc, "style");
                if (xmlStyle) {
                    self._style += "\r\n" + xmlStyle;
                }

                if (self._style != "") {
                    var styleTag = document.createElement('style'),
                        clsName = "screen-style";
                    if (self.dlgMode) {
                        clsName = "hi5_dlg_screen-style";
                    } else if (self.popupMode) {
                        clsName = "hi5_popup_screen-style";
                    }
                    styleTag.id = self.id + "_style";
                    styleTag.className = clsName;
                    styleTag.innerHTML = self._style;

                    self._style = "";
                    // 해당Form 맨 위에 Sytle정보를 추가한다.
                    //$form.prepend(styleTag);
                    _html.insertBefore(styleTag, _html.firstChild);
                }

                // form 화면을 보이기( 속도개선)
                _html.style.visibility = "visible";

                if (callback) {
                    callback.call(self);
                }

            });
        },

        tabOrderInit: function () {
            if (hi5.WTS_MODE == WTS_TYPE.MTS) return; // 2019.10.04 kws 모바일에서는 탭오더가 의미 없다.
            if (this._taborders.length <= 0) return; // 속도개선( taborders 정보가 없으면 무시를 한다)
            var $form = $("#" + this.id);
            // 탭오더
            //if ((this.dlgMode || this.popupMode) || (this.objContainer == null || this.objContainer.objParentForm == null)) {
            $form.off("keydown");
            $form.on("keydown", function (event) {
                var code = event.keyCode || event.which;
                if (code === 9) {
                    event.preventDefault();

                    //console.log("keydown : " + this.id);
                    var obj = hi5.GetObjData(this.id);
                    var currenttarget = event.target; // 현재 active element
                    var gridLen = $(currenttarget).closest('.pq-grid').length; // 2019.06.24 Kiwon Sohn -> grid일때는 무조건 리턴
                    if (gridLen > 0) return;
                    var tabindex = currenttarget.getAttribute("tabindex");

                    // 2019.03.13 kws
                    // calendar는 currenttarget이 내부input에 잡힘.
                    // 
                    if (currenttarget.className == "hasDatepicker") {
                        tabindex = currenttarget.parentElement.getAttribute("tabindex");
                    }
                    if (!tabindex || tabindex < 0) return; // 2019.06.24 Kiwon Sohn -> 김창하 이사님의 지시로 tabindex가 없는데서 tab을 눌렀을 때 진행이 되면 안되게 수정.

                    if (event.shiftKey) {
                        obj.MoveToPreFocus(parseInt(tabindex), null);
                    } else
                        obj.MoveToNextFocus(parseInt(tabindex), null);
                }
            });

            this.MoveToNextFocus(0, null);
            //}
        },


        MoveToPreFocus: function (currenttabindex, prefocusobj) {
            //console.log('currenttabindex - ' + currenttabindex);
            if (this._taborders.length <= 0) return;
            var formobj = this;
            var nextfocusobj = null;

            if (currenttabindex <= 1) { // 해당 target이 index가 설정이 없거나 첫번째 인덱스이면 맨 마지막으로 돌아가야한다.
                var subforms = formobj.mapSubForm.values();
                for (var x = 0; x < subforms.length; x++) {
                    var subform = subforms[x];
                    var subitems = subform.mapCtlList.values();
                    for (var j = subitems.length - 1; j > -1; j--) {
                        if (subitems[j].tabindex > 0) {
                            nextfocusobj = subitems[j];
                            break;
                        }
                    }
                    if (nextfocusobj != null) break;
                }

                if (nextfocusobj == null || currenttabindex <= 0) {
                    var maxtaborder = formobj._taborders.length;
                    currenttabindex = maxtaborder - 1;
                    nextfocusobj = formobj._taborders[currenttabindex];
                }
            } else { // 현재 target의 다음 focus로 이동
                //var tabctrl = formobj._taborders[currenttabindex - formobj.tabstartindex - 2];
                if (!prefocusobj) currenttabindex = currenttabindex - formobj.tabstartindex - 2;
                var tabctrl = formobj._taborders[currenttabindex];
                if (tabctrl == undefined) {
                    var subforms = formobj.mapSubForm.values();
                    for (var x = 0; x < subforms.length; x++) {
                        var subform = subforms[x];
                        var subitems = subform.mapCtlList.values();
                        for (var j = subitems.length - 1; j > -1; j--) {
                            if (subitems[j].tabindex == currenttabindex - 1) {
                                nextfocusobj = subitems[j];
                                break;
                            }
                        }
                        if (nextfocusobj != null) break;
                    }

                    if (nextfocusobj == null) {
                        var maxtaborder = formobj._taborders.length;
                        nextfocusobj = formobj._taborders[maxtaborder - 1];
                        //nextfocusobj = formobj.GetObjData(tabctrl);
                    }
                } else {
                    //nextfocusobj = formobj.GetObjData(tabctrl);
                    nextfocusobj = tabctrl;
                }
            }

            if (nextfocusobj != undefined) {
                //            var bVisible = $("#" + nextfocusobj.id).is(":visible");
                hi5.nextFocusCheck(this, currenttabindex, nextfocusobj, prefocusobj, true);
                //var bVisible = $("#" + nextfocusobj.id).css("visibility");
                //var sDisplay = $("#" + nextfocusobj.id).css("display");
                //var bDisabled = $("#" + nextfocusobj.id).is(":disabled");
                //var sDisabled = $("#" + nextfocusobj.id).attr("disabled");
                //if (sDisplay == "none" || bVisible == false || bVisible == "hidden" || bDisabled == true || sDisabled == "disabled") {
                //    if (nextfocusobj == prefocusobj) return;
                //    this.MoveToPreFocus(currenttabindex - 1, nextfocusobj);
                //}
                //else {
                //    nextfocusobj.SetFocus();
                //    return;
                //}
            }
        },

        MoveToNextFocus: function (currenttabindex, prefocusobj) {

            //console.log('currenttabindex - ' + currenttabindex);
            if (this._taborders.length <= 0) return;
            var formobj = this;

            var nextfocusobj = null;
            if (currenttabindex < 0) { // 해당 target이 index가 설정이 안되어있으면 1로 돌아가야한다.
                if (formobj.tabstartindex > 0) {
                    nextfocusobj = formobj.objContainer.objParentForm._taborders[0];
                    if (!nextfocusobj) {
                        // focus를 없애야함.
                        $("#" + this.id).focus();
                        return;
                    }
                } else {
                    nextfocusobj = formobj._taborders[0];
                }
            } else { // 현재 target의 다음 focus로 이동
                var tabctrl = formobj._taborders[currenttabindex];
                if (tabctrl) {
                    var bFocus = false;
                    var subforms = formobj.mapSubForm.values();
                    for (var x = 0; x < subforms.length; x++) {
                        var subform = subforms[x];
                        var subitems = subform.mapCtlList.values();
                        for (var j = 0; j < subitems.length; j++) {
                            if (subitems[j].tabindex == currenttabindex + 1) {
                                nextfocusobj = subitems[j];
                                bFocus = true;
                                break;
                            }
                        }
                        if (bFocus == true) break;
                    }
                    if (nextfocusobj == null) {
                        nextfocusobj = formobj._taborders[currenttabindex];
                    }

                    if (nextfocusobj == null) {
                        nextfocusobj = formobj._taborders[0];
                    }
                } else {
                    nextfocusobj = formobj._taborders[0];
                    currenttabindex = 0;
                }
            }

            if (nextfocusobj != null) {
                hi5.nextFocusCheck(this, currenttabindex, nextfocusobj, prefocusobj);
                //var bVisible = $("#" + nextfocusobj.id).css("visibility");
                //var sDisplay = $("#" + nextfocusobj.id).css("display");
                //var bDisabled = $("#" + nextfocusobj.id).is(":disabled");
                //var sDisabled = $("#" + nextfocusobj.id).attr("disabled");
                //if (sDisplay == "none" || bVisible == false || bVisible == "hidden" || bDisabled == true || sDisabled == "disabled") {
                //    if (nextfocusobj == prefocusobj) return;
                //    this.MoveToNextFocus(currenttabindex + 1, nextfocusobj);
                //}
                //else {
                //    if (nextfocusobj != null && nextfocusobj.SetFocus) nextfocusobj.SetFocus();
                //    return;
                //}
            }
        },

        // 모든컨트롤에 onInitAfter() 함수 호출
        SetAllControlInitAfter: function () {
            var ctrlObj;
            this._onInitAfter.forEach(function (ctrlObj) {
                var objTime = {};
                objTime = formTimeCheck(objTime);

                if (objTime) {
                    objTime["text"] = ctrlObj.ctlName + "-->" + ctrlObj.id + ":onInitAfter==>"
                }
                // 각 컨트롤에게 autoSave 이벤트 정보등을 등록한다.
                ctrlObj.onInitAfter();

                if (objTime) {
                    objTime = formTimeCheck(objTime);
                    ctrlObj["performance_after"] = objTime.end;
                }
            });
            //this._onInitAfter = [];
            /*
            var ctrlObjs = this.mapCtlList.getObject(), id, ctrlObj;
            for (id in ctrlObjs) {
                ctrlObj = ctrlObjs[id];
                if (ctrlObj && ctrlObj.onInitAfter) {
                    try {
                        var objTime = {};
                        objTime = formTimeCheck(objTime);
                        if (objTime) {
                            objTime["text"] = ctrlObj.ctlName + "-->" + ctrlObj.id + ":onInitAfter==>"
                        }
                        ctrlObj.onInitAfter();
                        if (objTime) {
                            objTime = formTimeCheck(objTime);
                            ctrlObj["performance_after"] = objTime.end;
                        }
                    }
                    catch (event) {
                        console.log(event);
                    }
                }
            }
            */
            if (this._taborders.length <= 0) return;

            var tabstartindex = this.tabstartindex,
                tabidx;
            // 각 컨트롤에게 TabOrder 순서 정의
            this._taborders.forEach(function (ctlObj, idx) {
                if (!hi5.isObject(ctlObj)) return;
                tabidx = tabstartindex + idx + 1;

                ctlObj.tabindex = tabidx;
                ctlObj.SetProp("tabindex", tabidx);
            });
        },


        /// <member id="OnScriptDataChange" kind="event">
        /// <summary>스크립트 잔역변수값이 변경된 경우에 통지 이벤트 함수</summary>
        /// <remarks>통신 입력값 또는 출력값으로 매핑된 변수에 한해서 적용된다.
        ///          통신 응답 데이터시에 사용된다.
        /// </remarks>
        /// <param name = "arg" type="string"> 스크립트 전역변수명 </param>
        /// <param name = "data" type="string|number|object|array|boolean"> 변수명에 해당되는 데이터 </param>
        /// <example><![CDATA[
        ///       form.OnScriptDataChange = function ( arg, data ) {
        ///         if ( arg == "g_strcode"){
        ///             // data 값으로 처리
        ///         }
        ///       }
        /// ]]></example>
        /// <see cref="../Method/dispidCommRequest.htm">CommRequest 함수 참고</see>
        /// </member>

        xmlTabParser: function (rootNode, xmlHolderElement) {

            if (rootNode == null || xmlHolderElement == null) return;
            if (rootNode.nodeType != 1) return; // DocumentType.ELEMENT_NODE = 1

            var tagHtmEle;
            var xmlTagName = x2h.getNodeName(rootNode);
            if (xmlTagName == "control_info") {
                tagHtmEle = xmlHolderElement;
            } else {
                if (xmlTagName == "" || this.getControlInfo(xmlTagName, "name") == "") return;

                tagHtmEle = this.getControlInfo(xmlTagName, "htmltag");
                this.xml2htm(rootNode, xmlTagName, tagHtmEle);
            }
            // childNodes-> children 변경
            // no child node
            if (rootNode.children.length == 0) {
                if (tagHtmEle != xmlHolderElement) xmlHolderElement.appendChild(tagHtmEle);
            } else {
                var childNode;
                for (var i = 0; rootNode.children && i < rootNode.children.length; ++i) {
                    childNode = rootNode.children.item ? rootNode.children.item(i) : rootNode.children[i];

                    if (childNode.nodeType == 1) { // DocumentType.ELEMENT_NODE = 1
                        // Only Control Apply
                        if (this.getControlInfo(x2h.getNodeName(childNode), "name") != "")
                            this.xmlParser(childNode, tagHtmEle);
                    }
                }
                if (tagHtmEle != xmlHolderElement)
                    xmlHolderElement.appendChild(tagHtmEle);
            }
        },

        xmlParser: function (rootNode, xmlHolderElement, xmlScrInfoNode) {
            // debugger;
            if (rootNode == null || xmlHolderElement == null) return;
            if (rootNode.nodeType != 1) return; // DocumentType.ELEMENT_NODE = 1

            // XML TagName
            var xmlTagName = x2h.getNodeName(rootNode);
            if (xmlTagName == "" || this.getControlInfo(xmlTagName, "name") == "") return;

            var htmlTag = this.getControlInfo(xmlTagName, "htmltag");

            var tagHtmEle;
            if (xmlTagName == FORM)
                tagHtmEle = xmlHolderElement;
            else
                tagHtmEle = x2h.createXmlElement(xmlHolderElement, htmlTag);

            // xml To html Change
            this.xml2htm(rootNode, xmlTagName, tagHtmEle, xmlScrInfoNode);
            // childNodes-> children 변경
            // no child node
            if (rootNode.children.length == 0) {
                if (tagHtmEle != xmlHolderElement) xmlHolderElement.appendChild(tagHtmEle);
            } else {
                var childNode;
                for (var i = 0; rootNode.children && i < rootNode.children.length; ++i) {
                    childNode = rootNode.children.item ? rootNode.children.item(i) : rootNode.children[i]; // IE11 오류

                    if (childNode.nodeType == 1) { // DocumentType.ELEMENT_NODE = 1
                        // Only Control Apply
                        if (this.getControlInfo(x2h.getNodeName(childNode), "name") != "")
                            this.xmlParser(childNode, tagHtmEle);
                    }
                }
                if (tagHtmEle != xmlHolderElement)
                    xmlHolderElement.appendChild(tagHtmEle);
            }
        },

        xml2htm: function (node, nodeName, xmlHolderElement, xmlScrInfoNode) {
            var childEleCount = node.childElementCount;
            var nodeChildren = node.childNodes;
            var attributes = node.attributes;

            var textNode = null,
                ctrlObj = null;
            switch (nodeName) {
                case FORM:
                    this._onInitAfter = [];
                    this._onEventBind = [];
                    this._html = xmlHolderElement; //hi5.getById(this.id);//$form = $("#" + this.id);
                    this.$html = $(this._html);
                    this.SetFormProperty(node, xmlHolderElement, xmlScrInfoNode);
                    break;
                default: {
                    //var fn = hi5_ctlListinfo[nodeName].fn;
                    var fn = hi5_controlExpert(nodeName);
                    //var fn = hi5_hash.record(nodeName).fn;
                    if (fn) {
                        try {
                            ctrlObj = new fn;
                        } catch (e) {
                            console.log("!!! error.......");
                            ctrlObj = null;
                        }

                        if (ctrlObj) {
                            ctrlObj._html = xmlHolderElement;
                            ctrlObj.$html = $(ctrlObj._html);

                            // 컨트롤 ID와 컨트롤명을 설정한다.
                            var id = x2h.xmlGetAttr(node, "id");
                            ctrlObj.id = id;
                            ctrlObj.orgid = id;

                            // id값에 {{id.}}값이 없으면 추가를 한다.
                            if (!idpattern.test(id))
                                id = "{{id.}}" + id;

                            ctrlObj.id = x2h.getUniqID(id, this);
                            ctrlObj.formid = this.id;
                            ctrlObj.ctlName = nodeName;

                            // ID Change
                            //x2h.xmlSetAttr(node, "id", ctrlObj.id);
                            ctrlObj.objParentForm = this;

                            this.mapCtlList.put(ctrlObj.id, ctrlObj);
                            //hi5.SetObjData(ctrlObj.id, ctrlObj);

                            if (ctrlObj.onInitAfter) {
                                this._onInitAfter.push(ctrlObj);
                            }
                            if (ctrlObj.onEventBind) {
                                this._onEventBind.push(ctrlObj);;
                            }

                            ctrlObj.tabindex = -1;
                        }
                    } else {
                        console.log("error control loading error!!!=[" + nodeName + "]");
                    }
                }
                //ctrlObj = this.getNewControl(nodeName, node);
                break;
            }

            if (ctrlObj != undefined) {
                // 컨트롤 생성 속도체크
                var objTime = {};
                objTime = formTimeCheck(objTime);
                if (objTime) {
                    objTime["text"] = ctrlObj.ctlName + "-->" + ctrlObj.id + ":==>"
                }

                ctrlObj.propertyLoad(node, nodeName, xmlHolderElement);

                if (objTime) {
                    objTime = formTimeCheck(objTime);
                    ctrlObj["performance"] = objTime.end;
                }

                // hash 저장
                //var key = 'hi5_' + this.m_sScreenID + '_' + ctrlObj.orgid;
                //node[key] = { ctrlObj: ctrlObj, html: xmlHolderElement.outerHTML };
            }
        },

        SetFormProperty: function (node, xmlHolderElement, xmlScrInfoNode) {
            var that = this;
            //$.each(xmlScrInfoNode.attributes, function (index, attribute) {
            //    if (that[attribute.name] !== undefined)
            //        that[attribute.name] = attribute.value;
            //});

            this.m_sScreenID = x2h.xmlGetAttr(xmlScrInfoNode, "scrid");
            this.m_sMenuID = x2h.xmlGetAttr(xmlScrInfoNode, "menuno");
            this.m_sScreenNm = x2h.xmlGetAttr(xmlScrInfoNode, "scrname");
            this.version = x2h.xmlGetAttr(xmlScrInfoNode, "version", this.version); // 화면버전정보
            this.hi5_version = x2h.xmlGetAttr(xmlScrInfoNode, "hi5_version"); // hi5_version 정보 기본은 1
            /*
            var subTitle = "";
            if (hi5.WTS_MODE != WTS_TYPE.SPA) {
                if (g_menuList) {
                    if (g_menuList["menu"]) {
                        for (var i = 0; i < g_menuList["menu"].menu.length; i++) {
                            var rootItem = g_menuList["menu"].menu[i];
                            for (var j = 0; j < rootItem.submenu.length; j++) {
                                var subMenu = rootItem.submenu[j];
                                var noThemeLi;
                                if (subMenu.screenid == this.m_sScreenID) {
                                    if (subMenu.title[local_lang])
                                        subTitle = subMenu.title[local_lang];
                                    else
                                        subTitle = subMenu.title;

                                    this.m_sScreenNm = subTitle;

                                    break;
                                }
                            }
                        }
                    }
                }
            }
            */
            //this.event = x2h.xmlGetAttr(node, "event");

            // Mobile 모드에서는 m_nScreenIndex 는 항상 이다.
            if (hi5_deviceType && hi5_deviceType == "W") {
                if (hi5.GetCurWinindex() != undefined) {
                    if (top.prev_m_index === hi5.GetCurWinindex()) {
                        hi5.addWinindex();
                    }
                    this.m_nScreenIndex = hi5.GetCurWinindex();
                    top.prev_m_index = hi5.GetCurWinindex();
                    //console.log(top.prev_m_index);
                }
            }
            //this.m_nScreenIndex = hi5.GetScreenIndex();
            var cls = ["form"],
                style = ["visibility:hidden;"], // 기본 숨기기 처리],
                attr = {
                    id: "",
                    scrid: this.m_sScreenID
                };

            var id = this.id;
            var objXML = x2h.getXML2Control(node, this, attr, cls, style);
            this.id = id;
            attr["class"] = cls.join(" ");
            if (this.id === "") {
                this.id = x2h.getUniqID("{{id.}}" + objXML.id, this);
            }
            this.orgid = objXML.id;
            attr.id = this.id;
            /* 화면 스토리지 저장 */
            if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                var his = localStorage.history;
                if (his) {
                    his = JSON.parse(his);
                    g_history = his;
                    Names = his.reverse();
                }
                if (this.menuid) {
                    if (this.menuid.length == 4) {
                        if (g_history.length >= 10) {
                            g_history.splice(0, 1);
                        }
                        if (Names.indexOf(this.menuid) != -1) {
                            Names.splice(Names.indexOf(this.menuid), 1);
                        }
                        Names.push(this.menuid);
                        g_history = Names;
                        localStorage.setItem('history', JSON.stringify(g_history.reverse()));

                    }
                }

                // --> [Edit] 수정자:kim changa 일시:2019/02/01
                // 수정내용>  MDI 모드화면 특정화면 최대화 사용금지 ( 0: normal, 1: 최대화 사용금지(resize))
                if (objXML.resize) {
                    this._resieMode = objXML.resize; //  resize관련모드
                }
                // <-- [Edit] kim changa 2019/02/01

            }
            //var props = {}, style, str, classes = {};
            //props = x2h.defaultStyle(node);

            // style 정보를 Object 변경
            /*
                    var props = x2h.defaultStyle(objXML.style, true);
                    this.windowWidth  = props.width;   // form 원본넓이값
                    this.windowHeight = props.height;  // form 원본높이값
                    if (props.height) {
                        this.height = props.height;
                        props.width = "100%";
                            this.height = "auto";
                            props.height = "auto";
                        }
                        else {
                            props.height = "100%";
                        }
                    }
                    style[1] = x2h.getStyleString(props);  // object->string 변환
            */

            //this.showstatus = x2h.xmlGetAttr(node, "showstatus", this.showstatus);
            //this.linkcode = x2h.xmlGetAttr(node, "linkcode", this.linkcode);
            //this.option = x2h.xmlGetAttr(node, "option", this.option);
            //x2h.xmlSetAttr(xmlHolderElement, "id", this.id);
            if (style.length)
                attr["style"] = style.join("");
            $.each(attr, function (name, value) {
                if (value !== "")
                    xmlHolderElement.setAttribute(name, value);
            });

            /////////////////////////// style 변경(속도개선) ///////////////////////////////////////////////
            var props = xmlHolderElement.style;

            this.windowWidth = props.width; // form 원본넓이값
            this.windowHeight = props.height; // form 원본높이값
            if (props.height) {
                this.height = props.height;
                props.width = "100%";
                if (props.position == "relative") {
                    if (hi5.WTS_MODE != WTS_TYPE.SPA || !this.dlgMode) { // SPA모드일 때 dialog form을 relative로 설정하면 height를 form에서 설정한 px로 줘야한다.
                        this.height = "auto";
                        props.height = "auto";
                    }
                } else {
                    props.height = "100%";
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////
            var taborders = objXML.taborders !== undefined ? objXML.taborders : "";
            var autosavelist = objXML.autosavelist !== undefined ? objXML.autosavelist : "";

            // 사용자 CSS정보를 설정한다.
            if (objXML["css"] === "1") {
                this._style += x2h.xmlGetText(node);
            }
            //var attributes = node.attributes;
            //attributes = x2h.removeAttr(node, objAttriRemove);
            //x2h.allSetAttr(attributes, xmlHolderElement);

            //taborders
            //if (taborders.length > 0 && hi5.WTS_MODE != WTS_TYPE.MTS) {
            //    this._taborders = taborders.split(",");
            //    //for (var x = 0; x < taborder.length; x++) {
            //    //    var taborderID = x2h.getUniqID(taborder[x], this);
            //    //    this.taborders.push(taborderID);
            //    //}
            //    if (this.objContainer != null) {
            //        if (this.objContainer.objParentForm != null)
            //            this.tabstartindex = this.objContainer.objParentForm._taborders.length;
            //    }
            //}
            // --> [Edit] 수정자:kim changa 일시:2019/03/28
            // 수정내용> 모바일 에서는 포커스 처리를 무시하기 위해서
            //if (taborders.length > 0 && hi5.WTS_MODE != WTS_TYPE.MTS) {
            if (taborders.length > 0 && hi5_isMoble === false) {
                this._taborders = taborders.split(",");
                if (this.objContainer != null) {
                    if (this.objContainer.objParentForm != null)
                        this.tabstartindex = this.objContainer.objParentForm._taborders.length;
                }
            }
            // <-- [Edit] kim changa 2019/03/28

            //autosavelist
            //this.autosavelist = { 'ctrllist': [], 'globalvars': [] };
            if (autosavelist != "") {
                autosavelist = hi5.getJSONParse(autosavelist);
                if (autosavelist.ctrllist != undefined) {
                    this._autosavelist.ctrllist = autosavelist.ctrllist;
                }

                if (autosavelist.globalvars != undefined) {
                    this._autosavelist.globalvars = autosavelist.globalvars;
                }
            }

            this.mapCtlList.put(this.id, this);
            hi5.SetObjData(this.id, this);
        },

        getControlInfo: function (nodeName, opt) {
            //nodeName = nodeName.toUpperCase();
            //var obj = hi5_ctlListinfo[nodeName];
            var obj = hi5_hash.record(nodeName);
            if (obj) {
                switch (opt) {
                    case "name":
                        return nodeName;
                    case "htmltag":
                        return (obj.tag === undefined) ? "div" : obj.tag;
                    case "fn":
                        return obj.fn;
                    default:
                        break;
                }
            }
            return "";
        },


        //getting saved control properties
        GetObjData: function (ctrl_id) {
            var ctlObj = this.mapCtlList.get(ctrl_id);
            return ctlObj;
        },
        // orgID로 컨트롤 정보 객체를 취득하는 함수
        GetOrgIDObj: function (orgID) {
            var ctlObj = this.mapCtlList.values();
            for (var x = 0; x < ctlObj.length; x++) {
                if (ctlObj[x].orgid == orgID) {
                    return ctlObj[x];
                }
            }
            return null;
        },

        //ctlName이 있을때는 해당 컨트롤만 취득하도록 변경 - 2018.09.28 kiwon34
        GetAllObjData: function (ctlName) {
            var ctlObj = this.mapCtlList.values();
            if (ctlName) {
                var newctlObj = [];
                for (var x = 0; x < ctlObj.length; x++) {
                    if (ctlObj[x].ctlName == ctlName) {
                        newctlObj.push(ctlObj[x]);
                    }
                }
                ctlObj = newctlObj;
            }
            return ctlObj;
        },

        // FormInfo 초기화
        SetFormInfoInit: function (bLastClose) {
            if (!this.openStatus) return;

            this.openStatus = false;
            // REAL 정보 초기화
            if (this.bCheJan) this.RealSBC(null, true);

            // 상태표시 제거 
            if (this.$loading) {
                this.$loading.remove();
            }

            this._taborders = [];
            //this.trDataMng = {};

            // 관심그룹 변경시 처리이벤트
            if (this.OnPortFolioGroupChange) {
                portFolio.SetRegister(false, this);
            }

            // timer정보 초기화
            if (this.mapTimerList && this.mapTimerList.size() > 0) {

                var objs = this.mapTimerList.getObject();
                var objTimer, key;
                for (key in objs) {
                    objTimer = objs[key];
                    clearInterval(objTimer);
                }
                this.mapTimerList.removeAll();
            }

            // OnFormClose()이벤트
            if (this.OnFormClose)
                this.OnFormClose.call(this);


            //autosave 저장
            if (this.m_sScreenID != "") {
                if (this._autosavelist.ctrllist != undefined) {
                    var ctrllist = this._autosavelist.ctrllist;

                    var autosavelist = "";
                    var globalvars = "";
                    for (var x = 0; x < ctrllist.length; x++) {
                        //var new_id = "";
                        //if (!idpattern.test(ctrllist[x])) new_id = "{{id.}}" + ctrllist[x];
                        //new_id = x2h.getUniqID(new_id, this);
                        var ctrl = ctrllist[x];
                        //var ctrl = this.mapCtlList.get(new_id);
                        if (ctrl || !ctrl.AutoSaveCtrl()) continue;
                        continue;
                        // autosave 저장은 보류
                        var value = ctrl.AutoSaveCtrl().toString();

                        if (value != "") {
                            //autosavelist += ctrllist[x] + ":" + value + ",";
                            autosavelist += ctrl.id + ":" + value + ",";
                        }
                    }

                    if (autosavelist != "") {
                        hi5.DeleteCookie(this.m_sScreenID);
                        hi5.SetCookie(this.m_sScreenID, autosavelist);
                    }
                }
                //if (this.autosavelist.globalvars != undefined) {
                //}
            }
            /////
            var ctrls = this.mapCtlList.keys(),
                codeLast = "";
            for (var x = 0; x < ctrls.length; x++) {
                var ctrl = ctrls[x];
                var ctrlObj = this.GetObjData(ctrl);
                // 종료직전 마지막코드를 반환
                if (bLastClose && codeLast == "" && ctrlObj.OnGetLastLinkInfo) {
                    codeLast = ctrlObj.OnGetLastLinkInfo();
                }

                if (ctrlObj.realitem && ctrlObj.realkeys) {
                    if (ctrlObj.realitem.length > 0 && ctrlObj.realkeys.length > 0) {
                        var tempobj = {
                            'realtype': ctrlObj.realitem,
                            'keylist': ctrlObj.realkeys,
                            'obj': ctrlObj
                        }
                        this.RealSBC(tempobj);
                    }
                }
                //debugger;
                // 모든컨트롤을 파과하는 함수 호출
                //if (ctrlObj != this) {
                if (ctrlObj.onDestroy)
                    ctrlObj.onDestroy();
                //    } else {
                //        for (var key in ctrlObj) {
                //            delete this[key];
                //        }
                //    }
                //}
            }
            this.SetAllObjClear();

            /* form realtime 타이머 해제 */
            //this.realMng = {};
            if (this._realMng) {
                this._realMng = null;
                if (Object.keys(this.realitem).length > 0) {
                    commAPI.SetRealTimer(false, this);
                }
            }
            // CSP 정책( 스크립트 제거)
            //var e = document.getElementById("CSP_" + this.id);
            /*
                    debugger;
                    var $e = $("#CSP_" + this.id);
                    if ($e.length > 0) {
                        //e.parentNode.removeChild(e);
                        $e.remove();
                    }
            */
            return codeLast;
        },

        GetCurrentForm: function () {
            var obj = this;
            return obj;
        },

        /// <member id="SetCodeDataLink" kind="method">
        /// <summary>종목코드또는 계좌등을 다른 화면으로 연동하는 함수</summary>
        /// <remarks><![CDATA[
        ///종목코드 또는 계좌, 기타 정보등을 전체 화면으로 전송하는 기능
        /// 형식 : form.SetCodeDataLink (tagName, {key:"000660"});
        /// tagName 종류
        /// 1."code" : 종목코드 연동
        /// 2:"acct" : 계좌번호 연동
        /// option 객체정보
        /// key : 종목코드 또는 계좌번호
        /// ]]></remarks>
        /// <param name = "tagName" type="string"> code : 종목코드, acct:계좌번호 의미하는 태그명</param>
        /// <param name = "option" type="string|object"> 공유 정보 객체 또는 문자열 </param>
        /// <example><![CDATA[
        /// 1. 종목코드(000660)를 연동하는 경우
        /// form.SetCodeDataLink ( "code", {key:"000660"});
        /// 또는 form.SetCodeDataLink ( "code", "000660");
        /// 2. 계좌번호를 연동하는 경우
        /// form.SetCodeDataLink ( "acct", {key:"123456789"});
        /// 또는 form.SetCodeDataLink("acct", "123456789");
        /// ]]></example>
        /// </member>

        SetCodeDataLink: function (tagName, option) {
            var strCode, objData, count = 0,
                sendTag;
            if (this.openStatus) {
                if (tagName == "code") { // 화면 스크립트로 연결
                    strCode = hi5.isObject(option) ? option.key : option;
                    objData = {
                        "code": strCode,
                        "mktgbcd": "X",
                        "marketcode": "BIT90"
                    };
                    sendTag = "JMCOMBO-LINKINFO";
                } else if (tagName == "acct") {
                    strCode = option.acctno || "";
                    objData = {
                        "acct": strCode
                    };
                    sendTag = "ACCOUNT-LINKINFO";
                } else if (tagName == "JMCOMBO-LINKINFO") { // 종목컨트롤에서 연동
                    objData = option;
                    sendTag = "JMCOMBO-LINKINFO";
                } else if (tagName == "queryID") { // 종목컨트롤에서 연동
                    objData = option;
                    sendTag = "queryID";
                }

                if (sendTag == "JMCOMBO-LINKINFO") {
                    if (objData.code || objData.jmcode) {
                        hi5.SHMEM["symbol"] = {
                            code: objData.code || objData.jmcode
                        };
                    }
                } else if (sendTag == "queryID") {
                    if (objData) {
                        hi5.SHMEM["qryId"] = objData;
                    }
                }

                if (hi5.WTS_MODE == WTS_TYPE.MDI) { // MDI 모드
                    var forms = this.getFormsFind();
                    if (forms.length > 0) {
                        count = SetChildFrameLinkCode({
                            forms: forms,
                            form: this,
                            tagName: sendTag,
                            objData: objData
                        });
                    }
                } else {
                    count = this.SendToAllScreen(sendTag, objData);
                }
            }
            return count;
        },

        getLastCodeFind: function () {
            var code = "";
            if (hi5.WTS_MODE == WTS_TYPE.MDI) { // MDI 모드
                code = $($("#" + this.id).closest('.hi5_win_main')[0]).attr("code");
                return code != undefined ? code : "";
            }
            return code;
        },

        getFormsFind: function (bAll) {
            var forms = null;
            if (hi5.WTS_MODE == WTS_TYPE.MDI && !bAll) { // MDI 모드
                forms = $("#" + this.id).closest('.hi5_win_main').find('.form'); // 같은 영역의 Form으로만 전달
            } else { // MTS, SDI 모드인 경우
                forms = window.top.$(".form"); // 모든 화면으로 전달
            }
            if (!forms) return null;

            var objForms = [],
                obj;
            for (var i = 0; i < forms.length; i++) {
                obj = hi5.GetObjData(forms[i].id);
                if (obj) objForms.push(obj);
            }
            return objForms;
        },

        // SendToAllScreen 함수 추가 - 2017.06.13
        SendToAllScreen: function (tagName, objdata) {
            if (hi5.WTS_MODE == WTS_TYPE.MDI) return 0;
            var self = this,
                count = 0;

            //최상위 form을 검색하여 처리
            //var forms = window.top.$(".form"), form;
            var forms = this.getFormsFind(),
                formCtl;
            if (forms) {
                for (var i = 0; i < forms.length; i++) {
                    formCtl = forms[i];
                    if (self.id != formCtl.id) {
                        count = formCtl.GetFromOtherForm(tagName, objdata);
                    }
                }
            }
            return count;
        },

        // SendToAllScreen에서 던진 정보를 받아주는 함수
        GetFromOtherForm: function (tagName, objData) {
            var self = this,
                count = 0;
            var ctrllist = self.GetAllObjData();
            for (var j = 0; j < ctrllist.length; j++) {
                var obj = ctrllist[j];
                if (obj.linkinfo != undefined && obj.linkinfo != "" && obj.OnGetLinkInfo != undefined) {
                    if (obj.OnGetLinkInfo(tagName, objData)) count++;
                } else if (tagName == 'queryID' && obj.orgid == 'me_id') {
                    if (obj.OnGetLinkInfo(tagName, objData)) count++;
                }
            }
            return count;
        },

        // 쟈기 자신은 제외하고 모든Form으로 OnLinkDataNotify() 이벤트 함수를 호출
        /// <member id="PostLinkData" kind="method">
        /// <summary>다른 폼으로 object 전달하는 기능</summary>
        /// <remarks>OnLinkDataNotify 이벤트로 전달하는 방식으로 OnLinkDataNotify() 이벤트 함수에서 수신 기능을 기술한다.
        ///  MDI 형식: 자기 자신은 제외하고 화면내 Form으로만 전달
        ///            표시된 모든 Form에게 전달은 option={allSend:true} 옵션값을 지정
        ///  SPA 형식: 모든 Form으로 전달하는 방식
        /// </remarks>
        /// <param name="tagName" type="string"> 구분Tag </param>
        /// <param name="objdata" type="object"> 전달object </param>
        /// <param name="option"  type="object" option="true"> 부가정보 객체</param>
        /// <example><![CDATA[
        ///  1) MDI 형식은 자신이 속한 화면내 Form에게만 전달하는 방식
        ///     form.PostLinkData("tagName", { data:"test", key:"code"...});
        ///  2) MDI 형식은 표시된 모든 Form으로 전달하는 방식
        ///     form.PostLinkData("tagName", { data:"test", key:"code"...}, {allSend:true});
        ///  3) SPA 형식은 표시된 모든 Form으로 전달하는 방식
        ///     form.PostLinkData("tagName", { data:"test", key:"code"...});
        /// ]]></example>
        /// <see cref="../Event/eventidOnLinkDataNotify.htm">OnLinkDataNotify 이벤트 함수 참고</see>
        /// </member>
        PostLinkData: function (tagName, objdata, option) {
            var self = this,
                forms;
            if (tagName == "FOCUS") {
                forms = $(".form");
                if (objdata.map == undefined || objdata.map == "") { // 자신의 폼에서 focus
                    if (!idpattern.test(objdata.id))
                        objdata.id = "{{id.}}" + objdata.id;
                    objdata.id = x2h.getUniqID(objdata.id, self);

                    //objdata.id = self.m_sScreenID + "_" + self.m_nScreenIndex + "_" + objdata.id;
                    //self.OnLinkDataNotify(tagName, objdata);
                    var obj = self.GetObjData(objdata.id);
                    obj.SetFocus();
                } else { // formlink내에 다른 화면으로 focus 이동
                    for (var i = 0; i < forms.length; i++) {
                        var id = forms[i].id;
                        var objForm = this.GetObjData(id);
                        if (objdata.map == objForm.m_sScreenID) {
                            if (!idpattern.test(objdata.id))
                                objdata.id = "{{id.}}" + objdata.id;
                            objdata.id = x2h.getUniqID(objdata.id, objForm);

                            var obj = objForm.GetObjData(objdata.id);
                            obj.SetFocus();

                            //objForm.OnLinkDataNotify(tagName, objdata);
                            break;
                        }
                    };
                }

                return;
            }

            //debugger;
            var bAllSend = hi5.WTS_MODE == WTS_TYPE.MDI ? false : true;
            if (option) {
                bAllSend = option.allSend ? option.allSend : false;
            }

            forms = this.getFormsFind(bAllSend);
            if (forms) {
                hi5.logTrace({
                    type: 4,
                    message: "Start PostLinkData = map[" + self.m_sScreenID + "] Start",
                    data: {
                        tagName: tagName,
                        objdata: objdata
                    }
                });
                for (var i = 0; i < forms.length; i++) {
                    var form = forms[i];
                    if (self.id != form.id) {
                        if (form.OnLinkDataNotify) {
                            //hi5.logTrace({ type: 4, message: "## OnLinkDataNotify = map[" + self.m_sScreenID + "]->[" + form.m_sScreenID + "]", data: { tagName: tagName, objdata: objdata, form: form } });
                            hi5.logTrace({
                                type: 4,
                                message: "## OnLinkDataNotify = map[" + self.m_sScreenID + "]->[" + form.m_sScreenID + "]",
                                data: {
                                    tagName: tagName,
                                    objdata: objdata
                                }
                            });
                            form.OnLinkDataNotify.call(form, tagName, objdata);
                        }
                    }
                }
                hi5.logTrace({
                    type: 4,
                    message: "End PostLinkData = map[" + self.m_sScreenID + "] End",
                    data: {
                        tagName: tagName
                    }
                });

                //var s = $(forms)[0];
                //var fs = $(s).find(".form");
                //$(fs).each(function (index, form) {
                //    if (self.id != form.id) {
                //        var obj = hi5.GetObjData(form.id);
                //        if (obj && obj.OnLinkDataNotify) {
                //            hi5.logTrace({ type: 4, message: "## OnLinkDataNotify = map[" + self.m_sScreenID + "]->[" + obj.m_sScreenID + "]", data: { tagName: tagName, objdata: objdata, form: obj } });
                //            obj.OnLinkDataNotify.call(obj, tagName, objdata);
                //        }
                //    }
                //});
                //hi5.logTrace({ type: 4, message: "End PostLinkData = map[" + self.m_sScreenID + "] End", data: { tagName: tagName } });
            }
            return;
        },


        SetChildAddForm: function (objControl) {
            if (this.mapSubForm.size() > 0) { // 서브화면 초기화한다.
                var objs = this.mapSubForm.getObject();
                var key;
                for (key in objs) {
                    var objForm = objs[key];
                    if (objForm.objContainer == objControl) // 이전객체와 동일한 경우
                        objForm.SetFormInfoInit();
                }
            }

            if (this.mapSubForm.get(objControl.id))
                this.mapSubForm.remove(objControl.id);

            var objSubForm = new form;
            objSubForm.objContainer = objControl;
            objSubForm.orgid = objControl.orgid;
            if (objControl.autoHeight != undefined) objSubForm.autoHeight = objControl.autoHeight;
            this.mapSubForm.put(objControl.id, objSubForm);
            return objSubForm;
        },

        OnAllForminit: function () {
            var objForm;
            if (this.mapSubForm.size() > 0) { // 서브화면 초기화한다.
                var objs = this.mapSubForm.getObject();
                var key;
                for (key in objs) {
                    objForm = objs[key];
                    objForm.SetFormInfoInit();
                }
            }
            this.SetFormInfoInit();
        },

        OpenSubScreen: function (strMapName, options) {
            if (options._hash) { // 부모화면이 오픈되기전에 서브화면을 오픈처리
                this.showLoading();
                hi5.getScreenLoad(options._hash, screenDownLoad, options);
                return;
            }

            if (options.preform != undefined) {
                if (!options.preform.dlgMode)
                    options.preform.OnAllForminit();
            }

            // 이전 SubForm폼 객체전부를 삭제한다.
            if (this.objContainer != null) {
                this.mapSubForm.removeAll();
                //var formParent = this.objContainer.objParentForm;
            }

            // CacheBuster
            var cb = hi5cb.getCacheBuster({
                data: "map",
                mapfile: strMapName
            });
            var path = hi5.getURL({
                url: "screen/" + strMapName + ".xml"
            });
            var strUrl = path + cb.cb;

            // 맵이름을 지정후 오류시에 표시.
            if (options) {
                options["map"] = strUrl;
            }
            // --> [Edit] 수정자:kim changa 일시:2019/04/08
            // 메모리 관련부분 수정
            /*
                    //       x2h.requestURL(strUrl, screenDownLoad, options );
                    // 부모화면이 오픈상태에서 서비화면이 오픈을 하는경우 해쉬처리
                    if (this.objContainer && this.objContainer.objParentForm ) {
                        var form = this.objContainer.objParentForm;  // 부모
                        if (!form.openStatus && hi5_scrJS ) {
                            if (hi5_scrJS[strMapName] &&  hi5_scrJS[strMapName].cb === cb.cb) {
                                options["_hash"] = { mapName: strMapName, cb: cb.cb, url: strUrl };
                                if (!form._hash) form._hash = [];
                                form._hash.push(options);
                                return;
                            }
                        }
                    }
            */
            // <-- [Edit] kim changa 2019/04/08

            // loading 상태 표시
            this.showLoading();
            hi5.getScreenLoad({
                mapName: strMapName,
                cb: cb.cb,
                url: strUrl
            }, screenDownLoad, options);
        },

        // 화면의 모든 객체를 지우는 함수
        SetAllObjClear: function () {
            var self = this;

            // form객체를 지운다.
            hi5.RemoveObjData(self.id);

            // 컨트롤 객체를 지운다.
            this.mapCtlList.removeAll();
        },

        GetDialogContainer: function (htmlNode, options) {
            var dlgContainer = document.createElement('div');
            dlgContainer.className = "hi5_dlg_container";

            var dlgCell = document.createElement('div');
            dlgCell.className = "hi5_dlg_cell";

            var dlg = document.createElement('div');
            dlg.className = "hi5_dlg";
            if (typeof (options.position) === "object") {
                dlg.style.position = "absolute";
                if (options.position.top) {
                    dlg.style.top = options.position.top;
                }
                if (options.position.left) {
                    dlg.style.left = options.position.left
                }
                if (options.position.obj) {
                    var posid = x2h.getUniqID("{{id.}}" + options.position, this.objParentForm);
                    var posoff = {
                        left: $("#" + posid).offset().left + $("#" + posid).width(),
                        top: $("#" + posid).offset().top + $("#" + posid).height() - 30
                    }; //$("#"+posid).height();
                    $(dlg).offset(posoff);
                }
            } else if (typeof (options.position) === "string") {
                dlg.style.position = "absolute";
                if (options.position != "center") {
                    var posid = x2h.getUniqID("{{id.}}" + options.position, this.objParentForm);
                    var posoff = {
                        left: $("#" + posid).offset().left + $("#" + posid).width(),
                        top: $("#" + posid).offset().top + $("#" + posid).height() - 30
                    }; //$("#"+posid).height();
                    $(dlg).offset(posoff);
                }
            } else {
                if (form.id === "") {
                    $(dlgContainer).offset({
                        left: $("#" + this.objParentForm.id).parent().parent().offset().left,
                        top: $("#" + this.objParentForm.id).parent().parent().offset().top - 30
                    });
                } else {
                    $(dlgContainer).offset({
                        left: $("#" + this.objParentForm.id).parent().parent().offset().left,
                        top: $("#" + this.objParentForm.id).parent().parent().offset().top - 50
                    });
                }
                $(dlgContainer).width($("#" + this.objParentForm.id).width());
                $(dlgContainer).height($("#" + this.objParentForm.id).parent().parent().outerHeight());
            }

            var dlg_form = document.createElement('div');
            dlg_form.className = "hi5_dlg_form";
            dlg_form.appendChild(htmlNode);

            var dlgTop = document.createElement('div');
            dlgTop.className = "hi5_dlg_top";

            // 타이틀명 표시
            var titleName = options.dlgTitle;

            dlgTop.addEventListener('mousedown', function (event) {
                event.preventDefault();
                if (event.target.className !== "hi5_dlg_top") {
                    return;
                }

                var initx = event.clientX - event.offsetX - 1;
                var inity = event.clientY - event.offsetY - 1;
                var cx = event.clientX;
                var cy = event.clientY;
                var $dlg = $(dlgTop).parent();
                $dlg.css({
                    "position": "fixed",
                    "top": inity,
                    "left": initx
                });
                //parent의 document에 이벤트를 생성해주어야 mousemove 이벤트가 발생한다.
                $(document).on('mousemove', function (moveevent) {
                    var diffx = cx - moveevent.clientX;
                    var diffy = cy - moveevent.clientY;
                    var chx = initx - diffx;
                    var chy = inity - diffy;

                    $dlg.css({
                        "top": chy,
                        "left": chx
                    });
                    if (parseInt($dlg.css("top")) < 0) {
                        $dlg.css("top", 0);
                    }
                    if (parseInt($dlg.css("left")) < 0) {
                        $dlg.css("left", 0);
                    }
                });
                $(document).on('mouseup', function () {
                    $(document).off('mousemove');
                    $(document).off('mouseup');

                });
            });
            var blinder = document.createElement('div');
            blinder.className = "hi5_dlg_blinder";
            dlgContainer.appendChild(blinder);

            var dlgClosebtn = document.createElement('div');
            dlgClosebtn.className = "hi5_dlg_closebtn";
            var btnForm = this;
            dlgClosebtn.addEventListener('click', function () {
                dlgContainer.removeChild(blinder);
                btnForm.CloseScreen("");
            });
            if (options.max == true) {
                var dlgmaxbtn = document.createElement('div');
                dlgmaxbtn.className = "hi5_dlg_maximizebtn";
                var btnForm = this;
                dlgmaxbtn.addEventListener('click', function () {
                    var $win = $(this).parent().parent();
                    var id = $win[0].id;
                    //var winObj = g_ChildFrame[id];
                    if ($win.hasClass('maximized')) {
                        $win.css(JSON.parse($win.attr('originStyle')));
                        $win.removeClass('maximized');
                        $(this).removeClass('hi5_dlg_minimizebtn');
                        $(this).addClass('hi5_dlg_maximizebtn');
                        draggable($win.children('.hi5_win_top').children('.hi5_win_top_div')[0]);
                    } else {
                        var origin = $win[0].style;
                        var originStyle = {
                            top: $win.css("top"),
                            left: $win.css("left"),
                            width: $win.css("width"),
                            height: $win.css("height")
                        };
                        if (origin.height == 'auto') {
                            originStyle.height = 'auto';
                        }
                        $win.attr('originStyle', JSON.stringify(originStyle));
                        $win.css({
                            "position": "absolute",
                            "top": "0",
                            "left": "0",
                            "width": "100%",
                            "height": "100%"
                        });
                        $win.addClass('maximized');
                        $(this).removeClass('hi5_dlg_maximizebtn');
                        $(this).addClass('hi5_dlg_minimizebtn');

                        $win.children('.hi5_win_top').off('mousedown');
                    }
                    $(window).trigger("resize");
                });
                dlgmaxbtn.addEventListener('mouseover', function () {
                    // 화면 닫기
                    var $win = $(this).parent().parent();
                    if ($win.hasClass('maximized')) {
                        // 원래 화면으로 
                        this.title = $hi5_regional.tooltip.restore;
                    } else {
                        // 최대화
                        this.title = $hi5_regional.tooltip.maximize;
                    }
                });

            }
            dlgClosebtn.addEventListener('mouseover', function () {
                // 화면 닫기
                dlgClosebtn.title = $hi5_regional.tooltip.close;
            });

            var dlgLogo = document.createElement('div');
            dlgLogo.className = "hi5_dlg_logo";
            dlgTop.innerHTML = titleName;
            dlgTop.appendChild(dlgClosebtn);
            if (dlgmaxbtn)
                dlgTop.appendChild(dlgmaxbtn);


            dlg.appendChild(dlgTop);
            dlg.appendChild(dlg_form);

            function appendLines(windowMain) {
                var minWidth;
                var minHeight;

                var eline = document.createElement('div');
                eline.className = "eline";
                eline.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    var box = $(this).parent();
                    minWidth = parseInt(box.css("min-width"));
                    minHeight = parseInt(box.css("min-height"));
                    box.on("mousedown", function (e) {
                        //e.preventDefault();
                    });
                    var ckTop = e.clientY;
                    var ckLeft = e.clientX;
                    var ckWidth = $(this).parent().width();
                    $(document).on("mousemove", function (e2) {
                        var diffLeft = ckLeft - e2.clientX;
                        var diffWidth = ckWidth - diffLeft;
                        if (ckWidth - diffLeft < minWidth) {
                            return;
                        }
                        box.width(ckWidth - diffLeft);
                        $(window).trigger('resize');
                    });
                    $(document).on("mouseup", function () {
                        $(document).off("mousemove");
                        $(document).off("mouseup");
                    });
                });
                var sline = document.createElement('div');
                sline.className = "sline";
                sline.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    var box = $(this).parent();
                    minWidth = parseInt(box.css("min-width"));
                    minHeight = parseInt(box.css("min-height"));
                    box.on("mousedown", function (e) {
                        //e.preventDefault();
                    });
                    var ckTop = e.clientY;
                    var ckLeft = e.clientX;
                    var ckHeight = $(this).parent().height();
                    $(document).on("mousemove", function (e2) {
                        var diffTop = ckTop - e2.clientY;
                        var diffHeight = ckHeight - diffTop;
                        if (minHeight > ckHeight - diffTop) {
                            return;
                        }
                        box.height(ckHeight - diffTop);
                        $(window).trigger('resize');
                    });
                    $(document).on("mouseup", function () {
                        $(document).off("mousemove");
                        $(document).off("mouseup");
                    });
                });
                var wline = document.createElement('div');
                wline.className = "wline";
                wline.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    var box = $(this).parent();
                    minWidth = parseInt(box.css("min-width"));
                    minHeight = parseInt(box.css("min-height"));
                    box.on("mousedown", function (e) {
                        //e.preventDefault();
                    });
                    var ckTop = e.clientY;
                    var ckLeft = e.clientX - e.offsetX;
                    var ckWidth = $(this).parent().width();
                    $(document).on("mousemove", function (e2) {
                        var diffLeft = ckLeft - e2.clientX;
                        var diffWidth = ckWidth - diffLeft;
                        if (ckWidth + diffLeft < minWidth) {
                            return;
                        }
                        box.width(ckWidth + diffLeft);
                        box.offset({
                            left: e2.clientX
                        });
                        $(window).trigger('resize');
                    });
                    $(document).on("mouseup", function () {
                        $(document).off("mousemove");
                        $(document).off("mouseup");
                    });
                });
                var nline = document.createElement('div');
                nline.className = "nline";
                nline.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    var box = $(this).parent();
                    minWidth = parseInt(box.css("min-width"));
                    minHeight = parseInt(box.css("min-height"));
                    box.on("mousedown", function (e) {
                        //e.preventDefault();
                    });
                    var ckTop = e.clientY;
                    var ckTop = e.clientY - e.offsetY;
                    var ckHeight = $(this).parent().height();
                    $(document).on("mousemove", function (e2) {
                        var diffTop = ckTop - e2.clientY;
                        var diffHeight = ckHeight - diffTop;
                        if (minHeight > ckHeight + diffTop) {
                            return;
                        }
                        box.height(ckHeight + diffTop);
                        box.offset({
                            top: e2.clientY
                        });
                        $(window).trigger('resize');
                    });
                    $(document).on("mouseup", function () {
                        $(document).off("mousemove");
                        $(document).off("mouseup");
                    });
                });
                windowMain.appendChild(eline);
                windowMain.appendChild(sline);
                windowMain.appendChild(nline);
                windowMain.appendChild(wline);
            }
            if (options.initdata.resize) {
                appendLines(dlg);
                var resizeBtn = mkResizeBtn(dlg);
                dlg.appendChild(resizeBtn);
            }

            dlgCell.appendChild(dlg);

            dlgContainer.appendChild(dlgCell);
            return dlgContainer;
        },

        SetDlgTitle: function (title, classes) {
            var $dlgTitle = $(".hi5_spa_dlg_title a");
            if ($dlgTitle.length == 0) return;

            $dlgTitle.html(title);
            if (classes) {
                $dlgTitle.addClass(classes);
            }
        },

        GetSPADialogContainer: function (htmlNode, options) {
            var formObj = this;
            var dlgContainer = document.createElement('div');
            dlgContainer.className = "hi5_dlg_container";
            if (options) {
                if (options.class) {
                    dlgContainer.className = options.class;
                }
            }

            // 2019.10.03 kws
            // 아이폰 사파리 브라우져에서 높이와 너비가 없을때 다이얼로그를 못그리는 현상이 있다.
            // 그래서 높이 너비를 강제 지정해준다.
            if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                var bodyHeight = $(document).height();
                var bodyWidth = $(document).width();
                $(dlgContainer).css({
                    width: bodyWidth + 'px',
                    height: bodyHeight + 'px'
                });
            }

            var dlgCell = document.createElement('div');
            dlgCell.className = "hi5_dlg_cell";

            var dlg = document.createElement('div');
            dlg.className = "hi5_spa_dlg";

            var dlg_form = document.createElement('div');
            dlg_form.className = "hi5_spa_dlg_form";
            //dlg_form.appendChild(htmlNode);

            var blinder = document.createElement('div');
            blinder.className = "hi5_dlg_blinder";
            dlgContainer.appendChild(blinder);

            if (options.move) {
                var dlg_title = document.createElement('div');
                dlg_title.className = "hi5_spa_dlg_title";
                if (options.dlgTitle) {
                    var $titleA = $('<a/>');
                    $titleA.html(options.dlgTitle);
                    var $iTag = $('<i/>');
                    //$iTag.addClass('fa fa-times');
                    $iTag.addClass('popupclose_icon');
                    $iTag.css({
                        float: 'right',
                        cursor: 'pointer',
                        width: '26px',
                        height: '26px'
                    });
                    //$iTag.css({fontSize:'18px', float:'right', cursor:'pointer'});
                    //$iTag.css({fontSize:'22px', float:'right', cursor:'pointer'});
                    $iTag.on("click", function () {
                        formObj.CloseScreen("");
                    });
                    $(dlg_title).append($titleA);
                    $(dlg_title).append($iTag);
                }
                dlg_title.addEventListener('mousedown', function (event) {
                    event.preventDefault();

                    if ($(event.target)[0].tagName == "I") {
                        return;
                    }

                    //var initx = event.clientX - event.offsetX - 1;
                    //var inity = event.clientY - event.offsetY - 1;
                    var initx = event.clientX - event.offsetX;
                    var inity = event.clientY - event.offsetY;
                    var cx = event.clientX;
                    var cy = event.clientY;
                    var $dlg = $(dlg_form).parent();
                    //$dlg.css({ "position": "fixed", "top": inity, "left": initx });
                    //parent의 document에 이벤트를 생성해주어야 mousemove 이벤트가 발생한다.
                    $(document).on('mousemove', function (moveevent) {
                        var diffx = cx - moveevent.clientX;
                        var diffy = cy - moveevent.clientY;
                        var chx = initx - diffx;
                        var chy = inity - diffy;
                        $dlg.css({
                            "top": chy,
                            "left": chx
                        });
                        if (parseInt($dlg.css("top")) < 0) {
                            $dlg.css("top", 0);
                        }
                        if (parseInt($dlg.css("left")) < 0) {
                            $dlg.css("left", 0);
                        }
                    });
                    $(document).on('mouseup', function () {
                        $(document).off('mousemove');
                        $(document).off('mouseup');
                    });
                });
                dlg_form.appendChild(dlg_title);
                $(dlg_title).css('height', options.move + 'px');
            }

            dlg_form.appendChild(htmlNode);

            dlg.appendChild(dlg_form);
            dlgCell.appendChild(dlg);

            dlgContainer.appendChild(dlgCell);

            return dlgContainer;
        },

        GetMobilePopupContainer: function (htmlNode, options) {
            var dlgBlinder = document.createElement('div');
            dlgBlinder.id = "hi5_mobile_popup";

            var dlgTopbar = document.createElement('div');
            dlgTopbar.className = "hi5_mobile_popup_top";
            dlgBlinder.appendChild(dlgTopbar);

            // Back Button
            var back = document.createElement('span');
            back.addEventListener("click", function () {
                var formid = $(this).parent().parent().find(".hi5_mobile_popup_container div:first-child")[0].id;
                var formObj = hi5.GetObjData(formid);
                $("#hi5_mobile_popup").remove();
                formObj.CloseScreen("");
            });
            dlgTopbar.appendChild(back);

            // Title
            var title = document.createElement('h2');
            title.innerHTML = options.title;
            dlgTopbar.appendChild(title);

            var dlgContainer = document.createElement('div');
            dlgContainer.className = "hi5_mobile_popup_container";
            dlgContainer.appendChild(htmlNode);
            dlgBlinder.appendChild(dlgContainer);

            return dlgBlinder;
        },

        /// <member id="MessageBox" kind="method">
        /// <summary>메시지 박스를 옵션에 따라 표시</summary>
        /// <remarks>타입에 따라 보여지는 메시지 박스 형태가 다르다.</remarks>
        /// <param name="strText" type="string">표시될 메시지</param>
        /// <param name="strTitle" type="string">타이틀</param>
        /// <param name="nType" type="number">메시지박스 종류(0:닫기,1:확인/취소,2:예/아니오,3:확인)</param>
        /// <param name="fn" type="function">버튼 클릭시 callback 함수</param>
        /// <example>
        ///  form.MessageBox(strMsg,strTitle,0,function(fn){ }); fn으로 버튼 클릭한 값이 들어옴.
        /// </example>
        /// </member>
        MessageBox: function (strText, strTitle, nType, fn) {
            hi5.MessageBox(strText, strTitle, nType, fn);
        },

        /// <member id="MessageBoxTimeOut" kind="method">
        /// <summary>메시지 박스를 일정시간 유지하는 기능</summary>
        /// <remarks>타이머 단위는 초단위 </remarks>
        /// <param name = "strText" type="string">표시될 메시지</param>
        /// <param name = "nTimeout" type="number">타이머 시간(단위:초)</param>
        /// <example>
        ///  form.MessageBoxTimeOut(strMsg, 3); // 메시지박스 3초 유지
        ///  form.MessageBoxTimeOut(strMsg, 0); // 0 이하의 값을 넣으면 기본 값인 5초
        /// </example>
        /// </member>
        MessageBoxTimeOut: function (strText, nTimeout) {
            var closeText = $hi5_regional.button.closeText;
            if (nTimeout <= 0) nTimeout = 5;

            nTimeout = nTimeout * 1000;

            var dialogOptions = {
                modal: true,
                maxHeight: 600,
                maxWidth: 600,
                buttons: [{
                    text: closeText,
                    click: function () {
                        $(this).dialog("close");
                    }
                }]
            };

            $("#hi5_msgbox > p").html(strText);

            $("#hi5_msgbox").dialog(dialogOptions);

            setTimeout(function () {
                $("#hi5_msgbox").dialog("close");
            }, nTimeout);

        },

        /// <member id="SetToast" kind="method">
        /// <summary>토스트 형태의 메시지 띄워주기(모바일용)</summary>
        /// <remarks>타이머 단위는 초 단위 </remarks>
        /// <param name = "nType" type="string">메시지 표시 여부 0:미표시 그외 표시</param>
        /// <param name = "strText" type="string">표시될 메시지</param>
        /// <param name = "nTimeout" type="number">타이머 시간(단위:초)</param>
        /// <example>
        ///  form.SetToast(1, strMsg, 3); // 메시지박스 3초 유지
        /// </example>
        /// </member>
        SetToast: function (nType, strText, nTimeout) {
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

            var nTime = nTimeout * 1000;
            if (nTimeout == 0) nTime = 5000;
            setTimeout(function () {
                messagebox.className = messagebox.className.replace("show", "");
            }, nTime);
        },

        /// <member id="SetFrameMsg" kind="method">
        /// <summary>MDI화면 하단에 뿌려주는 메시지</summary>
        /// <remarks>MDI형태 화면 전용</remarks>
        /// <param name = "nType" type="string">메시지 표시 여부 0:미표시 그외 표시</param>
        /// <param name = "strText" type="string">표시될 메시지</param>
        /// <param name = "strColor" type="string">표시할 색상(0-기본, 1-오류, 그 외는 직접 칼라값)</param>
        /// <example>
        ///  form.SetFrameMsg(0, strMsg); // 컬러값 지정 안하면 기본 black
        ///  form.SetFrameMsg(0, strMsg, 1); // 오류 메시지
        /// </example>
        /// </member>
        SetFrameMsg: function (nType, strText, strColor) {
            if (!this.showstatus) return;

            if (nType == 0) return;
            if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                var win_fr = $("#" + this.id).closest('.hi5_win_main')[0];
                if (win_fr == undefined) return;
                var win_bot = $("#" + win_fr.id).children('.hi5_win_bot')[0];
                if (win_bot == undefined) return;
                var frameText = $(win_bot).children('a')[0];

                //텍스트 message 앞에 시각 표시
                var d = new Date();
                var hh = d.getHours().toString();
                var mm = d.getMinutes().toString();
                var ss = d.getSeconds().toString();

                if (hh.length < 2) hh = "0" + hh;
                if (mm.length < 2) mm = "0" + mm;
                if (ss.length < 2) ss = "0" + ss;

                frameText.innerHTML = hh + ":" + mm + ":" + ss + "    " + strText;

                var style = "color:black;";
                if (strColor) {
                    if (strColor == "0") {
                        style = "color:black;";
                    } else if (strColor == "1") {
                        style = "color:red;";
                    } else {
                        var style = "color:" + strColor + ";";
                    }
                }
                win_bot.setAttribute("style", style);
            }
        },

        /// <member id="SetPostProcess" kind="method">
        /// <summary>비동기식 처리를 위한 함수</summary>
        /// <remarks><![CDATA[
        ///    비동기식으로 기능 및 함수처리를 위한 기능
        ///   var timeoutID = form.SetPostProcess(func[, delay, param1, param2, ...]);
        ///   
        /// ]]></remarks>
        /// <param name = "callback" type="function"> callback 함수지정 필수 </param>
        /// <param name = "delay" type="number" default="200"> 타이머 지정시간( 단위 ms), 미지정시에 200 ms  </param>
        /// <returns type="number"> 타이머 반환값</returns>
        /// <example><![CDATA[
        ///     // 조회응답후에 Scroll 가운데 정렬기능
        ///     var id = form.SetPostProcess ( function(id){
        ///         var aArgs = Array.prototype.slice.call(arguments,1), that = this;
        ///         gb_2.$html[0].scrollTop = (tbl_hoga.$html[0].offsetHeight - gb_2.$html[0].offsetHeight)/2;
        ///     }, 100, strRQName )
        /// ]]></example>
        /// </member>
        SetPostProcess: function (callback, delay) {
            var that = this,
                delay = (delay !== undefined) ? delay : 200;
            var aArgs = Array.prototype.slice.call(arguments, 2);
            var timeoutID = setTimeout(function () {
                var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
                callback.call(that, timeoutID, args);
                //callback.apply(that, timeoutID, args);
            }, delay, aArgs); // 200 ms
            return timeoutID;
        },


        /// <member id="SetTimer" kind="method">
        /// <summary>타이머를 지정하는 함수</summary>
        /// <remarks>타이머 단위는 milliseconds , OnTimerChange(nID) 이벤트 발생 </remarks>
        /// <param name = "nID" type="number">  타이머 id값</param>
        /// <param name = "nOption" type="number">  1: 타이머 설정, 0 : 타이머 해제</param>
        /// <param name = "milliseconds" type="number">  타이머 시간(단위:milliseconds)</param>
        /// <example><![CDATA[
        ///  var Timerid  = 10;
        ///  form.SetTimer ( Timerid, 1, 1000 ) ;// 10 Timerid  값으로 1초 간격으로 timer 발생
        ///  form.SetTimer ( Timerid, 0) ;// 10 Timerid 값 timer 해제기능
        /// ]]></example>
        /// <see cref="../Event/eventidOnTimerChange.htm">OnTimerChange() 이벤트 관련</see>
        /// </member>
        SetTimer: function (nID, nOption, milliseconds) {
            if (!this.mapTimerList) this.mapTimerList = new JMap();

            var objTimer = this.mapTimerList.get(nID);
            if (objTimer != undefined) {
                clearTimeout(objTimer);
                this.mapTimerList.remove(nID);
            }
            if (nOption != 1) return;

            objTimer = setInterval(OnTimerChange, milliseconds, nID);
            this.mapTimerList.put(nID, objTimer);
            var self = this;

            function OnTimerChange(nID) {
                //console.log("timeout.." + nID);
                if (self.OnTimerChange)
                    self.OnTimerChange.call(self, nID);
            }
        },


        /// <member id="OnTimerChange" kind="event">
        /// <summary>타이머 지정시에 발생시에 이벤트 함수</summary>
        /// <remarks> 타이머 발생시에 이부분에 기능을 구현한다.</remarks>
        /// <param name = "nTimerID" type="number">  타이머ID </param>
        /// <example><![CDATA[
        ///  form.OnTimerChange = function(TimerID){
        ///  if ( TimerID == 10 )  // TimerID별 기능구현
        ///  {
        ///     기능구현;
        ///  }
        /// }
        /// ]]></example>
        /// <see cref="../Method/dispidSetTimer.htm">SetTimer() 함수 관련</see>
        /// </member>

        /// <member id="GetProp" kind="method">
        /// <summary>속성정보를 취득하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 취득 
        ///   1. propName값이 "login" 값이면 로그인 상태값을 반환(true: 로그인 상태, false:미로그인 상태)
        /// </remarks>
        /// <param name = "propName" type="string|object"> 속성 정보</param>
        /// <returns type="string|array"> 속성정보를 반환</returns>
        /// </member>
        GetProp: function (propName) {
            var $element = $("#" + this.id),
                val = null;

            if (propName == "login") {
                return ws ? ws.loginState() : false;
            }

            if ($element.length > 0)
                val = $element.attr(propName);
            return val;
        },

        /// <member id="SetProp" kind="method">
        /// <summary>속성 정보를 변경하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 제어하는 함수</remarks>
        /// <param name = "propName" type="string|object"> 스타일 정보</param>
        /// <param name = "value" type="string|object"> 셀 아이템명</param>
        /// </member>
        SetProp: function (propName, Value) {
            var $element = $("#" + this.id);
            if ($element.length > 0) {
                typeof (propName) === "object" ? $element.attr(propName): $element.attr(propName, Value);
            }
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
            //var $element = this.GetElemnt();
            var $element = $("#" + this.id);

            if ($element.length > 0) {
                // ColorIndex를 사용하는 경우({21})
                if (typeof (value) === "string")
                    value = x2h.getColorReplace(value);
                typeof (style) === "object" ? $element.css(style): $element.css(style, value);
            }
        },

        /// <member id="GetStyle" kind="method">
        /// <summary>스타일 정보를 취득하는 함수</summary>
        /// <remarks>스타일명으로 모든 스타일을 취득하는 함수 </remarks>
        /// <param name = "style" type="string|object"> 스타일 정보</param>
        /// <returns type="string|object"> 스타일 정보를 반환</returns>
        /// </member>
        GetStyle: function (style) {
            var $element = $("#" + this.id),
                val = null;
            if ($element.length > 0)
                val = $element.css(style);
            return val;
        },

        /// <member id="GetFormParent" kind="method">
        /// <summary>부모 Form컨트롤 객체를 취득하는 함수</summary>
        /// <remarks>자기 자신의 부모Form객체를 취득</remarks>
        /// <returns type="object"> Form컨트롤 객체 반환</returns>
        /// </member>
        GetFormParent: function () {
            var self = this;
            var ele = $("#" + self.id).parent();
            var eleForm = ele.closest('.form');
            if (eleForm.length > 0) {
                var id = eleForm.attr('id');
                var objForm = hi5.GetObjData(id);
                return objForm;
            }
            // 자기자신이거나 없는경우
            return null;
        },

        /// <member id="GetControl" kind="method">
        /// <summary>지정한 ID에 해당하는 컨트롤 객체를 취득하는 함수</summary>
        /// <remarks>mapName 인자값은 서브화면의 맵이름</remarks>
        /// <param name = "id" type="string"> 컨트롤ID </param>
        /// <param name = "mapName" type="string" option="true"> 맵이름</param>
        /// <returns type="object"> 컨트롤 객체 반환</returns>
        /// </member>
        GetControl: function (id, mapName) {
            var self = this;
            if (mapName == undefined && id == "form")
                return this;

            // id값에 {{id.}}값이 없으면 추가를 한다.
            if (!idpattern.test(id)) id = "{{id.}}" + id;
            id = x2h.getUniqID(id, this);
            // 맵 이름이 없으면 자신의 Form에서 찾는다.
            if (mapName == undefined) {
                return this.GetObjData(id);
            }

            // 전체 form에서 찾는다.
            var forms = $(".form");
            for (var i = 0; i < forms.length; i++) {
                var objForm = hi5.GetObjData(forms[i].id);
                if (objForm.m_sScreenID == mapName) {
                    var ctlId = x2h.getUniqID(id, objForm);
                    return objForm.GetObjData(ctlId);
                }
            };
            return null;
        },
        /// <member id="ScreenReplace" kind="method">
        /// <summary>화면을 Replace하는 함수</summary>
        /// <remarks>이전화면 변경기능</remarks>
        /// <param name = "strMapName" type="string"> 맵 파일명 지정 </param>
        /// <param name = "tagName" type="string"> 태그명 지정 </param>
        /// <param name = "objInit" type="object"> 초기 데이터 지정 </param>
        /// </member>
        ScreenReplace: function (strMapName, tagName, objInit) {
            var options = {};
            options.tagName = tagName;
            options.initdata = objInit;
            options.preform = this;
            options.form = this;
            if (this.objContainer != null) {
                if (this.objContainer.ctlName == "formlink") this.objContainer.currentPage = strMapName;
            }
            this.OpenSubScreen(strMapName, options);
        },
        /// <member id="SetFocus" kind="method">
        /// <summary>지정한 컨트롤에 Focus를 설정하는 함수</summary>
        /// <remarks>strMapName인자는 서브화면</remarks>
        /// <param name = "id" type="string">  컨트롤ID </param>
        /// <param name = "strMapName" type="string" option="true"> 맵파일명 지정 </param>
        /// </member>
        SetFocus: function (id, strMapName) {
            this.PostLinkData("FOCUS", {
                'id': id,
                'map': strMapName
            });
            //document.getElementById(ctrlid).focus();
        },

        /// <member id="OpenPopup" kind="method">
        /// <summary>Popup 화면을 생성하는 함수</summary>
        /// <param name = "strMapFile" type="string">  화면파일</param>
        /// <param name = "title" type="string">  화면표시할 타이틀명</param>
        /// <param name = "tagName" type="string">  태그명</param>
        /// <param name = "objOpenData" type="object">  화면정보 데이터</param>
        /// </member>
        OpenPopup: function (strMapFile, title, tagName, objOpenData) {
            var self = this;
            //self.SetStyle("display", "none");
            var objPopupForm = self.objPopupForm;

            //var iframes = window.top.$('body').contents().find('iframe');
            //if (iframes.length > 0) {
            //
            //}

            // 한번만 부모Form에게 dlgForm객체를 지정
            objPopupForm = new form;
            objPopupForm.objParentForm = self;
            self.objPopupForm = objPopupForm;

            objPopupForm.popupMode = true;

            var options = {};
            options.tagName = tagName;
            options.initdata = objOpenData;
            options.form = objPopupForm;
            options.dlgTitle = title; // 화면명입력

            objPopupForm.OpenSubScreen(strMapFile, options);
        },

        /// <member id="OpenDialog" kind="method">
        /// <summary>Dialog 화면을 생성하는 함수</summary>
        /// <remarks>remarks</remarks>
        /// <param name = "strMapFile" type="string">  화면파일</param>
        /// <param name = "title" type="string">  화면표시할 타이틀명</param>
        /// <param name = "tagName" type="string">  태그명</param>
        /// <param name = "objOpenData" type="object">  화면정보 데이터</param>
        /// <param name = "objPos" type="string|object" option="true">  화면정보 데이터</param>
        /// <param name = "moveheight" type="number" >  다이얼로그에 무브옵션이 있을때 타이틀 높이 지정</param>
        /// <param name = "moveheight" moveheight='max" >  다이얼로그에 최대화기능 추가</param>
        /// </member>
        OpenDialog: function (strMapFile, title, tagName, objOpenData, objPos, moveheight, callback) {
            var self = this;

            var objDlgForm = self.objDlgForm;

            // 한번만 부모Form에게 dlgForm객체를 지정
            objDlgForm = new form;
            objDlgForm.objParentForm = self;
            self.objDlgForm = objDlgForm;

            objDlgForm.dlgMode = true;

            var options = {};
            options.tagName = tagName;
            options.initdata = objOpenData;
            options.form = objDlgForm;
            options.dlgTitle = title; // 화면명입력
            options.position = objPos;
            if (moveheight) {
                if (typeof (moveheight) == 'number')
                    options.move = moveheight;
                else if (moveheight == 'max')
                    options.max = true;
            }
            if (callback) {
                options.callback = callback;
            }
            objDlgForm.OpenSubScreen(strMapFile, options);

        },

        /// <member id="OpenScreen" kind="method">
        /// <summary>신규화면을 Open하는 함수</summary>
        /// <remarks>MDI 모드에서는 새창으로 화면을 여는 기능</remarks>
        /// <param name = "option" type="object"> 화면번호 정보{menuid:화면번호, tagName:"open", initdata:{code:"BTC"}} </param>
        /// <example><![CDATA[
        ///    예)현재가 화면을 열면서 종목코드를 인자값으로 전달하는 예제
        ///    form.OpenScreen ({menuid:"현재가화면번호", tagName:"open", initdata:{code:BTC});
        /// ]]></example>
        /// </member>
        OpenScreen: function (option) {
            if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                var key, obj
                if (option.menuid) {
                    key = option.menuid;
                    obj = g_menuList[key];
                    if (obj && obj.element) {
                        $(obj.element).trigger('click', option);
                    }
                }
            }
        },
        /// <member id="CloseScreen" kind="method">
        /// <summary>화면을 종료시키는 함수</summary>
        /// <remarks>Popup, Dialog화면 및 일반 MDI화면에서 사용(MDI화면에서 사용시 인자값은 안넘김)</remarks>
        /// <param name = "strConfirm" type="string"> 태그명 지정 </param>
        /// <param name = "objData" type="object"> 부모화면에서 처리할 데이터 </param>
        /// </member>
        CloseScreen: function (strConfirm, objData) {
            var self = this;
            // Dialog Close 기능
            if (self.dlgMode) {
                var strTagName = $(".hi5_dlg").attr("hi5_tagname");
                if (hi5.WTS_MODE != WTS_TYPE.MDI) {
                    strTagName = $(".hi5_spa_dlg").attr("hi5_tagname");
                }
                //$(".hi5_dlg_container").remove();
                if (self.objParentForm) {
                    // CallBack 함수로 처리
                    if (objData && objData.callback_close && hi5.isFunction(objData.callback_close)) {
                        objData.callback_close.call(self, strConfirm, objData);
                        self.OnAllForminit();
                        //this.SetAllObjClear();
                        $(".hi5_dlg_container").remove();
                        return;
                    }
                    if (self.callback) {
                        self.callback.call(self, strConfirm, objData);
                        self.OnAllForminit();
                        //this.SetAllObjClear();
                        $(".hi5_dlg_container").remove();
                        return;
                    }
                    //여기
                    var id = self.objParentForm.id;

                    var parentform = hi5.GetObjData(id);
                    if (parentform) {
                        if (parentform.OnDialogClose)
                            parentform.OnDialogClose.call(self, strConfirm, strTagName, objData);

                        if (parentform.OnPopupClose)
                            parentform.OnPopupClose.call(self, strConfirm, strTagName, objData);
                    }
                }
            } else if (self.popupMode) {
                //$("#hi5_mobile_popup").remove();
                if (self.objParentForm) {
                    // CallBack 함수로 처리
                    if (objData && objData.callback_close && hi5.isFunction(objData.callback_close)) {
                        objData.callback_close.call(self, strConfirm, objData);
                        self.OnAllForminit();
                        //this.SetAllObjClear();
                        $("#hi5_mobile_popup").remove();
                        return;
                    }

                    var id = self.objParentForm.id;

                    var parentform = hi5.GetObjData(id);
                    if (parentform) {
                        if (parentform.OnDialogClose)
                            parentform.OnDialogClose.call(self, strConfirm, strTagName, objData);

                        if (parentform.OnPopupClose)
                            parentform.OnPopupClose.call(self, strConfirm, strTagName, objData);
                    }
                }
            } else {
                if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                    var closeBtn = $("#" + self.id).closest('.hi5_win_main').children('.hi5_win_top').children('.hi5_close_btn');
                    if (closeBtn) {
                        $(closeBtn).trigger("click");
                    }
                }
            }
            self.OnAllForminit();

            if (self.dlgMode) $(".hi5_dlg_container").remove();
            else if (self.popupMode) $("#hi5_mobile_popup").remove();
            else if (self.mtsPopup) $("#" + self.id).remove();
            //this.SetAllObjClear();
        },

        /// <member id="CommRequest" kind="method">
        /// <summary>서버로 통신데이터 전송하는 메소드</summary>
        /// <remarks>각 서비스별 구조에 맞게 변환해 해당되는 서버로 전송한다.
        /// </remarks>
        /// <param name = "strRQName" type="string"> 통신객체이름</param>
        /// <param name = "nPrevNext" type="number"> FID 조회 또는 트랜 연속처리가 없는경우는 0:최초조회 1:이전조회 2:다음조회, 트랜인 경우 연속처리가 있는경우 1:최초조회 2:이전조회 3:다음조회 </param>
        /// <param name = "option" type="object"> 기타 옵션 { ctrlname : 데이터를 수신 받을 컨트롤, timesec : 해당초 만큼 동일한 rq에 대해서 요청 제한, doNotShowError : true 면 에러가 나도 메시지 표시를 무시} </param>
        /// <returns type="number">0 이상 전송성공, 0 미만 값이면 전송실패</returns>
        /// <example>
        /// var nRet = form.CommRequest("objCommData", nPrevNext, {timesec : 3}); // 3초간 동일 rqname에 대한 처리를 막는다.
        /// </example>
        /// </member>
        CommRequest: function (objCommData, nPrevNext, option) {
            var obj = this,
                tranInfo = {},
                rqid = 0,
                strRQName, objkeyData = null,
                objNextInfo = null;

            // 통신입력 직접입력
            if (hi5.isObject(objCommData)) {
                strRQName = objCommData.rqName; // 통신 데이터
                objkeyData = objCommData.keyData ? objCommData.keyData : null; // 입력전문 데이터
                objNextInfo = objCommData.nextInfo ? objCommData.nextInfo : null; // 연속정보
            } else {
                strRQName = objCommData;
            }

            // 2019.03.13 kws
            // 특정 시간 내에는 동일한 rq에 대해서 처리하지 않도록 함.
            if (option) {
                if (option.timesec && option.timesec > 0) {
                    if (!obj["timerTR"]) obj["timerTR"] = {};
                    if (obj["timerTR"][strRQName]) return false;
                    obj["timerTR"][strRQName] = option.timesec;
                    console.log('Set timeout - ', strRQName);
                    setTimeout(function () {
                        console.log('End timeout - ', strRQName);
                        delete obj["timerTR"][strRQName];
                    }, option.timesec * 1000);
                }
            }


            if (hi5.isEmpty(this.comms_info)) {
                this.SetFrameMsg(1, "There is no communication information object[" + strRQName + "]", "1");
                return -1;
            }

            // 통신이름에 해당되는  통신정보를 취득한다.
            if (!this.comms_info.getTrCodeList) {
                this.SetFrameMsg(1, "There is  No RQName [" + strRQName + "]", "1");
                return -1;
            }

            var tranInfo = this.comms_info.getTrCodeList(this, strRQName),
                rqid = 0;
            this.SetFrameMsg(1, "");
            if (tranInfo.fidYN || tranInfo.trlist.length > 0) {
                tranInfo.rqname = strRQName;
                tranInfo.prevnext = nPrevNext;
                tranInfo.ctrlname = option ? option.ctrlname : "";
                tranInfo.doNotShowError = option ? option.doNotShowError : false; // 2019.11.07 kws 추가 doNotShowError로 검색
                if (!tranInfo.fidYN) {
                    rqid = this.SetCommTranData(tranInfo, objkeyData);
                }
                if (rqid > 0)
                    this.SetFrameMsg(1, $hi5_regional.tranmsg.requestMsg, "0");

            } else {
                this.SetFrameMsg(1, "Wrong RQName[" + strRQName + "]", "1");
                return -1;
            }
            return rqid;
        },


        /// <member id="GetStringTable" kind="method">
        /// <summary>리소스 아이디값에 해당되는 문자열을 반환하는 기능</summary>
        /// <remarks>텍스트 문자에 데한 ID값에 해당되는 언어별 문자열을 반환하는 하는 함수</remarks>
        /// <param name = "id" type="string"> 문자열 ID</param>
        /// <param name = "option" type="boolean" default="false"> true 이면 시스템 리소스 검색</param>
        /// <returns type="string"> 해당 언어의 문자열 반환</returns>
        /// <example><![CDATA[
        ///   // id 값으로문자열 취득
        ///   var str = form.GetStringTable ( "IDS_ORDER_TITLE" );
        ///            
        /// ]]></example>
        /// </member>
        GetStringTable: function (id, option) {
            //if (option) {
            // 전체 시스템 검색
            //
            //}
            if (this.string_table[id]) {
                return this.string_table[id][local_lang] == undefined ? "" : this.string_table[id][local_lang];
            }
            return "";
        },
        /// <member id="OnCommSendDataAfter" kind="event">
        /// <summary>서버로 기본통신 전문을 작성후 전문내용 변경 및 추가 처리를 위한 이벤트 함수</summary>
        /// <remarks>통신입력 데이터를 가공, 추가하는식의 작업을 진행한다
        ///          반환값이 false 이면 통신전송을 취소한다.
        /// </remarks>
        /// <param name = "strRQName" type="string"> 통신객체이름</param>
        /// <param name = "strTRCode" type="string"> 트랜인경우 트랜서비스 코드명 , FID조회인경우는 컨트롤이름(이전,다음조회시에만)</param>
        /// <param name = "nPreNext" type="number"> 0:최초조회 1:이전조회 3:다음조회</param>
        /// <param name = "objCommInput" type="object"> 통신전문 객체</param>
        /// <param name = "objInterfaceHeader" type="object"> 통신헤더 객체</param>
        /// <param name = "_objBeforeReal" type="object"> 자동갱신 등록객체</param>
        /// <returns type="boolean"> 반환값이 false 이면 통신전문을 전송하지 않고 무시를 한다. 그외: 서버통신 전문 전송한다.</returns>
        /// <example><![CDATA[
        /// // 통신객체 이름에 따라서 통신전문 유무를 체크하는 함수
        /// form.OnCommSendDataAfter(strRQName, trcode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal)
        /// {
        ///    서버전송전에 자동갱신 해제하는 경우
        ///   _objBeforeReal.key = new hi5_objBeforeReal;
        ///   _objBeforeReal.SBC ( { [obj:컨트롤, realtype:[C00,C01],keylist:[code1,code2]  ]});
        ///   
        ///    // (트랜통신인경우만) 통신전문 내용을 설정한다.
        ///    if ( trcode ==  "trcode" ) {  
        ///         //통신전문 내용을 취득한다.    
        ///         return true;
        ///    }
        ///  
        /// }
        /// ]]></example>
        /// <see cref="../Method/dispidCommRequest.htm"> 통신요청함수 참조</see>
        /// </member>
        OnCommDataBefore: function (option) {
            var bSend = true;
            if (this.OnCommSendBefore) {
                bSend = this.OnCommSendBefore(option.rqname, option.trcode, option.prevnext);
                bSend = bSend == undefined ? true : bSend;
            }
            return bSend;
        },

        SetCommFidData: function (tranInfo) {
            var inputrealkeys = [];
            var _objBeforeReal = {
                key: null
            };

            var nPrevNext = tranInfo.prevnext,
                strRQName = tranInfo.rqname,
                strCtrlName = tranInfo.ctrlname;

            var option = {
                rqname: tranInfo.rqname,
                trcode: "",
                prevnext: tranInfo.prevnext
            };
            if (!this.OnCommDataBefore(option)) return 0;

            // 통신 전문을 작성후 commAPI 전송
            //var realSBC = true;
            //var realSB = true;

            var nextKeyLen = 0;
            var nextKeyBuf = "";

            //if (nPrevNext > 1) {
            //    nextKeyLen = tranInfo[strRQName].nextKeyLen;
            //    nextKeyBuf = tranInfo[strRQName].nextKeyBuf;
            //}

            var inputrealkey = [];
            var outputrealkey = [];

            var inputArray = [];
            var fidInputs = {};

            // real key register
            var commprop = tranInfo[strRQName][0].comm_property;
            var realkeyobj = commprop.realkey || null;
            var inputGIDs = Object.keys(tranInfo[strRQName][0].INPUT);
            var reqCnt = 20,
                value, key;

            for (var x = 0; x < inputGIDs.length; x++) {
                var gid = inputGIDs[x];
                var inrec = tranInfo[strRQName][x].INPUT[gid];

                var inputdatas = inrec.item || [];

                for (var j = 0; j < inputdatas.length; j++) {
                    var inputdata = inputdatas[j];
                    key = inputdata.name;
                    value = inputdata.value;
                    if (inputdata.type == 1) {
                        if (this.commonscriptcall && typeof this.commonscriptcall == "function") {
                            value = this.commonscriptcall.call(this, inputdata.value);
                        }
                    } else if (inputdata.type == 2) {
                        if (this.commonscriptcall && typeof this.commonscriptcall == "function") {
                            value = this.commonscriptcall.call(this, inputdata.value);
                            reqCnt = value.length;
                        }
                    } else if (inputdata.type == 3) { // get value sharememory
                        value = hi5.GetSharedMemory(value);
                    } else if (inputdata.type == 4) { // control
                        var id = value;
                        if (!idpattern.test(id))
                            id = "{{id.}}" + id;

                        id = x2h.getUniqID(id, this);
                        var obj = this.GetObjData(id);
                        if (obj.itemflag == "1" || obj.itemflag == "3") {
                            if (obj.GetProp) {
                                value = obj.GetProp("value", true);
                                if (value == undefined) value = "";
                                value = value.toString();
                            } else
                                continue;
                        } else
                            continue;
                    }

                    if (value != "") {
                        fidInputs[key] = value;
                    }
                }
            }

            var objInterfaceHeader = {};
            // 입력전문을 변경 할 경우 스크립트 편집창에서 편집을 한다.
            if (this.OnCommSendDataAfter) {
                //this._objBeforeReal = new hi5_objBeforeReal
                var bSend = this.OnCommSendDataAfter(tranInfo.rqname, tranInfo.ctrlname, tranInfo.prevnext, fidInputs, objInterfaceHeader, _objBeforeReal);
                // 서버전송 취소
                if (bSend == false) {
                    return 0;
                }
            }
            // 
            hi5.logTrace({
                type: 2,
                message: "Form RqData FID=rqName [" + tranInfo.rqname + "] mapName=[" + this.m_sScreenID + "]",
                data: fidInputs
            });

            // 조회시에 실시간 키 값을 취득한다.
            if (realkeyobj) {
                for (var x = 0; x < realkeyobj.length; x++) {
                    if (realkeyobj[x].IO == 0) { //INPUT
                        var fid = realkeyobj[x].fid;
                        if (fidInputs[fid] !== "")
                            inputrealkey.push(fidInputs[fid]);
                    }
                }
            }

            var outputGIDs = Object.keys(tranInfo[strRQName][0].OUTPUT);

            for (var x = 0; x < outputGIDs.length; x++) {
                var gid = outputGIDs[x];

                var inputJSON = {
                    'gid': gid,
                    'fidInputs': fidInputs,
                    'outFID': [],
                    'isArray': "N",
                    'orderBY': "DESC",
                    'reqCnt': reqCnt,
                    'nextKeyLen': 0,
                    'nextKeyBuf': "",
                    'realSBC': true,
                    'realSB': true
                };

                var outrec = tranInfo[strRQName][0].OUTPUT[gid];
                if (outrec.item) {
                    for (var j = 0; j < outrec.item.length; j++) {
                        var fidnm = outrec.item[j].name;

                        var index = inputJSON.outFID.indexOf(fidnm);
                        if (index < 0)
                            inputJSON.outFID.push(fidnm);
                    }
                }

                if (outrec.record) {
                    for (var j = 0; j < outrec.record.length; j++) {
                        var id = outrec.record[j];
                        if (strCtrlName != null && strCtrlName != "") {
                            if (id != strCtrlName) continue;
                        }

                        if (!idpattern.test(id)) {
                            id = "{{id.}}" + id;
                        }
                        id = x2h.getUniqID(id, this);
                        var obj = this.GetObjData(id);

                        if (obj.itemflag == "2" || obj.itemflag == "3") {
                            if (obj.GetCommValue) {
                                obj.GetCommValue({
                                    "RQName": strRQName,
                                    "fidYN": true,
                                    "PrevNext": nPrevNext,
                                    fidInfo: inputJSON
                                });
                            }
                            if (!inputJSON.realSB) {
                                inputrealkey = [];
                            }

                            var skip = false;
                            if (_objBeforeReal.key && _objBeforeReal.key.skip(obj)) {
                                skip = true;
                            }

                            if (obj.realitem && obj.realitem.length > 0 && !skip) {
                                if (realkeyobj && inputJSON.realSB) {
                                    for (var xx = 0; xx < realkeyobj.length; xx++) {
                                        if (realkeyobj[xx].IO == 1) { //OUTPUT
                                            var tempobj = {
                                                'gid': realkeyobj[xx].gid,
                                                'fid': realkeyobj[xx].fid
                                            }
                                            outputrealkey.push(tempobj);
                                        }
                                    }
                                }

                                if (obj.realkeys && inputJSON.realSBC) {
                                    if (obj.realkeys.length > 0) {
                                        //for (var xx = 0; xx < obj.realitem.length; xx++) {
                                        var tempobj = {
                                            'realtype': obj.realitem,
                                            'keylist': obj.realkeys,
                                            'obj': obj
                                        }

                                        this.RealSBC(tempobj);
                                        //}

                                        obj.realkeys = [];
                                    }
                                }
                            }
                        }
                    }
                }
                if (outrec.item || outrec.record)
                    inputArray.push(inputJSON);
            }

            if (_objBeforeReal.key) {
                _objBeforeReal.key = null;
            }

            var sendBuffer = [];
            sendBuffer = sendBuffer.concat([GSsign]); //add GS

            var fidInputkeys = Object.keys(fidInputs);
            for (var x = 0; x < fidInputkeys.length; x++) {
                var key = fidInputkeys[x];
                var uint8array = hi5.U2A(key);
                var keyBuff = [].slice.call(uint8array);

                sendBuffer = sendBuffer.concat(keyBuff);

                var value = fidInputs[key];
                if (Array.isArray(value)) {
                    for (var xx = 0; xx < value.length; xx++) {
                        var uint8array = hi5.U2A(value[xx]);
                        var valueBuff = [].slice.call(uint8array);

                        sendBuffer = sendBuffer.concat([ISsign], valueBuff);
                    }
                } else {
                    var uint8array = hi5.U2A(value);
                    var valueBuff = [].slice.call(uint8array);

                    sendBuffer = sendBuffer.concat([ISsign], valueBuff);
                }
                sendBuffer = sendBuffer.concat([FSsign]);
            }

            for (var j = 0; j < inputArray.length; j++) {
                var data = inputArray[j];

                // var outFID = data.outFID;
                // FID 중복제거
                var outFID = data.outFID.reduce(function (a, b) {
                    if (a.indexOf(b) < 0) a.push(b);
                    return a;
                }, []);

                data.outFID = outFID;

                var uint8array = hi5.U2A("GID");
                var GIDBuff = [].slice.call(uint8array);
                sendBuffer = sendBuffer.concat(GIDBuff, [ISsign]);

                var uint8array = hi5.U2A(data.gid);
                var gidBuff = [].slice.call(uint8array);
                sendBuffer = sendBuffer.concat(gidBuff);

                if (data.isArray == "Y") {
                    //var fidLen = 0;
                    //for (var x = 0; x < outFID.length; x++) {
                    //   fidLen += outFID[x].toString().length;
                    //   fidLen++;
                    //}
                    //fidLen--;
                    //var ucDLEN = hi5.LPAD(fidLen, 8, "0");

                    var ucDLEN = "0".repeat(8);
                    var uint8array = hi5.U2A(ucDLEN);
                    var ucDLENBuff = [].slice.call(uint8array);

                    var ucNROW = hi5.LPAD(data.reqCnt, 4, "0"); // 관심유형이면 종목개수
                    var uint8array = hi5.U2A(ucNROW);
                    var ucNROWBuff = [].slice.call(uint8array);

                    var ucAKEY = new Array(1);
                    ucAKEY[0] = 48; // 0x30, '0'; 최초조회
                    if (nPrevNext == 1) { // 이전
                        ucAKEY[0] = 49; // 0x31, '1';
                    } else if (nPrevNext == 2) { // 다음
                        ucAKEY[0] = 50; // 0x32, '2'
                    } else { // 최초조회
                        data.nextKeyLen = 0;
                        data.nextKeyBuf = "";
                    }

                    var ucSAVELen = hi5.LPAD(data.nextKeyLen, 3, "0");
                    var uint8array = hi5.U2A(ucSAVELen);
                    var ucSAVELenBuff = [].slice.call(uint8array);

                    sendBuffer = sendBuffer.concat([FSsign, dollarSign], ucDLENBuff, ucNROWBuff, ucAKEY, [atSign], ucSAVELenBuff);
                    if (data.nextKeyBuf != "") {
                        var uint8array = hi5.U2A(data.nextKeyBuf);
                        var nextKeyBuf = [].slice.call(uint8array);
                        sendBuffer = sendBuffer.concat(nextKeyBuf);
                    }
                }

                for (var x = 0; x < outFID.length; x++) {
                    var uint8array = hi5.U2A(outFID[x].toString());
                    var fidBuffer = [].slice.call(uint8array);
                    sendBuffer = sendBuffer.concat([FSsign], fidBuffer);
                }
                if (inputArray.length > 1 && inputArray.length != j + 1) {
                    sendBuffer = sendBuffer.concat([CSsign]);
                }
                sendBuffer = sendBuffer.concat([GSsign]);
            }

            //option["outfid"] = inputJSON.outFID;
            option["outfid"] = inputArray;

            var commOptionInfo = {
                //          destsvr: commprop.destsvr,   // 목적지 서버
                timeout: commprop.timeout == undefined ? 20 : commprop.timeout, // 수신응답시간초과
                option: option,
                screenid: this.m_sScreenID,
                data: sendBuffer,
                datalen: sendBuffer.length, // 순수 데이터 영역의 정보
                sendbuffer: sendBuffer,
                rqid: 0,
                datatype: COOM_DATATYPE_FID,
                realkeys_IN: inputrealkey,
                realkeys_OUT: outputrealkey
            };

            var rqID = commAPI.commSendRqInfo(this, commOptionInfo);

            return rqID;
        },

        SetCommTranData: function (tranList, objkeyData) {
            var inputrealkeys = [],
                rqID = 0;

            for (var i = 0, len = tranList.trlist.length; i < len; i++) {
                var trcode = tranList.trlist[i],
                    comm_property = "comm_property";

                var option = {
                    rqname: tranList.rqname,
                    trcode: trcode,
                    prevnext: tranList.prevnext,
                    doNotShowError: tranList ? tranList.doNotShowError : false
                };
                if (!this.OnCommDataBefore(option)) continue;
                /*            연속키 처리는 별도처리 
                            // 통신응답 데이터관리 객체
                            if (!this.trDataMng[tranList.rqname]) this.trDataMng[tranList.rqname] = {};
                            if (!this.trDataMng[tranList.rqname][trcode]) this.trDataMng[tranList.rqname][trcode] = {}; this.trDataMng[tranList.rqname][trcode]["nextKey"] = null;
                            if (!this.trDataMng[tranList.rqname][trcode]["rpData"]) this.trDataMng[tranList.rqname][trcode]["rpData"] = {};
                */
                // 통신 전문을 작성후 commAPI 전송
                var trInfo = tranList[trcode][trcode];;
                var commprop = tranList[trcode][comm_property];

                //var INPUTbuff = [];
                //var INPUTbuff = hi5.RPADbuff(INPUTbuff, 100);

                // 이전/다음 연속처리시에 이전.다음 키값을 설정한다.
                //if (tranList.prevnext > 0) {
                //    switch ( tranList.prevnext)
                //   {
                //         case 2: case 3:
                //             var nextKey = this.trDataMng[tranList.rqname][trcode].nextKey || null;
                //             INPUTbuff = Array.prototype.slice.call(typedArray);
                //             break;
                //        default:
                //           INPUTbuff = hi5.RPADbuff(INPUTbuff, 100);
                //          break;
                // }
                //}

                var objInReal = this.comms_info.getRealKeyInfo(this, option.rqname, trcode, 0);

                // 해당 트랜의 레코드 정보 객체를 취득후 화면으로 전송한다.
                var objCommInput = this.comms_info.getRecordInfo(this, tranList[trcode], trcode, 0),
                    arInptuCtl = [];
                for (var recName in objCommInput) {
                    //var itemlist = trInfo[recName].itemlist || [];
                    var valuelist = trInfo[recName].item || [];
                    var objRec = trInfo[recName];

                    // 배열 데이터는 화면에서 입력
                    if (objRec.IO != 0) {
                        continue;
                    }

                    for (var j = 0; j < valuelist.length; j++) {
                        var inputdata = valuelist[j],
                            key = inputdata.name,
                            value = inputdata.value;

                        if (inputdata.type == 1) { // get value from script global variable
                            if (this.commonscriptcall && typeof this.commonscriptcall == "function") {
                                value = this.commonscriptcall.call(this, inputdata.value);
                            }
                        } else if (inputdata.type == 2) { // get value from script global variable
                            if (this.commonscriptcall && typeof this.commonscriptcall == "function") {
                                value = this.commonscriptcall.call(this, inputdata.value);
                            }
                        } else if (inputdata.type == 3) { // get value sharememory
                            value = hi5.GetSharedMemory(value);
                        } else if (inputdata.type == 4) { // control Value
                            var id = value;
                            if (!idpattern.test(id)) id = "{{id.}}" + id;
                            id = x2h.getUniqID(id, this);
                            var obj = this.GetObjData(id);

                            if (obj.itemflag == "1" || obj.itemflag == "3") {
                                arInptuCtl.push(obj);
                                if (obj.GetProp) {
                                    value = obj.GetProp("value", true); // 컨트롤에서 통신전문 작성에 필요한 욥션으로 판단( 패스워드 비번 암호화 등)
                                    if (value == undefined) value = "";
                                    value = value.toString();
                                } else
                                    continue;
                            } else
                                continue;
                        }

                        objCommInput[recName][key] = value;
                    }
                }
                var objInterfaceHeader = {
                    header: {}
                };
                // 입력전문을 변경 할 경우 스크립트 편집창에서 편집을 한다.
                if (this.OnCommSendDataAfter) {
                    var _objBeforeReal = {
                        key: null
                    };
                    var bSend = this.OnCommSendDataAfter(tranList.rqname, trcode, tranList.prevnext, objCommInput, objInterfaceHeader, _objBeforeReal);
                    // 서버전송 취소
                    if (bSend == false) return 0;
                }
                // commrequest({keyData:{key:value}}) 인자값으로 입력정보를 설정하는기능
                if (objkeyData) {
                    for (var recName in objkeyData) {
                        var recData = objkeyData[recName];
                        $.each(recData, function (key, value) {
                            objCommInput[recName][key] = value;
                        });
                    }
                }

                // 
                // 로그표시
                hi5.logTrace({
                    type: 2,
                    message: "Form RqData Tran=rqName [" + tranList.rqname + "]=trcode [" + trcode + "] mapName= [" + this.m_sScreenID + "]",
                    data: objCommInput
                });

                // 입력용 자동갱신 코드를 취득한다.
                if (objInReal) {
                    var rec = objInReal.recName,
                        item = objInReal.item,
                        code;
                    if (hi5.isArray(objCommInput[rec])) {
                        var count = objCommInput[rec].length,
                            rqData = objCommInput[rec];
                        for (var i = 0; i < count; i++) {
                            code = rqData[i][item].trim();
                            if (code != "") inputrealkeys.push(code);
                        }
                    } else {
                        code = objCommInput[rec][item].trim();
                        if (code != "") inputrealkeys.push(code);
                    }
                }

                // 출력용 컨트롤 리스트를 취득한다.
                var objOutPut = this.comms_info.getRecordInfo(this, tranList[trcode], trcode, 1);
                for (var recName in objOutPut) {
                    var ctlObj;
                    if (objOutPut[recName].outctl != undefined) {
                        for (var i = 0; i < objOutPut[recName].outctl.length; i++) {
                            ctlObj = objOutPut[recName].outctl[i];
                            if (ctlObj.itemflag == "2" || ctlObj.itemflag == "3") {
                                if (ctlObj.GetCommValue) {
                                    ctlObj.GetCommValue({
                                        "RQName": tranList.rqname,
                                        "fidYN": false,
                                        "PrevNext": tranList.prevnext
                                    });
                                    if (ctlObj.nextKey) {
                                        if (ctlObj.nextKey != "") {
                                            objCommInput.InRec1.nflag = "1";
                                            objCommInput.InRec1.nkey = ctlObj.nextKey;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                //this.waitMng[tranList.rqname] = arInptuCtl;

                //SBC처리
                //출력 컨트롤 취득
                //각 컨트롤별 리얼 타입과 키 취득 후 SBC 
                if (this.realctrls[tranList.rqname] && option.prevnext == 0) {
                    if (this.realctrls[tranList.rqname][trcode]) {
                        var len = this.realctrls[tranList.rqname][trcode].length;
                        for (var x = 0; x < len; x++) {
                            var ctrlobj = this.realctrls[tranList.rqname][trcode][x];
                            if (ctrlobj) {
                                if (ctrlobj.realitem) {
                                    //for (var zz = 0; zz < ctrlobj.realitem.length; zz++) {  //컨트롤별로 해제처리
                                    var tempobj = {
                                        'realtype': ctrlobj.realitem,
                                        'keylist': ctrlobj.realkeys,
                                        'obj': ctrlobj
                                    }
                                    this.RealSBC(tempobj);
                                    //}

                                    ctrlobj.realkeys = [];
                                }
                            }
                        }
                    }
                }

                rqID = hi5.getRQID();
                let commOptionInfo = {
                    type: 'tran',
                    rqname : option.rqname,
                    trcode : trcode,
                    input : objCommInput,
                    output : Object.keys(objOutPut),
                    timeOut : commprop.timeout == undefined ? 20 : commprop.timeout, // 수신응답시간초과
                    rqId : rqID,
                    $form : this
                }
                // // 트랜의 레코드별 배열 개수 및 전체전문 길이 객체 취득
                // var objCount = commAPI.GetTotalTranDataLen(this.tran_group[trcode], objCommInput);
                // var dataLen = objCount["totallen"]; // 실제전문길이

                // // 실제 전문을 작성한다.
                // var arryBuf = commAPI.json2structApi(this.tran_group[trcode], objCommInput, objCount);

                // console.assert(arryBuf.length == dataLen);
                // //INPUTbuff = INPUTbuff.concat(arryBuf);

                // var commOptionInfo = {
                //     destsvr: commprop.destsvr, // 목적지 서버
                //     option: option,
                //     screenid: this.m_sScreenID,
                //     trcode: trcode,
                //     data: arryBuf,
                //     datalen: arryBuf.length, // 순수 데이터 영역의 정보
                //     sendbuffer: arryBuf,
                //     rqid: 0,
                //     timeout: commprop.timeout == undefined ? 20 : commprop.timeout, // 수신응답시간초과
                //     //  dataCount: commprop.datacount == undefined ? 20: commprop.datacount, // 데이터 요청건수(트랜에서는 사용안함)
                //     datatype: COOM_DATATYPE_TRAN,
                //     realkeys_IN: inputrealkeys
                // };
                hi5.commSendRqInfo(commOptionInfo);
            }
            return rqID;
        },

        // OnGetData
        OnGetData: function (options, outdata) {
            var strRQName = options.rqname || '';
            var trcode = (options._trcode) ? options._trcode : options.trcode;
            var realkeys = options.realkeys;
            var nPrevNext = options.prevnext;
            var bSuccess = options.success;
            // 이벤트 발생을 위해서
            var ui = {
                rpData: outdata, // 응답데이터
                content_type: options.content_type, // "J": JSON 형식 데이터
                dataExist: options.dataExist, // 다음데이터 존재유무(0:다음데이터 없음, 1: 다음데이터 존재)
                msgHeader: options.msgHeader // 통신I/O
            };

            // 화면이 오픈되기전 또는 종료후에 오는 데이터는 무시를 한다.
            if (!this.openStatus) return false;
            /*연속키 처리는 별도처리 
                    // 통신 데이터 관리
                    if (trcode != "" && options.content_type !="J" ) {
                        this.trDataMng[strRQName][trcode].nextKey = options.dataExist == 1 ? options.nextKey : null;
                        // 트랜 연속처리를 위해서 데이터를 저장한다.
                        this.trDataMng[strRQName][trcode].rpData = outdata;
                    }
            */
            var framemsg = "[" + options.msgHeader.MSG_COD + "]" + options.msgHeader.MSG_CTNS;
            var showstatus = this.showstatus;

            hi5.logTrace({
                type: 2,
                message: "Form OnGetData rqName [" + strRQName + "]=trcode [" + trcode + "] mapName= [" + this.m_sScreenID + "]",
                data: ui
            });
            if (!bSuccess) {
                if (showstatus) {
                    this.SetFrameMsg(1, framemsg, "red"), showstatus = false
                };
                if (hi5.WTS_MODE != WTS_TYPE.MDI && !options.doNotShowError) {
                    hi5.showToast({
                        type: 2,
                        title: 'Service Error!',
                        text: framemsg,
                        sec: 5
                    });
                }
                if (this.OnRpError) {
                    // Script에서 반환값을 false로 하면 더이상 진행을 하지 않는다.
                    if (this.OnRpError(strRQName, {
                            msgHeader: options.msgHeader
                        }) == false) {
                        if (this.changeWaitCursor) this.changeWaitCursor(false, strRQName);
                        return false;
                    }
                }
            }
            var _objBeforeReal = {
                key: null
            };

            if (bSuccess && this.OnRpBefore) {
                if (this.OnRpBefore(strRQName, trcode, nPrevNext, ui, _objBeforeReal) == false) {
                    if (this.changeWaitCursor) this.changeWaitCursor(false, strRQName);
                    if (showstatus) {
                        this.SetFrameMsg(1, framemsg, "black");
                    }
                    return false;
                }
            }

            var tranInfo = this.comms_info.getTrCodeList(this, strRQName);
            if (tranInfo.fidYN || tranInfo.trlist.length > 0) {
                this.realctrls[strRQName] = {};

                var objOutReal = this.comms_info.getRealKeyInfo(this, strRQName, trcode, 1);
                if (tranInfo.fidYN) { // FID통신
                    var outputGID = Object.keys(tranInfo[strRQName][0].OUTPUT);
                    for (var j = 0; j < outputGID.length; j++) {
                        var gid = outputGID[j];
                        var gidoption = options.outfid[j];
                        var giddata = bSuccess ? outdata[j] : [];
                        var output = tranInfo[strRQName][0].OUTPUT[gid];
                        if (output.record != undefined && output.record != "") {
                            var ids = output.record;
                            for (var z = 0; z < ids.length; z++) {
                                var id = ids[z];
                                var nextctrl = false;
                                if (options.nextctrl) {
                                    if (options.nextctrl.length > 0) {
                                        if (options.nextctrl.indexOf(id) < 0) nextctrl = true;
                                    }
                                }
                                if (id == "" || nextctrl == true) continue;
                                if (!idpattern.test(id))
                                    id = "{{id.}}" + id;
                                id = x2h.getUniqID(id, this);

                                var obj = this.GetObjData(id),
                                    code;
                                if (obj.OnGetData) {
                                    gidoption["dataCount"] = giddata.length;
                                    //if (nPrevNext > 1) nPrevNext = 2;
                                    gidoption["prevnext"] = nPrevNext;
                                    gidoption["dataExist"] = false;
                                    gidoption["success"] = bSuccess;
                                    switch (nPrevNext) {
                                        case 1: // 이전조회
                                        {
                                            if (gidoption.fidPreNextData == 1 || gidoption.fidPreNextData == 3)
                                                gidoption["dataExist"] = true;
                                        }
                                        break;
                                    case 2: // 다음조회
                                    {
                                        if (gidoption.fidPreNextData == 2 || gidoption.fidPreNextData == 3)
                                            gidoption["dataExist"] = true;
                                    }
                                    break;
                                    default:
                                        if (gidoption.fidPreNextData == 2)
                                            gidoption["dataExist"] = true;
                                        break;
                                    }

                                    //if (gidoption.nextKeyBuf)
                                    //   gidoption["dataExist"] = true;
                                    //else
                                    //    gidoption["dataExist"] = false;
                                    obj.OnGetData(giddata, gidoption);
                                    var skip = false;
                                    if (_objBeforeReal.key && _objBeforeReal.key.skip(obj)) {
                                        skip = true;
                                    }

                                    if (bSuccess && realkeys && !skip) {
                                        if (obj.realitem) {
                                            var sendList = [];
                                            if (realkeys.IN) {
                                                for (var ii = 0; ii < realkeys.IN.length; ii++) {
                                                    if (sendList.indexOf(realkeys.IN[ii]) < 0) {
                                                        code = realkeys.IN[ii];
                                                        if (code !== "") sendList.push(code);
                                                    }
                                                }
                                            }

                                            if (realkeys.OUT) {
                                                for (var ii = 0; ii < realkeys.OUT.length; ii++) {
                                                    for (var jj = 0; jj < giddata.length; jj++) {
                                                        if (sendList.indexOf(giddata[jj][realkeys.OUT[ii].fid]) < 0) {
                                                            code = giddata[jj][realkeys.OUT[ii].fid];
                                                            if (code !== "") sendList.push(code);
                                                        }
                                                    }
                                                }
                                            }

                                            if (sendList.length > 0) {
                                                var tempobj = {
                                                    'realtype': obj.realitem,
                                                    'keylist': sendList,
                                                    'obj': obj
                                                }
                                                if (obj.realkeys) {
                                                    if (obj.realkeys.length > 0) {
                                                        obj.realkeys = obj.realkeys.concat(sendList);
                                                    } else
                                                        obj.realkeys = sendList;
                                                } else
                                                    obj.realkeys = sendList;
                                                this.RealSB(tempobj);
                                            }
                                        }
                                    }

                                    if (ids.length - 1 == z) {
                                        if (output.item) {
                                            if (output.item.length > 0) {
                                                for (var ii = 0; ii < output.item.length; ii++) {
                                                    var outputitem = output.item[ii];

                                                    var id = outputitem.value;
                                                    var name = outputitem.name;
                                                    if (id == "") continue;
                                                    if (!idpattern.test(id))
                                                        id = "{{id.}}" + id;
                                                    id = x2h.getUniqID(id, this);

                                                    var obj = this.GetObjData(id);
                                                    if (obj.OnGetData) {
                                                        obj.OnGetData(bSuccess ? giddata[name] : "");
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            if (output.item) {
                                if (output.item.length > 0) {
                                    for (var ii = 0; ii < output.item.length; ii++) {
                                        var outputitem = output.item[ii];

                                        var id = outputitem.value;
                                        var name = outputitem.name;
                                        if (id == "") continue;
                                        if (!idpattern.test(id))
                                            id = "{{id.}}" + id;
                                        id = x2h.getUniqID(id, this);

                                        var obj = this.GetObjData(id);
                                        if (obj.OnGetData) {
                                            obj.OnGetData(bSuccess ? outjson[0][name] : "");
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else { // 트랜통신
                    this.realctrls[strRQName][trcode] = [];
                    // 출력용 컨트롤 리스트를 취득한다.
                    var trInfo = tranInfo[trcode][trcode],
                        i, arPBCtl = [],
                        ctlObj;
                    // 출력용 레코드 정보를 취득한다.
                    var objOutPut = this.comms_info.getRecordInfo(this, tranInfo[trcode], trcode, 1);

                    //모든 컨트롤에 원본 출력데이터도 추가로 넘긴다( 페이지데이터).
                    options["outdata"] = outdata || {};

                    for (var recName in objOutPut) {
                        var recinfo = objOutPut[recName];
                        if (objOutPut[recName].outctl != undefined) { // 레코드 단위
                            for (i = 0; i < objOutPut[recName].outctl.length; i++) {
                                ctlObj = objOutPut[recName].outctl[i];
                                if (ctlObj.OnGetData) {
                                    ctlObj.OnGetData(bSuccess ? outdata[recName] : [], options);
                                    if (ctlObj.realitem && ctlObj.realitem.length > 0) {
                                        arPBCtl.push(ctlObj);
                                    }
                                }
                            }
                        }

                        // Item 단위 컨트롤에게 데이터 전달
                        var ids = recinfo.item || [],
                            item;
                        for (i = 0; i < ids.length; i++) {
                            item = ids[i];
                            if (item.type == 4) {
                                var id = item.value;
                                if (!idpattern.test(id)) id = "{{id.}}" + id;
                                id = x2h.getUniqID(id, this);
                                ctlObj = this.GetObjData(id);
                                if (ctlObj.OnGetData) {
                                    ctlObj.OnGetData(bSuccess ? outdata[recName][item.name] : "");
                                    if (ctlObj.realitem && ctlObj.realitem.length > 0) {
                                        arPBCtl.push(ctlObj);
                                    }
                                }
                            }
                        }
                    }

                    // SB 처리
                    var code, sendList = [];
                    if (bSuccess && realkeys.IN) {
                        for (var j = 0; j < realkeys.IN.length; j++) {
                            if (sendList.indexOf(realkeys.IN[j]) < 0) {
                                code = realkeys.IN[j];
                                if (code !== "") sendList.push(code);
                            }
                        }
                    }

                    // 출력용에서 자동갱신코드 취득
                    if (bSuccess && objOutReal) {
                        var objPB = outdata[objOutReal.recName] || outdata;
                        if (hi5.isArray(objPB)) {
                            for (i = 0; i < objPB.length; i++) {
                                code = objPB[i][objOutReal.item].trim();
                                if (code != "") sendList.push(code);
                            }
                        } else {
                            code = objPB[objOutReal.item].trim();
                            if (code != "") sendList.push(code);
                        }
                    }

                    if (!bSuccess)
                        arPBCtl = [];

                    /// <member id="onRealKeyChange" kind="event">
                    /// <summary>서비스 응답후 자동갱신 키값 변경</summary>
                    /// <remarks>Tran서비스만 적용(ex 뉴스화면)</remarks>
                    /// <param name = "strRQName" type="string"> 통신이름. </param>
                    /// <param name = "trcode" type="string"> 통신코드값. </param>
                    /// <returns type="array"> 리얼키값 반환(Array).</returns>
                    /// <example><![CDATA[
                    ///            이부분에 예제내용 기술한다...
                    /// ]]></example>
                    /// <shortcut key="id" url="http://"> 외부링크기술한다.</shortcut>
                    /// </member>


                    if (arPBCtl.length > 0 && this.onRealKeyChange && nPrevNext == 0)
                        sendList = this.onRealKeyChange(strRQName, trcode);

                    for (i = 0; i < arPBCtl.length; i++) {
                        ctlObj = arPBCtl[i];
                        //real 연동된 출력 컨트롤 목록 확인
                        this.realctrls[strRQName][trcode].push(ctlObj);

                        for (var x = 0; x < ctlObj.realitem.length; x++) {
                            if (sendList.length > 0) {
                                var tempobj = {
                                    'realtype': ctlObj.realitem[x],
                                    'keylist': sendList,
                                    'obj': ctlObj
                                }
                                if (ctlObj.realkeys) {
                                    if (ctlObj.realkeys.length > 0) {
                                        var nFind = 0;
                                        for (var j = 0; j < sendList.length; j++) {
                                            var index = ctlObj.realkeys.indexOf(sendList[j]);
                                            if (index > -1) {
                                                nFind = 1;
                                                break;
                                            }
                                        }
                                        if (nFind == 0) {
                                            ctlObj.realkeys = ctlObj.realkeys.concat(sendList);
                                        }
                                    } else
                                        ctlObj.realkeys = sendList;
                                } else
                                    ctlObj.realkeys = sendList;

                                this.RealSB(tempobj);
                            }
                        }
                    }
                }
            }
            if (_objBeforeReal)
                _objBeforeReal.key = null;

            if (this.changeWaitCursor)
                this.changeWaitCursor(false, strRQName);

            //display message
            if (showstatus) {
                this.SetFrameMsg(1, framemsg, bSuccess ? "black" : "red");
            }

            if (bSuccess && this.OnRpData)
                this.OnRpData(strRQName, trcode, nPrevNext, ui);
            // postRPData
            //if (bSuccess && this.onPostRpData) {
            //    setTimeout(this.onPostRpData, 100, options, outdata);   // 100ms
            //}
            return true;
        },

        OnRealData: function (data, subobj) {
            // 화면이 오픈되기전 또는 종료후에 오는 데이터는 무시를 한다.
            if (!this.openStatus) return;
            var self = this,
                realkey = data.key,
                realtype = data.realType;
            var option = {
                realType: realtype,
                key: realkey,
                realCount: data.realCount,
                countQueue: data.countQueue,
                fn: data.fn
            };

            // 2018.09.13 Kiwon Sohn
            // this.realitem 항목에 자동갱신이 포함된 경우만 처리를 한다.
            if (this._realMng && this.realitem[realtype]) {
                if (this.realitem[realtype].includes(realkey)) {
                    var bQueuData = this._realMng.setData(option);
                    if (bQueuData) return;

                    // 일정큐 개수가 넘치면 자동갱신 정보만 저장후 반환을 한다.
                    /*
                                    if (option.countQueue >= g_hi5MaxQueue) {
                                        if (!this.realMng[realtype])
                                            this.realMng[realtype] = [];
                    
                                        if (!this.realMng[realtype].includes(realkey))
                                            this.realMng[realtype].push(realkey);
                                        return;
                                    } else {
                                        if (!hi5.isEmpty(this.realMng)) {
                                            if (!this.realMng[realtype])
                                                this.realMng[realtype] = [];
                    
                                            if (!this.realMng[realtype].includes(realkey))
                                                this.realMng[realtype].push(realkey);
                                            return;
                                        }
                                    }
                    */
                }
            }

            /// <member id="OnRealDataBefore" kind="event">
            /// <summary>자동갱신 데이터를 컨트롤에게 처리전에 발생 시키는 이벤트 함수</summary>
            /// <remarks>자동갱신 데이터를컨트롤에게 전달하기 전에 가공 또는 확인 하기 위한 기능 처리
            ///  반환값이 false 이면 컨트롤에게 전달하지 않고 바로 무시 된다.
            ///  option 객체
            ///  realType : 자동갱신 타입
            ///  key : 키 문자열
            /// </remarks>
            /// <param name = "objPb" type="object"> 실시간 데이터 객체 </param>
            /// <param name = "option" type="object"> 데이터 정보객체 </param>
            /// <returns type="boolean"> false 이면 처리를 무시한다.</returns>
            /// <example><![CDATA[
            ///    form.OnRealDataBefore = function(data.data, option){
            ///         return false;  // 더이상처리를 하지 않는다.
            ///    }
            /// ]]></example>
            /// </member>
            if (this.OnRealDataBefore) {
                // if (this.OnRealDataBefore(data.data, option) == false)
                //     return;
                var realBefore = (subobj && subobj._realBefore === false) ? false : true;
                if (realBefore && this.OnRealDataBefore) {
                    if (this.OnRealDataBefore(data.data, option) == false)
                        return;
                }
            }

            if (subobj) {
                if (subobj.OnRealData) {
                    subobj.OnRealData(data.data, option);
                }
            }

            /// <member id="OnRealDataAfter" kind="event">
            /// <summary>자동갱신 데이터를 컨트롤에게 처리후에 발생 시키는 이벤트 함수</summary>
            /// <remarks>자동갱신 데이터를컨트롤에게 전달한 후에 가공 또는 확인 하기 위한 기능 처리
            ///  option 객체
            ///  realType : 자동갱신 타입
            ///  key : 키 문자열
            /// </remarks>
            /// <param name = "objPb" type="object"> 실시간 데이터 객체 </param>
            /// <param name = "option" type="object"> 데이터 정보객체 </param>
            /// <example><![CDATA[
            ///    form.OnRealDataAfter = function(data.data, option){
            ///         return;
            ///    }
            /// ]]></example>
            /// </member>
            if (this.OnRealDataAfter) {
                this.OnRealDataAfter(data.data, option);
            }
        },

        OnGetError: function (rqname, obj) {
            /// <member id="OnRpError" kind="event">
            /// <summary>fid 혹은 트랜 조회 에러 시 발생하는 이벤트</summary>
            /// <remarks>조회 타임아웃일 경우에도 이쪽으로 들어온다.
            ///  반환값이 false 이면 에러메시지가 발생 안한다.
            ///  obj 객체
            ///  errType : 에러 타입(0:서비스 에러 1:타임아웃 에러)
            ///  MSG_COD : 에러 코드
            ///  MSG_CTNS : 에러 메시지
            ///  MSG_POUT_PUP_YN : 에러 팝업 유무
            /// </remarks>
            /// <param name = "rqname" type="string"> 조회 RQ 명</param>
            /// <param name = "obj" type="object"> 메시지 정보객체 </param>
            /// <returns type="boolean"> false 이면 처리를 무시한다.</returns>
            /// <example><![CDATA[
            ///    form.OnRpError = function(rqname, obj){
            ///    }
            /// ]]></example>
            /// </member>

            if (this.changeWaitCursor)
                this.changeWaitCursor(false, rqname);

            if (this.OnRpError) {
                if (this.OnRpError(rqname, obj) == false)
                    return false;
            }

            if (obj.MSG_POUT_PUP_YN == "0") {
                var framemsg = "[" + obj.MSG_COD + "]" + obj.MSG_CTNS;
                if (this.showstatus) {
                    this.SetFrameMsg(1, framemsg, "red");
                }
            } else {
                var framemsg = "[" + obj.MSG_COD + "]" + obj.MSG_CTNS;
                if (this.showstatus) {
                    this.MessageBox("ERROR!", framemsg, 0);
                }
            }
        },

        changeWaitCursor: function (bWait, rqName) {
            if (bWait) {
                this.$html.addClass("wait");
            } else {
                this.$html.removeClass("wait");
            }
            /*
                    var $ele = $("#" + this.id);
                    var chids = $ele.children();
                    if (bWait) {
                        $ele.addClass("wait");
                        chids.addClass("wait");
                    } else {
                        $ele.removeClass("wait");
                        chids.removeClass("wait");
                    }
                    if (this.waitMng[rqName] == undefined) return;
                    {
                        for (var i = 0, len = this.waitMng[rqName].length ; i < len; i++) {
                            var objctl = this.waitMng[rqName][i];
                            if (objctl.OnWaitCursor) {
                                objctl.OnWaitCursor(bWait);
                            }
                        }
                    }
            */
        },

        /// <member id="RealSB" kind="method">
        /// <summary>자동갱신을 등록하는 기능</summary>
        /// <remarks>자동갱신 타입과 키로 등록</remarks>
        /// <param name = "option" type="object"> realtype: 자동갱신 타입(S00), keylist:자동갱신 키 리스트(000660,005930), obj : 컨트롤객체 </param>
        /// <param name = "bAcctList" type="boolean" default="false"> true : 체결통보 실시간 등록 유무 </param>
        /// <returns type="number"> 0:정상, 그외:실패 </returns>
        /// <example><![CDATA[
        ///     var ctrlobj = form.GetObjData(ctrlid);
        ///     var option = {'realtype' : 'S00', 'keylist' : ['000660','005930'], 'obj' : ctrlobj};
        ///     nRet = form.RealSB(option);
        /// ]]></example>
        /// </member>
        RealSB: function (option, bAcctList) {
            if (bAcctList) {
                commAPI.SetCheJanRegister(true, this);
                this.bCheJan = true;
                return;
            };
            if (!option) return -1;

            if (option.formReal) {
                this.setRealItem(option, true);
            }

            //commAPI.requestReal(this, option);
            commAPI.commRealRegister(true, option);

            return 0;
        },

        /// <member id="RealSBC" kind="method">
        /// <summary>자동갱신을 해제하는 기능</summary>
        /// <remarks>자동갱신 타입과 키로 해제</remarks>
        /// <param name = "option" type="object"> realtype: 자동갱신 타입(S00), keylist:자동갱신 키 리스트(000660,005930), obj : 컨트롤객체 </param>
        /// <param name = "bAcctList" type="boolean" default="false"> true : 체결통보 실시간 해제 유무 </param>
        /// <returns type="number"> 0:정상, 그외:실패 </returns>
        /// <example><![CDATA[
        ///     var ctrlobj = form.GetObjData(ctrlid);
        ///     var option = {'realtype' : 'S00', 'keylist' : ['000660','005930'], 'obj' : ctrlobj};
        ///     nRet = form.RealSBC(option);
        /// ]]></example>
        /// </member>
        RealSBC: function (option, bAcctList) {
            if (bAcctList) {
                commAPI.SetCheJanRegister(false, this);
                return;
            };

            if (!option) return -1;

            if (option.formReal) {
                this.setRealItem(option);
            }
            //commAPI.cancelReal(this, option);
            commAPI.commRealRegister(false, option);

            return 0;
        },

        // form객체에서 직접 수신 받는 리얼데이터 등록/해제 - 2018.09.13 Kiwon Sohn
        setRealItem: function (option, bReg) {
            if (bReg) {
                if (!this.realitem[option.realtype]) {
                    this.realitem[option.realtype] = [];
                }
                this.realitem[option.realtype] = hi5.clone(option.keylist);

                if (commAPI.getRealTime()) {
                    if (!this._realMng) {
                        this._realMng = new hi5_realMng();
                        this._realMng.init({
                            control: this
                        }); // update성
                    } else {
                        this._realMng.clear();
                    }
                }
            } else {
                if (this.realitem[option.realtype]) {
                    for (var x = 0; x < option.keylist.length; x++) {
                        var realkey = option.keylist[x];
                        var ind = this.realitem[option.realtype].indexOf(realkey);
                        if (ind > -1) {
                            this.realitem[option.realtype].splice(ind, 1);
                        }
                    }

                    if (this.realitem[option.realtype].length == 0)
                        delete this.realitem[option.realtype];

                    if (this._realMng) {
                        this._realMng.clear();
                        this._realMng.destory();
                        this._realMng = null;
                    }
                }
            }
        },

        // form객체에서 onRealTime처리 추가 - 2018.09.13 Kiwon Sohn
        OnRealTime: function (option) {
            var self = this;
            if (self.OnRealDataBefore) {
                if (self.OnRealDataBefore(option.data, option) == false)
                    return;
            }

            /*
            var objData = this.realMng, keys, arRealData, self = this;
            for (var realType in objData) {
                keys = objData[realType];

                arRealData = commAPI.getPoolData({ realType: realType, key: keys });

                arRealData.forEach(function (option, idx, ar) {
                    if (self.OnRealDataBefore) {
                        if (self.OnRealDataBefore(option.data, option) == false)
                            return;
                    }
                });
            }
            this.realMng = {};
            */
        },

        generateLoading: function (option) {
            if (hi5.WTS_MODE == WTS_TYPE.MDI || (option && option.excel)) {
                if (this.$loading) {
                    this.$loading.remove();
                }

                var $element;
                if (this.objContainer) {
                    $element = $('#' + this.objContainer.id);
                    if ($element.css('display') == "none") {
                        return;
                    }
                } else {
                    return;
                }

                //var text = (option && option.excel ) ? "Excel DownLoading..." : "Loading ...";
                this.$loading = $("<div class='pq-loading'></div>").appendTo($element); // hi5_content
                //$(["<div class='pq-loading-bg'></div><div class='pq-loading-mask ui-state-highlight'><div>"+text +"</div></div>"].join("")).appendTo(this.$loading);
                $(["<div class='pq-loading-bg'></div><div class='pq-loading-mask ui-state-highlight'><div>Loading ...</div></div>"].join("")).appendTo(this.$loading);
                this.$loading.find("div.pq-loading-bg").css("opacity", .2);
                // 엑셀다운로드 인경우 넓이를 확장한다.
                //if (option && option.excel) {
                //    this.$loading.find("div.pq-loading-mask").css("width", "150px");
                //}
            }
        },

        hideLoading: function () {
            if (this.$loading) {
                //debugger;
                if (this.showLoadingCounter > 0) {
                    this.showLoadingCounter--;
                }
                if (!this.showLoadingCounter) {
                    this.$loading.hide();
                    this.$loading.remove();

                    this.$loading = null;
                }
            }
        },
        // form.showLoading({excel:true})
        showLoading: function (option) {
            if (hi5.WTS_MODE == WTS_TYPE.MDI || (option && option.excel)) {
                //debugger;
                this.generateLoading(option);
                if (this.$loading) {
                    if (this.showLoadingCounter == null) {
                        this.showLoadingCounter = 0;
                    }
                    this.showLoadingCounter++;
                    if (option && option.excel && this.showLoadingCounter > 1) this.showLoadingCounter = 1;
                    this.$loading.show();
                }
            }
        },


        /// <member id="getFormTitle" kind="method">
        /// <summary>해당화면 타이틀 뽑아오는 함수</summary>
        /// <returns type="string"> 화면 타이틀</returns>
        /// <example><![CDATA[
        /// 
        /// //Json 형식의 문자열을 객체 형식으로 반환하는 예제
        /// var text = form.getFormTitle() - text = 고객계좌관리

        /// ]]></example>
        /// </member>
        getFormTitle: function () {
            if (this.$html.parents('.hi5_win_main').length > 0) {
                var content = this.$html.parents('.hi5_win_main');
                var titletop = $(content).children('.hi5_win_top');
                var title = $(titletop).children('.hi5_win_top_div');
            } else {
                var content = this.$html.parents('.hi5_dlg_container');
                var titlecell = $(content).children('.hi5_dlg_cell');
                var titletop = $(titlecell).children('.hi5_dlg');
                var title = $(titletop).children('.hi5_dlg_top');
            }
            var text = $(title).text();
            var menuid = text.substring(text.indexOf('['), text.indexOf(']') + 1)
            text = text.replace(menuid, '');
            return text;
        },

        // evant 기술
        /// <member id="OnFormInit" kind="event" default="true">
        /// <summary>화면의 모든 컨트롤 생성후에 발생되는 이벤트 함수</summary>
        /// <remarks>통신처리 및 초기화 처리를 하는 기능</remarks>
        /// <param name = "tagName" type="string"> 태그명 </param>
        /// <param name = "objData" type="string|object"> 태그명 </param>
        /// </member>

        /// <member id="OnFormClose" kind="event">
        /// <summary>form 화면 종료이벤트</summary>
        /// <remarks>화면종료 또는 변경시에 발생되고 화면종료 처리기능 기술한다.</remarks>
        /// </member>


        /// <member id="OnDialogClose" kind="event">
        /// <summary>Dialog 화면 종료시에 발생되는 이벤트 함수</summary>
        /// <remarks>OpenDialog 함수호출시에 발생</remarks>
        /// <param name = "strConfirm" type="string"> 확인,취소 정보문자열</param>
        /// <param name = "strTagName" type="string"> Tag정보 문자열</param>
        /// <param name = "objData" type="object"> 부가 데이터(화면별 정의)</param>
        /// </member>


        /// <member id="OnLinkDataNotify" kind="event">
        /// <summary>Tag명으로 데이터를 전송하는 함수</summary>
        /// <remarks>전체화면 대상 PostLinkData() 함수호출시에 발생</remarks>
        /// <param name = "tagName" type="string"> 태그명 지정 </param>
        /// <param name = "objdata" type="string|object"> 태그명에 해당하는 데이터 </param>
        /// </member>

        //form.prototype.OnLinkDataNotify = function (tagName, objdata) {
        //    if (tagName == "FOCUS") {
        //        var obj = this.GetObjData(objdata.id);
        //        obj.SetFocus();
        //        return;
        //    }

        //    var fn = this.getIsEventName(this.id, "OnLinkDataNotify");
        //    if (typeof fn === "function") {
        //        fn(tagName, objdata);
        //    }
        //}


        /// <member id="OnCommSendBefore" kind="event">
        /// <summary>서버로 통신데이터 전송전에 발생되는 이벤트 함수</summary>
        /// <remarks>통신입력 데이터를 가공, 추가하는식의 작업을 진행한다
        ///          반환값이 false 이면 통신전송을 취소한다.
        /// </remarks>
        /// <param name = "strRQName" type="string"> 통신객체이름</param>
        /// <param name = "strTRCode" type="string"> 트랜서비스 코드명 지정</param>
        /// <param name = "nPreNext" type="number"> 0:최초조회 1:이전조회 3:다음조회</param>
        /// <returns type="boolean"> 반환값이 false 이면 통신전문을 전송하지 않고 무시를 한다. 그외: 서버통신 전문 전송한다.</returns>
        /// <example><![CDATA[
        /// // 통신객체 이름에 따라서 통신전문 유무를 체크하는 함수
        /// form.OnCommSendBefore = function(strRQName, trcode, nPreNext)
        /// {
        ///    // 로직검증후 처리
        ///    if ( strRQName ==  "RQNAME0001" ) {  
        ///         //통신전문 내용을 취득한다.    
        ///         return true;
        ///    }
        ///   return false; //통신전송을 무시한다.
        /// }
        /// ]]></example>
        /// <see cref="../Method/dispidCommRequest.htm"> 통신요청함수 참조</see>
        /// </member>


        /// <member id="OnRpData" kind="event">
        /// <summary>정상 통신응답 데이터 도달시에 발생되는 이벤트</summary>
        /// <remarks><![CDATA[
        ///     통신이 정상으로 도달하면 발생되는 이벤트 함수로 이전/다음처리 및 응답 데이터를 처리하는 기능 담당한다.
        /// <li><b>ui객체</b>상세설명</li>
        /// <li><b>rpData</b> : <i>통신응답 데이터 객체(배열)</i></li> 
        /// <li><b>dataExist</b> : <i> 0: 이전,다음 데이터 없음 1:이전,다음 데이터 존재</i></li> 
        /// <li><b>msgHeader</b> : <i> 통신 헤더 메세지 정보 객체 </i></li> 
        /// ]]></remarks>
        /// <param name = "strRQName" type="string"> 통신객체이름</param>
        /// <param name = "strTRCode" type="string"> TranCode</param>
        /// <param name = "nPreNext" type="number"> 통신 요청시 0:최초조회 1:이전조회 2:다음조회</param>
        /// <param name = "ui" type="object"> 부가정보</param>
        /// <example>
        /// form.OnRpData = function(rqname, trcode, nPreNext, ui)
        /// {
        ///     이후 처리 스크립트....
        /// }
        /// </example>
        /// <see cref="../Method/dispidOnRpBefore.htm"> OnRpBefore함수 참조</see>
        /// </member>

        /// <member id="OnRpBefore" kind="event">
        /// <summary>통신 데이터 수신 후 컨트롤 전송 직전에 발생 하는 이벤트</summary>
        /// <remarks><![CDATA[
        /// <li><b>ui객체</b>상세설명 </li>
        /// <li><b>rpData</b> : <i>통신응답 데이터 객체(배열)</i></li> 
        /// <li><b>dataExist</b> : <i> 0: 이전,다음 데이터 없음 1:이전,다음 데이터 존재</i></li> 
        /// <li><b>msgHeader</b> : <i> 통신 헤더 메세지 정보 객체 </i></li> 
        /// 
        /// 반환값이 false면 return시켜서 처리를 중지한다.
        /// ]]></remarks>
        /// <param name = "strRQName" type="string"> RQName </param>
        /// <param name = "strTRCode" type="string"> TRCode명 </param>
        /// <param name = "nPreNext" type="number"> 0:최초조회 1:이전조회 2:다음조회</param>
        /// <param name = "ui" type="object"> 부가정보</param>
        /// <param name = "_objBeforeReal" type="object"> 자동갱신 등록객체</param>
        /// <returns type="boolean"> false일 때는 더 이상 진행이 안된다..</returns>
        /// <example><![CDATA[
        /// form.OnRpBefore = function (strRQName, strTrCode, nPrevNext, ui, _objBeforeReal){
        ///    컨트롤에 데이터 설정전에  자동갱신을 등록하는 경우
        ///   _objBeforeReal.key = new hi5_objBeforeReal;
        ///   _objBeforeReal.SB ( { [obj:컨트롤, realtype:[C00,C01],keylist:[code1,code2]  ]});
        ///
        ///    if(g_onInit == 0) return false;  
        /// }
        /// ]]></example>
        /// <see cref="../Method/dispidOnRpBefore.htm"> OnRpData함수 참조</see>
        /// </member>
        //}


        /// <member id="onConfigChange" kind="event">
        /// <summary>시스템 환경이 변경시에 발생되는 이벤트 함수</summary>
        /// <remarks><![CDATA[
        ///    통신 재 접속, 마스터 실시간 변경등이 발생되는 시점에서 호출을 한다.
        ///    객체 설명
        ///    option = { 
        ///        relogin : true   // 통신 단절후에 재 접속이 성공한 경우
        ///        master  : true   // 실시간 마스터정보 수신완료후 발생
        ///        logint : true    // 로그인 완료
        ///    }
        /// ]]></remarks>
        /// <param name = "option" type="object"> 옵션값 객체 </param>
        /// <example><![CDATA[
        ///   1) 시스템 환경변후 처리하는 예제
        ///   form.onConfigChange = function (option){
        ///      if ( option.relogin ){
        ///         // 통신 재접속이 완료된 경우
        ///      } else if ( option.master ){
        ///         // 마스터 실시간 수신후에 완료된 경우
        ///     }
        ///   }
        /// ]]></example>
        /// </member>
    }

    form.ctlName = "form";
    return form;
});

/*

function ScreenLoad(strMapName, tagName, objInit, opt) {

    if (tagName == "") return;
    //  if (form != undefined) form.SetFormInfoInit();

    // 캐시 사용을 안함
    //var nonce = $.now();
    //var strUrl = "screen/" + strMapName + ".xml" + "?=" + (nonce++);
    var options = {};

    options.tagName = tagName;
    options.initdata = objInit;
    options.preform = form;
    if (opt != undefined) {
        //$.extend(object1, object2);
        $.extend(options, opt);
    }
    require(['control/form'], function (form) {
        options.form = new form;
        form.OpenSubScreen(strMapName, options);
    });
}
*/

function formTimeCheck(option) {
    if (window.hi5_DebugLevel && window.hi5_DebugLevel.timeCheck) {
        if (option.start) {
            option["end"] = performance.now() - option.start;
            if (option.end > 0) {
                console.log(option.text + option.end + " ms");
            }
        } else {
            option["start"] = performance.now();
        }
        return option;
    }
    return null;
}

function screenDownLoad(xhr, objData) {
    try {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                //20200417 mts의경우 screendown 속도에 따라서, 사용자가 탭을 여러번 클릭시, 순서보장이 안된다.. 마지막 클릭한 탭화면보다 그전에 선택한 탭화면이 나중에 올경우 문제가 발생
                if (hi5.WTS_MODE == WTS_TYPE.MTS && objData.mtsdiv) {
                    if (hi5_pageView[objData.mtsdiv].screen != xhr.key)
                        return false;
                }
                //var xmlDoc = httpRequest.responseXML;//httpRequest.responseText;  // Text Data
                objData.form.LoadMapXML(xhr, objData);
                // loading 상태 비표시
                objData.form.hideLoading();
            } else {
                //tab enable 처리
                var container = objData.form.objContainer;
                if (container) {
                    if (container.ctlName == "tab") {
                        container.Disabled(false);
                    }
                }

                // loading 상태 비표시
                if (objData.form)
                    objData.form.hideLoading();

                // 맵 이름과 상태코드 표시
                var msg = "Page Not Found!!...map=" + (objData.map ? objData.map : "") + "\r\n";
                msg += "status : " + xhr.status + "\r\n";
                msg += "statusText:" + xhr.statusText;
                hi5.MessageBox(msg, "Error", 0, function (ret) {
                    return false;
                });
                //alert(msg);
                return false;
            }
        }
    } catch (e) {
        console.log(e);
        console.log("error : " + e.message);
        console.log("error==>screeDownLoad : " + e.message);
        // loading 상태 비표시
        if (objData.form)
            objData.form.hideLoading();
        //$(".loading_img").remove();
        return false;
    }
    return true;
}