//******************************************************************/
// All Rights Reserved. Copyright(c)   2017 (주)한국소리마치        /
//******************************************************************/
/*! File Name     : grid.js
/*! Function      :	grid 컴포넌트
/*! System Name   : HTML5 Project
/*! Create        : 손 기 원 , 2017/03/14
/*! Update        :
/*! Comment       :
//******************************************************************/
(function () {
    'use strict';

    // 그리드 데이터 타입(빌더 dgn/grid/griddgninfo.xml 파일에 정의)
    var gridDataType = {
        TOPINSERT: 0, // 시간대별
        TOPUPDATE: 1, // 일자별
        TICKET: 2,  // 시세표성
        PORTFOLIO: 3,  // 관심유형
        TICKETAPPEND: 4,  // 시세표성 APPEND
        CIRCULAR: 5  // Circular유형
    };

    var gridPopup = {
        copy: {
            name: "Copy",
            icon: 'ui-icon ui-icon-copy',
            tooltip: "Works only for copy cell text to Clipboard ",
            action : null
        },
        xlsx: {
            name: "Export to Excel",
            icon: 'ui-icon ui-icon-arrowthickstop-1-s',
            action : null
        },
        excel: {
            name: "Excel From Server",
            icon: 'ui-icon ui-icon-document-b',
            action : null
        },
        paste: {
            name: "Paste",
            icon: 'ui-icon ui-icon-clipboard',
            action: null
        }
    }

    // stopPrice 컬럼영역 표시 데이터
    var _stopPrice = function (rowData, column) {
        // 매매구분
        var stls_stgb = rowData.stls_stgb, // 스탑구분(1:로스컷, 2:이익실현)
            profit = rowData.ik_near_prc.atof(),   // 익절가
            losscut = rowData.lo_near_prc.atof(),  // 손절가,
            bbgb = rowData.stls_bbgb, // 1:청산(Close On Trigger), 2:신규, 8:주문StopLoss, 9:잔고StopLoss( 잔고포지션 변경)
            slby_gb = rowData.slby_gb; // 매매구분 (1매도, 2매수)

        if (profit == 0 && losscut == 0) {
            return {text:""};
        }
        var sign = "", value = "", value1="";
        if (profit > 0 && losscut > 0) {
            if (column.mask) {
                value  = profit  > 0 ? maskstr.GridFormat(column.mask, { text: rowData.ik_near_prc }) : "-";
                value1 = losscut > 0 ? maskstr.GridFormat(column.mask, { text: rowData.lo_near_prc }) : "-";
            } else {
                value  = profit > 0 ?  rowData.ik_near_prc : "-";
                value1 = losscut > 0 ? rowData.lo_near_prc : "-";
            }
            return { text: value + "/" + value1 };
        }

        if (stls_stgb == '2' && profit > 0) {    // 이익실현
            sign  = slby_gb == '2' ? ">=" : "<="; 
            value = rowData.ik_near_prc;

        } else if (stls_stgb == '1' && losscut > 0) { // 로스컷
            sign = slby_gb == '2' ? "<=" : ">=";
            value = rowData.lo_near_prc;
        }

        if (value != "" && column.mask)
            value = maskstr.GridFormat(column.mask, { text: value })

        return { text: sign + value  };
    }

    // --> [Edit] 수정자:kim changa 일시:2019/12/06
    // 수정내용> 결함화면 1085 ( 추후개발) 엑셀보내보기 기능( 페이지 데이터)
    var _getXLFormat = function (ui, obj) {
        var mk = _MaskFormat(ui.mask),sp,
            dataIndx = ui.column.dataIndx,
            dataType = ui.column.dataType;
        // 정렬기능 fn.copyStyle()
        if (ui.column.align) {
            var align = "";
            if (!obj.style) obj.style = "";
            if (obj.style.length > 0)
                obj.style += "; ";
            align = "text-align:" + ui.column.align + ";";
            obj.style += align;
        }

        if (dataIndx) {
            if ((mk.gubun == 1 && mk.comma) || (dataType == "float" || dataType == "integer")) {
                if (!ui.rowData._format) {
                    ui.rowData["_format"] = {}
                }
                ui.rowData._format[dataIndx] = "###,##0";  // ###,###-> ###,##0   0값을 표시하기 위해서
                sp = obj.text.split('.');
                if (sp && sp.length > 1) {
                    ui.rowData._format[dataIndx] = "###,##0." + "0".repeat(sp[1].length);
                }

                // 뒷첨자 붙이기
                if (mk.sufix && ui.rowData._format[dataIndx]) {
                    ui.rowData._format[dataIndx] += mk.sufix;
                }
            } else {
                if (obj.text)
                    obj.text = obj.text.removeAll("&nbsp");
            }
        }
    };
    // <-- [Edit] kim changa 2019/12/06  

    // 글자색 클래스이름을 취득하는 함수
    var _GetColumnTextColor = function (ui, option) {
        var itemMode = ui.options.itemModel || {}, item;
        var value;
        switch (option) {
            case 1: case 2:// 기준가
                value = itemMode.baseItem != undefined ? ui.rowData[itemMode.baseItem] : undefined;
                break;
            case 4:  // 체결성향
                value = itemMode.cheItem != undefined ? ui.rowData[itemMode.cheItem] : undefined;
                break;
            case 3:   // 부호
            case 5:   // 부호
                value = itemMode.signItem != undefined ? ui.rowData[itemMode.signItem] : undefined;
                break;
            default:
                return ui.obj;
                break;
        }
        if (value == undefined) return ui.obj;

        if (option == 1) {      // 대상값 >,< 참조Item
            value = parseFloat(value);
            var cellValue = parseFloat(ui.cellData);
            if (cellValue > value) // 상승
                ui.obj.cls = ui.obj.cls + " up_txt";
            else if (cellValue < value) // 하락
                ui.obj.cls = ui.obj.cls + " low_txt";
        }
        else if (option == 2) {  // 참조Item >, <  비교
            value = parseFloat(value);
            if (value > 0)    // 상승
                ui.obj.cls = ui.obj.cls + " up_txt";
            else if (value < 0)  //하락
                ui.obj.cls = ui.obj.cls + " low_txt";
        } else if (option == 4) {  // 체결성향(cheItem) 항목으로 비교("1":매도체결, "2":매수체결)
            value = parseFloat(value);
            if (value == 1)
                ui.obj.cls = ui.obj.cls + " low_txt";
            else if (value == 2)
                ui.obj.cls = ui.obj.cls + " up_txt";
        }
        else if (option == 5) {  // 대비부호로 색정보 반영
            ui.obj.cls = ui.obj.cls + " " + value.getSignColor();
        }
        return ui.obj;
    }

    // 상승,하락,상한,하한가 등의 부호표시
    var _UpDownSign = function (ui, signColumn) {
        var value;
        if (signColumn != undefined) {
            value = ui.cellData;
        }
        else {
            var itemMode = ui.options.itemModel || {};
            if (itemMode.signItem == undefined) return ui.obj;

            value = ui.rowData[itemMode.signItem];
        }

        if (value == undefined) return ui.obj;
        // 기준등락부호값을 취득한다.
        var cls = value.getUpDownSignCls();
        if (cls != "")
            ui.obj.cls = ui.obj.cls + " " + cls;

        return ui.obj;
    };



    var grid = function () {
        var version = "1.0";

        this.scrollObj = null;

        this.gridtype = "0";       //0-가로 1-세로
        //this.rowcnt    = 20;
        //this.headercnt = 1;
        //this.bodycnt = 1;
        this.rqname = "";
        this.realname = "";

        this._gPQ = null;
        this.$grid = null;

        this.scrollmode = false;
        this.scrolloption = {};
        //this.xmlNode = null;
        this.listeners = {};
        this.comm_list = [];
        this.itemflag = "2";   // 기본값
        this.datatype = gridDataType.TOPINSERT;
        this.realitem = [];
        this.keyItmes = [];   // 키컬럼 정보
        //this.realMng = {};
        this.referitem = {}; // 참조항목
        this.fncustom = {};
        this.maxcount = 0;
        this.rqcount = 20; //조회요청건수
        this.nextKey = "";
        this.nextKeyLen = 0;
        this.showLoading = false;
        this.empty = false;
        //this.realMng = {};
        this._realMng = null;
        this._realArrayMode = false;
        this.targetDiv = null;
		this.pagination = false;
        this.autopage = false;
		this.pagecount = 10;  // pagination사용시에 페이지 개수
		// 가공한 데이터를 들고 있을 플래그
		this.curPage = 1;  // 페이지인덱스값
		this.pageNum = 1;
		this.pFlag = true;

		this.symbol = '';
    }

    grid.prototype = {
        // 각 컨트롤의 파괴함수
        onDestroy: function () {
            //this.realMng = {};
            if (this._realMng) {
                this._realMng.destroy();
                this._realMng = null;
            }

            if (this.$grid) {
                //$("#" + this.id + " .pq-grid-center").mCustomScrollbar("destroy");
                //$("#" + this.id + " .pq-body-outer").mCustomScrollbar("destroy");

                /*
                if (this.scrollObj) {
                    this.scrollObj.destroy();
                }
                */
                if (this.canvas) {
                    if (this.canvasGrid) this.canvasGrid = null;
                } else {
                    var $element = this.GetElemnt();
                    try{
                        $element.pqGrid("destroy");
                    }
                    catch(e){
                        console.log(e);
                    }
                }
            }
        },

        // 컨트롤 로드 기능
        propertyLoad: function (node, nodeName, xmlHolderElement) {

            var that = this,
                cls = ["grid"], // 클래스 정보명
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: this.id } // HTML Attri 정의하는 정보 설정

            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            var objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                return ["options"];
            });
            attr["class"] = cls.join(" ");

            // --> [Edit] 수정자:kim changa 일시:2019/11/04
            // 수정내용> ver 6.2.4 local 속성기능 변경 fni.setLocale() 
            if ( !objXML.options.locale )
                objXML.options.locale = local_lang || "ko";
            // <-- [Edit] kim changa 2019/11/04

            // --> [Edit] 수정자:kim changa 일시:2019/06/28
            // 수정내용> strNoRows,title 값을 설정한다(다국어를 사용하는 경우만 설정)
            //strNoRows,title 값을 지정하는 기능;
            if (objXML.options.textcontext) {
                var tt = objXML.options.textcontext, title = tt.title, strNoRows = tt.strNoRows;
                if (title) {
                    objXML.options["title"] = hi5.isObject(title)? x2h.xmlGetMultiLangText(title): title;
                }
                if(strNoRows){
                    objXML.options["strNoRows"] = hi5.isObject(strNoRows)? x2h.xmlGetMultiLangText(strNoRows): strNoRows;
                }
                delete objXML.options.textcontext;
            }
            /*
            if (objXML.options.nodata && !hi5.isEmpty(objXML.options.nodata)) {
                objXML.options["strNoRows"] = x2h.xmlGetMultiLangText(objXML.options.nodata);
                delete objXML.options.nodata;
            }
            */
            // <-- [Edit] kim changa 2019/06/28


            // <grid><![CDATAT[ ~~~ ]]></grid>
            if (objXML.css === "1") {
                this.objParentForm._style += x2h.xmlGetText(node);
            }

            this.realitem = [];
            if (objXML.realitem) {
                var realitems = objXML.realitem.split(",");
                realitems.forEach(function (data, idx) {
                    that.realitem.push(data);
                    that.objParentForm.realitems[data] = [];
                })
            }

            if (style.length) {
                style[0] = x2h.getColorReplace(style[0], true);   // {color}값을 취환하는 기능
                attr["style"] = style.join("");
            }
            style = x2h.attri(xmlHolderElement, attr);
            // --> [Edit] 수정자:kim changa 일시:2019/02/01
            // 수정내용> position 속성이 없으면 없는것으로 사용한다.
            //if (style.position === "")
            //   style.position = "absolute";
            // <-- [Edit] kim changa 2019/02/01
            if (style.overflow === "")
                style.overflow = "hidden";

            //페이지 네이션 사용 유무 환경설정 값에 따라 처리(오토페이지 TRUE인 경우만 처리함)
            if (this.autopage) {
                if (!this.referitem.totCount) {
                    this.pagination = g_hi5_config.usePage;
                }
            }
            // --> [Edit] 수정자:kim changa 일시:2019/11/07
            // 수정내용> 어드민 화면에서 Scroll 선택모드에 따라서 커스텀 Scroll 사용유무 제어
            if (hi5.WTS_MODE == WTS_TYPE.MDI && g_hi5_config ) {
                if ( g_hi5_config.scrollType == 0 )
                    this.scrollmode = false;
            }

            // 아이템을 툴팁으로 표시하는 옵션
            if (hi5_DebugLevel && hi5_DebugLevel.tp_item_show) {
                if (!objXML.options.tooltip) {
                    objXML.options.tooltip = {
                        tp_item_show: true
                    }
                }
            }
            // <-- [Edit] kim changa 2019/11/07

            //this.empty = x2h.xmlGetAttr(node, "empty", this.empty);  // 빈그리드 사용유무

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            var htmlNode = null;
            if (this.fncustom.anchor) {
                // 부모컨테이너 태그를 작성한다.
                var objAnchor = this.fncustom.anchor;;

                htmlNode = x2h.createXmlElement(xmlHolderElement, "div");
                xmlHolderElement.appendChild(htmlNode);

                this.$html = $(htmlNode);this.html  = htmlNode;

                // --> [Edit] 홍민호 2019/05/03 // grid anchor 처리 수정(bottom,right값 설정되도록 변경함)
                //var str = "bottom:0px; height:auto; position:absolute;border:0;"
                //str += "left:" + (objAnchor.left ? objAnchor.left : style.left) + ";"
                //str += "top:" + (objAnchor.top ? objAnchor.top : style.top) + ";"
                var str = "position:absolute;border:0;"
                str += "left:" + (objAnchor.left ? objAnchor.left : style.left) + ";"
                str += "top:" + (objAnchor.top ? objAnchor.top : style.top) + ";"
                str += "right:" + (objAnchor.right ? objAnchor.right + "px" : (style.right ? style.right : "0px")) + ";"
                str += "bottom:" + (objAnchor.bottom ? objAnchor.bottom + "px" : (style.bottom ? style.bottom : "0px")) + ";"
                // <-- [Edit] 홍민호 2019/05/03 //

                //x2h.xmlSetAttr(xmlHolderElement, "id", "p_"+this.id);
                //x2h.xmlSetAttr(xmlHolderElement, "style", str);
                //x2h.xmlSetAttr(xmlHolderElement, "class", c);
                x2h.attri(xmlHolderElement, { id: "p_" + this.id, "class": attr.class, style: str });

                objXML.options.height = objAnchor.gridheight ? objAnchor.gridheight : "100%";
                objXML.options.width  = objAnchor.gridwidth ? objAnchor.gridwidth : "100%";

                style = x2h.attri(htmlNode, attr);
                if (style.position === "")
                    style.position = "absolute";
                if (style.overflow === "")
                    style.overflow = "hidden";

                // 실제그리드 위치 변경
                style.top  = objAnchor.gridtop  ? objAnchor.gridtop  : "0px";
                style.left = objAnchor.gridleft ? objAnchor.gridleft : "0px";

                // 그리드 부모 컨테이너 태그 넓이 스타일값을 지정한다.
                //var $div = $("#p_" + this.id);
                //$div.css("width", objXML.options.width );
                // --> [Edit] 홍민호 2019/05/03 // grid anchor 처리 수정(bottom,right값 설정되도록 변경함)
                // right를 주게 바꿔서 불필요하여 주석처리함
                //xmlHolderElement.style.width = objXML.options.width;
                // <-- [Edit] 홍민호 2019/05/03 //
                //this.fncustom.anchor = {};
            }
            this.$grid = this.$html;
            if (!this.empty) {
                // canvas 사용 유무
                if (objXML.canvas && objXML.canvas === "1") {

                    xmlHolderElement.style.width = objXML.options.width;
                    xmlHolderElement.style.height = objXML.options.height;

                    this.canvas = objXML.canvas;
                    this.canvasGrid = new canvasGrid(this, objXML.options);

                    var self = this;
                    (function add_comm_list(gridObj) {
                        var colMarr = gridObj.colModel;
                        //console.log("colMarr : " + colMarr);
                        var len = colMarr ? colMarr.length : 0;
                        for (var i = 0; i < len; i++) {
                            var column = colMarr[i];
                            // Fid 또는 아이템 정보를 반환
                            if (column.dataIndx && column.itemflag != "0") self.comm_list.push(column.dataIndx);
                        }

                        // 기준가, 등락부호,체결성향
                        if (gridObj.itemModel) {
                            var itemM = gridObj.itemModel || {};
                            // Fid 또는 아이템 정보를 반환
                            if (itemM.baseItem) self.comm_list.push(itemM.baseItem);
                            if (itemM.signItem) self.comm_list.push(itemM.signItem);
                            if (itemM.cheItem) self.comm_list.push(itemM.cheItem);
                        }
                    })(objXML.options);

                } else {
                    this.setGridInit(objXML.options);
                    //this.xmlNode = node;
                }
            }
            

            if (this.referitem) {
                if (this.referitem.comAddItem) {
                    this.comm_list = this.comm_list.concat(this.referitem.comAddItem);
                }
            }

            switch (this.datatype) {
                case gridDataType.TOPINSERT:
                case gridDataType.CIRCULAR:
                    this._realArrayMode = true;
            }
        },

        /// <member id="requestDataCount" kind="method">
        /// <summary>그리드 데이터 요청건수 취득 및설정 하는 함수</summary>
        /// <remarks> 그리드 데이터 요청함수( 취득시는 인자값 없음, 설정시는 숫자형 개수 입력) </remarks>
        /// <returns type="number">  데이터 요청건수 </returns>
        /// <example ref="true" file="grid_example" />
        /// </member>
        requestDataCount: function () {
            if (arguments.length) {
                this.rqcount = arguments[0];
                if (this.pagination) {
                    //gridObj.pageModel = { type: "local", rPP: this.rqcount, strRpp: "{0}"};
                    this._pq.options.pageModel = { type: "", rPP: this.rqcount, strRpp: "{0}" };
                }
                return;
            }
            return this.rqcount;
        },
        
        //[Edit] ==> 2021/01/06 hyun
        /// <member id="SetGridHeight" kind="method">
        /// <summary>그리드 show/hide 대신 toggleClass 이용시, 그리드 사이즈 조절</summary>
        SetGridHeight : function (newHeight) {
            this._gPQ.options.height = newHeight - 3;
        },

        /// <member id="GetStyle" kind="method">
        /// <summary>그리드 컨트롤의 객체에서 스타일정보를 취득하는 공통함수</summary>
        /// <remarks> style 인자값은 그리드 스타일 관련 속성값만 정의</remarks>
        /// <param name = "style" type="string|object"> 스타일명 지정</param>
        /// <returns type="string|object"> 인자값에 해당하는  스타일값 반환</returns>
        /// <example ref="true" file="grid_example" />
        /// <see cref="../Method/dispidGetProp.htm">GetProp 함수참고</see>
        /// <see cref="../Method/dispidSetProp.htm">SetProp 함수참고</see>
        /// <see cref="../Method/dispidSetStyle.htm">SetStyle 함수참고</see>
        /// </member>
        GetStyle: function (style) {
            var $element = this.GetElemnt(), val = null;
            if ($element.length() > 0)
                val = $element.css(style);
            return val;
        },

        /// <member id="SetStyle" kind="method">
        /// <summary>그리드 컨트롤의 객체에서 스타일정보를 설정하는 공통함수</summary>
        /// <remarks> style 인자값은 그리드 스타일 관련 속성값만 정의</remarks>
        /// <param name = "style" type="string|object"> 스타일명 지정</param>
        /// <param name = "value" type="string|object|function"> 스타일의 값</param>
        /// <example ref="true" file="grid_example" />
        /// <see cref="../Method/dispidGetProp.htm">GetProp 함수참고</see>
        /// <see cref="../Method/dispidSetProp.htm">SetProp 함수참고</see>
        /// <see cref="../Method/dispidGetStyle.htm">GetStyle 함수참고</see>
        /// </member>
        SetStyle: function (style, value) {
            var $element = this.GetElemnt();
            // ColorIndex를 사용하는 경우({21})
            if (typeof (value) === "string")
                value = x2h.getColorReplace(value);

            typeof (style) === "object" ? $element.css(style) : $element.css(style, value);
            return;
        },

        /// <member id="GetProp" kind="method">
        /// <summary>그리드 컨트롤의 객체에서 Attribute정보를 취득하는 공통함수</summary>
        /// <remarks> Attribute 인자값은 그리드 Attribute값만 정의</remarks>
        /// <param name = "propName" type="string"> Attribute명 지정</param>
        /// <returns type="string"> 인자값에 해당하는  Attribute값 반환</returns>
        /// <example><![CDATA[
        ///    1. "title" 취득하는 예제
        ///     var text = grid.GetProp ('title');
        /// ]]></example>
        /// <see cref="../Method/dispidSetProp .htm">SetProp 함수참고</see>
        /// <see cref="../Method/dispidGetStyle.htm">GetStyle 함수참고</see>
        /// <see cref="../Method/dispidSetStyle.htm">SetStyle 함수참고</see>
        /// </member>
        GetProp: function (propName) {
            var $element = this.GetElemnt(), val = "";
            if (typeof (propName) === "string" && propName == "itemflag") {
                return this.itemflag;
            } else if (typeof (propName) === "string" && propName == "maxcount") {
                return this.maxcount;
            }
            val = $element.attr(propName);
            return val;
        },

        /// <member id="SetProp" kind="method">
        /// <summary>그리드 컨트롤의 객체에서 Attribute정보를 설정하는 공통함수</summary>
        /// <remarks> Attribute 인자값은 그리드 Attribute값만 정의</remarks>
        /// <param name = "propName" type="string"> Attribute명 지정</param>
        /// <param name = "value" type="string|object"> Attribute명 지정</param>
        /// <example><![CDATA[
        ///    1. "title" 설정하는 예제
        ///     grid.SetProp('title', "타이틀명");
        ///    2. 복수 속성을 변경하는 예제
        ///     grid.SetProp({ alt: "툴팁내용", title : "제목내용"});
        /// ]]></example>
        /// <see cref="../Method/dispidGetProp .htm">GetProp 함수참고</see>
        /// <see cref="../Method/dispidGetStyle.htm">GetStyle 함수참고</see>
        /// <see cref="../Method/dispidSetStyle.htm">SetStyle 함수참고</see>
        /// </member>
        SetProp: function (propName, value) {
            if (typeof (propName) === "string" && propName == "itemflag") {
                this.itemflag = Number(value); return;
            } else if (typeof (propName) === "string" && propName == "maxcount") {
                this.maxcount = Number(value); return;
            }

            var $element = this.GetElemnt();
            typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, value);
        },

        // HTML 요소객체 취득
        GetElemnt: function () {
            return this.$html;
        },

        //function formatMask(ui) {
        //   var cellData = ui.cellData,   colIndx  = ui.colIndx, dataIndx = ui.dataIndx, rowData = ui.rowData, column = ui.column, rowIndx = ui.rowIndx;

        // }
        setGridInit: function (gridObj) {
            var e = this.$html;   // e.g., $( "#grid_json" );
            var self = this;
            // --> [Edit] 수정자:lee nohan 일시:2019/11/28
            // 수정내용> 그리드 컬럼 date일경우, 달력 설정 함수
            var dateEditor = function (ui) {
                var $inp = ui.$cell.find("input"),
                    grid = this,
                    format = ui.column.format || "yy/mm/dd",
                    val = $.datepicker.formatDate(format, new Date($inp.val()));
    
                //initialize the editor
                $inp
                .attr('readonly', 'readonly')
                .val(val)            
                .datepicker({
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: format,
                    showAnim: '',
                    onSelect: function () {
                        this.firstOpen = true;                   
                    },
                    beforeShow: function (input, inst) {
                        setTimeout(function () {
                            //to fix the issue of datepicker z-index when grid is in maximized state.
                            $('.ui-datepicker').css('z-index', 999999999999);
                        });
                        return !this.firstOpen;
                    },
                    onClose: function () {
                        this.focus();
                    }
                });
            }
            // <-- [Edit] lee nohan 2019/11/28

            // 컬럼정보에 render 함수 설정
            var nestedCols = function (gridObj, colMarr, childCount) {
                var len = colMarr ? colMarr.length : 0;
                for (var i = 0; i < len; i++) {
                    var column = colMarr[i];
                    // 키 컬럼
                    if (column.keyItem) {
                        self.keyItmes.push(column);
                    }

                    // 커스 소스이벤트 빈환
                    if ( column.sortType ){
                        column.sortType = function( rowData1, rowData2, dataIndx ){
                            if (self.OnCustomSort)
                                return self.OnCustomSort(rowData1, rowData2, dataIndx);
                            
                            return 0;
                        };
                        /// <member id="OnCustomSort" kind="event">
                        /// <summary>커스텀 소스를 처리하는 이벤트 함수</summary>
                        /// <remarks ref="true" file="grid_example" />
                        /// <param name = " rowData1"   type="object"> 행 데이터 객체</param>
                        /// <param name = " rowData2"   type="object"> 행 데이터 객체</param>
                        /// <param name = "dataIndx" type="string"> 자동갱신 데이터 객체 </param>
                        /// <example ref="true" file="grid_example" />
                        /// <shortcut key="OnCustomSort" url="https://paramquery.com/pro/demos/sorting_custom"> 커스텀소스 예제 사이트</shortcut>
                        /// </member>

                    }
                    //if (gridObj.sortModel == undefined ) {
                    //    if (column.datatype && column.cb == undefined )
                    //        delete column.datatype;
                    //}

                    // 원본컬럼사이즈를 저장한다.
                    if (gridObj._auto_resize) {
                        column._o_width = column.width;
                    }

                    column.title = column.title ? column.title : "";
                    // 다국어 타이틀
                    if (column.multi) {
                        column.title = column.multi[local_lang] != undefined ? column.multi[local_lang] : "";
                        delete column.multi;
                    }

                    // --> [Edit] 수정자:lee nohan 일시:2019/11/28
                    // 수정내용> 그리드 컬럼 date일경우, 달력 표시하도록 설정
                    if(column.dataType && column.dataType == "date"){
                        //debugger;
                        column.editor = {
                            type: 'textbox',
                            init: dateEditor,
                            getData: function (ui) {
                                //convert from column format to native js date format "mm/dd/yy"
                                //var dt = $.datepicker.parseDate(ui.column.format, ui.$cell.find("input").val());
                                var dt = $.datepicker.parseDate("yy/mm/dd", ui.$cell.find("input").val());
                                return $.datepicker.formatDate("yy/mm/dd", dt);
                            }
                        };
                        // column.validations = [
                        //     { type: 'regexp', value: '^[0-9]{2}/[0-9]{2}/[0-9]{4}$', msg: 'Not in date format' }
                        // ];
                    }
                    // <-- [Edit] lee nohan 2019/11/28

                    // --> [Edit] 수정자:kim changa 일시:2019/03/23
                    // 수정내용> 체크박스인 경우 Edit 불가 상태
                    if (column.editable || column.type) {
                        if (column.type == "checkBoxSelection") {
                            column.editor = { type: "checkbox" };
                            gridObj.editable = false;
                        }else{
                            gridObj.editable = true;
                        }
                    }
                    // <-- [Edit] kim changa 2019/03/23


                    if (column.btn) {
                        //fn_postRender(column);
                        // postRenderInterval 값이 미 정의된 상태이면 강제로 -1로 한다.
                        if (gridObj.postRenderInterval === undefined) gridObj.postRenderInterval = -1;
                        column['sortable'] = false; // 소트기능은 무조건 무시를 한다.


                        column.postRender = function (ui) {
                            /// <member id="OnColumnPostRender" kind="event">
                            /// <summary>전체 뷰가 렌더링 된후에 셀 정보를 조작하도록 이벤트 함수</summary>
                            /// <remarks ref="true" file="grid_example" />
                            /// <param name = "ui" type ="object"> render 객체 </param>
                            /// <example ref="true" file="grid_example" />
                            /// <see cref="../Event/eventidOnCellButtClick.htm">OnCellButtClick 함수 참고</see>
                            /// </member>
                            var rowIndx = ui.rowIndx, grid = this, $cell = grid.getCell(ui);
                            if (self.OnColumnPostRender) {
                                self.OnColumnPostRender(ui);
                            }
                            else {
                                var options = ui.column.btn || {};
                                options.label = ui.column.bodytitle; //20191010 윤성욱 그리드 버튼 다국어 위해 수정
                                var cls = options.class != undefined ? options.class : "",
                                    icons = options.icon != undefined ? options.icon : "",
                                    $btn = cls == "" ? $cell.find("button") : $cell.find("." + cls);

                                if (icons != "") {
                                    $btn.button({ icons: { primary: icons } } )
                                    .off("click").on("click", function (evt) {
                                        if (self.OnCellButtClick)
                                            self.OnCellButtClick(ui);
                                    });
                                } else if (options.textlink) {
                                    $btn.off('click').on('click', function( e ) {
                                        if (self.OnCellButtClick)
                                            self.OnCellButtClick(ui);
                                    });
                                } else {
                                    $btn.button(options).bind("click", function () {
                                        /// <member id="OnCellButtClick" kind="event">
                                        /// <summary>셀 단위 버튼 클릭시에 발생되는 이벤트 함수</summary>
                                        /// <remarks ref="true" file="grid_example" />
                                        /// <param name = "ui" type ="object"> render 객체 </param>
                                        /// <example><![CDATA[
                                        ///     OnColumnPostRender() 함수 참고
                                        /// ]]></example>
                                        /// <see cref="../Event/eventidOnColumnPostRender.htm">OnColumnPostRender 함수 참고</see>
                                        /// </member>
                                        if (self.OnCellButtClick)
                                            self.OnCellButtClick(ui);
                                    });
                                }
                            }
                        }
                    }
                    // Fid 또는 아이템 정보를 반환
                    if (column.dataIndx && column.itemflag != "0") self.comm_list.push(column.dataIndx);
                    column.render = function (ui) {
                        var $self = self, $that = this;
                        var o = $that.options,
                            column = ui.column,
                            mask = column.mask;
                        var rowData = ui.rowData, cellData = ui.cellData, rowIndx = ui.rowIndx, dataIndx = column.dataIndx, colIndx = ui.colIndx;
                        var symboColor = column.symbolcolor || {};
                        var value, obj;

                        // 이벤트 발생
                        if (self.OnColumnRender)
                            obj = self.OnColumnRender(ui);

                        if (obj && obj.text != undefined) {
                            // --> [Edit] 수정자:kim changa 일시:2019/12/06
                            // 수정내용> 결함화면 1085 ( 추후개발) 엑셀보내보기 기능( 페이지 데이터)
                            if (ui.Export && !obj._xlsformat) {
                                if(typeof(obj.text) != "string")    obj.text = obj.text.toString();
                                obj.text = obj.text.removeAll();  // ,를 전부 제거한다.
                                _getXLFormat(ui, obj);
                            }
                            // <-- [Edit] kim changa 2019/12/06   
                            return obj;
                        }

                        if (!obj) obj = {};

                        //결함번호 1030 수정건
                        // --> [Edit] 20191203 leenohan
                        // rowData에서 뽑을때, 어떤 tr은 symbol, 어떤 tr은 code로 되어있어서 symbol을 못뽑고 priceF()등의 함수를 태우면
                        // if (code == '') code = self.symbol; 이부분때문에 소수점이 엉키는 현상이 발생한다...
                        var code = rowData.symbol ? rowData.symbol : rowData.code ? rowData.code : "";    //미체결,체결내역,잔고는 종목코드가 있으니 그걸 넘긴다. 2018.12.6 kws
                        // <-- [Edit] 20191203 leenohan
                        if (code == '') code = self.symbol;
                        if (column.coinprice) {  // 코인가격
                            cellData = hi5.priceF(code, cellData);
                            if (!mask) {
                                obj.text = cellData;
                            }
                        }
                        if (column.coinqty) {    // 코인수량
                            cellData = hi5.setQtyF(code, cellData);
                            if (!mask) {
                                obj.text = cellData;
                            }
                        }

                        if (column.btn) {
                            if (obj.btnSkip === undefined) {  // 버튼을 표시하지 않는 옵션
                                var title = column.bodytitle[local_lang] || "", style; //21091010 윤성욱 btn.label -> bodytitle[local_lang] 수정
                                if (self.fontSize === undefined)
                                    self.fontSize = hi5.getStyle(self.$html[0], "font-size").atoi();

                                style = " line-height:" + (o.rowHt - self.fontSize) + "px;";
                                if (obj.text != "") {
                                    obj.text = "<button type='button' class=" + (column.btn.class === undefined ? "" : column.btn.class) + ">" + title + "</button>";
                                    if (obj['style'] == undefined) {
                                        obj['style'] = style;
                                    } else {
                                        obj['style'] += style;
                                    }
                                }
                            }
                        }
                         
                        var opCal = column.opCal || 0;
                        opCal = column.hidden !== false ? opCal : 0;

                        //Stop Price(컬럼)
                        if (opCal == 8) {   
                            obj = _stopPrice(rowData, column);
                            return obj;
                        }
                        if (mask) {
                            var symbol, citem;
                            if (column.coinqty) {  // 코인수량 자동마스킹 처리
                                if (self.referitem.item && self.referitem.item.codeitem) {
                                    citem = self.referitem.item.codeitem;
                                } else if (self.keyItmes.length > 0) {
                                    citem = self.keyItmes[0].dataIndx;
                                }
                                if (citem) {
                                    symbol = ui.rowData[citem];
                                    if (symbol)
                                        obj.text = maskstr.GridFormat(mask, { text: cellData, code: symbol, Export: ui.Export });
                                }
                            }

                            if (symbol == undefined)
                                obj.text = maskstr.GridFormat(mask, { text: cellData, Export: ui.Export, opCal: opCal }); // --> [Edit] 수정자: 윤성욱 일시:2019/09/24 ui.colum.opCal 인수 추가
                            // --> [Edit] 수정자:kim changa 일시:2019/12/06
                            // 수정내용> 결함화면 1085 ( 추후개발) 엑셀보내보기 기능( 페이지 데이터)
                            if (ui.Export && obj.text !== "") {
                                _getXLFormat(ui, obj);
                            }
                            // <-- [Edit] kim changa 2019/12/06

                        }

                        // --> [Edit] 수정자:kim changa 일시:2019/01/14
                        // 수정내용> 코드값으로 텍스트 변환
                        if (ui.column.codeconvert) {
                            obj.text = hi5.getCodeConvert({ file: ui.column.codeconvert.file, key: ui.column.codeconvert.key, code: cellData })
                            //콤보로 구성한다
                            if ($hi5_comboJson[ui.column.codeconvert.key] != undefined) {
                                var tempList = [], tempObj = {};
                                var arList = $hi5_comboJson[ui.column.codeconvert.key];
                                if (arList && arList.length > 0) {
                                    for (i = 0 ; i < arList.length; i++) {
                                        tempObj = {};
                                        tempObj["value"] = Object.keys(arList[i]);
                                        tempObj["text"] = arList[i][tempObj["value"]][local_lang];

                                        tempList.push(tempObj);
                                    }
                                }
                                ui.column.editable = true;
                                ui.column.editor = {type: 'select',valueIndx: "value",labelIndx: "text",options: tempList};
                            }
                        }
                        // <-- [Edit] kim changa 2019/01/14

                        obj.cls = obj.cls || "";

                        if (column.cursor) {    // cursor - pointer
                            obj.cls += " cell_pointer";
                        }
                        // 색 정보
                        if (symboColor.negtiv || symboColor.bitcolor)   //  데이터 양수/음수인경우 색 정보 적용
                        {
                            obj.cls = cellData ? cellData.signCheck().getSignColor(obj.cls) : "";
                        }  else if (symboColor.sellbuy) {  // 매도/매수 글자색
                            if(cellData && cellData != '' ){
                                obj.text = cellData.SellBuy("codetext");
                                obj.cls = obj.cls + " " + cellData.SellBuyCls();
                            }
                        }

                        switch (opCal) {
                            case 1:     // 대상값 >,<,== item값 비교
                            case 2:     // item값 > 0, < 0,
                            case 4:     // 체결성향(cheItem) 항목으로 비교("1":매도체결, "2":매수체결)
                            case 5:     // 등락부호로 색정보 반영
                                {
                                    // 기준가가격(baseItem) 비교
                                    obj = _GetColumnTextColor({
                                        rowData: rowData,
                                        obj: obj,
                                        options: o,
                                        cellData: cellData
                                    }, opCal);
                                }
                                break;
                            case 3: {             //  등락부호(signItem) 항목으로 비교
                                var ob = {
                                    rowData: rowData,
                                    obj: obj,
                                    options: o,
                                    cellData: cellData
                                };
                                obj = _UpDownSign(ob);
                            }
                                break;
                        }
                        // 등락부호 컬럼이면 부호표시
                        if (symboColor.sign && column.hidden !== false) {
                            obj = _UpDownSign({ obj: obj, cellData: cellData }, symboColor.sign);
                            obj.text = obj.text ? "" : obj.text;  // 등락부호컬럼이면 데이터는 지운다.
                        }

                        // --> [Edit] 수정자:kim changa 일시:2019/05/28
                        // 수정내용> 엑셀내보내기 기능
                        if (dataIndx && ui.Export && !mask) {
                            if (/^[0-9]+$/i.test(cellData)) {
                                if (!rowData._format) {
                                    rowData["_format"] = {}
                                }
                                rowData._format[dataIndx] = "@";
                            }
                        }
                        // <-- [Edit] kim changa 2019/05/28
                        return obj;
                    }

                    if (column.formulaExp) {
                        column.formula = function (ui) {
                            var $self = self, $that = this;
                            var val;

                            /// <member id="OnFormula" kind="event">
                            /// <summary>Formula 계산을 위한 이벤트 발생</summary>
                            /// <remarks>사용자 직법 계산식을 기술에서 경과값을 반환하는 기능</remarks>
                            /// <param name = "rowData" type="object"> 행 데이터 객체 </param>
                            /// <param name = "column" type="object"> Column 객체 </param>
                            /// <returns type="string"> 계산 결과값</returns>
                            /// <example><![CDATA[
                            ///  grid.OnFormula = function(rowData, column)
                            ///  {
                            ///      // "item1" 항목과 "item2" 항목을 합한 결과값을 "item3" 컬럼값에 데이터를 표시하는 예제
                            ///      var r = rowData;
                            ///      if ( column.dataIndx == "item3" )   // "item3" 컬럼인지를 비교
                            ///        return Number(r["item1"])+Number(r["item2"]);
                            ///  }
                            ///
                            /// ]]></example>
                            /// </member>
                            if (self.OnFormula) {
                                val = self.OnFormula(ui.rowData, ui.column);
                                if (val) return val;
                            }

                            if (ui.column.formulaExp != "=") {
                                var r = ui.rowData;
                                val = eval(ui.column.formulaExp);
                            }
                            return val;
                        }
                    }

                    var child_CM = column.colModel;
                    if (child_CM && child_CM.length) {
                        var count = nestedCols(gridObj, child_CM, childCount);
                        childCount = count;
                    }
                    else {
                        childCount++;
                    }
                }
                return childCount;
            };
            var count = nestedCols(gridObj, gridObj.colModel, 0);
            //if (hi5_deviceType == "M")
            //    gridObj.virtualY = false;
            /*
                        // MDI 모드인 경우
                        if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                            if (gridObj.title) {
                                // 다국어 처리를 한다.
                                gridObj.title = x2h.xmlGetMultiLangText( gridObj.title);
                            }
                        }
            */
            // --> [Edit] 수정자:kim changa 일시:2019/07/10
            // 수정내용> MDI 모드인 경우 복사, 엑셀보내기 기본으로 처리
            if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                if (!gridObj.contextMenu) {
                    gridObj['contextMenu'] = { on: true, head: false };
                    gridObj.contextMenu.system = ['copy', 'xlsx'];
                }
            }
            // <-- [Edit] kim changa 2019/07/10

            // 팝업메뉴
            // --> [Edit] 수정자:kim changa 일시:2019/05/28
            // 수정내용> 엑셀내보내기 기능
            var gridContextMenuSelect = null;
            if (gridObj.contextMenu) {
                if (!gridObj.contextMenu.on) gridObj.contextMenu.on = true;
                if (!gridObj.contextMenu.head) gridObj.contextMenu.head = false;
                // copy기능 적용시에 선택모드를 Cell 방식으로 변경
                var pops = gridObj.contextMenu.system ? gridObj.contextMenu.system : [];

                if (!gridObj.selectionModel && pops.includes("copy")) {
                    gridObj.selectionModel = {
                        type:"cell",
                        all: true, row: false, mode: "block"
                    }
                }

                gridContextMenuSelect = function (evt, ui, item) {
                    switch (item.name) {
                        case "Copy":
                            if (this.iSelection._areas[0].type == 'block' && this.iSelection._areas[0].rc > 1) {
                                var a,b,c,d,count =0;
                                var row = [];
                                a = this.iSelection._areas[0].r1;
                                b = this.iSelection._areas[0].r2;
                                c = this.iSelection;
                                for (a; a <= b; a++) {
                                    d = c;
                                    d._areas[0].r1 = a; d._areas[0].r2 = a; d._areas[0].rc = 1;
                                    row[count] = d.getValue().join("\t");
                                    count++;
                                }
                                var s = row.join("\n");
                            }
                            else {
                                var s = this.iSelection.getValue().join("\t");
                            }
                            //var s = ui.$td.html();
                            hi5.copyToClipboard(s);
                            //this.copy();
                            //var $ae = this.$cont.find(".pq-focus");
                            //$(document).trigger("keydown.pqExcel", { ctrlKey: true, target: $ae[0], keyCode:67});
                            break;

                        case "Export to Excel":  // 그리드 엘셀 보내기
                            self.SetExpertData();
                            break;
                        case "Paste":
                            this.paste();
                            break;
                        case "Excel From Server":  // 서버엑셀 다운로드
                            if (self.OnContextMenuClick)
                                self.OnContextMenuClick(evt, ui, item);
                            break;
                    }
                }
                // <-- [Edit] kim changa 2019/05/28

                gridObj.contextMenu["items"] = function (evt, ui) {
                    /// <member id="OnContextMenuClick" kind="event">
                    /// <summary>팝업메뉴 아이템을 클릭하면 발생하는 이벤트 함수</summary>
                    /// <param name = "evt" type="object"> 이벤트 객체</param>
                    /// <param name = "ui" type="object"> 데이터 객채 </param>
                    /// <param name = "item" type="object"> 해당 매뉴 객채 </param>
                    /// <returns type="array"> 배열 객체 반환</returns>
                    /// <example><![CDATA[
                    ///            이부분에 예제내용 기술한다...
                    /// ]]></example>
                    /// </member>

                    /// <member id="OnContextMenu" kind="event">
                    /// <summary>팝업메뉴 아이템을 구성하는 이벤트 함수</summary>
                    /// <remarks><![CDATA[그리드 팝업메뉴에 표시되는 항목을 구성하는 이벤트 함수
                    /// 객체 설명 ui: {
                    ///     $td?: jQuery //for body cell
                    ///     $th?: jQuery //for header cell
                    ///     colIndx: number //-1 for number cell
                    ///     rowIndx: number
                    ///     rowData: any
                    ///     dataIndx: string //undefined for group columns
                    ///     column: object //
                    ///     filterRow?: boolean //true for header filter row
                    ///  }
                    ///
                    /// ]]></remarks>
                    /// <param name = "evt" type="object"> 이벤트 객체</param>
                    /// <param name = "ui" type="object"> 데이터 객채 </param>
                    /// <returns type="array"> 배열 객체 반환</returns>
                    /// <example><![CDATA[
                    ///            이부분에 예제내용 기술한다...
                    /// ]]></example>
                    /// <shortcut key="contextMenu" url="https://paramquery.com/pro/api#option-contextMenu/"> contextMenu참고사이트</shortcut>
                    /// </member>

                    // --> [Edit] 수정자:kim changa 일시:2019/05/28
                    // 수정내용> 엑셀내보내기 기능
                    var items = [];
                    if (self.OnContextMenu) {
                        // 화면으로 이벤트 발생 시킨다.
                        items = self.OnContextMenu(evt, ui) || [];
                        if (items.length > 0 ) {
                            items.forEach(function(item,idx){
                                if(!item.separator){
                                    item['name'] = item.name[local_lang];
                                    if (self.OnContextMenuClick)
                                        item["action"] = self.OnContextMenuClick;
                                    else {
                                        item["action"] = hi5.contextAction;
                                    }
                                } else {
                                    items[idx] = 'separator';
                                }
                            });
                            items.push('separator');
                        }
                    }

                    if (!hi5.isEmpty(pops)) {
                        $.each(pops, function (idx, key) {
                            if (key == "" || key == "s") {
                                items.push('separator');
                            } else {
                                var item = gridPopup[key] ? hi5.clone(gridPopup[key]) : null;
                                if (item) {
                                    item.action = gridContextMenuSelect;
                                    items.push(item);
                                }
                            }
                        })
                        return items;
                    }
                    // <-- [Edit] kim changa 2019/05/28

                }
            }

            // 기준가, 등락부호,체결성향
            if (gridObj.itemModel) {
                var itemM = gridObj.itemModel || {};
                // Fid 또는 아이템 정보를 반환
                if (itemM.baseItem) self.comm_list.push(itemM.baseItem);
                if (itemM.signItem) self.comm_list.push(itemM.signItem);
                if (itemM.cheItem) self.comm_list.push(itemM.cheItem);
            }


            // 컬럼이름을 커스텀 하는 경우 (colModel title을 대문자Title)로 한다;
            //gridObj.columnTemplate = {
            //   title: function (ui) {
            //return ui.column.Title + " (" + ui.column.width + ")";
            //      return ui.column.Title ;
            // }
            //};


            // Edit 가능한 경우 Change 이벤트 발생
            /*
                var ui = {
                source: ui.source || "update",
                history: ui.history,
                checkEditable: ui.checkEditable,
                track: ui.track,
                allowInvalid: ui.allowInvalid,
                rowList: rowListNew
                }
            */

            if (gridObj.editable == true) {
                /// <member id="OnEditChange" kind="event">
                /// <summary>셀 Edit후에 발생되는 이벤트 함수</summary>
                /// <remarks><![CDATA[
                /// 셀을 인라인 편집하고 메서드 호출, 행/셀 붙여넣기,실행취소, 다시 실행을 통해 행 추가/업데이트/ 삭제로 인해 그리드 데이터가 변경된 후에 트리거됩니다.
                /// 행/셀 및 유효성 검사의 편집 가능성이이 이벤트 전에 발생하는지 확인합니다.
                /// 개별 셀마다 발화되기보다는 여러 셀이 함께 영향을받는 경우 (예 : 여러 셀 붙여 넣기, 실행 취소, 다시 실행 등)에만 실행됩니다.
                /// 이 이벤트는 그리드의 모든 데이터 변경에 대해 원격 서버를 친밀하게하는 데 적합합니다.
                ///  이 이벤트는 beforeValidate 이벤트와 동일한 ui 매개 변수를 갖지만 ui 매개 변수는이 이벤트에 대해 읽기 전용으로 간주된다는 점에서 중요한 차이가 있습니다.
                ///    - <var>ui...</var> 객체 상세 설명
                ///    <b>addList</b>
                ///      Type: Array
                ///     Array of added rows { rowIndx: rowIndx, newRow: newRow, rowData: rowData }; newRow and rowData are same
                ///    <b>updateList</b>
                ///      Type: Array
                ///     Array of updated rows { rowIndx: rowIndx, rowData: rowData, newRow: newRow, oldRow: oldRow }
                ///    <b>deleteList</b>
                ///      Type: Array
                ///     Array of deleted rows { rowIndx: rowIndx, rowData: rowData }
                ///    <b>source</b>
                ///      Type: String
                ///    origin of the change e.g., 'edit', 'update', 'add' , 'delete', 'paste', 'undo', 'redo' or a custom source passed to addRow, updateRow, deleteRow methods.
                ///    <b>allowInvalid</b>
                ///      Type: Boolean
                ///      Allows invalid value and adds an invalid class to the cell/cells.
                ///    <b>history</b>
                ///      Type: Boolean
                ///      Whether add this operation in history.
                ///    <b>checkEditable</b>
                ///      Type: Boolean
                ///      Checks whether the row/cell is editable before making any change
                /// ]]></remarks>
                /// <param name = "e" type="object"> Event 객체 </param>
                /// <param name = "ui" type="object"> Data객체  </param>
                /// <example><![CDATA[
                ///            이부분에 예제내용 기술한다...
                /// ]]></example>
                /// </member>
                gridObj.change = function (e, ui) {
                    if (self.OnEditChange) {
                        self.OnEditChange(e, ui);
                    }
                    //else
                    //{
                    //    if (ui.rowList != undefined && ui.rowList.length > 0) {
                    //        var rowIndx = ui.rowList[0].rowIndx;
                    //        this.refreshRow({ rowIndx: rowIndx });
                    //    }
                    //}
                }

                /// <member id="OnbeforeExport" kind="event">
                /// <summary>엑셀보내기 처리전에 발생되는 이벤트 함수</summary>
                /// <remarks>Triggered before data is exported. It can be used to show/hide the necessary rows/columns in the exported data.</remarks>
                /// <param name = "e" type="object"> Event 객체 </param>
                /// <param name = "ui" type="object"> Data객체  </param>
                /// <returns type="boolean"> false 이면 무시 </returns>
                /// <example><![CDATA[
                ///            이부분에 예제내용 기술한다...
                /// ]]></example>
                /// </member>
                // https://paramquery.com/pro/api#event-beforeExport
                gridObj.beforeExport = function (e, ui) {
                    if (self.OnbeforeExport) {
                        return self.OnbeforeExport(e, ui);
                    }
                }

                /// <member id="OnCellSave" kind="event">
                /// <summary>Edit후에 셀 데이터 변경후에 발생되는 이벤트 함수</summary>
                /// <remarks><![CDATA[
                /// 이 이벤트는 다른 셀의 계산 된 데이터 또는 종속 데이터를 업데이트하는 데 적합합니다.
                /// 이유에 상관없이 데이터가 변경된 후 코드를 실행하려면 인라인 편집, 복사/붙여넣기 등이 이벤트보다 다양한 변경 이벤트를 사용하십시오
                ///    - <var>ui...</var> 객체 상세 설명
                ///    <b>rowData</b>
                ///      Type: object
                ///      행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조
                ///    <b>rowIndx</b>
                ///      Type: number
                ///      0기준 행위치값
                ///    <b>dataIndx</b>
                ///      Type: number|string
                ///      0기준 컬럼인덱스 또는 컬럼 키이름
                ///    <b>colIndx</b>
                ///      Type: number
                ///      0기준 컬럼인덱스
                /// ]]></remarks>
                /// <param name = "e" type="object"> Event 객체 </param>
                /// <param name = "ui" type="object"> 데이터 객체 </param>
                /// <example><![CDATA[
                ///            이부분에 예제내용 기술한다...
                /// ]]></example>
                /// </member>
                gridObj.cellSave = function (e, ui) {
                    if (self.OnCellSave) {
                        self.OnCellSave(e, ui);
                    }
                }

                /// <member id="beforeCellClick" kind="event">
                /// <summary>셀 클릭 before 이벤트 함수</summary>
                /// <remarks>셀 클릭 이벤트 발생전에 전처리가 필요한 경우에 사용하는 이벤트</remarks>
                /// <param name = "e" type="object"> 이벤트 객체 </param>
                /// <param name = "ui" type="object"> 셀 객체 </param>
                /// <returns type="boolean"> false 이면 이후 처리를 무시한다.</returns>
                /// <example ref="true" file="grid_example" />
                /// <shortcut key="beforeCellClick" url="https://paramquery.com/pro/api#event-cellClick"> cellClick( event, ui )</shortcut>
                /// </member>
                gridObj.beforeCellClick = function (e, ui) {
                    if (self.beforeCellClick) {
                        return self.beforeCellClick(e, ui);
                    }
                }

                /// <member id="beforeCellKeyDown" kind="event">
                /// <summary>keyDowb before 이벤트 함수</summary>
                /// <remarks>셀 Edit 키보드 이벤트 발생전에 전처리가 필요한 경우에 사용하는 이벤트</remarks>
                /// <param name = "e" type="object"> 이벤트 객체 </param>
                /// <param name = "ui" type="object"> 셀 객체 </param>
                /// <returns type="boolean"> false 이면 이후 처리를 무시한다.</returns>
                /// <example ref="true" file="grid_example" />
                /// <shortcut key="beforeCellKeyDown" url="https://paramquery.com/pro/api#event-beforeCellKeyDown"> beforeCellKeyDown( event, ui )</shortcut>
                /// </member>
                gridObj.beforeCellKeyDown = function (e, ui) {
                    if (self.beforeCellKeyDown) {
                        return self.beforeCellKeyDown(e, ui);
                    }
                }

                /// <member id="OnCellSaveBefore" kind="event">
                /// <summary>Edit 후에 입력값을 체크후에 이후 처리유무를 판단하기 위해서 발생되는 이벤트 함수</summary>
                /// <remarks ref="true" file="grid_example" />
                /// <param name = "ui" type="object"> 객체 </param>
                /// <returns type="string|number|object|array|boolean"> 반환값 정보기술한다.</returns>
                /// <example ref="true" file="grid_example" />
                /// <shortcut key="cellBeforeSave" url="https://paramquery.com/pro/api#event-cellBeforeSave"> cellBeforeSave( event, ui )</shortcut>
                /// </member>
                gridObj.cellBeforeSave = function (e, ui) {
                    if (self.OnCellSaveBefore) {
                        return self.OnCellSaveBefore(ui);
                    }
                }

                /// <member id="OnEditEnd" kind="event">
                /// <summary>에디터가 파괴 되려고 할 때 발생되는 이벤트 함수</summary>
                /// <remarks> <![CDATA[
                ///     셀 내용을 편집후 처리하는 기능, 종목코드 변경등
                ///    - <var>ui...</var> 객체 상세 설명
                ///    <b>rowData</b>
                ///      Type: object
                ///      행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조
                ///    <b>rowIndx</b>
                ///      Type: number
                ///      0기준 행위치값
                ///    <b>dataIndx</b>
                ///      Type: number|string
                ///      0기준 컬럼인덱스 또는 컬럼 키이름
                ///    <b>column</b>
                ///      Type: object
                ///      컬럼정보 오브젝트
                ///    <b>$editor</b>
                ///     Type: jQuery
                ///     Editor Tag
                /// ]]></remarks>
                /// <param name = "e" type="object"> 이벤트 객체</param>
                /// <param name = "ui" type="object"> 객체정보</param>
                /// <example><![CDATA[
                ///   관심종목화면에서 종목코드 변경후 재 조회하는 경우
                ///   grid.OnEditEnd = function ( e, ui ){
                ///
                ///  }
                /// ]]></example>
                /// </member>

                gridObj.editorEnd = function (e, ui) {
                    if (self.OnEditEnd) {
                        self.OnEditEnd(e, ui);
                    }
                }

                /// <member id="OnEditKeyDown" kind="event">
                /// <summary>키 입력되면 발생되는 이벤트 함수</summary>
                /// <remarks><![CDATA[
                /// 이 이벤트에서 false를 반환하면 편집기에서 키의 기본 동작을 방지 할 수 있습니다.
                ///    <b>rowData</b>
                ///      Type: object
                ///      행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조
                ///    <b>rowIndx</b>
                ///      Type: number
                ///      0기준 행위치값
                ///    <b>dataIndx</b>
                ///      Type: number|string
                ///      0기준 컬럼인덱스 또는 컬럼 키이름
                ///    <b>column</b>
                ///      Type: object
                ///      컬럼정보 오브젝트
                ///    <b>$editor</b>
                ///     Type: jQuery
                ///     Editor Tag
                /// ]]></remarks>
                /// <param name = "e" type="object"> Event 객체 </param>
                /// <param name = "ui" type="object"> Data 객체 </param>
                /// <returns type="boolean"> 반환값이 false 이면 이후처리를 무시한다. </returns>
                /// <example><![CDATA[
                /// 예) Enter 키 입력시 다른 행의 포커스 이동
                /// grid.OnEditKeyDown = function(e, ui){
                /// if(e.keyCode == 13){ //enter key.
                ///     e.originalEvent.keyCode = 40;//disguise down key.
                /// }
                /// ]]></example>
                /// </member>
                gridObj.editorKeyDown = function (e, ui) {
                    if (self.OnEditKeyDown) {
                        self.OnEditKeyDown(e, ui);
                    }
                }
            }

            /// <member id="OnRowMouseEnter" kind="event">
            /// <summary>row 마우스 들어온 시점에서 발생되는 이벤트 함수</summary>
            /// <remarks><![CDATA[ 사용자 지정 반전 표시를 하는 경우 사용
            ///    ui 객체설명
            ///    {
            ///      rowIndx  :  0 기준 row 위치
            ///      rowIndxPage :  페이지 내 0 기준 row 위치
            ///    }
            /// ]]></remarks>
            /// <param name = "e" type="object"> event 객체 </param>
            /// <param name = "ui" type="object"> 데이터 객체</param>
            /// <returns type="boolean"> false : 기본처리 안함( 반드시 지정)</returns>
            /// <example><![CDATA[
            ///    예) 사용자 반전 표시 표시 기능하는 경우
            ///    grid.OnRowMouseEnter =  function(e, ui){
            ///      // 해당 행의 태그값을 취득한다.
            ///      var $tr = grid._gPQ.getRow({
            ///                         rowIndxPage: ui.rowIndxPage
            ///         });
            ///         // highligh 처리
            ///         if ($tr) $tr.addClass("pq-grid-row-hover ui-state-hover");
            ///         return false;
            ///    }
            ///
            /// ]]></example>
            /// </member>
            gridObj.rowMouseEnter = function (e, ui) {
                if (self.OnRowMouseEnter) {
                    return self.OnRowMouseEnter(e, ui);
                }
            }

            /// <member id="OnRowMouseLeave" kind="event">
            /// <summary>row 마우스 벗어난 시점에서 발생되는 이벤트 함수</summary>
            /// <remarks><![CDATA[ 사용자 지정 반전 해제를 표시를 하는 경우 사용
            ///    ui 객체설명
            ///    {
            ///      $tr : row 태그 객체
            ///      rowIndx  :  0 기준 row 위치
            ///      rowIndxPage :  페이지 내 0 기준 row 위치
            ///    }
            /// ]]></remarks>
            /// <param name = "e" type="object"> event 객체 </param>
            /// <param name = "ui" type="object"> 데이터 객체</param>
            /// <returns type="boolean"> false : 기본처리 안함( 반드시 지정)</returns>
            /// <example><![CDATA[
            ///    예) 사용자 반전 해제 하는 기능
            ///    grid.OnRowMouseLeave =  function(e, ui){
            ///         // highligh 해제 처리
            ///         if (ui.$tr) ui.$tr.removeClass("pq-grid-row-hover ui-state-hover");
            ///         return false;
            ///    }
            ///
            /// ]]></example>
            /// </member>
            gridObj.rowMouseLeave = function (e, ui) {
                if (self.OnRowMouseLeave) {
                    return self.OnRowMouseLeave(e, ui);
                }
            }

            /// <member id="OnCellMouseEnter" kind="event">
            /// <summary>cell 마우스 들어온 시점에서 발생되는 이벤트 함수</summary>
            /// <param name = "e" type="object"> event 객체 </param>
            /// <param name = "ui" type="object"> 데이터 객체</param>
            /// <returns type="boolean"> false : 기본처리 안함( 반드시 지정)</returns>
            /// </member>
            gridObj.cellMouseEnter = function (e, ui) {
                if (self.OnCellMouseEnter) {
                    return self.OnCellMouseEnter(e, ui);
                }
            }

            /// <member id="OnCellCustomTooltip" kind="event">
            /// <summary>cell 툴팁 설정시점에서 발생되는 이벤트 함수</summary>
            /// <param name = "ui" type="object"> 데이터 객체</param>
            /// <returns type="string"> tooltip 문자열 </returns>
            /// </member>
            gridObj.cellCustomTooltip = function ( ui) {
                // --> [Edit] 수정자:kim changa 일시:2019/09/19
                // 수정내용> 그리드 커스텀 툴팁	
                //debugger;
                var tooltip = this.options.tooltip,
                    showitem = hi5_DebugLevel && hi5_DebugLevel.tp_item_show ? true : false,
                    show = self.OnCellCustomTooltip || tooltip.tp_Hkey || showitem ? true : false;
                if (show) {
                    var $td = ui.$td, $grid = ui.$grid, grid = ui.grid, objColumn, $target;

                    // 헤더 셀의 .pq-title-span 검색
                    if (ui.$td.is('.pq-title-span')) {
                        $target = $td.closest('.pq-grid-col');
                        if ($target.length > 0) {
                            if ($target.is('.pq-grid-col')) {
                                // 헤더객체 취득
                                objColumn = grid.getHeadCell($target);
                            }
                        }
                    } else {
                        // 헤더영역의 셀인지 판단
                        if ($td.is('.pq-grid-col')) {
                            // 헤더객체 취득
                            objColumn = grid.getHeadCell($td);
                        }
                    }
                    // 헤더영역
                    if (objColumn) {
                        // 타이릍 취득
                        ui['title'] = grid.iHeader.getTitle(objColumn.col, objColumn.ci);
                        ui['header'] = objColumn;

                        if ( showitem  ) {
                            var text = objColumn.col.dataIndx ? objColumn.col.dataIndx : "",
                                code = this.options.trcode ? this.options.trcode : "",
                                colWidth = objColumn.col.outerWidth;

                            text = "trcode : " + code + " <BR>" + "ItemName : " + text + "<BR>" + "colWidth : " + colWidth;
                            text += "<BR>" + "_minWidth : " + objColumn.col._minWidth + "<BR>" + "_maxWidth : " + objColumn.col._maxWidth;
                            return '<span><div class="tooltipTitle">' + ui.title + '</div>' + text+ '</span>'
                        }

                    }
                    //debugger;
                    // 객체로 받기 위한 작업..
                    var tpObj;
                    if(self.OnCellCustomTooltip){
                        tpObj = self.OnCellCustomTooltip(ui);
                    }else{
                        if($hi5_tooltipJson){
                            var hi5TpJson = $hi5_tooltipJson["grid"],tpKey, dataIndx;
                            if(ui.header){
                                tpKey = this.options.tooltip.tp_Hkey, dataIndx = objColumn.col.dataIndx;
                                tpObj = hi5TpJson[tpKey + "." + dataIndx] ? hi5TpJson[tpKey + "." + dataIndx] : hi5TpJson[dataIndx];
                                //tpObj.title = objColumn.col.title;
                                if(tpObj){
                                    //tpObj.title[local_lang] = objColumn.col.title;
                                    tpObj.title = {};
                                    tpObj.title[local_lang] = objColumn.col.title;
                                }
                                    
                            }
                        }
                        // body 영역 툴팁 개선 작업 필요
                        // else 
                        //     tpKey = this.options.tooltip.tp_Bkey, dataIndx = ui.obj.dataIndx;
                                                
                    }
                    if (tpObj) {
                        //tooltip 제목
                        var tpTitle = tpObj.title[local_lang],
                            //tooltip 내용
                            tpData = tpObj.caption[local_lang];
                        //제목이 존제하는 경우
                        if (tpTitle && tpTitle !== "") {
                            return '<span><div class="tooltipTitle">' + tpTitle + '</div>' + tpData + '</span>'
                        } else if (tpData && tpData !== "" ){
                            return '<span>' + tpData + '</span>'
                        }
                    }
                }
                return;
                // <-- [Edit] kim changa 2019/09/19
            }

            /// <member id="OnCellMouseLeave" kind="event">
            /// <summary>cell 마우스 벗어난 시점에서 발생되는 이벤트 함수</summary>
            /// <param name = "e" type="object"> event 객체 </param>
            /// <param name = "ui" type="object"> 데이터 객체</param>
            /// <returns type="boolean"> false : 기본처리 안함( 반드시 지정)</returns>
            /// </member>
            gridObj.cellMouseLeave = function (e, ui) {
                if (self.OnCellMouseLeave) {
                    return self.OnCellMouseLeave(e, ui);
                }
            }

            gridObj.beforeTableView = function (e, ui) {
                var pageData = ui.pageData, initV = ui.initV, finalV = ui.finalV, initH = ui.initH, finalH = ui.finalH, source = ui.source;
                // code here
                //console.log(e.type);
            }

            gridObj.dataAvailable = function (e, ui) {
                // code here
                //console.log(e.type);
            }


            /// <member id="OnRowInit" kind="event">
            /// <summary>데이터 설정후에 행 단위 셀 스타일 정보를 변경하는 이벤트 함수</summary>
            /// <remarks>
            ///  OnRowInit ( { rowData, rowIndxPage, rowIndx } )
            ///  rowInit 콜백은 전체 뷰가 새로 고쳐지면 뷰포트의 모든 행에 대해 표에서 호출됩니다.
            ///  refreshRow가 호출 될 때 영향을받은 행에 호출됩니다.
            ///  행의 현재 데이터, 즉 rowData를 기반으로 행, 셀에 클래스, 스타일 또는 속성을 동적으로 주입하는 데 사용할 수 있습니다.
            ///  이 이벤트는 툴바 등을 추가하는 데 적합합니다.
            /// - ui 객체 상세설명
            ///  <b>rowData</b>
            ///    Type : array
            ///    원본 데이터
            ///  <b>rowIndx</b>
            ///     Type : number
            ///      0 기준 행 인덱스 값
            ///  <b>rowIndxPage</b>
            ///    Type : number
            ///    0 기준 페이지 인덱스 값
            /// </remarks>
            /// <param name = "ui" type="object"> 객체</param>
            /// <returns type="object"> 객체정보 반환 ( {cls, style, attr} )</returns>
            /// <example>
            /// if ( some condition based on ui.rowData ){
            ///     return { cls: 'green', style: 'font-size:18px;', attr: 'some HTML attribute for the row' };
            /// }
            /// </example>
            /// </member>
            gridObj.rowInit = function (ui) {
                var rowData = ui.rowData, rowIndxPage = ui.rowIndxPage, rowIndx = ui.rowIndx;

                var obj = {};
                if (self.OnRowInit) {
                    obj = self.OnRowInit(ui) || {};
                }
                // 데이터 영역의 눂이값 지정
                var $grid = this, options = $grid.option();
                /* v4.0
                            if (options.rowHeight && options.rowHeight != 25) {
                                var str = "height : " + options.rowHeight + "px;";
                                if (obj && obj.style) obj.style += str;
                                else
                                    obj.style = str;
                            }
                */
                var cls = "";
/*
                // grid_sb_area
                // isoll 사용인 경우 맨 마지막 컬럼 사이즈 줄이는 기능
                if (hi5.WTS_MODE == WTS_TYPE.SPA && self.scrollmode) {
                    var RB = $grid.iRenderB,
                        finalV = RB._finalV,
                        rows = RB.rows;
                    if (finalV && rows > finalV) {
                        cls = "grid_sb_area ";
                    }
                }
*/
                // 홀짝 블럭수가 1이상인 경우
                var blockCount = options.blockCount ? options.blockCount : 0;
                if (!options.stripeRows && blockCount > 1) {
                    if (parseInt(rowIndx % options.blockCount) || options.dataModel.data.length == rowIndx + 1) {  // 라인색
                        cls =+ "pq-grid-blockline ";
                    }

                    if (parseInt((rowIndx / options.blockCount) % 2)) {  // 짝수색
                        cls += "pq-grid-oddRow ";
                    }

                    if (obj && obj.cls) obj.cls += cls;
                    else obj.cls = cls;
                }
/*
                if (cls != "") {
                    if (obj && !obj.cls) obj.cls = cls;
                }
*/
                return hi5.isEmpty(obj) ? null : obj;
            }

            /// <member id="OnRender" kind="event">
            /// <summary>render 이벤트 함수</summary>
            /// <remarks>DOM 구조가 생성되고 그리드가 완전히 초기화되기 바로 전에 트리거됩니다.
            /// 이 이벤트는 툴바 등을 추가하는 데 적합합니다.
            /// </remarks>
            /// <param name = "dataModel" type="object"> dataModel 객체</param>
            /// <param name = "colModel" type="object"> colModel 객체</param>
            /// </member>
            gridObj.render = function (e, ui) {
                // code here
                //          console.log(e.type);
                var dataModel = ui.dataMode, colModel = ui.colModel;
                if (self.OnRender) {
                    self.OnRender(dataModel, colModel);
                }
            }

            /// <member id="OnColumnRender" kind="event">
            /// <summary>column 단위로 Render 이벤트 함수</summary>
            /// <remarks><![CDATA[
            /// 데이터 영역의 색 정보 및  스타일 정보를 변경하는 기능
            ///   ui 객체 상세설명:
            /// <b>style</b>
            ///      type: string
            ///      셀 스타일 정보
            /// <b>cls</b>
            ///      type: string
            ///      css 정보 문자열
            /// <b>attr</b>
            ///      type: string
            ///      attr 정보 문자열
            /// <b>rowData</b>
            ///      type: object
            ///      Row 데이터 객체
            /// <b>rowIndxPage</b>
            ///      type: number
            ///      현재 페이지의 행에 대한 인덱스 값
            /// <b>rowIndx</b>
            ///      type: number
            ///      0기준 행위치값
            /// <b>colIndx</b>
            ///      type: number
            ///      0 기준 컬럼인덱스
            /// <b>column</b>
            ///      type: Object
            ///      column (ColModel 객체)
            /// <b>dataIndx</b>
            ///      type: string|number
            ///      0기준 컬럼인덱스 또는 컬럼 키이름
            /// <b>cellData</b>
            ///      type: string|number
            ///      원본데이터
            /// <b>formatVal</b>
            ///      type: string
            ///      마스킹된 데이터
            /// ]]></remarks>
            /// <param name = "ui" type="object"> 데이터 객체</param>
            /// <returns type="string|object"> dataCell 셀 정보객체 반환</returns>
            /// <example><![CDATA[
            /// // 종목코드로 이미지 변경하는 예제
            /// function grd.OnColumnRender(ui) {
            ///     if (ui.dataIndx == "symbol") {   // 컬럼의 item이름 비교
            ///         var symbol = ui.cellData;    // 원본 데이터( 심볼코드 )
            ///         if (coin_icon[symbol] != undefined) {   // 이미지 변경
            ///             var cls = coin_icon[symbol].icon + " currency-logo-sprite";
            ///             var s = "<div class='" + cls + "'></div><span class='cell_pointer currency-name-container'> " + symbol + "</span>";
            ///             return { text: s };
            ///         }
            ///     }
            /// }
            /// ]]></example>
            /// </member>


            // PQ Click 이벤트
            /// <member id="OnCellClick" kind="event" default="true">
            /// <summary>그리드 셀 영역을 클릭시 발생되는 이벤트 함수</summary>
            /// <remarks>데이터 Body 영역을 클릭시만  발생됩니다.
            ///  OnCellClick ( { rowData, rowIndx, dataIndx, colIndx } )
            /// </remarks>
            /// <param name = "rowData" type="object"> 행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조 </param>
            /// <param name = "rowIndx" type="number"> 0기준 행위치값</param>
            /// <param name = "dataIndx" type="number|string"> 0기준 컬럼인덱스 또는 컬럼 키이름</param>
            /// <param name = "colIndx" type="number"> 0 기준 컬럼인덱스 </param>
            /// </member>
            gridObj.cellClick = function (e, ui) {
                // code here
                //            console.log(e.type);
                //if (self.objParentForm.linkcode == true || self.objParentForm.$html.parents('.hi5_win_main').attr('linkcode') == 1) {
                //    if (ui.rowData['usid'] || ui.rowData['userid'] ) {
                //        self.objParentForm.SetCodeDataLink("queryID", ui.rowData['userid'] || ui.rowData['usid']);
                //    }
                //}
                        hi5.MessageBox('화면전환테스트','테스트',3);

                if (self.OnCellClick) {
                    //var obj = self.GetEventArgInfo(e.type, ui);
                    return self.OnCellClick(ui.rowData, ui.rowIndx, ui.dataIndx, ui.colIndx);
                }

            }




            /// <member id="OnCellDblClick" kind="event">
            /// <summary>그리드 셀 영역을 클릭시 발생되는 이벤트 함수</summary>
            /// <remarks>데이터 Body 영역을 클릭시만  발생됩니다.
            ///  OnCellDblClick ( { rowData, rowIndx, dataIndx, colIndx } )
            /// </remarks>
            /// <param name = "rowData" type="object"> 행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조 </param>
            /// <param name = "rowIndx" type="number"> 0기준 행위치값</param>
            /// <param name = "dataIndx" type="number|string"> 0기준 컬럼인덱스 또는 컬럼 키이름</param>
            /// <param name = "colIndx" type="number"> 0 기준 컬럼인덱스 </param>
            /// </member>
            gridObj.cellDblClick = function (e, ui) {
                // code here
                //          console.log(e.type);
                if (self.OnCellDblClick) {
                    return self.OnCellDblClick(ui.rowData, ui.rowIndx, ui.dataIndx, ui.colIndx);
                }
            }


            /// <member id="OnCellRightClick" kind="event" >
            /// <summary>그리드 셀 영역을 Right 클릭시 발생되는 이벤트 함수</summary>
            /// <remarks>데이터 Body 영역을 클릭시만  발생됩니다.
            ///  OnCellRightClick ( { rowData, rowIndx, dataIndx, colIndx } )
            /// </remarks>
            /// <param name = "rowData" type="object"> 행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조 </param>
            /// <param name = "rowIndx" type="number"> 0기준 행위치값</param>
            /// <param name = "dataIndx" type="number|string"> 0기준 컬럼인덱스 또는 컬럼 키이름</param>
            /// <param name = "colIndx" type="number"> 0 기준 컬럼인덱스 </param>
            /// </member>
            gridObj.cellRightClick = function (e, ui) {
                // code here
                //           console.log(e.type);
                if (self.OnCellRightClick) {
                    return self.OnCellRightClick(ui.rowData, ui.rowIndx, ui.dataIndx, ui.colIndx);
                }
            }

            /// <member id="OnHeaderCellClick" kind="event" >
            /// <summary>그리드 헤더 영역을 클릭시 발생되는 이벤트 함수</summary>
            /// <remarks>헤더영역을 클릭시만  발생됩니다.
            ///  OnHeaderCellClick ( { dataIndx, column } )
            /// </remarks>
            /// <param name = "dataIndx" type="number|string"> 0기준 컬럼인덱스 또는 컬럼 키이름</param>
            /// <param name = "column"   type="object"> column (ColModel 객체)</param>
            /// </member>
            gridObj.headerCellClick = function (e, ui) {
                // code here
                //            console.log(e.type);
                if (self.OnHeaderCellClick) {
                    return self.OnHeaderCellClick(ui.dataIndx, ui.column);
                }
            }
            /*
                        gridObj.headRightClick = function (e, ui) {
                            //if (self.OnHeaderRightClick) {
                           //     return self.OnHeaderRightClick(ui);
                           // }
                        }
            */

            /// <member id="OnRefreshHeader" kind="event" >
            /// <summary>헤더가 새로 고침 될 때마다 트리거 함수</summary>
            /// <remarks>헤더영역의 스타일을 변경하는 내용 기술
            /// </remarks>
            /// <param name = "ui" type="object"> Object</param>
            /// <example><![CDATA[
            ///   <style>
            /// .pq-grid-col.someClass{
            ///     font-size: 15px;
            ///     ...
            /// }
            /// </style>
            /// Here Script code
            /// grid.on('refreshHeader', function(){
            ///     this.getCellHeader({}).css(.. your custom css ..);
            /// })
            /// ]]>
            /// </example>
            /// </member>
            gridObj.refreshHeader = function (e, ui) {
                // code here
                //           console.log(e.type);

                // 헤더 높이값을 변경한다.
                //getter
                /* v4.0
                            var $grid = this, options = $grid.option();
                            if (options.rowHeight && options.showHeader && options.rowHeight != 25) {
                                var height = options.rowHeight + "px";
                                $grid.$header.find(".pq-grid-header-table").css("height", height);
                            }
                */
                if (self.OnRefreshHeader) {
                    return self.OnRefreshHeader(ui);
                }
            }

            /// <member id="OnRefreshRow" kind="event" >
            /// <summary>refreshRow 메서드를 호출하여 행을 새로 고칠 때마다발생되는 이벤트 함수</summary>
            /// <remarks> 데이터 영역을 재 가공하는 기능 기술
            ///           refreshRow 함수로 호출
            /// </remarks>
            /// <param name = "rowIndx" type="number"> 행의 0을 기준으로 한 인덱스값</param>
            /// <param name = "rowIndxPage" type="number"> 현재 페이지의 행에 대한 인덱스 값</param>
            /// <param name = "rowData" type="object"> 행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조</param>
            /// </member>
            gridObj.refreshRow = function (e, ui) {
                // code here
                // console.log(e.type);
                var rowData = ui.rowData, rowIndx = ui.rowIndx, rowIndxPage = ui.rowIndxPage;
                if (self.OnRefreshRow) {
                    return self.OnRefreshRow(rowIndx, rowIndxPage, rowData);
                }
            };

            /// <member id="OnRefresh" kind="event">
            /// <summary>그리드 데이터 전체 새로고침 될때마다 발생되는 이벤트 함수</summary>
            /// <remarks><![CDATA[
            /// 모든 셀을 그리고 난후 마지막에 발생된다.
            ///   ui 객체 상세설명:
            /// <b>pageData</b>
            ///      type: string
            ///      2-dimensional array or JSON data for current page
            /// <b>initV</b>
            ///      Type: Integer
            ///      Index of first row displayed in the unfrozen viewport.
            /// <b>finalV</b>
            ///      Type: Integer
            ///      Index of last row displayed in the unfrozen viewport.
            /// <b>initH</b>
            ///      Type: Integer
            ///     Index of first column displayed in the unfrozen viewport.
            /// <b>finalH</b>
            ///    Type: Integer
            ///      Index of last column displayed in the unfrozen viewport.
            /// <b>source</b>
            ///     Type: String
            ///     Custom string passed to refresh. Added in 3.0.0
            /// ]]></remarks>
            /// <param name = "e" type="object"> 이벤트 객체 </param>
            /// <param name = "ui" type="object"> 이벤트 객체 </param>
            /// <example><![CDATA[
            ///     grid.OnRefresh= function(e, ui){
            ///         // 맨 마지막에 기능 구현..
            ///     }
            /// ]]></example>
            /// </member>
            gridObj.refresh = function (e, ui) {
                if (self.OnRefresh) {
                    return self.OnRefresh(e, ui);
                }
            };


            gridObj.create = function (e, ui) {
                var dataModel = ui.dataModel, colModel = ui.colModel;
                //console.log(e.type);

                // tooltip
                //this.widget().pqTooltip();

            }

            /// <member id="OnComplete" kind="event">
            /// <summary>헤더 또는 샐 CheckBox 선택시에 발생되는 이벤트 함수</summary>
            /// <remarks> 상태값을 보고 기능을 제어하는 기능
            ///   <var>ui...</var> 객체설명
            ///        <b>rowData</b>
            ///             Type: Object
            ///             행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조
            ///        <b>rowIndx</b>
            ///             Type: Integer
            ///             Zero based index of the row.
            ///        <b>dataIndx</b>
            ///             Type: Integer or String
            ///             Zero based index in array or key name in JSON.
            ///        <b>rows</b>
            ///             Type: Array
            ///             Collections of row objects having rowIndx, rowData.
            ///        <b>source</b>
            ///             Type: String
            ///             Origin of checkbox event e.g., 'header'.
            ///        <b>check</b>
            ///             Type: Boolean
            ///             state of the checkbox.
            /// </remarks>
            /// <param name = "ui" type="object"> 이벤트 객체</param>
            /// <example><![CDATA[
            ///            이부분에 예제내용 기술한다...
            /// ]]></example>
            /// </member>
            gridObj.complete = function (e, ui) {
                if (self.OnComplete) {
                    return self.OnComplete(e, ui);
                }

            }

            /// <member id="OnCheckChange" kind="event">
            /// <summary>헤더 또는 샐 CheckBox 선택시에 발생되는 이벤트 함수</summary>
            /// <remarks> 상태값을 보고 기능을 제어하는 기능
            ///   <var>ui...</var> 객체설명
            ///        <b>rowData</b>
            ///             Type: Object
            ///             행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조
            ///        <b>rowIndx</b>
            ///             Type: Integer
            ///             Zero based index of the row.
            ///        <b>dataIndx</b>
            ///             Type: Integer or String
            ///             Zero based index in array or key name in JSON.
            ///        <b>rows</b>
            ///             Type: Array
            ///             Collections of row objects having rowIndx, rowData.
            ///        <b>source</b>
            ///             Type: String
            ///             Origin of checkbox event e.g., 'header'.
            ///        <b>check</b>
            ///             Type: Boolean
            ///             state of the checkbox.
            /// </remarks>
            /// <param name = "ui" type="object"> 이벤트 객체</param>
            /// <example><![CDATA[
            ///            이부분에 예제내용 기술한다...
            /// ]]></example>
            /// </member>
            gridObj.check = function (e, ui) {
                //console.log(e.type);
                if (ui.source == "dataAvailable") return;
                var rowIndx = ui.rowIndx, dataIndx = ui.dataIndx, check = ui.check, source = ui.source;
                if (self.OnCheckChange) {
                    self.OnCheckChange(ui);
                }
            }


            /// <member id="OnCheckBefore" kind="event">
            /// <summary>CheckBox 컬럼에서 체크 상태가 변경되기 전에 발셍 되는 이벤트 함수</summary>
            /// <remarks>반환값을 false 하는 경우 이후 처리는 무시된다.
            ///   <var>ui...\</var> 객체설명
            ///        <b>rowData</b>
            ///             Type: Object
            ///             행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조
            ///        <b>rowIndx</b>
            ///             Type: Integer
            ///             Zero based index of the row.
            ///        <b>dataIndx</b>
            ///             Type: Integer or String
            ///             0기준 컬럼인덱스 또는 컬럼 키이름
            ///        <b>rows</b>
            ///             Type: Array
            ///             Collections of row objects having rowIndx, rowData.
            ///        <b>source</b>
            ///             Type: String
            ///             Origin of checkbox event e.g., 'header'.
            ///        <b>check</b>
            ///             Type: Boolean
            ///             state of the checkbox.
            /// </remarks>
            /// <param name = "ui" type="object"> 이벤트 객체</param>
            /// <returns type="boolean"> false 이면 처리를 하지 않는다.</returns>
            /// <example><![CDATA[
            ///            이부분에 예제내용 기술한다...
            /// ]]></example>
            /// </member>
            gridObj.beforeCheck = function (e, ui) {
                //console.log(e.type);
                if (ui.source == "dataAvailable") return;
                var rowIndx = ui.rowIndx, dataIndx = ui.dataIndx, check = ui.check, source = ui.source;
                if (self.OnCheckBefore) {
                    return self.OnCheckBefore(ui);
                }
            }


            /// <member id="OnSort" kind="event">
            /// <summary>컬럼 소트 클릭시에 발생되는 이벤트 함수</summary>
            /// <remarks>소트 처리 기능을 이부분에 추가
            ///   <var>ui...</var> 객체설명
            ///        <b>dataIndx</b>
            ///             Type: Integer or String
            ///             Zero based index in array or key name in JSON.
            ///        <b>single</b>
            ///             Type: Boolean
            ///            multiple column sorting when false
            ///        <b>oldSorter</b>
            ///             Type: Array
            ///             An array of objects having dataIndx and dir providing previous sorting information
            ///        <b>sorter</b>
            ///             Type: Array
            ///             An array of objects having dataIndx and dir
            /// </remarks>
            /// <param name = "ui" type="object"> 이벤트 객체</param>
            /// <example><![CDATA[
            ///            이부분에 예제내용 기술한다...
            /// ]]></example>
            /// </member>
            gridObj.sort = function (e, ui) {
                if (self.OnSort) {
                    self.OnSort(ui);
                }
            }

            /// <member id="OnSortBefore" kind="event">
            /// <summary>데이터가 정렬되기 바로 전에 발생되는 이벤트 함수</summary>
            /// <remarks>사용자 동작에 의해 시작될 때만 시작됩니다 (헤더 셀을 클릭)
            ///   ui 객체설명
            ///        <b>dataIndx</b>
            ///             Type: Integer or String
            ///             Zero based index in array or key name in JSON.
            ///        <b>single</b>
            ///             Type: Boolean
            ///            multiple column sorting when false
            ///        <b>oldSorter</b>
            ///             Type: Array
            ///             An array of objects having dataIndx and dir providing previous sorting information
            ///        <b>sorter</b>
            ///             Type: Array
            ///             An array of objects having dataIndx and dir
            /// </remarks>
            /// <param name = "ui" type="object"> Sort 객체</param>
            /// <returns type="boolean"> false 이면 소트처리를 무시한다.</returns>
            /// <example><![CDATA[
            ///            이부분에 예제내용 기술한다...
            /// ]]></example>
            /// </member>
            gridObj.beforeSort = function (e, ui) {
                if (self.OnSortBefore) {
                    if (self.OnSortBefore(ui) == false) return false;
                }
            }

            gridObj.autoResizeBefore = function (e, ui) {
                var that = this, grid = self,totWidth,
                $grid = that.element,
                    dif = ui.dims.wdGrid - ui.preDims.wdGrid;  // 그리드 현재사이지-그리드 이전사이즈
                //console.log("autoResizeBefore..", $grid[0].id, ui, that.options._initWidth);

                var CM = that.getColModel(),
                     CMLength = CM.length,
                     column, totWidth = 0;

                for (var i = 0; i < CMLength; i++) {
                    column = CM[i];
                    if (!column.hidden) {
                        totWidth += parseInt(column._o_width);
                    }
                }
                if (dif > 0) {   // 확대인 경우 그리드 사이즈가 컬럼 사이즈보다 큰경우 autoFit 처리
                    if (totWidth < ui.dims.wdGrid)
                        return true;
                } else if (dif < 0) {   // 축소되는 경우
                    if (totWidth < ui.dims.wdGrid) { // 축소인 경우 그리드 사이즈가 컬럼 사이즈보다 큰경우 autoFit 처리
                        // 기본 사이즈로 변경
                        grid.setAutoFitColum({ skip: true })
                        return true;
                    } else {
                        grid.setAutoFitColum({ skip: true })
                    }
                }
                return false;
            }

            /// <member id="OnVScrollEnd" kind="event">
            /// <summary>그리드 Scroll PageDown으로 다음 데이터를 조회 이벤트 함수</summary>
            /// <remarks> <![CDATA[
            ///     그리드 Scroll PageDown이 맨 하단으로 도달시에 발생되는 이벤트 함수기능
            ///     다음조회 요청하는 기능을 추가한다.
            ///     <B>그리드 속성 virtualY: false 로 반드시 지정</B>
            ///    - ui 객체 상세 설명
            ///    <b>cur_pos</b>
            ///     Type: number
            ///     Scroll 현재 위치값
            ///    <b>num_eles</b>
            ///     Type: number
            ///     사용 가능한 총 위치 수
            /// ]]></remarks>
            /// <param name = "ui" type="object"> Scroll 객체</param>
            /// <param name = "nextDataExist" type="boolean"> true : 연속데이터 존재, false: 연속데이터 미 존재</param>
            /// <example><![CDATA[
            ///    1. FID 유형의 연속조회 인경우
            ///     grid.OnVScrollEnd = function(ui, nextDataExist){
            ///         <b>if ( nextDataExist == true )  // 연속데이터 존재유무를 반드시 체크한다.</b>
            ///             form.commRequest( "통신객체이름", 2, "그리드 컨트롤명");
            ///     }
            /// ]]></example>
            /// </member>

            //gridObj.OnVScrollEnd = function (ui, nextDataExist) {
            //    if (self.OnVScrollEnd && nextDataExist) {
            //        self.OnVScrollEnd(ui, nextDataExist);
            //   }
            // }
            //debugger;
            // PQ그리드 정보를 설정
            if (this.options_width != undefined && this.options_height != undefined) {
                gridObj.width = this.options_width; gridObj.height = this.options_height;
            }

            // flex
            if (this.$grid) {
                if ( gridObj.width !='flex')
                    this.$grid[0].style.width = gridObj.width;
            }
            if (this.$grid[0].clientWidth == 0)   // refresh rendering 안되는 현상 강제적으로 3값을 준다.
                this.$grid.width(3);

            //-->[LNH] 20190107 grid pagination 기능 추가
            if (this.pagination) {
                //gridObj.pageModel = { type: "local", rPP: this.rqcount, strRpp: "{0}"};
                gridObj.pageModel = { type: "", rPP: this.rqcount, strRpp: "{0}"};
                gridObj.showBottom = true;
            }
            //<--[LNH] 20190107
            this._gPQ = pq.grid(this.$grid, gridObj);

            //  헤더영역을 커스텀 색변경시에 맨 마지막 컬럼도 적용
            if (gridObj.headerclass) {
                this.SetAddLastHeaderClass(gridObj.headerclass);
            }

            // OnInitAfter() 호출
            //   this._gPQ.refresh({ header: false });
            //this._gPQ.refreshDataAndView({ sort: false });
            if (!this.empty && this.scrollmode) {
                var $element = this.GetElemnt();
                //resize 시 스크롤 영역을 다시 설정해줘야 하는데 resize 이벤트를 window로 잡는게 맞는건지 확인중..
                //스크롤 사용시만 resize 이벤트가 필요함
                $element.pqGrid({refresh: function( event, ui ) {
                    if (self.scrollObj) 
                        self.setCustomScrollPos();
                }});
            }

            if (self.OnVScrollEnd) {
                this._gPQ.on("scroll", function (evt, ui) {
                    var obj = this.getViewPortIndx(), rowIndx = this.options.dataModel.data.length - 1, finalV = obj.finalV;
                    if (rowIndx == finalV) {
                        if (self.showLoading == false && self._gPQ.options.NextDataExist)
                            self.OnVScrollEnd(ui, self.showLoading === true ? false : self._gPQ.options.NextDataExist);
                    }
                });

                /* V4.0 기능
                var vscrollbar = this._gPQ.vscrollbar();
                if (vscrollbar) {
                    vscrollbar.options.steps = true;

                    vscrollbar.on("scroll", function (evt, ui) {
                        if (ui.cur_pos == ui.num_eles - 1) {
                            self.OnVScrollEnd(ui, self.showLoading === true ? false : self._gPQ.options.NextDataExist);
                        }
                        //scroll vertical scrollbar of second grid.
                        //grid2.vscrollbar()
                        //    .option("cur_pos", ui.cur_pos)
                        //    .scroll();
                    });
                }*/
            }
        },

        /// <member id="SetExpertData" kind="method">
        /// <summary>엑셀,JSON, HTML 형식으로 데이터를 내보는 기능</summary>
        /// <remarks><![CDATA[
        ///  option 인자설명: https://paramquery.com/pro/api#method-exportData
        /// filename : Name of exported file without extension.
        /// format : Supported formats are 'csv', 'htm', 'json' or 'xlsx'. Extension of the file is same as format.
        /// ]]></remarks>
        /// <param name = "option" type="object"> 입력객체 </param>
        /// <param name = "data" type="array"> 배열데이터</param>
        /// <example><![CDATA[
        ///            이부분에 예제내용 기술한다...
        /// ]]></example>
        /// </member>
        SetExpertData: function (option, data) {
            var that = this._gPQ,  self = this, op = that.options,
                title = op.title;
            if (!title || op.title === "&nbsp;" ) {
                if (self.objParentForm.getFormTitle)  // MDI 모드에서 타이틀명을 취득한다.
                    title = self.objParentForm.getFormTitle();
                else
                    title = "pqGrid";
                op.title = title;  // 엑셀 시트명 이름 정의
            }

            var obj = {
                format: 'xlsx',
                render: true,
                type: 'blob'
            };

            if (option)
                $.extend(obj, option);
            // --> [Edit] 수정자:kim changa 일시:2019/12/06
            // 수정내용> 결함화면 1085 ( 추후개발) 엑셀보내보기 기능( 페이지 데이터)
            var pageData;  // 이전 페이지 데이터
            if (data) {
                pageData  = op.dataModel.data.slice(0);  // 현재페이지 데이터 복사
                op.dataModel.data = data.slice(0);       // 전체 페이지 데이터 복사
            }

            // 화면에 표시 인되고 메모리에 있는 모든 데이터를 엑셀 보내기
            if (pageData === undefined && (self.pagination && op._pageData)) {
                pageData          = op.dataModel.data.slice(0);  // 현재페이지 데이터 복사
                op.dataModel.data = op._pageData.slice(0);       // 전체 페이지 데이터 복사
            }
            var blob = that.exportData(obj);
            // 이전 페이지 데이터
            if (pageData) {
                op.dataModel.data = pageData;  // 이전 페이지 데이터 복사
            }
            // <-- [Edit] kim changa 2019/12/06        
            
            saveAs(blob, title + "." + obj.format);
        },

        /// <member id="SetImportData" kind="method">
        /// <summary> </summary>
        /// <remarks><![CDATA[
        ///  option 인자설명: https://paramquery.com/pro/api
        /// ]]></remarks>
        /// <param name = "file" type="object"> 입력객체 </param>
        /// <example><![CDATA[
        ///            이부분에 예제내용 기술한다...
        /// ]]></example>
        /// </member>
        SetImportData: function (file) {
            //debugger;
            var that = this._gPQ, self = this;
            pq.excel.importXl({
                file: file,
                sheets: [0]
            }, function (wb) {
                that.importWb({ workbook: wb, extraRows: 10, extraCols: 10 });
            })
        },


        /// <member id="SetAddLastHeaderClass" kind="method">
        /// <summary>마지막 헤더 컬럼의 class명을 설정하는 함수</summary>
        /// <remarks>CSS 파일에 미리 정의된 class명을 지정하는 기능
        ///   화면 특정상 사용자 헤더 배경색등 css 정보를 재 지정하는 경우 사용
        /// </remarks>
        /// <param name = "cls" type="string"> 선언된 클래스명</param>
        /// <example><![CDATA[
        /// 예) 맨 마지막 컬럼(스크롤영역)에 미리정의된 class명을 지정
        ///    grid.SetAddLastHeaderClass("class명");
        /// ]]></example>
        /// </member>
        SetAddLastHeaderClass: function (cls) {
            if (this._gPQ) {
                this._gPQ.$header.find('.pq-cont-right').addClass(cls);
                this._gPQ.options.ui.header_active = "";
            }
        },
        // Tab 변경시에 그리드 보이기 기능
        onTabRefresh: function (tabID) {
            if (this._tabID && this._tabID == tabID) {
                this._gPQ.refreshView();
                this._tabID = null;
            }
        },


        /// <member id="GetGridValidation" kind="method">
        /// <summary>그리드 객체존재유무를 체크하는 함수</summary>
        /// <remarks>그리드 객체가 파괴된 후에 재 호출하는 경우 위 함수로 체크한다.</remarks>
        /// <returns type="boolean"> true : 객체존재, false:객체파괴</returns>
        /// </member>
        GetGridValidation: function () {
            // 그리드 객체 파괴된 경우 존재유무를 체크한다.
            if (this._gPQ && this._gPQ.options) {
                return true;
            }
            return false;
        },

        // 그리드 사이즈에 맞게 컬럼원본 사이즈로 변경
        /// <member id="setAutoFitColum" kind="method">
        /// <summary>그리드 사이즈 변경시에 컬럼사이즈 자동으로 변경하는 기능</summary>
        /// <remarks>컬럼넓이를 px로 한경우 화면이 확대되면 여분의 컬럼을 자동으로 확대하는 기능</remarks>
        /// </member>
        setAutoFitColum : function( ui ){
            var that = this._gPQ;
            // 그리드 객체가 사라진 경우 options = undefined  ( fni.destroy )
            if (that.options && !that.element[0].offsetWidth) {
                console.log("setAutoFitColum Error!!", that);
                return
            }
            //console.log("setAutoFitColum", that);

            var CM = that.getColModel(),
                 CMLength = CM.length,
                 column, totWidth = 0;
            for (var i = 0; i < CMLength; i++) {
                column = CM[i];
                if (!column.hidden) {
                    column.width = parseInt(column._o_width);
                    totWidth += column.width;
                }
            }

            if (ui && ui.skip)
                return totWidth;

            that.refreshView();
            var $grid = that.element,
            RB = that.iRenderB,
            dims = RB.dims,
            wdGrid = Math.round($grid.width()),
            $parent = $grid.parent();

            // 기본 사이즈 
            that.options._initWidth = wdGrid;
            if (totWidth < wdGrid) {
                that.options.scrollModel.autoFit = true;
                that.refreshView();
                that.options.scrollModel.autoFit = false;
            }
        },

        onInitAfter: function () {
            //this.$grid = this.$html;
            var self = this;
            if (!this.empty && this.scrollmode) {
                // iScroll 기본속성 정보
                var options = {
                    scrollbars: true
                    , mouseWheel: true
                    , bindToWrapper: true
                    , disablePointer: true
                    , disableMouse: true
                    , bounce: false
                    , interactiveScrollbars: true
                    , useWrapperSize: true
                    , scrollY: true
                    , scrollX: true
                    , useTransform : false  // 글자색이 흐려지는 현상
                    , disableTouch: false
                    //, rectRealSize: { top: 0, left: 0, width: 0, height: 0 }
                }

                // 옵션정보를 병합한다.
                if (!hi5.isEmpty(this.scrolloption))
                    $.extend(options, this.scrolloption);

                $("#" + self.id + " .pq-body-outer .pq-cont-right").addClass("offOV");
                var $pq_outer = $("#" + self.id + " .pq-body-outer"),
                    scrollDiv = $pq_outer[0];
                // iscroll 세로스크롤이 상태 이벤트를 처리한다.
                var _iScroll = new iScroll(scrollDiv, scrollDiv, options);
                if (_iScroll) {
                    _iScroll.on("_scrollStauts", function (ui) {
                        $pq_outer.removeClass("grid_sb_area");
                        if (ui.vertScroll) $pq_outer.addClass("grid_sb_area");
                    })
                    self.scrollObj = _iScroll;

                    scrollDiv.addEventListener("iscrollmove", function (e) {
                        //if (e.subData.y * -1 != self.scrollPosY) {
                        //console.log("scrollPostion Y : " + e.subData.y * -1);
                        //console.log("scrollPostion X : " + e.subData.x * -1);
                        //debugger;
                        self._gPQ.scrollY(e.subData.y * -1);
                        self._gPQ.scrollX(e.subData.x * -1);
                        //self.scrollPosY = e.subData.y * -1;
                        //self.DrawCells();
                        //}
                    });
                }
            } else {
                if (this.fncustom.anchor) {
                    var objAnchor = this.fncustom.anchor, gridObj = {};
                    gridObj.height = objAnchor.gridheight ? objAnchor.gridheight : "auto";
                    gridObj.width   = objAnchor.gridwidth ? objAnchor.gridwidth : "100%";

                    // 그리드 부모 컨테이너 태그 넓이 스타일값을 지정한다.
                    var $div = $("#p_" + this.id);
                    $div.css({ "width": gridObj.width - 4, "height": gridObj.height });
                    this.fncustom.anchor = {};

                    if (this.canvas) {
                        this.canvasSize = { w: $div.width(), h: $div.height() };
                    }
                }

                if (!this.canvas && this.$grid[0].clientWidth == 0)   // refresh rendering 안되는 현상 강제적으로 3값을 준다.
                    $(this.$grid[0]).width(3);
            }

            //-->[LNH] 20190107 grid pagination 기능 추가
            if (this.pagination && this.$html) {
                this.targetDiv = this.id + "_page";
                this.$html.append("<div id='"+this.targetDiv+"' class='hi5_pagination'></div>");

            }
            //<--[LNH] 20190107

            if (this.canvas) {
                this.canvasGrid.CreateCanvasGrid(this.canvasSize);
            }else{
                // --> [Edit] 수정자:kim changa 일시:2019/04/19
                // 수정내용> tooltip 사용유무 옵션을 지정
                if (this._gPQ.options.tooltip) {
                    var tpOption = this._gPQ.options.tooltip.option ? this._gPQ.options.tooltip.option : null;
                    if (tpOption) {
                        // bispex 거래소에서는 position정보 상관없이 무조건 상단에 띄운다..
                        // var pos = this._gPQ.options.tooltip.pos;  // position 정보 { } 정의
                        // if (pos == "top") {
                        //     tpOption['position'] = { my: "bottom", at: "top"};
                        // } else if (pos == "bottom") {
                        //     tpOption['position'] = { my: "top", at: "bottom" };
                        // } else if (pos == "left") {
                        //     tpOption['position'] = { my: "right bottom-5", at: "left top" };
                        // } else if (pos == "right") {
                        //     tpOption['position'] = { my: "left bottom-5", at: "right top" };
                        // }
                        tpOption['position'] = { my: "bottom-10", at: "top"};
                    }
                    //tpOption['position'] = { my: "bottom", at: "top"};  // 2020.02.12 kws 무조건 가운데. 결함번호 1398
                    //tpOption이 null이면 에러나는 현상
                    // https://jqueryui.com/tooltip/#default 사이트 옵션 참고
                    var $tooltips = this._gPQ.widget().pqTooltip(tpOption? tpOption : {'position':{my: "bottom", at: "top"}});

                    if(this.$grid.hasClass("tp_use"))
                        $tooltips.pqTooltip("option", "items", ".pq-grid-row");
                    if (hi5_DebugLevel && hi5_DebugLevel.tp_item_show) {
                        var items = $tooltips.pqTooltip("option", "items");
                        // Setter
                        $tooltips.pqTooltip("option", "items", ".pq-grid-cell,.pq-title-span");
                    }

                    // tooltips.tooltip("open");tooltips.tooltip("close");
                    // 객체를 해제한다.
                    // delete this._gPQ.options.tooltip;
                }
                // <-- [Edit] kim changa 2019/04/19
                // --> [Edit] 수정자:kim changa 일시:2019/10/24
                // 수정내용> 컬럼리사이즈(refreshColumnWidths)
                /*
                var that = this._gPQ;
                if (that.options._auto_resize) {
                    that.options._ColResize = {
                        xRate: 1.0,
                        width : 0
                    }
                }
                */
                // <-- [Edit] kim changa 2019/10/24
                this._gPQ.refreshDataAndView();

                // <-- [Edit] kim changa 2019/04/19
                // --> [Edit] 수정자:kim changa 일시:2019/10/24
                // 수정내용> 컬럼리사이즈(refreshColumnWidths)
                var that = this._gPQ;
                if (that.options._auto_resize) {
                    that.options._initWidth = that.element.width();
                }
                // <-- [Edit] kim changa 2019/10/24
            }
          
        },
        // 그리드 헤더 마우스 이벤트 등록
        // grid.onGridHeaderMouseEvent( function(type, ui ){
        // console.log(type, ui);
        //});
        onGridHeaderMouseEvent : function(cb){
            var self = this,that = self._gPQ;
            var _getHeaderInfo = function (evt) {
                var $td = $(evt.currentTarget),
                    arr = that.iRenderB.getCellIndx($td[0]),
                           ri = arr[0],
                           ci = arr[1],
                           hc = that.headerCells,
                           row = hc[ri] || hc[ri - 1],
                           col = row[ci],
                           obj = {
                               rowIndx: ri,   // 행 인덱스
                               colIndx: ci,   // 컬 럼인덱스
                               column: col,  // 배열값
                               $th: $td,
                               filterRow: !hc[ri]
                           };
                return obj;
            };

            var $header = that.$header;
            $header.on("mouseenter", ".pq-grid-col", function (evt) {
                if (that.evtBelongs(evt) && cb) {
                    var ui = _getHeaderInfo(evt);
                    //return that._onHeadRightClick(evt)
                    cb("mouse_in", ui);
                }
            }).on("mouseleave", ".pq-grid-col", function (evt) {
                if (that.evtBelongs(evt) && cb) {
                    var ui = _getHeaderInfo(evt);
                    cb("mouse_out", ui);
                }
            });
        },

        // Form에서 통신전문을 작성시에 조회시작및 정보를 반환하는 함수
        GetCommValue: function (option) {
            // 통신중
            // if ( this._gPQ ) this._gPQ.showLoading();
            this.showLoading = true;
            if (option.PrevNext == 0 && commAPI.getRealTime()) {
                if (!this._realMng) {
                    if (this.realitem.length > 0) {
                        if (commAPI.isGetPoolData(this.realitem)) {
                            var dataType = this.datatype, option = { control: this };
                            switch (dataType) {
                                case gridDataType.TOPINSERT:
                                case gridDataType.CIRCULAR:
                                    option["update"] = false;
                                    break;
                            }
                            if (!this._realMng) {
                                this._realMng = new hi5_realMng();
                                this._realMng.init(option);
                            }
                        }
                    }
                }
                if (this._realMng) {
                    this._realMng.clear();
                }
            }

            if (option.fidYN && option.fidInfo) {
                option.fidInfo.isArray = "Y";          // 배열유무
                option.fidInfo.reqCnt = this.rqcount;  // 데이터 요청건수
                option.fidInfo.outFID = option.fidInfo.outFID.concat(this.comm_list);  // 출력용 FID 추가

                if (option.PrevNext != 0) {
                    switch (this.datatype) {
                        case gridDataType.TOPINSERT: // TopInsert
                        case gridDataType.TOPUPDATE: // TopUpDate
                        case gridDataType.CIRCULAR: // curcular
                            option.fidInfo.realSBC = false;
                            option.fidInfo.realSB = false;
                            break;
                        case gridDataType.TICKETAPPEND: //Ranking Append
                            option.fidInfo.realSBC = false;
                            option.fidInfo.realSB = true;
                            break;
                        default:
                            break;
                    }

                    option.fidInfo.nextKeyLen = this.nextKeyLen;
                    option.fidInfo.nextKeyBuf = this.nextKey;
                }
            }
        },

        // option 객체에 데이터 건수하고 연속유무 항목 지정
        // option.dataCount  데이터 건수
        //       .next       0: 최초조회, 2: 다음조회
        //       .dataExist  0 : 연속데이터 없음 , 1 : 연속 데이터 있음
        OnGetData: function (data, option) {
            var self = this;
            option= option ? option : { trcode:"",prevnext:0  };
            //연속키 세팅
            this.nextKey = option.nextKeyBuf;
            this.nextKeyLen = option.nextKeyLen;
            // 서비스 코드를 설정한다.
            if (this._gPQ && ( option.trcode || option._trcode) ) {
                //console.log("grid OngetData",option,this._gPQ);
                //20200417 lee nohan
                //수정내용 > tr요청후에 그리드가 파괴되어 버리면, 해당 함수로 들어왔을때 this._gPQ의 options 값이 undefined이다. 이때 trcode를 넣으려고 하다보니 error발생.
                //모바일에서는 에러가 발생하고 나면 그후 script가 실행되지 않아서 먹통이 되어버리는 현상이 발생된다.
                if(!this._gPQ.options) return;
                //
                this._gPQ.options.trcode = ( option._trcode && option._trcode !== "") ? option._trcode  : option.trcode;
            }
            //if ( this._gPQ ) this._gPQ.hideLoading();

            // PQ그리드 정보를 설정
            /// <member id="OnRpDataBefore" kind="event">
            /// <summary>그리드에 데이터 처리전에 발생되는 이벤트 함수</summary>
            /// <remarks> <![CDATA[
            ///     그리드에 데이터 표시전에 가공및 처리를 하는 기능
            ///    - ui 객체 상세 설명
            ///    <b>dataCount</b>
            ///     Type: number
            ///     데이터 건수
            ///    <b>prevnext</b>
            ///      Type: number
            ///      0 : 최초조회, 1: 이전조회, 2: 다음조회
            ///    <b>dataExist</b>
            ///     Type: boolen
            ///     false: 연속데이터 없음, true: 다음 데이터 존재
            ///   <b> fidPreNextData</b>  이전, 다음 버튼 활성화를 위한 데이터 존재유무값
            ///      type : number
            ///      0 : 이전,다음 데이터없음, 1: 이전데이터 존재, 2: 다음 데이터 존재, 3: 이전/다음 데이터 존재
            /// ]]></remarks>
            /// <param name = "option" type="object"> 통신응답 객체</param>
            /// <param name = "data"   type="object"> 응답 전문 객체 </param>
            /// <returns type="boolean"> false : 그리드 처리 안함 </returns>
            /// <example><![CDATA[
            ///            이부분에 예제내용 기술한다...
            /// ]]></example>
            /// </member>

            // --> [Edit] 수정자:kim changa 일시:2019/12/19
            // 수정내용> 결함화면 1170 정렬을 위해 컬럼을 클릭 시 발생하는 문제 
            var objData = null, ret,  _pq = this._gPQ,
                SM = this.canvas ? null : _pq.options.sortModel,
                _sort = false;

            var obj_total = self.referitem.totCount ? self.referitem.totCount : null;

            // canvas일때, pagination 호출 X.
            if (this.pagination && !this.canvas) {
                if (!self.referitem.totCount ) {
                    // --> [Edit] 수정자:kim changa 일시:2019/12/06
                    // 수정내용> 결함화면 1085 ( 추후개발) 엑셀보내보기 기능( 페이지 데이터)
                    if (!option._pageData_) {  // 이전/다음이 아닌경우 한번만 설정을 한다.
                        _pq.options._pageData = data;   // 페이지 데이터 저장
                    } else {
                        if (_pq.iSort)
                            _sort = _pq.iSort.getSorter().length ? true : false;
                    }
                } else {
                    if (_pq.iSort && (option.prevnext != 0 || option.sort))  // 강제로 소트 상태를 유지하고자 하는 경우
                        _sort = _pq.iSort.getSorter().length ? true : false;
                }

                // 칼럼너비 변경시 가로스크롤이 생김.
                // 이를 true 값으로 변경할 경우 영역크기에 맞추어 칼럼크기가 자동 수정됨.
                _pq.options.scrollModel.autoFit = false;

                //debugger;
                let totalRecords,
                pageNum = self.pageNum,
                pFlag = self.pFlag,
                rpp = self.rqcount,  // 한번에 불러올 데이터 양
                pagecount = self.pagecount,  // 페이지네이션 버튼 갯수
                curPage = self.curPage,
                initdata = data,
                obj_total = self.referitem.totCount ? self.referitem.totCount : null;

                if (option.prevnext == 0) {  // 최초조회
                    pageNum = null;
                }

                // 예외처리
                if(pageNum === null) {  // 최초조회일때
                    //debugger;
                    if (!obj_total) {
                        totalRecords = initdata ? initdata.length : null;
                    } else {
                        var outdata = option.outdata.pageRecord || {};
                        totalRecords = outdata[obj_total] ? outdata[obj_total].atoi(): 0;
                    }

                    if (totalRecords) {
                        pageNum = Math.ceil(totalRecords / rpp);
                        self.pageNum = pageNum;
                        curPage = 1;
                        if (!obj_total) {
                            // 한 페이지에 보여줄 data 가공(data를 rpp 개수만큼 쪼개기) - 추후 밑에 네 줄 삭제 예정
                            let fdata = rpp * (curPage - 1),  // 각 페이지의 첫 데이터
                                ldata = rpp * curPage;  // 각 페이지의 마지막 데이터
                            data = data.slice(fdata, ldata);  // 서버에서 페이지인덱스를 요청하면 해당 데이터값을 내려준다고 했음. 데이터후가공처리는 추후 삭제할 것!
                        }
                        this.setPagination(initdata, { rpp: rpp, curPage: 1, pagecount: pagecount, pFlag: true }, obj_total ? true: false);

                    } else {
                        // 2019.11.11 kws
                        // 데이터가 있던 상태에서 데이터 없는 조건으로 조회시, 페이지네이션 설정 값이 남아있던 오류 수정
                        this.setPagination(null, { rpp: rpp, curPage: 1, pagecount: 1, pFlag: true, prevnext: 0 }, obj_total ? true : false);
                        //console.log("totalRecords 오류 : " + totalRecords);
                    }

                } else {  // 연속조회일때
                    if (!obj_total) {
                        // 한 페이지에 보여줄 data 가공(data를 rpp 개수만큼 쪼개기) - 추후 밑에 네 줄 삭제 예정
                        let fdata = rpp * (curPage - 1),  // 각 페이지의 첫 데이터
                            ldata = rpp * curPage;  // 각 페이지의 마지막 데이터
                        data = data.slice(fdata, ldata);  // 서버에서 페이지인덱스를 요청하면 해당 데이터값을 내려준다고 했음. 데이터후가공처리는 추후 삭제할 것!
                    }
                    this.setPagination(initdata, { rpp: rpp, curPage: curPage, pagecount: pagecount, pageNum: pageNum, pFlag: pFlag }, obj_total ? true : null);
                   // debugger;
                    //this._gPQ.options.dataModel.data = initdata;
                    //this._gPQ.refreshDataAndView();
                }
                // <-- [Edit] kim changa 2019/02/01

            }  // if(this.pagination)문 종료

            if (self.OnRpDataBefore) {
                ret = self.OnRpDataBefore(option, data || {});
                if (typeof ret == "boolean" && ret == false) return;
                if (hi5.isObject(ret) || hi5.isArray(ret)) {
                    objData = ret;
                }
                else {
                    objData = data || [];
                }
            }
            else {
                objData = data || [];
            }

            if (this.canvas) {
                this.canvasGrid.OnGetData({
                    objData: objData,
                    option: option
                });

                if (self.OnRpDataAfter) {
                    self.OnRpDataAfter(option, objData, []);
                }

                this.showLoading = false;
                return;
            }

            var dataModel = {
                dataModel: { data: objData },
                dataType: "JSON"
            };

            // 연속데이터 처리를 하는 경우인가?
            if (self.OnVScrollEnd) {
                _pq.options.NextDataExist = option.dataExist;
            }

            if (option.prevnext == 2 && (this.datatype == gridDataType.TOPINSERT || this.datatype == gridDataType.TOPUPDATE || this.datatype == gridDataType.TICKETAPPEND) && !this.pagination) {   // Append
                var rpData = _pq.options.dataModel.data || [], nPos;
                nPos = rpData.length > 0 ? rpData.length : 0;
                _pq.options.dataModel.data = rpData.concat(objData);


                /// <member id="OnRpDataAfter" kind="event">
                /// <summary>그리드에 데이터 적용후 발생되는 이벤트 함수</summary>
                /// <remarks> <![CDATA[
                ///     그리드에 데이터 표시전에 가공및 처리를 하는 기능
                ///    - ui 객체 상세 설명
                ///    <b>dataCount</b>
                ///     Type: number
                ///     데이터 건수(통신응답 건수)
                ///    <b>next</b>
                ///      Type: number
                ///      0 : 최초조회, 2: 다음조회
                ///    <b>dataExist</b>
                ///     Type: number
                ///     0 : 연속데이터 없음, 1: 다음 데이터 존재
                /// ]]></remarks>
                /// <param name = "ui" type="object"> 통신응답 객체</param>
                /// <param name = "data" type="array"> 응답 전문 객체 </param>
                /// <param name = "AllData" type="array"> 누적데이터</param>
                /// <example><![CDATA[
                ///            이부분에 예제내용 기술한다...
                /// ]]></example>
                /// </member>
                if (self.OnRpDataAfter) {
                    self.OnRpDataAfter(option, objData, _pq.options.dataModel.data);
                }
                _pq.refreshDataAndView({ sort: _sort });
                _pq.scrollRow({ rowIndxPage: nPos });
                this.showLoading = false;
                return;
            }


            // JOSN Array Data인경우  JSON 형식으로 변경
            // 최초 조회응답 데이터인경우
            _pq.option(dataModel);

            if (self.OnRpDataAfter) {
                self.OnRpDataAfter(option, _pq.options.dataModel.data, []);
            }

            if (_pq.options.dataModel.data.length <= 0) {
                _pq.refreshDataAndView({ sort: false });
                this.showLoading = false;
                return;
            }

            // 소트된 상태를 초기화 한다.
            if (!_sort && SM.on)  // sort 상태 On
                _pq.reset({ sort: true, refresh: false });

            // 이전 선택된 경우 전체 해제를 한다.
            _pq.setSelection(null);
            _pq.refreshDataAndView({ sort: _sort });

            // 어드민 화면에서 컬럼 autofit 기능적용
            if (hi5.WTS_MODE == WTS_TYPE.MDI) {
                _pq.flex();
            }
            // <-- [Edit] kim changa 2019/12/19
            // Scroll Top으로 이동
            _pq.scrollRow({ rowIndxPage: 0 });
            //this._gPQ.refresh({ header: false });
            this.showLoading = false;

            if (this.scrollObj) {
                self.setCustomScrollPos();
            }
        },
        //iscroll 사용시 실제 높이를 넣어주기 위한 함수
        setCustomScrollPos: function (bNoRefresh) {
            if (bNoRefresh !== undefined && bNoRefresh === false ) return;

            var self = this, $isDiv = $("#" + self.id + " .pq-body-outer .pq-table-right");
            //ongetData에서 스크롤객체한테, 그리드의 실제 높이와 넓이를 알려주고 refresh 시킨다.
            var scrollDiv = $isDiv.css("width"),
                sheight = $isDiv.css("height");
            this.scrollObj.resize({ top: 0, left: 0, width: scrollDiv.removeAll("px"), height: sheight.removeAll("px") });

            //기본 y축 스크롤을 hidden처리한다.. 겹쳐보이기때문에,... overflow를 아예 안주게 되면 scrollY가 먹질않음..
            $("#" + self.id + " .pq-body-outer .pq-cont-right").css("overflow","hidden");
        },
        GetKeyCodeFind: function (option) {
            // 종목위치를 찾는다.
            var DM = this._gPQ.options.dataModel.data;
            var keyItmes = option.keyItmes || [], dataIndx, keys = hi5.isArray(option.key) ? option.key : option.key.split();
            if (keyItmes.length <= 0) return [];

            var column = keyItmes[0], arRow = [];
            if (hi5.isObject(column)) {
                dataIndx = column.dataIndx;
            } else {
                dataIndx = column;
            }

            //column.dataIndx;  // 종목의 위치를 취득한다( 행 위치).
            keys.forEach(function (key) {
                DM.forEach(function (rd, idx, arr) {
                    if (rd[dataIndx] == key)
                        arRow.push(idx);
                });
            });
            return arRow;
        },

        // 셀별 실시간 데이터를 갱신하는 함수
        realCellRefreh: function (ui) {
            if (!ui.refresh) return;

            var single = (ui.rowIndx !== undefined) ? true : false, self = this, no_update, 
                userSet =  hi5.SHMEM["user_setting"], animation = true;
            if (  userSet && userSet.general.animation ){
                animation = (userSet.general.animation =="Y") ? true : false;
            }

            var pbData = ui.pbData, arRow = [];
            if ( self._no_update === undefined){
                self._no_update  = self.$grid.hasClass("no_update");
            }
            no_update = self._no_update;

           // 시세표성 데이터
            if (!single) {
                arRow = this.GetKeyCodeFind({ keyItmes: this.keyItmes, key: ui.key }) || [];
                if (arRow && arRow.length <= 0) return;
            } else {
                arRow.push(ui.rowIndx);
            }
            var _grid = self._gPQ,
            DM = _grid.options.realItmes ? _grid.options.realItmes : [];
            //self._gPQ.iRenderB.data = self._gPQ.options.data
            if ( no_update && _grid.iRenderB.data.length != _grid.options.dataModel.data.length )
            {
                _grid.iRenderB.data = _grid.options.dataModel.data; 
            }

            arRow.forEach(function (rowIndx) {
                var cellUpDates = [], arCM = [], i, preRecord={}, dataIdx, dataModel = _grid.options.dataModel.data[rowIndx] || {};
                if (DM.length > 0) {
                    for (i = 0 ; i < DM.length; i++) {
                        dataIdx = DM[i];
                        if (pbData[dataIdx] && dataModel[dataIdx] != pbData[dataIdx] ) {
                            preRecord[dataIdx] = dataModel[dataIdx];
                            dataModel[dataIdx] = pbData[dataIdx];
                            arCM.push(dataIdx);
                        }
                    }
                } else {
                    // 변경된 데이터를 메모리상에서 갱신한다.
                    for (var Idx in dataModel) {
                        if (pbData[Idx] && dataModel[Idx] != pbData[Idx]) {
                            preRecord[Idx] = dataModel[Idx];
                            dataModel[Idx] = pbData[Idx];
                            arCM.push(Idx);
                        }
                    }
                }

               for ( i = 0; i < arCM.length; i++) {
                       dataIdx = arCM[i];
                    //if (pbData[dataIdx] && DM[dataIdx] != pbData[dataIdx]) {
                        //DM[dataIdx] = pbData[dataIdx];
                        //--> [Edit] lee nohan 2019/09/06 일단 임시로 class명을 보고 판단 추후 협의후 다시 결정..
                        // 작업내용: cell refresh를 할경우 실시간이 떨어질때마다 element를 새로 작성함에따라, cellclick과 같은 Event들이 등록되기전에
                        // 사용자가 cellClick시 동작을 안하는 현상이 발생한다.
                        // 따라서, update성일때, 임시로 td Element를 가져와서, text만 변경하는 처리하도록 수정
                        if (no_update) {
                            //업데이트할 해당 td element를 취득한다.
                            var CM = _grid.getColumn({ dataIndx: dataIdx }),
                                colIndx = _grid.getColIndx( { dataIndx: dataIdx } ),
                                td =  (CM && colIndx !=-1) ? _grid.iRenderB.getCell(  rowIndx,  colIndx) : null;
                            if (CM && td ) {
                                //columnRender가 있을경우, 호출하고, return text값을 취득한다.
                                var cellData = dataModel[dataIdx],
                                    //colData = _grid.getColumn({dataIndx : dataIdx}),
                                    rowData = ui.pbData,
                                    code = rowData["symbol"],
                                    opCal = CM.opCal || 0,
                                    $td = $(td),
                                    obj = {};
                                if (self.OnColumnRender && CM) {
                                    //debugger;
                                    var _ui = { rowData: rowData, column: CM, dataIndx: dataIdx,$td:$td, cellData: cellData, preRecord:preRecord,_real:true , _animation: animation };
                                    var returnObj = self.OnColumnRender(_ui);
                                    if( returnObj && (returnObj.text || returnObj.skip )){
                                        if ( returnObj.skip ) continue;
                                        cellData = returnObj.text;
                                        try{
                                          $td[0].innerText = cellData;
                                        }catch(e){
                                            console.log(e);
                                        }
                                        continue;
                                    }
                                }

                                //해당컬럼이 가격컬럼인지, 수량컬럼인지 체크후, 데이터 변경
                                if (CM.coinprice) {  // 코인가격
                                    cellData = hi5.priceF(code, cellData);
                                } else if (CM.coinqty) {    // 코인수량
                                    cellData = hi5.setQtyF(code, cellData);
                                }
                                if (CM.mask) {
                                    cellData = maskstr.GridFormat(CM.mask, { text: cellData, Export: false });
                                }

                                if (CM.symbolcolor && CM.symbolcolor.negtiv) {
                                    $td.removeClass("up_txt low_txt");
                                    var cls = cellData.signCheck().getSignColor();
                                    if (cls !=="")
                                        $td.addClass(cls);
                                }

                                switch (opCal) {
                                    case 1:     // 대상값 >,<,== item값 비교
                                    case 2:     // item값 > 0, < 0,
                                    case 4:     // 체결성향(cheItem) 항목으로 비교("1":매도체결, "2":매수체결)
                                    case 5:     // 등락부호로 색정보 반영
                                        {
                                            $td.removeClass("up_txt low_txt");
                                            // 기준가가격(baseItem) 비교
                                            obj = _GetColumnTextColor({
                                                rowData: rowData,
                                                obj: obj,
                                                options: _grid.options,
                                                cellData: cellData
                                            }, opCal);
                                        }
                                        break;
                                    case 3: {             //  등락부호(signItem) 항목으로 비교
                                        $td.removeClass("up_txt low_txt");
                                        var ob = {
                                            rowData: rowData,
                                            obj: obj,
                                            options: _grid.options,
                                            cellData: cellData
                                        };
                                        obj = _UpDownSign(ob);
                                    }
                                        break;
                                }
                                if(obj.cls !== undefined)
                                    $td.addClass(obj.cls);

                                if (obj.html !== undefined ) {
                                    $td[0].innerHTML = obj.html;
                                }else{
                                    $td[0].innerText = cellData;
                                }
                                //$td.html(cellData);
                            }
                        } else {
                            cellUpDates.push({ rowIndx: rowIndx, dataIndx: dataIdx, skip: true });
                        }
                    //}
                    //<-- [Edit] lee nohan 2019/09/06
                }
                if (cellUpDates.length > 0) {
                    // 각 셀별로 갱신을 한다.
                    cellUpDates.forEach(function (ui) {
                        self._gPQ.refreshCell(ui);
                    });
                }
            });
        },

        // 시세pooldata 표시
        OnRealTime: function (option) {
            var self = this, dataType = this.datatype;
            if (dataType == gridDataType.TOPINSERT || dataType == gridDataType.CIRCULAR) {   // TopInsert, CirCular 유형
                var ct = "==grid OnRealTime ==" + self.id;
                hi5.timeElapsed({ start: true, name: ct });
                self._gPQ.refresh({ header: false });
                //self._gPQ.refreshDataAndView({ sort: false });
                //if (self._gPQ && self._gPQ.iRenderB) {
                //    self._gPQ.iRenderB.refreshAllCells();
                //}
                //self._gPQ.refreshView();
                hi5.timeElapsed({ name: ct });
            } else if (dataType == gridDataType.TOPUPDATE) {
                this.realCellRefreh({ refresh: true, rowIndx: 0, pbData: option.data[0] });
            } else if (dataType == gridDataType.TICKET || dataType == gridDataType.PORTFOLIO || dataType == gridDataType.TICKETAPPEND) {   // UpDate성
                this.realCellRefreh({ refresh: true, key: option.key, pbData: option.data[0] });
            }
        },
        /// <member id="OnPageChange" kind="event">
        /// <summary>페이지 변경시 발생하는 함수</summary>
        /// <param name = "idx" type ="string"> 선택한 page number </param>
        /// <example><![CDATA[
        ///     OnPageChange(idx) 함수에서 form.commrequest("")호출
        ///
        /// ]]></example>
        /// </member>

        setPagination: function (data, option, ajaxMode) {
            var self = this;

            //debugger;
            let pFlag = option.pFlag;  // 페이지네이션 새로고침 여부
            let curPage = option.curPage;
            let pagecount = option.pagecount;
            let pageNum = self.pageNum;

            let startP;
            let finishP;


            if(this.targetDiv != null){
                if(pFlag) {
                    //console.log("페이지네이션 새로고침");
                    let innerHTML = "";

                    startP = (Math.ceil(curPage / pagecount) * pagecount - (pagecount - 1));   // 페이지네이션 시작페이지 인덱스
                    if(startP <= pagecount) {
                        startP = 1;
                    }

                    finishP = Math.ceil(curPage / pagecount) * pagecount;  // 페이지네이션 마침페이지 인덱스
                    if(finishP >= pageNum) {
                        finishP = pageNum;
                    }
                    //console.log("startP : " + startP + " // finishP : " + finishP);
                    
                    //paramquery에서 사용하는 페이지네이션 툴팁 객체
                    //paramquery에서 jp 일본어는 ja로 되어있어서 변경시켜줘야한다..
                    //var pqTpObj = $.paramquery.pqPager.regional[local_lang == "jp"? "ja" : local_lang];
                    var pqTpObj = $.paramquery.pqPager.regional[local_lang];
                    // 이전버튼
                    innerHTML += "<button class='hi5_btnP btnP_first' data-id='" + 1 + "' title='"+ pqTpObj.strFirstPage +"'> <i data-id='" + 1 + "' class='fa fa-angle-double-left'></i> </button>";
                    innerHTML += "<button class='hi5_btnP btnP_before' data-id='" + (startP - 1) + "' title='"+ pqTpObj.strPrevPage +"'> <i data-id='" + (startP - 1) + "' class='fa fa-angle-left'></i> </button>";

                    // 페이지네이션
                    for (let i = startP; i < (finishP + 1) ; i++) {
                        if (i == curPage)
                            innerHTML += "<button class='hi5_btnP btnP_idx hi5_activePage' data-id='" + i + "'>" + i + "</button>";
                        else
                            innerHTML += "<button class='hi5_btnP btnP_idx' data-id='" + i + "'>" + i + "</button>";
                    }

                    // 다음버튼
                    innerHTML += "<button class='hi5_btnP btnP_next' data-id='" + (finishP + 1) + "' title='"+ pqTpObj.strNextPage +"'> <i data-id='" + (finishP + 1) + "' class='fa fa-angle-right'></i> </button>";
                    innerHTML += "<button class='hi5_btnP btnP_last' data-id='" + pageNum + "' title='"+ pqTpObj.strLastPage +"'> <i data-id='" + pageNum + "' class='fa fa-angle-double-right'></i> </button>";

                    $("#" + this.targetDiv).html(innerHTML);
    				if (curPage == 1) { // "처음으로" 버튼 비활성화
                        let disabled = document.querySelector("#" + this.targetDiv + " .btnP_first");
                        disabled.setAttribute("disabled", "disabled");
                        disabled.classList.add("hi5_disBtn");
                    }
                    if (curPage == pageNum) { // "끝으로" 버튼 비활성화
                        let disabled = document.querySelector("#" + this.targetDiv + " .btnP_last");
                        disabled.setAttribute("disabled", "disabled");
                        disabled.classList.add("hi5_disBtn");
                    }
                    if ((startP - pagecount) < 1) { // 이전버튼 비활성화
                        //innerHTML += "<button class='hi5_btnP btnP_before' data-id='" + (startP-pagecount) + "' title='이전 10페이지'> < </button>";
                        let disabled = document.querySelector("#" + this.targetDiv + " .btnP_before");
                        disabled.setAttribute("disabled", "disabled");
                        disabled.classList.add("hi5_disBtn");
                    }
                    if( pageNum < (startP+pagecount) ) { // 다음버튼 비활성화
                        //innerHTML += "<button class='hi5_btnP btnP_next' data-id='"+ (startP+pagecount) +"' title='다음 10페이지'> > </button>";
                        let disabled = document.querySelector("#" + this.targetDiv + " .btnP_next");
                        disabled.setAttribute("disabled", "disabled");
                        disabled.classList.add("hi5_disBtn");
                    }


                    //debugger;
                    var self = this;
                    $("#" + self.targetDiv + " .hi5_btnP").on("click", function (e) {
						let firstP = document.querySelector("#" + self.targetDiv + " .btnP_first");
                        let lastP = document.querySelector("#" + self.targetDiv + " .btnP_last");
                        firstP.removeAttribute("disabled");
						firstP.classList.remove("hi5_disBtn");

                        lastP.removeAttribute("disabled");
                        lastP.classList.remove("hi5_disBtn");

						if (e.target.dataset.id == 1) { // "처음으로" 버튼 비활성화
							firstP.setAttribute("disabled", "disabled");
							firstP.classList.add("hi5_disBtn");
						}
						if (e.target.dataset.id == pageNum) { // "끝으로" 버튼 비활성화
							lastP.setAttribute("disabled", "disabled");
							lastP.classList.add("hi5_disBtn");
						}

                        //debugger;
                        $("#" + self.targetDiv + " .hi5_btnP").removeClass("hi5_activePage");
                        let btn_indx = e.target.dataset.id;
                        let btnP_idx = document.querySelectorAll("#" + self.targetDiv + " .btnP_idx");

                        for (let i = 0; i < btnP_idx.length; i++) {
                            if (btn_indx == btnP_idx[i].dataset.id) {
                                btnP_idx[i].classList.add("hi5_activePage");
                            }
                        }
                        self.curPage = parseInt(e.target.dataset.id); // string 타입으로 반환됨 >> number 타입으로 변환
                        if (self.curPage >= startP && self.curPage <= finishP) {
                            self.pFlag = false;
                        } else {
                            self.pFlag = true;
                        }

                        //debugger;
                        if (!ajaxMode) {
                            option['_pageData_'] = true;  // 페이지데이터 연속유무
                            self.OnGetData(data, option);
                        }
                        else if (ajaxMode || ajaxMode == 'ajax') {
                            if (self.OnPageChange)
                                self.OnPageChange(self.curPage.toString());
                        }
                        //if (self.OnPageChange)
                        //    self.OnPageChange(self.curPage);

                    });

                }

            }  // if(this.targetDiv != null) 끝!


        }, // function pagination() 끝!
        // option 객체에 데이터 건수하고 연속유무 항목 지정
        // option.realType  자동갱신 타입
        //        .key      종목코드(존재하는 경우만)
        OnRealData: function (arpbData, option, bPoolData) {
            var self = this, dataType = this.datatype, realCount = option.realCount, realType = option.realType, strcode = option.key;
            var strKey = option.key ? option.key : "", column, i = 0, nLen, rowIndex, bScrollUpDate = false;

            // this.realitem 항목에 자동갱신이 포함된 경우만 처리를 한다.
            if (option && option.realType != undefined && this.realitem.length > 0) {
                if (!this.realitem.includes(option.realType))
                    return;
            }

            var bQueuData = false;
            if (this.canvas || this._gPQ.options) {
                if (option && !bPoolData && this._realMng) {
                    if (dataType == gridDataType.TOPINSERT || dataType == gridDataType.CIRCULAR || dataType == gridDataType.TOPUPDATE) {   // TopInsert, CirCular 유형
                        // 일정큐 개수가 넘치면 자동갱신 정보만 저장후 반환을 한다.
                        bQueuData = this._realMng.setData({ countQueue: option.countQueue, realType: realType, key: strcode });
                    }
                }

                /// <member id="OnRealDataBefore" kind="event">
                /// <summary>그리드 자동갱신 데이터를 전처리 하기 위한 이벤트 함수</summary>
                /// <remarks> <![CDATA[
                ///    - <var>option...</var> 객체 상세 설명
                ///    <b>realType</b>
                ///       Type: string
                ///       자동갱신 타입 문자열
                ///    <b>key</b>
                ///     Type: string
                ///     종목코드 또는 키 문자열 ( 자동갱신 타입별로 없는 경우 있음)
                /// ]]></remarks>
                /// <param name = "option" type="object"> 옵션정보 객체</param>
                /// <param name = "data" type="object"> 자동갱신 데이터 객체 </param>
                /// <returns type="boolean"> <b>true</b> : 데이터 처리안함</returns>
                /// <example><![CDATA[
                ///   1.체결량 데이터가 10 미만이면 자동갱신 데이터를 버리는 예
                ///   grid.OnRealDataBefore = function ( option, data ){
                ///       var val = data['체결량'];
                ///       if ( parseInt(val) <= 10)
                ///         return true;
                ///   }
                ///
                /// ]]></example>
                /// </member>
                if (self.OnRealDataBefore) {
                    if (self.OnRealDataBefore(option, arpbData) == true)
                        return;
                }

                /*
                //var rpData = this._gPQ.option("dataModel.data");
                if ( dataType == gridDataType.CIRCULAR || dataType == gridDataType.TOPINSERT) {   // CirCular 유형이면 최대 건수를 적용한다.
                    var count = this.maxcount != 0 ? this.maxcount : 200;
                    if (this._gPQ.options.dataModel.data && this._gPQ.options.dataModel.data.length > 0 && count < this._gPQ.options.dataModel.data.length) {
                        if (count > realCount) {
                            this._gPQ.options.dataModel.data = [];
                        } else {
                            count = realCount;
                            // 맨 뒤어서 부터 데이터를 제거한다.
                            this._gPQ.options.dataModel.data.splice(this._gPQ.options.dataModel.data.length - count, count);
                        }
                    }
                }
                */

                if (this.canvas) {
                    this.canvasGrid.OnGetRealData(arpbData, this.datatype);

                    if (self.OnRealDataAfter) {
                        self.OnRealDataAfter(option, arpbData);
                    }

                    return;
                }

                // 그리드 원본 데이터
                var DM = this._gPQ.options.dataModel.data;
                // 0: TopInsert, 1:TopUpDate, 2:Ranking, 3:portPolio, 4:Ranking Append, 5:curcular
                if (dataType == gridDataType.TICKET || dataType == gridDataType.PORTFOLIO || dataType == gridDataType.TICKETAPPEND) {   // UpDate성
                    // 맨처음 데이터만 갱신을 한다.
                    this.realCellRefreh({ refresh: true, key: strKey, pbData: arpbData[0] });
                } else if (dataType == gridDataType.TOPINSERT || dataType == gridDataType.CIRCULAR) {   // TopInsert, CirCular 유형
                    var count = this.maxcount != 0 ? this.maxcount : 200, pos = 0;
                    realCount = Math.min(realCount, count), pos = 0;
                    for (var i = 0; i < realCount; i++) {
                        DM.insert(pos, arpbData[i]);
                        pos++;
                    }
                    if (count < DM.length) {
                        DM.splice(count, DM.length - count);
                    }


                    //var CM = this._gPQ.getColModel().concat(["pq_cellattr"]);
                    //for (var i = option.realCount - 1 ; i >= 0; i--) {
                    //    DM.insert(0, arpbData[i]);
                    //}
                    //var ct = "==grid OnInsert ==" + self.id;
                    //hi5.timeElapsed({ start: true, name: ct });
                    var refresh = bQueuData == true ? false : true;
                    //this._gPQ.addRow({ rowList: rowList, checkEditable: false, track: false, history: false, refresh: false });
                    this._gPQ.pdata = DM;
                    if (refresh && self._gPQ && self._gPQ.iRenderB) {
                        this._gPQ.refresh({ header: false });
                        var animation = true;
                        if (  hi5.SHMEM.user_setting && hi5.SHMEM.user_setting.general.animation ){
                                animation = (hi5.SHMEM.user_setting.general.animation =="Y") ? true : false;
                        };
                        //무조건 첫번째 row에 하이라이트 표시..TOPINSERT기 때문에..
                        if (dataType == gridDataType.TOPINSERT && animation){
                            var $tr = this._gPQ.getRow({rowIndx:0}), cls = "pq-grid-highlight_normal";
                            $tr.addClass(cls);
                            var id = setTimeout( (function($tr,cls) {
                                return function() {
                                    $tr.removeClass ( cls );
                                };
                            })($tr,cls) , 500);
                        }

                        //this._gPQ.refreshDataAndView({ sort: false });
                        //self._gPQ.iRenderB.refreshAllCells();
                    }
                    bScrollUpDate = refresh;
                    //hi5.timeElapsed({ name: ct });
                } else if (dataType == gridDataType.TOPUPDATE) {   // TopUpDate
                    var pbData = arpbData[0];  // 맨 처음 데이터만 갱신을 한다.
                    // 일자별인 경우 일자가 변경된 경우 데이터를 신규로 작성하는 기능
                    if (DM.length > 0 && this.fncustom.datecycle && this.fncustom.datecycle.item) {
                        // 직전데이터와 신규 데이터를 삽입한다.

                        // --> [Edit] 수정자:kim changa 일시:2019/02/27
                        // 수정내용>  UTC 시간으로 일자를 비교
                        var item = this.fncustom.datecycle.item;
                        var objTime = getUTCTimeDay({ UTCTime: false, ts1: pbData[item], ts2: DM[0][item] })
                        if (objTime.day1 != objTime.day2 ) {
                            var objData = {};
                            for (item in DM[0]) {
                                objData[item] = pbData[item];
                            }
                            // 원본데이터에 추가
                            DM = this._gPQ.options.dataModel.data.insert(0, objData);
                            this._gPQ.refreshView();
                            return;
                        }
                        // <-- [Edit] kim changa 2019/02/27
                    }
                    if (DM.length == 0) { // 첫데이터 이면 맨 상단만 업데이트한다.
                        this._gPQ.options.dataModel.data.insert(0, pbData);
                        this._gPQ.refreshRow({ rowIndx: 0 });
                    } else {  // 변경된 셀만 업데이터를 한다.
                        this.realCellRefreh({ refresh: true, rowIndx: 0, pbData: pbData });
                    }
                }

                /// <member id="OnRealDataAfter" kind="event">
                /// <summary>그리드 자동갱신 데이터를 전처리 하기 위한 이벤트 함수</summary>
                /// <remarks> <![CDATA[
                ///    - option 객체 상세 설명
                ///    <b>realType</b>
                ///     Type: string
                ///     자동갱신 타입 문자열
                ///    <b>key</b>
                ///      Type: string
                ///      종목코드 또는 키 문자열 ( 자동갱신 타입별로 없는 경우 있음)
                /// ]]></remarks>
                /// <param name = "option"   type="object"> 옵션정보 객체</param>
                /// <param name = "data" type="object"> 자동갱신 데이터 객체 </param>
                /// </member>
                if (self.OnRealDataAfter) {
                    self.OnRealDataAfter(option, arpbData);
                }
                
                if (self.scrollObj) {
                    self.setCustomScrollPos(bScrollUpDate);
                }
            }
            else {
                //console.log("OnRealData Error!!");
            }
        },

        //grid 데이터 clear
        //향후 option 객체게 realKey 넘기면, 실시간 해제도 추가..
        clearAllData: function (option) {
            this._gPQ.options.dataModel.data = [];
            this._gPQ.refreshDataAndView();
        },

        // 잔고, 미체결, 스탑로스 컨텐츠에서 호출
        _SetGridRealData: function (ui) {
            var GRID_ADD = 0, GRID_UPDATE = 1, GRID_DELETE = 2;
            var objData = ui.objData,
                 objRec = ui.objRec,
                 rowIndx = ui.rowIndx;
            
            var self = this, _gPQ =this._gPQ;
            switch (ui.gridType) {
                case GRID_DELETE: _gPQ.deleteRow({ rowIndx: rowIndx }); break;
                case GRID_ADD: {
                    _gPQ.addRow({ rowIndx: 0, newRow: hi5.clone(objData), checkEditable: false, track: false, history: false });
                }
                break;
                case GRID_UPDATE: {
                    var ar = Object.keys(objData), trans_item = _gPQ.options.trans_item, arCellRefreshItem = [], objRealItem={}, CM,
                             preRecord={}, userSet =  hi5.SHMEM["user_setting"], animation = true;
                    if (  userSet && userSet.general.animation ){
                          animation = (userSet.general.animation =="Y") ? true : false;
                    }
                 
                    for (var j = 0; j < ar.length; j++) {
                        var item = ar[j];
                        if (objData[item] !== undefined && objData[item] != objRec[item]){    
                            // 그리드 이전데이터와 신규 데이터 보관
                            preRecord[item] = objRec[item];
                            objRec[item]    = objData[item];

                            if(trans_item && trans_item[item]){
                                item = trans_item[item];
                                if ( !objRealItem[item]){
                                    objRealItem[item] = item;
                                }else{
                                    item = null;
                                }
                            }
                            // 해당 아이템이 컬럼정보에 존재 하는가?
                            if ( item){
                                CM = _gPQ.getColumn ({ dataIndx: item });
                                if ( CM )
                                    arCellRefreshItem.push({rowIndx : rowIndx , dataIndx : item});
                            }
                        }
                    }

                    arCellRefreshItem.forEach(function(obj, idx){
                        var ui ={ rowIndx: obj.rowIndx, dataIndx :obj.dataIndx, rowData:objRec, preRecord:preRecord,_real:true,  _animation:animation},$td, refresh =true,
                           colIndx = _gPQ.getColIndx( { dataIndx: obj.dataIndx } );
                        // 화면에서 OnItemCompare 비교한다. 
                        if ( self.OnItemCompare ){
                                $td =$(_gPQ.iRenderB.getCell(obj.rowIndx, colIndx));
                                if ( $td.length){
                                    ui['$td'] = $td;
                                    // 각 아이템별로 글자만 변경, 색상변경등을 처리한다.
                                    if ( self.OnItemCompare ( ui ) === true ){
                                        refresh = false;
                                    }
                                }
                        }
                        if ( refresh )
                         _gPQ.refreshCell({ rowIndx: obj.rowIndx , dataIndx : obj.dataIndx});

                        });
                }
                break;
            }
        },
    }

    grid.ctlName = "grid";
    hi5_controlExpert(grid.ctlName, grid);

    return grid;
}());


