//maskedit.js
(function () {
    'use strict';

    var maskedit = function () {
        this.itemflag = "1";
        this.value = "";
        this.mask = "";
        this.maxlength = 0;
    }

    maskedit.prototype = {
        propertyLoad : function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_maskedit"], // 클래스 정보명 
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "", disabled: "", maxlength: "" }, // HTML Attri 정의하는 정보 설정
                dataCell = "", placeHolder = "";  // caption

            var objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                // CDDATA 정보를 포함한 속성명 지정(Edit => multi_lang 사용)
                return ["multi_lang"];
            });

            if(objXML.maxlength)
                this.maxlength = objXML.maxlength;

            // stylecolor 정보를 객체로 변환한다(String->JSON)
            if (objXML.stylecolor)
                this.styleColor = x2h.defaultStyle(objXML.stylecolor, false);

            //class 지정
            attr["class"] = cls.join(" ");

            if (objXML["readOnly"]) // readonly 속성 추가 2019.02.21 kws
                attr['readonly'] = true;

            if (style.length)
                attr["style"] = style.join("");

            if (objXML.multi_lang) {
                // --> [Edit] 수정자:kim changa 일시:2019/02/01
                // 수정내용> placeholder 속성 처리
                dataCell = x2h.xmlGetMultiLangText(objXML.multi_lang, "placeholder");
                if (dataCell != "") xmlHolderElement.placeholder = dataCell;
                // <-- [Edit] kim changa 2019/02/01

                dataCell = x2h.xmlGetMultiLangText(objXML.multi_lang, "caption");
                if (dataCell != "")
                    dataCell = x2h.getMultiLineText(dataCell);
            }

            this.mask = hi5.clone(maskstr.GetMaskInfo(node));
            if (this.maxlength == 0) {
                this.maxlength = maskstr.GetMaskMaxLength(this.mask);
            }
            else {  // 2019.03.20 kws - maxlength 조정, 숫자형식인데 소숫점이 지정되어있으면 그만큼 maxlength를 늘려준다.
                if (this.mask.gubun == "1" && this.mask.decimal == 1 && this.mask.decnum != "0") {
                    attr["maxlength"] = parseInt(objXML.maxlength) + this.mask.decnum + 1;
                }
			}
			
			// 2019.09.18 kws
			// 모바일 브라우져에서 숫자만 입력 가능할 때 키패드를 숫자형식으로...
			// type을 number 보다는 tel로 많이 사용.
			if(hi5.WTS_MODE == WTS_TYPE.MTS){
				if (this.mask.gubun == "0") {
					switch (this.mask.type) {
						case "1":   //Day
						case "2":   //Time
						case "3":   //Day+Time
						case "4":   //Telephone
						case "5":   //ACCT Number
						case "8":   //HandPhone
						case "11":  //Post Code
							attr["type"] = "tel";
							break;
					}
				}
				else if (this.mask.gubun == "1") {
				    if (hi5.GetMobile_info() == 'I') {
				        var v =(navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
				        if ((v[1]+'.'+v[2]).atof() >= 12.2) {
				            attr["type"] = "text";
				            attr["inputmode"] = "decimal";
				        } else {
				            attr["type"] = "number";
				        }
				    }
				    else if (hi5.GetMobile_info() == 'A')
				        attr["type"] = "tel";
				}
			}

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);
            //xmlHolderElement.textContent = dataCell;
           
            this.value = dataCell;

            if (objXML.disabled) {
                this.Disabled(true);
            }
            return;
	    },
        onInitAfter: function () {
            var obj = this, $self = this.$html, elem = $self[0];
            if (obj.objParentForm.linkcode == true && obj.orgid == 'me_id') {
                obj.$html.addClass('linkedID');
                var linkcode = JSON.parse(sessionStorage.getItem("scrLink"));
                if (obj.objParentForm.linkcode == true && (!linkcode || !linkcode[obj.objParentForm.$html.attr('scrid')] || linkcode[obj.objParentForm.$html.attr('scrid')]) != 0) {
                    if (obj.orgid == 'me_id' && hi5.SHMEM.qryId) {
                        obj.value = hi5.SHMEM.qryId;
                    }
                }
            }
	        var newValue = maskstr.GetMaskValue(this.mask, this.value);
	        $self.val(newValue);

	        hi5.on(elem, "focusin", function (event) {
	            if (obj.mask.type == "99") {
	                return;
	            }
	            var newValue = maskstr.GetUnMaskedValue(obj.mask, $self.val());
	            $self.val(newValue);
	            this.select();
	        });

	        hi5.on(elem, "focusout", function (event) {
	            /*if (obj.mask.gubun == "0") {
	                switch (obj.mask.type) {
	                    case "1":   //Day
	                    case "2":   //Time
	                    case "3":   //Day+Time
	                    case "4":   //Telephone
	                    case "5":   //ACCT Number
	                    case "8":   //HandPhone
	                    case "11":  //Post Code
	                        if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
	                            $(this).val($(this).val().replace(/[^0-9]/gi, ''));
	                        }
	                        break;
	                    default:
	                        break;
	                }
	            }
	            if (obj.mask.type == "99") {
	                if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
	                    $(this).val($(this).val().replace(/[^A-Za-z0-9]/gi, ''));
	                }
	                return;
	            }*/
	            if (obj.maxlength) {
	                obj.mask["maxlength"] = obj.maxlength;
				}

	            var newValue = maskstr.GetMaskValue(obj.mask, $self.val());
				$self.val(newValue);
			});
			
			// 복사 붙여넣기 추가
			// 다만 붙여넣기 시에 들어오는 이벤트라 값을 취득을 못하니 setTimeout 0.5초를 줘서 값이 입력된 후에 이벤트 호출을 한다.
			// 이 부분은 테스트 많이 필요하다.
			$(elem).on('paste', function(e){
				//if(hi5.WTS_MODE == WTS_TYPE.MTS){
					if (obj.OnChange){
						setTimeout(function(){
							obj.OnChange.call(obj);
						}, 500);
					}

					return;
				//}
			});
	        var textvalue;
	        hi5.on(elem, "keydown", function (e) {
				if(e.ctrlKey){
	        		if(e.keyCode == 86){	// ctrl + v paste
	        			return;
	        		}
				}
				
	            if (e.shiftKey == true) {
	                if (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39) {
	                }
	                else {
	                    if (obj.mask.gubun == "0") {
	                        switch (obj.mask.type) {
	                            case "1":   //Day
	                            case "2":   //Time
	                            case "3":   //Day+Time
	                            case "4":   //Telephone
	                            case "5":   //ACCT Number
	                            case "8":   //HandPhone
	                            case "11":  //Post Code
	                                e.preventDefault();
	                                return false;
	                            default:
	                                break;
	                        }
	                    }
	                    else if (obj.mask.gubun == "1") {
	                        e.preventDefault();
	                        return false;
	                    }
	                }
	            }

	            var value = $self.val();
	            if (obj.mask.gubun == "1") {
	                if (obj.mask.decimal == 1 && obj.mask.decnum == "0") {  //소숫점 처리를 하면서 소숫점 자리수가 0일때는 "." 입력을 원천 차단
	                    if (e.keyCode == 190 || e.keyCode == 110) {
	                        e.preventDefault();
	                        return false;
	                    }
	                }

	                //var value = $self.val();
	                if ((e.keyCode >= 48 && e.keyCode <= 57) ||
                        (e.keyCode >= 96 && e.keyCode <= 105) ||
                        e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 37 ||
                        e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 190 || e.keyCode == 110) {

	                    if (e.keyCode == 190 || e.keyCode == 110) {
	                        if (value.indexOf('.') !== -1) {
	                            e.preventDefault();
	                            return false;
	                        }
	                        else if (value.length == 0) {
	                            //$self.val("0");
	                        }
	                    }

	                    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
	                        var p = value.split(".");
	                        if (p[1]) {
	                            if (p[1].length >= obj.mask.decnum) {
	                                //입력 위치에 따라 막아야한다.
	                                if (e.target.selectionStart == e.target.selectionEnd && e.target.selectionStart >= value.length - obj.mask.decnum) {
	                                    e.preventDefault();
	                                    return false;
	                                }
	                            }
	                        }
	                        value = p[0].removeAll(",");
	                    }
	                }
	            }
	            else {
	                if (obj.mask.type) {
	                    switch (obj.mask.type) {
	                        case "1":   //Day
	                        case "2":   //Time
	                        case "3":   //Day+Time
	                        case "4":   //Telephone
	                        case "5":   //ACCT Number
	                        case "8":   //HandPhone
	                        case "11":  //Post Code
	                            if ((e.keyCode >= 48 && e.keyCode <= 57) ||
                                    (e.keyCode >= 96 && e.keyCode <= 105) ||
                                    e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 37 ||
                                    e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 190 || e.keyCode == 110) {
	                                if (((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) && value.length >= obj.maxlength) {
	                                    //입력 위치에 따라 막아야한다.
	                                    if (event.target.selectionStart == event.target.selectionEnd) {
	                                        var valueIndex = value.length;
	                                        if (event.target.selectionStart < valueIndex + 1) {
	                                            event.preventDefault();
	                                            return false;
	                                        }
	                                    }
	                                }
	                            }
	                            else {
	                                event.preventDefault();
	                            }
	                            break;
	                    }
	                }
	                else {
						if (!( e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 37 ||
							e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 190 || e.keyCode == 110) && value.length >= obj.maxlength && obj.maxlength != 0) {
                                    //e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 190 || e.keyCode == 110) && hi5.getByteLen(value) >= obj.maxlength && obj.maxlength != 0) {
	                        e.preventDefault();
	                        return false;
	                    }
	                }
	                return;
	            }

	            if (((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105))) {
	                if(value.length >= obj.maxlength && obj.maxlength > 0){
	                    //입력 위치에 따라 막아야한다.
	                    if (event.target.selectionStart == event.target.selectionEnd) {
	                        var valueIndex = value.length;
	                        if (value.indexOf(".") > 0) {
	                            valueIndex = value.indexOf(".");
	                        }

	                        if (event.target.selectionStart < valueIndex + 1) {
	                            event.preventDefault();
	                            return;
	                        }
	                    }
	                }
	            }
	            else {
	                if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode == 186 || e.keyCode == e.keyCode == 187 || e.keyCode == 188 || e.keyCode == 189 || e.keyCode == 191 || e.keyCode == 192) {
	                    event.preventDefault();
	                    return;
	                }
	            }
	        });

	        hi5.on(elem, "input", function (e) {
	            var value = $self.val();
	            
	            //if (hi5.getByteLen(e.target.value) > obj.maxlength && obj.maxlength != 0) {
				if (e.target.value.length > obj.maxlength && obj.maxlength != 0) {
	                e.target.value = textvalue;
	            } else {
	                textvalue = e.target.value;
	            }
	        });
	        hi5.on(elem, "keyup", function (e) {
				//if(e.ctrlKey){
	        	//	if(e.keyCode == 86){	// ctrl + v paste
	        	//		if (obj.OnChange)
				//			obj.OnChange.call(obj);

				//		return;
	        	//	}
	        	//}
	            var maxlength = obj.maxlength;
	            var value = $self.val();

	            if (obj.mask.gubun == "1") {
	                if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
	                    $(this).val(value.replace(/[^0-9\.\-]/gi, ''));
	                }
	            }

	            if (obj.mask.gubun == "0") {
	                switch (obj.mask.type) {
	                    case "1":   //Day
	                    case "2":   //Time
	                    case "3":   //Day+Time
	                    case "4":   //Telephone
	                    case "5":   //ACCT Number
	                    case "8":   //HandPhone
	                    case "11":  //Post Code
	                        if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
	                            $(this).val(value.replace(/[^0-9]/gi, ''));
	                        }
	                        break;
	                    default:
	                        break;
	                }
	            }

                // 코인주소 형태 추가 2019.03.14
                if (obj.mask.type == "99") {
	                $(this).val(value.replace(/[^A-Za-z0-9.-:]/gi, ''));
	            }

				// 19.03.26 가영 추가(정수부분만 maxlength 잡을 때, 소수부 입력시 onChange 안 타는 현상 방지)
				if(obj.mask.decimal == 1 && obj.mask.decnum > "0") {
					maxlength = Number(maxlength) + obj.mask.decnum;
					maxlength = String(maxlength + 1);
				}

				//if (maxlength > 0 && maxlength <= hi5.getByteLen(value)) {
				if (maxlength > 0 && maxlength <= value.length) {
					if (obj.OnEditFull)
						obj.OnEditFull.call(obj);

					//if (e.keyCode == 13) {
					//    if (obj.OnEditEnter)
					//        obj.OnEditEnter.call(obj);
					//}
				}
				else {
					if (e.keyCode == 13) {
						//if (obj.OnEditEnter)
							//obj.OnEditEnter.call(obj);
					} else {
						if (obj.OnChange)
							obj.OnChange.call(obj);
					}
				}
	        });

	        hi5.on(elem, "keypress", function (e) {
	            if (e.keyCode == 13) {
	                if (obj.OnEditEnter){
	                    obj.OnEditEnter.call(obj);
						e.preventDefault();
					}
	            }
	        });
        },
        OnGetLinkInfo: function (tagName, objData) {
            if (tagName != "queryID") return false;
            var obj = this;

            if (obj.GetProp("disabled") == true) return false;

            obj.SetProp('caption', objData);
            if (obj.OnEditEnter) {
                obj.OnEditEnter.call(obj);
            }
        },
        // HTML 요소객체 취득
        GetElemnt : function () {
	        return this.$html;
        },
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
        OnWaitCursor : function (bWait) {
	        this.SetProp("disabled", bWait);
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

	        if (style === "disablebdcolor" || style === "disablebgcolor" || style === "disablefgcolor") {
	            style =
                style === "disablebdcolor" ? "border-color" :
                style === "disablebgcolor" ? "background-color" :
                style === "disablefgcolor" ? "color" :  //TODO 색상 인덱스 값 가져올 것
                style;
	            val = this.actionstyle["disable"][style];
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
	            val = $element[0].value;
	        }
	        else if (propName == "value") {
	            val = maskstr.GetUnMaskedValue(this.mask, $element[0].value);
	        }
	        else if (propName === "floatstyle" || propName === "placeholder" || propName === "borderStyle" || propName === "opacity" || propName === "textAlign" || propName === "verticalAlign") {
	            propName =
                propName === "floatstyle" ? "float" :
                propName === "borderStyle" ? "border" :
                propName;

	            val = this.GetStyle(propName);
	        }
	        else if (propName === "editstyle" || propName === "attricolor" || propName === "mask" || propName === "itemflag") {
	            val = this[propName];
	        }
	        else if (propName === "css") {
	            val = $element.attr('style');
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
	            Value = maskstr.GetMaskValue(this.mask, Value);
	            $element[0].value = Value;
	        }
	        else if (propName == "value") {
	            Value = maskstr.GetMaskValue(this.mask, Value);
	            $element[0].value = Value;
	        }
	        else if (propName == "mask") {
	            var keylist = Object.keys(Value);
	            if (keylist.length > 0) {
	                for (var x = 0; x < keylist.length; x++) {
	                    this.mask[keylist[x]] = Value[keylist[x]];
	                }
	            }
	        }
	        else {
	            typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
	            if (propName == "disabled") {
	                this.Disabled(Value);
	            }
	        }
        },
        OnGetData: function (value) {
            this.SetProp("value", value);
        },

        /// <member id="SetFocus" kind="method">
        /// <summary>해당 컨트롤 focus 주기</summary>
        /// <remarks>해당 컨트롤 focus 주기</remarks>
        /// </member>
        SetFocus: function () {
            // --> [Edit] 수정자:kim changa 일시:2019/03/28
            // 수정내용> 모바일 에서는 포커스 처리를 무시하기 위해서
            if (hi5_isMoble) return false;
            // <-- [Edit] kim changa 2019/03/28
	        var $element = this.GetElemnt();
	        $element.focus();
        },
        /* events */
        /// <member id="OnEditFull" kind="event" default="true">
        /// <summary>MaxLength 설정시 해당 길이만큼 입력됐을 시에 발생하는 이벤트</summary>
        /// <remarks>MaxLength 설정시 해당 길이만큼 입력됐을 시에 발생하는 이벤트</remarks>
        /// <example>ed_1.OnEditFull();
        /// </example>
        /// </member>
	    //maskedit.prototype.OnEditFull = function () {
	    //    var fn = this.objParentForm.getIsEventName(this.id, "OnEditFull");
	    //    if (fn != null) fn();
	    //}

        /// <member id="OnEditEnter" kind="event">
        /// <summary>키보드 Enter키 입력 시 발생하는 이벤트</summary>
        /// <remarks>키보드 Enter키 입력 시 발생하는 이벤트</remarks>
        /// <example>ed_1.OnEditEnter();
        /// </example>
        /// </member>
	    //maskedit.prototype.OnEditEnter = function () {
	    //    var fn = this.objParentForm.getIsEventName(this.id, "OnEditEnter");
	    //    if (fn != null) fn();
	    //}

        /// <member id="OnChange" kind="event">
        /// <summary>키 입력시 발생하는 이벤트</summary>
        /// <remarks>키 입력시 발생하는 이벤트</remarks>
        /// <example>ed_1.OnChange();
        /// </example>
        /// </member>
	    //maskedit.prototype.OnChange = function () {
	    //    var fn = this.objParentForm.getIsEventName(this.id, "OnChange");
	    //    if (fn != null) fn();
	    //}
    }
        
    maskedit.ctlName = "maskedit";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(maskedit.ctlName, maskedit);
	return maskedit;
}());
