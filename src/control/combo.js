//combo.js
(function () {
    'use strict';

    var combo = function () {
        this.datatype = "0";
        this.itemflag = "1";
        this.bInputCombo = false;
        this.displaytype = "0";
    }

    combo.prototype = {
        propertyLoad: function (node, nodeName, xmlHolderElement) {
            //debugger;
            var that = this,
                cls = ["hi5_combo"], // 클래스 정보명
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "", disabled: "" }, // HTML Attri 정의하는 정보 설정
                dataCell = "";  // caption

            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            var objXML = x2h.getXML2Control(node, this, attr, cls, style);

            // --> 창민 수정 : 콤보 리스트 item 표현방식 처리를 위함
            if(objXML.displaytype != undefined){
                //debugger;
                console.log(objXML.datatype);
                this.displaytype = objXML.displaytype;

            }


            
            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);

            ////debugger;
            //custom combo를 만들기 위한 작업
            var selectEle = document.createElement("select");
            // 창민 수정( 가운데 정렬 속성 추가 = text-align-last:center; )
            // selectEle.setAttribute("style", "text-align-last:center;border:0;width: 100%;"); // 수정
            selectEle.setAttribute("style", "border:0;width: 100%;"); // 기존
            // TODO - objXML.style 에서 Font-size 등 스타일 속성 뽑아서 적용시키기..!!!
            // selectEle.setAttribute("style", "border:0;width: 100%;font-size:10px;");
            selectEle.className = cls[0] + "_custom_select";
            
            var customList;
            if (objXML.fncustom) {
                customList = hi5.getJSONParse(objXML.fncustom);
            }

            var selectedIndex = 0;
            var comboData;
            if (customList) {
                if (customList.type) {
                    if (customList.type.portfolio) {
                        this.datatype = "P";
                        // 마지막 선택된 관심그룹
                        comboData = portFolio.getGroupList();
                        var idx = -1;
                        var seq = portFolio.lastSelectGroup();  // 마지막 관심그룹 저장값
                        idx = comboData.findIndex(function (rd, nIdx) {
                            return rd.g_seq === seq;
                        });

                        selectedIndex = idx >= 0 ? idx : 0;
                    }
                }
            }
            else {
                // 1. 직접입력 데이터 처리
                if (this.datatype == "0") {
                    if (objXML.listitem) {
                        comboData = hi5.getJSONParse(objXML.listitem);
                    }
                }
                // 2. Json 데이터 처리
                else if (this.datatype == "1") {
                    console.log(typeof objXML.listitem);

                    var filename = objXML.listitem["file"];
                    var keyname = objXML.listitem["key"];
                    
                    var loc = window.location.pathname
                    var dir = loc.substring(0, loc.lastIndexOf('/'));
                    console.log(dir);
                    //dir = "Hi5 Studio/src";
                    var data_locate = "../data/" + filename;
                    
                    $.ajax({
                        url: data_locate,
                        dataType: "json",
                        async: false,
                        success: function (data) {
                           $.each(data, function (key, val) {                    
                                console.log('ajax key:' + key);
                                 // 받아온 데이터 처리        
                                 if (key == keyname){
                                    console.log('ajax val:' + val);
                                    comboData = val;
                                    
                                 }
                                 if(comboData != undefined){
                                     return;
                                 }
                            });
                        }
                    });            
                }

                selectedIndex = objXML.initindex || 0;
            }

            if (comboData) {
                for (var i = 0; i < comboData.length; i++){
                    var tagOptionEle = x2h.createXmlElement(selectEle, "option");
                    var rd = comboData[i];
                    // --> 창민 수정 : 로컬 언어로 value 세팅 & 데이터 별 처리
                    
                    //debugger;

                    var key;
                    var value;
                    var caption = "";

                    // 1. key value 꺼내기

                    // 직접입력 데이터
                    if(this.datatype == "0"){
                        key = rd["key"] ? rd["key"] : rd.toString();
                        value = rd["multi_lang"][local_lang];
                        caption = value;
                    }
                    else if(this.datatype == "1"){
                        key = Object.getOwnPropertyNames(rd)[0];
                        $.each(rd, function() {
                            if(this[local_lang]){
                                value = this[local_lang];
                            }
                            }); 
                        caption = key + " - " + value;
                    }// 리얼 데이터
                    else if(this.datatype == "2"){
                        // TODO
                    }

                    // 2. type에 따른 cation 세팅
                    // 타이틀만
                    if(this.displaytype == "0"){
                        caption = value;
                    }// 값 + 타이틀
                    else if(this.displaytype == "1"){
                        caption = key + " - " + value;
                    }// 타이틀 + 값
                    else if(this.displaytype == "2"){
                        caption = value + " - " + key;
                    }// 값만
                    else if(this.displaytype == "3"){
                        caption = key;
                    }

                    
                    // 선택된 item 세팅(초기 ==> 0번째)
                    if (selectedIndex == i) {
                        x2h.xmlSetAttr(tagOptionEle, "selected", "selected");
                        // x2h.xmlSetAttr(tagOptionEle, "style", "text-align-last:center");
                        // caption = "<p style='text-align-last:center;'>" + caption + "</p>";
                    }

                    x2h.xmlSetAttr(tagOptionEle, "value", key)
                    tagOptionEle.textContent = caption;
                    selectEle.appendChild(tagOptionEle);

                    //debugger;
                    selectEle.height;
                    tagOptionEle.height;
                    // <-- 창민 수정 끝
                }
            }
            
            //custom combo를 만들기 위한 작업
            xmlHolderElement.appendChild(selectEle);
            if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                // <- 21-02-03 현호 수정 모바일 custom combo    
                if(window.fromWeb2Native){
                    selectEle.style.pointerEvents = "none"
                    /* combobox에 직접 리스너 */
                    xmlHolderElement.addEventListener("click", function (e) {
                        let sendData = comboData.map((obj) => {return {[obj.key] : obj.multi_lang.ko}})
                        let openDialogObj = {
                            type : 'openDialog',//'tran'
                            screen: '1',
                            data : {
                                array : sendData,
                                currentData : that.GetProp('value')
                            },
                            rpData:{
                                data : ''
                            },
                            $form : that.objParentForm.id,
                            $control : that.orgid
                        }
                        
                        let convertString = JSON.stringify(openDialogObj);
                        
                        debugger;
                        window.fromWeb2Native.postMessage(convertString);
                        console.log(sendData)
                        // console.log(openDialogObj)
                    })
                    // xmlHolderElement.appendChild(cbEle);
                    // var cbEle = document.createElement("span");
                    // cbEle.style.height = "100%"
                    // cbEle.style.display = 'flex'
                    // cbEle.style.justifyContent = "space-between"
                    // // arrow.className = 'combo_arrow'

                    // var selItemEle = document.createElement("span");
                    // selItemEle.style.marginLeft = "3px"
                    // var arrow = document.createElement("span");
                    // arrow.style.marginRight = "2px"
                    
                    // cbEle.appendChild(selItemEle)
                    // cbEle.appendChild(arrow)
                    // /* 오른쪽 아이콘 ▼ */   
                    // arrow.textContent = "▼"
                    // /* 왼쪽 selectitem */
                    // selItemEle.innerHTML = selectEle.options[selectedIndex].innerHTML;
                }
            }
            // 21-02-03 현호 수정 ->
            if(hi5admin == "" && hi5.WTS_MODE == WTS_TYPE.SPA){ //front 일때만 동작 coustom combo
                // 2020.02.24 kws
                // 결함번호 1169
                // 콤보를 바이낸스처럼
                if(attr["class"].indexOf("inputCombo") > -1){
                    this.bInputCombo = true;

                    var divEle = document.createElement('div');
                    divEle.className = "inputComboMain combodisplay";
                    xmlHolderElement.appendChild(divEle);

                    var divInputEle = document.createElement("div");
                    divInputEle.className = "inputComboMain comboinput";
                    xmlHolderElement.appendChild(divInputEle);

                    var inputEle = document.createElement("input");
                    inputEle.className = "inputComboInput";
                    inputEle.maxlength = "20";
                    divInputEle.appendChild(inputEle);

                    var arrowEle = document.createElement("span");
                    arrowEle.className = "inputComboArrow";
                    xmlHolderElement.appendChild(arrowEle);

                    var iTag = document.createElement("i");
                    arrowEle.appendChild(iTag);
                    iTag.className = "fa fa-caret-down";

                    var listDiv = document.createElement('div');
                    listDiv.className = "combolist";
                    xmlHolderElement.appendChild(listDiv);

                    if(comboData){
                        var ulEle = document.createElement('ul');
                        listDiv.appendChild(ulEle);
                        comboData.forEach(function (rd, index, arr) {
                            var liEle = document.createElement('li');
        
                            var value = rd.g_seq || Object.keys(rd)[0];
                            var caption = rd.g_name || rd[value];
                            liEle.setAttribute("value", value);
                            liEle.textContent = hi5.isObject(caption) ? caption[local_lang] : caption;
                            ulEle.appendChild(liEle);
                            if (selectedIndex == index) {
                                divEle.setAttribute("value", value);
                                divEle.textContent = hi5.isObject(caption) ? caption[local_lang] : caption;
                            };
                        });
                        this.comboData = comboData;
                    }

                    return;
                }
                var selDivEle, selItemListDivEle;
                /* For each element, create a new DIV that will act as the selected item: */
                selDivEle = document.createElement("DIV");
                selDivEle.setAttribute("class", "select-selected");
                //combo가 비어있을경우
                if(selectEle.selectedIndex == -1)
                    selDivEle.innerHTML = "";
                else
                    selDivEle.innerHTML = selectEle.options[selectEle.selectedIndex].innerHTML;
                xmlHolderElement.appendChild(selDivEle);
                /* For each element, create a new DIV that will contain the option list: */
                selItemListDivEle = document.createElement("DIV");
                selItemListDivEle.setAttribute("class", "select-items select-hide");
                selItemListDivEle.setAttribute("style", "width: " + style.width);

                this.setCustomCombo(selectEle, selItemListDivEle, style.height);
                xmlHolderElement.appendChild(selItemListDivEle);
            }
        },
        setCustomCombo : function(selectEle, selItemListDivEle, selItemHeigth){
            var obj = this;
            for ( var i = 0; i < selectEle.length; i++) {
                /* For each option in the original select element,
                create a new DIV that will act as an option item: */
                var selItemDivEle = document.createElement("div");
                selItemDivEle.innerHTML = selectEle.options[i].innerHTML;
                selItemDivEle.setAttribute("style", "height: " + selItemHeigth);
                selItemDivEle.addEventListener("click", function (e) {
                    /* When an item is clicked, update the original select box,
                    and the selected item: */
                    var j, k, sameSelEls, selEle, prevSb;
                    selEle = this.parentNode.parentNode.getElementsByTagName("select")[0];
                    prevSb = this.parentNode.previousSibling;
                    for (j = 0; j < selEle.length; j++) {
                        if (selEle.options[j].innerHTML == this.innerHTML) {
                            selEle.selectedIndex = j;
                            prevSb.innerHTML = this.innerHTML;
                            sameSelEls = this.parentNode.getElementsByClassName("same-as-selected");
                            for (k = 0; k < sameSelEls.length; k++) {
                                sameSelEls[k].removeAttribute("class");
                            }
                            this.setAttribute("class", "same-as-selected");
                            break;
                        }
                    }
                    prevSb.click();

                    if (obj.OnListSelChanged) {
                        obj.OnListSelChanged.call(obj, selEle.selectedIndex, selEle.options[selEle.selectedIndex].value, selEle.options[selEle.selectedIndex].innerHTML);
                    }
                });
                selItemListDivEle.appendChild(selItemDivEle);
            }
        },
        onInitAfter : function () {
            var obj = this;
            var elem = this.$html.children()[0];

            //var disabled = elem.disabled;
            var disabled = this.$html.attr("disabled") == "disabled" ? true : false;
            if (disabled == true) {
                this.Disabled(true);
            }
            var bPF = this.datatype == "P" ? true : false;

            if(hi5admin == "" && hi5.WTS_MODE == WTS_TYPE.SPA){
                if(this.bInputCombo){
                    $("#" + this.id + " .inputComboMain.combodisplay").on('click', function(e){
                        if(obj.$html.attr("disabled") == "disabled") return;
                        e.stopPropagation();
                        obj.toggleComboInput(e);
                        obj.CloseAllSelect();
                    });

                    $("#" + this.id + " .inputComboMain.comboinput").on("click", function(e){
                        if(obj.$html.attr("disabled") == "disabled") return;
                        e.stopPropagation();
                        obj.toggleComboInput(e);
                    });

                    $("#" + this.id + " .inputComboArrow").on("click", function(e){
                        if(obj.$html.attr("disabled") == "disabled") return;
                        e.stopPropagation();
                        obj.toggleComboInput(e);
                    });

                    $("#" + this.id + " .combolist li").on("click", function(e){
                        if(obj.$html.attr("disabled") == "disabled") return;
                        e.stopPropagation();
                        obj.SelectInputData(this);
                    });

                    $("#" + this.id + " .inputComboMain.comboinput > input").on("keydown", function(e){
                        // 글자가 써지는 시점에서는 opacity를 변경
                        if(this.value.length != 0){
                            $(this).parent().css({opacity : 1});
                        }
                    });

                    $("#" + this.id + " .inputComboMain.comboinput > input").on("keyup", function(e){
                        // 글자가 써지는 시점에서는 opacity를 변경
                        if(this.value.length == 0){
                            $(this).parent().css({opacity : ""});
                        }

                        if(e.keyCode == 13){
                            obj.SelectFirstData();
                        }
                        else if(e.keyCode == 38 || e.keyCode == 40){
                            // keyboard down
                            if(e.keyCode == 40){
                                $("#" + obj.id + " .combolist li:first-child").addClass("combo-highlight");
                                $(this).blur();
                            }
                        }
                        else{
                            obj.updateComboList(this.value);
                        }
                    });

                    /* If the user clicks anywhere outside the select box,
                    then close all select boxes: */
                    document.addEventListener("click", obj.toggleComboInput);
                    document.addEventListener("click", obj.CloseAllSelect);
                }
                else{
                    hi5.on($("#"+this.id + " .select-selected")[0], 'click', function(e){
                        /* When the select box is clicked, close any other select boxes,
                        and open/close the current select box: */
                        if(this.getAttribute("disabled") == "disabled") return;
                        e.stopPropagation();
                        obj.CloseAllSelect(this);
                        obj.toggleComboInput();
                        ////debugger;
                        this.nextSibling.classList.toggle("select-hide");
                        this.nextSibling.classList.toggle("select_div_open");
                        this.classList.toggle("select-arrow-active");
                        
                    });
                
                    /* If the user clicks anywhere outside the select box,
                    then close all select boxes: */
                    document.addEventListener("click", obj.toggleComboInput);
                    document.addEventListener("click", obj.CloseAllSelect);
                }
            }

            if (obj.OnListSelChanged) {
                //hi5.on(elem, 'change', function (e) {
                $(elem).on('change', function (e) { // 2019.09.11 kws jquery 객체로 해야 trigger 이벤트가 발생
                    //var optionSelected = $(this).find("option:selected");
                    var index = e.target.options.selectedIndex;
                    var optionSelected = e.target.options[index];
                    var value = optionSelected.value;
                    var caption = optionSelected.innerHTML;
                    //var index = optionSelected.index();
                    //var value = optionSelected.val();
                    //var caption = optionSelected.text();
                
                    obj.OnListSelChanged.call(obj, index, value, caption);
                    // 마지막 관심그룹번호를 메모리에 저장한다.
                    if (bPF) {
                        portFolio.lastSelectGroup({ g_seq: value });  
                    }
                });
            }
        },

        toggleComboInput : function(e, bClose){
            $(".hi5_combo *").removeClass("combo-show");
            if(!bClose && e && ($(e.target).hasClass("inputCombo") || $(e.target).parent().hasClass("inputCombo") || $(e.target).parent().parent().hasClass("inputCombo"))){
                // close -> open
                if($(e.target).hasClass("inputComboArrow") || $(e.target).parent().hasClass("inputComboArrow")){
                    if($(e.target).hasClass("combo-show")){
                        $(".hi5_combo *").removeClass("combo-show");
                        return;
                    }
                }
                $("#" + this.id + " .inputComboMain.comboinput").css({opacity : ""});
                $("#" + this.id + " input").val("");
                $("#" + this.id + " *").addClass("combo-show");
                $("#" + this.id + " .combolist").css("top", $("#" + this.id).outerHeight());
                this.updateComboList();

                this.SetFocus();
            }
            //else{
            //    $(".hi5_combo *").removeClass("combo-show");
            //}
        },

        SelectInputData : function(obj, bEvent){
            var _this = this;
            if($(obj).parent().parent().hasClass("noData")){
                return;
            }
            var value = $(obj).attr("value");
            var caption = $(obj).text();
            this.SetProp("valuecaption", {value : value, caption : caption});
            var index = -1;
            this.comboData.forEach(function(data, i){
                    var key = Object.keys(data)[0];
                    if(key == value) {
                        index = i;
                        if(_this.OnListSelChanged)
                            _this.OnListSelChanged.call(_this, index, value, caption);
                        return;
                    }
            });

            this.toggleComboInput(null, true);
        },

        SelectFirstData : function(bEvent){
            var _this = this;
            var $combolist = $("#" + this.id + " .combolist");
            var $ul = $("#" + this.id + " .combolist ul");

            var value, caption;

            if($combolist.hasClass("noData")){
                value = Object.keys(this.comboData[0])[0];
                caption = this.comboData[0][value];
            }
            else{
                value = $("#" + this.id + " .combolist ul li:first-child").attr("value");
                caption = $("#" + this.id + " .combolist ul li:first-child").text();
            }
            this.SetProp("valuecaption", {value : value, caption : caption});
            var index = -1;
            this.comboData.forEach(function(data, i){
                    var key = Object.keys(data)[0];
                    if(key == value) {
                        index = i;
                        if(_this.OnListSelChanged)
                            _this.OnListSelChanged.call(_this, index, value, caption);
                        return;
                    }
            });

            this.toggleComboInput(null, true);
        },

        updateComboList : function(value){
            var _this = this;
            var comboList = hi5.clone(this.comboData);
            var $combolist = $("#" + this.id + " .combolist");
            var $ul = $("#" + this.id + " .combolist ul");
            if($ul.length == 0){
                $ul = $("<ul/>");
                $combolist.append($ul);
            }
            $ul.empty();
            for(var x = 0;x < comboList.length;x++){
                var comboObj = comboList[x];
                var key = Object.keys(comboObj)[0];
                var caption = comboObj[key][local_lang] || comboObj[key];
                if(caption.indexOf(value) > -1 || value == "" || !value){
                    var $li = $("<li/>");
                    $li.attr("value", key);
                    $li.text(caption);
                    $li.on("click", function(){
                        _this.SelectInputData(this);
                    })
                    $ul.append($li);
                }
            }
            if($ul.children().length == 0){
                $combolist.addClass("noData");
                var $li = $("<li/>");
                $li.text($hi5_regional.combo.nodata);
                $li.on("click", function(e){
                    e.stopPropagation();
                    return false;
                })
                $ul.append($li);
            }
            else{
                $combolist.removeClass("noData");
            }
            $combolist.append($ul);
        },

        CloseAllSelect : function(elmnt){
            var x, y, i, arrNo = [];
            x = document.getElementsByClassName("select-items");
            y = document.getElementsByClassName("select-selected");
            for (i = 0; i < y.length; i++) {
                if (elmnt == y[i]) {
                    arrNo.push(i)
                } else {
                    y[i].classList.remove("select-arrow-active");
                }
            }
            for (i = 0; i < x.length; i++) {
                if (arrNo.indexOf(i)) {
                    x[i].classList.add("select-hide");
                    x[i].classList.remove("select_div_open");
                }
            }
        },

        GetElemnt : function () {
            if(this.bInputCombo){
                return this.$html.find('input');
            }
            return this.$html.children();
        },

        Disabled : function (state) {
            if (state == undefined) return;
            var cssstyle = {};
            var $element = this.GetElemnt();
            if (state == true || state == "disabled" || state == "true") {
                cssstyle = hi5.getCustomStyle(this, "disable");
                $element.attr("disabled", true);
            }
            else {
                cssstyle = hi5.getCustomStyle(this, "default");
                $element.removeAttr("disabled");
            }

            if (cssstyle)
                $element.css(cssstyle);
        },

        // 콤보에 데이터 추가
        AddString : function (value, caption) {
            var $element = this.GetElemnt();

            var opt = document.createElement('option');
            if (value) opt.value = value;
            opt.text = caption;

            $element[0].add(opt);
        },

        // autosave
        GetAutoSave : function () {
            return -1;
        },

        AutoSaveCtrl : function () {
            return this.GetCurSel();
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
            if(this.bInputCombo){
                typeof (style) === "object" ? $("#" + this.id).css(style) : $("#" + this.id).css(style, value);
                return;
            }
            var $element = this.GetElemnt();
            typeof (style) === "object" ? $element.parent().css(style) : $element.parent().css(style, value);
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
                if(this.bInputCombo){
                    val = $("#" + this.id + " .inputComboMain.combodisplay").html();
                }
                else{
                    if($element[0] && $element[0].selectedIndex < 0) return "";
                    val = $element[0].options[$element[0].selectedIndex].innerHTML;
                }
            }
            else if (propName == "value") {
                if(this.bInputCombo){
                    val = $("#" + this.id + " .inputComboMain.combodisplay").attr("value");
                }
                else{
                    if($element[0] && $element[0].selectedIndex < 0) return "";
                    val = $element[0].options[$element[0].selectedIndex].value;
                }
            }
            else if (propName === "floatstyle" || propName === "borderStyle" || propName === "opacity") {
                propName =
                propName === "floatstyle" ? "float" :
                propName === "borderStyle" ? "border" :
                propName;

                val = this.GetStyle(propName);
            }
            else if (propName === "datatype" || propName === "initindex" || propName === "itemflag") {
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

            if (propName == "caption") {
                $element.text(Value);
            }
            else if(propName == "valuecaption"){
                if(this.bInputCombo){
                    $("#" + this.id + " .inputComboMain.combodisplay").attr("value", Value.value);
                    $("#" + this.id + " .inputComboMain.combodisplay").text(Value.caption);
                }
            }
            else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
                if (propName == "disabled") {
                    this.Disabled(Value);
                }
            }
        },

        /// <member id="GetCount" kind="method">
        /// <summary>리스트 갯수를 취득하는 함수</summary>
        /// <remarks>콤보 안에 들어있는 아이템 갯수를 취득</remarks>
        /// <returns type="number">갯수</returns>
        /// <example>var count = cb_1.GetCount();
        /// </example>
        /// </member>
        GetCount : function () {
            var $element = this.GetElemnt();
            var $optionEle = $element.find("option");

            var count = 0;
            if($optionEle)
                count = $optionEle.length;

            return count;
        },

        /// <member id="SetCount" kind="method">
        /// <summary>아이템 개수를 지정하는 함수</summary>
        /// <remarks>아이템 개수를 지정하는 함수, 내부적으로 모든 항목을 삭제하고 빈 항목만 구성 </remarks>
        /// <param name="count" type="number">아이템 갯수</param>
        /// <example>cb_1.SetCount(10);
        /// </example>
        /// </member>
        SetCount : function (count) {
            this.ResetContent();

            for (var x = 0; x < count; x++) {
                this.AddString("", "");
            }
        },

        /// <member id="GetCurSel" kind="method">
        /// <summary>현재 선택된 리스트의 인덱스 값</summary>
        /// <remarks>현재 선택되어져 있는 콤보 리스트의 인덱스</remarks>
        /// <returns type="number">인덱스 번호</returns>
        /// <example>var index = cb_1.GetCurSel();
        /// </example>
        /// </member>
        GetCurSel : function () {
            var $element = this.GetElemnt();
            var selectedIndex = $element[0].selectedIndex;
            return selectedIndex;
        },

        /// <member id="SetCurSel" kind="method">
        /// <summary>해당 인덱스로 변경</summary>
        /// <remarks>지정한 인덱스로 해당 콤보의 내용을 변경</remarks>
        /// <param name="index" type="number">인덱스 번호</param>
        /// <param name="event" type="boolean" default="true">이벤트 발생유무 지정 기본값 : true 이벤트 발생 false:이벤트 미 발생</param>
        /// <example>cb_1.SetCurSel(0);
        /// </example>
        /// </member>
        SetCurSel : function (index, event) {
            var strIndex = index.toString(), count = this.GetCount();
            if (count <= 0) return -1;

            var nIndex = parseInt(strIndex, 10);
            if (nIndex >= this.GetCount() ) return -1;
            if (hi5.WTS_MODE != WTS_TYPE.MTS && nIndex < 0 ) nIndex = 0;    // 2019.12.18 kws 모바일은 리스트에서 한개만 존재할때 재선택시에 이벤트 처리가 안됨.

            var $element = this.GetElemnt();
            $element[0].selectedIndex = nIndex;
            if(hi5admin == "" && hi5.WTS_MODE == WTS_TYPE.SPA){
                $element[1].innerHTML = $element[0].options[$element[0].selectedIndex].innerHTML;
            }
            if (event == false){
                return nIndex;
            }
       
            // 이벤트 발생
            if ( !event || event == true ){
                if(hi5admin == "" && hi5.WTS_MODE == WTS_TYPE.SPA){
                    $($element[2].children[nIndex]).trigger("click");
                }else{
                    $element.trigger("change");
                }
            }

            return nIndex;
        },

        /// <member id="ResetContent" kind="method">
        /// <summary>콤보 내용을 삭제</summary>
        /// <remarks>해당 콤보의 내용을 모두 삭제</remarks>
        /// <example>cb_1.ResetContent();
        /// </example>
        /// </member>
        ResetContent : function () {
                if(this.bInputCombo){
                        $("#" + this.id + " .combolist ul").empty();
                        return;
                }
            var $element = this.GetElemnt();
            $element[0].options.length = 0;

            //front custom combo 사용할때 처리
            if(hi5admin == "" && hi5.WTS_MODE == WTS_TYPE.SPA){
                ////debugger;
                $element[1].innerHTML = "";
                $element[2].innerHTML = "";
            }
        },

        /// <member id="SetItemValue" kind="method">
        /// <summary>리스트에 키값과 표시내용을 설정하는 함수</summary>
        /// <remarks>리스트에 키값과 표시내용을 직접 설정하는 함수</remarks>
        /// <param name="listitem" type="array">[{value:caption},{value:caption},....]</param>
        /// <example>cb_1.SetItemValue(listitem);
        /// </example>
        /// </member>
        SetItemValue : function (listitem) {
            var x = 0;
            this.comboData = listitem;
            if(this.bInputCombo) {
                    this.updateComboList();
                    this.SelectFirstData();
                    return;
            }
            for (x = 0; x < listitem.length; x++) {
                var str = listitem[x];

                var cmb_value = Object.keys(str)[0];
                var cmb_caption = str[cmb_value];

                this.AddString(cmb_value, cmb_caption);
            }

            if(hi5admin == "" && hi5.WTS_MODE == WTS_TYPE.SPA){
                var $element = this.GetElemnt();
                if($element[1].selectedIndex == -1)
                    $element[1].innerHTML = "";
                else
                    $element[1].innerHTML = $element[0].options[$element[0].selectedIndex].innerHTML;
                this.setCustomCombo($element[0], $element[2], $element[0].parentElement.style.height);
            }
        },

        /// <member id="GetItemValue" kind="method">
        /// <summary>콤보내용을 배열형태로 전부 취득</summary>
        /// <remarks>콤보내용 전체를 배열형태로 취득</remarks>
        /// <returns type="array">콤보 내용 [{‘value’:값, ‘caption’:표시텍스트},{‘value’:값, ‘caption’:표시텍스트 },....]</returns>
        /// <example>var array = cb_1.GetItemValue();
        /// </example>
        /// </member>
        GetItemValue : function () {
            var listitem = [];
            var $element = this.GetElemnt();
            var $optionEle = $element.find("option");
            $optionEle.each(function () {
                var value = $(this).val();
                var caption = $(this).text();

                var obj = { 'value' : value, 'caption' : caption };
                listitem.push(obj);
            });

            return listitem;
        },

        /// <member id="GetCurSelValue" kind="method">
        /// <summary>현재 선택된 리스트의 Value 값을 반환하는 함수</summary>
        /// <remarks>현재 선택된 리스트의 Value 값을 반환하는 함수</remarks>
        /// <returns type="string">Value</returns>
        /// <example>var value = cb_1.GetCurSelValue();
        /// </example>
        /// </member>
        GetCurSelValue : function () {
            var $element = this.GetElemnt();
            if(this.bInputCombo){
                    return $("#" + this.id + " .inputComboMain.combodisplay").attr("value");
            }
            var $selected = $element[0].options[$element[0].selectedIndex];
            if ( $selected )
                return $selected.getAttribute("value");
            return '';
        },

        /// <member id="SetCurSelKey" kind="method">
        /// <summary>리스트에 있는 키값을 선택시키는 함수</summary>
        /// <remarks>리스트에 있는 키값을 선택시키는 함수</remarks>
        /// <param name="value" type="string">Value</param>
        /// <param name="event" type="boolean" default="true">이벤트 발생유무 지정 : 기본값 : 발생, false: 이벤트 미 발생</param>
        /// <returns type="number">정상: 0이상, 오류: -1</returns>
        /// <example>var val = cb_1.SetCurSelKey(value);
        /// </example>
        /// </member>
        SetCurSelKey : function (value , event) {
            var listitem = this.GetItemValue();
            for (var x = 0; x < listitem.length; x++) {
                var data = listitem[x];
                if (data.value == value) {
                    this.SetCurSel(x, event);
                    return x;
                }
            }
            return -1;
        },

        /// <member id="GetItemData" kind="method">
        /// <summary>해당 Index의 value와 text를 취득</summary>
        /// <remarks>해당 Index의 value와 text를 json 형태로 반환하는 함수</remarks>
        /// <param name="index" type="number">Index</param>
        /// <returns type="object">{'value' : value, 'caption' : caption}</returns>
        /// <example>var objData = cb_1.GetItemData(index);
        /// </example>
        /// </member>
        GetItemData : function (index) {
            var $element = this.GetElemnt()
            var value = $element[0].options[index].value;
            var caption = $element[0].options[index].text;
            return { value : caption };
        },

        /// <member id="SetItemData" kind="method">
        /// <summary>해당 Index에 value와 text를 변경</summary>
        /// <remarks>해당 Index에 value와 text를 변경</remarks>
        /// <param name="nIndex" type="number">Index</param>
        /// <param name="arData" type="object">{value:caption}</param>
        /// <example>cb_1.SetItemData(index, arData);
        /// </example>
        /// </member>
        SetItemData : function (index, arData) {
            //var count = $("#" + this.id + " option").length;
            var count = this.GetCount();
            if (parseInt(index) >= parseInt(count)) {
                alert("Check index number : must be lower than " + count);
                return;
            }
            else {
                var cmb_value = Object.keys(arData)[0];
                var cmb_caption = arData[cmb_value];

                var $element = this.GetElemnt();

                $element[0].options[index].value = cmb_value;
                $element[0].options[index].text = cmb_caption;
            }
        },

        /// <member id="InsertItemData" kind="method">
        /// <summary>해당 Index에 value와 text를 추가 입력</summary>
        /// <remarks>해당 Index에 value와 text를 추가 입력</remarks>
        /// <param name="index" type="number">Index</param>
        /// <param name="arData" type="object">{value:caption}</param>
        /// <example>nVal = cb_1.InsertItemData(index, arData);
        /// </example>
        /// </member>
        InsertItemData : function (index, arData) {
            var count = this.GetCount();
            if (parseInt(index) > parseInt(count)) {
                return -1;
            }
            else {
                var cmb_value = Object.keys(arData)[0];
                var cmb_caption = arData[cmb_value];

                if (index < 0) {
                    this.AddString(cmb_value, cmb_caption);
                    index = count;
                }
                else {
                    var $element = this.GetElemnt()

                    $element[0].options.add(new Option(cmb_caption, cmb_value), $element[0].options[index]);
                }
                return index;
            }
        },

        /// <member id="DeleteItemData" kind="method">
        /// <summary>해당 Index의 내용을 삭제</summary>
        /// <remarks>해당 Index의 내용을 삭제</remarks>
        /// <param name="index" type="number">Index</param>
        /// <returns type="number">삭제 후 갯수</returns>
        /// <example>var count = cb_1.DeleteItemData(index);
        /// </example>
        /// </member>
        DeleteItemData : function (index) {
            var $element = this.GetElemnt();

            var count = this.GetCount();
            if (parseInt(index) > parseInt(count)) {
                return -1;
            }
            else {
                var $optionEle = $element.find("option");
                $optionEle.eq(index).remove();

                return this.GetCount();
            }
        },

        /// <member id="SetFocus" kind="method">
        /// <summary>해당 컨트롤 focus 주기</summary>
        /// <remarks>해당 컨트롤 focus 주기</remarks>
        /// </member>
        SetFocus : function () {
            var $element = this.GetElemnt();
            $element.focus();
        },

        /// <member id="FindItem" kind="method">
        /// <summary>Item Index를 검색 </summary>
        /// <remarks>Item Index를 검색 </remarks>
        /// <param name="findCol" type="number">Index</param>
        /// <param name="findText" type="string">Index</param>
        /// <returns type="number">검색된 Item의 Index</returns>
        /// <example>var count = cb_1.FindItem( findCol, findText);
        /// </example>
        /// </member>
        FindItem : function ( findCol, findText) {
            if (findCol > 1 || typeof(findText) != 'string')
                return -1;
        
            var options = this.GetElemnt().find("option");
            for (var i = 0; i < options.length; i++) {
                if ((findCol == 0 && options[i].value == findText) ||
                    (findCol == 1 && options[i].text  == findText))
                    return i;
            }
            return -1;
        },
    }

    /* events */

    /// <member id="OnListSelChanged" kind="event" default="true">
    /// <summary>콤보리스트 선택시 발생되는 이벤트</summary>
    /// <remarks>콤보리스트에서 하나를 선택했을때 발생</remarks>
    /// <param name="index" type="number">Index</param>
    /// <param name="value" type="string">Value</param>
    /// <param name="caption" type="string">Caption</param>
    /// </member>
    //combo.prototype.OnListSelChanged = function (index, value, caption) {
    //    var fn = this.objParentForm.getIsEventName(this.id, "OnListSelChanged");
    //    if (fn != null) fn(index, value, caption);
    //}
    combo.ctlName = "combo";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(combo.ctlName, combo);
    return combo;
}()); 