// method 시작

/// <member id="_gPQ.getColumn" kind="method">
/// <summary>dataIndx  지정한 컬럼 객체값을 취득하는 함수
///         형식 : getColumn( { dataIndx } )
/// </summary>
/// <remarks>컬럼값 취득및 컬럼 내용을 변경하고자 하는 경우에 사용가능</remarks>
/// <param name = "dataIndx" type="string|number" detail="{ dataIndx : dataIndx}"> 컬럼 인덱스 또는 키 이름 </param>
/// <returns type="object"> 컬럼객체 반환</returns>
/// <example><![CDATA[
///     "profits" 라는 컬럼키 이름으로 컬럼정보를 취득하는 예제
///       var column = grid.gPQ.getColumn({dataIndx:"profits"}) ;
///
///      또는
///       var obj = {dataIndx:"profits" };
///       var column = grid.gPQ.getColumn(obj) ;
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.getColIndx.htm">getColIndx 함수 참고</see>
/// </member>


/// <member id="_gPQ.getColIndx" kind="method">
/// <summary>dataIndx  또는 column 객체인자에 해당하는 컬럼인덱스를 취득하는 함수</summary>
/// <remarks> 현재 컬럼의 인덱스 위치정보를 취득하고자 하는 경우에 사용
///           컬럼정보가 존재하지 않는 경우는 반환값은 -1
///           형식 : getColIndx( {dataIndx, column } )
/// </remarks>
/// <param name = "dataIndx" type="string|number" detail="{ dataIndx : dataIndx },{ column : column} "> 컬럼 인덱스 또는 키 이름 </param>
/// <param name = "column"   type="object"> 컬럼 인덱스 또는 키 이름 </param>
/// <returns type="number"> 0 >= 정상, 컬럼이 미 존재하는 경우 -1 반환</returns>
/// <example><![CDATA[
///     "profits" 라는 키이름으로 컬럼정보를 취득하는 예제
///     var colIndx = grid.gPQ.getColIndx( { dataIndx: "profits" } );
///
///     또는 컬럼객체로 컬럼인덱스를 취득하는 경우
///     var column = grid.gPQ.getColumn({dataIndx:"profits"}) ;
///     var obj = {column:column };
///     var colIndx = grid.gPQ.getColIndx( obj );
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.getColumn.htm">getColumn 함수 참고</see>
/// </member>

