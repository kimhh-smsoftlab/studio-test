//******************************************************************/
// All Rights Reserved. Copyright(c)   2017 Korea Sorimachi Ltd.Co  /
//******************************************************************/
/*! File Name     : formlink.js
/*! Function      :	formlink control
/*! System Name   : HTML5 Project
/*! Create        : Jungdu Jang , 2017/04/11
/*! Update        :
/*! Comment       :
//******************************************************************/
(function () {
    'use strict';

    // init object
    var formlink = function () {
        this.screeninfo = "";
        this.currentPage = "";
        this.iframe = false;
        this.objParentForm = null;
        this.preform = null;
        this.objSubForm = null;
        //현재 보여지고 있는 screen페이지에 대한 정보를 담고있는 변수
        //초기값은 propertyLoad부분에서 xmlNode에서 바로 읽어와서 세팅한다.
    };

    formlink.prototype = {
        propertyLoad: function (node, nodeName, xmlHolderElement) {
            // list of removed attributes from html tag
            var that = this,
                style = [],
                cls = ["hi5_formlink"],
                attr = { id: "", disable: "" };

            var objXML = x2h.getXML2Control(node, this, attr, cls, style);

            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            style = x2h.attri(xmlHolderElement, attr);

            if (this.iframe == true) {
                //iframe 생성
                var iframeTag = x2h.createXmlElement(xmlHolderElement, "iframe");
                xmlHolderElement.appendChild(iframeTag);
                attr = { width: "100%", height: "100%", className: "frameform", frameborder: "0", src: "./frameDefault.html" };
                style = x2h.attri(iframeTag, attr);

            }

        },
        onInitAfter: function (prePage) {
            //        console.log('onInitAfter : ' + this.screeninfo);
            //        console.log('iframe use : ' + this.iframe);

            var ctrlthis = this;
            if (this.iframe === false) {
                if (this.screeninfo) this.SetPage(this.screeninfo);
            }
            else {
                var $element = this.GetElement();
                var element = $element[0].childNodes[0];
                var tteesstt = "#" + this.id;

                element.onload = function () {
                    //console.log("onload");
                    //var objSubForm = ctrlthis.objParentForm.SetChildAddForm(ctrlthis);
                    var page = ctrlthis.screeninfo;
                    if (prePage) {
                        page = prePage;
                    }
                    var sc = document.createElement('script');
                    //첫페이지를 로딩하면서 form을 생성한다. 이후에 ScreenLoad는 여기서 생성해준 _RunForm 을 활용한다.
                    sc.innerHTML += " require(['control/form'], function(form) { if(form){return;} form = new form(); ScreenLoad('" + page + "');});";

                    //위에서 정의한 script문을 실행후 바로 삭제
                    ctrlthis.getIframeDoc().getElementsByTagName('body')[0].appendChild(sc);
                    ctrlthis.getIframeDoc().getElementsByTagName('body')[0].removeChild(sc);
                    element.setAttribute('loaded', 'true');

                    //                console.log("loaded true");
                };
            }
            return;
        },

        //formlink의 핵심기능 page로드하기
        SetPage: function (page, opt) {
            if (page == "") return;
            var self = this;
            if (this.currentPage === page && opt == undefined) return;
            this.currentPage = page;
            this.objSubForm = this.objParentForm.SetChildAddForm(self);
            if (opt) {
                if (this.preform) opt.preform = this.preform;
                opt.form = this.objSubForm;// subForm 화면을 설정한다.
                this.objSubForm.OpenSubScreen(page, opt);
                return;
            }
            var options = {};
            if (this.preform) options.preform = this.preform;
            options.tagName = "";
            options.initdata = "";
            options.form = this.objSubForm;// subForm 화면을 설정한다.

            if (this.iframe == true) {
                var $element = this.GetElement();
                var element = $element[0].childNodes[0];
                if (element.getAttribute('loaded') != 'true') {
                    this.onInitAfter(page);
                    //                console.log('초기화 전 Setpage호출로 초기화 실행');
                    return;
                }

                var frBody = this.getIframeDoc().getElementsByTagName('body')[0];
                var sc = document.createElement('script');

                sc.innerHTML = "ScreenLoad('" + page + "'); ";
                //            console.log(sc);

                frBody.appendChild(sc);
                frBody.removeChild(sc);
            }
            else {
                this.preform = this.objSubForm;
                this.objSubForm.OpenSubScreen(page, options);
            }
        },


        //현재 로드된 페이지를 반환하는 함수.
        getCurrentPage: function () {
            return this.currentPage;
        },

        //아이프레임의 Document를 반환하는 함수
        getIframeDoc: function () {
            var $element = this.GetElement();
            var frDoc = $element[0].childNodes[0].contentDocument;
            return frDoc;
        },

        //아이프레임의 Jquery객체를 반환하는 함수
        GetElement: function () {
            //var self = this, $element = $("#" + self.id);
            return this.$html;
        },

      
        // HTML 요소객체 취득
        GetElemnt: function () {
            //var self = this, $element = $("#" + self.id);

            return this.$html;
        },
        // Style속성 취득
        GetStyle: function (style) {
            var $element = this.GetElemnt(), val;
            val = $element.css(style);

            return val;
        },

        // Style속성 설정
        SetStyle: function (style, value) {
            var $element = this.GetElemnt();
            typeof (style) === "object" ? $element.css(style) : $element.css(style, value);
            return;
        },

        // Attribute 취득
        GetProp: function (propName) {
            if ("form" == propName)
                return this.objSubForm;
            var $element = this.GetElemnt(), val;
            val = $element.attr(propName);
            return val;
        },

        // Attribute 설정
        SetProp: function (propName, Value) {
            var $element = this.GetElemnt();

            typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
            if (propName == "disabled") {
                var iframedoc = this.getIframeDoc().getElementById("form");

                this.Disabled(Value);
            }
        },

        // functions and methods
        // disabled 됐을때 동작(css disabled 동일)
        Disabled: function (state) {
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


        /// <member id="OnScreenLoad" kind="event" default="true">
        /// <summary>맵 화면이 load된 상태에서 발생되는 이벤트</summary>
        /// <remarks>OnFormInit()함수보다 먼저 발생</remarks>
        /// <param name = "screenID" type="string"> 맵이름</param>
        /// </member>
        //formlink.prototype.OnScreenLoad = function (screenID) {
        //    var self = this;
        //    var fn = this.objParentForm.getIsEventName(self.id, "OnScreenLoad");
        //    if (fn) {
        //        fn(screenID)
        //    }
        //}
    }
    formlink.ctlName = "formlink";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(formlink.ctlName, formlink);
    return formlink;
}());
