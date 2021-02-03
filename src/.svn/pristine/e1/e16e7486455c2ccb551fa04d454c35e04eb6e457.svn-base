//******************************************************************/
// All Rights Reserved. Copyright(c)   2017 Korea Sorimachi Ltd.Co  /
//******************************************************************/
/*! File Name     : web.js
/*! Function      :	web control
/*! System Name   : HTML5 Project
/*! Create        :
/*! Update        :
/*! Comment       :
//******************************************************************/

(function () {
    'use strict';

    var web = function () {
        this.url = "";
    }

    web.prototype = {
        propertyLoad: function (node, nodeName, xmlHolderElement) {

            var that = this,
                objAttriRemove = ["url"],
                style = [],
                cls = ["hi5_web"],
                attr = { id: "" ,disable:""};

            var objXML = x2h.getXML2Control(node, this, attr, cls, style);
            attr["class"] = cls.join(" ");

           // var ctrltype = "normal";
            
            if (style.length)
                attr["style"] = style.join("");
         
            //this.setActionStyle(node, ctrltype);

            style = x2h.attri(xmlHolderElement, attr);

            var iframeTag = x2h.createXmlElement(xmlHolderElement, "iframe");
            xmlHolderElement.appendChild(iframeTag);
        
            attr = { width: "100%", height: "100%", className: "webFrame", frameborder: "0", src: objXML.url === undefined ? "" : objXML.url };
            style = x2h.attri(iframeTag, attr);
        
        return;
        },

        SetUrl: function (url) {
            var $element = this.GetElemnt();
            $element[0].childNodes[0].setAttribute('src', url);
        },

        
        GetElemnt: function () {
            //var self = this, $element = $("#" + self.id);

            return this.$html;
        },

        // disabled 됐을때 동작(css disabled 동일)
        Disabled: function (state) {
            if (state == undefined) return;
            var cssstyle = {};
            var $element = this.GetElement();
            if (state == true || state == "disabled" || state == "true") {
                cssstyle = hi5.getCustomStyle(this, "disable");
            }
            else {
                cssstyle = hi5.getCustomStyle(this, "default");
            }

            if (cssstyle)
                $element.css(cssstyle);
        },


        /* method */
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

            if (propName == "url") {
                propName = "src";
            }
            val = $element.attr(propName);
            return val;
        },

        /// <member id="SetProp" kind="method">
        /// <summary>속성 정보를 변경하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 제어하는 함수</remarks>
        /// <param name = "propName" type="string"> 스타일 정보</param>
        /// <param name = "value" type="string"> 셀 아이템명</param>
        /// </member>
        SetProp: function (propName, Value) {
            var $element = this.GetElemnt();

            if (propName == "url") {
                $element[0].childNodes[0].setAttribute("src", Value);
            } else if (propName === "html") {
                $element.children(".webFrame")[0].contentWindow.document.getElementsByTagName("body")[0].innerHTML = Value;
            }
            else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
            }
        },

        OnGetData: function (value) {
            this.SetProp("url", value);
        }
    }

    web.ctlName = "web";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(web.ctlName, web);
    return web;
}());
