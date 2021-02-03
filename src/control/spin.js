//spin.js
(function () {
    'use strict';

    var spin = function () {
        this.itemflag = "1";
        this.class = "";

        this.datastyle = 0;             //표시형식(0-기본,1-주식 수량,2-주식 가격....)
        this.tickdata = 1;              //증감값
        this.minrange = "-9999999999";    //최소값
        this.maxrange = "99999999999";     //최대값
        this.precision = 0;
        this.mobile = hi5.GetMobile_info();
        this.customtooltip = {};
    }

    //컨트롤 html 스크립트 생성
    spin.prototype = {
        propertyLoad: function (node, nodeName, xmlHolderElement) {
            var that = this,
                    cls = ["hi5_spin"], // 클래스 정보명 
                    style = [],           //  Style, 색정보용 Style  정보
                    attr = { id: "", disabled: "", basedata: "" }, // HTML Attri 정의하는 정보 설정
                    dataCell = "";  // caption

            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            //var objXML = x2h.getXML2Control(node, this, attr, cls, style);
            var objXML;
            if (x2h.getXML2JSON) {
                objXML = x2h.getXML2JSON(node, this, attr, cls, style, function (node) {
                    return [];
                });
            } else {
                // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
                objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                    // CDDATA 정보를 포함한 속석명 지정
                    return [];
                });
            }

            // stylecolor 정보를 객체로 변환한다(String->JSON)
            if (objXML.stylecolor)
                this.styleColor = x2h.defaultStyle(objXML.stylecolor, false);

            var dispstyle = objXML.dispstyle;

            if (dispstyle == "1") {
                if (cls.indexOf("hi5_spin") > -1) cls[cls.indexOf("hi5_spin")] = "hi5_spin-mobile";
            }

            var fragment = document.createDocumentFragment();
            if (dispstyle == "1") {
                var textNode;
                //var labelEle = x2h.createXmlElement(xmlHolderElement, "div");
                var labelEle = fragment.appendChild(document.createElement("div"));
                xmlHolderElement.appendChild(labelEle);

                var upEle = fragment.appendChild(document.createElement("div"));
                xmlHolderElement.appendChild(upEle);

                var plusEle = fragment.appendChild(document.createElement("i"));
                upEle.appendChild(plusEle);

                var downEle = fragment.appendChild(document.createElement("div"));
                xmlHolderElement.appendChild(downEle);

                var minusEle = fragment.appendChild(document.createElement("i"));
                downEle.appendChild(minusEle);

                var unitEle = fragment.appendChild(document.createElement("div"));
                xmlHolderElement.appendChild(unitEle);

                var inputEle;
                //if (hi5.WTS_MODE == WTS_TYPE.MTS)   //모바일 모드에서는 span 태그로 교체..(input태그는 키보드가 올라오는 문제)
                //    inputEle = fragment.appendChild(document.createElement("span"));
                //else
                    inputEle = fragment.appendChild(document.createElement("input"));
                xmlHolderElement.appendChild(inputEle);

                labelEle.className = "spinLabel";
                unitEle.className = "spinUnit";
                plusEle.className = "fa fa-plus";
                //var str = "font-family:'Material Icons'!important;";
                //plusEle.setAttribute("style", str);
                //plusEle.style.fontFamily = "'Material Icons'!important;";
                //textNode = x2h.createTextNode(xmlHolderElement, "add");
                //plusEle.appendChild(textNode);

                minusEle.className = "fa fa-minus";
                //minusEle.setAttribute("style", str);
                //minusEle.style.fontFamily = "'Material Icons'!important;";
                //textNode = x2h.createTextNode(xmlHolderElement, "remove");
                //minusEle.appendChild(textNode);
            }
            else {
                var upEle = fragment.appendChild(document.createElement("div"));
                xmlHolderElement.appendChild(upEle);

                var downEle = fragment.appendChild(document.createElement("div"));
                xmlHolderElement.appendChild(downEle);

                var inputEle = fragment.appendChild(document.createElement("input"));
                xmlHolderElement.appendChild(inputEle);
            }

            inputEle.className = "spinBoxText";
            downEle.className = "spinBoxDown";
            upEle.className = "spinBoxUp";

            inputEle.id = this.id + "_Input";
            inputEle.setAttribute("autocomplete", "off");
            
            if (this.mobile == 'I') {
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                if ((v[1]+'.'+v[2]).atof() >= 12.2) {
                    inputEle.setAttribute("type", "text");
                    inputEle.setAttribute("inputmode", "decimal");
                } else {
                    inputEle.setAttribute("type", "number");
                }
            }
            else if (this.mobile == 'A')
                inputEle.setAttribute("type", "tel");
            
            upEle.id = this.id + "_Up";
            downEle.id = this.id + "_Down";

            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);
            if (objXML.basedata)
                inputEle.value = objXML.basedata;

            if (objXML.disabled) {
                this.Disabled(true);
            }
        },
        onInitAfter: function () {
            var obj = this, $inputEle = $('#' + this.id + '_Input'), $elem = this.$html;

            //taborder
            //[S]수량, 가격 최대자릿수 지정
            var maxLen, dtstyle = obj.datastyle;
            if (dtstyle == 19 || dtstyle == 20 || dtstyle == 21) {                           //가상화폐 수량
                maxLen = "17";
            }

            if (maxLen != undefined)
                $inputEle.attr("maxlength", maxLen);
            //[E]수량, 가격 최대자릿수 지정
            //이벤트 binding start
/*            $('#' + this.id + '_Input').on('click', function () {
                if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                    var title, tagName;
                    var objOpenData = {
                        value: $(this).val(),
                        spin: this.id
                    };

                    if (obj.datastyle == 19) {
                        title = "qty";
                        tagName = "SPIN_QTY";
                    } else if (obj.datastyle == 20) {
                        title = "amt";
                        tagName = "SPIN_AMT";
                    }
                    obj.objParentForm.OpenDialog("aat900000", title, tagName, objOpenData, "bottom");
                } else {
                    //this.select();
                }
            });*/

            $('#' + this.id + '_Input').on('keydown', function (event) {
               if (event.shiftKey == true) {
                    if (event.keyCode == jQuery.ui.keyCode.END
                        || event.keyCode == jQuery.ui.keyCode.HOME
                        || event.keyCode == jQuery.ui.keyCode.LEFT
                        || event.keyCode == jQuery.ui.keyCode.RIGHT) {
                    }
                    else {
                        event.preventDefault();
                        return;
                    }
                }

                // 숫자 이외 점, 마이너스, 백스페이스, delete, 좌우, 스페이스만 입력 가능
                if ((event.keyCode < 48 || event.keyCode > 57) &&
                    (event.keyCode < 96 || event.keyCode > 105) && event.keyCode != jQuery.ui.keyCode.PERIOD && event.keyCode != 110 && event.keyCode != 109 && event.keyCode != 189
                    && event.keyCode != jQuery.ui.keyCode.BACKSPACE && event.keyCode != jQuery.ui.keyCode.TAB && event.keyCode != jQuery.ui.keyCode.LEFT &&
                    event.keyCode != jQuery.ui.keyCode.RIGHT && event.keyCode != jQuery.ui.keyCode.DELETE ) {
                    event.preventDefault();
                    return;
                }
                if (event.key == '.') {
                    if (this.value.indexOf(event.key) >= 0) {
                        event.preventDefault();
                        return;
                    }
                }
                // 소수점 자리수가 0이면 점도 입력 불가능하도록(공통)
                var precision = obj.precision;
                // KRW 수량일 때, 입력시 가능한 소숫점 자리수는 무조건 4자리로 통일. 2018.11.30 kws
                if (obj.datastyle == 19 && obj.basecurr == 'KRW') precision = 4;
                if (precision == 0 && (event.keyCode == jQuery.ui.keyCode.PERIOD || event.keyCode == 110)) {
                    event.preventDefault();
                    return;
                }

                // minrange가 0 이하면 - 가 입력 되도록(공통)
                if (parseFloat(obj.minrange) >= 0) {
                    if (event.keyCode == 109 || event.keyCode == 189) {
                        event.preventDefault();
                        return;
                    }
                }

                var value = this.value;
                value = value.removeAll(",");

                if (obj.datastyle == 0 || obj.datastyle == 20 || obj.datastyle == 19 || obj.basecurr == "BTC" || obj.basecurr == "ETH") {
                    if (obj.basecurr == "KRW" && obj.datastyle == 20) {
                        var pValue = parseInt(value);
                        if (pValue >= 100) precision = 0;
                        else precision = 2;
                    }

                    // "." 눌렀을 때
                    if (event.keyCode == jQuery.ui.keyCode.PERIOD || event.keyCode == 110) {
                        if (value.indexOf('.') !== -1
                            || (event.target.selectionEnd - event.target.selectionStart == value.length)) {
                            event.preventDefault();
                            return;
                        }
                        else if (value.length == 0) {
                            this.value = "0";
                        }

                        if (event.target.selectionStart == event.target.selectionEnd && event.target.selectionStart == 0) {
                            value = "0." + value;
                        }
                    }

                    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
                        var p = value.split(".");
                        if (p[1]) {
                            if (p[1].length >= precision) {
                                //입력 위치에 따라 막아야한다.
                                if (event.target.selectionStart == event.target.selectionEnd && event.target.selectionStart >= value.length - precision) {
                                    event.preventDefault();
                                    return;
                                }
                            }
                        }

                        var essence = p[0].removeAll(",");
                        var pp = obj.maxrange.split(".");
                        var maxLength = pp[0].length;
                        if (essence.length >= maxLength) {
                            //입력 위치에 따라 막아야한다.
                            if (event.target.selectionStart == event.target.selectionEnd) {
                                var valueIndex = value.length;
                                if (value.indexOf(".") > 0) {
                                    valueIndex = value.indexOf(".");
                                }

                                if (event.target.selectionStart < valueIndex + 1) {
                                    event.preventDefault();
                                    return;
                                }
                            }
                        }
                    }
                }
                else if (obj.precision == 0 && obj.datastyle == 21) {
                    // "." 눌렀을 때

                    if (event.keyCode == 110 || event.keyCode == jQuery.ui.keyCode.PERIOD) {
                        event.preventDefault();
                        return;
                        
                    }

                    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
                        var essence = value.removeAll(",");
                        var pp = obj.maxrange.split(".");
                        var maxLength = pp[0].length;

                        if (essence.length >= maxLength) {
                            //입력 위치에 따라 막아야한다.
                            if (event.target.selectionStart == event.target.selectionEnd) {
                                event.preventDefault();
                                return;
                            }
                        }
                    }
                }
                else {
                    if (event.keyCode == 109 || event.keyCode == 189) {
                        if (value.indexOf('-') !== -1 || event.target.selectionStart > 0) {
                            event.preventDefault();
                            return;
                        }
                    }
                }
            });

            $('#' + this.id + '_Input').on('keyup', function (event) {
                var value = this.value;
                if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                    if (value.indexOf('-') > -1) {
                        value = value.removeAll('-')
                    }

                    if (obj.precision == 0) {
                        if (value.indexOf('.') > -1) {
                            value = value.removeAll('.')
                        }
                    } else {
                        var data_value = value.split('.');
                        var p_f = data_value[0]
                        var p_s = data_value[1]
                        if (p_s) {
                            p_s = p_s.substring(0, obj.precision)
                            value = p_f + '.' + p_s;
                        }
                    }
                }
                if(obj.datastyle == 21 && obj.precision > 0 ){
                    var data_value = value.split('.');
                    var p_f = data_value[0]
                    var p_s = data_value[1]
                    if (p_s) {
                        p_s = p_s.substring(0, obj.precision)
                        value = p_f + '.' + p_s;
                    }                 
                }
                //if (value.match(/./g) && value.match(/./g).length > 1) {
                //    var p_f = value.substring(0, value.indexOf('.') + 1)
                //    var p_s = value.substring(value.indexOf('.') + 1, value.length)
                //    p_s = p_s.removeAll('.')
                //    value = p_f + p_s;
                //}
                

                if (!(event.keyCode >= 37 && event.keyCode <= 40)) {    // 한글 입력 방지. 한글은 keydown시 막지 못한다.
                    $(this).val(value.replace(/[^0-9\.\-]/gi, ''));
                }

                if ((event.keyCode >= 48 && event.keyCode <= 57) ||
                    (event.keyCode >= 96 && event.keyCode <= 105)) {
                    if (value.length >= 2 && value.substring(0, 1) == "0" && value.substring(1, 2) != ".") {
                        value = value.substring(1);
                        this.value = value;
                    }
                }

                if (obj.basecurr == "KRW" && obj.datastyle == 20) {
                    value = value.removeAll(",");
                    var p = value.split(".");
                    var dd = parseInt(p[0]);
                    if (parseInt(dd) >= 100) {
                        this.value = dd;
                    }
                    else {
                        if ((event.keyCode == jQuery.ui.keyCode.PERIOD || event.keyCode == 110) && value.slice(-1) != ".") {
                            var ee = p[1] || "00";
                            if (dd < 100) {
                                this.value = p[0] + "." + ee.substring(0, 2);
                            }
                            else {
                                this.value = dd;
                            }
                        }
                    }
                }

                if(parseFloat(value) > parseFloat(obj.maxrange))
                    this.value = value = obj.maxrange; 

                // 2019.10.17 kws
                // 가격스핀일때 입력시에 호가단위를 체크한다.
                // 다만 소수점 이하 자리수만 체크한다.
                if(obj.datastyle == 20){
                    if(obj.precision){
                        if(obj.precision > 0){  // 소숫점이 있을때만 체크.
                            value = value.removeAll(",");
                            var p = value.split(".");
                            if(p[1]){   // 소숫점이 입력되었을때만 체크
                                var inputDecimal = p[0] + hi5.RPAD(p[1], obj.precision, "0");
                                var tickDecimal = obj.tickdata * Math.pow(10, obj.precision);

                                if(parseInt(inputDecimal) % tickDecimal != 0){    // tick단위로 나눴을때 나머지가 생기면 호가단위에 안맞는거다.
                                    value = hi5.getTickValue(obj.code, value, false);
                                    this.value = value.toFixed(obj.precision);   /* 소수점 자리수 맞춰준다.*/
                                }
                            }
                        }
                    }
                }
                
                
                
//debugger;
                // spin에서 전부 지웟을경우, 최소 0값으로 셋팅시켜준다.
                if(hi5.WTS_MODE == WTS_TYPE.SPA){
                    this.value = this.value == "" ? "0" : this.value;
                }
                if (obj.OnSpinChange)
                    obj.OnSpinChange.call(obj);
            });

            $('#' + this.id + '_Input').on('focusout', function (event) {
                var value = this.value;

                //2019.10.11 kws
                // 가격 spin인 경우 호가 단위에 맞춰줘야한다.
                //if(obj.datastyle == 20){
                //   if(obj.code){
                //        if(value == "") value = "0";
                //        value = hi5.getTickValue(obj.code, value, false);
                //        if(obj.precision)
                //            value = value.toFixed(obj.precision);   /* 소수점 자리수 맞춰준다.*/
                //    }
                //}
                if (hi5.GetMobile_info() != 'I') {
                    value = putThousandsSeparators(value);
                }
                this.value = value;
            });

            $('#' + this.id + '_Up').on('click', function () {
                var ctrl = this.parentNode;
                if (typeof (ctrl) == 'undefined') {
                    return;
                }

                var disabled = this.getAttribute("disabled");
                if (disabled == "disabled") return;
                obj.MoveTick(true);

                if (obj.OnSpinChange)
                    obj.OnSpinChange.call(obj);

                if(obj.OnTooltipContent)
                    obj.OnTooltipContent.call();
            });

            $('#' + this.id + '_Down').on('click', function () {
                var ctrl = this.parentNode;
                if (typeof (ctrl) == 'undefined') {
                    return;
                }

                var disabled = this.getAttribute("disabled");
                if (disabled == "disabled") return;
                obj.MoveTick(false);

                if (obj.OnSpinChange)
                    obj.OnSpinChange.call(obj);

                if(obj.OnTooltipContent)
                    obj.OnTooltipContent.call();
            });

            // 도움말 툴팁기능
            // 클래스명으로 검색
            var $tp;
            if (!hi5.isEmpty(this.customtooltip)) {
                var selector = $elem;
                if (this.customtooltip.selector) {
                    selector = this.customtooltip.selector;
                    $tp = $elem.find(selector);
                } else {
                    //$self.removeClass('hi5-c-ui-tooltip').addClass('hi5-c-ui-tooltip')
                    $tp = $elem;
                }

                // 일괄처리하는 경우 속성만 적용을 한다.
                if (this.customtooltip.attr) {
                    x2h.setAttriCustomToolTip($tp, this.customtooltip.attr);
                    x2h.setAttriCustomToolTip($tp, { "tp-form": this.objParentForm.id, "tp-target": this.id });

                    this.customtooltip = null;
                }
            }
        },
        GetElemnt: function () {
            return this.$html;
        },
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
            //var $inputEle = $element.find("input");
            var $inputEle;
            //if (hi5.WTS_MODE == WTS_TYPE.MTS)
            //    $inputEle = $element.find("span");
            //else
                $inputEle = $element.find("input");

            if (propName == "caption" || propName == "value") {
                val = $inputEle[0].value || $inputEle[0].innerHTML;
                if (propName == "value" && val != "") {
                    return val.removeAll(",");
                }
            }
            else if (propName == "floatstyle" || propName == "borderStyle" || propName == "opacity" || propName == "textAlign") {
                propName = (
                    propName === "floatstyle" ? "float" :
                    propName === "borderStyle" ? "border" :
                    propName);

                val = this.GetStyle(propName);
            }
            else if (propName == "dispstyle") {
                val = this.dispstype;
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
        SetProp: function (propName, Value, event) {
            var obj = this;

            var $element = this.GetElemnt();
            //var $inputEle = $element.find("input");
            var $inputEle;
            //if (hi5.WTS_MODE == WTS_TYPE.MTS)
            //    $inputEle = $element.find("span");
            //else
                $inputEle = $element.find("input");

            var $downEle = $element.find(".spinBoxDown");
            var $upEle = $element.find(".spinBoxUp");
            if(propName == "maxrange"){
                if (!hi5.isString(Value)) Value = Value.toString();
                if (Value != "") {
                    this.maxrange = Value;
                }
            }
            else if (propName == "caption" || propName == "value") {
                //if (!hi5.isString(Value)) return;  // undefined, NAN 처리 
                if (!hi5.isString(Value)) Value = Value.toString();
                if (Value != "") {
                    Value = Value.removeAll(",");
                    var p = Value.split(".");
                    if (obj.basecurr == "KRW" && obj.datastyle == 20) {
                        if (parseInt(Value) > 0 && parseInt(Value) < 100) {
                            if (p[1]) {
                                p[1] += "00";
                                Value = p[0] + "." + p[1].substring(0, 2);
                            }
                            else {
                                Value = p[0] + ".00";
                            }
                        }

                        if (0 > parseFloat(Value)) Value = 0;
                    }
                    else {
                        if (p[1]) {
                            var precision = obj.precision;
                            if (obj.basecurr == "KRW" && obj.datastyle == 19) {
                                precision = 4;
                            }
                            var dec = p[1].substring(0, precision);
                            if (precision == 0)
                                Value = p[0];
                            else
                                Value = p[0] + "." + dec;
                        }

                        //if (0 > parseFloat(Value)) Value = 0;

                        //Value = putThousandsSeparators(Value, ",");
                    }
                }

                //var spinEle = document.getElementById(this.id);
                //spinEle.getElementsByClassName('spinBoxText')[0].value = Value;
                if (hi5.GetMobile_info() != 'I') {
                    Value = putThousandsSeparators(Value, ",");
                } else {
                    Value = Value.toString();
                }
                //if (hi5.WTS_MODE == WTS_TYPE.MTS)
                //    $inputEle[0].innerText = Value;
                //else
                    $inputEle[0].value = Value;
                
                if(propName == "value" && event){
                    if (obj.OnSpinChange)
                        obj.OnSpinChange.call(obj);
                }
            }
            else if (propName == "tabindex" || propName == "placeholder") {
                $inputEle.attr(propName, Value);
            }
            else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
                if (propName == "disabled") {
                    this.Disabled(Value);
                    //$inputEle.attr(propName, Value);
                    //$downEle.attr(propName, Value);
                    //$upEle.attr(propName, Value);
                    //if (Value == true) {
                    //    $("#" + this.id + " .spinBoxText").css("cursor", "not-allowed");
                    //    $("#" + this.id + " .spinBoxUp").css("cursor", "not-allowed");
                    //    $("#" + this.id + " .spinBoxDown").css("cursor", "not-allowed"); 
                    //    $("#" + this.id + " .spinUnit").css("cursor", "not-allowed");
                    //}
                    //else {
                    //    $("#" + this.id + " .spinBoxText").css("cursor", "pointer");
                    //    $("#" + this.id + " .spinBoxUp").css("cursor", "pointer");
                    //    $("#" + this.id + " .spinBoxDown").css("cursor", "pointer");
                    //    $("#" + this.id + " .spinUnit").css("cursor", "pointer");
                    //}
                }
            }
        },
        /// <member id="SetFocus" kind="method">
        /// <summary>해당 컨트롤 focus 주기</summary>
        /// <remarks>해당 컨트롤 focus 주기</remarks>
        /// </member>
        SetFocus: function () {
            var $element = this.GetElemnt();
            var $inputEle = $element.find("input");

            $inputEle.focus();
            $inputEle.select();
        },
        /// <member id="SetBaseCode" kind="method">
        /// <summary>스핀컨트롤에 종목코드를 지정하여 해당 속성별로 표시</summary>
        /// <remarks>datastyle의 속성을 사용하고자 하면 종목코드가 필수</remarks>
        /// <param name = "jmcode" type="string"> 종목코드 </param>
        /// <example><![CDATA[
        ///            //종목코드 세팅 - 종목변경될때
        ///         function jmc_1.OnCodeChange(strCode) {
        ///             spn_1.SetBaseCode(strCode);
        ///         }
        /// ]]></example>
        /// </member>
        SetBaseCode: function (jmcode) {
            //this.basecode = jmcode;
            this.basecurr = hi5.GetCodeInfo(jmcode, { itemname: "base_currency_co" });
            this.code = jmcode;
            if (this.datastyle == 19) { //가상화폐 수량
                this.tickdata = "0.00000001";
                this.minrange = "0.0001";
                this.maxrange = "99999999999";
                this.precision = 8;
                this.nothousands = "0";

                //최소매매수량은 마스터에 있는 정보로 셋팅함..
                var minordervol = hi5.GetCodeInfo(jmcode, { itemname: "min_order_volume" });
                var minorderdanwi = hi5.GetCodeInfo(jmcode, { itemname: "qty_danwi" });
                if (minordervol && minordervol != "") {
                    var minvalue = Number(minordervol).toFixed(minorderdanwi).toString();
                    this.minrange = minvalue;
                    this.tickdata = minvalue;
                    this.precision = hi5.GetCodeInfo(jmcode, { itemname: "qty_danwi" });
                    /*if (hi5.GetCodeInfo(jmcode, { itemname: "base_currency_co" }) == "FUT") {
                        var minorderdanwi = hi5.GetCodeInfo(jmcode, { itemname: "prc_danwi" });
                        var masterObj = hi5.GetCodeInfo(jmcode);
                        this.tickdata = parseFloat(masterObj.priceunit).toFixed(minorderdanwi);
                        this.minrange = (parseFloat(masterObj.priceunit)).toString();
                        this.maxrange = "9999999999";
                        this.precision = parseInt(masterObj.prc_danwi);
                        this.nothousands = "0";
                    }*/

                }
                //var placeholderText = $hi5_regional.spin.minQty + " " + this.minrange;

                //this.SetProp("placeholder", placeholderText);

                //this.SetProp("value", "");
            }
            else if (this.datastyle == 20) {    //가상화폐 가격
                var minorderdanwi = hi5.GetCodeInfo(jmcode, { itemname: "prc_danwi" });
                var masterObj = hi5.GetCodeInfo(jmcode);
                this.tickdata = parseFloat(masterObj.priceunit).toFixed(minorderdanwi);
                this.minrange = (parseFloat(masterObj.priceunit)).toString();
                this.maxrange = "9999999999";
                this.precision = parseInt(masterObj.prc_danwi);
                this.nothousands = "0";

                //if (this.basecurr == "BTC" || this.basecurr == "ETH") {
                //    this.tickdata = "0.00000001";
                //    this.minrange = "0.0001";
                //    this.maxrange = "9999";
                //    this.precision = 8;
                //    this.nothousands = "0";
                //}

                //this.SetProp("value", "");
            }
            else if (this.datastyle == 21) {
                this.tickdata = "10000";
                this.minrange = "0";
                this.maxrange = "999999999999";
                this.precision = 0;
                this.nothousands = "0";

                if (this.basecurr == "BPX" || this.basecurr == "BTC" || this.basecurr == "ETH" || this.basecurr == "USDT" || this.basecurr =="FUT") {
                    //this.tickdata = "0.0005";
                    this.tickdata = "0.00000001";
                    this.minrange = "0.00000001";
                    this.maxrange = "999999999999";
                    this.precision = 8;
                }
            }
            else {  //기본
                if (this.basedata) this.SetProp("value", this.basedata);    //초기값
            }
        },
        MoveTick: function (up) {
            var value = this.GetProp("value");
            var tickUnit = 0.01;
            if (!this.tickdata) {
                if (value >= 1000000) {
                    tickUnit = 1000;
                }
                else if (value >= 500000 && value < 1000000) {
                    tickUnit = 1000;
                    if (value == 100000 && !up) tickUnit = 500;
                }
                else if (value >= 100000 && value < 500000) {
                    tickUnit = 500;
                    if (value == 100000 && !up) tickUnit = 100;
                }
                else if (value >= 50000 && value < 100000) {
                    tickUnit = 100;
                    if (value == 50000 && !up) tickUnit = 50;
                }
                else if (value >= 10000 && value < 50000) {
                    tickUnit = 50;
                    if (value == 10000 && !up) tickUnit = 10;
                }
                else if (value >= 5000 && value < 10000) {
                    tickUnit = 10;
                    if (value == 5000 && !up) tickUnit = 5;
                }
                else if (value >= 1000 && value < 5000) {
                    tickUnit = 5;
                    if (value == 1000 && !up) tickUnit = 1;
                }
                else if (value >= 100 && value < 1000) {
                    tickUnit = 1;
                    if (value == 100 && !up) tickUnit = 0.1;
                }
                else if (value >= 10 && value < 100) {
                    tickUnit = 0.1;
                    if (value == 10 && !up) tickUnit = 0.01;
                }
                else {
                    tickUnit = 0.01;
                }
            }
            else {
                tickUnit = this.tickdata;
            }

            // 2019.11.13 kws
            // 큰 숫자때 소수점 계산이 제대로 안되는 현상 수정
            var inputVs = value.toString().split(".");      // 입력값을 정수부랑 소수부랑 나눈다.
            var tickVs = tickUnit.toString().split(".");    // tick단위를 정수부랑 소수부랑 나눈다.

            var inputV0 = inputVs[0] || 0;   // 입력값 정수부
            var inputV1 = inputVs[1] || 0;   // 입력값 소수부

            var tickV0 = tickVs[0] || 0;    // 이동값 정수부 
            var tickV1 = tickVs[1] || 0;    // 이동값 소수부

            var val0, val1;     // 최종 계산된 정수부, 소수부
            var upInt, downInt; // 정수부 올림, 내림 여부

            var tickDecimals = 0;
            var useDecimals = 0;    //tick과 value의 소숫점 자리수 중에 더 큰 수
            if(inputV1 != 0 || tickV1 != 0)
                useDecimals = tickDecimals > inputV1.toString().length ? tickDecimals : inputV1.toString().length;
            if(tickVs[1]){  // 만약에 tick단위가 소수점을 포함하고 있으면 입력값의 소수부도 해당 길이 만큼 곱해줘야한다.
                tickDecimals = tickVs[1].toString().length;
                if(tickDecimals > 0){
                    inputV1 = parseInt(inputV1) * Math.pow(10, tickDecimals - inputV1.toString().length);
                    if(parseInt(tickVs[1]) != 0 && inputV1 == 0 && !up){    // 빼기일 때 소수점 자리수가 넘어가는 경우 정수부에서 1을 뺀다.
                        inputV1 = hi5.RPAD("1", tickDecimals + 1, "0");
                        downInt = true;
                    }
                }

                if(up){ // 더하기일 때 소수점 자리수가 넘어가는 경우 정수부에서 1을 더한다.
                    val1 = parseInt(tickV1) + parseInt(inputV1);
                    if(val1.toString().length > tickDecimals){
                        upInt = true;
                        val1 = hi5.RPAD("0", tickDecimals, "0");
                    }
                }
                else{
                    val1 = parseInt(inputV1) - parseInt(tickV1);
                }
                val1 = hi5.LPAD(val1, tickDecimals, "0");
            }

            if(up){
                val0 = parseInt(inputV0) + parseInt(tickV0);
                if(upInt) val0 += 1;
            }
            else{
                val0 = parseInt(inputV0) - parseInt(tickV0);
                if(downInt) val0 -= 1;
            }

            if(useDecimals){
                value = val0 + "." + val1;
            }
            else{
                value = val0;
            }

            if(parseFloat(value) > parseFloat(this.maxrange))
                value = this.maxrange;
            
            if(parseFloat(value) < parseFloat(this.minrange))
                value = this.minrange;

            if (this.datastyle == "20" || this.datastyle == "19" || this.datastyle == "21") {
                if (parseFloat(value) < 0) return;
            }
            // else{
            //     if(parseFloat(value) > parseFloat(this.maxrange))
            //         value = this.maxrange;
                
            //     if(parseFloat(value) < parseFloat(this.minrange))
            //         value = this.minrange;
            // }
            this.SetProp("value", value);




            /*var tickDecimals = 0;   //tick의 소숫점 자리수
            var valDecimals = 0;    //value의 소숫점 자리수
            var useDecimals = 0;    //tick과 value의 소숫점 자리수 중에 더 큰 수
            if (tickUnit) {
                //tickUnit = this.tickdata;
                var t = tickUnit.toString().split(".");
                if (t[1]) {
                    tickDecimals = t[1].length;
                }
            }

            var t2 = value.toString().split(".");
            if (t2[1]) {
                valDecimals = t2[1].length;
            }
            useDecimals = tickDecimals > valDecimals ? tickDecimals : valDecimals;
            if (useDecimals > 0) {
                var tickVal = "0";
                if (t[1]) {
                    tickVal = t[1];
                }
                tickUnit = t[0] + "." + hi5.RPAD(tickVal, useDecimals, "0");

                var valVal = "0";
                if (t2[1]) {
                    valVal = t2[1];
                }
                value = t2[0] + "." + hi5.RPAD(valVal, useDecimals, "0");
            }
            //tickUnit = parseFloat(tickUnit.toString().replace(/\./g, ''));
            //value = parseFloat(value.toString().replace(/\./g, ''));
            if (isNaN(value)) value = 0;

            if (up) {
                value = value + tickUnit;
            }
            else {
                value = value - tickUnit;
            }

            if ((this.datastyle == "20")
                && this.basecurr != "BTC"
                && this.basecurr != "ETH") {
                var remainer = value % tickUnit;
                value = value - remainer;
            }

            if (this.datastyle == "20" || this.datastyle == "19" || this.datastyle == "21") {
                if (parseFloat(value) < 0) value = 0;
            }
            value = value.toString();

            var minus = "";
            if (value.indexOf('-') > -1) {
                minus = "-";
                value = value.substring(1);
            }

            if (useDecimals > 0) {
                if (value.length <= useDecimals) {
                    value = "0." + hi5.LPAD(value, useDecimals, 0);
                }
                else {
                    if (this.basecurr == "KRW" && this.datastyle == 20) {
                        var pValue = parseInt(value.substring(0, value.length - useDecimals));
                        if (pValue < 100) {
                            value = value.substring(0, value.length);
                        }
                    }

                    value = value.substring(0, value.length - useDecimals) + "." + value.substring(value.length - useDecimals, value.length);
                }
            }

            value = minus + value;

            if (this.basecurr == "KRW" && this.datastyle == 20) {
                var pValue = parseInt(value);
                var p = value.split(".");
                if (p[1]) {
                    if (pValue < 100) {
                        if (p[1].length < 2) p[1] += "0";
                        value = p[0] + "." + p[1].substring(0, 2);
                    }
                    else {
                        value = p[0];
                    }
                }
            }

            if (this.datastyle == "0" && (parseFloat(value) > this.maxrange || parseFloat(value) < this.minrange)) return;
            this.SetProp("value", value);*/
        },
        SetOptions: function (option) {
            if (option) {
                if (option.unit) {
                    var $elem = this.$html;
                    //this.unit = option.unit;
                    var $unit = $elem.children('.spinUnit');
                    if ($unit.length > 0) {
                        $unit.html(option.unit);
                        //var unitWidth = $unit.width();
                        var unitWidth = 32;
                        if (option.unit.length > 3) {   //자릿수가 3자리 초과되는 종목들이 생김
                            if (option.unit.length > 4) {   //자릿수가 3자리 초과되는 종목들이 생김
                                unitWidth += 33;
                            }
                            else
                                unitWidth += 7;
                        } 
                        $unit.css("width", unitWidth + "px");

                        var $input = $elem.children('.spinBoxText');
                        //var labelW = $elem.children('.spinLabel').width();
                        var labelW = 0;
                        //var spinUpW = $elem.children('.spinBoxUp').outerWidth() || 0;
                        //var spinDownW = $elem.children('.spinBoxDown').outerWidth() || 0;

                        // 2020.03.10 kws
                        // +, - 버튼이 안보일때를 고려 해야함.
                        var spinUpW = $elem.children('.spinBoxUp').css("display") == "none" ? 0 : $elem.children('.spinBoxUp').outerWidth();
                        var spinDownW = $elem.children('.spinBoxDown').css("display") == "none" ? 0 : $elem.children('.spinBoxDown').outerWidth();

                        var tWidth = labelW + unitWidth + spinUpW + spinDownW + 5;
                        $input.css({ width: 'calc(100% - ' + tWidth + 'px)' });
                        //if (hi5.WTS_MODE == WTS_TYPE.MTS)
                        //    $input.css({ width: 'calc(100% - 134px)' });
                        //else {
                        //    if (this.class.indexOf("totaltrade2") > -1) {
                        //        $input.css({ width: 'calc(100% - ' + tWidth + 'px)' });
                        //    }
                        //    else {
                        //        $input.css({ width: 'calc(100% - 140px)' });
                        //    }
                        //}
                    }
                }

                if (option.label) {
                    var $elem = this.$html;
                    //this.label = option.label;
                    var $label = $elem.children('.spinLabel');
                    if ($label.length > 0) {
                        $label.html(option.label);
                        var unitWidth = 32;
                        if (option.unit.length > 3) {   //자릿수가 3자리 초과되는 종목들이 생김
                            unitWidth += 20;
                        }

                        var $input = $elem.children('.spinBoxText');
                        var labelW = 42;
                        var spinUpW = $elem.children('.spinBoxUp').outerWidth() || 0;
                        var spinDownW = $elem.children('.spinBoxDown').outerWidth() || 0;

                        var tWidth = labelW + unitWidth + spinUpW + spinDownW + 5;
                        $input.css({ width: 'calc(100% - ' + tWidth + 'px)' });
                        //if (hi5.WTS_MODE == WTS_TYPE.MTS)
                        //    $input.css({ width: 'calc(100% - 134px)' });
                        //else {
                        //    if (this.class.indexOf("totaltrade2") > -1) {
                        //        $input.css({ width: 'calc(100% - 100px)' });
                        //    }
                        //    else {
                        //        $input.css({ width: 'calc(100% - 140px)' });
                        //    }
                        //}
                    }
                }
            }
        },

        // disabled 됐을때 동작(css disabled 동일)
        Disabled: function (state) {
            if (state == undefined) return;

            var propName = "disabled";
            var $element = this.GetElemnt();
            var $inputEle;
            //if (hi5.WTS_MODE == WTS_TYPE.MTS)
            //    $inputEle = $element.find("span");
            //else
                $inputEle = $element.find("input");

            var $buttonEle = $element.find("div");
            //var $downEle = $element.find(".spinBoxDown");
            //var $upEle = $element.find(".spinBoxUp");

            if (state == true || state == "true" || state == "disabled") {
                $inputEle.attr(propName, propName);
                $buttonEle.attr(propName, propName);
                //$downEle.attr(propName, propName);
                //$upEle.attr(propName, propName);
                $("#" + this.id + " *").css("cursor", "not-allowed");
                $("#" + this.id + " .spinBoxUp").css("display", "none");
                $("#" + this.id + " .spinBoxDown").css("display", "none");

                //$("#" + this.id + " .spinBoxText").css("cursor", "not-allowed");
                //$("#" + this.id + " .spinBoxUp").css("cursor", "not-allowed");
                //$("#" + this.id + " .spinBoxDown").css("cursor", "not-allowed");
                //$("#" + this.id + " .spinUnit").css("cursor", "not-allowed");
            }
            else {
                $inputEle.removeAttr(propName);
                $buttonEle.removeAttr(propName);
                //$downEle.removeAttr(propName);
                //$upEle.removeAttr(propName);
                $("#" + this.id + " *").css("cursor", "pointer");
                $("#" + this.id + " .spinBoxText").css("cursor", "");
                $("#" + this.id + " .spinBoxUp").css("display", "block");
                $("#" + this.id + " .spinBoxDown").css("display", "block");
                //$("#" + this.id + " .spinBoxUp").css("cursor", "pointer");
                //$("#" + this.id + " .spinBoxDown").css("cursor", "pointer");
                //$("#" + this.id + " .spinUnit").css("cursor", "pointer");
            }
        }
        /* events */
        /// <member id="OnSpinChange" kind="event" default="true">
        /// <summary>스핀으로 인하여 값이 변경되는 경우 발생되는 이벤트</summary>
        /// <remarks>스핀으로 인하여 값이 변경되는 경우 발생되는 이벤트</remarks>
        /// <example>example
        /// </example>
        /// </member>
        //spin.prototype.OnSpinChange = function () {
        //    var fn = this.objParentForm.getIsEventName(this.id, "OnSpinChange");
        //    if (fn != null) fn();
        //}

        /// <member id="OnTooltipContent" kind="event" default="true">
        /// <summary>스핀으로 툴팁 값이 변경되는 경우 발생되는 이벤트</summary>
        /// <remarks>스핀으로 툴팁 값이 변경되는 경우 발생되는 이벤트</remarks>
        /// <example>example
        /// </example>
        /// </member>
        //spin.prototype.OnTooltipContent = function () {
        //    var fn = this.objParentForm.getIsEventName(this.id, "OnTooltipContent");
        //    if (fn != null) fn();
        //}
    }
    spin.ctlName = "spin";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(spin.ctlName, spin);
    return spin;
}());