/// <member id="_gPQ.option" kind="method">
/// <summary>그리드 옵션정보 취득 및 변경하는 기능</summary>
/// <remarks>그리드 options 객체정보를 취득(Get) 또는 변경(Set)하는 기능
///      optionName 종류 : 속성값 이름
/// </remarks>
/// <param name = "optionName" type="string"> 그리드 속성종류명중 하나 지정(필수지정)</param>
/// <param name = "value" type="string|number|object|array|boolean"> 해당 속성에 해당아는 데이터 지정</param>
/// <returns type="object"> value 인자값이 존재하는 경우만 반환값 존재(get 기능시만 반환)</returns>
/// <example><![CDATA[
///  1) options 객체를 취득(getter)
///  var option = grid.gPQ.option() 또는 var option = grid.gPQ.option("option") ;
///
///  2) editable 속성 취득(getter)
///   var editalbe = grid.gPQ.option("editalbe");
///   반환값 true , false, function함수
///
///  3) 그리드 입력불가 변경(setter)
///    grid.gPQ.option("editalbe", false);  // 전체 행,열 데이터 입력불가
///
///    또는 함수로 특정값을 비교, 스타일값을 비교해서 특정 행만 입력모드를 변경하고자 하는 경우
///    grid.gPQ.option("editable", function (ui) {
///        var rowIndx = ui.rowIndx;
///        if (rowIndx % 2 ) {
///            return false;     // 입력 불가
///        }
///        else {
///            return true;      // 입력 가능
///        }
///    });
/// ]]></example>
/// </member>


