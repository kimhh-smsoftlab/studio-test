//radio.js
(function () {
    'use strict';

    var radio = function () {
        this.class = [];
        this.itemcount = 0;
        this.dispstyle = 0;
        this.selectindex = 0;
        this.direction = "0";
        this.disabled = "0";
        this.customtooltip = {};
        this.itemflag = "1";
    }

    radio.prototype = {
        propertyLoad: function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_radio"], // 클래스 정보명 
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "" }, // HTML Attri 정의하는 정보 설정
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
                    return ["multi_lang"];
                });
            }

            // stylecolor 정보를 객체로 변환한다(String->JSON)
            if (objXML.stylecolor)
                this.styleColor = x2h.defaultStyle(objXML.stylecolor, false);

            if (this.dispstyle == "1") cls.push("radio-image");
            else if (this.dispstyle == "2") cls.push("radio-checkbox");
            else if (this.dispstyle == "3") cls.push("radio-button");
            else if (this.dispstyle == "4") cls.push("radio-tab");

            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);

            if (objXML.customcolor)
                this.customColor = x2h.defaultStyle(objXML.customcolor, false);

            var radio_item = node.getElementsByTagName("radio_item");
            var radio_itemLen = radio_item.length;
            if (radio_item != undefined) {
                if (this.dispstyle == "4") {
                    xmlHolderElement.setAttribute("cursel", this.selectindex);
                }
                else{
                    var fragment = document.createDocumentFragment(),
                    tableEle = fragment.appendChild(document.createElement("table"));
                    xmlHolderElement.appendChild(tableEle);
                    var trEle = document.createElement("tr");
                    tableEle.appendChild(trEle);
                }
                //radio item 구성
                var indexNum = 0;
                for (var x = 0; x < radio_itemLen; x++) {
                    this.createItem(radio_item[x], trEle, tableEle, xmlHolderElement, x);
                    indexNum++;
                }

                if (this.dispstyle == "4") {
                    var divEle = document.createElement("div");
                    xmlHolderElement.appendChild(divEle);

                    divEle.className = "empty";
                    var emptyWidth = indexNum * 215;
                    divEle.style.width = "calc(100% - " + emptyWidth + "px)";
                }

                this.onEventBind();
            }
        },

        onEventBind: function () {
            // 도움말 툴팁기능
            // 클래스명으로 검색
            //debugger;
            var obj = this, $elem = this.$html, $tp;
            if (!hi5.isEmpty(obj.customtooltip)) {
                if( obj.$html.find("td").length > 0 ){
                    for(var i = 0; i < obj.$html.find("label").length; i++){
                        //debugger;
                        $tp = $(obj.$html.find("label")[i]);
                        $tp.addClass("hi5-c-ui-tooltip tooltipWrapper");
                        // 일괄처리하는 경우 속성만 적용을 한다.
                        if (this.customtooltip.attr) {
                            var objCustomTooltip = hi5.clone(obj.customtooltip.attr);
                            objCustomTooltip["tooltip-data"] = objCustomTooltip["tooltip-data"] + "_" + i;
                            x2h.setAttriCustomToolTip($tp, objCustomTooltip);
                            x2h.setAttriCustomToolTip($tp, { "tp-form": obj.objParentForm.id, "tp-target": obj.id });
                        }
                    }
                }   
                obj.customtooltip = null;
            }

            $elem.on("change", "input", function (event, data) {
                event.stopPropagation();

                var ctrl = this;
                if (typeof (ctrl) == 'undefined' || ctrl.id == "") {
                    return;
                }

                var id = ctrl.id;
                var name = ctrl.name;
                var value = ctrl.value;

                var $optionSelected = $("#" + name + " input[type=radio]:checked");
                var $radio = $("#" + name + " input[type=radio]");
                var indexSelected = $radio.index($optionSelected);
                obj.selectindex = indexSelected; 
                $("#" + name + " label").removeClass("select_radio");
                $($radio[indexSelected].parentElement).addClass('select_radio');
                if (obj.dispstyle != "0") {
                    if (obj.dispstyle == "3") {
                        if (obj.direction == "1")
                            $("#" + name).find('tr').removeClass("selected");
                        else
                            $("#" + name).find('td').removeClass("selected");

                        $("#" + name).find('span').removeClass("selectedSpan");

                        for (var x = 0; x < obj.itemcount; x++) {
                            if (indexSelected == x) {
                                if (obj.direction == "1") {
                                    $(this).closest("tr").addClass("selected");
                                }
                                else {
                                    $(this).closest("td").addClass("selected");
                                }
                                $(this).closest("td").find("span").addClass("selectedSpan");
                            }
                        }
                    }
                    else {
                        var cssstyle = { "background-color": "", "color": "", "border-color": "" };
                        if (obj.direction == "1")
                            $("#" + name).find('tr').css(cssstyle);
                        else
                            $("#" + name).find('td').css(cssstyle);

                        for (var x = 0; x < obj.itemcount; x++) {
                            if (indexSelected == x) {
                                var cssstyle = hi5.getCustomStyle(obj, "active");
                                if (cssstyle) {
                                    if (obj.direction == "1") {
                                        $(this).closest("tr").css(cssstyle);
                                    }
                                    else {
                                        $(this).closest("td").css(cssstyle);
                                    }
                                }
                            }
                        }
                    }
                }

                if (obj.OnChange)
                    obj.OnChange.call(obj, indexSelected);
            });

            $elem.on("click", ".subTab", function (event, data) {
                event.stopPropagation();

                if ($(this).hasClass("clicked")) {
                    return;
                }
                $("#" + obj.id + " .subTab").removeClass("clicked");
                $(this).addClass("clicked");

                var index = $(this).attr("index");
                obj.selectindex = index; 
                $(this).parent("div").attr("cursel", index);
                if (obj.OnChange)
                    obj.OnChange.call(obj, index);
            });
        },

        //radio item 구성
        createItem: function (radio_item, trEle, tableEle, xmlHolderElement, index) {
            var that = this,
                cls = [], // 클래스 정보명 
                style = [],           //  Style, 색정보용 Style  정보
                attr = {}; // HTML Attri 정의하는 정보 설정

            // var objXML = x2h.getXML2Control(radio_item, null, attr, cls, style, function (type) {
            //     return ["multi_lang"];
            // });
            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            // var objXML = x2h.getXML2Control(node, this, attr, cls, style);
            var objXML;
            if (x2h.getXML2JSON) {
                objXML = x2h.getXML2JSON(radio_item, this, attr, cls, style, function (type) {
                    return [];
                });
            } else {
                // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
                objXML = x2h.getXML2Control(radio_item, this, attr, cls, style, function (type) {
                    // CDDATA 정보를 포함한 속석명 지정
                    return ["multi_lang"];
                });
            }
            
            var caption = "";
            if (objXML.multi_lang) {
                caption = x2h.xmlGetMultiLangText(objXML.multi_lang, "caption");
            }

            if (this.dispstyle == "4") {
                var divEle = document.createElement("div");
                xmlHolderElement.appendChild(divEle);

                divEle.className = "subTab";
                if (this.selectindex == index) {
                    divEle.className += " clicked";
                }
                if (this.class.indexOf("totaltrade2") > -1) {
                    style = "width:" + objXML.width + ";";
                }
                divEle.setAttribute("style", style);
                divEle.setAttribute("index", index);
                if(objXML.value) divEle.setAttribute("value", objXML.value);
                textNode = x2h.createTextNode(divEle, caption);
                divEle.appendChild(textNode);
            }
            else {
                if (this.direction == "1") {
                    trEle = x2h.createXmlElement(tableEle, "tr");
                    tableEle.appendChild(trEle);
                }
                var tdEle = document.createElement("td");
                trEle.appendChild(tdEle);

                if (style.length)
                    attr["style"] = style.join("");

                // HTML Attribute 속성 변환( Style, Attribute, Class)
                style = x2h.attri(tdEle, attr);

                if (this.direction == "1") {
                    style.height = objXML.height;
                }
                else{
                    style.width = objXML.width;
                }

                tdEle.setAttribute("index", index);
                tdEle.setAttribute("value", objXML.value);

                var labelEle = document.createElement("label");
                labelEle.for = "rdoinput_" + index + this.id;
                labelEle.id = "rdolabel_" + index + this.id;

                if (this.class.indexOf("spa_left_rdo") > -1) {
                    var spanEle = document.createElement("span");
                    tdEle.appendChild(spanEle);
                    if (this.selectindex == index) {
                        spanEle.className = "selectedSpan";
                    }
                    var spanStyle = "height:3px;width:" + objXML.width + ";top:0px;position:absolute";
                    spanEle.setAttribute("style", spanStyle);
                }
                tdEle.appendChild(labelEle);

                var inputEle = document.createElement("input");
                labelEle.appendChild(inputEle);
                inputEle.type = "radio";
                inputEle.id = "rdolabel_" + index + this.id;
                inputEle.name = this.id;
                inputEle.setAttribute("value", objXML.value);

                if (this.dispstyle != "0" && this.dispstyle != "3") {
                    var tagiEle = document.createElement("i");
                    labelEle.appendChild(tagiEle);
                }

                if (this.selectindex == index) {
                    x2h.xmlSetAttr(inputEle, "checked", "checked");
                    if (this.dispstyle != "0") {
                        if (this.dispstyle == "3") {
                            if (this.direction == "1")
                                trEle.className = "selected";
                            else
                                tdEle.className = "selected";
                        }
                        else {
                            var cssstyle = hi5.getCustomStyle(this, "active", true);
                            if (this.direction == "1")
                                trEle.setAttribute("class", cssstyle); //.style = cssstyle;
                            else
                                trEle.setAttribute("class", cssstyle); //tdEle.style = cssstyle;
                        }
                    }
                }
                if (objXML.disabled == "true" || this.disabled == "1") {
                    this.Disabled(true, index);
                }

                if (objXML.visibility == "hidden") labelEle.style.visibility = "hidden";

                var textNode = x2h.createTextNode(xmlHolderElement, caption);
                if (this.dispstyle == "3") {
                    var textDiv = document.createElement("div");
                    textDiv.appendChild(textNode);
                    labelEle.appendChild(textDiv);
                }
                else
                    labelEle.appendChild(textNode);
            }
        },

