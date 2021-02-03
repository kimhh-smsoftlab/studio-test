//checkbox.js
if ( !hi5_switch ) var hi5_switch = {};

(function () {
    'use strict';

    var checkbox = function () {

        this.checked = "0";
        this.dispstyle = "0";  // 시스템 지정
        this.oncaption = "";
        this.offcaption = "";
        this.onvalue = "1";
        this.offvalue = "0";
        this.itemflag = "1";
        this.caption = "";
        this.value = "";

        this.customList = {};

        this.customtooltip = {};
    }

    //컨트롤 html 스크립트 생성
    checkbox.prototype = {
        propertyLoad : function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_checkbox"], // 클래스 정보명
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "" }, // HTML Attri 정의하는 정보 설정
                dataCell = "";  // caption
            /*
            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            var objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                // CDDATA 정보를 포함한 속석명 지정
                return ["multi_lang"];
            });
            */
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

            if (this.dispstyle == "1") cls[0] = "hi5_checkbox-left" , hi5admin == "admin" ? cls[1] = "adm-left" : "";
            else if (this.dispstyle == "2") cls[0] = "hi5_checkbox-right", hi5admin == "admin" ? cls[1] = "adm-right" : "";

            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);

            if (!hi5.isEmpty(objXML.multi_lang)) {
                this.oncaption = x2h.xmlGetMultiLangText(objXML.multi_lang, "oncaption");
                this.offcaption = x2h.xmlGetMultiLangText(objXML.multi_lang, "offcaption");
            }
            if (this.offcaption == "") this.offcaption = this.oncaption;
            if (this.oncaption == "") this.oncaption = this.offcaption;

            var caption;
            if (this.checked == "1") {
                caption    = this.oncaption;
                this.value = this.onvalue;
            }
            else {
                caption    = this.offcaption;
                this.value = this.offvalue;
            }

            var fragment = document.createDocumentFragment();
            if (this.dispstyle == "3") {   // flipswitch
                //var inputEle = x2h.createXmlElement(xmlHolderElement, "input");
                var inputEle = fragment.appendChild(document.createElement("input"));
                xmlHolderElement.appendChild(inputEle);
                inputEle.type = "checkbox";
                inputEle.id = "chk_" + this.id;
                inputEle.name = "hi5_switch";
                inputEle.style.display = "none";
                inputEle.checked = this.checked == "1" ? true : false;
            } else {
                //var tableEle = x2h.createXmlElement(xmlHolderElement, "table");
                var tableEle = fragment.appendChild(document.createElement("table"));
                xmlHolderElement.appendChild(tableEle);
                var trEle = tableEle.appendChild(document.createElement("tr"));
                tableEle.appendChild(trEle);
                var tdEle = trEle.appendChild(document.createElement("td"));
                trEle.appendChild(tdEle);
                var labelEle, inputEle;
                inputEle = tdEle.appendChild(document.createElement("input"));
                tdEle.appendChild(inputEle);
                labelEle = tdEle.appendChild(document.createElement("label"));
                tdEle.appendChild(labelEle);
                inputEle.type = "checkbox";
                inputEle.id = "chk_" + this.id;
                if (objXML.disabled) {
                    //inputEle.disabled = true;
                    this.Disabled(true);
                }

                labelEle.id = "lbl_" + this.id;
                labelEle.setAttribute("for", "chk_" + this.id);
                labelEle.innerHTML = caption;
            }
        },

        onInitAfter : function () {
            var obj = this;
            var elem = this.$html[0];
            var $elem = this.$html;

            if (this.dispstyle == "3") {   // flipswitch
                var $div = $("#" + this.id);
                var height  = $div.outerHeight();
                var width = $div.outerWidth();
                var config = {
                    el: '#chk_' + this.id,
                    textOn: this.oncaption,
                    textOff: this.offcaption,
                    height: height,
                    width: width,
                    listener: function (name, checked) {
                        obj.value = checked ? obj.onvalue : obj.offvalue;
                        obj.checked = checked;
                        if (obj.OnStateChanged)
                            obj.OnStateChanged.call(obj, checked, obj.value);
                    }
                }
                // switch 옵션값을 지정한다.
                var objSwitch;
                if (this.customList.switch) {
                    objSwitch = this.customList.switch;
                    for (var key in objSwitch) {
                        config[key] = objSwitch[key];
                    }
                }
                // OnOff Switch 객체설정
                this.flipswitch = new hi5_switch.OnOffSwitch(config);
                return;
            }

            if (this.checked == true) $("#chk_" + this.id).prop('checked', true);

            $("#" + this.id + " input[type=checkbox]").on('change', function (event) {
                event.stopPropagation();
                $(this).attr('value', this.checked);
                obj.SetCheck(this.checked, true);
            });

            if (obj.dispstyle != "3") {
                var $input = this.GetDataElement();
                // focus
                hi5.on(elem, "mouseenter", function () {
                    var disabled = $input.attr("disabled");
                    if (!disabled) {
                        var cssstyle = hi5.getCustomStyle(obj, "over");
                        $("#" + this.id).css(cssstyle);
                    }
                });

                hi5.on(elem, "mouseleave", function () {
                    var disabled = $input.attr("disabled");
                    if (!disabled) {
                        var cssstyle = hi5.getCustomStyle(obj, "default");
                        $("#" + this.id).css(cssstyle);
                    }
                });
            }

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
            var $input = this.GetElemnt().find("input");
            return $input; // 데이터 요소 <div><table><tr><td><input><label> ~</label></td><tr></table></div>
        },

        // HTML 요소객체 취득
        GetElemnt : function () {
            return this.$html;
        },
        
        OnGetData: function (value) {
            var bCheck = false;
            var caption = this.offcaption;
            if (value == this.onvalue) {
                this.value = this.onvalue;
                caption = this.oncaption;
                bCheck = true;
            }
            else this.value = this.offvalue;

            if (this.flipswitch) {
                this.flipswitch.setValue(bCheck);
            }
            else {
                var $element = this.GetElemnt();
                var $labelEle = $element.find("label");
                $labelEle.textNode = caption;
                this.SetCheck(bCheck);
            }
        },

        // disabled 됐을때 동작(css disabled 동일)
        Disabled: function (state) {
            if (this.flipswitch) return;
            if (state == undefined) return;
            var cssstyle = {};
            var $element = this.GetElemnt();
            var $input = this.GetDataElement();
            if ($input) {
                if (state == true || state == "disabled" || state == "true") {
                    cssstyle = hi5.getCustomStyle(this, "disable");
                    $input.attr("disabled", true);
                }
                else {
                    cssstyle = hi5.getCustomStyle(this, "default");
                    $input.removeAttr("disabled");
                }

                if (cssstyle)
                    $element.css(cssstyle);
            }
        },

        AutoSaveCtrl : function () {
            return this.GetCheck();
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
        
            if (style === "activebgcolor") {
                val = $element.attr("activebgcolor");
                if(typeof val === 'undefined'){
                    val ="62";
                }
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
                var $labelEle = $element.find("label");
                val = $labelEle.text();
                //val = $("#lbl_" + $element[0].id).text();
            } else if (propName == "value") {
                val = this.value;
            }
            else if (propName == "oncaption" || propName == "offcaption" || propName == "onvalue" || propName == "offvalue") {
                val = this[propName];
            }
            else if (propName == "floatstyle" || propName == "borderStyle" || propName == "opacity" || propName == "textAlign") {
                propName = (
                    propName === "floatstyle" ? "float" :
                    propName === "borderStyle" ? "border" :
                    propName);

                val = this.GetStyle(propName);
            }
            else if (propName == "dispstyle") {
                val = this.dispstyle;
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
                var $labelEle = $element.find("label");
                $labelEle.text(Value);

                var checked = this.GetCheck();
                if (checked == true) this.oncaption = Value;
                else this.offcaption = Value;
            }
            else if (propName == "value") {
                var bCheck = false;
                var caption = this.offcaption;
                if (Value == this.onvalue) {
                    this.value = this.onvalue;
                    caption = this.oncaption;
                    bCheck = true;
                }
                else this.value = this.offvalue;

                if (this.flipswitch) {
                    this.flipswitch.setValue(bCheck);
                }
                else {
                    //$("#chk_" + this.id).attr('checked', bCheck);
                    var $labelEle = $element.find("label");
                    $labelEle.text(caption);
                    this.SetCheck(bCheck);
                    //$("#lbl_" + $element[0].id).text(caption);
                    //var checkbox = document.getElementById("chk_" + $element[0].id);
                    //checkbox.checked = bCheck;
                }
            }
            else if (propName == "oncaption") {
                this.oncaption = Value;
                var checked = this.GetCheck();
                if (checked == true) {
                    var $labelEle = $element.find("label");
                    $labelEle.text(Value);
                    //$("#lbl_" + $element[0].id).text(Value);
                }
            }
            else if (propName == "offcaption") {
                this.offcaption = Value;
                var checked = this.GetCheck();
                if (checked == false) {
                    var $labelEle = $element.find("label");
                    $labelEle.text(Value);
                    //$("#lbl_" + $element[0].id).text(Value);
                }
            }
            else if (propName == "onvalue" || propName == "offvalue") {
                this[propName] = Value;
            }
            else if (propName == "tabindex") {
                var $inputEle = $element.find("input");
                $inputEle.attr(propName, Value);
                //$("#chk_" + $element[0].id).attr(propName, Value);
            }
            else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
                if (propName == "disabled") {
                    this.Disabled(Value);
                }
            }
        },

        /// <member id="GetCheck" kind="method">
        /// <summary>해당 컨트롤 체크 여부 취득</summary>
        /// <remarks>해당 컨트롤 체크 여부 취득(true|false)</remarks>
        /// <returns type="boolean"> true|false </returns>
        /// <example>var result = chk_1.GetCheck();
        /// </example>
        /// </member>
	    GetCheck : function () {
	        if (this.flipswitch) {
	            return this.flipswitch.getValue();
	        }
	        var $element = this.GetElemnt();
	        var chk_ctrl = $element.find("input");
	        //var chk_ctrl = $("chk_" + $element[0].id);
	        //var chk_ctrl = document.getElementById("chk_" + this.id);
	        return chk_ctrl[0].checked;
	    },

        /// <member id="SetCheck" kind="method">
        /// <summary>해당 컨트롤 체크 상태 변경</summary>
        /// <remarks>해당 컨트롤 체크 상태 변경(미체크-false|0 / 체크-true|1)</remarks>
        /// <param name = "bcheck" type="boolean"> 미체크-false|0 / 체크-true|1</param>
        /// <param name = "event" type="boolean"> true : 이벤트 발생, 미저징 또는 false : 이벤트 미 발생</param>
        /// <example>
        ///  chk_1.SetCheck(true);
        /// </example>
        /// </member>
        SetCheck : function (bCheck, event) {
            bCheck = hi5.strToBool(bCheck);
            this.value = bCheck ? this.onvalue : this.offvalue;
            if (this.flipswitch) {
                if ( bCheck != this.flipswitch.getValue() )
                {
                    this.flipswitch.setValue(bCheck, event);
                }
                return;
            }

            var $element = this.GetElemnt();
            var chk_ctrl = $element.find("input");
            var $labelEle = $element.find("label");

            if (bCheck == false ) {
                $labelEle.text(this.offcaption);
                chk_ctrl[0].checked = false;
            }
            else {
                $labelEle.text(this.oncaption);
                chk_ctrl[0].checked = true;
            }
            if (event && this.OnStateChanged)
                this.OnStateChanged.call(this, bCheck, this.value);
        },

        /// <member id="SetFocus" kind="method">
        /// <summary>해당 컨트롤 focus 주기</summary>
        /// <remarks>해당 컨트롤 focus 주기</remarks>
        /// </member>
        SetFocus : function () {
            var $element = this.GetElemnt();
            $element.focus();
        }
    }

    /* events */
    /// <member id="OnStateChanged" kind="event" default="true">
    /// <summary>체크상태 변경시 발생되는 이벤트</summary>
    /// <remarks>체크상태 변경시 발생되는 이벤트</remarks>
    /// <param name="checkstate" type="boolean"> 체크여부(true or false) </param>
    /// <param name="value" type="string"> 현 체크상태의 value값 </param>
    /// <example>chk_1.OnStateChanged(checkstate);
    /// </example>
    /// </member>
	//checkbox.prototype.OnStateChanged = function (checkstate) {
	//    var fn = this.objParentForm.getIsEventName(this.id, "OnStateChanged");
	//    if (fn != null) fn(checkstate, this.value);
	//}
    checkbox.ctlName = "checkbox";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(checkbox.ctlName, checkbox);
	return checkbox;
}());