/// <member id="_gPQ.getColModel" kind="method">
/// <summary>그리드 컨트롤의 ColModel 객체정보 객체를 취득하는 함수</summary>
/// <remarks>그리드 속성정보 변경시에 사용되는 기능
/// </remarks>
/// <returns type="object"> Column 객체</returns>
/// <example><![CDATA[
///  1.컬럼정보를 전체 취득하는 예제
///  var colModel  = grid._gPQ.getColModel( );
///
///  2."profits" 컬럼정보를 취득후 정렬값을 가운데 변경하는 예제
///  var column       = grid._gPQ.getColumn( { dataIndx: "profits" } );
///      column.align = "center";
///
///
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.getColumn.htm">getColumn 함수 참고</see>
/// <see cref="../Method/dispid_gPQ.getColModel.htm">getColModel 함수 참고</see>
/// <see cref="../Method/dispid_gPQ.getColIndx.htm">getColIndx 함수 참고</see>
/// <see cref="../Method/dispid_gPQ.option.htm">option 함수 참고</see>
/// </member>

/// <member id="_gPQ.getData" kind="method">
/// <summary>지정한 열 정보에 해당하는 열 데이터를 취득하는 함수</summary>
/// <remarks>지정한 열 데이터를 취득해서 데이터 변경 및 기능 처리등에 사용</remarks>
/// <param name = "dataIndx" type="array" detail="{ dataIndx: ['dataIndx', 'dataIndx', .....] }"> 열 정보 배열인덱스 또는 키이름</param>
/// <returns type="object"> data 객체</returns>
/// <example><![CDATA[
///   "ProductName, "UnitPrice" 라는 컬럼키 이름에 해당하는 데이터를 취득하는 기능
///    var data = grid.gPQ.getData({ dataIndx: ['ProductName', 'UnitPrice'] });
///
///   반환값
///   [ { 'ProductName': 'ABC', UnitPrice: 30 }, { 'ProductName': 'DEF', UnitPrice: 15 },... ]
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.data.htm">data 함수 참고</see>
/// </member>