//        onInitAfter : function (option) {
            //get autosave
            //obj.GetAutoSave();
//        },

        // HTML 요소객체 취득
        GetElemnt : function () {
            return this.$html;
        },

        // disabled 됐을때 동작(css disabled 동일)
        Disabled : function (state, index) {
            if (state == undefined) return;
            var cssstyle = {};
            var $element = this.GetElemnt();
            if (index) {
                $element = $element.find("td[index=" + index + "]");
            }
            var $input = $element.find("input");
            var $label = $element.find("label");
            if (state == true || state == "disabled" || state == "true" || state == "1") {
                cssstyle = hi5.getCustomStyle(this, "disable");
                $input.attr("disabled", true);
                $label.attr("disabled", "true");
            }
            else {
                cssstyle = hi5.getCustomStyle(this, "default");
                $input.attr("disabled", false);
                $label.removeAttr("disabled");
            }

            if (cssstyle) {
                $element.css(cssstyle);
            }
        },

        AutoSaveCtrl : function () {
            return this.GetSelectedIndex();
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

            if (propName == "caption") {
                if (this.dispstyle == "4") {
                    var $optionSelected = $element.find(".clicked");
                    if ($optionSelected) {
                        val = $($optionSelected).text();
                    }
                }
                else {
                    var $optionSelected = $element.find("input[type=radio]:checked");
                    var $radio = $element.find("input[type=radio]");
                    var indexSelected = $radio.index($optionSelected);
                    var $labelEle = $element.find("label");
                    val = $labelEle[indexSelected].innerText;
                }
            }
            else if (propName == "value") {
                if (this.dispstyle == "4") {
                    var $optionSelected = $element.find(".clicked");
                    if ($optionSelected) {
                        val = $($optionSelected).attr("value");
                    }
                }
                else {
                    var $optionSelected = $element.find("input[type=radio]:checked");
                    var $radio = $element.find("input[type=radio]");
                    var indexSelected = $radio.index($optionSelected);
                    var $inputEle = $element.find("input");
                    val = $inputEle[indexSelected].value;
                }
            }
            else if (propName == "itemcount") {
                val = $element.find("table>tr")[0].children.length;
            }

            else if (propName == "selectindex") { //xml에서 가장 처음 선택된 버튼값
                val = this.selectIndex;
            }
            else if (propName == "floatstyle" || propName == "borderStyle" || propName == "opacity" || propName == "textAlign" || propName === "verticalAlign" || propName === "direction") {
                propName =
                    propName === "floatstyle" ? "float" :
                    propName === "borderStyle" ? "border" :
                    propName;

                val = this.GetStyle(propName);
            }
            else if (propName == "dispstyle") {
                val = this.dispstyle;
            }
                //	    else if (propName == "itemunit") {
                //	    }
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
                var $optionSelected = $element.find("input[type=radio]:checked");
                var $radio = $element.find("input[type=radio]");
                var indexSelected = $radio.index($optionSelected);
                var $labelEle = $element.find("label");
                $labelEle[indexSelected].innerText = Value;
            }
            else if (propName == "value") {
                var $tds = $element.find("td");
                if (Array.isArray(Value)) {
                    for (var x = 0; x < $tds.length; x++) {
                        if(Value[x])
                            $tds[x].setAttribute("value", Value[x]);
                    }
                }
                else {
                    for (var x = 0; x < $tds.length; x++) {
                        var radiovalue = $tds[x].getAttribute("value");
                        if (Value == radiovalue) {
                            var index = x;
                            this.SetRadioIndex(index, true);
                            break;
                        }
                    }
                }
            }
            else if (propName == "tabindex") {
                if (this.dispstyle == "3") {
                    var $labelEle = $element.find("label");
                    $labelEle[0].setAttribute(propName, Value);
                    //$("#rdolabel_0" + this.id).attr(propName, Value);
                }
                else {
                    if (this.dispstyle != "4") {
                        var $inputEle = $element.find("input");
                        $inputEle[0].setAttribute(propName, Value);
                        //$("#rdoinput_0" + this.id).attr(propName, Value);
                    }
                }
            }
            else if (propName == "itemcount") {
                val = $element.find("table>tr")[0].children.length;
            }

            else if (propName == "selectindex") { //xml에서 가장 처음 선택된 버튼값
                val = this.selectIndex;
            }
            else if (propName == "floatstyle" || propName == "borderStyle" || propName == "opacity" || propName == "textAlign" || propName === "verticalAlign" || propName === "direction") {
                propName =
                    propName === "floatstyle" ? "float" :
                    propName === "borderStyle" ? "border" :
                    propName;

                val = this.GetStyle(propName);
            }
            else if (propName == "dispstyle") {
                val = this.dispstyle;
            }
            else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
                if (propName == "disabled") {
                    this.Disabled(Value);
                }
            }
        },

        /// <member id="SetTitleChange" kind="method">
        /// <summary>키 값으로 Text를 변경하는 함수</summary>
        /// <remarks>키 값으로 Text를 변경하는 함수</remarks>
        /// <param name="strKey" type="string">키값</param>
        /// <param name="strTitle" type="string">표시문자</param>
        /// <returns type="number"> 해당 인덱스 </returns>
        /// <example>var index = rdo_1.SetTitleChange(strKey, strTitle);
        /// </example>
        /// </member>
        SetTitleChange : function (strKey, strTitle) {
            var $element = this.GetElemnt();
            var $inputEle = $element.find("input");
            var $titleEle = $element.find("label > div");
            var ret = -1;
            for (var x = 0; x < this.itemcount; x++) {
                var value = $inputEle[x].value;
                if (strKey == value) {
                    $titleEle[x].innerHTML = strTitle;
                    ret = x;
                    break;
                }
            }
            
            return ret;
        },

        /// <member id="GetItemTitle" kind="method">
        /// <summary>인덱스 또는 키 값으로 타이틀을 취득하는 기능</summary>
        /// <remarks>인덱스 또는 키 값으로 타이틀을 취득하는 기능</remarks>
        /// <param name="index" type="number">인덱스 값</param>
        /// <param name="strKey" type="string">키값</param>
        /// <returns type="string"> 해당 타이틀</returns>
        /// <example>var title = rdo_1.GetItemTitle(index, strKey);
        /// </example>
        /// </member>
        GetItemTitle : function (index, strKey) {
            var $element = this.GetElemnt();
            var $inputEle = $element.find("input");
            var $labelEle = $element.find("label");

            var ret = -1;
            if (index > -1) {
                ret = $labelEle[index].innerText;
            }
            else {
                for (var x = 0; x < this.itemcount; x++) {
                    var value = $inputEle[x].value;
                    if (strKey == value) {
                        ret = $labelEle[x].innerText;
                        break;
                    }
                }
            }

            return ret;
        },

        /// <member id="GetItemKey" kind="method">
        /// <summary>지정한 인덱스 값에 해당하는 키 반환하는 기능</summary>
        /// <remarks>지정한 인덱스 값에 해당하는 키 반환하는 기능</remarks>
        /// <param name="index" type="number">인덱스 값</param>
        /// <returns type="string"> 해당 Value </returns>
        /// <example>var key = rdo_1.GetItemKey(index);
        /// </example>
        /// </member>
        GetItemKey : function (index) {
            if (index == undefined) return;
            if (index < 0) return;

            var $element = this.GetElemnt();
            var $inputEle = $element.find("input");
            var $labelEle = $element.find("label");

            return $inputEle[index].value;
        },

        /// <member id="GetSelectedIndex" kind="method">
        /// <summary>현재 선택된 인덱스를 반환</summary>
        /// <remarks>현재 선택된 인덱스를 반환</remarks>
        /// <returns type="number"> 해당 인덱스 </returns>
        /// <example>var index = rdo_1.GetSelectedIndex();
        /// </example>
        /// </member>
        GetSelectedIndex : function () {
            var $element = this.GetElemnt();
            var indexSelected;
            if (this.dispstyle == "4") {
                var $optionSelected = $element.find(".clicked");
                var $radio = $element.find(".subTab");
                indexSelected = $radio.index($optionSelected);
            } else {
                var $optionSelected = $element.find("input[type=radio]:checked");
                var $radio = $element.find("input[type=radio]");
                indexSelected = $radio.index($optionSelected);
            }

            return indexSelected;
        },

        /// <member id="SetRadioIndex" kind="method">
        /// <summary>지정한 인덱스로 변경</summary>
        /// <remarks>지정한 인덱스로 변경</remarks>
        /// <param name="index" type="number">인덱스 값</param>
        /// <example>rdo_1.SetRadioIndex(index);
        /// </example>
        /// </member>
        SetRadioIndex : function (index, event) {
            if (index == undefined) return;

            var $element = this.GetElemnt();
            if (this.dispstyle == "4") {
                var len = $element.children().length;
                for (var i = 0; i < len; i++) {
                    if ($($element.children()[i]).hasClass("clicked")) {
                        $($element.children()[i]).removeClass("clicked");
                    }
                }
                $($element.children()[index]).addClass("clicked");
            } else {
                var $inputEle = $element.find("input");
                $inputEle[index].checked = true;
            }

            var obj = this;
            if(obj.dispstyle == "3"){
                var name = $inputEle[index].name;
                var $optionSelected = $("#" + name + " input[type=radio]:checked");
                var $radio = $("#" + name + " input[type=radio]");
                var indexSelected = $radio.index($optionSelected);
                obj.selectindex = indexSelected; 
                if (obj.direction == "1")
                    $("#" + name).find('tr').removeClass("selected");
                else
                    $("#" + name).find('td').removeClass("selected");

                $("#" + name).find('span').removeClass("selectedSpan");

                for (var x = 0; x < obj.itemcount; x++) {
                    if (indexSelected == x) {
                        var $inputEleIndx = $($inputEle[index]);
                        if (obj.direction == "1") {
                            $inputEleIndx.closest("tr").addClass("selected");
                        }
                        else {
                            $inputEleIndx.closest("td").addClass("selected");
                        }
                        $inputEleIndx.closest("td").find("span").addClass("selectedSpan");
                    }
                }
            }
            else if (obj.dispstyle != "0" && obj.dispstyle != "4") {
                obj.selectindex = index; 
                var cssstyle = { "background-color": "", "color": "", "border-color": "" };
                if (obj.direction == "1")
                    $element.find('tr').css(cssstyle);
                else
                    $element.find('td').css(cssstyle);

                for (var x = 0; x < obj.itemcount; x++) {
                    if (index == x) {
                        var cssstyle = hi5.getCustomStyle(obj, "active");
                        if (cssstyle) {
                            if (obj.direction == "1") {
                                $("#" + obj.id + " tr:nth-child(" + (index + 1) + ")").css(cssstyle);
                            }
                            else {
                                $("#" + obj.id + " td:nth-child(" + (index + 1) + ")").css(cssstyle);
                            }
                            break;
                        }
                    }
                }
            }

            if (event) {
                if (obj.OnChange)
                    obj.OnChange.call(obj, index);
            }
        },

        /// <member id="SetIndexDisabled" kind="method">
        /// <param name="index" type="number">인덱스 값</param>
        /// <param name="bool" type="boolean">true|false</param>
        /// <summary>지정한 인덱스의 라디오를 활성화 or 비활성화</summary>
        /// <remarks>지정한 인덱스의 라디오를 활성화 or 비활성화</remarks>
        /// <example>rdo_1.SetIndexDisabled(index, bool);
        /// </example>
        /// </member>
        SetIndexDisabled : function (index, bool) {
            if (index == undefined || bool == undefined) return;

            var $element = this.GetElemnt();
            var $inputEle = $element.find("input");
            $inputEle[index].disabled = bool;

            //$("#rdoinput_" + index + this.id).prop("disabled", bool);
        },

        /// <member id="SetFocus" kind="method">
        /// <summary>해당 컨트롤 focus 주기</summary>
        /// <remarks>해당 컨트롤 focus 주기</remarks>
        /// </member>
        SetFocus : function () {
            var $element = this.GetElemnt();
            var $inputEle = $element.find("input");
            var $labelEle = $element.find("label");

            if (this.dispstyle == "3") $labelEle[0].focus();
            else if (this.dispstyle == "4") {
                var $divEle = $element.find("div");
                $divEle.focus();
            }
            else $inputEle[0].focus();
        }
    }

    /* events */
    /// <member id="OnChange" kind="event" default="true">
    /// <summary>라디오 선택 변경 시에 발생되는 이벤트</summary>
    /// <remarks>라디오 선택 변경 시에 발생되는 이벤트</remarks>
    /// <param name="nIndex" type="number"> 선택된 인덱스 </param>
    /// <example>rdo_1.OnChange(nIndex);
    /// </example>
    /// </member>
    //radio.prototype.OnChange = function (nIndex) {
    //    var fn = this.objParentForm.getIsEventName(this.id, "OnChange");
    //    if (fn != null) fn(nIndex);
    //}
    radio.ctlName = "radio";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(radio.ctlName, radio);
    return radio;
}());
