//label.js
(function () {
    'use strict';

    var label = function () {
        this.itemflag = "1";
        this.value = "";
        this.mask = "";
        this.attricolor = "0";
    }

    // ctrl default style properties
    label.prototype = {
        propertyLoad : function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_label"],
                style = [],
                attr = { id: "", disabled: "" },
                dataCell = "";

            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            var objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                // CDDATA 정보를 포함한 속성명 지정(Label => multi_lang 사용)
                return ["multi_lang"];
            });

            // stylecolor 정보를 객체로 변환한다(String->JSON)
            if (objXML.stylecolor)
                this.styleColor = x2h.defaultStyle(objXML.stylecolor, false);

            //class 지정
            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            if (objXML.multi_lang) {
                dataCell = x2h.xmlGetMultiLangText(objXML.multi_lang, "caption");
                if (dataCell != "" )
                    dataCell = x2h.getMultiLineText(dataCell);
            }

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);

            var fragment = document.createDocumentFragment(),
            subEle = fragment.appendChild(document.createElement("div"));
            xmlHolderElement.appendChild(subEle);

            var div = fragment.appendChild(document.createElement("div"));
            subEle.appendChild(div);

            style = "";
            var attri = ["vertical-align", "text-align"];
            attri.forEach(function (key) {
                if (objXML[key]) {
                    style += (key + ':' + objXML[key] + ';');
                }
            })

            if (style != "") {
                div.setAttribute('style', style);
            }
            div.innerHTML = dataCell;

            this.mask = maskstr.GetMaskInfo(node);
            this.value = dataCell;

            if (objXML.disabled) {
                this.Disabled(true);
            }
        },
        onInitAfter : function () {
            var obj = this, $self = this.$html;
            var elem = $self[0];

	        var newValue = maskstr.GetMaskValue(this.mask, this.value);
	        $self.attr("value", newValue);

	        if (obj.OnClick) {
	            hi5.on(elem, "click", function () {
	                if (!$self.attr("disabled")) {
	                    obj.OnClick.call(obj);
	                }
                });
	        }

	        // double click
	        if (obj.OnDblClick) {
	            hi5.on(elem, "dblclick", function () {
	                if (!$self.attr("disabled")) {
	                    obj.OnDblClick.call(obj);
	                }
	            });
	        }

            // caption change
	        
        },
        change: function () {
            var obj = this, $self = this.$html;
            if (!$self.attr("disabled")) {
                if (obj.attricolor == "1") {
                    $self.removeClass('up_txt');
                    $self.removeClass('low_txt');
                    var value = $self.attr("value");
                    if (parseFloat(value) > 0) $self.addClass('up_txt');
                    else if (parseFloat(value) < 0) $self.addClass('low_txt');
                }

                if (obj.OnChange)
                    obj.OnChange.call(obj);
            }
        },
        // HTML 요소객체 취득
        GetElemnt : function () {
	        return this.$html;
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
            var $elem = this.GetElemnt();
            return $elem[0].children[0].children[0]; // 데이터 요소 <div><div><div> ~</div></div></div>
        },

        // disabled 됐을때 동작(css disabled 동일)
        Disabled : function (state) {
            if (state == undefined) return;
            var cssstyle = {};
            if (state == true || state == "disabled" || state == "true") {
                cssstyle = hi5.getCustomStyle(this, "disable");
            }
            else {
                cssstyle = hi5.getCustomStyle(this, "default");
            }

            if (cssstyle)
                this.$html.css(cssstyle);
        },
        /// <member id="GetStyle" kind="method">
        /// <summary>스타일 정보를 취득하는 함수</summary>
        /// <remarks>스타일명으로 모든 스타일을 취득하는 함수 </remarks>
        /// <param name = "style" type="string|object"> 스타일 정보</param>
        /// <returns type="string|object"> 스타일 정보를 반환</returns>
        /// </member>
        GetStyle :function (style) {
            var $element = this.$html, val = "";
	        if ($element.length > 0) {
	            val = $element.css(style);
	        }
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
            var $element = this.$html;
	        if ($element.length > 0) {
	            var childelement = this.GetDataElement();
	            if (typeof (style) === "object") {
	                $element.css(style);

	                var styles = Object.keys(style);
	                for (var x = 0; x < styles.length; x++) {
	                    var propname = styles[x];
	                    //var textAlign, verticalAlign;
	                    if (propname == "text-align" || propname == "textAlign" || propname == "vertical-align" || propname == "verticalAlign") {
	                        $(childelement).css(propname, style[propname]);
	                    }
	                }
	            }
	            else {
	                $element.css(style, value);

	                if (style == "text-align" || style == "textAlign" || style == "vertical-align" || style == "verticalAlign") {
	                    $(childelement).css(style, value);
	                }
	            }
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
            var $element = this.GetElemnt(), val = "";
            var childEle = this.GetDataElement();
            if ($element.length > 0) {
                if (propName == "caption" || propName == "btcaption") {
                    var $span = $element.find('span');
                    if ($span.length > 0) {
                        val = $span[0].textContent;
                    }
                    else {
                        val = childEle.textContent;
                    }
                }
	            else {
	                val = $element.attr(propName);
	            }
	        }
	        return val;
        },
        /// <member id="SetProp" kind="method">
        /// <summary>속성 정보를 변경하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 제어하는 함수</remarks>
        /// <param name = "propName" type="string"> 스타일 정보</param>
        /// <param name = "value" type="string"> 셀 아이템명</param>
        /// </member>
        SetProp : function (propName, Value, edit) {
            var $element = this.$html;
            var childEle = this.GetDataElement();
            if (propName == "caption" || propName == "value") {
                var newValue = maskstr.GetMaskValue(this.mask, Value);
                var preval = $element.attr("value");
	            if (preval != newValue) {
	                $element.attr("value", Value);
	                childEle.innerHTML = newValue;
	                // if (edit != false)
	                //     this.change();
                }
                // bispex 거래소에서 선물과 보험종목이 같을경우, 스크립트에서 쓸대없는 ""값을 setprop했다가, 다시 코드를 주는 현상이 있어서 풀고 테스트 해봄..
                if (edit != false)
                    this.change();
	        } else if (propName == "btcaption") {
	            var obj = Value;
	            if (obj.symbol != "" && obj.name != "") {
	                var cls = "icon_" + hi5.GetCodeInfo(obj.symbol, {itemname : "code_only"}) + " icon_default label_icon_symbol";
	                childEle.innerHTML = "<div class='" + cls + "'></div><span style='word-break: break-all;'> " + obj.name + "</span>";
	            } else {
	                childEle.innerHTML = obj.name;
	            }
	        }
	        else if (propName == "mask") {
	            var keylist = Object.keys(Value);
	            if (keylist.length > 0) {
	                for (var x = 0; x < keylist.length; x++) {
	                    this.mask[keylist[x]] = Value[keylist[x]];
	                }
	            }
            }
            else if (propName == "icon") {
                var obj = Value;
                $(childEle).children().remove();
                if(obj && obj.iconClass){
                    var innerText = childEle.innerHTML + '<i style="margin-left:10px" class="' + obj.iconClass + '"></i>';
                    childEle.innerHTML = innerText;
                }
            }
	        else {
	            typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
	            if (propName == "disabled") {
	                this.Disabled(Value);
	            }
	        }
        },
        OnGetData : function (value) {
	        this.SetProp("caption", value);
        },
        /* events */
        /// <member id="OnClick" kind="event">
        /// <summary>마우스 클릭시 발생되는 이벤트</summary>
        /// <remarks>마우스 클릭시 발생되는 이벤트</remarks>
        /// <example>lb_1.OnClick();
        /// </example>
        /// </member>
	    //label.prototype.OnClick = function () {
	    //    var fn = this.objParentForm.getIsEventName(this.id, "OnClick");
	    //    if (fn != null) fn();
	    //}

        /// <member id="OnDblClick" kind="event">
        /// <summary>마우스 더블클릭시 발생되는 이벤트</summary>
        /// <remarks>마우스 더블클릭시 발생되는 이벤트</remarks>
        /// <example>lb_1.OnDblClick();
        /// </example>
        /// </member>
	    //label.prototype.OnDblClick = function () {
	    //    var fn = this.objParentForm.getIsEventName(this.id, "OnDblClick");
	    //    if (fn != null) fn();
	    //}

        /// <member id="OnChange" kind="event" default="true">
        /// <summary>내용이 변경되었을 때 발생되는 이벤트</summary>
        /// <remarks>내용이 변경되었을 때 발생되는 이벤트</remarks>
        /// <example>lb_1.OnChange();
        /// </example>
        /// </member>
	    //label.prototype.OnChange = function () {
	    //    var fn = this.objParentForm.getIsEventName(this.id, "OnChange");
	    //    if (fn != null) fn();
	    //}
    }

    // autosave
	//label.prototype.AutoSaveCtrl = function () {
	//    return "";
	//}

    
    label.ctlName = "label";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(label.ctlName, label);
	return label;
}());
