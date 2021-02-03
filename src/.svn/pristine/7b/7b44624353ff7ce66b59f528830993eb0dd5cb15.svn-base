//edit.js
(function () {
    'use strict';

    var edit = function () {
        this.itemflag = "1";
        this.maxlength = 0;
    }

    edit.prototype = {
        // 각 컨트롤의 파괴함수
        onDestroy: function () {
            // summernote 사용시, destroy 호출
            if (this.$html.hasClass("summer")) {
                $('#' + this.id).summernote('destroy');
            }
        },
        propertyLoad : function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_edit"], // 클래스 정보명 
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "", disabled: "" }, // HTML Attri 정의하는 정보 설정
                dataCell = "";  // caption
            
            var objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                // CDDATA 정보를 포함한 속성명 지정(Edit => multi_lang 사용)
                return ["multi_lang"];
            });

            if (objXML.maxlength)
                this.maxlength = objXML.maxlength;
            
            // stylecolor 정보를 객체로 변환한다(String->JSON)
            if (objXML.stylecolor)
                this.styleColor = x2h.defaultStyle(objXML.stylecolor, false);

            //class 지정
            attr["class"] = cls.join(" ");

            if (objXML["readOnly"]) // readonly 속성 추가 2019.02.21 kws
                attr['readOnly'] = true;

            if (style.length)
                attr["style"] = style.join("");
            
            if (objXML.multi_lang) {
                dataCell = x2h.xmlGetMultiLangText(objXML.multi_lang, "caption");
                //if (dataCell != "" )
                //    dataCell = x2h.getMultiLineText(dataCell);
            }

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);
            xmlHolderElement.textContent = dataCell;
            return;
        },
        onInitAfter : function () {
            var obj = this, $self = this.$html;
            //var ogHeight = this.$html.height();
            // 2019.07.18 손기원
            // 화면높이보다 영역이 더 크게 잡히면 안된다.
            // body높이가 화면높이보다 작을때, height랑 minHeight가 maxHeight를 넘어선다.
            var ogHeight = this.$html.outerHeight();
            var maxHeight = $(window).height() - this.$html.position().top - this.$html.parents('.form').offset().top - 60;
            ogHeight = maxHeight < ogHeight ? maxHeight : ogHeight - 50;    // 50px은 하단바 표시. maxHeight가 넘어갈땐 하단 바도 표시가 안됨.

            if (this.$html.hasClass("summer")) {
                $('#' + this.id).summernote({
                    //height: this.$html.height(),
                    height : ogHeight,
                    lang: local_lang,
                    //minHeight: this.$html.height(),
                    minHeight : ogHeight,
                    //maxHeight: $(window).height() - this.$html.position().top - this.$html.parents('.form').offset().top-60
                    maxHeight : maxHeight
                });
                $(window).resize(function () {
                    if ($('div.note-editable').length!=0){
                        var that = $('div.note-editable');
                        if (that.parents().hasClass('maximized')) {
                            var height = $(window).height() - that.offset().top -5;
                            that.css('max-height', height)
                            that.height(height);
                            $(".note-resizebar").css('display', 'none');
                        } else {
                            $(".note-resizebar").css('display', 'block');
                            that.height(ogHeight - that.offset().top - 10);
                            that.css('max-height', $(window).height() - that.offset().top - 15);
                        }
                    }
                });

                // disabled 처리
                if ($self[0].disabled)
                    $('#' + this.id).summernote('disable');
                else
                    $('#' + this.id).summernote('enable');

                // readOnly일 경우 toolbar를 지우겠다.
                
                if($self[0].readOnly) {
                    $('#' + $self[0].id).next().find('.note-toolbar').remove();
                    // 지우면 높이 차이가 생겨서 늘려준다.
                    var editTable = $('#' + $self[0].id).next().find('.note-editable');
                    var newHeight = (Number(editTable.css('min-height').replace('px','')) + 41) + 'px';
                    editTable.css('min-height', newHeight);
                    editTable.css('height', newHeight);
                }
            }
           
            if ($self[0].disabled == true) {
                this.Disabled(true);
            }

            hi5.on($self[0], "keyup", function (e) {
                var maxlength = obj.maxlength;
                var value = $self.val();

                if (maxlength <= value.length) {
                    if (obj.OnEditFull)
                        obj.OnEditFull.call(obj);
                }
                else {
                    if (e.keyCode == 13) {
                        if (obj.OnEditEnter)
                            obj.OnEditEnter.call(obj);
                    } else {
                        if (obj.OnChange)
                            obj.OnChange.call(obj);
                    }
                }
            });
        },
        // HTML 요소객체 취득
        GetElemnt : function () {
            return this.$html;
        },
        OnGetData: function (value) {
            this.SetProp("caption", value);
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
                $("#" + this.id).css(cssstyle);
        },
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

            if (propName == "caption" || propName == "value") {
                //val = $element.text();
                if (this.$html.hasClass("summer")) {
                    val = $('#' + this.id).summernote('code');
                }
                else {
                    val = $("#" + $element[0].id).val();
                }
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
                //$element.text(Value);
                if (this.$html.hasClass("summer")) {
                    $('#' + this.id).summernote('code', Value);
                }
                else {
                    $("#" + $element[0].id).val(Value);
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
            document.getElementById(this.id).focus();
        },
        /* events */
        /// <member id="OnEditFull" kind="event" default="true">
        /// <summary>MaxLength 설정시 해당 길이만큼 입력됐을 시에 발생하는 이벤트</summary>
        /// <remarks>MaxLength 설정시 해당 길이만큼 입력됐을 시에 발생하는 이벤트</remarks>
        /// <example>ed_1.OnEditFull();
        /// </example>
        /// </member>
        //edit.prototype.OnEditFull = function () {
        //    var fn = this.objParentForm.getIsEventName(this.id, "OnEditFull");
        //    if (fn != null) fn();
        //}

        /// <member id="OnEditEnter" kind="event">
        /// <summary>키보드 Enter키 입력 시 발생하는 이벤트</summary>
        /// <remarks>키보드 Enter키 입력 시 발생하는 이벤트</remarks>
        /// <example>ed_1.OnEditEnter();
        /// </example>
        /// </member>
        //edit.prototype.OnEditEnter = function () {
        //    var fn = this.objParentForm.getIsEventName(this.id, "OnEditEnter");
        //    if (fn != null) fn();
        //}

        /// <member id="OnChange" kind="event">
        /// <summary>키 입력시 발생하는 이벤트</summary>
        /// <remarks>키 입력시 발생하는 이벤트</remarks>
        /// <example>ed_1.OnChange();
        /// </example>
        /// </member>
        //edit.prototype.OnChange = function () {
        //    var fn = this.objParentForm.getIsEventName(this.id, "OnChange");
        //    if (fn != null) fn();
        //}
    }

    edit.ctlName = "edit";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(edit.ctlName, edit);
    return edit;
}());
