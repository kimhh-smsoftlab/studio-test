
(function () {
    'use strict';

    var div = function () { }

    div.prototype ={
        propertyLoad : function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ['hi5_div'],
                attr = { id: ""},
                style = [];

            var objXML = x2h.getXML2Control(node, this, attr, cls, style);
            attr["class"] = cls.join(" ");
            if (style.length)
                attr["style"] = style.join("");

            //if (objXML.html) {
            //    this.html = x2h.xmlGetText(node);
            //}
            if (objXML.html) {
                this.html = x2h.xmlGetText(node);
                // --> [Edit] 기능추가:kim changa 일시:2019/01/10
                // 수정내용>  html 속성중에 @@+파일명+?+cachebuster  ->@@testhtml?cb=1
                if (this.html.indexOf('@@') == 0) {
                    var url = this.html.replace('@@', '');
                    this.html = "";
                    // HTML Text 다운로드 후 삽입을 한다.
                    hi5.getHTMLData({ filename: url }, function (text) {
                        if (text.length > 0)
                            that.$html.append(text);
                    })
                    // <-- [Edit] kim changa 2019/01/10
                }
                else{
                    that.$html.append(this.html);	// 순수html내용을 입력한다. 2019/08/12 kws
                }
            }

            style = x2h.attri(xmlHolderElement, attr);
            return;   
        },
    
        // HTML 요소객체 취득
   
        GetElemnt : function () {
            //var self = this, $element = $("#" + self.id);
            return this.$html;
        },
    

    /// <member id="GetStyle" kind="method">
    /// <summary>스타일 정보를 취득하는 함수</summary>
    /// <remarks>스타일명으로 모든 스타일을 취득하는 함수 </remarks>
    /// <param name = "style" type="string|object"> 스타일 정보</param>
    /// <returns type="string|object"> 스타일 정보를 반환</returns>
    /// </member>
   
        GetStyle : function (style) {
            var $element = this.GetElemnt(), val = null;
            if ($element.length() > 0)
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
            var $element = this.GetElemnt(), val = "";
            if (propName == "html") {
                val = this.html;
                this.html = "";
            } else {
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
            typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
        }
    }
    div.ctlName = "div";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(div.ctlName, div);
    return div;
}());