//******************************************************************/
// All Rights Reserved. Copyright(c)   2017 (주)한국소리마치        /
//******************************************************************/
/*! File Name     : table.js
/*! Function      :	table 컴포넌트
/*! System Name   : HTML5 Project
/*! Create        : 손 기 원 , 2017/03/14
/*! Update        : 
/*! Comment       :
//******************************************************************/
(function () {
    'use strict';

    var table = function () {
        this.itemflag = "2";
        this.fncustom = {};
        this.objParentForm = null;
        this.comm_list = [];

        //this.realitem = [];
        this.realkeys = [];

        this.referitem = {};
        this.symbol = "";
        this.basicPrice = ""; //기준가격
        this.showLoading = false;

        this.itemObjs = {};      // item (key, $element)
        this.tranData = {};     //최종 데이터
        
        this._realMng = null
        this.colWidths = [];
        this.rowHeights = [];
    }
    table.prototype={
        // 각 컨트롤의 파괴함수
        onDestroy : function () {
            this.tranData = {};     //최종 데이터
            this.comm_list = [];

            if (this._realMng) {
                this._realMng.destroy();
                this._realMng = null;
            }
        },


        propertyLoad: function (node, nodeName, xmlHolderElement) {
        var that = this,
            cls = ["table_ctl table_ctl_" + this.id], // 클래스 정보명 
            style = [],           //  Style, 색정보용 Style  정보
            attr = { id: this.id } // HTML Attri 정의하는 정보 설정

        // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
        var objXML = x2h.getXML2Control(node, this, attr, cls, style);
        attr["class"] = cls.join(" ");

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
        // HTML Attribute 속성 변환( Style, Attribute, Class)
        style = x2h.attri(xmlHolderElement, attr);

        var borderStyle = style.borderStyle; //x2h.getStyleValue(props, "border-style");
        var borderWidth = style.borderWidth;//x2h.getStyleValue(props, "border-width");
         //var rowHeight = x2h.xmlGetAttr(node, "rowheight", "25px");
        var rowHeight = objXML.rowheight ? objXML.rowheight : "25px";
            // Cell 단위 기본값 정의
        var str = ".table_ctl_" + this.id + " td{background-color:" + clridx.getColorIndex("5") +
                                       ";color:" + clridx.getColorIndex("6") +
                                       ";height:" + rowHeight+
                                       ";border-color:" + clridx.getColorIndex("42");


        //line = x2h.xmlGetAttr(node, "linemode", "0");
        var line = objXML.linemode ? objXML.linemode : "0";
        switch ( line)
        {
            default:  // Horz, vert Line
                if (borderStyle != "") str += ";border-style:" + borderStyle;
                //if (borderWidth != "") str += ";border-width:" + borderWidth;
                break;
            case "1":  // Only Horz
                if (borderStyle != "") str += ";border-bottom-style:" + borderStyle;
                //if (borderWidth != "") str += ";border-bottom-width:" + borderWidth;
                str += ";border-right:none"
                break;
            case "2":  // Only vert
                if (borderStyle != "") str += ";border-right-style:" + borderStyle;
                //if (borderWidth != "") str += ";border-right-width:" + borderWidth;
                str += ";border-bottom:none"
                break;
            case "3":  // Line Not
                str += ";border:none"
                break;
        }
        str += ";}\r\n";
        this.objParentForm._style += str;

        str = "#" + this.id + " {background-color:" + clridx.getColorIndex("5") +
                                    ";border-color:" + clridx.getColorIndex("42");
        str += ";}\r\n";
        this.objParentForm._style += str;

        
        var html = node[this.orgid] ? node[this.orgid].html : "";
        if (html == "") {
            // 숨김컬럼 인덱스 정보
            var x = node.getElementsByTagName("hidecols")[0], hideCols = [];
            if (x != undefined) {
                objXML = x2h.getAttributes(x);
                hideCols = tbho.hideColsHTML(this, objXML);
            }

            x = node.getElementsByTagName("colgroup")[0];
            if (x != undefined) {
                objXML = x2h.getAttributes(x);
                html = tbho.colgroupHTML(this, objXML, hideCols);
            }
            // tbody
            x = node.getElementsByTagName("tbody")[0];
            if (x != undefined) {
                html += tbho.tbodyHTML(x, this);
            }
            //var $temp = $(html).appendTo(xmlHolderElement);
            xmlHolderElement.innerHTML = html;

            // 참조item
            //this.referitem = x2h.xmlGetAttr(node, "referitem", this.referitem);
            if (!hi5.isEmpty(this.referitem)) {
                var key, data, objItem = this.referitem.item ? this.referitem.item : {};
                for (key in objItem) {
                    data = objItem[key];
                    that.comm_list.push(data);
                }
                // 통신데이터 부가 항목
                if (this.referitem.comAddItem) {
                    this.comm_list = this.comm_list.concat(this.referitem.comAddItem);
                }
            }
            //var key = 'hi5_' + this.m_sScreenID + '_' + ctrlObj.orgid;
            node[this.orgid] = { html: html, itemObjs: hi5.clone(this.itemObjs), comm_list: this.comm_list };
        } else {
            xmlHolderElement.innerHTML = html;
            this.itemObjs = hi5.clone(node[this.orgid].itemObjs);
            this.comm_list = node[this.orgid].comm_list;
        }
            // 통신 사용 HTML element요소를 구성한다.
        var els = xmlHolderElement.getElementsByClassName('comitem');
        [].forEach.call(els, function (element) {
            var $e = $(element), item, colModel;
            item = element.getAttribute("item");
            if (item !== undefined) {
                colModel = that.itemObjs[item];

                colModel["td"] = $e;
                that.itemObjs[item] = colModel;
            }
            //$e.removeClass("comitem");
        });
    },


    // HTML 요소객체 취득

    /// <member id="GetElemnt" kind="method">
    /// <remarks>셀의 사용자 HTML 스타일 및 속성을 변경하고자 하는 경우에 사용에 사용하는 기능
    /// </remarks>
    /// <param name = "item" type="string"> 셀 아이템명 또는 FID명 또는통신 연결 셀이 아니면 "" 값 지정</param>
    /// <param name = "row" type="number"> 0 베이스기준 행 위치값 지정</param>
    /// <param name = "col" type="number"> 0 베이스기준 열 위치값 지정</param>
    /// <returns type="object"> TD HTML 객체 반환</returns>
    /// <example><![CDATA[
    ///    예1) 특정 셀 (아이템명)으로 HTML 태그를 취득후 클래스명을 추가하는 예제      
    ///    var $td= table.GetElemnt ("price"); 
    ///    if ( $td.length > 0  ){
    ///       $td.addclass("class명");
    ///    }
    ///    예1) 특정 셀 행,열 위치값 으로 HTML 태그를 취득후 클래스명을 추가하는 예제      
    ///    var $td= table.GetElemnt ("", 0, 0); 
    ///    if ( $td.length > 0 ){
    ///       $td.addclass("class명");
    ///    }
    /// ]]></example>
    /// </member>
    GetElemnt : function (strItem, nRow, nCol) {
        var self = this, $element = this.$html;
        if (strItem == undefined && nRow == undefined && nCol == undefined)
            return this.$html;
        else if (strItem != undefined && strItem != "") {
            $element = this.getColModel(strItem, { key: "td" });
        }
        else {
            if (nRow == undefined || nCol == undefined || nRow === "" || nCol === "") return $element = jQuery([]).pushStack([]);
            var row = (typeof (nRow) == 'string') ? parseInt(nRow) : nRow;
            var col = (typeof (nCol) == 'string') ? parseInt(nCol) : nCol;
            $element = $('#' + self.id + ' tr:nth-child(' + (row + 1) + ') td:nth-child(' + (col + 1) + ')');
        }
        return $element;
    },

    /// <member id="GetStyle" kind="method">
    /// <summary>컨트롤또는 셀 위치의 스타일 정보를 취득하는 함수</summary>
    /// <remarks>컨트롤 또는 셀(strItem, nRow, nCol 인자를 지정한 경우만)별 스타일을 제어한다. </remarks>
    /// <param name = "style" type="string|object"> 스타일 정보</param>
    /// <param name = "strItem" type="string" option="true"> 셀 아이템명</param>
    /// <param name = "nRow" type="number" option="true"> 행 위치</param>
    /// <param name = "nCol" type="number" option="true"> 열 위치</param>
    /// <returns type="string|object"> 스타일 정보를 반환</returns>
    /// </member>
    GetStyle : function (style, strItem, nRow, nCol) {
        var $element = this.GetElemnt(strItem, nRow, nCol), val = null;
        if ($element.length > 0) {
            val = $element.css(style);
        }
        return val;
    },

    // Style속성 설정
    /// <member id="SetStyle" kind="method">
    /// <summary>컨트롤또는 셀 위치의 스타일 정보를 변경하는 함수</summary>
    /// <remarks>컨트롤 또는 셀(strItem, nRow, nCol 인자를 지정한 경우만)별 스타일을 제어한다.
    /// 색정보( color, background-Color등 색정보변경시에는 
    /// 1. 컬러 인덱스 사용하는 경우 value 인자값에 {컬러인덱스} 지정
    /// 2. 사용자 색을 지정하는 경우  value 인자값에 RGB(0,0,0) 색 정보를 지정
    /// </remarks>
    /// <param name = "style" type="string|object"> 스타일 정보</param>
    /// <param name = "value" type="string"> 셀 아이템명</param>
    /// <param name = "strItem" type="string" option="true"> 셀 아이템명</param>
    /// <param name = "nRow" type="number" option="true"> 행 위치</param>
    /// <param name = "nCol" type="number" option="true"> 열 위치</param>
    /// </member>
    SetStyle : function (style, value, strItem, nRow, nCol) {
        var $element = this.GetElemnt(strItem, nRow, nCol);
        if ($element.length > 0) {
            // ColorIndex를 사용하는 경우({21})
            if (typeof (value) === "string")
                value = x2h.getColorReplace(value);
            typeof (style) === "object" ? $element.css(style) : $element.css(style, value);
        }
        return;
    },

    /// <member id="GetProp" kind="method">
    /// <summary>컨트롤또는 셀 위치의 속성정보를 취득하는 함수</summary>
    /// <remarks>컨트롤 또는 셀(strItem, nRow, nCol 인자를 지정한 경우만)별 속성을 제어한다. 
    ///  속성명에 특수기능 목록
    ///  1) propName = "basicprice"  : 기준가격을 취득하는 기능
    /// </remarks>
    /// <param name = "propName" type="string|array"> 속성 정보</param>
    /// <param name = "strItem" type="string" option="true"> 셀 아이템명</param>
    /// <param name = "nRow" type="number" option="true"> 행 위치</param>
    /// <param name = "nCol" type="number" option="true"> 열 위치</param>
    /// <returns type="string|array"> 속성정보를 반환</returns>
    /// </member>
    GetProp : function (propName, strItem, nRow, nCol) {
        var $element = this.GetElemnt(strItem, nRow, nCol), val="";
        if ($element.length > 0) {
            if (propName == "caption") {
                val = $element.text();
            }else if (propName == "basicprice") {
                return this.basicPrice;
            } else {
                val = $element.attr(propName);
            }
        }
        return val;
    },

    /// <member id="SetProp" kind="method">
    /// <summary>컨트롤또는 셀 위치의 속성 정보를 변경하는 함수</summary>
    /// <remarks>컨트롤 또는 셀(strItem, nRow, nCol 인자를 지정한 경우만)별 스타일을 제어한다.
    ///  속성명에 특수기능 목록
    ///  1) propName = "basicprice"  : 기준가격을 설정하는 기능
    /// </remarks>
    /// <param name = "propName" type="string"> 스타일 정보</param>
    /// <param name = "value" type="string"> 셀 아이템명</param>
    /// <param name = "strItem" type="string" option="true"> 셀 아이템명</param>
    /// <param name = "nRow" type="number" option="true"> 행 위치</param>
    /// <param name = "nCol" type="number" option="true"> 열 위치</param>
    /// </member>
    SetProp : function (propName, Value, strItem, nRow, nCol) {
        var $element = this.GetElemnt(strItem, nRow, nCol);
        if ($element.length > 0) {
            if (propName == "basicprice") {
                this.basicPrice = Value;
            } else if (propName == "caption") {
                $element.text(Value);
            } else if (propName == "symbol") {
                this.symbol = val;
            } else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
                if (propName == "disabled") {
                    this.Disabled(Value);
                }
            }
        }
    },
    /// <member id="GetItemValue" kind="method">
    /// <summary>지정한 item명으로 값을 취득하는 함수</summary>
    /// <remarks>통신데이터 취득하는 함수</remarks>
    /// <param name = "item" type="string"> 아이템명 </param>
    /// <returns type="string"> 문자열 반환</returns>
    /// <example><![CDATA[
    /// //예) "price" 아이템명에 해당하는 데이터취득
    /// var value = table.GetItemValue("price");        
    //  
    /// ]]></example>
    /// </member>

    GetItemValue : function (item, $element) {
        var value = "", colModel;
        if (item === undefined && $element) {
            item = $element.attr('item');
            if (item)
                colModel = this.getColModel(item);
        } else if (item) {
            colModel = this.getColModel(item);
        }
        if (colModel) {
            value = this.tranData[item] !== undefined ? this.tranData[item] : "";
        } else if ($element) {
            value = $element.text();
        }
        return value;
    },

    /// <member id="GetCellString" kind="method">
    /// <summary>지정한 셀 값을 취득하는 함수</summary>
    /// <remarks>마스킹 안된 원본데이터를 취득</remarks>
    /// <param name = "nRow" type="number|string"> 행 위치</param>
    /// <param name = "nCol" type="number|string"> 열 위치</param>
    /// <param name = "nOption" type="number"> 기본값:없음, 1 : 마스킹상태값</param>
    /// <returns type="string"> 지정한 셀 데이터 반환</returns>
    /// <example>
    /// str = myHoga.GetCellString(0,0);  // 0,0셀의 원본 데이터
    /// str = myHoga.GetCellString(0,0,1);  // 0,0셀의 마스킹된 데이터
    /// </example>
    /// </member>
    GetCellString : function (nRow, nCol, nOption) {
        var $element = this.GetElemnt("", nRow, nCol), val = "";
        if ($element.length > 0) {
            val = this.GetItemValue(null, $element);
        }
        return val;
    },

    /// <member id="SetCellString" kind="method">
    /// <summary>지정한 셀 위치에 값을 지정하는 함수</summary>
    /// <remarks>셀 위치 지정은 0 부터 시작</remarks>
    /// <param name = "nRow" type="number|string">  행 위치</param>
    /// <param name = "nCol" type="number|string">  열 위치</param>
    /// <param name = "value" type="string">  데이터</param>
    /// <example>
    /// myHoga.SetCellString(0,0,"12345");  // 0,0셀에 "12345"라는 데이터 지정
    /// </example>
    /// </member>
    SetCellString : function (nRow, nCol, value) {
        var $element = this.GetElemnt("", nRow, nCol);
        if ($element.length > 0) {
            var item = $element[0].getAttribute('item');
            if (item) {
                var colModel = this.getColModel(item);
                if (colModel && colModel.mask) {
                    maskstr.SetMask($element, value, { mask: colModel.mask });
                }
                else {
                    $element[0].innerHTML = value;
                }
                return;
            }
            $element[0].innerHTML = value;
            //maskstr.SetMask($element, value);
        }
    },

    /// <member id="HideCol" kind="method">
    /// <summary>해당컬럼을 show/hide 제어하는 함수</summary>
    /// <remarks>컬럼인덱스는 0부터 시작</remarks>
    /// <param name = "nCol" type="number|array"> 열 위치</param>
    /// <param name = "bHide" type="boolean"> true:hide, false:show </param>
    /// </member>
    HideCol : function (nCol, bHide) {
        var self = this, $td, cols = hi5.isArray(nCol) ? nCol : [nCol];
        //var $cols = $('#' + self.id + ' > colgroup > col');
        cols.forEach(function (colIndex) {
            $td = $('#' + self.id + ' tr > *:nth-child(' + (colIndex + 1) + ')');
            bHide === true ? $td.hide() : $td.show();
            //var colWidth = bHide == true ? "0 px" : self.colWidths[colIndex];
            //$cols.eq(colIndex).width(colWidth);
        })
    },
    /// <member id="HideRow" kind="method">
    /// <summary>해당 행을 show/hide 제어하는 함수</summary>
    /// <remarks>행인덱스는 0부터 시작</remarks>
    /// <param name = "nRow" type="number|array"> 행 위치</param>
    /// <param name = "bHide" type="boolean"> true:hide, false:show </param>
    /// </member>
    HideRow : function (nRow, bHide) {
        var self = this, $tr, rows = hi5.isArray(nRow) ? nRow : [nRow];
        //var $cols = $('#' + self.id + ' > colgroup > col');
        rows.forEach(function (idx) {
            var $tr = $('#' + self.id + ' tr:nth-child(' + (idx + 1) + ')');
            bHide === true ? $tr.hide() : $tr.show();
        });
    },

    /// <member id="SetItemValue" kind="method">
    /// <summary>JSON 형식의 데이터를 표시하는 함수</summary>
    /// <remarks>JSON 형식의 데이터(1차원 데이터)</remarks>
    /// <param name = "objDatas" type="object"> JSON데이터 </param>
    /// </member>
    SetItemValue : function (objDatas, option) {

        /// <member id="OnRealDataBefore" kind="event">
        /// <summary>테이블 자동갱신 데이터를 전처리 하기 위한 이벤트 함수</summary>
        /// <remarks> <![CDATA[
        ///    - <var>ui...</var> 객체 상세 설명
        ///    <b>realType</b>
        ///       Type: string
        ///       자동갱신 타입 문자열
        ///    <b>key</b>
        ///     Type: string
        ///     종목코드 또는 키 문자열 ( 자동갱신 타입별로 없는 경우 있음)
        /// ]]></remarks>
        /// <param name = "option" type="object"> 옵션정보 객체</param>
        /// <param name = "pbData"   type="object"> 자동갱신 데이터 객체(단건) </param>
        /// <returns type="boolean"> <b>true</b> : 데이터 처리안함</returns>
        /// <example><![CDATA[
        ///   1.체결량 데이터가 10 미만이면 자동갱신 데이터를 버리는 예
        ///   table.OnRealDataBefore = function ( option,  pbData ){
        ///       var val = pbData['체결량'];
        ///       if ( parseInt(val) <= 10)
        ///         return true;
        ///   }
        ///  
        /// ]]></example>
        /// </member>
        
        var self = this, basicPrice = "", signValue = "", item, cheValue = "", bSignChange;
        if (option && self.OnRealDataBefore) {
            if (self.OnRealDataBefore(option, objDatas) == true)
                return;
        }

        if (self.referitem.item) {
            if (self.referitem.item.basicpriceitem) {
                item = self.referitem.item.basicpriceitem;
                if (objDatas[item]) {
                    this.basicPrice = objDatas[item] || '';
                    this.basicPrice = hi5.priceF("", this.basicPrice);
                }
            }

            if (self.referitem.item.signitem){
                item = self.referitem.item.signitem;
                signValue = objDatas[item] || '';
                if (!this.tranData[item] || this.tranData[item] != signValue) {
                    bSignChange = true;
                    this.tranData[item] = signValue;  // 원본 데이터 설정
                }
            }

            if (self.referitem.item.cheitem) {
                item = self.referitem.item.cheitem;
                cheValue = objDatas[item] || '';
                if (!this.tranData[item] || this.tranData[item] != cheValue) {
                    this.tranData[item] = cheValue;  // 원본 데이터 설정
                }
            }
        }

        // 통신데이터 부가 항목
        if (this.referitem.comAddItem) {
            $.each(this.referitem.comAddItem, function (item, value) {
                if (objDatas[item]) {
                    self.tranData[item] = objDatas[item];  // 원본 데이터 설정
                }
            });
        }

        // 원본데이터를 추가
        //$.each(objDatas, function (item, value) {
        //    self.tranData[item] = value;  // 원본 데이터 설정
        //});

        //console.time("==table data_show==" + self.id);

        var objs = this.itemObjs, value, $item, colModel;
        for (var item in objs )
        {
            // 통신 데이터 검색
            if (objDatas[item] === undefined)
                continue;

            colModel = objs[item];
            $item = colModel.td;       // 셀 HTMML객체
            var element = $item[0];
            value = objDatas[item];   // 통신데이터 취득

            var optionColor, objRet = {};
            // 실시간 변경분의 데이터만 처리한다.
            if (option) {
                if (self.tranData[item] == value)
                    continue;
            }
            self.tranData[item] = value;  // 원본 데이터 설정

            if (self.OnColumnRender) {
                /// <member id="OnColumnRender" kind="event">
                /// <summary>컬럼별 데이터 설정시에 발생되는 이벤트함수 </summary>
                /// <remarks><![CDATA[
                ///   데이터 변경시점에 색 정보또는 데이터 변경 를 변경하는 경우 사용
                ///   반환값은 객체 정의
                ///   cls : true    : 스타일정보를 스크립트에서 처리 했다는 의미
                ///   text : true   : 마스킹등 데이터 가공을  스크립트에서 처리 했다는 의미
                /// ]]></remarks>
                /// <param name = "$TD" type="object"> TD THML Tag 객체 </param>
                /// <param name = "item" type="string"> 셀 item명 </param>
                /// <param name = "value" type="string"> item 항목의 데이터 </param>
                /// <param name = "objDatas" type="object"> 전체 데이터 객체(실시간, 조회용) </param>
                /// <returns type="object"> 스크립트 처리항목 반환</returns>
                /// <example><![CDATA[
                ///  1) 특정 TD HTML항목의 글자색정보를 변경하는 예제
                ///  table.OnColumnRender = function($TD, item, value, objDatas){
                ///  if ( item == "223" ) // 체결강도항목
                ///    var data = objDatas["체결강도비교FID"];
                ///    $TD.removeClass("up_txt low_txt");
                ///    if ( data == "+" ){     // 빨강색 표시
                ///         $TD.addClass( " up_txt");
                ///    } else {data == "-"}    // 파랑색 표시
                ///         $TD.addClass( " low_txt");
                ///    return {cls: true};
                ///  }
                ///
                /// ]]></example>
                /// </member>
                objRet = self.OnColumnRender($item, item, value, objDatas) || {};

                if (objRet && objRet.text != undefined){
                    value = objRet.text;
                    element.innerHTML = value;
                    return;
                }
            }

            var cointype = colModel.cointype == undefined ? "" : colModel.cointype;
            //var cointype = $item.attr("cointype") || "";
            if (cointype == "1") { // 코인가격
                value = hi5.priceF(self.symbol, value);
            } else if (cointype == "2") { // 코인수량
                value = hi5.setQtyF(self.symbol, value);
            }
           // maskstr.SetMask($item, value);
            var opcal = "", updownsign = "", plusminuscolor = "";
            if (!objRet.cls) {
                //opcal = $item.attr("opcal") || 0;
                opcal = colModel.opcal == undefined ? 0 : colModel.opcal;
                //updownsign = $item.attr("updownsign") || "";
                updownsign = colModel.updownsign == undefined ? "" : colModel.updownsign;
                //plusminuscolor = $item.attr("plusminuscolor") || "";
                plusminuscolor = colModel.plusminuscolor == undefined ? "" : colModel.plusminuscolor;
            }

            if (opcal == "3") { // 등락부호 항목으로 부호 표시
                //$item.removeClass("up_txt low_txt low_arr_table up_arr_table");
                //$item.removeClass("up_txt low_txt");
                optionColor = signValue.getSignColor();
                //$item.addClass(optionColor);
                hi5.updateClass($item, optionColor);

                maskstr.SetMask($item, value, { mask: colModel.mask, sign: true, signChange: bSignChange, data: signValue });
            } else {
                maskstr.SetMask($item, value, { mask: colModel.mask });
            }

            if (opcal == "1") {    //기준가 항목으로 색상표시
                //$item.removeClass("up_txt low_txt");
                optionColor = "";
                if (self.basicPrice != '') {
                    var dif = parseFloat(value) - parseFloat(self.basicPrice);
                    if (dif > 0)
                        optionColor = "up_txt";
                    else if (dif < 0)
                        optionColor = "low_txt";

                    hi5.updateClass($item, optionColor);
                    //if (optionColor)
                    //    $item.addClass(optionColor);
                }
            }
            else if (opcal == "2") {    //부호 또는 등락률 항목으로 색상표시

            }
            else if (opcal == "4") { // 체결성향 항목으로 부호 표시
                //$item.removeClass("up_txt low_txt");
                optionColor = cheValue.SellBuyCls();
                hi5.updateClass($item, optionColor);
                //$item.addClass(optionColor);
            }
            else if (opcal == "5") {    //대비부호 항목으로 색상표시
                //$item.removeClass("up_txt low_txt");
                optionColor = signValue.getSignColor();
                hi5.updateClass($item, optionColor);
                //if (optionColor)
                //    $item.addClass(optionColor);
            }

            if (updownsign == "1") { // 대비부호
                $item[0].text = "";
                //$item.removeClass("up_txt low_txt lower_arr_table upper_arr_table");
                optionColor = signValue.getUpDownSignCls(true);
                hi5.updateClass($item, optionColor);
                //$item.addClass(optionColor);
            }

            if (plusminuscolor == "1") {
                optionColor = "";
                //$item.removeClass("up_txt low_txt");
                if (value > 0)
                    optionColor = "up_txt";
                else if (value < 0)
                    optionColor = "low_txt";
                hi5.updateClass($item, optionColor);
                //if (optionColor)
                //    $item.addClass(optionColor);
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
        /// <param name = "pbData" type="object"> 자동갱신 데이터 객체 </param>
        /// </member>
        if (option && self.OnRealDataAfter) {
            self.OnRealDataAfter(option, objDatas);
        }
        //console.timeEnd("==table data_show==" + self.id);
    },

    SetTagAppend : function (objData) {
        if (hi5.isEmpty(objData) || objData.ctlAppend === undefined) return;
        var styles = { top: "0px",left: "0px",width: "100%",height: "100%",position: "relative" };

        for (var x = 0; x < objData.ctlAppend.length; x++) {
            var obj = objData.ctlAppend[x];
            var td = this.GetElemnt("", obj.row, obj.col);
            td.css("padding", "0px");

            for (var j = 0 ; j < obj.ctl.length; j++) {
                var id = obj.ctl[j];
                // id값에 {{id.}}값이 없으면 추가를 한다.
                if (!idpattern.test(id)) id = "{{id.}}" + id;
                id = x2h.getUniqID(id, this.objParentForm);
                var objCtl = this.objParentForm.GetObjData(id);
                if (objCtl.ctlName == 'grid') {
                    if (objCtl._gPQ) {
                        objCtl._gPQ.options.width = "100%"; objCtl._gPQ.options.height = "100%";
                    } else {
                        objCtl.options_width = "100%"; objCtl.options_height = "100%";
                    }
                }
                var element = $("#" + id);

                element.css(styles);
                td.append(element);
            }
        }
    },

    // item 인자값의 객체취득하는 함수
    getColModel : function (item, option) {
        var colModel = this.itemObjs[item] !== undefined ? this.itemObjs[item] : null;
        if ( option && option.key) {
            var key = option.key;
            if (colModel) {
                return colModel[key];
            }
            return null;
        }
        return colModel;
    },

    onInitAfter : function () {
        this.SetTagAppend(this.fncustom);
        this.fncustom = {};

        var self = this;

        var $self = this.$html;

        if (self.OnCellClick) {
            $self.delegate('td', 'click', function (e) {
                var $element = $(this);
                if (typeof ($element) == undefined) {
                    return;
                }

                if ($(e.target).is('input:checkbox')) {

                } else {
                }

                var table = $(e.target).closest('table');
                //var p = $(e.target).parent();
                //var p1 = $(e.target).parentsUntil('table');

                var id = table.attr('id'), nRow, nCol, item, value;
                if (id != self.id)
                    return;

                nRow = $element.parent().index();
                nCol = $element.index();

                item = $element.attr("item");
                if (item == undefined) item = "";
                value = self.GetItemValue(item, $element);

                // OnCellClick 클릭이벤트 발생
                self.OnCellClick.call(self, nRow, nCol, item, value);

                //var fn = self.objParentForm.getIsEventName(id, "OnCellClick");
                //if (typeof fn === "function") {
                //    self.OnCellClick(fn, nRow, nCol, item, value);
                //}
            });
        }
    },

    // Form에서 통신전문을 작성시에 조회시작및 정보를 반환하는 함수
    GetCommValue : function (option) {
        this.basicPrice = ""; // 기준값 초기화
        // 통신중
        this.showLoading = true;
        //this.realMng = {};

        if ( commAPI.getRealTime() && this.realitem.length > 0) {
            if (!this._realMng) {
                this._realMng = new hi5_realMng();
                this._realMng.init({ control: this });
            } else {
                this.realMng.clear();
            }
        }
        if (option.fidYN && option.fidInfo) {
            option.fidInfo.outFID = option.fidInfo.outFID.concat(this.comm_list);  // 출력용 FID 추가
        }
    },

    OnGetData : function (data) {
        // 메모리 데이터를 초기화한다.
        this.tranData = {};

        var record = {};
        if (hi5.isObject(data)) {
            record = data;
        } else if (hi5.isArray(data) && data.length > 0) {
            record = data[0];
        }

        // 빈 데이터 인경우 초기화
        if (hi5.isEmpty(record)) {
            this.comm_list.forEach(function (item) {
                record[item] = "";
            });
        }

        this.showLoading = false;
        this.SetItemValue(record);
    },

    OnRealTime : function (option) {
        if (this.showLoading) return;

        this.SetItemValue(option.data[0], option);
    },

    OnRealData : function (arpbData, option) {
        var strcode   = option.key,
            realType  = option.realType,
            realCount = option.realCount,
            realData;

        // this.realitem 항목에 자동갱신이 포함된 경우만 처리를 한다.
        if (option && option.realType != undefined && this.realitem.length > 0 ) {
            if (!this.realitem.includes(option.realType))
                return;
        }

        // 일정큐 개수가 넘치면 자동갱신 정보만 저장후 반환을 한다.
        var bQueuData = false;
        if (this._realMng) {
            bQueuData = this._realMng.setData ({ countQueue: option.countQueue, realType: realType, key: strcode });
        }

        if (bQueuData) return;
        // 배열 데이터인경우 맨 처음 데이터만 적용을 한다.
        if (hi5.isArray(arpbData))
            realData = arpbData[0]; // 맨 처음 데이터만 갱신을 한다.
        else
            realData = arpbData;
        
        if (realData) {
            this.SetItemValue(realData, option);
        }
    },

    //table 데이터 clear
    //향후 option 객체게 realKey 넘기면, 실시간 해제도 추가..
    clearAllData : function (option) {
        this.OnGetData({});
    }

    /// <member id="OnCellClick" kind="event" default="true">
    /// <summary>Cell 클릭시 발생되는 이벤트 함수</summary>
    /// <remarks>remarks</remarks>
    /// <param name = "nRow" type="number"> 행 위치</param>
    /// <param name = "nCol" type="number"> 열 위치</param>
    /// <param name = "item" type="string"> item 문자열</param>
    /// <param name = "value" type="string"> 원본데이터</param>
    /// </member>
    }
    
    table.ctlName = "table";
    hi5_hash.record(table.ctlName).fn = table;
    return table;
}());
