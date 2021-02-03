//tab.js
(function () {
    'use strict';

    var tab = function () {
        //control custom value
        this.preform = null;
        this.tabcount = 0;
        this.currenttabid = "";
        this.currenttabindex = "0";
        this.tabheight = "30px";
        this.tabscroll = "0";
        this.linewidth = "1";
        this.tabequaldiv = "0";
        this.tabwidth = "";
        this.btnconfig = "0";
        this.iframe = "0";
        this.customtooltip = {};

        //직전탭정보를 들고있기위한 변수선언
        this.oldtabid = "";
    }

    //컨트롤 html 스크립트 생성
    tab.prototype = {
        propertyLoad: function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_tab"], // 클래스 정보명 
                style = [], //  Style, 색정보용 Style  정보
                attr = {
                    id: ""
                }, // HTML Attri 정의하는 정보 설정
                dataCell = ""; // caption

            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            //var objXML = x2h.getXML2Control(node, this, attr, cls, style);
            var objXML;
            //if (x2h.getXML2JSON) {
            //    objXML = x2h.getXML2JSON(node, this, attr, cls, style, function (node) {
            //        return [];
            //    });
            //} else {
            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                // CDDATA 정보를 포함한 속석명 지정
                return ["multi_lang"];
            });
            //}

            // stylecolor 정보를 객체로 변환한다(String->JSON)
            if (objXML.stylecolor)
                this.styleColor = x2h.defaultStyle(objXML.stylecolor, false);

            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);

            if (objXML.customcolor)
                this.customColor = x2h.defaultStyle(objXML.customcolor, false);

            // 2020.04.27 kws
            // 빌더 버전을 체크해서 분기처리한다. 탭/라디오/콤보 등
            if (this.objParentForm.hi5_version) {
                this.hi5_version = this.objParentForm.hi5_version;
            }

            if (this.hi5_version >= 2) {
                if (objXML.subtabinfo && objXML.subtabinfo == "2") { // json 형태
                    try {
                        let tab_info = node.getElementsByTagName("tab_info");
                        let tabinfoObj = hi5.getJSONParse(tab_info[0].childNodes[0].textContent, true);
                        console.log(tabinfoObj);

                        this.currenttabid = tabinfoObj.currenttabid;

                        var fragment = document.createDocumentFragment(),
                            headerEle = fragment.appendChild(document.createElement("div"));
                        xmlHolderElement.appendChild(headerEle);
                        headerEle.className = "tabheader";
                        // IE Strict 모드 오류
                        headerEle.setAttribute("style", "height:" + objXML.tabheight + ";line-height:" + objXML.tabheight + ";");

                        var headerConEle = fragment.appendChild(document.createElement("ul"));
                        headerEle.appendChild(headerConEle);
                        headerConEle.className = "tabheaderContainer";
                        var activeTab = this.createJsonHeader(headerConEle, tabinfoObj);
                        // tab content 구성
                        if (style.height != this.tabheight) {
                            var contentsEle = fragment.appendChild(document.createElement("div"));
                            xmlHolderElement.appendChild(contentsEle);
                            contentsEle.className = "tabcontents";
                            // IE11 Strict 모드
                            //contentsEle.style = "height:calc(100% - " + objXML.tabheight + ");";
                            contentsEle.setAttribute("style", "height:calc(100% - " + objXML.tabheight + ");");
                            this.createJsonContents(tabinfoObj, tab_info, contentsEle, activeTab);
                        }
                        if (tabinfoObj.tabscroll == '1') {
                            this.createSlide(that, headerEle, headerConEle, contentsEle, tab_info);
                        }
                    } catch (e) {
                        console.log(e);
                    }

                } else { // xml 형태
                    var tab_item = node.getElementsByTagName("tab_item");
                    var tab_itemLen = tab_item.length;
                    if (objXML.tabcount && Number(objXML.tabcount) != tab_itemLen) {
                        tab_itemLen = Number(objXML.tabcount);
                        var tab_item_sub = [];
                        for (var j = 0; j < tab_itemLen; j++) {
                            tab_item_sub[j] = tab_item[j]
                        }
                        tab_item = tab_item_sub;
                    }
                    if (tab_item != undefined) {
                        var fragment = document.createDocumentFragment(),
                            headerEle = fragment.appendChild(document.createElement("div"));
                        xmlHolderElement.appendChild(headerEle);
                        headerEle.className = "tabheader";
                        // IE Strict 모드 오류
                        //headerEle.style = "height:" + objXML.tabheight + ";line-height:" + objXML.tabheight + ";";
                        headerEle.setAttribute("style", "height:" + objXML.tabheight + ";line-height:" + objXML.tabheight + ";");
                        //x2h.attri(headerEle, { "class": "tabheader", "style":"height:" + objXML.tabheight + ";line-height:" + objXML.tabheight + ";" });

                        var headerConEle = fragment.appendChild(document.createElement("ul"));
                        headerEle.appendChild(headerConEle);
                        headerConEle.className = "tabheaderContainer";

                        //tab header 구성
                        this.tabcount = tab_itemLen;
                        var activeTab = this.createHeader(tab_item, headerConEle, xmlHolderElement);

                        // tab content 구성
                        if (style.height != this.tabheight) {
                            var contentsEle = fragment.appendChild(document.createElement("div"));
                            xmlHolderElement.appendChild(contentsEle);
                            contentsEle.className = "tabcontents";
                            // IE11 Strict 모드
                            //contentsEle.style = "height:calc(100% - " + objXML.tabheight + ");";
                            contentsEle.setAttribute("style", "height:calc(100% - " + objXML.tabheight + ");");

                            this.createContents(tab_item, contentsEle, activeTab);
                        }
                        if (objXML.tabscroll == '1') {
                            this.createSlide(that, headerEle, headerConEle, contentsEle, objXML);
                        }
                    }
                }
            } else {
                var tab_item = node.getElementsByTagName("tab_item");
                var tab_itemLen = tab_item.length;
                if (objXML.tabcount && Number(objXML.tabcount) != tab_itemLen) {
                    tab_itemLen = Number(objXML.tabcount);
                    var tab_item_sub = [];
                    for (var j = 0; j < tab_itemLen; j++) {
                        tab_item_sub[j] = tab_item[j]
                    }
                    tab_item = tab_item_sub;
                }
                if (tab_item != undefined) {
                    var fragment = document.createDocumentFragment(),
                        headerEle = fragment.appendChild(document.createElement("div"));
                    xmlHolderElement.appendChild(headerEle);
                    headerEle.className = "tabheader";
                    // IE Strict 모드 오류
                    //headerEle.style = "height:" + objXML.tabheight + ";line-height:" + objXML.tabheight + ";";
                    headerEle.setAttribute("style", "height:" + objXML.tabheight + ";line-height:" + objXML.tabheight + ";");
                    //x2h.attri(headerEle, { "class": "tabheader", "style":"height:" + objXML.tabheight + ";line-height:" + objXML.tabheight + ";" });

                    var headerConEle = fragment.appendChild(document.createElement("ul"));
                    headerEle.appendChild(headerConEle);
                    headerConEle.className = "tabheaderContainer";

                    //tab header 구성
                    this.tabcount = tab_itemLen;
                    var activeTab = this.createHeader(tab_item, headerConEle, xmlHolderElement);

                    // tab content 구성
                    if (style.height != this.tabheight) {
                        var contentsEle = fragment.appendChild(document.createElement("div"));
                        xmlHolderElement.appendChild(contentsEle);
                        contentsEle.className = "tabcontents";
                        // IE11 Strict 모드
                        //contentsEle.style = "height:calc(100% - " + objXML.tabheight + ");";
                        contentsEle.setAttribute("style", "height:calc(100% - " + objXML.tabheight + ");");

                        this.createContents(tab_item, contentsEle, activeTab);
                    }
                    if (objXML.tabscroll == '1') {
                        this.createSlide(that, headerEle, headerConEle, contentsEle, objXML);
                    }
                }
            }
            this.onEventBind(headerConEle);
        },

        getInitCheck: function (tabID) {
            if (tabID && this.currenttabid) {
                if (tabID === this.currenttabid)
                    return true;
            }
        },

        onEventBind: function (elem) {
            // 도움말 툴팁기능
            // 클래스명으로 검색
            //debugger;
            var that = this,
                tabTH = elem,
                $elem = this.$html,
                $tp;
            if (!hi5.isEmpty(that.customtooltip)) {
                if ($elem.find("li").length > 0) {
                    for (var i = 0; i < $elem.find("li").length; i++) {
                        //debugger;
                        $tp = $($elem.find("li")[i]);
                        $tp.addClass("hi5-c-ui-tooltip tooltipWrapper");
                        // 일괄처리하는 경우 속성만 적용을 한다.
                        if (this.customtooltip.attr) {
                            var objCustomTooltip = hi5.clone(that.customtooltip.attr);
                            objCustomTooltip["tooltip-data"] = objCustomTooltip["tooltip-data"] + "_" + i;
                            x2h.setAttriCustomToolTip($tp, objCustomTooltip);
                            x2h.setAttriCustomToolTip($tp, {
                                "tp-form": that.objParentForm.id,
                                "tp-target": that.id
                            });
                        }
                    }
                }
                that.customtooltip = null;
            }

            //$(elem).delegate("li", "click", function (evt, data) {   -> $(elem).on 변경
            //$(elem).on("click","li", function (evt, data) {
            $(elem).on("click", "li", function (evt, data) {
                // 결함번호 1023 관련 수정
                // --> [Edit] leenohan 20191204
                // 수정내용 : 현재 활성화 된 탭 다시 클릭시 이벤트 발생
                // 현재는 OnTabChangeBefore 에서 이전 탭 id 만 넘겨줘서, 현재 사용자가 클릭한 탭이 뭔지 알수가 없다..
                // 그래서 현재 active될 tabid 도 같이 넘겨서 판단할수있도록 수정함..

                //oldtabid정보를 저장한다.. 
                that.oldtabid = that.currenttabid;
                if (that.OnTabChangeBefore) {
                    var newActiveTabId = "";
                    if ($(evt.currentTarget).is("li"))
                        newActiveTabId = $(evt.currentTarget)[0].getAttribute("val");
                    else
                        newActiveTabId = data.tabID;

                    var ret = that.OnTabChangeBefore.call(that, that.currenttabid, newActiveTabId);
                    if (ret == false) return;
                }
                // <-- [Edit] leenohan 20191204

                //$(elem).on("click", function (evt, data) {
                //if ($(evt.target).is("li")) {
                //    console.log($(evt.target));
                // }
                //console.log({ x: evt.clientX, y: evt.clientY });

                var page, pageid, $target = $(evt.currentTarget),
                    $self = $(this).parent(),
                    $activeTab;
                if ($target.is("li")) {
                    $activeTab = $target;
                    if (that.currenttabid == $activeTab[0].getAttribute("val")) return;

                    that.currenttabid = $activeTab[0].getAttribute("val");
                    that.currenttabindex = $activeTab[0].getAttribute("ind");
                } else { // trigger
                    if (!data) {
                        console.log(evt);
                        debugger;
                        return;
                    }
                    that.currenttabid = data.tabID;
                    that.currenttabindex = data.tabidx;
                }

                if (!$activeTab) {
                    $.each(this.children, function (idx, element) {
                        if (element.getAttribute("val") === data.tabID) {
                            $activeTab = $(element);
                            return false;
                        }
                    })
                    if (!$activeTab) return;
                }

                //탭 style 변경
                //orderstyle=true이면 class를 지정하지 않는다.
                if (that.orderstyle) {
                    $self.children('li').css({
                        borderWidth: '0px'
                    }).removeClass("clicked");
                    $activeTab.css({
                        borderWidth: '1px'
                    }).addClass("clicked");
                } else {
                    $self.children('li').css(hi5.getCustomStyle(that, "inactive")).removeClass("clicked");
                    $activeTab.css(hi5.getCustomStyle(that, "active")).addClass("clicked");
                }

                var $tabcontents = $("#" + that.id + " .tabcontents > div");
                $.each($tabcontents, function (idx, $tabcontent) {
                    var tabid = $($tabcontent).attr("val");
                    if (that.currenttabid === tabid) {
                        $($tabcontent).css("display", "block");
                        page = $($tabcontent).attr("page");
                        pageid = $($tabcontent).attr("id");
                    } else {
                        $($tabcontent).css("display", "none");
                    }
                });

                if (that.preform) {
                    that.preform.OnAllForminit();
                }

                if (page) {
                    that.LoadScreen(page, pageid);
                }

                //이벤트 fire
                /// <member id="OnTabChanged" kind="event" default="true">
                /// <summary>다른 탭을 활성화 시킬경우 발생하는 이벤트</summary>
                /// <remarks>remarks</remarks>
                /// <param name = "nCurrentTab" type="string">활성화된 탭의 ID</param>
                /// </member>
                if (data != false && that.OnTabChanged) {
                    that.OnTabChanged.call(that, that.currenttabid);
                }
            });
        },

        //탭 헤더 구성 - Json정보
        createJsonHeader: function (headerEle, tab_info) {
            let tab_items = tab_info.tab_item || [];
            let activeTab;
            for (var x = 0; x < tab_items.length; x++) {
                var tab_item = tab_items[x];

                var liEle = document.createElement("li");
                headerEle.appendChild(liEle);
                liEle.className = "tabtitle";
                if (tab_item.class) liEle.className += " " + tab_item.class;

                if (!activeTab && tab_item.tabid && this.currenttabid) {
                    if (this.getInitCheck(tab_item.tabid)) {
                        activeTab = x;
                        liEle.className += " clicked"
                    }
                }

                if (this.tabequaldiv == "1") {
                    liEle.style.width = this.tabwidth;
                }

                if (this.linewidth != "1") {
                    liEle.style.borderWidth = this.linewidth + "px";
                }

                liEle.setAttribute("ind", tab_item.no || "0");
                liEle.setAttribute("val", tab_item.tabid);
                if (tab_item.screenid) {
                    liEle.setAttribute("page", tab_item.screenid);
                    // 탭정보 화면정보를 저장한다.
                    if (!this._pageInfo) this._pageInfo = {};
                    this._pageInfo[tab_item.tabid] = {
                        tabIdx: tab_item.no || 0,
                        screenid: tab_item.screenid
                    };
                }

                var divEle = document.createElement("div");
                var spanEle = document.createElement("span");
                liEle.appendChild(divEle);
                divEle.appendChild(spanEle);

                var caption = "";
                if (tab_item.multi_caption) {
                    caption = tab_item.multi_caption[local_lang];
                }
                spanEle.textContent = caption;
            }
            return activeTab ? activeTab : 0;
        },
        //탭 컨텐츠 구성
        createJsonContents: function (tabinfoObj, tab_item, contentsEle, activeTab) {
            let tabInfos = tabinfoObj.tab_item || [];
            let tab_items = tab_item[0].children;
            debugger;
            var subElement;
            for (var i = 0; i < tabInfos.length; i++) {
                let tabInfo = tabInfos[i];
                subElement = tab_items[i] || null;

                var htmlDom = x2h.createHTMLDOM("<div></div>");
                var x = htmlDom.getElementsByTagName("div")[0],
                    attr = {
                        val: "",
                        id: "",
                        page: "",
                        "class": "tabscreen",
                        style: "display:none;"
                    };
                //x.style = "display:none;";
                var tabid = tabInfo.tabid;
                //x.setAttribute("val", tabid);
                attr.val = tabid;

                // 처음 atctibe
                if (this.getInitCheck(tabid)) {
                    //x.style = "display:block;";
                    attr.style = "display:block;";
                }
                var page = tabInfo.screenid;
                if (!page) {
                    if (subElement) {
                        //var xmlNode = subElement.getElementsByTagName("control_info")[0];
                        if (subElement.childNodes.length > 0) {
                            this.objParentForm.xmlTabParser(subElement, x);
                        }
                    }
                } else {
                    //x.setAttribute("page", page);
                    //x.className = "tabscreen";
                    //x.id = this.id + "__" + tabid;
                    //attr.class = "tabscreen";
                    attr.page = page;
                    attr.id = this.id + "__" + tabid;
                }
                x2h.attri(x, attr);

                contentsEle.appendChild(x);
            }
        },

        //탭 헤더 구성
        createHeader: function (tab_item, headerEle, xmlHolderElement) {
            var activeTab;
            for (var x = 0; x < tab_item.length; x++) {
                var that = this,
                    cls = [], // 클래스 정보명 
                    style = [], //  Style, 색정보용 Style  정보
                    attr = {}, // HTML Attri 정의하는 정보 설정
                    objXML,
                    subElement = tab_item[x];

                objXML = x2h.getXML2Control(subElement, that, attr, cls, style, function (type) {
                    return ["multi_lang"];
                });

                var liEle = document.createElement("li");
                headerEle.appendChild(liEle);
                liEle.className = "tabtitle";

                var type = "inactive";
                if (!activeTab && objXML.tabid && this.currenttabid) {
                    if (this.getInitCheck(objXML.tabid)) {
                        type = "active";
                        activeTab = x;
                        liEle.className += " clicked"
                    }
                }
                var cssstyle = hi5.getCustomStyle(this, type, true);
                if (hi5.WTS_MODE == WTS_TYPE.SPA)
                    cssstyle += "position:relative;";

                if (cssstyle != "") style.push(cssstyle);

                if (style.length)
                    attr["style"] = style.join("");

                // HTML Attribute 속성 변환( Style, Attribute, Class)
                style = x2h.attri(liEle, attr);

                if (this.tabequaldiv == "1") {
                    liEle.style.width = this.tabwidth;
                }

                if (this.linewidth != "1") {
                    liEle.style.borderWidth = this.linewidth + "px";
                }

                liEle.setAttribute("ind", objXML.no || "0");
                liEle.setAttribute("val", objXML.tabid);
                if (objXML.screenid) {
                    liEle.setAttribute("page", objXML.screenid);
                    // 탭정보 화면정보를 저장한다.
                    if (!this._pageInfo) this._pageInfo = {};
                    this._pageInfo[objXML.tabid] = {
                        tabIdx: objXML.no || 0,
                        screenid: objXML.screenid
                    };
                }

                var divEle = document.createElement("div");
                var spanEle = document.createElement("span");
                liEle.appendChild(divEle);
                divEle.appendChild(spanEle);

                var caption = "";
                if (objXML.multi_lang) {
                    caption = x2h.xmlGetMultiLangText(objXML.multi_lang, "caption");
                }
                spanEle.textContent = caption;
            }
            return activeTab ? activeTab : 0;
        },

        //탭 컨텐츠 구성
        createContents: function (tab_item, contentsEle, activeTab) {
            var subElement;
            debugger;
            for (var i = 0; i < tab_item.length; i++) {
                subElement = tab_item[i];

                var htmlDom = x2h.createHTMLDOM("<div></div>");
                var x = htmlDom.getElementsByTagName("div")[0],
                    attr = {
                        val: "",
                        id: "",
                        page: "",
                        "class": "tabscreen",
                        style: "display:none;"
                    };
                //x.style = "display:none;";
                var tabid = subElement.getAttribute("tabid");
                //x.setAttribute("val", tabid);
                attr.val = tabid;

                // 처음 atctibe
                if (this.getInitCheck(tabid)) {
                    //x.style = "display:block;";
                    attr.style = "display:block;";
                }
                var page = subElement.getAttribute("screenid");
                if (!page) {
                    var xmlNode = subElement.getElementsByTagName("control_info")[0];
                    if (xmlNode && xmlNode.childNodes.length > 0) {
                        this.objParentForm.xmlTabParser(xmlNode, x);
                    }
                } else {
                    //x.setAttribute("page", page);
                    //x.className = "tabscreen";
                    //x.id = this.id + "__" + tabid;
                    //attr.class = "tabscreen";
                    attr.page = page;
                    attr.id = this.id + "__" + tabid;
                }
                x2h.attri(x, attr);

                contentsEle.appendChild(x);
            }
        },
        createSlide: function (that, header, headerEle, contentsEle, h_title) {
            $(headerEle).addClass('slideTab_header')

            var headerTitle = document.createElement("div");
            header.appendChild(headerTitle);

            headerTitle.className = "slideTab_title";
            var caption = "";
            var tabitem_c = headerEle.childElementCount
            $(contentsEle).css('overflow', 'hidden');
            if (tabitem_c != 1) {
                var c_width = 20;
                if (tabitem_c > 2) c_width = 10;
                $(headerEle).width((tabitem_c * c_width) + '%');
                $(headerTitle).width('calc(100% - ' + $(headerEle).width() + '%)');

                //$(headerEle).children('.tabtitle').width('calc( 100% / ' + tabitem_c + ')'); <-익스에서 사용하면 calc적용이 제대로 되지 않아서 수정 2019.11.13 khk

                var tab_w_per = 100 / tabitem_c;
                tab_w_per = tab_w_per + '%';
                $(headerEle).children('.tabtitle').width(tab_w_per);

                if (h_title.multi_lang) {
                    caption = x2h.xmlGetMultiLangText(h_title.multi_lang, "caption");
                }
                headerTitle.textContent = caption;
            } else if (tabitem_c == 1) {
                $(headerTitle).width('100%');

                if (!h_title.multi_lang) {
                    headerTitle.textContent = headerEle.textContent;
                    headerEle.remove();
                } else {
                    caption = x2h.xmlGetMultiLangText(h_title.multi_lang, "caption");
                    headerTitle.textContent = caption;
                }

            }

            var tab_height = that.$html.height();

            $(headerTitle).on("click", function (evt, data) {
                if (h_title.formlink) contentsEle = "#" + that.id.replace(that.orgid, h_title.formlink);

                $(contentsEle).slideToggle('fast', function () {
                    var slideStat;
                    if ($(contentsEle).is(":hidden")) {
                        that.$html.height(h_title.tabheight)
                        //that.$html.animate({ height:h_title.tabheight })
                        slideStat = 'hidden';
                    } else {
                        that.$html.animate({
                            height: tab_height + 'px'
                        })
                        slideStat = 'show';
                    }
                    //이벤트 fire
                    /// <member id="OnTabSlide" kind="event" default="true">
                    /// <summary>탭의 슬라이드 모드일때 상태값 리턴</summary>
                    /// <remarks>remarks</remarks>
                    /// <param name = "slideStat" type="string">슬라이드 상태</param>
                    /// </member
                    if (that.OnTabSlide)
                        that.OnTabSlide(slideStat);
                });
            });
        },
        //탭의 초기 탭의 값을 반영하는 함수
        //화면 스크립트 단에 사용하도록 되어있다
        onInitAfter: function (option) {
            var tabID = this.currenttabid;
            // autoSave 인경우 변경시 처리
            if (option && option.autoSave) {
                var obj = option.autoSave;
                if (tabID != obj.tabID) {
                    // autoSave시에 저장정보와 다른 경우 기본값으로 처리
                    if (this._pageInfo && this._pageInfo[tabID]) {
                        tabID = option.tabID; // 기본값이 변경된 경우
                    }
                    $("#" + this.id + " .tabheaderContainer > li[val=" + tabID + "]").trigger("click");
                    // trigger 발생
                }
            }

            // 화면오픈처리 필요( 기본값 또는 AutoSave )
            if (tabID && this._pageInfo) {
                var screenID = this._pageInfo[tabID].screenid,
                    page = this.id + "__" + tabID;
                this.LoadScreen(this._pageInfo[tabID].screenid, page, true);
                //$("#" + this.id + " .tabheaderContainer").trigger("click", { tabID: this.currenttabid, tabidx: this.currenttabindex });
            }
            /*
            var obj = this;
            $("#" + this.id + " .tabheaderContainer > li").on("click", function (e) {
                var page, pageid;
                obj.currenttabid = $(this).attr("val");
                obj.currenttabindex = $(this).attr("ind");

                //탭 style 변경
                if (obj.orderstyle) {
                    $(this).parent().children('li').css({ borderWidth: '0px' });
                    $(this).css({ borderWidth: '1px' });
                }
                else {
                    $(this).parent().children('li').css(hi5.getCustomStyle(obj, "inactive")).removeClass("clicked");
                    $(this).css(hi5.getCustomStyle(obj, "active")).addClass("clicked");
                }

                var $tabcontents = $("#" + obj.id + " .tabcontents > div");
                for (var x = 0; x < $tabcontents.length; x++) {
                    var $tabcontent = $tabcontents[x];
                    var tabid = $($tabcontent).attr("val");
                    if (obj.currenttabid == tabid) {
                        $($tabcontent).css("display", "block");
                        page = $($tabcontent).attr("page");
                        pageid = $($tabcontent).attr("id");
                    }
                    else {
                        $($tabcontent).css("display", "none");
                    }
                }

                if (obj.preform) {
                    obj.preform.OnAllForminit();
                }

                if (page) {
                    obj.LoadScreen(page, pageid);
                }

                //이벤트 fire
                /// <member id="OnTabChanged" kind="event" default="true">
                /// <summary>다른 탭을 활성화 시킬경우 발생하는 이벤트</summary>
                /// <remarks>remarks</remarks>
                /// <param name = "nCurrentTab" type="string">활성화된 탭의 ID</param>
                /// </member>
                if (obj.OnTabChanged) {
                    obj.OnTabChanged.call(obj, obj.currenttabid);
                }
            });

            if (obj.currenttabid) {
                $("#" + this.id + " .tabheaderContainer > li[val=" + obj.currenttabid + "]").trigger("click");
            }
*/
        },

        //        // autosave
        //        GetAutoSave: function () {
        //            return "";
        //        },
        //
        //        AutoSaveCtrl: function () {
        //            return this.currenttabid;
        //        },

        // HTML 요소객체 취득
        GetElemnt: function () {
            return this.$html;
        },

        /// <member id="GetProp" kind="method">
        /// <summary>해당 컨트롤의 특정 property를 취득</summary>
        /// <remarks>remarks</remarks>
        /// <param name="propName" type="string">  </param>
        /// <returns type="string"> property에 해당하는 값 </returns>
        /// </member>
        GetProp: function (propName) {
            var $element = this.GetElemnt(),
                val;
            if (propName == "caption") {
                var $optionSelected = $element.find(".clicked > div");
                if ($optionSelected) {
                    val = $($optionSelected).text();
                }
            } else if (propName == 'currenttabid') {
                var $optionSelected = $element.find(".clicked");
                if ($optionSelected) {
                    val = $optionSelected.attr('val');
                }
            } else {
                val = $element.attr(propName);
            }
            return val;
        },

        /// <member id="SetProp" kind="method">
        /// <summary>해당 컨트롤의 property를 설정</summary>
        /// <remarks>remarks</remarks>
        /// <param name="propName" type="string">설정코자하는 Property 명칭</param>
        /// <param name="Value" type="string|boolean|object"></param>
        /// </member>
        SetProp: function (propName, Value) {
            var $element = this.GetElemnt();
            typeof (propName) === "object" ? $element.attr(propName): $element.attr(propName, Value);
        },

        Disabled: function (state) {
            if (state == undefined) return;
            if (state == true || state == "disabled" || state == "true")
                state = true;
            else if (state == false || state == "false")
                state = false;
            else return;

            $("#" + this.id).prop('disabled', state);
        },

        /// <member id="SetStyle" kind="method">
        /// <summary>해당 컨트롤의 property를 설정</summary>
        /// <remarks>remarks</remarks>
        /// <param name="propName" type="string">설정코자하는 Property 명칭</param>
        /// <param name="Value" type="string|boolean|object"></param>
        /// </member>
        SetStyle: function (style, value) {
            var $element = this.GetElemnt();
            typeof (style) === "object" ? $element.css(style): $element.css(style, value);
            return;
        },

        /// <member id="GetStyle" kind="method">
        /// <summary>해당 컨트롤의 property를 설정</summary>
        /// <remarks>remarks</remarks>
        /// <param name="propName" type="string">설정코자하는 Property 명칭</param>
        /// <param name="Value" type="string|boolean|object"></param>
        /// </member>
        GetStyle: function (style) {
            var $element = this.GetElemnt(),
                val;
            val = $element.css(style);
            return val;
        },

        /// <member id="SetFocus" kind="method">
        /// <summary>해당 컨트롤 focus 주기</summary>
        /// <remarks>해당 컨트롤 focus 주기</remarks>
        /// </member>
        SetFocus: function () {
            document.getElementById(this.id).focus();
        },

        /// <member id="SetOrderStyle" kind="method">
        /// <summary>탭 스타일을 주문스타일로 변경</summary>
        /// <remarks>주문탭에 맞는 색상으로 변경(총 3가지-매수/매도/정정취소)</remarks>
        /// </member>
        SetOrderStyle: function (inittab) {
            this.orderstyle = true;
            var buyStyles = {
                'background-color': "rgb(253,203,204)",
                'color': "rgb(145,1,1)",
                'border-color': 'rgb(145,1,1)',
                'border-width': '0px',
                'border-style': 'solid'
            };
            var sellStyles = {
                'background-color': "rgb(203,229,252)",
                'color': "rgb(79,93,116)",
                'border-color': 'rgb(79,93,116)',
                'border-width': '0px',
                'border-style': 'solid'
            };
            var modifyStyles = {
                'background-color': "rgb(229,225,200)",
                'color': "rgb(112,97,78)",
                'border-color': 'rgb(112,97,78)',
                'border-width': '0px',
                'border-style': 'solid'
            };

            //this.customStyle.activebgcolor = null;
            //this.customStyle.activefgcolor = null;
            //this.customStyle.bgcolor = null;

            var $tabcontents = $("#" + this.id + " .tabheaderContainer > li");
            for (var x = 0; x < $tabcontents.length; x++) {
                var $tabcontent = $tabcontents[x];
                var orderStyle;
                if (x == 0) orderStyle = buyStyles;
                else if (x == 1) orderStyle = sellStyles;
                else if (x == 2) orderStyle = modifyStyles;

                if (x == inittab) {
                    orderStyle["border-width"] = "1px";
                }

                $($tabcontent).css(orderStyle);
            }
        },

        /// <member id="SetTitleChange" kind="method">
        /// <summary>키 값으로 Text를 변경하는 함수</summary>
        /// <remarks>키 값으로 Text를 변경하는 함수</remarks>
        /// <param name="strKey" type="string">키값</param>
        /// <param name="strTitle" type="string">표시문자</param>
        /// <returns type="number"> 해당 인덱스 </returns>
        /// <example>var index = tab1.SetTitleChange(sID, strTitle);
        /// </example>
        /// </member>
        SetTitleChange: function (sID, strTitle) {
            var $element = this.GetElemnt();
            var $liEle = $element.find("li");
            var ret = -1;
            for (var x = 0; x < $liEle.length; x++) {
                var value = $($liEle[x]).attr("val");
                if (sID == value) {
                    var $textEle = $($liEle[x]).find("div");
                    $textEle.html(strTitle);
                    ret = x;
                    break;
                }
            }

            return ret;
        },

        /// <member id="SetTitleCnt" kind="method">
        /// <summary>타이틀 뒤에 숫자 표시</summary>
        /// <remarks>타이틀 뒤에 숫자 표시</remarks>
        /// <param name="strKey" type="string">키값</param>
        /// <param name="objData" type="object">objData.real : 실시간일때 true값으로 셋팅되서 들어옴, objData.count : 표시될 카운트</param>
        /// <returns type="number"> 해당 인덱스 </returns>
        /// <example>var index = tab1.SetTitleCnt(sID, 2);
        /// </example>
        /// </member>
        SetTitleCnt: function (sID, objData) {
            var nCnt = objData.count;
            if (!nCnt) nCnt = 0;
            var $element = this.GetElemnt();
            var $liEle = $element.find("li");
            var ret = -1;
            for (var x = 0; x < $liEle.length; x++) {
                var value = $($liEle[x]).attr("val");
                if (sID == value) {
                    var $textEle = $($liEle[x]).find("div");
                    var strTitle = $textEle.html();
                    var text = strTitle.split(" [")[0];

                    var nOldCnt = 0;
                    if (strTitle.split(" [").length > 1) {
                        var pTemp = strTitle.split(" [")[1].split("]");
                        nOldCnt = pTemp[0];
                    }

                    if (objData.real) {
                        var className = 'tab-highlight';
                        //debugger;
                        $($liEle[x]).addClass(className);
                        setTimeout(function () {
                            $($liEle[x]).removeClass(className);
                        }, 600);
                    }

                    text += " [" + nCnt + "]";
                    $textEle.html(text);
                    ret = x;
                    break;
                }
            }

            return ret;
        },

        /// <member id="OnTabChangeBefore" kind="event">
        /// <summary>탭 변경이 일어나기 직전에 발생하는 이벤트</summary>
        /// <remarks>리턴값이 true 이면 탭변경을 무시</remarks>
        /// <param name = "screen" type="string"> 기존 선택된 tabid </param>
        /// <param name = "newTabId" type="string"> 사용자가 선택한 tabid </param>
        /// <returns type="boolean"> true일때는 무시.</returns>
        /// <example><![CDATA[
        ///     function tab1.OnTabChangeBefore(screen, newTabId) {
        ///         if(g_onInit == 1) true;
        ///         else false;
        ///     }
        /// ]]></example>
        /// </member>


        //탭 동적 로딩
        LoadScreen: function (screenid, tabcontentid, bInit) {
            if (screenid == "") return;

            //html 내용 모두 삭제
            //document.getElementById(tabcontentid).innerHTML = "";
            //html 내용 모두 삭제
            var elem = hi5.getById(tabcontentid);
            if (elem) {
                if (bInit)
                    elem.style.display = "block";
                elem.innerHTML = "";
            }
            var objSubForm = this.objParentForm.SetChildAddForm(this);

            var options = {};

            options.tagName = "";
            options.initdata = "";
            options.form = objSubForm; // subForm 화면을 설정한다.
            options.tabcontentid = tabcontentid;
            if (this.preform) options.preform = this.preform;

            objSubForm.OpenSubScreen(screenid, options);

            this.preform = objSubForm;
        },


        /// <member id="SelectTab" kind="method">
        /// <summary>스크립트로 탭 체인지하는 메소드</summary>
        /// <remarks>선택하고자하는 해당 탭의 ID 혹은 인덱스로 선택합니다.</remarks>
        /// <param name = "nTabIndex" type="number">탭id or index</param>
        /// <param name = "bIndex" type="bool">true면 ID, false면 index</param>
        /// <example><![CDATA[
        ///            tab_1.SelectTab(0);
        /// ]]></example>
        /// </member>
        SelectTab: function (nTabIndex, bID, event) {
            var obj = this;
            var $clickedTab;
            if (!bID) {
                if (!isNaN(Number(nTabIndex))) {
                    if (nTabIndex >= obj.tabcount || nTabIndex < 0) return; //선택 가능 인덱스를 벗어나는 경우는 그냥 리턴
                    if (obj.currenttabindex == nTabIndex) return; //기선택된 인덱스와 동일할 경우 리턴
                    $clickedTab = $("#" + this.id + " .tabheaderContainer > li")[nTabIndex];
                } else {
                    $clickedTab = $("#" + this.id + " .tabheaderContainer > li[val=" + nTabIndex + "]");
                }

            } else {
                $clickedTab = $("#" + this.id + " .tabheaderContainer > li[val=" + bID + "]");
            }
            if ($clickedTab)
                $($clickedTab).trigger("click", event);

        },

        /// <member id="ShowHideTab" kind="method">
        /// <summary>특정탭을 show hide 하는 메소드</summary>
        /// <remarks>탭 id로 show hide 시킨다..</remarks>
        /// <param name = "sID" type="string">탭ID</param>
        /// <param name = "bShow" type="bool">true면 show, false면 hide</param>
        /// <example><![CDATA[
        ///            tab_1.ShowHideTab("A", true);
        /// ]]></example>
        /// </member>
        ShowHideTab: function (sID, bShow, resize, bFireEvt) {
            if (!sID) return;

            var thatTab = $("#" + this.id + " .tabheaderContainer > li[val=" + sID + "]");
            if (!thatTab) return;

            if (bShow) {
                thatTab.css({
                    display: 'block'
                });
            } else {
                thatTab.css({
                    display: 'none'
                });
                if (this.currenttabid == sID) {
                    var index = this.currenttabindex - 1;
                    if (index < 0) {
                        index = this.currenttabindex + 1;
                    }
                    if (bFireEvt) {
                        var $newSelected = $("#" + this.id + " .tabheaderContainer > li")[index];
                        if ($newSelected)
                            $($newSelected).trigger("click");
                    }
                }
            }
        },
        /// <member id="SetTabResize" kind="method">
        /// <summary>탭 아이템을 show hide 한 후 tabtitle 너비 재조정</summary>
        /// <remarks>탭 아이템을 show hide 한 후 tabtitle 너비 재조정한다..</remarks>
        /// <example><![CDATA[
        ///            tab_1.SetTabResize();
        /// ]]></example>
        /// </member>
        SetTabResize: function () {
            var title_cnt = $("#" + this.id + " .tabtitle:not([style*='display: none'])").length
            $("#" + this.id + " .tabtitle").width('calc( 100% / ' + title_cnt + ' )');
        }
    }

    tab.ctlName = "tab";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(tab.ctlName, tab);
    return tab;
}());