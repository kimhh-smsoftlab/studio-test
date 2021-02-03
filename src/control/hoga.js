//******************************************************************/
// All Rights Reserved. Copyright(c)   2017 (주)한국소리마치        /
//******************************************************************/
/*! File Name     : hoga.js
/*! Function      :	hoga 컴포넌트
/*! System Name   : HTML5 Project
/*! Create        : 손 기 원 , 2017/03/14
/*! Update        :
/*! Comment       :
//******************************************************************/
var g_SellBuyQtyList = {
    "0013" : true,
    sell: ["askqty20", "askqty19", "askqty18", "askqty17", "askqty16", "askqty15", "askqty14", "askqty13", "askqty12", "askqty11", "askqty10", "askqty9", "askqty8", "askqty7", "askqty6", "askqty5", "askqty4", "askqty3", "askqty2", "askqty1"],
    buy: ["bidqty1", "bidqty2", "bidqty3", "bidqty4", "bidqty5", "bidqty6", "bidqty7", "bidqty8", "bidqty9", "bidqty10",  "bidqty11", "bidqty12", "bidqty13", "bidqty14", "bidqty15", "bidqty16", "bidqty17", "bidqty18", "bidqty19", "bidqty20"],
    typeCheck: function (type) {
        return this[type] == undefined ? false : true;
    }
}
//sell: ["askqty20", "askqty19", "askqty18", "askqty17", "askqty16", "askqty15", "askqty14", "askqty13", "askqty12", "askqty11", "askqty10", "askqty9", "askqty8", "askqty7", "askqty6", "askqty5", "askqty4", "askqty3", "askqty2", "askqty1"],
//sell: ["askqty1", "askqty2", "askqty3", "askqty4", "askqty5", "askqty6", "askqty7", "askqty8", "askqty9", "askqty10", "askqty11", "askqty12", "askqty13", "askqty14", "askqty15", "askqty16", "askqty17", "askqty18", "askqty19", "askqty20"],
// 호가가격FID에 해당하는 환산가격 FID리스트
var g_Hoga_CPList = {
    // 매도20호가~1호가
    "ask10": "3001",
    "ask9": "3000",
    "ask8": "2999",
    "ask7": "2998",
    "ask6": "2997",
    "ask5": "2996",
    "ask4": "2995",
    "ask3": "2994",
    "ask2": "2993",
    "ask1": "2992",
    // 매수1호가~20호가
    "bid1": "3002",
    "bid2": "3003",
    "bid3": "3004",
    "bid4": "3005",
    "bid5": "3006",
    "bid6": "3007",
    "bid7": "3008",
    "bid8": "3009",
    "bid9": "3010",
    "bid10": "3011"
};

