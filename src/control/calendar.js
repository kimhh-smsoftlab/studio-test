//calendar.js

var g_calendar_url = "images/control/calendar.svg";

(function () {
    'use strict';

    var calendar = function () {
        this.itemflag = "1";
        this.disptype = "0";    //YYYY/MM/DD
        this.todaytype = "1";   //PC일자
        this.iconstyle = "1";   //오른쪽 이미지
        this.$datepicker = "";
    }

    calendar.prototype = {
        //컨트롤 html 스크립트 생성
        propertyLoad : function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_calendar"], // 클래스 정보명
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "", disabled: ""}, // HTML Attri 정의하는 정보 설정
                dataCell = "";  // caption
            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            var objXML = x2h.getXML2Control(node, this, attr, cls, style);
            // stylecolor 정보를 객체로 변환한다(String->JSON)
            if (objXML.stylecolor)
                this.styleColor = x2h.defaultStyle(objXML.stylecolor, false);

            if (this.iconstyle == "0") cls.push("left_cal");
            else if (this.iconstyle == "1") cls.push("right_cal");

            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");
            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);

            // 2019.09.05 kws
            // 월별로 표시하여 좌우에 화살표 있는 형태
            // datepicker 사용안하고 신규로 생성.
            if(this.iconstyle == "2"){
                var leftArrow = x2h.createXmlElement(xmlHolderElement, "i");
                leftArrow.setAttribute("class", "fa fa-chevron-left");
                leftArrow.addEventListener("click", function(){
                    var nextDate = that.GetNextMonth(that.curMonth, true);
                    that.SetProp("curMonth", nextDate);
                });
                xmlHolderElement.appendChild(leftArrow);
                var showText = x2h.createXmlElement(xmlHolderElement, "div");
                showText.setAttribute("class", "calShowText");
                xmlHolderElement.appendChild(showText);
                var rightArrow = x2h.createXmlElement(xmlHolderElement, "i");
                rightArrow.setAttribute("class", "fa fa-chevron-right");
                rightArrow.addEventListener("click", function(){
                    var nextDate = that.GetNextMonth(that.curMonth);
                    that.SetProp("curMonth", nextDate);
                });
                xmlHolderElement.appendChild(rightArrow);

                var today = (new Date()).curDate();
                today = hi5.getUTCdate(today);
                showText.innerHTML = today.substring(0, 4) + "." + today.substring(4,6);
                this.curMonth = today.substring(0, 6);
            }
            else{
                // Sub HTML x2h.attri() 함수로 통일
                var inputEle = x2h.createXmlElement(xmlHolderElement, "input");
                xmlHolderElement.appendChild(inputEle);

                var today = (new Date()).curDate();
                var disptype = 'yy/mm';
                var todate = today.substring(0, 4) + "/" + today.substring(4,6);
                var maxlength = "8";
                if (this.disptype == "0") {
                    disptype = 'yy/mm/dd';
                    todate += "/" + today.substring(6, 8);
                    maxlength = "10";
                }

				if(hi5.WTS_MODE == WTS_TYPE.MTS){   // 모바일에서는 네이티브 달력을 쓰는 것이 좋다.
                    if(!window.fromWeb2Native){
                        todate = todate.replaceAll('/', '-');
                        attr = { type: "date", id: this.id + "__input", value: todate, maxlength: maxlength };
                    }
                    else{
                        attr = { type: "text", id: this.id + "__input", value: todate, maxlength: maxlength };
                        attr["readOnly"] = "readOnly";
                    }
				}
				else{
					attr = { type: "text", id: this.id + "__input", value: todate, maxlength: maxlength };
                    attr["readOnly"] = "readOnly";
				}
				/*
                attr = { type: "text", id: this.id + "__input", value: todate, maxlength: maxlength };
                // readOnly, disabled -> {disabled =disabled ; readOnly=readOnly}
                //if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                    attr["readOnly"] = "readOnly";
                //}
				*/
                style = x2h.attri(inputEle, attr);
				if(hi5.WTS_MODE == WTS_TYPE.MTS){

				}
				else{
					//g_calendar_Text["minDate"] = new Date(2015, 1 - 1, 1);
				    this.$datepicker = hi5.clone(g_calendar_Text);
					this.$datepicker.dateFormat = disptype;
					if (this.iconstyle == "0" || this.iconstyle == "1") {
						//var url = hi5.getURL({ url: g_calendar_url });
                        this.$datepicker.showOn = "button";
                        this.$datepicker.buttonText = "";
						//this.$datepicker.buttonText = '<i class="fa fa-calendar"></i>';    // 2019.08.22 kws img tag 대신 fontawesome 사용토록
						//this.$datepicker.buttonImage = url;                                   // 이미지 url은 사용안함
						this.$datepicker.buttonImageOnly = false;                               // 이미지만 사용안함. text추가하여 fontawesome이 대체
					}
                    var obj = this;
					this.$datepicker.onSelect = function (date) {
						if (obj.OnChanged)
							obj.OnChanged.call(obj, date);
					}
					//this.$datepicker.maxDate = "0d";
					$(inputEle).datepicker(this.$datepicker);
				}
                if (objXML.disabled == "1") {
                    this.Disabled(true);
                }
                if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                    var arrow = document.createElement("span");
                    arrow.className = 'combo_arrow'
                    xmlHolderElement.appendChild(arrow);

                }
            }
        },

        onInitAfter : function () {
            var obj = this;
            if(hi5.WTS_MODE == WTS_TYPE.MTS){   // 모바일웹에서는 네이티브 이벤트 써야한다.
                if(window.fromWeb2Native){
                    $(obj.GetDataElement()).on("click", function(){
                        let openDialogObj = {
                            type : 'openDialog',//'tran'
                            screen: '2',
                            data : {
                                date : obj.GetProp('value'),
                            },
                            rpData:{
                                date : ''
                            },
                            $form : obj.objParentForm.id,
                            $control : obj.orgid
                        }
                        let convertString = JSON.stringify(openDialogObj);
                    
                        window.fromWeb2Native.postMessage(convertString);
                    })
                }
                $(obj.GetDataElement()).on("change", function(){
                    if(obj.OnChanged){
                        var value = $(this).val();
                        value = value.replaceAll("-", "");
                        obj.OnChanged.call(obj, value);
                    }
                })
        	}
            //var obj = this;
            //
            //this.$datepicker.onSelect = function (date) {
            //    if (obj.OnChanged)
            //        obj.OnChanged.call(obj, date);
            //}
            //if (hi5.WTS_MODE == WTS_TYPE.MTS) {
            //    obj.SetProp("readOnly", true);
            //}
            /*
            var disptype;
            if (this.disptype == "0") {
                disptype = 'yy/mm/dd';
            }
            else {
                disptype = 'yy/mm';
            }

            var input_id = this.id + "__input";
            var datepickerObj = hi5.clone(g_calendar_Text);
            datepickerObj.dateFormat = disptype;
            datepickerObj.onSelect = function (date) {
                if (obj.OnChanged)
                    obj.OnChanged.call(obj, date);
            }
            if (this.iconstyle == "0" || this.iconstyle == "1") {
                var url = hi5.getURL({ url: g_calendar_url });
                datepickerObj.showOn = "button";
                datepickerObj.buttonImage = url;
                datepickerObj.buttonImageOnly = true;
            }
            $(inputelement).datepicker(datepickerObj);

            //today's date set
            //obj.SetProp("caption", today);

            var disabled = this._html.disabled;
            if (disabled == true) {
                this.Disabled(true);
            }*/
        },
      
        // HTML 요소객체 취득
        GetElemnt : function () {
            return this.$html;
        },

        /// <member id="GetDataElement" kind="method">
        /// <summary>데이터 영역의 HTML Tag 요소를 취득하는 함수</summary>
        /// <remarks>복합 요소로 구성된 컨트롤에서 타이틀 영역을 변경시에 사용</remarks>
        /// <returns type="object"> html의 input 요소 객체 반환</returns>
        /// <example><![CDATA[
        ///    // 자식 HTML  요소(DIV) 객체를 취득하는 함수 
        ///    var input = calendar.GetDataElement();  // JavaScript 객체
        ///    input.innerHTML = "Text";   // Text 값 설정
        ///    
        ///    // JQuery 라이브러이로 속성, 스타일, 클래스등을 변경한다.
        ///    $(div).css(), $(div).attr(),,.
        /// ]]></example>
        /// </member>
        GetDataElement: function () {
            var $elem = this.$html;
            return $elem.find('input')[0]; // 데이터 요소 <div><input> ~</input></div>
        },

        // disabled 됐을때 동작(css disabled 동일)
        Disabled: function (state) {
            var $ele = this.GetElemnt();
            var inputelement = this.GetDataElement();

            if (state == undefined) return;
            var cssstyle = {};
            if (state == true || state == "disabled" || state == "true") {
                cssstyle = hi5.getCustomStyle(this, "disable");
                $(inputelement).datepicker("disable");
            }
            else {
                cssstyle = hi5.getCustomStyle(this, "default");
                $(inputelement).datepicker("enable");
            }

            if (cssstyle)
                $ele.css(cssstyle);
        },

        // autosave
        //calendar.prototype.AutoSaveCtrl = function (org_id) {
        //    return "";
        //}

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
            var $element = this.GetDataElement(), val;
            var inputelement = this.GetDataElement();

            if (propName == "caption") {
                val = $(inputelement).val();
            }
            else if (propName == "value") {
                val = $(inputelement).val();
                val = val.replace(/[^0-9]/g, '');
                if (g_hi5_config.useUTC == true)
                    val = hi5.getUTCdate(val);
            }
            else if (propName === "floatstyle" || propName === "borderStyle" || propName === "opacity" || propName === "textAlign") {

                propName =
                propName === "floatstyle" ? "float" :
                propName === "borderStyle" ? "border" :
                propName;

                val = this.GetStyle(propName);
            }
            else if (propName === "iconstyle" || propName === "disptype" || propName === "todaytype" || propName === "itemflag") {
                val = this[propName];
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
            var inputelement = this.GetDataElement();

            if (propName == "caption" || propName == "value") {
                if (Value.trim() == '' || !Value) {
                    Value = new Date().curDate();
                }
                if (Value.length == 8) {
                    var year = Value.substr(0, 4);
                    var month = Value.substr(4, 2);
                    var day = Value.substr(6, 2);
                    Value = year + "/" + month + "/" + day;
                }
                if(hi5.WTS_MODE == WTS_TYPE.MTS){
                    Value = Value.replaceAll('/', '-');
                }
                $(inputelement).val(Value);
            }
            else if (propName == "setDate" || propName == "readOnly") {
                if(hi5.WTS_MODE == WTS_TYPE.MTS){   // 모바일웹은 네이티브 date를 사용한다.
                    if(propName == "setDate"){
                        // 임시로 동작오류 방지를 위해 이렇게 변경함..
                        if(Value.length > 8 && Value.indexOf("-") != -1){
                            Value = Value.removeAll("-");
                            this.SetProp("value", Value);
                        }
                        ////////////////////////////////////////////
                        else{
                            var curDate = this.GetProp("value");
                            var preDate = new Date(parseInt(curDate.substr(0,4)), parseInt(curDate.substr(4,2)) - 1, parseInt(curDate.substr(6,2)));
                            preDate.setDate(preDate.getDate() + parseInt(Value));
                            var newDateObj = hi5.getUTCLocalTime(preDate.getTime());
                            this.SetProp("value", newDateObj.local.yy + newDateObj.local.mm + newDateObj.local.dd);
                        }
                    }
                }
                else{
                    $(inputelement).datepicker(propName, Value);
                }
            }
            else if (propName == "tabindex") {
                $element.attr(propName, Value);
            }
            else if (propName == "curMonth"){
                this.curMonth = Value;
                $element.children(".calShowText").html(Value.substring(0,4) + "." + Value.substring(4,6));
                if (this.OnChanged)
                    this.OnChanged.call(this, Value);
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
            var $element = this.GetDataElement();
            $($element).focus();
        },

        /// <member id="GetNextMonth" kind="method">
        /// <summary>다음/이전 년월 구하기</summary>
        /// <remarks>다음/이전 년월 구하기</remarks>
        /// </member>
        GetNextMonth : function(month, prev){
            if(!month) return;
            var nYear = parseInt(month.substring(0,4));
            var nMonth = parseInt(month.substring(4,6));
            if(prev){
                nMonth -= 1;
                if(nMonth < 1) {
                    nMonth = 12;
                    nYear -= 1;
                }
            }
            else{
                nMonth += 1;
                if(nMonth > 12) {
                    nMonth = 1;
                    nYear += 1;
                }
            }

            if(nMonth < 10) nMonth = "0" + nMonth;
            return nYear.toString() + nMonth.toString();
        }
    }

    /* events */
    /// <member id="OnChanged" kind="event" default="true">
    /// <summary>날짜가 변경되었을때 발생되는 이벤트</summary>
    /// <remarks>날짜를 입력하거나 선택했을때 발생되는 이벤트</remarks>
    /// <example>cal_1.OnChanged();
    /// </example>
    /// </member>
    //calendar.prototype.OnChanged = function () {
    //    var fn = this.objParentForm.getIsEventName(this.id, "OnChanged");
    //    if (fn != null) fn();
    //}
    
    calendar.ctlName = "calendar";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(calendar.ctlName, calendar);

    return calendar;
}());
