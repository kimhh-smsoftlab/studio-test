//static.js
(function () {
    'use strict';

    var _static = function () {
        this.singleline = "1";
        this.customtooltip = {};
     //   this["vertical-align"] = "";
     //   this["text-align"] = "";
    }
    //  HTML 형식 <div> 3개 구성
    //  <div id="부모"><div><div 데이터 여소> ~ </div></div></div>

    _static.prototype = {
        propertyLoad: function (node, nodeName, xmlHolderElement) {
            var that = this,
            cls = ["hi5_static"],
            style = [],
            attr = { id: "" },
            dataCell = "";  // caption
            
            var objXML;
            if (x2h.getXML2JSON) {
                objXML = x2h.getXML2JSON(node, this, attr, cls, style, function (node) {
                    return [];
                });
            } else {
                // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
                objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                    // CDDATA 정보를 포함한 속석명 지정
                    return ["multi_lang"];
                });
            }
            // var objXML = x2h.getXML2Control(node, this, attr, cls, style, function ( ) {
            //     return ["multi_lang"];
            // });
            attr["class"] = cls.join(" ");

            // Caption            
            //var objM = x2h.xmlJSONData(node, "multi_lang");
            if (objXML.multi_lang){
                dataCell = x2h.xmlGetMultiLangText(objXML.multi_lang, "caption");
                if (this.singleline == 0 && dataCell != "")
                    dataCell = x2h.getMultiLineText(dataCell);
            }
           // if (dataCell === "" || dataCell == undefined) {
           //     dataCell = "";
           // }

            if (style.length)
                attr["style"] = style.join("");

            style = x2h.attri(xmlHolderElement, attr);
            var wordwrap = style['word-wrap']
            //;
            //var $newdiv1 = $( "<div><div> </div></div>" );
            var fragment = document.createDocumentFragment(),
            subEle = fragment.appendChild(document.createElement("div"));
            xmlHolderElement.appendChild(subEle);

            var div = fragment.appendChild(document.createElement("div"));
            div.id = this.id + "_data";  // 부모ID+_data
            subEle.appendChild(div);

            //
            var spanElem = fragment.appendChild(document.createElement("span"));
            spanElem.id = this.id + "_span";  // 부모ID+_data
            div.appendChild(spanElem);
            //

            style = "";
            var attri = ["vertical-align", "text-align", "white-space"];
            attri.forEach(function (key) {
                if (objXML[key]){
                    style += (key + ':' + objXML[key] + ';');
                }
                if(key == 'white-space'){
                    if(wordwrap != 'normal')
                    style += (key + ': normal;');
                }
            })

            if (style != "") {
                div.setAttribute('style', style);
            }
            //div.innerHTML = dataCell;
            //div.innerHTML = '';
            //div.innerText = '';
            spanElem.innerHTML = dataCell;
         
            //var childelement = this._html.children;
            //this._html.children[0].children[0].innerHTML = Value;

            return;
        },

       onInitAfter : function () {
           // binding events
           // no events for static control
           // 도움말 툴팁기능
            // 클래스명으로 검색
            var obj = this, $self = this.$html, $tp;
            if (!hi5.isEmpty(this.customtooltip)) {
                var selector = $self;
                if (this.customtooltip.selector) {
                    selector = this.customtooltip.selector;
                    $tp = $self.find(selector);
                } else {
                    //$self.removeClass('hi5-c-ui-tooltip').addClass('hi5-c-ui-tooltip')
                    if( hi5.WTS_MODE == WTS_TYPE.SPA ){
                        $self.removeClass('hi5-c-ui-tooltip');
                        $tp = $self.find("span");
                        $tp.addClass('hi5-c-ui-tooltip');
                    }else    
                        $tp = $self;
                }

                // 일괄처리하는 경우 속성만 적용을 한다.
                if (this.customtooltip.attr) {
                    x2h.setAttriCustomToolTip($tp, this.customtooltip.attr);
                    x2h.setAttriCustomToolTip($tp, { "tp-form": this.objParentForm.id, "tp-target": this.id });

                    this.customtooltip = null;
                }
            }

           return;
       },

        // HTML 요소객체 취득
        GetElemnt: function () {
            return this.$html;
            //var self = this, $element = $("#" + self.id);
            //return $element;
        },

        /// <member id="GetDataElement" kind="method">
        /// <summary>데이터 영역의 HTML Tag 요소를 취득하는 함수</summary>
        /// <remarks>복합 요소로 구성된 컨트롤에서 타이틀 영역을 변경시에 사용</remarks>
        /// <returns type="object"> html의 DIV 요소 객체 반환</returns>
        /// <example><![CDATA[
        ///    // 자식 HTML  요소(DIV) 객체를 취득하는 함수 
        ///    var div = static.GetDataElement();  // JavaScript 객체
        ///    div.innerHTML = "Text";   // Text 값 설정
        ///    
        ///    // JQuery 라이브러이로 속성, 스타일, 클래스등을 변경한다.
        ///    $(div).css(), $(div).attr(),,.
        /// ]]></example>
        /// </member>
        GetDataElement: function () {
            var $element = this.GetElemnt()
            return $element[0].children[0].children[0]; // 데이터 요소 <div><div><div> ~</div></div></div>
        },

        /* method */
        /// <member id="GetStyle" kind="method">
        /// <summary>스타일 정보를 취득하는 함수</summary>
        /// <remarks>스타일명으로 모든 스타일을 취득하는 함수 </remarks>
        /// <param name = "style" type="string|object"> 스타일 정보</param>
        /// <returns type="string|object"> 스타일 정보를 반환</returns>
        /// </member>
        GetStyle : function (style) {
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
        SetStyle : function (style, value) {
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
        GetProp : function (propName) {
            var $element = this.GetElemnt(), val;
            if (propName == "caption" ||  propName == "value") {
                //val = $element.text();
                var childElement = this.GetDataElement().children[0];
                val = childElement.innerHTML;
            }
            else {
                val = $element.attr(propName);

            }
            return val;
        },

        /// <member id="SetProp" kind="method">
        /// <summary>속성 정보를 변경하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 제어하는 함수</remarks>
        /// <param name = "propName" type="string"> 스타일 정보</param>
        /// <param name = "value" type="string"> 셀 아이템명</param>
        /// </member>
        SetProp : function (propName, Value) {
            if (propName == "caption" || propName == "value") {
                var childElement = this.GetDataElement().children[0];
                childElement.innerHTML = Value;
                //var childElement = this._html.children;
                //childElement[0].children[0].innerHTML = Value;
            } 
            else {
                var $element = this.$html;
                typeof (propName) === "object" ?  $element.attr(propName) :  $element.attr(propName, Value);
            }
        },
    }

    _static.ctlName = "static";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(_static.ctlName, _static);
    return _static;
}());