(function () {
    'use strict';
    var hoga = function () {
        this.itemflag = "2";
        this.hogatype = 0;  // 0 : 촤우대칭 1 : 좌측유형(호가가격이 우측) 2 : 우측유형(호가가격이 촤측)
        this.price = "";
        this.basePrice = "";
        //this.colRate;       // 호가 등락률 컬럼위치(기본값 미지정)

        //this.mapHogaList = new JMap();
        this.mapHogaList = {};
        this.fncustom = {};
        this.objParentForm = null;

        this.comm_list = [];

        //this.realitem = [];  
        this.realkeys = [];
        this.bHogaRate = false;  // 호가 등락률 컬럼 사용유뮤
        this.maxhoga = 10;  // 최대호가 가격
        this.referitem = {};
        this.hogabar = true;
        this.priceframe = true;
        this.showLoading = false;
        this.symbol = "";
        this.curPriceTD = null;

        this.itemObjs = {};      // item (key, $element)
        this.tranData = {};     //최종 데이터
        this.debug = false;
        this.convertprice = false;   
        this.convertprice_toggle = 0; // 환산가격 toggle 기능( 1 : 등락률, 2: 환산가격)

        // 환산가격 계산값
        this.baseCoinPrice = ""; // 기초자산 가격
        
        this.baseSymbol = ""; // 기초자산 심볼
        this._realMng = null;
        this.control = this;
        this.colWidths = [];
        this.rowHeights = [];

    }

    hoga.prototype = {
        // 각 컨트롤의 파괴함수
        onDestroy : function () {
            this.tranData = {};     //최종 데이터
            this.comm_list = [];

            // 기초자산 종목실시간 해제한다.
            this.SetProp("sbc");

            //this.realMng = {};
            if (this._realMng) {
                this._realMng.destroy();
                this._realMng = null;
            }
        },

        propertyLoad : function (node, nodeName, xmlHolderElement) {
            //console.time("==hoga_loading ==" + this.id);        // Start
            var that = this,
                cls = ["hoga_tbl hoga_tbl_" + this.id], // 클래스 정보명 
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: this.id } // HTML Attri 정의하는 정보 설정
            
            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            var objXML = x2h.getXML2Control(node, this, attr, cls, style);
            attr["class"] = cls.join(" ");


            // 환산가격 toggle 사용유무
            if (this.fncustom && this.fncustom.convertprice == "toggle") {
                this.convertprice_toggle = 2;  // 환산가격
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
            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);
           //var rowHeight = x2h.xmlGetAttr(node, "rowheight", "25px");  // %
            var rowHeight = objXML.rowheight ? objXML.rowheight : "25px";

            // 기본 높이 px(다중마켓 인경우)
            //rowHeight = x2h.xmlGetAttr(node, "rowheight_px", "40px");  // px
            rowHeight = objXML.rowheight_px ? objXML.rowheight_px : "40px";
            // Cell 단위 기본값 정의
            /*
            var str = ".hoga_tbl_" + this.id + " td, th{background-color:" + clridx.getColorIndex("5") +
                                           ";color:" + clridx.getColorIndex("6") +
                                           ";border-color:" + clridx.getColorIndex("42");
            if (this.convertprice && this.convertprice_toggle == 0)
                str += ";height:" + rowHeight;
            str += ";}\r\n";

            this.objParentForm._style += str;

            str = "#" + this.id + " {background-color:" + clridx.getColorIndex("5") +
                                        ";border-color:" + clridx.getColorIndex("42");
            str += ";}\r\n";
            this.objParentForm._style += str;
            */
            var html = node[this.orgid] ? node[this.orgid].html : "";
            if (html == "") {
                // 숨김컬럼 인덱스 정보
                var x = node.getElementsByTagName("hidecols")[0], hideCols = [];
                if (x != undefined) {
                    objXML = x2h.getAttributes(x);
                    hideCols = tbho.hideColsHTML(this, objXML);
                }

                //<colgroup> <col style="width:50.00000%"> <col style="width:50.00000%"></colgroup>
                x = node.getElementsByTagName("colgroup")[0];
                if (x) {
                    objXML = x2h.getAttributes(x);
                    html = tbho.colgroupHTML(this, objXML, hideCols);
                }
                // thead
                var thead = node.getElementsByTagName("thead");
                if (thead.length > 0) {
                    html += tbho.tbodyHTML(thead[0], this, ["display: block;"]);
                }
                // tbody
                x = node.getElementsByTagName("tbody")[0];
                if (x != undefined) {
                    html += tbho.tbodyHTML(x, this);
                }

                // thead
                if (thead.length >= 1) {
                    html += tbho.tbodyHTML(thead[1], this, ["display: block;"]);
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
                node[this.orgid] = { html: html, itemObjs: hi5.clone(this.itemObjs), comm_list: this.comm_list, HogaRate: this.bHogaRate };
            }
            else {
                xmlHolderElement.innerHTML = html;
                this.itemObjs = hi5.clone(node[this.orgid].itemObjs);
                this.comm_list = node[this.orgid].comm_list;
                this.bHogaRate = node[this.orgid].HogaRate;
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
            //console.timeEnd("==hoga_loading ==" + this.id);        // End
        },

        // HTML 요소객체 취득
        /// <member id="GetElemnt" kind="method">
        /// <summary>호가 컨트롤의 해당 셀의 HTML 요소태그 정보를 취득하는 기능</summary>
        /// <remarks>셀의 사용자 HTML 스타일 및 속성을 변경하고자 하는 경우에 사용에 사용하는 기능
        /// </remarks>
        /// <param name = "item" type="string"> 셀 아이템명 또는 FID명 또는통신 연결 셀이 아니면 "" 값 지정</param>
        /// <param name = "row" type="number"> 0 베이스기준 행 위치값 지정</param>
        /// <param name = "col" type="number"> 0 베이스기준 열 위치값 지정</param>
        /// <returns type="object"> TD HTML 객체 반환</returns>
        /// <example><![CDATA[
        ///    예1) 특정 셀 (아이템명)으로 HTML 태그를 취득후 클래스명을 추가하는 예제      
        ///    var $td= hoga.GetElemnt ("price"); 
        ///    if ( $td.length > 0 ){
        ///       $td.addclass("class명");
        ///    }
        ///    예1) 특정 셀 행,열 위치값 으로 HTML 태그를 취득후 클래스명을 추가하는 예제      
        ///    var $td= hoga.GetElemnt ("", 0, 0); 
        ///    if ( $td.length > 0 ){
        ///       $td.addclass("class명");
        ///    }
        /// ]]></example>
        /// </member>
        GetElemnt : function (strItem, nRow, nCol) {
            var self = this, $element;
            if (strItem == undefined && nRow == undefined && nCol == undefined)
                $element = this.$html;
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

        /// <member id="SetPrice" kind="method">
        /// <summary>현재가 가격을 지정하는 함수</summary>
        /// <remarks>호가 가격에서 현재가 가격과 호가가격이 동일한 위치에 frame 표시할때사용</remarks>
        /// <param name = "value" type="string"> 현재가가격 </param>
        /// </member>
        SetPrice : function (value) {
            if (this.curPriceTD)
                this.curPriceTD.removeClass("curframe_up curframe_down curframe_euq");

            if (value == "") {
                this.curPriceTD = null;
                return;
            }
            //        if (value != this) {
            //           var e = $("#" + this.id).find(".curframe");
            //            for (var i = 0 ; e.length; i++) {
            //                e[i].removeClass("curframe");
            //           }
            //       }
            if (this.priceframe == false) return;

            this.price = value;
            var hogaElemnt = this.mapHogaList[this.price] != undefined ? this.mapHogaList[this.price].td : null;
            this.curPriceTD = hogaElemnt;
            //var hogaElemnt = this.mapHogaList.get(this.price);
            if (hogaElemnt != null) {
                var b = parseFloat(this.basePrice), p = parseFloat(this.price);
                if (p > b) hogaElemnt.addClass("curframe_up");
                else if (p < b) hogaElemnt.addClass("curframe_down");
                else hogaElemnt.addClass("curframe_euq");
            }
        },

        /// <member id="GetPrice" kind="method">
        /// <summary>현재가 가격을 취득하는 함수</summary>
        /// <returns type="string"> 현재가 가격 반환</returns>
        /// </member>
        GetPrice : function () {
            return this.price;
        },

        /// <member id="SetBasePrice" kind="method">
        /// <summary>기준가 가격을 지정하는 함수</summary>
        /// <remarks>호가가격의 색정보를 구현을 위한 기준가가격으로 사용</remarks>
        /// <param name = "value" type="string">기준가격</param>
        /// <returns type="string"> 기준가격</returns>
        /// </member>
        SetBasePrice : function (value) {
            this.basePrice = value;
        },

        /// <member id="GetBasePrice" kind="method">
        /// <summary>기준가 가격을 취득하는 함수</summary>
        /// <returns type="string"> 지준가가격 반환</returns>
        /// </member>
        GetBasePrice : function () {
            return this.basePrice;
        },

        /// <member id="GetAllData" kind="method">
        /// <summary>현재 호가 테이블이 취득한 모든 데이터 반환하는 함수</summary>
        /// <returns type="obj">마지막 조회or리얼 데이터</returns>
        /// </member>
        GetAllData : function () {
            return this.tranData;
        },


        /// <member id="GetItemValue" kind="method">
        /// <summary>지정한 item명으로 값을 취득하는 함수</summary>
        /// <remarks>통신데이터 취득하는 함수</remarks>
        /// <param name = "item" type="string"> 아이템명 </param>
        /// <returns type="string"> 문자열 반환</returns>
        /// <example><![CDATA[
        /// //예) "price" 아이템명에 해당하는 데이터취득
        /// var value = hoga.GetItemValue("price");        
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
        /// hoga.SetCellString(0,0,"12345");  // 0,0셀에 "12345"라는 데이터 지정
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
            }
        },

        /// <member id="GetStyle" kind="method">
        /// <summary>컨트롤또는 셀 위치의 스타일 정보를 취득하는 함수</summary>
        /// <remarks>컨트롤 또는 셀(strItem, nRow, nCol 인자를 지정한 경우만)별 스타일을 제어한다. </remarks>
        /// <param name = "style" type="string|object|array"> 스타일 정보</param>
        /// <param name = "strItem" type="string" option="true"> 셀 아이템명</param>
        /// <param name = "nRow" type="number" option="true"> 행 위치</param>
        /// <param name = "nCol" type="number" option="true"> 열 위치</param>
        /// <returns type="string|object"> 스타일 정보를 반환</returns>
        /// </member>
        GetStyle : function (style, strItem, nRow, nCol) {
            var $element = this.GetElemnt(strItem, nRow, nCol), val = null;
            if ($element.length > 0)
                val = $element.css(style);

            return val;
        },


        /// <member id="SetStyle" kind="method">
        /// <summary>컨트롤또는 셀 위치의 스타일 정보를 변경하는 함수</summary>
        /// <remarks>컨트롤 또는 셀(strItem, nRow, nCol 인자를 지정한 경우만)별 스타일을 제어한다.
        /// 색정보( color, background-Color등 색정보변경시에는
        /// 1. 컬러 인덱스 사용하는 경우 value 인자값에 {컬러인덱스} 지정
        /// 2. 사용자 색을 지정하는 경우  value 인자값에 RGB(0,0,0) 색 정보를 지정
        /// </remarks>
        /// <param name = "style" type="string|object"> 스타일 정보</param>
        /// <param name = "value" type="string" option="true"> 셀 아이템명</param>
        /// <param name = "strItem" type="string" option="true"> 셀 아이템명</param>
        /// <param name = "nRow" type="number" option="true"> 행 위치</param>
        /// <param name = "nCol" type="number" option="true"> 열 위치</param>
        /// </member>
        SetStyle : function (style, value, strItem, nRow, nCol) {
            var $element = this.GetElemnt(strItem, nRow, nCol);
            // ColorIndex를 사용하는 경우({21})
            if (typeof (value) === "string")
                value = x2h.getColorReplace(value);
            typeof (style) === "object" ? $element.css(style) : $element.css(style, value);
            return;
        },


        /// <member id="GetProp" kind="method">
        /// <summary>컨트롤또는 셀 위치의 속성정보를 취득하는 함수</summary>
        /// <remarks>컨트롤 또는 셀(strItem, nRow, nCol 인자를 지정한 경우만)별 속성을 제어한다. </remarks>
        /// <param name = "propName" type="string|object"> 속성 정보</param>
        /// <param name = "strItem" type="string" option="true"> 셀 아이템명</param>
        /// <param name = "nRow" type="number" option="true"> 행 위치</param>
        /// <param name = "nCol" type="number" option="true"> 열 위치</param>
        /// <returns type="string|array"> 속성정보를 반환</returns>
        /// </member>
        GetProp : function (propName, strItem, nRow, nCol){
            var $element = this.GetElemnt(strItem, nRow, nCol), val;
            if (propName == "control") {
                return this;
            }
            if (propName == "hogabar") {
                return this.hogabar;
            }
            if (propName == "priceframe") {
                return this.priceframe;
            } else if (propName == "convertprice_toogle") {  // 환산가격 표시 toogle 기능
                return this.convertprice_toggle;
            }

            if (propName == "caption") {
                val = this.GetItemValue(null, $element);
            }
            else {
                val = $element.attr(propName);
            }
            return val;
        },

        /// <member id="SetProp" kind="method">
        /// <summary>컨트롤또는 셀 위치의 속성 정보를 변경하는 함수</summary>
        /// <remarks>컨트롤 또는 셀(strItem, nRow, nCol 인자를 지정한 경우만)별 스타일을 제어한다.
        ///  propName 인자 정의
        ///  "hogabar" : true 또는 False 호가잔량바 사용유무 ( 변경시 통신 재 조회)
        ///  "convertprice_toogle" : 1 : 등락률 데이터 표시, 2: 등락률 컬럼에 환산가격 표시 
        ///  "symbol" : 조회시에 심볼코드 입력시 기초자산 종목 취득 및 기초자산 실시간 등록처리기능
        /// </remarks>
        /// <param name = "propName" type="string"> 스타일 정보</param>
        /// <param name = "val" type="string"> 셀 아이템명</param>
        /// <param name = "strItem" type="string" option="true"> 셀 아이템명</param>
        /// <param name = "nRow" type="number" option="true"> 행 위치</param>
        /// <param name = "nCol" type="number" option="true"> 열 위치</param>
        /// </member>
        SetProp : function (propName, val, strItem, nRow, nCol) {
            var $element = this.GetElemnt(strItem, nRow, nCol);
            if (propName == "hogabar") {
                this.hogabar = hi5.strToBool(val);
                return;
            }
            if (propName == "priceframe") {
                this.priceframe = hi5.strToBool(val);
            } else if (propName == "caption") {
                $element.text(val);
            } else if (propName == "symbol") {
                this.symbol = val;
                if (this.convertprice) {
                    // 이전 자동갱신을 해제한다.
                    if (this.baseSymbol != "") {
                        this.commRealRegister(false, { baseSymbol: this.baseSymbol });
                    }
                    // 기초자산 코드를 취득한다.
                    var market = hi5.GetCodeInfo(this.symbol, { itemname: "base_coincode" });
                    this.baseSymbol = market; // 기초자산 심볼
                }
            } else if (propName == "sbc" || propName == "sb") {  // 자동갱신 해제 및 등록
                if (this.convertprice && this.baseSymbol != "") {
                    this.commRealRegister(propName == "sb" ? true : false, { baseSymbol: this.baseSymbol });
                }
            } else if (propName == "convertprice_toogle") {  // 환산가격 표시 toogle 기능
                this.convertprice_toggle = val;
                if (!hi5.isEmpty(this.tranData)) {
                    this.SetConvertPriceRefresh({ realtype: false });
                }
            }
        },

        commRealRegister : function (bReg, option) {
            if (option.baseSymbol) {
                commAPI.commRealRegister(bReg, { realtype: 'C00', keylist: option.baseSymbol, obj: this });
            }
            else {
                commAPI.commRealRegister(bReg, { realtype: option.realtype, keylist: option.keylist, obj: this });
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
            cols.forEach(function (colIndex) {
                $td = $('#' + self.id + ' tr > *:nth-child(' + (nCol + 1) + ')');
                for (var i = 0 ; i < $td.length; i++) {
                    if ($($td[i]).attr("covered") != "1")
                        bHide == true ? $($td[i]).hide() : $($td[i]).show();
                }
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

                for (var i = 0 ; i < $tr.length; i++) {
                    if ($($tr[i]).attr("covered") != "1")
                        bHide == true ? $($tr[i]).hide() : $($tr[i]).show();
                }
            });
        },

        /// <member id="SetItemValue" kind="method">
        /// <summary>JSON 형식의 데이터를 표시하는 함수</summary>
        /// <remarks>JSON 형식의 데이터(1차원 데이터)</remarks>
        /// <param name = "objDatas" type="object"> JSON데이터 </param>
        /// </member>
        SetItemValue : function (objDatas, option){
            //this.tranData = hi5.clone(objDatas);

            var $item, str, mask;
            var self = this, basicPrice = "", signValue = "", item;


            //var BasePriceItem = "";  //기준가 FID
            //참조 fid는 먼저 취득
            if (this.referitem.item) {
                //$.each(referitem.item, function (key, item) {
                //    console.log("key=" + key + "item=" + item);
                //});

                var val;
                if (this.referitem.item.basicpriceitem) {          // 기준가
                    item = this.referitem.item.basicpriceitem;
                    if (objDatas[item]) {
                        val = objDatas[item];
                        //val = hi5.priceF(this.symbol, val);
                        this.SetBasePrice(val);
                    }
                }

                if (self.referitem.item.signitem) {             //등락부호
                    item = self.referitem.item.signitem;
                    signValue = objDatas[item] || '';
                    if (signValue != '')
                        self.tranData[item] = signValue;          // 원본 데이터 설정
                }

                if (this.referitem.item.priceitem) {          // 현재가
                    item = this.referitem.item.priceitem;
                    if (objDatas[item]) {
                        val = objDatas[item];
                        // 원본데이터가 변경 된경우만 처리를 한다.
                        if (!self.tranData[item] || self.tranData[item] != val) {
                            //val = hi5.priceF(this.symbol, val);
                            self.tranData[item] = val;          // 원본 데이터 설정
                            this.SetPrice(val);
                        }
                    }
                }
            }

            // 통신데이터 부가 항목
            if (this.referitem.comAddItem) {
                $.each(this.referitem.comAddItem, function (i, item) {
                    if (objDatas[item]) {
                        self.tranData[item] = objDatas[item];  // 원본 데이터 설정
                    }
                });
            }

            var real = false, hogaReal = false;
            if (option != undefined && option.realType != undefined) {
                real = true;
                // 호가 실시간인경우
                if (g_SellBuyQtyList.typeCheck(option.realType)) {
                    hogaReal = true;
                    this.mapHogaList = {}; //호가 관리정보를 클리어하한다.
                }
            }

            //잔량그래프 그리기 위해 매도/매수 잔량 합계 구하는 부분..each 타기전에 한번만 계산한다..
            if (this.hogabar === true && g_SellBuyQtyList != undefined && (option == undefined || hogaReal)) {
                var sellTotalqty = 0, buyTotalqty = 0, sellqty = 0, buyqty = 0, nCnt, sellar = [], buyar = [];
                var fval = 0;
                nCnt = Math.min(this.maxhoga, g_SellBuyQtyList.buy.length);
                for (var i = 0; i < nCnt; i++) {
                    item = g_SellBuyQtyList.sell[i];
                    if (objDatas[item]) {
                        fval = parseFloat(objDatas[item]);
                        if (fval > sellTotalqty) {
                            sellTotalqty = fval;
                            //sellTotalqty = hi5.setQtyF(self.symbol, objDatas[g_SellBuyQtyList.sell[i]], { type: "Int" });
                        }
                    }

                    item = g_SellBuyQtyList.buy[i];
                    if (objDatas[item]) {
                        fval = parseFloat(objDatas[item]);
                        if (fval > buyTotalqty) {
                            buyTotalqty = fval;
                            //buyTotalqty = hi5.setQtyF(self.symbol, objDatas[g_SellBuyQtyList.buy[i]], { type: "Int" });

                        }
                    }
                }
                //sellTotalqty = hi5.setQtyF(self.symbol, sellTotalqty, { type: "Int" });
                //buyTotalqty = hi5.setQtyF(self.symbol, buyTotalqty, { type: "Int" });
                //sellTotalqty = parseFloat(sellTotalqty);
                //buyTotalqty = parseFloat(buyTotalqty);

                //sellTotalqty = Math.max.apply(null, sellar);
                //buyTotalqty = Math.max.apply(null, buyar);
            }
            // 기준가 가격을 변환한다,
            var basePrice = 0;
            if (self.basePrice != '') {
                basePrice = parseFloat(self.basePrice);
            }
            //console.time("==hoga data_show==" + self.id);
            //var ct = "==hoga data_show==" + self.id;
            //hi5.timeElapsed({ start: true, name: ct });

            var $priceTD = null;
            var objs = this.itemObjs, value, colModel;
            var sum_qty_bid = 0;
            var sum_qty_ask = 0;
            for (var item in objs) {
                var dataChange = true;
                // 통신 데이터 검색
                if (objDatas[item] === undefined)
                    continue;

                colModel = objs[item];
                $item = colModel.td;       // 셀 HTMML객체
                var element = $item[0];

                value = objDatas[item];
                // 이전값과 데이터 변동유무
                if (self.tranData[item] !== undefined && self.tranData[item] == value) {
                    dataChange = false;
                }

                // 건수,건수 합등은 이전값 비교해서 동일하면 처리를 안함
                if (real && colModel.cmp && !dataChange)
                    continue;
                self.tranData[item] = value;  // 원본 데이터 설정

                var cointype = colModel.cointype == undefined ? "" : colModel.cointype;

                str = colModel.price == undefined ? "" : colModel.price;
                var opcal = colModel.opcal == undefined ? 0 : colModel.opcal;

                var optionColor = "", optRateColor = "";
                var fVal = (value != "") ? parseFloat(value) : 0;

                // 호가 등락률 컬럼을 취득한다.
                if (str == "1") {
                    opcal = dataChange == true ? "1" : ""; // 호가가격 변동이 없는경우 색정보 변경 없음

                    if (fVal > 0) {   // 호가가격은 0보다 큰경우만 허용
                        self.mapHogaList[value] = { td: $item, dataChange: dataChange };
                        // 호가가격 찾기
                        if (self.price == value && self.referitem.item.priceitem) {
                            $priceTD = $item;
                        }
                    }

                    //self.mapHogaList.put(value, $item);
                    var ratecell = dataChange == true ? self.bHogaRate : false;   //등락률 컬럼이 존재하는지 여부
                    if (ratecell) {
                        var $hrCell;
                        if (colModel.rate) {
                            $hrCell = colModel.rate;
                        } else {
                            var col = parseInt($item.index()) + 1;
                            var row = parseInt($item.parent().index()) + 1;
                            col += 1;
                            $hrCell = $('#' + self.id + ' tr:nth-child(' + row + ') td:nth-child(' + col + ')');
                            colModel["rate"] = $hrCell;
                            objs[item] = colModel;
                        }

                        if (self.convertprice_toggle == 2) {
                            if (fVal == 0) {
                                //$hrCell.html(""); // 기준가, 호가가격이 0 이면 등락률 표시안함
                                $hrCell[0].innerHTML = "";
                            } else { // 환산가격 표시
                                self.SetConvertPrice($hrCell, item, value, fVal, hogaReal, objDatas, true);
                            }
                        } else {  // 호가 등락률 계산후 표시한다.
                            self.SetHogaRateProc($hrCell, fVal, basePrice);
                        }
                    }
                }
                if (cointype == "1") { // 코인가격
                    value = hi5.priceF(self.symbol, value);
                    maskstr.SetMask($item, value, { mask: colModel.mask });
                } else if (cointype == "2") { // 코인수량
                    var sum_bid_qty = objDatas['bidqty'];
                    var sum_ask_qty = objDatas['askqty'];
                    var total_qty = sum_bid_qty.atof() > sum_ask_qty.atof() ? sum_bid_qty : sum_ask_qty

                    value = hi5.setQtyF(self.symbol, value, { type: "Int" });
                    if (self.hogabar === true) {
                        //잔량그래프 표시용 % 구하는 부분
                        //매도매수 구분 1:매도 2:매수
                        //var tradetype = colModel.trade == undefined ? "" : colModel.trade;
                        ////var qtyPercent = 0, d = fVal;
                        //var qtyPercent = 0;
                        //var d = hi5.setQtyF(self.symbol, fVal.toString());
                        //d = parseFloat(d);
                        //if (tradetype == "1") {
                        //    if (sellTotalqty > 0 && d > 0)
                        //        qtyPercent = d / sellTotalqty;
                        //}
                        //else if (tradetype == "2") {
                        //    if (buyTotalqty > 0 && d > 0)
                        //        qtyPercent = d / buyTotalqty;
                        //}
                        //qtyPercent = parseFloat(qtyPercent) * 100;

                        var tradetype = colModel.trade == undefined ? "" : colModel.trade;
                        //var qtyPercent = 0, d = fVal;
                        var qtyPercent = 0;
                        var d = hi5.setQtyF(self.symbol, fVal.toString());
                        d = parseFloat(d);
                        //누적
                        if (tradetype == "1") {
                            if (sum_qty_ask == 0) sum_qty_ask = sum_ask_qty
                            
                            if (total_qty > 0 && sum_qty_ask > 0 && d > 0){
                                qtyPercent = sum_qty_ask / (total_qty);
                                sum_qty_ask -= d;
                            }
                        }
                        else if (tradetype == "2") {
                            sum_qty_bid += d;
                            if (total_qty > 0 && sum_qty_bid > 0 && d > 0)
                                qtyPercent = sum_qty_bid / total_qty;
                        }
                        qtyPercent = parseFloat(qtyPercent) * 100;

                    }
                    maskstr.SetMask($item, value, { mask: colModel.mask, coinqty: true, hogabar: self.hogabar, symbol: this.symbol || "", percent: qtyPercent, trade: tradetype, hogatype: self.hogatype });
                } else {
                    if ((self.convertprice && self.convertprice_toggle == 0) && str == "1") {
                        self.SetConvertPrice($item, item, value, fVal, hogaReal, objDatas);
                    } else {
                        maskstr.SetMask($item, value, { mask: colModel.mask });
                    }
                }

                if (opcal == "3") { // 등락부호 항목으로 부호 표시
                    optionColor = signValue.getUpDownSignCls();
                    hi5.updateClass($item, optionColor);
                    //if (cls != "") {
                    //    $item.addClass(cls);
                    // }
                }
                else if (opcal == "1") {    //기준가 항목으로 색상표시
                    if (basePrice != 0) {
                        optionColor = "";
                        if (fVal != 0) {
                            //var dPrc = hi5.priceF(self.symbol, fVal.toString());
                            var dif = parseFloat(fVal) - basePrice;
                            if (dif > 0) optionColor = "up_txt";
                            else if (dif < 0) optionColor = "low_txt";
                        }
                        hi5.updateClass($item, optionColor);
                        //if (!$item.hasClass(optionColor)) {
                        //     $item.removeClass("up_txt low_txt").addClass(optionColor);
                        //}
                    }
                }
                else if (opcal == "2") {    //부호 또는 등락률 항목으로 색상표시

                }
                else if (opcal == "5") {    //대비부호 항목으로 색상표시
                    optionColor = signValue.getSignColor();
                    hi5.updateClass($item, optionColor);
                    //if (!$item.hasClass(optionColor)) {
                    //    $item.removeClass("up_txt low_txt").addClass(optionColor);
                }

                if (colModel.plusminuscolor) {
                    optionColor = "";
                    if (fVal > 0)
                        optionColor = "up_txt";
                    else if (fVal < 0)
                        optionColor = "low_txt";
                    hi5.updateClass($item, optionColor);
                    //$item.removeClass("up_txt low_txt").addClass(optionColor);
                }
                //$item.html(value).removeClass("up_txt low_txt").addClass(optionColor);
            }
console.log(this.referitem);
            if (this.referitem.item && this.referitem.item.priceitem) {          // 현재가
                if ($priceTD)
                    this.SetPrice(self.price);
                else if (hogaReal) {
                    this.SetPrice("");
                }
            }
            //console.timeEnd("==hoga data_show==" + self.id);
            //hi5.timeElapsed({ name: ct });
        },

        // 환산가격 처리
        SetConvertPrice : function ($item, item, value, fVal, hogaReal, objDatas, single) {
            var cp = "", fitem;
            if (hogaReal) {
                // 계산처리(KRW 환산가격(BTC 기준가격 x BTC/KRW 현재가)
                if (this.baseSymbol != "" && this.baseCoinPrice != "") {
                    cp = hi5.getConvertPrice({ symbol: self.symbol, price: value, baseprice: this.baseCoinPrice })
                }
            } else {
                if (this.baseSymbol != "" && fVal > 0) {
                    fitem = g_Hoga_CPList[item];
                    if (objDatas[fitem] != undefined) {
                        var data = objDatas[g_Hoga_CPList[item]];// 서버에서 내려준 환산 데이터 가격
                        cp = hi5.getConvertPrice({ symbol: self.symbol, s_cp: data, baseprice: this.baseCoinPrice })
                    }
                }
            }

            // 환산가격을 구해서 표시를 한다.(단위, 환산가격)
            if (single) {
                //var sHtml = "<div class='convertprice'>" + cp + "</div>";
                $item.html(cp);
                $item.addClass("convertprice");
            } else {
                var colModel = this.itemObjs[item];
                maskstr.SetMask($item, value, { mask: colModel.mask, convertprice: (cp == "" ? false : true), cp: cp });
            }
        },

        SetTagAppend : function (objData, event) {
            if (hi5.isEmpty(objData) || objData.ctlAppend === undefined) return;
            for (var x = 0; x < objData.ctlAppend.length; x++) {
                var obj = objData.ctlAppend[x];
                var $td = this.GetElemnt("", obj.row, obj.col);
                if ($td.length <= 0) continue;
                var lt = $td.offset();
                lt["height"] = $td.outerHeight();
                lt["width"] = $td.outerWidth();
                if (lt.height == 0 || lt.width == 0) continue;
                if (obj.preinfo != undefined) {
                    if (lt.left == obj.preinfo.left && lt.top == obj.preinfo.top && lt.height == obj.preinfo.height && lt.width == obj.preinfo.width) {
                        return;
                    }
                    if (this.debug && event) {
                        console.log("event name:" + event.handleObj.namespace + ":resize : " + JSON.stringify(lt));
                    }
                }
                obj["preinfo"] = lt;


                for (var j = 0 ; j < obj.ctl.length; j++) {
                    var id = obj.ctl[j];
                    // id값에 {{id.}}값이 없으면 추가를 한다.
                    if (!idpattern.test(id)) id = "{{id.}}" + id;
                    id = x2h.getUniqID(id, this.objParentForm);
                    var $ele = $("#" + id);
                    $ele.offset({ left: lt.left + 1, top: lt.top + 1 });
                    var objCtl = this.objParentForm.GetObjData(id);
                    if (objCtl) {
                        if (objCtl.ctlName == 'grid') {
                            if (objCtl._gPQ) {
                                $(window).off("resize" + objCtl._gPQ.eventNamespace + " " + "orientationchange" + objCtl._gPQ.eventNamespace);

                                $ele.height(lt.height - 1);
                                $ele.width(lt.width - 2);

                                objCtl._gPQ.options.width = (lt.width - 2) + "px";
                                objCtl._gPQ.options.height = (lt.height - 1) + "px";
                                objCtl._gPQ.refresh();
                                continue;
                            }
                        }
                        $ele.height(lt.height - 2);
                        $ele.width(lt.width - 1);
                    }
                }
            }
            /*
                    var styles = { top: "0px", left: "0px", width: "100%", height: "100%", position: "relative" };
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
                                if ( objCtl._gPQ ) { 
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
            */
        },

        // Hoga 주문 팝업창 표시
        onHogaPopupShow : function (elem, price) {
            var obj = this;
            if (!price) {
                return;
            }

            var $pb;
            var $elemTr = $(elem).parent();
            if (!this.popupBox) {
                var bRet = false;
                this.popupBox = document.createElement('div');
                this.popupBox.className = "hoga_popupBox";
                $pb = $(this.popupBox);

                var leftBox = document.createElement('div');
                var centerBox = document.createElement('div');
                var rightBox = document.createElement('div');
                $(leftBox).addClass("hoga_popupBox_left");
                $(centerBox).addClass("hoga_popupBox_center");
                $(rightBox).addClass("hoga_popupBox_right");
                leftBox.innerHTML = $hi5_regional.button.buyText;
                rightBox.innerHTML = $hi5_regional.button.sellText;
                $pb.css("fontWeight", "800");
                $pb.css("text-align", "center");
                $pb.append(leftBox);
                $pb.append(centerBox);
                $pb.append(rightBox);

                //$elemTr.parent().parent().append(this.popupBox);

                //$("body").append($pb);
            }
            else {
                $pb = $(this.popupBox);
            }
            $(document).on("click", function (e) {
                function closeHogaPopup() {
                    $(".hi5_dlg_container").remove();
                    $(this).unbind("click");
                    obj.popupBox = null;
                }
                var item = e.target.getAttribute("item");
                if (item) {
                    if (!obj.itemObjs[item].price
                    && e.target.className != "hoga_popupBox"
                    && e.target.className != "hoga_popupBox_center"
                    && e.target.className != "hoga_popupBox_left"
                    && e.target.className != "hoga_popupBox_right") {
                        //$(".hi5_dlg_container").remove();
                        //$(this).unbind("click");
                        //obj.popupBox = null;
                        closeHogaPopup.apply(this);
                    }
                }
//                if (!obj.itemObjs[item].price
//                    && e.target.className != "hoga_popupBox"
//                    && e.target.className != "hoga_popupBox_center"
//                    && e.target.className != "hoga_popupBox_left"
//                    && e.target.className != "hoga_popupBox_right") {
//                    $(".hi5_dlg_container").remove();
//                    $(this).unbind("click");
//
//                }
                else {
                    if (e.target.className == "hoga_popupBox_left") {
                        if (obj.OnPopupClick) {
                            //$(".hi5_dlg_container").remove();
                            //$(this).unbind("click");
                            closeHogaPopup.apply(this);

                            obj.OnPopupClick("buy", price);
                        }
                    }
                    else if (e.target.className == "hoga_popupBox_right") {
                        if (obj.OnPopupClick) {
                            //$(".hi5_dlg_container").remove();
                            //$(this).unbind("click");
                            closeHogaPopup.apply(this);

                            obj.OnPopupClick("sell", price);
                        }
                    }
                    else {
                        closeHogaPopup.apply(this);
                    }
                }
            });
            var dlgContainer = this.objParentForm.GetSPADialogContainer(this.popupBox);
            $(dlgContainer).find(".hi5_spa_dlg").css({ "left": "0", "margin": "0" });
            var topForm = $("body");
            var bodyWidth = topForm.outerWidth();
            $(dlgContainer).find(".hoga_popupBox").css({ "width": bodyWidth + "px" });
            topForm.append(dlgContainer);

            $pb.css("display", "block");
            var nextTd = $(elem).next();
            var leftLine = elem.offset().left;
            var rightLine = elem.offset().right;
            //var leftWidth = elem.offset().left - $elemTr.offset().left;
            //var centerWidth = elem.outerWidth() + nextTd.outerWidth();
            //var rightWidth = ($elemTr.offset().left + $elemTr.width()) - (elem.offset().left + elem.outerWidth()) - nextTd.outerWidth();

            var leftWidth = elem.offset().left;
            var centerWidth = elem.outerWidth();
            var rightWidth = "calc(100% - " + (elem.offset().left + elem.outerWidth()) + "px)";

            $pb.children(".hoga_popupBox_center")[0].innerHTML = elem.text();
            $pb.children(".hoga_popupBox_center")[0].style.color = elem.css("color");
            $pb.children(".hoga_popupBox_left").width(leftWidth);
            $pb.children(".hoga_popupBox_center").width(centerWidth);
            $pb.children(".hoga_popupBox_right").width(rightWidth);
            $(centerBox).css("color", elem.css("color"));
            $pb.css("lineHeight", elem.height() + "px");
            $pb.height($elemTr.height());
            $pb.offset({ top: $elemTr.offset().top });
            $(window).off("resize");
            $(window).resize(function () {
                $pb.height($elemTr.outerHeight());
                $pb.offset({ top: $elemTr.offset().top });
                leftWidth = elem.offset().left;
                centerWidth = elem.outerWidth();
                rightWidth = "calc(100% - " + (elem.offset().left + elem.outerWidth()) + "px)";
                $pb.children(".hoga_popupBox_left").width(leftWidth);
                $pb.children(".hoga_popupBox_center").width(centerWidth);
                $pb.children(".hoga_popupBox_right").width(rightWidth);
                $pb.css("lineHeight", elem.height() + "px");
            });

            /// <member id="OnPopupClick" kind="event">
            /// <summary>팝업창의 매수, 매도 버튼을 클릭 이벤트 함수 </summary>
            /// <remarks>
            /// 1. 매수 버튼 클릭시 type의 값으로 buy 전달
            /// 2. 매도 버튼 클릭스 type의 값으로 sell 전달
            /// </remarks>
            /// <param name = "type" type="string"> sell : 매도버튼 클릭, buy: 매수버튼 클릭 </param>
            /// <param name = "price" type="string"> 해당 셀의 가격 정보 </param>
            /// </member>
            //$(leftBox).on("click", function(e){
            //    if (obj.OnPopupClick) {
            //        $(".hi5_dlg_container").remove();
            //        obj.OnPopupClick("buy", price);
            //  }
            //});
            //$(rightBox).on("click", function(e){
            //    if (obj.OnPopupClick) {
            //        $(".hi5_dlg_container").remove();
            //        obj.OnPopupClick("sell", price);
            //  }
            //});
            return bRet;
        },

        // item 인자값의 객체취득하는 함수
        getColModel : function (item, option) {
            var colModel = this.itemObjs[item] !== undefined ? this.itemObjs[item] : null;
            if (option && option.key) {
                var key = option.key;
                if (colModel) {
                    return colModel[key];
                }
                return null;
            }
            return colModel;
        },

        onInitAfter : function (){
            //this.SetTagAppend(this.fncustom);
            //this.fncustom = {};

            var self = this, $self = this.$html;
            //$(window).off("resize");
            if (!hi5.isEmpty(this.fncustom) && this.fncustom.ctlAppend !== undefined && this.fncustom.ctlAppend.length > 0) {
                $(window).on("resize." + self.id + " " + "orientationchange." + self.id, function (event, ui) {
                    //$(window).resize(function (event, ui) {
                    self.SetTagAppend(self.fncustom, event);
                });
            }

            //pc환경에서도 보이게 하려면 touchstart -> click
            //$('#' +this.id).delegate('td', 'touchstart', function (e) {
//            $self.delegate('td', 'mousemove', function (e) {
//                var $td = $(this);
//                //var lt = $td.offset();
//                //lt["height"] = $td.outerHeight();
//                //lt["outerWidth"] = $td.outerWidth();
//                //lt["width"] = $td.width();
//                //console.log(lt);
//
//                if (self.priceframe === true) {
//                    $td.removeClass("hoga_prc_sell_cell hoga_prc_buy_cell");
//
//                    //if ($td.attr("price") == "1") {
//                    //    var s = $td.attr("trade");
//                    //    if (s == "1") $td.addClass("hoga_prc_sell_cell");
//                    //    else if (s == "2") $td.addClass("hoga_prc_buy_cell");
//                    //}
//
//                    var item = $td.attr("item");
//                    if (item == undefined) item = "";
//                    var value = self.GetItemValue(item, $td);
//                    var objColData = self.itemObjs[item];
//                    if (objColData) {
//                        if (objColData.price == "1" && value != "") {
//                            var s = objColData.price;
//                            if (s == "1") $td.addClass("hoga_prc_sell_cell");
//                            else if (s == "2") $td.addClass("hoga_prc_buy_cell");
//                        }
//                    }
//
//                }
//            });
//
//            $self.delegate('td', 'mouseleave', function (e) {
//                if (self.priceframe === true) {
//                    $(this).removeClass("hoga_prc_sell_cell hoga_prc_buy_cell")
//                }
//            });

            $self.delegate('td', 'click', function (e) {
                var $element = $(this);
                if (typeof ($element) == undefined) {
                    return;
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
                //value = $element.attr("orgvalue");
                // 호가가격 컬럼클릭시  옵션값에 따라서 주문팝업창을 표시한다.

                //if ($element.attr("price") == "1" && value != "") {
                var objColData = self.itemObjs[item];
                if (objColData) {
                    if (objColData.price == "1" && value != "") {
                        //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
                        // 호가가격 팝업창을 호출하고, 매수,매도 버튼 선택시에 이후 처리를 무시한다.
                        if (self.OnPopupClick && self.onHogaPopupShow($element, value)) {
                            return;
                            //}
                        }
                    }
                }

                if (value == undefined)
                    value = $element.text();
                // OnCellClick 클릭이벤트 발생
                if (self.OnCellClick) {
                    self.OnCellClick.call(self, nRow, nCol, item, value);
                }
            });
        },

        // Form에서 통신전문을 작성시에 조회시작및 정보를 반환하는 함수
        GetCommValue : function (option) {
            // 통신중
            this.showLoading = true;
            //this.realMng = {}; // 자동갱신 관리객체 해제

            if (commAPI.getRealTime() && this.realitem.length > 0) {
                if (!this._realMng) {
                    this._realMng = new hi5_realMng();
                    this._realMng.init({ control: this });
                } else {
                    this._realMng.clear();
                }
            }
            if (option.fidYN && option.fidInfo) {
                option.fidInfo.outFID = option.fidInfo.outFID.concat(this.comm_list);  // 출력용 FID 추가
            }

        },

        OnGetData : function (data) {
            if (this.curPriceTD)
                this.curPriceTD.removeClass("curframe_up curframe_down curframe_euq");

            this.curPriceTD = null;
            this.tranData = {}; this.mapHogaList = {};
            //this.mapHogaList.removeAll();

            this.price = "";
            this.baseCoinPrice = ""; // 기초자산 가격

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
            //if (hi5.isArray(data) == false) {
            //    var array = [];
            //    array.push(data);

            //    data = array;
            //}

            this.showLoading = false;
            this.SetItemValue(record);
            this.SetTagAppend(this.fncustom);

            // 기초자산 종목실시간 해제한다.
            this.SetProp("sb");
        },

        OnRealTime : function (option) {
            if (this.showLoading) return;

            this.SetItemValue(option.data[0], option);

            /*
            var objData = this.realMng, keys, arRealData, self = this;
            for (var realType in objData) {
                keys = objData[realType];
                arRealData = commAPI.getPoolData({ realType: realType, key: keys });
    
                arRealData.forEach(function (option, idx, ar) {
                    self.SetItemValue(option.data[0], option);
                });
            }
            this.realMng = {};
            */
        },

        // 자동갱신 수신 처리함수
        OnRealData : function (arpbData, option) {
            var strcode = option.key,
                realType = option.realType,
                realCount = option.realCount,
                realData;

            // this.realitem 항목에 자동갱신이 포함된 경우만 처리를 한다.
            if (option && option.realType != undefined && this.realitem.length > 0) {
                if (!this.realitem.includes(option.realType))
                    return;
            }

            // 배열 데이터인경우 맨 처음 데이터만 적용을 한다.
            if (hi5.isArray(arpbData))
                realData = arpbData[0]; // 맨 처음 데이터만 갱신을 한다.
            else
                realData = arpbData;

            var bQueuData = false;
            // 기초자산 시세수신시에 호가영역의 환산가격을 재 계산을 한다.
            if (this.convertprice && strcode == this.baseSymbol && realType == "C00") {
                // 이전값과 동일한 경우 무시를 한다.
                if (this.baseCoinPrice == realData["4"]) return;

                this.baseCoinPrice = realData["4"]; // 기초자산 가격

                if (this._realMng && this._realMng.count() > 0) {
                    return;
                }

                //if (option.countQueue >= g_hi5MaxQueue || !hi5.isEmpty(this.realMng) ) {
                //    return;
                //}

                // 호가가격 전영역을 재 표시를 한다.
                if (this.convertprice_toggle == 2 || this.convertprice_toggle == 0) {
                    this.SetConvertPriceRefresh({ realtype: true });
                }
                return;
            }

            // 일정큐 개수가 넘치면 자동갱신 정보만 저장후 반환을 한다.
            if (this._realMng) {
                bQueuData = this._realMng.setData({ countQueue: option.countQueue, realType: realType, key: strcode });
            }
            if (bQueuData) return;

            if (realData) {
                this.SetItemValue(realData, option);
            }
        },

        // 호가 등락률 표시
        SetHogaRateProc : function ($hrCell, fVal, basePrice) {
            //var hRate = 0, y = parseFloat(this.basePrice), optRateColor = "";
            var hRate = 0, y = basePrice, cls = "";
            if (fVal == 0 || y == 0) {
                $hrCell[0].innerHTML = "";// 기준가, 호가가격이 0 이면 등락률 표시안함
                //$hrCell.html("");         // 기준가, 호가가격이 0 이면 등락률 표시안함
            } else {
                hRate = ((fVal - y) / y) * 100;
                if (hRate > 0) {
                    cls = "up_txt";
                } else if (hRate < 0) {
                    cls = "low_txt";
                }
                var colModel = this.itemObjs["hoga_rate"], mask;
                if (colModel && colModel.mask)
                    mask = colModel.mask;

                maskstr.SetMask($hrCell, hRate.toString(), { mask: mask });
                hi5.updateClass($hrCell, cls);
                //if (!$item.hasClass(optionColor)) {
                //    $hrCell.removeClass("up_txt low_txt").addClass(optRateColor);
                //}
                //var attr = $hrCell[0].getAttribute && $hrCell[0].getAttribute("class") || "";
                //if (attr != optRateColor) {
                //    $hrCell.removeClass("up_txt low_txt").addClass(optRateColor);
                //}
            }
        },

        // 환산가격 데이터 표시 기능
        SetConvertPriceRefresh : function (option){
            // 호가 TD 태그 객체를 취득한다.
            //var tds = $("#" + this.id).find('tbody tr td[price="1"]'), self = this;
            var basePrice = parseFloat(this.basePrice);  // 기준가 가격

            var objs = this.itemObjs, colModel, self = this;
            //tds.each(function (idx, td) {
            for (var item in objs) {
                colModel = objs[item];
                if (!colModel.price) continue;
                var $td = colModel.td, value, cp = "", cls;

                //item = $td.attr('item');
                value = parseFloat(self.tranData[item]) || 0;  // 메모리 객체 데이터에서 호가가격을 취득
                if (self.tranData[item] != "" && value > 0) {
                    cp = hi5.getConvertPrice({ symbol: self.symbol, price: self.tranData[item], baseprice: self.baseCoinPrice });
                }

                //realtype
                if (self.convertprice_toggle > 0) {
                    // 등락률 컬럼의 위치에 환산가격 설정
                    var $hrCell;
                    if (colModel.rate) {
                        $hrCell = colModel.rate;
                    } else {
                        var col = parseInt($td.index()) + 1;
                        var row = parseInt($td.parent().index()) + 1;
                        $hrCell = $('#' + self.id + ' tr:nth-child(' + row + ') td:nth-child(' + (col + 1) + ')');
                        colModel["rate"] = $hrCell;
                        objs[item] = colModel;
                    }
                    if (self.convertprice_toggle == 2) {
                        if (option.realtype == false) {
                            cls = $hrCell[0].getAttribute('hi5_css') || "";
                            if (cls != "") {
                                $hrCell[0].setAttribute('hi5_css', '');
                                $hrCell.removeClass("up_txt low_txt");
                            }
                        }
                        $hrCell.html(cp);
                        hi5.updateClass($hrCell, "convertprice");
                        //$hrCell.addClass("convertprice");
                    } else if (self.convertprice_toggle == 1) {
                        cls = $hrCell[0].getAttribute('hi5_css') || "";
                        if (cls != "") {
                            $hrCell[0].setAttribute('hi5_css', '');
                            $hrCell.removeClass("convertprice");
                        }
                        // 등락률 데이터 표시
                        self.SetHogaRateProc($hrCell, value, basePrice);
                    }
                } else {
                    // 호가가격 안에 포함된 경우
                    $td[0].getElementsByTagName('div').textContent = cp;
                    //$td.find('div').text(cp);
                    /*
                    nodeValue is a little more confusing to use, but faster than innerHTML.
                    innerHTML parses content as HTML and takes longer.
                    textContent uses straight text, does not parse HTML, and is faster.
                    innerText Takes styles into consideration. It won't get hidden text for instance
                    */
                }
            }
        },

        //hoga 데이터 clear
        //향후 option 객체게 realKey 넘기면, 실시간 해제도 추가..
        clearAllData : function (arpbData, option) {
            this.OnGetData({});
        }
        // Event 기술

        /// <member id="OnCellClick" kind="event" default="true">
        /// <summary>Cell 클릭시 발생되는 이벤트 함수</summary>
        /// <remarks>remarks</remarks>
        /// <param name = "nRow" type="number"> 행 위치</param>
        /// <param name = "nCol" type="number"> 열 위치</param>
        /// <param name = "item" type="string"> item 문자열</param>
        /// <param name = "value" type="string"> 원본데이터</param>
        /// </member>
        //hoga.prototype.OnCellClick = function (fn, nRow, nCol, item, value) {
        //    fn(nRow, nCol, item, value);
        //}
    }

    hoga.ctlName = "hoga";
    hi5_hash.record(hoga.ctlName).fn = hoga; // 해쉬데이터에 함수를 등록한다.
    return hoga;
}());


var hogaCtl;
(function (exports) {
   'use strict';

   hogaCtl = function (id, option) {
       this.id    = id;
       this.count = (option && option.count) ? option.count : 20;
       this.hBody = null;
       this.dataObject ={};
       this.htmlObj = hi5.getById ( id );
       this.dataKey = "";
       this.dataModel=[];
       var objCls = option.cls;
       this._scrollDiv = null;

        /*
         option={ cls:{ tooltip : "hi5-c-ui-tooltip"}, highlight: {up:"hi5_highlight_up", low:"hi5_highlight_low"} }
        */
       this._myOrderClass  = "font_bold " +  objCls.tooltip; // 내주문 클래스
       this._highlight_up  = objCls.highlight.up;
       this._highlight_low = objCls.highlight.low;
       
       //this.orderBooks = new _oBooks._orderBooks({trcode:"102032"});
       if ( option && option.orderBooks )
            this.orderBooks = option.orderBooks;
       this.setInitHtml (); // Body 영역을 구성한다.

/*
       for ( let key in option ){
           this[key] = option[key];
       }
*/
    };

    hogaCtl.prototype = {
        setDataClear : function(){
            this.dataModel =[];
            this.dataObject ={};
        },
        getAnimation : function(){
            if ( hi5.WTS_MODE == WTS_TYPE.MTS ) return false;
            var userSet =  hi5.SHMEM["user_setting"], animation = true;
            if (  userSet && userSet.general.animation ){
                  animation = (userSet.general.animation =="Y") ? true : false;
            }
            return animation
        },
        /*
        arTitle=[{col:1, text:"수량"}]
         */
        setHeaderTitle : function(arTitle){
            var htmlObj = this.htmlObj;
            if ( htmlObj && htmlObj.tHead !== undefined ){
                if ( htmlObj.tHead.children.length > 0 && htmlObj.tHead.children.item(0).children.length > 0){
                    arTitle.forEach ( function( obj ){
                        htmlObj.tHead.children.item(0).children[obj.col].innerText = obj.text
                     });
                }
            }
        },
        init_template : function(id, obj){
            var template = obj.cloneNode(true);
            if (this.dataObject.hasOwnProperty(id)) {return this.dataObject[id];}
            this.dataObject[id] = template;
            return template;
        },
        replace_curly : function(element, type){
            var rowClone = element.cloneNode(true),
            originalHTML = (type == "attribute") ? rowClone.value : rowClone.innerHTML;
            rowClone.innerHTML = originalHTML;
            return rowClone;
        },

        getElementsByAttribute : function(x, att){
            var arr = [], arrCount = -1, i, l, y = x.getElementsByTagName("*"), z = att.toUpperCase();
            l = y.length;
            for (i = -1; i < l; i += 1) {
              if (i == -1) {y[i] = x;}
              if (y[i].getAttribute(z) !== null) {arrCount += 1; arr[arrCount] = y[i];}
            }
            return arr;
        },

        setInitHtml : function (){
            var htmlObj = this.htmlObj,
                htmlTemplate = this.init_template(this.id, htmlObj),
                html = htmlTemplate.cloneNode(true),
                arr = this.getElementsByAttribute(html, "hi5-repeat"),
                rowClone = arr[0];

            // Tr, TD 기본클래스명을 취득해서 초기화시에 사용을 한다.
            this._td_className =[];  // 0: 현재가, 1: 수량, 2: 총잔량
            this._tr_className = rowClone.className; // TR Tag
            var  td_cls= this._td_className;
            [].slice.call(rowClone.cells).forEach(function(td){
                td_cls.push(td.className);
            });
            
            //console.log("기본클래스명 ==>", this._tr_className, this._td_className );
            this.dataKey  = arr[0].getAttribute("hi5-repeat");
            arr[0].removeAttribute("hi5-repeat");
            for ( var i = 0 ; i < this.count; i++){
                rowClone = arr[0];

                rowClone = this.replace_curly( rowClone, "element" );
                arr[0].parentNode.insertBefore(rowClone, arr[0]);
            }
            arr[0].parentNode.replaceChild(rowClone, arr[0]);
            html = html.cloneNode(true);
            htmlObj.parentNode.replaceChild(html, htmlObj);
            this.hBody = html.tBodies[0];
/*            
            // log 작성
            let rows = this.hBody.rows, arheight=[];
            for ( let i = 0 ; i < rows.length; i++){
                let tr = rows[i],  rect = tr.getBoundingClientRect();
                console.dir(tr );
                arheight.push(rect.height);
                //log_Trace ( "<== "+this.dataKey +"==>", {rowIndex:tr.rowIndex, rect:rect});
                console.log("<== "+this.dataKey +"==>", tr.rowIndex, rect );
            }
            console.log("<== "+this.dataKey +"==height>", arheight  );
*/            
            //let h  = tr.getBoundingClientRect().height;
            //let ho = tr.rowIndex * h;
            //offsetTop = (ho+(ho>0?0.5:-0.5)) << 0;  // Math.round()
            // 
            
            // tr.rowIndex,tr.offsetTop 
            //Number.round = function() {
            //    return (this + (this>0?0.5:-0.5)) << 0;
            //};

            // tooltip callback 함수
            //$('#'+this.id).data( this);
            // 이벤트를 등록한다.
            var self = this, tBody = this.hBody;
            tBody.addEventListener ("click", function(e){
                var e = e || window.event,
                  target = e.target || e.srcElement,
                  tr = target.closest("tr"), td= target.closest("td");
                if ( tr && td ){
                    if ( self.OnCellClick ){
                        let idx= self.getTrRow( tr.sectionRowIndex ) , 
                           rec = self.dataModel.length > idx ? self.dataModel[idx] : null,  // 빈 데이터인 경우는  null 체크
                           cellData = rec?rec[self.getDataCol (td.cellIndex, tr.sectionRowIndex  )] : "",
                           ui={
                            rowIndex  : tr.sectionRowIndex, // 행 인덱스
                            cellIndex : td.cellIndex, // 컬럼 인덱스
                            cellData : cellData,      // 클릭한 컬럼의 값
                            rowData  : rec            // 하나의 레코드
                        }
                        self.OnCellClick.call(self, ui );
                    }
                }
                // 선택모드후에 클릭을 하면 TBody영역이 잡힌다.
            });
        },
        /* tooltip Data 취득 */
        OnTooltipContent : function ( tr ){
         if ( tr){
                let idx= this.getTrRow( tr.sectionRowIndex ) , 
                rec = this.dataModel[idx] ? this.dataModel[idx] : null;  // 빈 데이터인 경우는  null 체크
                if ( rec ){
                    let  price =putThousandsSeparators(rec[_JCol.price]),
                    myqty = rec[_JCol.myqty], liq_qty = rec[_JCol.liq_qty], typeData = 0, qty;
                    if ( this.orderBooks ){
                        var obj = this.orderBooks.getDataFormat ( rec );
                        if ( myqty > 0 ){
                            qty = putThousandsSeparators(obj.myqty);
                        }else if ( liq_qty > 0 ){
                            qty = putThousandsSeparators(obj.liq_qty);
                            typeData = 1;
                        }
                    }
                    return {
                        price: price,  //가격
                        qty:qty,       //수량
                        type: typeData  //0: 내주문가격, 1: 청산가격
                    }
                }
           }
          return null;
        },
        getRecordData : function (index, mask){
            if ( this.dataModel.length > index ){
                let rec = this.dataModel[index];
                let price = mask ? putThousandsSeparators(rec[_JCol.price]) : rec[_JCol.price],
                qty= mask ? putThousandsSeparators(rec[_JCol.qty]) : rec[_JCol.qty],
                sum= mask ? putThousandsSeparators(rec[_JCol._sum]) : rec[_JCol._sum],
                rate=rec[_JCol._rate];
                return {
                    price : price, // 호가가격(문자형)
                    qty   : qty,   // 수량(문자형)
                    sum   : sum,   // 호가별 합계수량(문자형)
                    rate : rate    // 그래프%(숫자형)
                }
            }
            return {
                price : "",
                qty   : "",
                sum   : "",
                rate : 0
            }
        },
        getColCount : function ( ){
            var tBody = this.hBody;
            if ( tBody && tBody.rows.length > 0 ){
                return tBody.rows[0].cells.length;
            }
            return -1;
        },
        /* 컬럼별 데이터 인덱스 반환 */
        getDataCol : function ( colIdx, rowIdx ){
            var tBody = this.hBody,
                dataIdx = colIdx;
            if ( rowIdx !== undefined ){
                console.assert ( tBody.rows.length >=  rowIdx);
            }

            switch ( colIdx ){
                case 2:       //호가합계잔량
                    dataIdx = _JCol._sum;
                   break;
                default:
            }
            return dataIdx;
        },

        isViewPort : function ( e, target){
            let rc = e.getBoundingClientRect(),height=rc.height,
                p_rc = target.getBoundingClientRect();  // Scroll 영역의 부모
           
            let top = rc.top - p_rc.top,
            bottom  = p_rc.bottom - rc.bottom;
            if ( top >= 0 && bottom >= 0  ){
                return true;
            }
            // 보정
            // asks
            if ( top < 0  && (height > (top*-1) )){
                 return true;
            }
            // bids
            if ( bottom < 0 && (height > (bottom*-1)) ){
                return true;
            }
            return false;
        },
        
        getTrVisibe : function (tr){
            if ( this._scrollDiv  === null )
                return true;

            if ( tr && this._scrollDiv ){
                return this.isViewPort ( tr, this._scrollDiv ); 
            }

            return false;
        },

        getHTMLTrRow : function ( dataIdx ){
            let rowIdx  = this.getTrRow(dataIdx);  // 데이터 영역에서 취득 tr row취득
            if ( this.hBody.rows.length > rowIdx  ){
                let tr = this.hBody.rows[rowIdx];   // HTML Tr row 위치 취득
                if ( this.getTrVisibe ( tr ) ) return tr;
                //return this.hBody.rows[rowIdx];
            }
            return null;
        },
        /*데이터 인덱스에서 TR row 위치를 취득 */
        getTrRow : function ( dataIdx ){
            var rowIdx = dataIdx;
            if ( this.dataKey == "asks" ){
                rowIdx =  (this.count-1) - dataIdx;  // 데이터는 0 부터 인덱스
            }
            return rowIdx;
        },
        animate : function ( td, cls  ){
            //hi5.addClass(td, cls), self = this;
            var  self = this;
            td.className = self._td_className[1] + " " + cls;
            setTimeout(function() {
                td.className = self._td_className[1];
                //hi5.removeClass(td, self._highlight_up + " " + self._highlight_low );
            },300 )
        },

        setRender : function ( ui ){
            //console.log(ui);
            var tr = ui.tr, td =tr.cells[ui.col],
                _child = td.children,objRec = ui.objRec,
                cls,list;
            switch ( ui.col ){
                case 0: // 호가가격
                  {
                    if ( td.textContent != objRec.price )
                        td.textContent = objRec.price; // 호가가격
                  }
                break;
                case 1: // 잔량
                {
                    if ( _child.length >= 1  ){    // 모바일
                        list = _child[0].children;
                        if ( list.length >=2){
                            list[0].style.width  = ui.rowData[_JCol._rate]+"%";
                            list[1].textContent    =  objRec.qty;  // 수량
                        }
                    }else{
                        if ( td.textContent !=objRec.qty )
                            td.textContent = objRec.qty;  // 호가수량
                        if ( ui.real && this.getAnimation() ){
                            //hi5.removeClass (td, this._highlight_up + "" +this._highlight_low ); // 직전수량
                            td.className = this._td_className[ui.col];
                            if ( ui.rowData[_JCol._last_qty] > 0 ){
                                cls = this._highlight_up;
                            }else if ( ui.rowData[_JCol._last_qty] < 0 ){
                                cls = this._highlight_low;
                            }
                            if ( cls )
                                this.animate ( td , cls  );
                        }
                    }
                }
                break;
                case 2: // 잔량합
                {
                    //tr.children.item(2).textContent = objRec.sum;  // 호가합계
                    if ( _child.length >= 1 ){    
                        list = _child[0].children;
                        if ( list.length >=2){
                            if ( list[0].style.width != ui.rowData[_JCol._rate]+"%")
                                list[0].style.width = ui.rowData[_JCol._rate]+"%";
                            if ( list[1].textContent != objRec.sum )    
                                list[1].textContent   = objRec.sum;  // 총수량
                        }
                    }
                }
                break;
            }
        },
        /* 빈호가 부분을 처리하는 함수 */
        setEmptyData : function (start, end ){
            var rows = this.hBody.rows,
            s_rowIdx = this.getTrRow ( start ),  // HTML Tag
            e_rowIdx = this.getTrRow ( end  ),
            colCount = this.getColCount(),
            col, td, list, arRows, self =this;

            arRows = [].slice.call(rows).slice( s_rowIdx, e_rowIdx );
            arRows.forEach ( function(tr, idx ){
                if ( self.getTrVisibe ( tr ) ){
                // 호가가격, 잔량, 총합컬럼 초기화
                    for ( col = 0; col <colCount; col++ ){
                        td = tr.cells[col];
                        if( td.children.length >= 1){
                            list = td.children[0];
                            if ( list.children.length >=2){
                                if ( list.children[0].style.width != "0%" )
                                    list.children[0].style.width = "0%";
                                if ( list.children[1].innerText !="")    
                                    list.children[1].innerText   = "";  
                            }
                        }else{
                            if ( td.textContent != "")
                                td.textContent = "";
                        }                    // 내주문/청산수량 정보클리어
                        tr.className = self._tr_className;
                        //tr.classList.remove (self._myOrderClass.split(" "));
                    }
                }
            });
        },

        /* 호가 데이터를 처리하는 함수 */
        setData : function ( arData, bReal ){
            let index=0,
                tr,objRec,rowData, ui={}, rowIdx,
                col, colCount = this.getColCount(), count= arData.length;
            
             for ( index = 0; index < count; index++ ) {
                rowData =this.dataModel[index] ; // 데이터
                // 빈 호가이면 무시를 한다.
                if ( rowData[_JCol.price] == "") return;
                //rowIdx = this.getTrRow ( index );  // DataIndex로 HTMLTR  Tag 위치취득
                //tr = hBody.children[rowIdx];
                tr = this.getHTMLTrRow ( index );
                if ( tr ){
                    objRec = this.getRecordData(index, true ); // 마스킹 처리
                    ui ={ tr : tr, col:0, objRec:objRec, rowData: rowData, real: bReal };
                    for ( col= 0 ; col < colCount; col++ ){
                        ui.col = col;
                        this.setRender (ui); 
                    }
                    // 내주문 처리
                    this.setMyorderRender ( tr, rowData);
                }
             }

             // 빈호가를 처리한다.
             if ( this.count - count > 0 ){
                let start = count, end = this.count;
                if ( this.dataKey == "asks" ){
                    start = this.count-1; end = count-1;
                }
                this.setEmptyData ( start, end );
             }  
        },

        /* 내주문 폰트처리 */
        setMyorderRender: function ( tr, objRec ){
           if ( hi5.WTS_MODE == WTS_TYPE.MTS ) return; 
           if ( tr ){
                if (  objRec[_JCol.myqty] <= 0 && objRec[_JCol.liq_qty] <= 0 ){
                        if ( tr.className !== this._tr_className ) tr.className = this._tr_className;
                        //hi5.removeClass ( tr, this._myOrderClass  );
                        //tr.classList.remove (_textBoldClass);
                }
                if ( objRec[_JCol.myqty] > 0  || objRec[_JCol.liq_qty]  > 0){
                        if ( tr.className !== this._myOrderClass  ) tr.className = this._myOrderClass;
                        //hi5.addClass ( tr, this._myOrderClass  );
                }
           }
        },

        getHogaDataChange : function ( recData,  rt, arMyOrder ){
            let  orderBook = this.orderBooks;
            rt.forEach ( function(rec, idx ){
                let  difQty = 0, myOrdQty = 0;// 직전수량 
                if ( arMyOrder && arMyOrder[rec[_JCol.price]] !== undefined )
                    myOrdQty = arMyOrder[rec[_JCol.price]];       // 내주문 수량을 갱신

                // 호가가격으로 직전수량 정보를 취득한다.
                difQty  = orderBook.getLastQty (rec[_JCol.price]); 
                recData[idx] = rec.slice(0);              // 실시간 데이터 복사

                recData[idx][_JCol.myqty]     = myOrdQty; // 내주문 수량을 갱신
                recData[idx][_JCol._last_qty] = difQty;   // 직전수량
            });
        },

        refresh : function ( ){
            this.setData ( this.dataModel );
        },

        /*미체결모듈에서 전송 */
        OnMyOrderRecive: function ( symbol, myOrder ){
            if ( !myOrder && hi5.isEmpty() ) return;
            let count = 0;
            if ( this.orderBooks && this.orderBooks.getSymbol( ) === symbol && this.dataModel.length > 0 ){
                count = this.orderBooks.getMyOrderChange ( this.dataModel, myOrder );
                if ( count > 0 ) this.refresh ( );
            }
        },

        /* 실시간 데이터 설정 ( 실시간 객체, 내주문 객체) */
        OnRealData : function ( ui , myOrder){
            myOrder  = (myOrder !== undefined) ? myOrder :null;
            var objData = ui.data, recData = [];
            this.getHogaDataChange ( recData, objData[this.dataKey], myOrder );
            // 호가 데이터 갱신
            this.dataModel = recData.slice(0);
            this.setData (  recData, true );
        },

        /*조회응답 데이터( 호가 데이터객체, 내주문 객체) */
        OnRpData : function ( objData, myOrder ){
            /*
            if ( this._scrollDiv == null  ){ 
                var _scrollDiv = hi5.getById ( this.id ),
                    scrollWarp, count = 3, self = this;
                while ( count ){
                    if ( _scrollDiv.classList.contains("scrollDiv") ){
                        this._scrollDiv = _scrollDiv;
                        count = 0;
                        break;
                    }
                    _scrollDiv = _scrollDiv.offsetParent;
                    count--;
                }

                if ( this._scrollDiv ){
                    let scrollName= (hi5.WTS_MODE == WTS_TYPE.MTS) ? "scroll" : "iscrollmove";
                    scrollWarp = hi5.getById ( this.id ).offsetParent;
                    hi5.on ( scrollWarp, scrollName, function(e){
                        //console.log(e);
                        self.refresh ();
                    });
               }
           
            }
           */
           // 조회 응답 데이터
           myOrder  = (myOrder !== undefined) ?  myOrder : null;
           this.dataModel = objData[this.dataKey].slice(0);
           if ( this.orderBooks ){ // 내주문 건수 할당
              this.orderBooks.getMyOrderChange ( this.dataModel, myOrder );
           }
           this.setData ( this.dataModel, false  );
        },
 
        /* 원본 호가 데이터 취득 */
        getDataModel : function(index){
            if ( index ===undefined ){
                return  this.dataModel;         
            }else{
                if ( this.dataModel.length > index )
                    return this.dataModel[index];
            }
            return null;
        },

        findPrice : function ( target ){
            let i = 0;
            for ( i = 0 ; i < this.dataModel.length;i++){
                if ( this.dataModel[i][_JCol.price] === target )
                    return i;
            }
            //The bitwise complement of 0 is -1, the bitwise complement of 1 is -2, 2 is -3, and so on. To get the bitwise complement of a number in JavaScript, use the ~ operator.
            return ~i;
        }
    }

    if (exports) {
        exports.hogaCtl = hogaCtl;
    }

    if (typeof module !== "undefined") {
        module.exports = hogaCtl;
    }
    //return OrderLib;
})(typeof window !== "undefined" ? window : null);
