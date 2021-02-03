//password.js
(function () {
    'use strict';

    var password = function () {
        this.maxlength = "";

        this.itemflag = "1";
        this.encryptmode = false;
        this.objParentForm = "";

        this.verify = false;    //검증 서비스 호출 여부
        this.verified = false;  //비번 사전검증 여부
        this.acctno = "";       //연동된 계좌번호

        this.onlyNm = false;    //숫자만
    }
    //컨트롤 html 스크립트 생성
    password.prototype={
        propertyLoad : function (node, nodeName, xmlHolderElement) {
            
            var that = this,
                cls = ["hi5_password"], // 클래스 정보명 
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "", disabled: "", type: 'password', autocomplete: "new-password", maxlength : "" }, // HTML Attri 정의하는 정보 설정
                dataCell = "";  // placeholder

            var objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                return ["multi_lang"];
            });
            
            if (style.length)
                attr["style"] = style.join("");
       
            if (objXML.multi_lang) {
                if (hi5.WTS_MODE != WTS_TYPE.MDI) {
                    objXML.multi_lang["placeholder"].en = "Password";
                    objXML.multi_lang["placeholder"].jp = "パスワード";
                    objXML.multi_lang["placeholder"].ko = "비밀번호";
                }
                dataCell = x2h.xmlGetMultiLangText(objXML.multi_lang, "placeholder");
                dataCell = x2h.getMultiLineText(dataCell);
            }
            xmlHolderElement.placeholder = dataCell;

            attr["class"] = cls.join(" ");
        
            if (objXML.verify) {
               
                attr["maxlength"] = "6";
                var spinnerTag = x2h.createXmlElement(xmlHolderElement, "i");
                xmlHolderElement.appendChild(spinnerTag);
                spinnerTag["className"] = "fa fa-spinner";
            }
            // type속성을 text/password로 변경한다.

            //x2h.xmlSetAttr(xmlHolderElement, "type", "password");
            //x2h.xmlSetAttr(xmlHolderElement, "autocomplete", "new-password");
            if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                attr['readonly'] = true;
            }
            style = x2h.attri(xmlHolderElement, attr);
            if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                style.backgroundColor = '#ddd';
            }

            if (objXML.disabled) {
                this.Disabled(true);
            }
            return;
        }

        //html tag load after
        ,onInitAfter : function () {
            var obj = this;
            var $element = this.GetElemnt();

            if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                $element.on("click", function (e) {
                    var title, tagName;
                    var objOpenData = {
                        value: $(this).val(),
                        pwd: this.id,
                        accno: obj.acctno
                    };

                    title = "password";
                    tagName = "##CNG_PWD";

                    obj.objParentForm.OpenDialog("aat800000", title, tagName, objOpenData, "bottom");
                    //var readOnly = $("#" + this.id).attr("readonly");
                    //if (readOnly) {
                    //    $("#" + this.id).attr("readonly", false);
                    //}
                });
            }
            $element.on("keydown", function (e) {
                obj.verified = false;
                if (obj.onlyNm) {
                    if (e.shiftKey == true) {
                        if (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39) {
                            return;
                        }
                        e.preventDefault();
                        return false;
                    }
                    if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                        if (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 13) {
                            return;
                        }

                        e.preventDefault();
                        return false;
                    }
                }
            });
            var check = 0;
            $element.on("keyup", function (e) {
                var maxlength = $element.attr("maxlength");
                var value = $element.val();
                if (obj.verify == true) {
                    if (e.keyCode == 13) {
                        if (value.length != 6) {
                            if (hi5_pwCheck == 0) {
                                var msg = $hi5_regional.popupmsg.checkpwd;
                                hi5.MessageBox(msg, "Notice", 0, function (ret) {
                                    $element.select();
                                    obj.SetFocus();
                                });
                            } else
                                hi5_pwCheck = 0;
                            return;
                        }
                    }

                    if (value.length == 6) {
                        var acctObj = { accno: obj.acctno, pwd: value, save: false };
                        hi5_account_check(acctObj, function (ret, msgObj) {
                            if (ret) {
                                obj.verified = true;
                                if (obj.OnVerification)
                                    obj.OnVerification.call(obj);

                                if (hi5.WTS_MODE != WTS_TYPE.MTS) {
                                    $element.select();
                                }
                                else {
                                    $element.blur();
                                }
                            }
                            else {
                                obj.verified = false;
                                if (!msgObj) {
                                    return;
                                }

                                hi5.MessageBox(msgObj.MSG_CTNS, $hi5_regional.title.notice, 0, function (ret) {
                                    obj.SetProp("caption", "");
                                    obj.SetFocus();
                                });
                            }
                            return;
                        });
                    }

                    return;
                }

                if (maxlength <= value.length) {
                    if (obj.OnEditFull)
                        obj.OnEditFull.call(obj);
                }
                //if (e.keyCode == 13) {
                //    if (obj.OnEditEnter)
                //        obj.OnEditEnter.call(obj);
                //}
            });

            $element.on("keypress", function (e) {
                if (e.keyCode == 13) {
                    if (obj.OnEditEnter) {
                        obj.OnEditEnter.call(obj);
                        e.preventDefault();
                    }
                }
            });
        }

            // HTML 요소객체 취득
        ,GetElemnt : function () {
            //var self = this, $element = $("#" + self.id);

            return this.$html;
        }

        ,OnWaitCursor : function (bWait) {
            this.SetProp("disabled", bWait);
        }

            /* method */
            /// <member id="GetStyle" kind="method">
            /// <summary>스타일 정보를 취득하는 함수</summary>
            /// <remarks>스타일명으로 모든 스타일을 취득하는 함수 </remarks>
            /// <param name = "style" type="string|object"> 스타일 정보</param>
            /// <returns type="string|object"> 스타일 정보를 반환</returns>
            /// </member>
        ,GetStyle : function (style) {
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
        ,SetStyle : function (style, value) {
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
        ,GetProp : function (propName, option) {
            var $element = this.GetElemnt(), val;

            if (propName == "value" || propName == "encryption") {
                val = $element[0].value;
                // 통신전문을 취득하는 경우
                if ((option != undefined || propName == "encryption") && this.encryptmode) {
                    val = hi5.GetEncriptionValue(val);
                }
            } else if (propName == "encryptmode") {
                return this.encryptmode;
            } else if (propName == "verified") {
                return this.verified;
            } else {
                val = $element.attr(propName);

            }
            return val;
        }


        /// <member id="SetProp" kind="method">
        /// <summary>속성 정보를 변경하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 제어하는 함수</remarks>
        /// <param name = "propName" type="string"> 스타일 정보</param>
        /// <param name = "value" type="string|number|object|array|boolean"> 셀 아이템명</param>
        /// </member>
        ,SetProp : function (propName, Value) {
            var $element = this.GetElemnt();

            if (propName == "caption" || propName == "value") {
                $element.val(Value);
            } else if (propName == "encryptmode") {
                this.encryptmode = Value;
            } else if (propName == "verified") {
                this.verified = Value;
            } else if (propName == "disabled") {
                //var iframedoc = this.getIframeDoc().getElementById("form");
                this.Disabled(Value);            
            } else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
            }
        }

        /// <member id="SetFocus" kind="method">
        /// <summary>해당 컨트롤 focus 주기</summary>
        /// <remarks>해당 컨트롤 focus 주기</remarks>
        /// </member>
        ,SetFocus : function () {
            document.getElementById(this.id).focus();
        }
        /// <member id="CheckValue" kind="method">
        /// <summary>비밀번호 검증</summary>
        /// <remarks>비밀번호 검증</remarks>
        /// <returns type="boolean"> 성공이면 true, 실패면 false </returns>
        /// <example><![CDATA[
        ///            var ret = pw_1.CheckValue();
        /// ]]></example>
        /// </member>
        ,CheckValue : function () {
            var obj = this;
            var $element = this.GetElemnt();

            var value = $element.val();
            if (!value || value == "") {
                var msg = $hi5_regional.popupmsg.checkpwd;
                hi5.MessageBox(msg, "Notice", 0, function (ret) {
                    obj.SetFocus();
                });
                return false;
            }

            return true;
        }

        /* events */
        /// <member id="OnEditFull" kind="event" default="true">
        /// <summary>MaxLength 설정시 해당 길이만큼 입력됐을 시에 발생하는 이벤트</summary>
        /// <remarks>MaxLength 설정시 해당 길이만큼 입력됐을 시에 발생하는 이벤트</remarks>
        /// <example>pw_1.OnEditFull();
        /// </example>
        /// </member>
        //password.prototype.OnEditFull = function () {
        //    var fn = this.objParentForm.getIsEventName(this.id, "OnEditFull");
        //    if (fn != null) fn();
        //}

        /// <member id="OnEditEnter" kind="event">
        /// <summary>키보드 Enter키 입력 시 발생하는 이벤트</summary>
        /// <remarks>키보드 Enter키 입력 시 발생하는 이벤트</remarks>
        /// <example>pw_1.OnEditEnter();
        /// </example>
        /// </member>
        //password.prototype.OnEditEnter = function () {
        //    var fn = this.objParentForm.getIsEventName(this.id, "OnEditEnter");
        //    if (fn != null) fn();
        //}

        /// <member id="OnVerification" kind="event">
        /// <summary>비밀번호 검증 서비스 성공 시 발생하는 이벤트</summary>
        /// <remarks>비밀번호 검증 서비스 성공 시 발생하는 이벤트</remarks>
        /// <example>pw_1.OnVerification();
        /// </example>
        /// </member>
        //password.prototype.OnVerification = function () {
        //    var fn = this.objParentForm.getIsEventName(this.id, "OnVerification");
        //    if (fn != null) fn();
        //}

        ,Disabled: function (state) {
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
        }
    }
    password.ctlName = "password";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(password.ctlName, password);
    return password;
}());