/// <member id="_gPQ.data" kind="method">
/// <summary>지정된 행이나 셀과 관련된 임의의 데이터 (예 : 배열, 객체, 문자열 등)를 저장하거나 액세스 하는 함수</summary>
/// <remarks>
///     _gPQ.data ( { rowData, rowIndx, dataIndx, data})
///     행 단위 또는 행,열 단위로 데이터를 취득 또는 변경하는 기능
/// </remarks>
/// <param name = "rowData" type="object|array" detail="{ rowData:rowData, rowIndx:rowIndx, dataIndx:dataIndx, data:data }" > 행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조 </param>
/// <param name = "rowIndx" type="number"> 행의 0을 기준으로 한 인덱스값 </param>
/// <param name = "dataIndx" type="string|number"> 컬럼인덱스 또는 컬럼 키 이름</param>
/// <param name = "data" type="object"> 행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조 </param>
/// <returns type="string|number|object|array"> Get 기능시에만 반환값 유효</returns>
/// <example><![CDATA[
///   //Add meta data to a row.
///   grid.gPQ.data( {rowIndx: 2, data: { key1: value1, key2: value2 } );
///
///  //get whole meta data of 3rd row.
///   var data = grid.gPQ.data({rowIndx: 2} ).data;
///
/// //get partial meta data of 3rd row with key name 'key1'.
///  var value1 = grid.gPQ.data( {rowIndx: 2, data: 'key1'}).data;
///
///  //Add meta data to a cell
///  grid.gPQ.data({rowIndx: 2, dataIndx: 'profits', data: { 'a': {'b': true} } });
///
/// ]]></example>
/// <see cref="../Method|Property/dispid_gPQ.getData.htm">getData 함수 참고</see>
/// </member>


