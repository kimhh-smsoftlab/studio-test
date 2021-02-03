//image.js
(function () {
    'use strict';

    var image = function () {

    }

    image.prototype = {
        // ctrl default style properties
        propertyLoad: function (node, nodeName, xmlHolderElement) {
            var that = this,
                style = [],
                cls = ["hi5_image"],
                attr = { id: "", disable: ""};

            var objXML = x2h.getXML2Control(node, this, attr, cls, style);
            if (objXML["background-image"])
                attr["background-image"] = "url(" + objXML["background-image"] + ")";
            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            // End Tag를 추가하기위해서 반드시 추가한다. 
            style = x2h.attri(xmlHolderElement, attr);

            // Input tag인 경우 XML에서는 textNode 미 적용시킨다.
            //if (x2h.getNodeName(xmlHolderElement) == "input") {
            //    x2h.xmlSetAttr(xmlHolderElement, "type", nodeName);
            //}
            return;
        }

        , onInitAfter: function () {
            var obj = this;
            var $element = this.GetElemnt();
            // binding events
            // no events for image control
            // click
            $element.on('click', function () {
                if (obj.OnClick)
                    obj.OnClick.call(obj);
            });

            return;
        }

            // HTML 요소객체 취득
        , GetElemnt: function () {
            //var self = this, $element = $("#" + self.id);

            return this.$html;
        }

            // disabled 됐을때 동작(css disabled 동일)
        , Disabled: function (state) {
            if (state == undefined) return;
            var cssstyle = {};
            var $element = this.GetElemnt();
            if (state == true || state == "disabled" || state == "true") {
                cssstyle = hi5.getCustomStyle(this, "disable");
            }
            else {
                cssstyle = hi5.getCustomStyle(this, "default");
            }

            if (cssstyle)
                $element.css(cssstyle);
        }


        /* method */
        /// <member id="GetStyle" kind="method">
        /// <summary>스타일 정보를 취득하는 함수</summary>
        /// <remarks>스타일명으로 모든 스타일을 취득하는 함수 </remarks>
        /// <param name = "style" type="string|object"> 스타일 정보</param>
        /// <returns type="string|object"> 스타일 정보를 반환</returns>
        /// </member>
        , GetStyle: function (style) {
            var $element = this.GetElemnt(), val;
            val = $element.css(style);

            return val;
        }

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
        , SetStyle: function (style, value) {
            var $element = this.GetElemnt();
            typeof (style) === "object" ? $element.css(style) : $element.css(style, value);
            return;
        }

        /// <member id="GetProp" kind="method">
        /// <summary>속성정보를 취득하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 취득 </remarks>
        /// <param name = "propName" type="string|array"> 속성 정보</param>
        /// <returns type="string|array"> 속성정보를 반환</returns>
        /// </member>
        , GetProp: function (propName) {
            var $element = this.GetElemnt(), val;

            if (propName == "caption") {
                val = $element.text();
            }
            else if (propName == "qrcode") {
                val = this.qrcodeText;
            }
            else {
                val = $element.attr(propName);
            }
            return val;
        }

        /// <member id="SetProp" kind="method">
        /// <summary>속성 정보를 변경하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 제어하는 함수</remarks>
        /// <param name = "propName" type="string"> 스타일 정보</param>
        /// <param name = "value" type="string"> 셀 아이템명</param>
        /// </member>
        , SetProp: function (propName, Value) {
            var $element = this.GetElemnt();
            var self = this;

            if (propName == "caption") {
                $element.text(Value);
            }
            else if (propName == "qrcode") {
                this.qrcodeText = Value;
                if (Value == "") {
                    if (self.oQRCode) {
                        self.oQRCode.clear(); // Clear the QRCode.
                    }
                    $element.hide();
                    return;
                }

                if (this.qrcodeText != null) { // 객체 qrcodeText 속성 확인후 진행
                    //-->[Edit] 2019/11/28 lee nohan
                    // 수정내용: qrcode가 생성이 안되는 현상
                    $element.show();
                    //--[Edit] 2019/11/28 lee nohan
                    if (self.oQRCode) {
                        //-->[Edit] 2019/11/28 lee nohan
                        // 수정내용: qrcode가 생성이 안되는 현상
                        // Element를 처음에 Value가 없는상태에서 hide()가 되어있는데, 여기서 show()를 해주면, 안되고 이 if문 밖에서 해줘야한다....
                        //$element.show();
                        var oQRCode = self.oQRCode;
                        //--[Edit] 2019/11/28 lee nohan
                        oQRCode.clear(); // Clear the QRCode.
                        oQRCode.makeCode(this.qrcodeText); // Re-create the QRCode.
                        return;
                    }

                    var deps = [hi5_dev_mode == "dev" ? 'lib/qrcode' : 'lib/qrcode'];
                    hi5.requireJS(deps, function () {
                        self.oQRCode = new QRCode(
                        self.id,  // 이 엘리먼트 하위에 img 태그를 만들어 담음
                        //옵션값으로 text(QRCode), width, height,colorDark, colorLight, correctLevel(아마도 QrCode의 픽셀해상도 같음
                        //correctLevel_L,correctLevel_M,correctLevel_Q,correctLevel_H 가 있음)
                        {
                            text: self.qrcodeText,
                            width: document.getElementById(self.id).clientWidth,
                            height: document.getElementById(self.id).clientHeight
                        });

                        //이거 왜 사용을 안한다고 지워버리고있지..?잘모르겠어서..일단 살려둠...지우고하나,안지우고하나 동일한듯..확인결과..
                        //$("#" + self.id + " > #QRCodeCanvas").remove(); // Canvas는 사용하지 않음
                    },
                    { cb: "5" });  // cachebuster값 지정
                }
            }
            else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
                if (propName == "disabled") {
                    this.Disabled(Value);
                }
            }
        }

        /* events */
        /// <member id="OnClick" kind="event" default="true">
        /// <summary>이미지를 클릭했을 때 발생되는 이벤트</summary>
        /// <remarks>이미지를 클릭했을 때 발생되는 이벤트</remarks>
        /// <example>img_1.OnClick();
        /// </example>
        /// </member>
        //image.prototype.OnClick = function () {
        //    var fn = this.objParentForm.getIsEventName(this.id, "OnClick");
        //    if (fn != null) fn();
        //}
    }
    image.ctlName = "image";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(image.ctlName, image);
    return image;
}());
