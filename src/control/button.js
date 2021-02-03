//******************************************************************/
// All Rights Reserved. Copyright(c)   2017 Korea Sorimachi Ltd.Co  /
//******************************************************************/
/*! File Name     : button.js
/*! Function      :	button control
/*! System Name   : HTML5 Project
/*! Create        : Kiwon Sohn , 2017/03/21
/*! Update        : 
/*! Comment       :
//******************************************************************/
var g_button_DS = {};

(function () {
    'use strict';

    var version = '1.0';

    // init object
    var button = function () {
        this.class = [];
        this.btntype = "normal";  // ctrltype ->btntype

        this.state = false;
        this.onvalue = "";
        this.offvalue = "";

        this.customList = {};   // 공통기능 처리

        this.tooltip = {};
        this.singleline = "1";

        this.customtooltip = {};
    }

    button.prototype = {
        // 초기컬러정보 설정
        _initColorInfo : function(){
            g_button_DS = {
                "active": {
                    "normal": {
                        "border-color": clridx.getColorIndex("58"),
                        "color": clridx.getColorIndex("60"),
                        "background-color": clridx.getColorIndex("59")
                    },
                    "toggle": {
                        "border-color": clridx.getColorIndex("58"),
                        "color": clridx.getColorIndex("60"),
                        "background-color": clridx.getColorIndex("59")
                    },
                    "buy": {
                        "border-color": clridx.getColorIndex("b46"),
                        "color": clridx.getColorIndex("b50"),
                        "background": "linear-gradient(#CA3434,#EC4241)"
                    },
                    "sell": {
                        "border-color": clridx.getColorIndex("b47"),
                        "color": clridx.getColorIndex("b51"),
                        "background": "linear-gradient(#144DC1,#4069EC)"
                    },
                    "modify": {
                        "border-color": clridx.getColorIndex("b48"),
                        "color": clridx.getColorIndex("b52"),
                        "background": "linear-gradient(#148D70,#2AA488)"
                    },
                    "cancel": {
                        "border-color": clridx.getColorIndex("b49"),
                        "color": clridx.getColorIndex("b53"),
                        "background": "linear-gradient(#6B3394,#945EBC)"
                    }
                }
            };
        },
        propertyLoad: function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_button"], // 클래스 정보명 
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "", disabled :""}, // HTML Attri 정의하는 정보 설정
                //dataCell = "조회";  // caption
                dataCell = "";  // caption

            var objXML;
            if (x2h.getXML2JSON) {
                objXML = x2h.getXML2JSON(node, this, attr, cls, style, function (node) {
                    return [];
                });
            } else {
                debugger;
                // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
                objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                    // CDDATA 정보를 포함한 속석명 지정
                    return ["multi_lang"];
                });
            }

            // stylecolor 정보를 객체로 변환한다(String->JSON)
            if (objXML.stylecolor)
                this.styleColor = x2h.defaultStyle(objXML.stylecolor, false); 

            if(cls.length == 1) //custom class가 지정 안되었을시 기본 type별 class 추가
                cls.push("btn_" + this.btntype);

            // class 지정
            if (this.btntype == "toggle") {
                cls.push(this.state == true ? "toggleOn" : "toggleOff");
            }

            attr["class"] = cls.join(" ");

            if (!hi5.isEmpty(this.tooltip)) {
                var objTP = this.tooltip, key, val;
                if (!objTP.tooltip) {
                    var tp = {};  tp['tooltip'] = this.tooltip;  objTP = tp;
                }
                val = x2h.xmlGetMultiLangText(objTP, "tooltip");  // title 기본 
                key = (objTP.tooltip.tagname == undefined) ? "title" : objTP.tooltip.tagname;
                attr[key] = val;
            }

            // Caption            
            //var objM = x2h.xmlJSONData(node, "multi_lang");
            if (objXML.multi_lang) {
                dataCell = x2h.xmlGetMultiLangText(objXML.multi_lang, "caption");
                if (this.singleline == 0 && dataCell != "")
                    dataCell = x2h.getMultiLineText(dataCell);
            }

            if (style.length)
                attr["style"] = style.join("");

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);

            // 기본 색 정보와 XML색정보가 변경된 경우만 적용
            if (this.class == "") {
                // 컨트롤 유형별 기본 색 정보취득
                var prop = hi5.getCustomStyle(this, "default"), name, key;
                for (key in prop ) {
                    name = $.camelCase(key);   // border-color->borderColor 변환
                    if (style[name] === "")    // style 속성이 없는 경우만 컨트롤 기본 Style 정보를 설정한다.
                        style[name] = prop[key]
                }
            }
            if(attr.class.indexOf("hi5_Export") != -1){
                dataCell = "<i class='fa fa-external-link'></i>" + dataCell;
            }

            // --> [Edit] 20200102 leenohan 
            // 수정내용 > 엑셀 불러오기 test형식으로 해당 class명이 있을때 input 태그를 숨겨서 띄워준다..
            if(attr.class.indexOf("hi5_import") != -1){
                //일단 파일형식은 csv, excel 에 한해서 불러올수있게 코딩함..
                //accept속성 정의 https://developer.mozilla.org/ko/docs/Web/HTML/Element/Input/file
                dataCell = "<input type='file' id='"+ attr.id +"_import' style='display:none;' accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'>" + dataCell;
            }
            // <-- [Edit] 20200102 leenohan
            
            $(xmlHolderElement).html(dataCell);
            //xmlHolderElement.textContent = dataCell;
            //$(xmlHolderElement).text(dataCell);

            // 도움말 아이콘 HTML 내용 Append
            if (this.customtooltip) {
                var strHTML;
                if (this.customtooltip.child) {  // 자동으로 생성한다.
                    strHTML = '<span class="tooltipWrapper vertFlip right"><i class="hi5-c-ui-tooltip fa fa-question-circle"></i> </span>'
                } else if ( this.customtooltip.append ) {   // 사용자 직접생성
                    strHTML = this.customtooltip.append;
                }
                if (strHTML)
                    $(xmlHolderElement).append(strHTML);
                //$(xmlHolderElement).append('<span class="tooltipWrapper vertFlip right"><i class="hi5-c-ui-tooltip fa fa-question-circle"></i> </span>');
            }

            if (objXML.disabled) {
                this.Disabled(true);
            }
            return;
        },

        onInitAfter : function () {
            var obj = this, $self = this.$html;

            //if (tabindex == 1) obj.SetFocus();
            if (this.btntype == "toggle") {
                if (this.state == true) {
                    var cssstyle = hi5.getCustomStyle(this,"active");
                    $self.css(cssstyle);
                }
            }
            
            // --> [Edit] 20200102 leenohan 
            // 수정내용 > 엑셀 불러오기 test형식으로 해당 class명이 있을때 input태그에 change이벤트 바인딩
            // 그후에 file선택시, 해당 파일을 들고 버튼의 onclick이벤트를 발생시켜준다.
            // 그후에 처리는 버튼 OnClick 이벤트에 스크립트로 작성하면 된다.
            if($self.hasClass("hi5_import")){
                //debugger;
                var inputEle = $("#" + this._html.id + "_import")[0];
                hi5.on(inputEle,"change", function (e) {
                    //debugger;
                    if(e.target.files.length>0){
                        obj.file = e.target.files;
                        obj.OnClick(obj);
                        obj.file = null;
                    }
                });
            }
            // <-- [Edit] 20200102 leenohan

            //var he = hi5.getById(this.id);
            //var disabled = this._html.disabled;
            //var disabled = $self.prop("disabled");
            //if (disabled == true) {
            //    this.Disabled(true);
            //}
          //  debugger;
            var elem = $self[0];
            if (this.class == "") {
    /*
                 bind(elem, 'mousedown',  function (evt) {
                    if (obj.btntype == "toggle") {
                        if (obj.state == false) {
                            var cssstyle = hi5.getCustomStyle(obj,"default");
                            $self.css(cssstyle);

                            $(this).toggleClass("toggleOn");
                            $(this).toggleClass("toggleOff");
                        }
                    }
                    else {
                        $self.css(hi5.getCustomStyle(obj,"over"));
                    }
                });
                bind(elem, 'mouseenter',  function (evt) {
                    //var $target = $(evt.target);
                    if (obj.btntype != "toggle") {
                        var cssstyle = hi5.getCustomStyle(obj,"over");
                        $self.css(cssstyle);
                    }
                });

                bind(elem, 'mouseleave', function (evt) {
                    //var $target = $(evt.target);
                    if (obj.btntype != "toggle") {
                        var cssstyle = hi5.getCustomStyle(obj,"default");
                        $self.css(cssstyle);
                    }
                });
    */
           
                hi5.on(elem,"mouseup", function () {
                    if (obj.btntype == "toggle") {
                        if (obj.state == false) {
                            var cssstyle = hi5.getCustomStyle(obj,"default");
                            $self.css(cssstyle);
                            $self.toggleClass("toggleOn");
                            $self.toggleClass("toggleOff");
                        }
                    }
                    else {
                        $self.css(hi5.getCustomStyle(obj,"over"));
                    }
                });


                hi5.on(elem, "mousedown", function () {
                    $self.css(hi5.getCustomStyle(obj,"active"));

                    if (obj.btntype == "toggle") {
                        if (obj.state == false) {
                            obj.state = true;
                            $self.toggleClass("toggleOn");
                            $self.toggleClass("toggleOff");
                        }
                        else {
                            obj.state = false;
                        }
                    }
                });

                // focus
                hi5.on(elem, "mouseenter", function () {
                    if (obj.btntype != "toggle") {
                        var cssstyle = hi5.getCustomStyle(obj,"over");
                        $self.css(cssstyle);
                    }
                });

                hi5.on(elem, "mouseleave", function () {
                    if (obj.btntype != "toggle") {
                        var cssstyle = hi5.getCustomStyle(obj,"default");
                        $self.css(cssstyle);
                    }
                });
    /*
                hi5.on(elem, {
                    mouseup: function (evt) {
                        if (obj.btntype == "toggle") {
                            if (obj.state == false) {
                                var cssstyle = hi5.getCustomStyle(obj,"default");
                                $self.css(cssstyle);

                                $(this).toggleClass("toggleOn");
                                $(this).toggleClass("toggleOff");
                            }
                        }
                        else {
                            $self.css(hi5.getCustomStyle(obj,"over"));
                        }
                    },
                    mousedown: function (evt) {
                        $self.css(hi5.getCustomStyle(obj,"active"));

                        if (obj.btntype == "toggle") {
                            if (obj.state == false) {
                                obj.state = true;
                                $self.toggleClass("toggleOn");
                                $self.toggleClass("toggleOff");
                            }
                            else {
                                obj.state = false;
                            }
                        }
                    },
                    mouseenter: function (evt) {
                        //var $target = $(evt.target);
                        if (obj.btntype != "toggle") {
                            var cssstyle = hi5.getCustomStyle(obj,"over");
                            $self.css(cssstyle);
                        }
                    },
                    mouseleave: function (evt) {
                        //var $target = $(evt.target);
                        if (obj.btntype != "toggle") {
                            var cssstyle = hi5.getCustomStyle(obj,"default");
                            $self.css(cssstyle);
                        }
                    }
                });
    */
           }
       
          //  if (obj.OnClick) {
                //bind(elem, 'click', function (evt) {
                //    obj.OnClick.call(obj);
                //});

                hi5.on(elem, 'click', function (evt) {
                    // --> [Edit] 20200102 leenohan 
                    // 수정내용 > 엑셀 불러오기 test형식으로 해당 class명이 있을때 input 태그 클릭이벤트 실행
                    if($self.hasClass("hi5_import")){
                        //debugger;
                        $("#" + obj._html.id + "_import")[0].click();
                    }
                    // <-- [Edit] 20200102 leenohan 
                    else{
                        if (obj.btntype == "toggle") {
                            if (obj.state == false) {
                                $self.toggleClass("toggleOn");
                                $self.toggleClass("toggleOff");
                            }
                        }
                        if ( obj.OnClick ){
                             obj.OnClick.call(obj);
                        }
                    }
                });
                //$self.on('click', function (evt) {
                //    obj.OnClick.call(obj);
                //});
     //       }

            // 도움말 툴팁기능
            // 클래스명으로 검색
            var $tp;
            if (!hi5.isEmpty(this.customtooltip)) {
                var selector = $self;
                if (this.customtooltip.selector) {
                    selector = this.customtooltip.selector;
                    $tp = $self.find(selector);
                } else {
                    //$self.removeClass('hi5-c-ui-tooltip').addClass('hi5-c-ui-tooltip')
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
        GetElemnt : function () {
           // var self = this, $element = $("#" + self.id);
            return this.$html;
        },

        // disabled 됐을때 동작(css disabled 동일)
        Disabled : function (state) {
            if (state == undefined || this.class != "") return;
            var cssstyle = {};
            if (state == true || state == "disabled" || state == "true") {
                cssstyle = hi5.getCustomStyle(this, "disable");
            }
            else {
                cssstyle = hi5.getCustomStyle(this, "default");
            }

            if(cssstyle)
                this.GetElemnt().css(cssstyle);
        },

        // autosave
        GetAutoSave : function () {
            /*
                    if (this.objParentForm.autosavelist) {
                        if (this.objParentForm.autosavelist.ctrllist) {
                            if (this.objParentForm.autosavelist.ctrllist.length > 0) {
                                if (this.objParentForm.autosavelist.ctrllist.indexOf(this.orgid) > -1) {
                                    var screenid = this.objParentForm.m_sScreenID;
                                    var autosavelist = hi5.GetCookie(screenid);
                                    if (autosavelist != "") {
                                        var ctrllist = autosavelist.split(",");
                                        for (var x = 0; x < ctrllist.length; x++) {
                                            var ctrls = ctrllist[x].split(":");
                                            var ctrlname = ctrls[0];
                                            var ctrlvalue = ctrls[1];
                                            if (this.orgid == ctrlname) {
                                                return ctrlvalue;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
            */
            return "";
        },

        AutoSaveCtrl : function (org_id) {
            if (this.btntype == "toggle") {
                var state = this.state;
                return this.state;
            }
            return "";
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
            //var childelement = $element[0].children[0].children;
            if (typeof (style) === "object") {
                $element.css(style);

                //var styles = Object.keys(style);
                //for (var x = 0; x < styles.length; x++) {
                //    var propname = styles[x];
                //    var textAlign, verticalAlign;
                //    if (propname == "text-align" || propname == "textAlign" || propname == "vertical-align" || propname == "verticalAlign") {
                //        $(childelement).css(propname, style[propname]);
                //    }
                //}
            }
            else {
                $element.css(style, value);

                //if (style == "text-align" || style == "textAlign" || style == "vertical-align" || style == "verticalAlign") {
                //    $(childelement).css(style, value);
                //}
            }

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

            if (propName == "caption") {
                val = $element.text();
            }
            else if (propName == "state") {
                if (this.btntype != "toggle") {
                    alert("This button is not a toggle type!");
                    return "";
                }

                val = this.state;
            }
            else if (propName == "value") {
                if (this.state == "0" || this.state == false) val = this.offvalue;
                else val = this.onvalue;
            }
            else if (propName === "floatstyle" || propName === "singleline" || propName === "borderStyle" || propName === "backgroundImage" ||
                        propName === "opacity" || propName === "textAlign") {
                propName = 
                propName === "floatstyle" ? "float" :
                propName === "borderStyle" ? "border" :
                propName === "backgroundimage" ? "background-image" : propName = propName;

                val = this.GetStyle(propName);
            }
            else if (propName === "onvalue" || propName === "offvalue") {
                val = this[propName];
            }
            else if (propName === "btntype") {
                val = this.btntype;
            }
            else if (propName === "test") {
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
            var $element = this.GetElemnt();

            if (propName == "caption") {
                if ($element.attr("singleline") == "0")
                    Value = x2h.getMultiLineText(Value);

                //$element.text(Value);
                //document.getElementById(this.id).innerHTML = Value;
                $element[0].innerHTML = Value;
            }
            else if (propName == "state") {
                if (this.btntype != "toggle") {
                    alert("This button is not a toggle type!");
                    return;
                }
                
                if (Value == true) {
                    $element.css(hi5.getCustomStyle(this,"active"));
                    $element.removeClass("toggleOff");
                    $element.addClass("toggleOn");
                }
                else {
                    $element.css(hi5.getCustomStyle(this,"default"));
                    $element.removeClass("toggleOn");
                    $element.addClass("toggleOff");
                }
            }
            else if (propName == "icon") {
                var obj = Value;
                $element.children().remove();
                if(obj && obj.iconClass){
                    var innerText = $element.html() + '<i class="' + obj.iconClass + '"></i>';
                    $element.html(innerText);
                }
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
        SetFocus : function () {
            var $element = this.GetElemnt();
            $element[0].focus();
            //document.getElementById(this.id).focus();
        }
        /* events */
        /// <member id="OnClick" kind="event" default="true">
        /// <summary>버튼 클릭시 발생되는 이벤트</summary>
        /// <remarks>버튼 클릭시 발생되는 이벤트</remarks>
        /// <example>example
        /// </example>
        /// </member>
        //button.prototype.OnClick = function () {
        //    var fn = this.objParentForm.getIsEventName(this.id, "OnClick");
        //    if (fn != null) fn();
        //}
    }
    button.ctlName = "button";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(button.ctlName, button);

    return button;
}())