/// <member id="_gPQ.getData" kind="method">
/// <summary>지정한 열 정보에 해당하는 열 데이터를 취득하는 함수</summary>
/// <remarks>지정한 열 데이터를 취득해서 데이터 변경 및 기능 처리등에 사용</remarks>
/// <param name = "dataIndx" type="array" detail="{ dataIndx: [ 'dataIndx', 'dataIndx', ...] }"> 열 정보 배열인덱스 또는 키이름</param>
/// <returns type="object"> data 객체</returns>
/// <example><![CDATA[
///     "ProductName", "UnitPrice" 라는 컬럼의 키 이름으로 데이터를 취득하는 예
///    var data = grid.gPQ.getData({ dataIndx: ['ProductName', 'UnitPrice'] });
///
///   반환값 예제
///   [ { 'ProductName': 'ABC', UnitPrice: 30 }, { 'ProductName': 'DEF', UnitPrice: 15 },... ]
/// ]]></example>
/// </member>


/// <member id="_gPQ.showLoading" kind="method">
/// <summary>데이터 요청 또는 표시전에 로딩아이콘을 표시하는 기능</summary>
/// <remarks>비동기 조작을 시용하는 경우에 진행상태를 표시하고자 하는 경우에 사용</remarks>
/// <example><![CDATA[
///     로딩 아이콘 상태를 표시하는 예
///     grid.gPQ.showLoading();
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.showLoading.htm">hideLoading 함수참고</see>
/// </member>