//https://github.com/DHTMLGoodies/jquery-on-off-switch
//hi5_switch.switches = {};
hi5_switch.switchProp = ["textOn", "textOff", "width", "height", "trackColorOn", "trackColorOff", "textColorOn", "textColorOff", "listener", "trackBorderColor", "textSizeRatio"];


hi5_switch.OnOffSwitch = function (config) {
    if (config.el != undefined) {
        this.inputEl = $(config.el);

        this.name = this.inputEl.attr("name");

        //hi5_switch.switches[this.name] = this;
        //hi5_switch.switches["#" + this.inputEl.attr("id")] = this;

        var t = this.inputEl.attr("type");
        this.isCheckbox = t && t.toLowerCase() == "checkbox";
        if (this.isCheckbox) {
            this.checked = this.inputEl.is(":checked");
        } else {
            this.checked = this.inputEl.val() == 1;
        }
    }

    var props = hi5_switch.switchProp;
    for (var key in props) {
        if (config[props[key]] != undefined) {
            this[props[key]] = config[props[key]];
        }
    }
    this.render();
};

$.extend(hi5_switch.OnOffSwitch.prototype, {
    inputEl: undefined,
    listener: undefined,
    trackBorderColor: undefined,
    checked: false,
    width: 0,
    height: 30,
    trackBorderWidth: 1,
    textSizeRatio: 0.50,
    trackColorOn: undefined,
    trackColorOff: '#EEE',
    textColorOn: undefined,
    textColorOff: undefined,
    el: undefined,
    track: undefined,
    thumb: undefined,
    thumbColor: undefined,
    onTextEl: undefined,
    offTextEl: undefined,
    onOffTrackContainer: undefined,
    textOn: "",
    textOff: "",
    minX: 0,
    maxX: 0,
    trackOn: undefined,
    trackOff: undefined,
    innerTrackWidth: 0,
    name: undefined,
    dragCurrentX: 0,
    borderSize: 0,
    isCheckbox: false,

    render: function () {
        if (this.width == 0) {
            var ratio = this.textSizeRatio / 2;
            var widthFactor = 2 + Math.max(this.textOff.length * ratio, this.textOn.length * ratio);
            this.width = this.height * widthFactor;
        }

        this.inputEl.css("display", "none");
        this.el = $('<div class="on-off-switch" style="width:' + this.width + 'px;height:' + this.height + 'px"></div>');
        this.inputEl.after(this.el);

        this.inputEl.on("change", this.listenToClickEvent.bind(this));

        this.renderTrack();
        this.renderThumb();

        this.applyStyles();

        this.track.on("click", this.toggle.bind(this));
        this.track.on("touchend", this.toggle.bind(this));

        this.addEvents();
    },

    listenToClickEvent: function () {

        if (this.inputEl.is(':checked')) {
            if (!this.checked) this.toggle();
        } else {
            if (this.checked) this.toggle();
        }

    },

    addEvents: function () {

        this.thumb.on("mousedown", this.startDragging.bind(this));
        this.thumb.on("touchstart", this.startDragging.bind(this));

        this.thumb.on("mouseenter", this.enterThumb.bind(this));
        this.thumb.on("mouseleave", this.leaveThumb.bind(this));

        $(document.documentElement).on("touchmove", this.drag.bind(this));
        $(document.documentElement).on("mousemove", this.drag.bind(this));
        $(document.documentElement).on("mouseup", this.endDrag.bind(this));
        $(document.documentElement).on("touchend", this.endDrag.bind(this));
    },

    enterThumb: function () {
        this.thumbColor.addClass("on-off-switch-thumb-over");
    },

    leaveThumb: function () {
        this.thumbColor.removeClass("on-off-switch-thumb-over");
    },

    renderTrack: function () {
        var trackWidth = this.width - (this.trackBorderWidth * 2);
        var innerTrackWidth = trackWidth - (this.height / 2);
        this.innerTrackWidth = trackWidth;
        var trackHeight = this.height - (this.trackBorderWidth * 2);
        var borderWidth = this.height / 2;


        this.track = $('<div class="on-off-switch-track" style="border-radius:' + borderWidth + 'px;border-width:' + this.trackBorderWidth + 'px;' +
            'width:' + trackWidth + 'px;' +
            'height:' + trackHeight + 'px"></div>');

        if (this.trackBorderColor) {
            this.track.css("border-color", this.trackBorderColor);
        }
        this.el.append(this.track);

        this.onOffTrackContainer = $('<div style="position:absolute;height:' + trackHeight + 'px;width:' + (innerTrackWidth * 2) + 'px"></div>');
        this.track.append(this.onOffTrackContainer);


        //this.trackOn = $('<div class="on-off-switch-track-on" style="border-radius:' + 0 + 'px;border-width:' + this.trackBorderWidth + 'px;width:' + innerTrackWidth + 'px;height:' + trackHeight + 'px"><div class="track-on-gradient"></div></div>');
        this.trackOn = $('<div class="on-off-switch-track-on" style="border-radius:' + 0 + 'px;border-width:' + this.trackBorderWidth + 'px;width:' + innerTrackWidth + 'px;height:' + trackHeight + 'px"></div>');
        this.onOffTrackContainer.append(this.trackOn);
        this.onTextEl = $('<div class="on-off-switch-text on-off-switch-text-on">' + this.textOn + '</div>');
        this.trackOn.append(this.onTextEl);

        if (this.textColorOn) {
            this.onTextEl.css("color", this.textColorOn);
        }

        //this.trackOff = $('<div class="on-off-switch-track-off" style="overflow:hidden;left:' + (innerTrackWidth - (this.height / 2)) + 'px;border-radius:' + 0 + 'px;border-width:' + this.trackBorderWidth + 'px;width:' + this.width + 'px;height:' + trackHeight + 'px"><div class="track-off-gradient"></div></div>');
        this.trackOff = $('<div class="on-off-switch-track-off" style="overflow:hidden;left:' + (innerTrackWidth - (this.height / 2)) + 'px;border-radius:' + 0 + 'px;border-width:' + this.trackBorderWidth + 'px;width:' + this.width + 'px;height:' + trackHeight + 'px"></div>');
        this.offTextEl = $('<div class="on-off-switch-text on-off-switch-text-off">' + this.textOff + '</div>');
        this.onOffTrackContainer.append(this.trackOff);
        this.trackOff.append(this.offTextEl);

        if (this.textColorOff) {
            this.offTextEl.css("color", this.textColorOff);
        }

        this.styleText(this.onTextEl);
        this.styleText(this.offTextEl);

        var whiteHeight = this.height / 2;
        var whiteBorderRadius = whiteHeight / 2;
        var horizontalOffset = whiteBorderRadius / 2;
        var whiteWidth = this.width - (horizontalOffset * 2);

        var whiteEl = $('<div class="on-off-switch-track-white" style="left:' + horizontalOffset + 'px;width:' + whiteWidth + 'px;height:' + whiteHeight + 'px;border-radius:' + whiteBorderRadius + 'px"></div>');
        var whiteEl2 = $('<div class="on-off-switch-track-white" style="left:' + horizontalOffset + 'px;width:' + whiteWidth + 'px;height:' + whiteHeight + 'px;border-radius:' + whiteBorderRadius + 'px"></div>');
        whiteEl.css("top", this.height / 2);
        whiteEl2.css("top", this.height / 2);
        this.trackOn.append(whiteEl);
        this.trackOff.append(whiteEl2);


        this.maxX = this.width - this.height;
    },

    styleText: function (el) {
        var textHeight = Math.round(this.height * this.textSizeRatio);
        var textWidth = Math.round(this.width - this.height);

        el.css("line-height", (this.height - (this.trackBorderWidth * 2)) + "px");
        el.css("font-size", textHeight + "px");
        el.css("left", (this.height / 2) + "px");
        el.css("width", textWidth + "px");
    },

    renderThumb: function () {

        var borderSize = this.getBorderSize();

        var size = this.height - (borderSize * 2);
        var borderRadius = (this.height - this.height % 2) / 2;


        this.thumb = $('<div class="on-off-switch-thumb" style="width:' + this.height + 'px;height:' + this.height + 'px"></div>');


        var shadow = $('<div class="on-off-switch-thumb-shadow" style="border-radius:' + borderRadius + 'px;width:' + size + 'px;height:'
            + size + 'px;border-width:' + borderSize + 'px;"></div>');

        this.thumb.append(shadow);

        this.thumbColor = $('<div class="on-off-switch-thumb-color" style="border-radius:' + borderRadius + 'px;width:' + size + 'px;height:' + size +
            'px;left:' + borderSize + 'px;top:' + borderSize + 'px"></div>');
        this.thumb.append(this.thumbColor);

        if (this.trackColorOff) {
            this.trackOff.css("background-color", this.trackColorOff);
        }
        if (this.trackColorOn) {
            this.trackOn.css("background-color", this.trackColorOn);
        }

        this.el.append(this.thumb);
    },


    getBorderSize: function () {
        //if (this.borderSize == 0) {
        //    this.borderSize = Math.round(this.height / 40);
        //}
        return this.borderSize;
    },

    applyStyles: function () {

        this.thumbColor.removeClass("on-off-switch-thumb-on");
        this.thumbColor.removeClass("on-off-switch-thumb-off");
        this.thumbColor.removeClass("on-off-switch-thumb-over");

        if (this.checked) {
            this.thumbColor.addClass("on-off-switch-thumb-on");
            this.thumb.css("left", this.width - this.height);
            this.onOffTrackContainer.css("left", 0);
        }
        else {
            this.onOffTrackContainer.css("left", this.getTrackPosUnchecked());
            this.thumbColor.addClass("on-off-switch-thumb-off");
            this.thumb.css("left", 0);
        }
        if (this.isCheckbox) {
            this.inputEl.prop('checked', this.checked);
        } else {
            this.inputEl.val(this.checked ? 1 : 0);
        }
    },

    isDragging: false,
    hasBeenDragged: false,
    startDragging: function (e) {


        this.isDragging = true;
        this.hasBeenDragged = false;
        var position = this.thumb.position();

        this.startCoordinates = {
            x: this.getX(e),
            elX: position.left,
        };
        return false;
    },

    drag: function (e) {
        if (!this.isDragging) {
            return true;
        }

        this.hasBeenDragged = true;
        var x = this.startCoordinates.elX + this.getX(e) - this.startCoordinates.x;

        if (x < this.minX) x = this.minX;
        if (x > this.maxX) x = this.maxX;

        this.onOffTrackContainer.css("left", x - this.width + (this.height));
        this.thumb.css("left", x);
        return false;
    },

    getX: function (e) {
        var x = e.pageX;

        if (e.type && (e.type == "touchstart" || e.type == "touchmove")) {
            x = e.originalEvent.touches[0].pageX;
        }

        this.dragCurrentX = x;

        return x;

    },

    endDrag: function () {
        if (!this.isDragging) return true;

        if (!this.hasBeenDragged) {
            this.toggle();
        } else {
            var center = this.width / 2 - (this.height / 2);
            var x = this.startCoordinates.elX + this.dragCurrentX - this.startCoordinates.x;
            if (x < center) {
                this.animateLeft();
            } else {
                this.animateRight();
            }
        }
        this.isDragging = false;
    },

    getTrackPosUnchecked: function () {
        return 0 - this.width + this.height;
    },

    animateLeft: function () {
        this.onOffTrackContainer.animate({ left: this.getTrackPosUnchecked() }, 100);
        this.thumb.animate({ left: 0 }, 100, "swing", this.uncheck.bind(this));
    },

    animateRight: function () {
        this.onOffTrackContainer.animate({ left: 0 }, 100);
        this.thumb.animate({ left: this.maxX }, 100, "swing", this.check.bind(this));
    },

    check: function () {
        if (!this.checked) {
            this.checked = true;
            this.notifyListeners();
        }
        this.applyStyles();
    },

    uncheck: function () {
        if (this.checked) {
            this.checked = false;
            this.notifyListeners();
        }
        this.applyStyles();
    },

    toggle: function () {
        if (!this.checked) {
            this.checked = true;
            this.animateRight();
        } else {
            this.checked = false;
            this.animateLeft();
        }

        this.notifyListeners();
    },

    notifyListeners: function () {
        if (this.listener != undefined) {
            this.listener.call(this, this.name, this.checked);
        }
    },

    getValue: function () {
        return this.checked;
    },

    setValue: function (check, event) {
        if (this.checked != check) {
            this.checked = check;
            this.applyStyles();
            if (event)
                this.notifyListeners();
        }
    }
});


