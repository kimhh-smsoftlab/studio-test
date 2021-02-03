//groupbox.js
(function () {
    'use strict';

    var groupbox = function () {
        this.scrollObj = null;
        this.customtooltip = {};
    }

    groupbox.prototype = {
        // 각 컨트롤의 파괴함수
        onDestroy: function () {
            if (hi5.WTS_MODE != WTS_TYPE.MTS) {
                if (this.scrollInfo && this.scrollInfo.scroll) {
                    if(this.scrollObj)
                        this.scrollObj.destroy();
                }
                // splitter 컨테이너를사용시 객체 파괴
                var data = this.$html.data('splitter');
                if (data) {
                    data.destroy();
                }
            }

        },

        propertyLoad : function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_groupbox"],
                style = [],
                attr = { id: "" },
                dataCell = "";  // caption

            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            //var objXML = x2h.getXML2Control(node, this, attr, cls, style);
            var objXML;
            if (x2h.getXML2JSON) {
                objXML = x2h.getXML2JSON(node, this, attr, cls, style);
            } else {
                // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
                objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                    // CDDATA 정보를 포함한 속석명 지정
                    return ["multi_lang"];
                });
            }
            //var objXML = x2h.getXML2Control(node, this, attr, cls, style);

            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            style = x2h.attri(xmlHolderElement, attr);

            //debugger;
            //custom combo를 만들기 위한 작업
            // var wrapperEle = document.createElement("div");
            // wrapperEle.setAttribute("class", this.id + "_wrapperDiv");
            // xmlHolderElement.appendChild(wrapperEle);

            if (hi5.WTS_MODE != WTS_TYPE.MTS) {
                if (style["overflow-y"] != "" || style["overflow-x"] != "" || style["overflow"] != "") {
                    this.scrollInfo = { scroll: "y" };
                }
            }

            if (objXML.disabled) {
                this.Disabled(true);
            }
        },

        onInitAfter : function () {
            var obj = this;
            var $elem = this.$html;

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

           // if (hi5.WTS_MODE != WTS_TYPE.MTS) {
                if (this.scrollInfo && this.scrollInfo.scroll) {
                    //debugger;
                    $("#" + this.id).css("overflow","hidden");
                    var options = {
                        scrollbars: true
                        , mouseWheel: true
                        , bindToWrapper: false
                        , disablePointer: true
                        , disableMouse: true
                        , bounce: false
                        , interactiveScrollbars: true
                        , useWrapperSize: false
                        , useTransform : false
                        , scrollY: true
                        , scrollX: true
                        //, rectRealSize: { top: 0, left: 0, width: 0, height: 0 }
                    }
                    var scrollDiv = $("#" + this.id)[0];
                    var wrapDiv = $("#" + this.id).children()[0] || scrollDiv;
                    var isyObj = new iScroll(scrollDiv,wrapDiv,options);
                    obj.scrollObj = isyObj;
                    scrollDiv.addEventListener("iscrollmove", function (e) {
                        this.scrollTop = e.subData.y * -1;
                        //self._gPQ.scrollY(e.subData.y * -1);
                        //self._gPQ.scrollX(e.subData.x * -1);
                    });
                }
           // }
        },

        SetScrollWrapEle : function(ele){
            var options = {
                scrollbars: true
                , mouseWheel: true
                , bindToWrapper: false
                , disablePointer: true
                , disableMouse: true
                , bounce: false
                , interactiveScrollbars: true
                , useWrapperSize: false
                , scrollY: true
                , scrollX: true
                //, rectRealSize: { top: 0, left: 0, width: 0, height: 0 }
            }
            var scrollDiv = $("#" + this.id)[0];
            var wrapDiv = $("#" + this.id).children()[0] || scrollDiv;
            var isyObj = new iScroll(scrollDiv,wrapDiv,options);
            this.scrollObj = isyObj;
            scrollDiv.addEventListener("iscrollmove", function (e) {
                this.scrollTop = e.subData.y * -1;
                //self._gPQ.scrollY(e.subData.y * -1);
                //self._gPQ.scrollX(e.subData.x * -1);
            });
            //this.SetScrollResize();
        },

        SetScrollResize : function(){
            var scEle = $("#" + this.id).children()[0] || $("#" + this.id)[0];
            var wrapDiv = hi5.getStyle(scEle);
            this.scrollObj.resize({ top: 0, left: 0, width: wrapDiv.width.removeAll("px"), height: wrapDiv.height.removeAll("px") });
        },

        GetElemnt : function () {
            return this.$html;
        },

        // disabled 됐을때 동작(css disabled 동일)
        Disabled : function (state) {
            if (state == undefined) return;
            var cssStyle = {};
            var $elem = this.$html;
            if (state == true || state == "disabled" || state == "true") {
                cssStyle = hi5.getCustomStyle(this, "disable");
            }
            else {
                cssStyle = hi5.getCustomStyle(this, "default");
            }

            if (cssStyle)
                $elem.css(cssStyle);
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
            val = $element.attr(propName);
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

            typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
            if (propName == "disabled") {
                this.Disabled(Value);
            }
        },

        /// <member id="DataClear" kind="method">
        /// <summary>해당 그룹박스 내에 입력필드의 값들을 모두 초기화</summary>
        /// <remarks>체크박스, 입력된 텍스트 등 모두 초기화</remarks>
        /// <example><![CDATA[
        ///     gb_1.DataClear();
        /// ]]></example>
        /// </member>
        DataClear : function () {
            var obj = this;
            var $elem = this.$html;
            //uncheck all checkboxes
            $elem.find(':checkbox').each(function () {
                jQuery(this).prop('checked', false);
            });

            //clear all text
            $elem.find('.hi5_maskedit').each(function () {
                jQuery(this).val("");
            });

            $elem.find('textarea').each(function () {
                jQuery(this).val("");
            });
        },

        /// <member id="SetScrollTop" kind="method">
        /// <summary>그룹박스 세로scroll 위치 조정</summary>
        /// <remarks>스크롤의 위치를 %로 입력하면 해당 위치로 이동한다.</remarks>
        /// <param name="nPos" type="number"> 스크롤 위치값(%) </param>
        /// <example><![CDATA[
        ///     gb_1.SetScrollTop(50); gb_1의 높이의 반으로 이동
        /// ]]></example>
        /// </member>
        SetScrollTop: function (nPos) {
            var $elem = this.$html;
            var height = $elem.height();
            var contentHeight = $("#" + this.id + " .mCSB_container").height();
            if (hi5.WTS_MODE != WTS_TYPE.MTS) {
                var fPos = (contentHeight - height) * (nPos / 100);
                //if (!contentHeight || !height) {
                //    $("#" + this.id).mCustomScrollbar("scrollTo", "top");
                //}
                //else {
                //    $("#" + this.id).mCustomScrollbar("scrollTo", fPos);
                //}
            } else {
                var fPos = height * (nPos / 100);

                $elem.scrollTop(fPos);
            }
        }
    }

    groupbox.ctlName = "groupbox";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(groupbox.ctlName, groupbox);
	return groupbox;
}());