/// <member id="_gPQ.hideLoading" kind="method">
/// <summary>로딩아이콘 상태를 숨기는 기능</summary>
/// <remarks>비동기 조작을 시용하는 경우에 진행상태를 표시하고자 하는 경우에 사용
///          showLoading() 함수로 표시된후에 호출
/// </remarks>
/// <example><![CDATA[
///     로딩 아이콘 상태를 비 표시하는 예
///     grid.gPQ.hideLoading();
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.showLoading.htm">showLoading 함수참고 </see>
/// </member>

/// <member id="_gPQ.getRowData" kind="method">
/// <summary>rowIndx, rowIndxPage, recId 또는 rowData가 알려진 경우 JSON 또는 Array 형식의 행 / 레코드에 대한 참조를 반환하는 함수</summary>
/// <remarks>
///        형식 : getRowData( { rowIndx, rowIndxPage, recId, rowData } )
///     rowData가 파라미터로서 건네 받았을 때에, 같은 rowData를 반환하는 기능
/// </remarks>
/// <param name = "rowIndx" type="Integer" detail = "{rowIndx: rowIndx, rowIndxPage:rowIndxPage, recId:recId, rowData : rowData}"> 0을 기준으로 행 인덱스 </param>
/// <param name = "rowIndxPage" type="Integer"> 현재 페이지의 행에 대한 인덱스 </param>
/// <param name = "recId" type="Object"> 레코드의 기본 키 값 </param>
/// <param name = "rowData" type="Object|Array">행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조 </param>
/// <returns type="object"> rowData  객체</returns>
/// <example><![CDATA[
///   1. 0번째 행 데이터를 취득하는 예
///    var rowData = grid.gPQ.getRowData({ rowIndx: 0});
///
///  2. 3번째 페이지 행 데이터 취득하는 예
///    var rowData = grid.gPQ.getRowData( {rowIndxPage: 2} );
///
/// ]]></example>
/// </member>


/// <member id="_gPQ.getRowIndx" kind="method">
/// <summary>$tr 또는 rowData가 알려져있는 경우에 지정된 행의 행 인덱스를 취득하는 함수</summary>
/// <remarks>
///             형식 : getRowIndx( { $tr, rowData } )
///             rowIndx 및 rowIndxPage를 포함한 object 반환,
///             일치하는 항목이 없으면 빈 객체를 반환합니다.
/// </remarks>
/// <param name = "$tr" type="jQuery" detail="{ $tr:$tr, rowData:rowData}"> jQuery 객체에 래핑 된 tr 요소 </param>
/// <param name = "rowData" type="string|number|object|array|boolean"> 행 데이터를 나타내는 1 차원 배열 또는 객체</param>
/// <returns type="object">데이터 객체</returns>
/// <example><![CDATA[
///     var obj      = grid._gPQ.getRowIndx( { $tr : $tr } );
///     var rowIndx = obj.rowIndx;
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.getRowData.htm">getRowData 함수참고</see>
/// </member>

/// <member id="_gPQ.getCell" kind="method">
/// <summary>cell (HTML Element)요소를 취득하는 기능</summary>
/// <remarks>HTML 요소로 제어를 하고자 하는 경우에 사용</remarks>
/// <param name = "rowIndx" type="number" detail="{ rowIndx:rowIndx, rowIndxPage:rowIndxPage, dataIndx:dataIndx, colIndx:colIndx }"> 0 기준 행 위치값</param>
/// <param name = "rowIndxPage" type="number"> 페이지 단위로 0기준 행 인덱스값 </param>
/// <param name = "dataIndx" type="string|number"> 컬럼 인덱스 또는 키 이름 </param>
/// <param name = "colIndx" type="number"> 0기준 컬럼 인덱스 </param>
/// <returns type="object"> HTML Tag 요소 반환</returns>
/// <example><![CDATA[
///      //get cell in 3rd row and 4th column.
///      var $td = grid._gPQ.getCell( { rowIndx: 2, dataIndx: "contactName" } );
///      또는
///      var obj ={
///                 rowIndx : 2,
///                 dataIndx : "contactName"
///               };
///      var $td = _gPQ.getCell( obj );
/// ]]></example>
/// </member>



/// <member id="_gPQ.getCellHeader" kind="method">
/// <summary>colIndx 또는 dataIndx로 헤더 셀을 취득하는 함수</summary>
/// <remarks>  셀이 뷰포트에 표시되면 jQuery 객체에 래핑 된 헤더 셀을 반환
/// </remarks>
/// <param name = "dataIndx" type="number|string" detail="{ dataIndx : dataIndx, colIndx:colIndx }" > 0기준 컬럼인덱스 또는 컬럼 키이름 </param>
/// <param name = "colIndx"  type="number">  0 기준 컬럼인덱스 </param>
/// <returns type="object|array"> JQuery Dom 객체</returns>
/// <example><![CDATA[
///  // 3번째행 헤더 컬럼정보 취득후 배경색을 변경하는 예
///  var $th = grid._gPQ.getCellHeader ( { colIndx: 3 } );
///  if ($th  ) {
///     $th .css("background-color","red");
///  }
/// ]]></example>
/// </member>


/// <member id="_gPQ.refreshRow" kind="method">
/// <summary>지정한 행 또는 전체 데이터 영역(페이지단위) 전체 행을 재 표현하는 함수 </summary>
/// <remarks>  데이터 추가, 페이지 변경시 호풀
/// OnRefreshRow 이벤트 함수 호출</remarks>
/// <param name = "rowIndx" type="number" detail="{ rowIndx : rowIndx, rowIndxPage:rowIndxPage }"> 0기준 행 인덱스값 </param>
/// <param name = "rowIndxPage" type="number">  현재 페이지의 0기준 행 위치값 </param>
/// <example><![CDATA[
///  1. 0번째 행 전체를 재 표시하는 예
///     grid._gPQ.refreshRow ( {rowIndx:0} );
///  2. 1번째 행 전체를 재 표시하는 예
///     grid._gPQ.refreshRow ( {rowIndxPage:1} );
/// ]]></example>
/// </member>


/// <member id="_gPQ.refreshColumn" kind="method">
/// <summary>그리드 컬럼 영역을 재 표시하는 함수</summary>
/// <remarks>
///   Grid의 전체 열을 또는 dataIndx 또는 colIndx 로 지정한 컬럼을  새로 갱신하는 기능.
///   1) colIndx  ; 0을 기준으로 한 열의 인덱스
///   2) dataIndx : JSON의 배열 또는 키 이름에 0을 기준으로 한 인덱스
/// </remarks>
/// <param name = "dataIndx" type="number|string" detail="{ dataIndx : dataIndx, colIndx : colIndx }">  0기준 컬럼인덱스 또는 컬럼 키이름 </param>
/// <param name = "colIndx" type="number">  0을 기준으로 한 열의 인덱스  </param>
/// <example><![CDATA[
///  1 . 0 기준으로 한 열의 1번째 행을 전체 재 표시하는 예
///     grid._gPQ.refreshColumn ({colIndx:0});
///  2. "code" 키이름 열 컬럼을 전체 쟈 표시하는 예
///     grid._gPQ.refreshColumn ({dataIndx:"code"});
/// ]]></example>
/// </member>


/// <member id="_gPQ.refreshCell" kind="method">
/// <summary>그리드 한 셀 영역만 재 표시하는 함수</summary>
/// <remarks>
///   행 정보와 열정보 객체 인자는 반드시 지정해야 합니다.
///   행 (rowIndx 또는 rowIndxPage), 열(colIndx 또는 dataIndx) 2개 인자값은 필수
/// </remarks>
/// <param name = "rowIndx" type="number" detail= "{ rowIndx : rowIndx, rowIndxPage:rowIndxPage, colIndx:colIndx,  dataIndx:dataIndx }">  0기준 행위치값( 열 정보 필수지정)</param>
/// <param name = "rowIndxPage" type="number">  현재 페이지에서 0기준 행위치값 </param>
/// <param name = "colIndx"  type="number">  0 기준 컬럼인덱스( 행정보 필수지정) </param>
/// <param name = "dataIndx" type="number|string">  0기준 컬럼인덱스 또는 컬럼 키이름 </param>
/// <example><![CDATA[
///     // 0기준 22행의 "company" 키컬럼의 셀만 재 표시하는 예
///     grid._gPQ.refreshCell({ rowIndx: 21, dataIndx: 'company' } );
/// ]]></example>
/// </member>

/// <member id="_gPQ.refreshDataAndView" kind="method">
/// <summary>그리드 전체 내용(헤더, 데이터 영역등)을 재 표현하는 함수</summary>
/// <remarks>  속성변경, 데이터 추가,삭제, 원격 데이터 로드후 호출
/// </remarks>
/// <example><![CDATA[
///  // 그리드 뷰 및 헤더 전체를 재 표시
///  grid._gPQ.refreshDataAndView(  );
/// ]]></example>
/// </member>


/// <member id="_gPQ.refreshHeader" kind="method">
/// <summary> 헤더 영역을 전체 재 표현하는 함수</summary>
/// <remarks>  헤더 정보 변경후 호출 하는 기능
/// </remarks>
/// <example><![CDATA[
///  헤더 영역을 전체 재 표시
///  grid._gPQ.refreshHeader();
/// ]]></example>
/// </member>

/// <member id="_gPQ.refreshView" kind="method">
/// <summary>그리드 전체 내용(헤더, 데이터 영역등)을 재 표현하는 함수</summary>
/// <remarks>  dataModel 속성(sortIndx, sortDir, pageModel, 레코드 추가, 삭제)변경후 그리드 뷰를 새로 고치는데 기능
/// </remarks>
/// <example><![CDATA[
/// //그리드 뷰영역 재 표시
/// grid._gPQ.refreshView();
/// ]]></example>
/// </member>

/// <member id="_gPQ.sort" kind="method">
/// <summary>소트 처리를 하는 함수</summary>
/// <remarks><![CDATA[
///   sort( { single, sorter } )
///   sortModelType 객체 참조
///  모든 정렬을 제거하기 위해 빈 배열로 전달 합니다.
///  single 인자 설명
///  type : boolean true : 단일컬럼 소트, false : 멀티컬럼 소트
///  sorter 개체 설명
///  type : array형식 지정 [ { dataIndx: 컬럼아이템, dir:'up','down', dataType:'string','integer'} ]
/// ]]></remarks>
/// <param name = "sort" type="object" detail= "{ single: boolean, sorter:array}"> 컬럼의 소트 기능 정보 지정</param>
/// <example><![CDATA[
/// //code 아이템으로 큰 값으로 정렬하는 예제
/// grid._gPQ.sort( { single : true, sorter:[{ dataIndx : 'code', dir:'up'}] });
/// ]]></example>
/// </member>

/// <member id="_gPQ.addClass" kind="method">
/// <summary>행 또는 셀에서 하나 이상의 클래스 또는 빈 클래스로 분리 된 여러 클래스를 추가하는 함수</summary>
/// <remarks>
///    형식 : addClass( { rowData, rowIndx, dataIndx, cls, refresh } )
///     rowData 또는 rowIndx로 인자로 지정
/// </remarks>
/// <param name = "rowData" type="object|array" detail="{ rowIndx : rowIndx, dataIndx : dataIndx, cls:cls, rowData:rowData  }"> 행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조 </param>
/// <param name = "rowIndx" type="number">0 기준 행 인덱스 </param>
/// <param name = "dataIndx" type="string|number"> 0기준 컬럼인덱스 또는 컬럼 키값문자열 </param>
/// <param name = "cls" type="string"> 공백으로 구분 된 단일 클래스 또는 그 이상의 클래스 이름 </param>
/// <param name = "refresh" type="boolean" default = "true" option="true"> 기본값 : true  </param>
/// <example><![CDATA[
///     - Add classes 'pq-delete' & 'pq-edit' to 3rd row.
///     grid._gPQ.addClass( { rowIndx: 2, cls: 'pq-delete pq-edit' });
///
///   - Add a class 'pq-delete' to 'profits' field in 3rd row.
///     grid._gPQ.addClass(  { rowIndx: 2, dataIndx: 'profits', cls: 'pq-delete' });
///
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.removeClass.htm">removeClass 함수 참고</see>
/// </member>


/// <member id="_gPQ.removeClass" kind="method">
/// <summary>행 또는 셀에서 하나 이상의 클래스 또는 빈 클래스로 분리 된 여러 클래스를 제거하는 함수</summary>
/// <remarks>
///    형식 : removeClass( { rowData, rowIndx, dataIndx, cls, refresh } )
///     rowData 또는 rowIndx로 인자로 지정
/// </remarks>
/// <param name = "rowData" type="object|array" detail = "{ rowData: rowData, rowIndx: rowIndx, dataIndx: dataIndx, cls: cls}"> 행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조 </param>
/// <param name = "rowIndx" type="number">0 기준 행 인덱스 </param>
/// <param name = "dataIndx" type="string|number"> 0기준 컬럼인덱스 또는 컬럼 키값문자열 </param>
/// <param name = "cls" type="string"> 공백으로 구분 된 단일 클래스 또는 그 이상의 클래스 이름 </param>
/// <param name = "refresh" type="boolean" default = "true" option="true"> 기본값 : true </param>
/// <example><![CDATA[
///     - Remove classes 'pq-delete' & 'pq-edit' from 3rd row.
///     grid._gPQ.removeClass( { rowIndx: 2, cls: 'pq-delete pq-edit' });
///
///   - remove a class 'pq-delete' from 'profits' field in 3rd row.
///     grid._gPQ.removeClass(  { rowIndx: 2, dataIndx: 'profits', cls: 'pq-delete' });
///
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.addClass.htm">addClass 함수 참고</see>
/// </member>

/// <member id="_gPQ.removeData" kind="method">
/// <summary>행 또는  셀에서 이전에 저장된 데이터를  제거하는 함수</summary>
/// <remarks>
///    형식 : removeData( { rowData, rowIndx, dataIndx, data } )
///
//     행 또는 셀에서 데이터를 부분적으로 또는 완전히 제거 하는 기능
/// </remarks>
/// <param name = "rowData" type="object|array" detail= "{ rowData: rowData, rowIndx: rowIndx, dataIndx: dataIndx, data : data}"> 행 데이터를 나타내는 1 차원 배열 또는 객체에 대한 참조 </param>
/// <param name = "rowIndx" type="number">0 기준 행 인덱스 </param>
/// <param name = "dataIndx" type="string|number"> 0기준 컬럼인덱스 또는 컬럼 키값문자열 </param>
/// <param name = "data" type="string|array"> A string naming the piece of data to delete or an array or space-separated string naming the pieces of data to delete. All data is removed when this argument is not passed. </param>
/// <example><![CDATA[
///     - Remove data with key 'name' from 3rd row
///     grid._gPQ.removeData( {rowIndx: 2, data: 'name'});
///
///   - Remove all data from 3rd row.
///    grid._gPQ.removeData( {rowIndx: 2});
///
///   - remove data with key 'delete' & 'valid' from 'profits' field in 3rd row.
///     grid._gPQ.removeData(  { rowIndx: 2, dataIndx: 'profits', data: 'delete valid' });
///
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.addRow.htm">addRow 함수참고 </see>
/// <see cref="../Method/dispid_gPQ.deleteRow.htm">deleteRow 함수참고 </see>
/// <see cref="../Method/dispid_gPQ.data.htm">data 함수참고 </see>
/// </member>

/// <member id="_gPQ.refresh" kind="method">
/// <summary>그리드 뷰 전체를 재 표시함수</summary>
/// <remarks>
///     레코드 업데이트, class추가, JSON을 통한 Attribute 또는 현재 페이지의 행이나 그리드 레이아웃에 영향을주는 다른 속성
///     (예 : 높이, 너비 등)을 업데이트 한 후 그리드보기를 새로 고치는 데 사용됩니다.
///     계산 집약적 인 작업 인 경우 그리드의 그러한 옵션 / 프로퍼티의 수가 갱신되는 동안,이 메소드는 마지막에 한 번만 호출되어야한다.
/// </remarks>
/// <example><![CDATA[
///  //그리드 뷰영역 재 표시
///  grid._gPQ.refresh();
/// ]]></example>
/// </member>

/// <member id="_gPQ.deleteRow" kind="method">
/// <summary>지정한 행(rowIndx)을 삭제하는 함수</summary>
/// <remarks><![CDATA[
///   형식 : deleteRow( { rowIndx, rowList, track, source, history, refresh } )
///
///   rowList : parameter is added to support multiple deletes.
///   <b>rowIndx </b>
///    Type: number
///    Zero based index of the row.
///   <b>rowList</b>
///     Type: Array
///     Array of objects {rowIndx: rowIndx}.
///    <b>track</b>
///     Type: Boolean
///     Optional parameter with default value of trackModel.on.
///    <b>source</b>
///       Type: String
///       Optional parameter with default value of 'delete'.
///    <b>history</b>
///       Type: Boolean
///       Optional parameter with default value of historyModel.on.
///    <b>refresh</b>
///       Type: Boolean
///       Optional parameter with default value of true(refresh : false) 이면 render를 안함 loop시에 마지막 에만 refresh : true, 또는 기본값으로 한다.
/// ]]></remarks>
/// <param name = "rowIndx" type="number" detail= "{ rowIndx: rowIndx, rowList: rowList }"> 0기준 행 인덱스값 </param>
/// <param name = "rowList" type="array"> Array of objects [{rowIndx: rowIndx}]</param>
/// <param name = "track" type="boolean"  default="trackModel.on " option="true"> 기본값: trackModel.on </param>
/// <param name = "source" type="boolean" default = "update" option="true"> 기본값 : update</param>
/// <param name = "history" type="string" default="historyModel.on" option="true" > historyModel.on</param>
/// <param name = "refresh" type="boolean" default="true" option="true" > refresh 유뮤지정 기본값 : true </param>
/// <example><![CDATA[
/// // 맨 위에서 5번쨰 행을 지우는 기능
/// grid._gPQ.deleteRow( { rowIndx: 4 });
///
/// 다중으로 행들을 지우는 옵션.
/// grid._gPQ.deleteRow(
///    rowList: [
///        { rowIndx: 0 },
///        { rowIndx: 5 }
///    ]
/// );
///
/// ]]></example>
/// </member>

/// <member id="_gPQ.addRow" kind="method">
/// <summary>지정한 행(rowIndx)을 데이터를 추가하는 함수</summary>
/// <remarks>
///   형식 : addRow( { newRow, rowIndx, rowList, track, source, history, checkEditable, refresh } )
///
///   rowList : parameter is added to support multiple deletes.
///   newRow : rowData parameter is renamed to newRow. It's backward compatible and previous versions should use rowData.
///
///   <b>newRow</b>
///     type: Object or Array
///     Reference to 1-dimensional array or object representing row data.
///   <b>rowIndx</b>
///    Type: Integer
///    Zero based index of the row.
///   <b>rowList</b>
///    Type: Array
///    Array of objects {rowIndx: rowIndx}.
///   <b>track</b>
///    Type: Boolean
///    Optional parameter with default value of trackModel.on.
///   <b>source</b>
///     Type: String
///     Optional parameter with default value of 'delete'.
///   <b>history</b>
///       Type: Boolean
///       Optional parameter with default value of historyModel.on.
///   <b>refresh</b>
///       Type: Boolean
///       Optional parameter with default value of true(refresh : false) 이면 render를 안함 loop시에 마지막 에만 refresh : true, 또는 기본값으로 한다.
/// </remarks>
/// <param name = "rowIndx" type="number" detail="{ newRow: newRow, rowIndx: rowIndx, rowList: rowList, ....}"> 0기준 행 인덱스값 , 미 지정시에 맨 마지막에 추가</param>
/// <param name = "newRow" type="object"> Object holding the modified data of the row.</param>
/// <param name = "rowList" type="array"> Array of objects {rowIndx: rowIndx, newRow: newRow}</param>
/// <param name = "track" type="boolean"  default="trackModel.on " option="true"> 기본값: trackModel.on </param>
/// <param name = "source" type="boolean" default = "update" option="true"> 기본값 : update</param>
/// <param name = "history" type="string" default="historyModel.on" option="true" > historyModel.on</param>
/// <param name = "checkEditable" type="boolean" default="true" option="true"> checkBox 기본값 : true </param>
/// <param name = "refresh" type="boolean" default="true" option="true" > refresh 유뮤지정 기본값 : true </param>
/// <returns type="number">  추가한 행 위치값 반환</returns>
/// <example><![CDATA[
///     //Append a new row.
///     grid._gPQ.addRow( { newRow: {id: 20, product: 'Colgate' } );
///
///    //Insert an empty row at rowIndx : 3
///    grid._gPQ.addRow( { newRow: {}, rowIndx: 3 } );
///
///    //Insert multiple rows at once.
///    grid._gPQ.addRow({
///     rowList: [
///             { newRow: {}, rowIndx: 3 },
///             { newRow: { product: 'Apple' }, rowIndx: 5 }
///     }]);
///
/// ]]></example>
/// </member>


/// <member id="_gPQ.selection" kind="method">
/// <summary>선택된 행,열을 조작하는 기능으로 취득 및 설정을 모두하는 함수</summary>
/// <remarks>
///     형식 : selection( { type, method, rowIndx, colIndx, dataIndx, rows } )
///
///     add, replace, remove, removeAll, indexOf, isSelected, getSelection 할 수 있는 기능 제공
///   - "add" is used to append one or more selections to the selection set.
///   - "remove" removes one or more selections.
///   - "removeAll" removes all selections.
///   - "isSelected" returns true/false depending upon selection state of a row or cell.
///   - "getSelection" returns an array of selection objects containing rowIndx and/or dataIndx.
/// </remarks>
/// <param name = "type" type="string" detail="{ type: 'row,col' , method: 'Add, remove, removeAll, isSelected ,getSelection', rowIndx: rowIndx, colIndx: colIndx, dataIndx: dataIndx, rows: rows  }"> "row", "cell" 2개중에 하나만 선택</param>
/// <param name = "method" type="string"> "Add", "remove", "removeAll", "isSelected" ,"getSelection" 5개중 하나만 입력</param>
/// <param name = "rowIndx" type="number"> 0기준 행 인덱스값</param>
/// <param name = "rowIndxPage" type="number"> 0기준 현재 페이지 행 위치</param>
/// <param name = "rows" type="array"> rowIndx 해당하는 배열</param>
/// <param name = "colIndx" type="number"> 0 기준 컬럼인덱스값</param>
/// <param name = "dataIndx" type="string|number"> 0기준 컬럼 인덱스 또는 컬럼키 이름</param>
/// <returns type="object|array">  Get 기능에서만 반환값 유효</returns>
/// <example><![CDATA[
///     // add 3rd row to selection
///      grid._gPQ.selection({ type: 'row', method: 'add', rowIndx: 2});
///
///     // add 2nd, 3rd & 7th row to selection
///      grid._gPQ.selection( { type: 'row', method: 'add', rows: [ { rowIndx: 1 },{ rowIndx: 2}, {rowIndx: 6} ] });
///
///     // removes 10th row from selection.
///      grid._gPQ.selection({ type: 'row', method: 'remove', rowIndx: 9});
///
///     // remove 2nd, 3rd & 7th row from selection
///     grid._gPQ.selection( { type: 'row', method: 'remove', rows: [{ rowIndx: 1 }, { rowIndx: 2 }, { rowIndx: 6 }] });
///
///    //remove all row selections
///    grid._gPQ.selection( { type: 'row', method: 'removeAll' });
///
///    // Find whether 3rd row is selected.
///    var isSelected = grid._gPQ.selection ( { type: 'row', method: 'isSelected', rowIndx: 2 });
///
///    //Get all cell selections
///     var selectionArray = grid._gPQ.selection( { type: 'cell', method: 'getSelection' });
///
///   //Get all row selections
///      var selectionArray = grid._gPQ.selection(  { type: 'row', method: 'getSelection' });
///
///   //Get selection object
///    var selection = grid._gPQ.selection();
///
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.setSelection.htm">setSelection 함수참고</see>
/// </member>


/// <member id="_gPQ.setSelection" kind="method">
/// <summary>지정한 인자값으로 행과 열을 선택 하는 함수</summary>
/// <remarks>
///      형식 :  setSelection( { rowIndx, rowIndxPage, colIndx, focus} )
///
///     뷰포트에 셀 또는 행을 가져 와서 뷰포트에 포커스를 설정합니다.
//      null가 파라미터로서 건네 받으면 모든 것을 선택 해제합니다.
///     포커스가 거짓 인 경우 행 / 셀에 포커스를 설정하지 않습니다.
/// </remarks>
/// <param name = "rowIndx" type="number" detail=" { rowIndx: rowIndx, rowIndxPage: rowIndxPage, colIndx: colIndx }"> 0기준 행 위치값</param>
/// <param name = "rowIndxPage" type="number"> 페이지내 행 0기준 위치값</param>
/// <param name = "colIndx" type="number"> 0기준 컬럼 인덱스값</param>
/// <param name = "focus" type="boolean"> 포커스 처리유무 지정 기본값: true </param>
/// <example><![CDATA[
///     3번째 행을 선택하는 예제
///     grid._gPQ.setSelection( {rowIndx:2} );
///
///    10번쨰 행과 4번째 열을 선택하는 예제
///     grid._gPQ.setSelection(  { rowIndx: 9, colIndx: 3 });
///
///   전체 선택된 상태를 해제하는 예제
///     grid._gPQ.setSelection(  null );
///
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.getRowIndx.htm">getRowIndx함수 참고</see>
/// <see cref="../Method/dispid_gPQ.getColIndx.htm">getColIndx 함수 참고</see>
/// </member>


/// <member id="_gPQ.updateRow" kind="method">
/// <summary>행 또는 여러 행의 하나 이상의 필드를 업데이트하는 함수</summary>
/// <remarks>
///   형식 : updateRow( { rowIndx, newRow, rowList, track, source, history, checkEditable, refresh } )
///
/// If "source" parameter is passed, its value is available in the change event instead of default 'update' value when a row is updated by this method.
/// If "history" parameter is passed, this operation is added to the history or not depending upon value of the parameter.
/// "checkEditable" parameter affects the checks for editability of row and cells.
/// By default the view is refreshed by this method which can be prevented by passing refresh parameter as false to this method.
/// </remarks>
/// <param name = "rowIndx" type="number" detail=" { rowIndx: rowIndx, newRow: newRow, rowList: rowList, .... }"> 0기준 행 인덱스값 </param>
/// <param name = "newRow" type="object"> Object holding the modified data of the row.</param>
/// <param name = "rowList" type="array"> Array of objects {rowIndx: rowIndx, newRow: newRow}</param>
/// <param name = "track" type="boolean"  default="trackModel.on " option="true"> 기본값: trackModel.on </param>
/// <param name = "source" type="boolean" default = "update" option="true"> 기본값 : update</param>
/// <param name = "history" type="string" default="historyModel.on" option="true" > historyModel.on</param>
/// <param name = "checkEditable" type="boolean" default="true" option="true"> checkBox 기본값 : true </param>
/// <param name = "refresh" type="boolean" default="true" option="true" > refresh 유뮤지정 기본값 : true </param>
/// <example><![CDATA[
///     3번쨰 행 위치에 신규 데이터 삽입하는 예
///     grid._gPQ.updateRow( {rowIndx: 2,    newRow: { 'ProductName': 'Cheese', 'UnitPrice': 30 }});
///
///     // 한번에 3,6번째 행에 데이터를 upoDate하는 예
///     grid._gPQ.updateRow( { rowList: [
///                                        { rowIndx: 2, newRow: { 'ProductName': 'Cheese', 'UnitPrice': 30 } },
///                                        { rowIndx: 5, newRow: { 'ProductName': 'Butter', 'UnitPrice': 25 } }
///                                      ]
///                         });
///
/// ]]></example>
/// <see cref="../Method/dispid_gPQ.getRowIndx.htm">getRowIndx 함수참고</see>
/// <see cref="../Method/dispid_gPQ.addRow.htm">addRow 함수참고</see>
/// <shortcut key="updateRow" url="www.paramquery.com" show="true"> pqgrid 도움말 사이트</shortcut>
/// </member>
