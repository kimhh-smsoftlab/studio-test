//tvchart.js
var g_tvchart_fid = {
    open: 'open',
    high: 'high',
    low: 'low',
    close: 'close',
    date: 'date',
    time: 'time',
    totvol: 'gvol',
    chevol: 'cvol',
    sign: 'sign',
    datetime : 'utctime'
}
var g_tvchart_real = {
    open: 'open',
    high: 'high',
    low: 'low',
    close: 'price',
    date: 'dt_work',
    time: 'conttime',
    totvol: 'gvol',
    chevol: 'cvol',
    sign: 'sign',
	datetime: 'utctime'
}
var Datafeeds = {};
(function () {
    'use strict';

    // init object
    var tvchart = function () {
        this.displayCount = 0;

        this.rqname = "";
        this.realname = "";

        this.itemflag = "2";    //itemflag 기본 OutPut
        this.comm_list = [];
        //this.realitem = [];
        this.realkeys = [];
        this.referitem = {};

        this.showLoading = false;
        this.nextKey = "";
        this.nextKeyLen = 0;

        this.bInit = true;

        this._realMng = null;  // 시세풀 관리( {자동갱신 타입 : 종목코드 배열[] }

        this.Datafeeds = null;
        this.widget = null;

        this.baseColor = {
            light:{
                background: '#ffffff',
                horzGrid: '#707070',
                vertGrid: '#707070',
                fontColor: '#333333'
            },
            light_contract:{
                background: '#f7f7f7',
                horzGrid: '#707070',
                vertGrid: '#707070',
                fontColor: '#333333'
            },
            dark:{
                background: '#1c283e',
                horzGrid: '#495770',
                vertGrid: '#495770',
                fontColor: '#afb9ca'
            }
        };
        this.tvoptions = {
            initcode: '',
            initinterval: '60',
            rqDataCount: 500,
            config: {
                "exchanges": [{ value: "coin", name: "coin", desc: "coin" }],
                "supports_search": true,
                "supports_group_request": false,
                "supports_marks": false,
                "symbolsTypes":
                [
                    { "name": "bitcoin", "value": "bitcoin" }
                ],
                "supported_resolutions": ["1", "5", "10", "30", "60", "120", "240", "D", "W", "M"]
            },
            //loading_screen: { "backgroundColor": "inherit" },
            toolber_bg: '#f4f7f9',
            custom_css_url: 'tradingview2.css?cb=10',
            time_frames_option: [
                { "text": "1m", "resolution": "1", "description": "1 Min" },
                { "text": "10m", "resolution": "10", "description": "10 Min" },
                { "text": "30m", "resolution": "30", "description": "30 Min" },
                { "text": "1h", "resolution": "60", "description": "1 Hour" },
                { "text": "4h", "resolution": "240", "description": "4 Hour" },
                { "text": "1d", "resolution": "D", "description": "Day" },
                { "text": "1w", "resolution": "W", "description": "Week" }
            ],
            enabled_features: [
				"left_toolbar",
                "move_logo_to_main_pane",
				"keep_left_toolbar_visible_on_small_screens",
                //"hide_left_toolbar_by_default",
                "side_toolbar_in_fullscreen_mode"
            ],
            disabled_features: [
                "save_chart_properties_to_local_storage",
                //"volume_force_overlay", // 볼륨 겹치게/나눠서
                "study_templates",
                "header_undo_redo",
                "header_saveload",
		        "header_fullscreen_button",
                "header_symbol_search",
                "symbol_search_hot_key",
                "adaptive_logo",
                "go_to_date",
                "header_compare",
                "compare_symbol",
				//"control_bar",
				"timeframes_toolbar",
                //"left_toolbar",

                "use_localstorage_for_settings" // 비활성화 해야 favorites 설정 가능
            ],
            overrides: {
                "mainSeriesProperties.style": 1, // 기본 차트 종류 지정 1:캔들
                'paneProperties.legendProperties.showLegend': true,
                'paneProperties.topMargin' : 10,
                'paneProperties.bottomMargin' : 25,
                "volumePaneSize": "medium" //tiny, small, medium, large
            },
            studies_overrides: {
                "compare.plot.color": "#A4AEC0",
                "compare.plot.linewidth": 3,
                "compare.source": "close",
                "Overlay.style" : 2,
                "Overlay.lineStyle.color" : "#A4AEC0",
                "Overlay.lineStyle.priceSource" : "close",
                "Overlay.lineStyle.linewidth" : 3,
                "Overlay.lineStyle.styleType" : 2,
                "volume.volume.plottype": "columns",
                "volume.volume.transparency": 60,
                "volume.volume.color.0": "rgba(223,95,88,0.6)",
                "volume.volume.color.1": "rgba(72,185,111,0.6)",
                "volume.volume ma.plottype": "line",
                "volume.volume ma.color": "#9bba8e",
                "volume.volume ma.transparency": 50,
                "volume.volume ma.linewidth": 2,
                "volume.MA length": 15,
                "volume.show ma": true
            },
            interval: ["1", "5", "10", "30", "60", "120", "240", "D", "W", "M"],
            SymbolInfo: {
                "data_status": "streaming",
                "exchange-traded": 'BISPEX',
                "exchange-listed": 'BISPEX',
                "has_daily": true,
                "has_weekly_and_monthly": true,
                "has_intraday": true,
                "has_no_volume": false,
                "minmov": 1,
                "minmov2": 0,
                "pointvalue": 1,
                "pricescale": 10000000,
                "session": "24x7",
                "supported_resolutions": ["1", "5", "10", "30", "60", "120", "240", "D", "W", "M"],
                //"timezone": "Asia/Seoul",
                "timezone": 'UTC',
                "type": "coin",
                "volume_precision": 4
            },
            lastChartDate: 0
        };
        this.code = "";
        this.interval = "60";
        this.tradingUrl = false;

        this.lastbar = {
            date: '',
            time: '',
            open: 0,
            high: 0,
            low: 0,
            close: 0,
            volume: 0
        };

        this.jisuBar = {
            entityId : "",
            code : "",
            interval : "",
            lastbar : {

            }
        }

        this._realArrayMode = true;
    }

    // unix time의 값으로 마지막 봉 비교
    function getLastTime(datetime, interval) {
        var todate = parseFloat(datetime + "000");
        var unixTime = new Date(todate);

        var yyyy = unixTime.getFullYear();
        var mm = unixTime.getMonth();
        var dd = unixTime.getDate();

        var h = unixTime.getHours(), m = unixTime.getMinutes(), s = unixTime.getSeconds(), sss = "000";

        if (interval) {
            if (interval == "D" || interval == "W" || interval == "M") {
                h = "00"; m = "00"; s = "00"; sss = "000";
            }
            else {
                //분봉은 0:00 시작을 기준으로 계산
                var strStartEpochTime = parseFloat(new Date(yyyy, mm, dd, "00", "00", "00", "000").getTime(), 10);
                var strCurrentEpochTime = parseFloat(new Date(yyyy, mm, dd, h, m, "00", "000").getTime(), 10);

                var ntickEpoch = parseInt(interval) * 60 * 1000;

                var charttime = strStartEpochTime + ((strCurrentEpochTime - strStartEpochTime) - ((strCurrentEpochTime - strStartEpochTime) % ntickEpoch))/* + ntickEpoch*/;
                return charttime;
            }
        }
        var new_date = new Date(yyyy, mm, dd, h, m, s, sss).getTime();

        return new_date;
    }

    function ConvertToChartTime(date, time, interval) {
        var new_date = "";
        date = date.toString();

        var yyyy = date.substring(0, 4);
        var mm = date.substring(4, 6);
        var dd = date.substring(6, 8);

        var h = "00", m = "00", s = "00", sss = "000";
        if (time && time != "") {
            h = time.substring(0, 2);
            m = time.substring(2, 4);
            s = time.substring(4, 6);
        }

        if (interval) {
            if (interval == "D" || interval == "W" || interval == "M") {
                h = "00"; m = "00"; s = "00"; sss = "000";
            }
            else {
                //분봉은 0:00 시작을 기준으로 계산
                var strStartEpochTime = parseFloat(new Date(yyyy, mm - 1, dd, "00", "00", "00", "000").getTime(), 10);
                var strCurrentEpochTime = parseFloat(new Date(yyyy, mm - 1, dd, h, m, "00", "000").getTime(), 10);

                var ntickEpoch = parseInt(interval) * 60 * 1000;

                var charttime = strStartEpochTime + ((strCurrentEpochTime - strStartEpochTime) - ((strCurrentEpochTime - strStartEpochTime) % ntickEpoch))/* + ntickEpoch*/;
                return charttime;
            }
        }
        mm = mm - 1;
        new_date = new Date(yyyy, mm, dd, h, m, s, sss).getTime();

        return new_date;
    }

    tvchart.prototype = {
        onDestroy: function () {
            if (this._realMng) {
                this._realMng.destroy();
                this._realMng = null;
            }

            var widget = this.widget;
            if (widget) {
                try{
                    widget.save(function(chartdataObj){
                        //console.log(chartdataObj);
                        hi5.SetStorage('tvchartsetting', JSON.stringify(chartdataObj));
                    });
                }
                catch(e){
                    console.warn(e);
                }
                this.widget = null;
            }
        },

        propertyLoad: function (node, nodeName, xmlHolderElement) {
            var that = this,
            cls = ["hi5_tvchart"],
            style = [],
            attr = { id: "" },
            dataCell = "";  // caption

            var objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                return ["options"];
            });
            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            style = x2h.attri(xmlHolderElement, attr);
            
            if (objXML.options) {
                $.extend(that.tvoptions, objXML.options);
            }       

            if (objXML.referitem) {
                this.referitem = hi5.getJSONParse(objXML.referitem);
                this.comm_list = this.referitem.comm_list;
            }

            if (objXML.realitem) {
                var realitems = objXML.realitem.split(",");
                this.realitem = [];
                for (var x = 0; x < realitems.length; x++) {
                    this.realitem.push(realitems[x]);
                    this.objParentForm.realitems[realitems[x]] = [];
                }
            }
        },

        getChart : function () {
            return this.widget.chart();
        },

        onInitAfter: function () {
            // 거래사이트인지 여부 판별, 최초 종목정보를 위하여.
            var pathName = $(location).attr('pathname');
            if(pathName.indexOf('/trade') > -1) {
                this.tradingUrl = true;
            }
            else{
                this.tradingUrl = false;
            }

            //기본색상 정보 취득    2019.02.19 kws
            var objNecColor = {
                "up": { "class": "up_txt", "necColor": "color" },                 // 호가상승(기준가대비) 
                "down": { "class": "low_txt", "necColor": "color" }
            };
            var objColor = {};
            hi5_getMultiColor(this.id, objColor, objNecColor);
            var upColor = rgb2hex(objColor.up);
            var downColor = rgb2hex(objColor.down);
            var themeColor = hi5.SHMEM.user_setting.general.theme;
            //
            if(this.$html.hasClass("contract_cht") && hi5.SHMEM.user_setting.general.theme == "light")  themeColor = "light_contract";
            //debugger;
            var chartColor = {
				"paneProperties.background": hi5.WTS_MODE == WTS_TYPE.MTS ? this.baseColor.light.background : this.baseColor[themeColor].background, // 밝은 테마가 기본
                "mainSeriesProperties.style": 1, // 기본 차트 종류 지정 1:캔들
                "mainSeriesProperties.candleStyle.upColor": upColor,
                "mainSeriesProperties.candleStyle.downColor": downColor,
                "mainSeriesProperties.candleStyle.wickUpColor": upColor,
                "mainSeriesProperties.candleStyle.wickDownColor": downColor,
                "mainSeriesProperties.candleStyle.borderUpColor": upColor,
                "mainSeriesProperties.candleStyle.borderDownColor": downColor,
                "mainSeriesProperties.hollowCandleStyle.upColor": upColor,
                "mainSeriesProperties.hollowCandleStyle.downColor": downColor,
                "mainSeriesProperties.hollowCandleStyle.wickUpColor": upColor,
                "mainSeriesProperties.hollowCandleStyle.wickDownColor": downColor,
                "mainSeriesProperties.hollowCandleStyle.borderUpColor": upColor,
                "mainSeriesProperties.hollowCandleStyle.borderDownColor": downColor,
                "mainSeriesProperties.haStyle.upColor": upColor,
                "mainSeriesProperties.haStyle.downColor": downColor,
                "mainSeriesProperties.haStyle.wickUpColor": upColor,
                "mainSeriesProperties.haStyle.wickDownColor": downColor,
                "mainSeriesProperties.haStyle.borderUpColor": upColor,
                "mainSeriesProperties.haStyle.borderDownColor": downColor,
                "scalesProperties.backgroundColor" : "#afb9ca",
                "scalesProperties.lineColor" : hi5.WTS_MODE == WTS_TYPE.MTS ? this.baseColor.light.fontColor : this.baseColor[themeColor].fontColor, //"#afb9ca",
                "scalesProperties.textColor" : hi5.WTS_MODE == WTS_TYPE.MTS ? this.baseColor.light.fontColor : this.baseColor[themeColor].fontColor, //"#afb9ca",
                'paneProperties.legendProperties.showLegend': true,
				"paneProperties.horzGridProperties.style": 1,
				"paneProperties.horzGridProperties.color": hi5.WTS_MODE == WTS_TYPE.MTS ? this.baseColor.light.horzGrid : this.baseColor[themeColor].horzGrid,
				"paneProperties.vertGridProperties.color": hi5.WTS_MODE == WTS_TYPE.MTS ? this.baseColor.light.vertGrid : this.baseColor[themeColor].vertGrid,
                "paneProperties.vertGridProperties.style": 1,
                "volume.volume.color.0": "rgba(72,185,111,0.6)",
                "volume.volume.color.1": "rgba(223,95,88,0.6)",
                "volumePaneSize": "medium" //tiny, small, medium, large
            }

            // 2019.09.20 kws
            // 테마 지정
            if(hi5.WTS_MODE != WTS_TYPE.MTS){
                if(hi5.SHMEM.user_setting){
                    if(hi5.SHMEM.user_setting.general){
                        if(hi5.SHMEM.user_setting.general.theme){
                            if(hi5.SHMEM.user_setting.general.theme == "dark"){
                                this.tvoptions["custom_css_url"] = "tradingview.css?cb=10";
                                chartColor["paneProperties.background"] = this.baseColor.dark.background;
                                chartColor["paneProperties.horzGridProperties.color"] = this.baseColor.dark.horzGrid;
                                chartColor["paneProperties.vertGridProperties.color"] = this.baseColor.dark.vertGrid;
                                chartColor["scalesProperties.lineColor"] = this.baseColor.dark.fontColor;
                                chartColor["scalesProperties.textColor"] = this.baseColor.dark.fontColor;
                
                            }
                            else{
                                // chartColor["paneProperties.background"] = this.baseColor.light.background;
                                // chartColor["paneProperties.horzGridProperties.color"] = this.baseColor.light.horzGrid;
                                // chartColor["paneProperties.vertGridProperties.color"] = this.baseColor.light.vertGrid;
                                // chartColor["scalesProperties.lineColor"] = this.baseColor.light.fontColor;
                                // chartColor["scalesProperties.textColor"] = this.baseColor.light.fontColor;
                                if(themeColor == "light_contract") this.tvoptions["custom_css_url"] = "tradingview3.css?cb=10";
                                chartColor["paneProperties.background"] = this.baseColor[themeColor].background;
                                chartColor["paneProperties.horzGridProperties.color"] = this.baseColor[themeColor].horzGrid;
                                chartColor["paneProperties.vertGridProperties.color"] = this.baseColor[themeColor].vertGrid;
                                chartColor["scalesProperties.lineColor"] = this.baseColor[themeColor].fontColor;
                                chartColor["scalesProperties.textColor"] = this.baseColor[themeColor].fontColor;
                            }
                        }
                    }
                }
            }
            $.extend(this.tvoptions.overrides, chartColor);

            // hi5.SHMEM 이 구성되기전에 차트 init이 된다.
            // 고로 localstorage에 있는 종목을 가져와서 표시.
            // localstorage에도 없으면 g_masterInfo 에서 USDT의 첫번째 종목을 가져온다.
            // 단, 트레이딩 사이트일때만.
            // 계약 가이드 사이트는 기본값을 BTCSwap으로 정한다.
            if(this.tradingUrl){
                var leftTabData = simpleStorage.get('left_tab_idx');
                var leftSubTabData = simpleStorage.get('left_subtab_idx');
                if(hi5.SHMEM.symbol){
                    this.code = hi5.SHMEM.symbol.code;
                }
                else{
                    if(leftTabData && leftTabData.tabIndx){
                        var symbolS;
                        if(leftTabData.tabIndx == "SPOT"){
                            symbolS = simpleStorage.get('symbol_00');
                        }
                        else if(leftTabData.tabIndx == "FUT"){
                            symbolS = simpleStorage.get('symbol_20');
                        }
                        else if(leftTabData.tabIndx == "INS"){
                            this.code = hi5.getInsuranceCode("code");
                        }

                        if(symbolS){
                            this.code = symbolS.symbol;
                        }
                    }
                }

                // 마스터파일에서 첫번째 USDT 종목을 가져온다.
                if(this.code == ""){
                    var subTabIndx = "USDT";
                    if(leftSubTabData && leftSubTabData.tabIndx){
                        subTabIndx = leftSubTabData.tabIndx;
                    }
                    var masters = Object.keys(g_masterInfo);
                    var seqn;
                    for(var x = 0;x < masters.length;x++){
                        var masterObj = g_masterInfo[masters[x]];
                        if(masterObj.base_currency_co == subTabIndx && masterObj.use_yn == "Y"){
                            if(parseInt(masterObj.seqn) < seqn || !seqn){
                                seqn = parseInt(masterObj.seqn);
                                this.code = masters[x];
                            }
                        }
                    }
                }
            }
            var self = this;

            $(window).bind('beforeunload',function(){
                self.onDestroy();
            });

            if (self.tvoptions.initcode != "") {
                self.code = self.tvoptions.initcode;
            }

            if (!self.code) {
                self.code =  '';
            }
            if (hi5.WTS_MODE == WTS_TYPE.MTS) {
                self.tvoptions.disabled_features.push("property_pages");
                self.tvoptions.custom_css_url = "mobile.css?cb=5";
                self.tvoptions.enabled_features = [
                    "hide_left_toolbar_by_default",
                    "move_logo_to_main_pane"
                ];
                self.tvoptions.preset = "mobile";
                self.tvoptions.interval = ["1", "60", "D"];
                if(!self.code){
                    if(this.objParentForm.objContainer){
                        var parentForm = this.objParentForm.objContainer.objParentForm;
                        if(parentForm){
                            var jmcObj = parentForm.GetControl("jmc_mobile");
                            if(jmcObj){
                                if(jmcObj.item_sect == ITEM_SECT.INS){
                                    self.code = hi5.getInsuranceCode("symbol");
                                }
                                else
                                    self.code = jmcObj.code;
                            }
                        }
                    }
                }
            }

            // 2020.03.26 kws
            // 결함번호 1487
            var initinterval = hi5.GetStorage('tvinterval');
            if(initinterval){
                self.tvoptions.initinterval = initinterval;
                self.interval = initinterval;
            }

            var disabled = $("#" + this.id).prop("disabled");
            self.Datafeeds = new Datafeeds.UDFCompatibleDatafeed("", "", self);

            
            // var chartSetting = hi5.GetStorage('tvchartsetting');
            // if(chartSetting){
            //     var chartSettingObj = JSON.parse(chartSetting);
            //     console.log(chartSettingObj);
            //     var chartProperties = chartSettingObj.charts[0].chartProperties;
            //     // 색상은 테마 따라가야한다
            //     chartProperties.paneProperties.background = chartColor["paneProperties.background"];
            //     chartProperties.paneProperties.vertGridProperties.color = chartColor["paneProperties.vertGridProperties.color"];
            //     chartProperties.paneProperties.horzGridProperties.color = chartColor["paneProperties.horzGridProperties.color"];
            //     chartProperties.scalesProperties.lineColor = chartColor["scalesProperties.lineColor"];
            //     chartProperties.scalesProperties.textColor = chartColor["scalesProperties.textColor"];
            //     // 종목은 마지막 선택되어져 있는걸로
            //     var chartPanes = chartSettingObj.charts[0].panes;
            //     for(var x = 0;x < chartPanes.length;x++){
            //         var paneObj = chartPanes[x];
            //         var deleteSourceIdx;
            //         var sources = paneObj.sources;
            //         for(var y = 0;y < sources.length;y++){
            //             var sourceObj = sources[y];
            //             if(sourceObj.type == "MainSeries"){
            //                 sourceObj.state.symbol = self.code;
            //                 sourceObj.state.shortName = self.code;
            //             }
            //             else if(sourceObj.type == "study_Compare"){
            //                 // 지수가 없는것은 삭제한다.
            //                 if(g_masterInfo[self.code]){
            //                     if(!g_masterInfo[self.code].upjongcode){
            //                         deleteSourceIdx = y;
            //                     }
            //                     else{
            //                         self.jisuBar.entityId = sourceObj.id;
            //                     }
            //                 }
            //             }
            //         }
            //         if(deleteSourceIdx){
            //             sources.splice(deleteSourceIdx, 1);
            //         }
            //     }
            //     self.chartSetting = chartSettingObj;
            //     tvOption.saved_data = chartSettingObj;
            // }
            
            return;
        },
        
        StartChart : function() {
            let self = this;
            var tvOption = {
                debug: false,
                symbol: self.code,
                interval: self.tvoptions.initinterval,
                autosize: true,
				fullscreen: false,
                loading_screen: { 
                    "backgroundColor": hi5.WTS_MODE == WTS_TYPE.MTS ? this.baseColor.light.background : this.baseColor[themeColor].background,
                    "foregroundColor": hi5.WTS_MODE == WTS_TYPE.MTS ? this.baseColor.light.background : this.baseColor[themeColor].background
                }, 
                container_id: self.id,
                datafeed: self.Datafeeds,
                library_path: hi5.getURL({url : "lib/tradingview/charting_library/"}),
                locale: local_lang,
                drawings_access: {
                    type: 'black',
                    tools: [
                        {
                            name: "Regression Trend"
                        }
                    ]
                },
                // 로드시 불필요한 영역 제거
                disabled_features: self.tvoptions.disabled_features,
                enabled_features: self.tvoptions.enabled_features,
                custom_css_url: self.tvoptions.custom_css_url,
                overrides: self.tvoptions.overrides,
                favorites: {
                    intervals: self.tvoptions.interval
                },
                // volume 색상 설정
                studies_overrides: self.tvoptions.studies_overrides,

                // 지역 시간
                //timezone: 'Asia/Seoul',
                timezone: 'UTC',
                time_frames: self.tvoptions.time_frames_option,
                client_id: 'bispex',
                user_id: 'bispex_chart'
            }

            self.widget = new TradingView.widget(tvOption);

            self.widget.onChartReady(function () {
                var tv_chart = self.getChart();
                function createHeaderButton(text, title, clickHandler, options) {
                    var button = self.widget.createButton(options);
                    button[0].setAttribute('title', title);
                    button[0].setAttribute('class', 'indexBtn');
                    button[0].textContent = text;
                    if(g_masterInfo[self.code]){
                        if(!g_masterInfo[self.code].upjongcode){
                            button[0].style = "display:none;";
                        }
                    }
                    
                    button[0].addEventListener('click', clickHandler);
                }
                let textIndex = {
                    'en' : 'Index',
                    'ko' : '지수',
                    'zh' : '指数',
                    'jp' : '指数'
                }
                createHeaderButton(textIndex[local_lang], 'Add/Remove ' + textIndex[local_lang], function() {
                    //tv_chart.createStudy("Moving Average", false, false, [5], null, { "Plot.color": "#ac228b" });
                    //tv_chart.createStudy("Moving Average", false, false, [20], null, { "Plot.color": "#15cb7c" });
                    //tv_chart.createStudy("Moving Average", false, false, [60], null, { "Plot.color": "#f5d62b" });

                    if(g_masterInfo[self.code]){
                        if(g_masterInfo[self.code].upjongcode){
                            var upjongcode = g_masterInfo[self.code].upjongcode;
                            if(g_upjongInfo[upjongcode].base_code){
                                var base_code = g_upjongInfo[upjongcode].base_code;
                                if(self.jisuBar.entityId && self.jisuBar.entityId != ""){
                                    tv_chart.removeEntity(self.jisuBar.entityId);
                                    self.jisuBar.code = "";
                                    self.jisuBar.entityId = "";
                                }
                                else{
                                    tv_chart.createStudy('Compare', false, false, ["close", base_code], function(entityId){
                                        self.jisuBar.entityId = entityId;
                                        self.jisuBar.code = base_code;
                                        self.jisuBar.interval = self.interval;
                                    });
                                    var t = self.widget.activeChart()._chartWidget._model.m_model.m_mainSeries.priceScale().properties();
                                    //var n = t.log._value;
                                    //var i = t.percentage._value;
                                    t.log.setValue(false);
                                    t.percentage.setValue(false);
                                }
                            }
                        }
                    }
                });

                /*if(hi5.SHMEM.user_setting){
                    if(hi5.SHMEM.user_setting.general){
                        if(hi5.SHMEM.user_setting.general.theme){
                            self.SetiFrameClass(hi5.SHMEM.user_setting.general.theme);
                        }
                    }
                }*/
                function toggleFullScreen() {
                    if ($('#' + self.id + ' iframe').length < 1) {
                        return;
                    }
                    self.widget.chart().executeActionById("drawingToolbarAction"); //사이드바 보임
                    //$('#' + self.id + ' iframe').contents().find('.header-group-properties').toggle(); //설정버튼 보임
                    $('#' + self.id + ' iframe').contents().find('.fullscreen').toggleClass('on');
                    $('#' + self.id + ' iframe').contents().find('.header-chart-panel-content').toggleClass('on');
                }
                function chartToggleFullScreen(id) {
                    var elem = document.getElementById(id);
                    var req;
                    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
                        req = document.toggleFullScreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
                        req.call(document);
                    } else {
                        req = elem.requestFullscreen || elem.webkitRequestFullScreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
                        req.call(elem);
                    }
                    document.addEventListener("webkitfullscreenchange", toggleFullScreen, false);
                    document.addEventListener("mozfullscreenchange", toggleFullScreen, false);
                    document.addEventListener("MSFullscreenChange", toggleFullScreen, false);
                    document.addEventListener("fullscreenchange", toggleFullScreen, false);
                }
                function setIntervalText(intervals) {
                    var spans = $('#' + self.id + ' iframe').contents().find('.header-group-intervals .quick > span');
                    if (spans.length > 0) {
                        /*for (var x = 0; x < spans.length; x++) {
                            var spanEle = spans[x];

                            var interval = intervals[x];
                            var unit = "";
                            if (interval < 60) unit = $hi5_regional.chart.mm || "min";
                            else if (interval < 720) {
                                unit = $hi5_regional.chart.hh || "h";
                                interval = interval / 60;
                            }
                            else {
                                if (interval == undefined) interval = $hi5_regional.chart.D || "D";
                                interval = "1" + $hi5_regional.chart[interval];
                            }                       
                            spanEle.innerHTML = interval + unit;
                        }*/
                        //spanEle.innerHTML = "30min";
						spans[spans.length - 1].style.display = "none";
                    }
                }
                
                setIntervalText(self.tvoptions.interval);

                var chartSetting = hi5.GetStorage('tvchartsetting');
                if(chartSetting){
                    //self.widget.load(JSON.parse(chartSetting));
                }
                else{
                    tv_chart.createStudy("Moving Average", false, false, [5], null, { "Plot.color": "#ac228b" });
                    tv_chart.createStudy("Moving Average", false, false, [20], null, { "Plot.color": "#15cb7c" });
                    tv_chart.createStudy("Moving Average", false, false, [60], null, { "Plot.color": "#f5d62b" });
                }
                self.widget.activeChart().onDataLoaded().subscribe({}, function () {
                    if (tv_chart.symbol() != self.code) {
                        self.widget.setSymbol(self.code,self.initinterval, function () { });
                    }
                }, true);

                self.widget.activeChart().onIntervalChanged().subscribe({}, function (interval, obj) {
                    hi5.SetStorage('tvinterval', interval);
                    if(self.widget.chart()){
                        self.widget.chart().executeActionById("timeScaleReset");
                    }
                    if (!self.tvoptions.jsontype)
                        self.interval = interval;
                    self.nextKey = "";
                    self.nextKeyLen = 0;
                    self.tvoptions.lastChartDate = 0;
                    //self.onResetCacheNeededCallback();
                    self.widget.setSymbol(self.code, interval, function () { });
                });
            
                //풀스크린 커스텀
                if (hi5.WTS_MODE != WTS_TYPE.MTS) {
                    if (document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled) {
                        self.widget.createButton().attr('title', 'Full Screen').addClass('fullscreen').on('click', function () {
                            var id = $('#' + self.id + ' iframe').attr('id');
                            chartToggleFullScreen(id);
                        }).append($('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 586.09999 586.09996" width="18" height="18" enable-background="new 0 0 595.3 841.9"><path d="M172.6 367.9l-97.7 97.7L0 390.7v195.4h195.4l-74.9-74.9 97.7-97.7-45.6-45.6zM195.4 0H0v195.4l74.9-74.9 97.7 97.7 45.6-45.6-97.7-97.7L195.4 0zm195.3 0l74.9 74.9-97.7 97.7 45.6 45.6 97.7-97.7 74.9 74.9V0H390.7zm22.8 367.9l-45.6 45.6 97.7 97.7-74.9 74.9h195.4V390.7l-74.9 74.9-97.7-97.7z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 60" width="17" height="15"><g transform="translate(0,60) scale(0.1,-0.1)" stroke="none"><path d="M25 570 c-18 -20 -18 -22 30 -70 l49 -50 -39 -40 -39 -40 102 0 102 0 0 102 0 102 -40 -39 -40 -39 -48 47 c-26 26 -50 47 -53 47 -3 0 -14 -9 -24 -20z"/><path d="M578 543 l-48 -47 -40 39 -40 39 0 -102 0 -102 102 0 102 0 -39 40 -39 40 49 50 c48 48 48 50 30 70 -10 11 -21 20 -24 20 -4 0 -28 -21 -53 -47z"/><path d="M65 190 l39 -40 -49 -50 -49 -50 22 -22 22 -22 50 49 50 49 40 -39 40 -39 0 102 0 102 -102 0 -102 0 39 -40z" /><path d="M450 128 l0 -102 40 39 40 39 50 -49 50 -49 22 22 22 22 -49 50  -49 50 39 40 39 40 -102 0 -102 0 0 -102z" /></g></svg>'));
                    }
                }
            });

        },
        /// <member id="SetiFrameClass" kind="method">
        /// <summary>차트 iFrame내부 body 영역에 class 지정/삭제</summary>
        /// <remarks>색상 테마 변경 시, iframe 내부까지는 class 영향도가 없어서 별도로 class를 지정
        /// </remarks>
        /// <param name = "theme" type="string">테마</param>
        /// </member>
        SetiFrameClass : function(theme){
            $("#" + this.id).children('iframe').contents().find('body').removeClass("light dark");
            $("#" + this.id).children('iframe').contents().find('body').addClass(theme);

            var overrideObj = {
                'paneProperties.background':this.baseColor[theme].background, 
                "paneProperties.horzGridProperties.color" : this.baseColor[theme].horzGrid, 
                "paneProperties.vertGridProperties.color" : this.baseColor[theme].vertGrid,
                "scalesProperties.lineColor" : this.baseColor[theme].fontColor, //"#afb9ca",
                "scalesProperties.textColor" : this.baseColor[theme].fontColor //"#afb9ca",
            }
            this.widget.applyOverrides(overrideObj);
        },

        GetElemnt : function () {
            return this.$html;
        },

        GetCommValue : function (option) {
            // 통신중
            this.showLoading = true;
            if (commAPI.getRealTime() && this.realitem.length > 0) {
                // 시세Pool Paint 타이머를 등록한다.
                if (!this._realMng) {
                    this._realMng = new hi5_realMng();
                    this._realMng.init({ control: this, update: false });
                } else {
                    this._realMng.clear();
                }
            }

            if (option.PrevNext > 1) {
                option.nextKey = this.nextKey;
            }
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

            if (typeof (style) === "object") {
                $element.css(style);
            }
            else {
                $element.css(style, value);
            }

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
                val = $element.text();
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
            else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
            }
        },

        OnGetData : function (rdata, option) {
            /*this.showLoading = false;

            var nodata = false;
            var chartdata = rdata;
            if (this.nextKey == option.nextKeyBuf) {
                nodata = true;
                this.lastdata = true;
            }
            this.nextKey = option.nextKeyBuf;
            this.nextKeyLen = option.nextKeyLen;

            var obj = this;
            var referitem = obj.referitem;

            var openItem = g_tvchart_fid.open;
            var highItem = g_tvchart_fid.high;
            var lowItem = g_tvchart_fid.low;
            var closeItem = g_tvchart_fid.close;
            var dateItem = g_tvchart_fid.date;
            var timeItem = g_tvchart_fid.time;
            var volItem = g_tvchart_fid.chevol;
            var signItem = g_tvchart_fid.sign;
            var datetimeItem = g_tvchart_fid.datetime;

            if (referitem) {
                if (referitem.data) {
                    openItem = referitem.data.open;
                    highItem = referitem.data.high;
                    lowItem = referitem.data.low;
                    closeItem = referitem.data.close || referitem.data.price;
                    dateItem = referitem.data.date;
                    timeItem = referitem.data.time;
                    volItem = referitem.data.chevol;
                    signItem = referitem.data.sign;
                    datetimeItem = referitem.data.datetime;
                }
            }

            var data = {
                's': 'ok',
                'v': [],
                't': [],
                'o': [],
                'h': [],
                'l': [],
                'c': []
            };

            if (chartdata.length < 1 || chartdata.length < obj.tvoptions.rqDataCount) {
                nodata = true;
                this.lastdata = true;
            }
            if ((option.prevnext == 1 && option.nextKeyBuf == "") || (option.prevnext == 2 && !option.dataExist)) {
                nodata = true;
                this.lastdata = true;
            }
            for (i = chartdata.length - 1; i >= 0; i--) {
                var date = chartdata[i][dateItem];
                var time = chartdata[i][timeItem];
                var open = parseFloat(chartdata[i][openItem]);
                var high = parseFloat(chartdata[i][highItem]);
                var low = parseFloat(chartdata[i][lowItem]);
                var close = parseFloat(chartdata[i][closeItem]);
                var volume = parseFloat(chartdata[i][volItem]);
                var datetime = parseFloat(chartdata[i][datetimeItem] + "000");

                //var todate = ConvertToChartTime(date, time);
                //todate = parseFloat(todate);

                var todate = datetime;

                data.t.push(todate); // times
                data.o.push(open); // opens
                data.h.push(high); // highs
                data.l.push(low); // lows
                data.c.push(close); // closes
                data.v.push(volume); // volumes
                if (0 == i) {
                    this.tvoptions.lastChartDate = todate;

                    this.lastbar = {
                        todate: todate,
                        date: date,
                        time: time,
                        open: open,
                        high: high,
                        low: low,
                        close: close,
                        volume: volume
                    };
                }
            }

            var bars = [];

            var volumePresent = typeof data.v != 'undefined';
            var ohlPresent = typeof data.o != 'undefined';

            for (var i = 0; i < chartdata.length; ++i) {
                var barValue = {
                    time: data.t[i],
                    close: data.c[i]
                };

                if (volumePresent) {
                    barValue.volume = data.v[i];
                }
                var valueCheck = data.o[i] === 0 || data.h[i] === 0 || data.l[i] === 0 || data.c[i] === 0;//가끔 데이터가 0으로 들어옴
                if (ohlPresent && !valueCheck) {
                    barValue.open = data.o[i];
                    barValue.high = data.h[i];
                    barValue.low = data.l[i];
                } else {
                    barValue.open = barValue.high = barValue.low = barValue.close = data.c[i - 1];
                    barValue.volume = 0;
                }

                bars.push(barValue);
            }

            if (this.onDataCallback) {
                this.onDataCallback(bars, { noData: false, nextTime: data.nb || data.nextTime });
                if (nodata) {
                    this.onDataCallback([], { noData: true });
                }
            }*/
        },

        // 시세PoolData Paint 처리 함수
        OnRealTime : function () {
            if (this.showLoading) return;  // 조회중이면 무시를 한다.
        },

        OnGetJisuRealData : function(data, option){
            if (!data) {
                return;
            }
            var todate;
            if (!data.utc_time){
                todate = new Date().getTime();
            }
            else
                todate = data.utc_time;
            todate = getLastTime(todate.toString().substring(0, 10), this.interval);
            var close = parseFloat(data.base_upjisu);
            try {
                if(this.onRealtimeCallback && typeof(this.onRealtimeCallback) == "function"){
                    if(this.lastbar.todate != todate){
                        this.onRealtimeCallback({ time: todate, close: this.lastbar.close, open: this.lastbar.close, high: this.lastbar.close, low: this.lastbar.close, volume: 0 });
                        this.lastbar.todate = todate;
                        this.lastbar.open = this.lastbar.close;
                        this.lastbar.high = this.lastbar.close;
                        this.lastbar.low = this.lastbar.close;
                        this.lastbar.volume = 0;
                    }
                }
                if(this.onRealtimeCallbackUpjong && typeof(this.onRealtimeCallbackUpjong) == "function"){
                    if(this.jisuBar.todate == todate && this.jisuBar.close == close) return;
                    this.onRealtimeCallbackUpjong({ time: todate, close: close, open: close, high: close, low: close, volume: this.lastbar.volume });
                    this.jisuBar.todate = todate;
                    this.jisuBar.close = close;
                }
            }
            catch (e) {
                console.log(e);
            }
        },

        OnRealData : function (data, option) {
            if (data.length <= 0) {
                return;
            }

            if (this.interval == "D" || this.interval == "W" || this.interval == "M") {
                var updatedata = data[0];
                if (this.interval != "D") {
                    var vol = this.SumVolume(data);
                    updatedata[g_tvchart_real.totvol] = vol;
                }
                this.updateChartData(updatedata);
            }
            else {
                for (var x = data.length - 1; x >= 0; x--) {
                    var updatedata = data[x];
                    this.updateChartData(updatedata);
                }
            }
        },

        SumVolume : function (data) {
            var totvol = 0;
            for (var x = 0; x < data.length; x++) {
                var vol = parseFloat(data[x][g_tvchart_real.chevol]);
                totvol += vol;
            }
            return totvol;
        },

        updateChartData : function (data, bUpjong) {
            var obj = this;

            if(data.symbol != obj.code) return;
            
            var todate;
            if (data[g_tvchart_real.datetime]) {
                todate = getLastTime(data[g_tvchart_real.datetime], this.interval);
            }
            else {
                todate = ConvertToChartTime(data[g_tvchart_real.date], data[g_tvchart_real.time], this.interval);
                todate = parseFloat(todate, 10);
            }

            var close = parseFloat(data[g_tvchart_real.close]);
            var open = parseFloat(data[g_tvchart_real.open]);
            var high = parseFloat(data[g_tvchart_real.high]);
            var low = parseFloat(data[g_tvchart_real.low]);
            var vol = parseFloat(data[g_tvchart_real.chevol]);
            var totvol = parseFloat(data[g_tvchart_real.totvol]);

            if (this.tvoptions.lastChartDate != todate) { //새로운 봉 추가
                this.tvoptions.lastChartDate = todate;
                this.lastbar = {
                    todate: todate,
                    date: data[g_tvchart_real.date],
                    time: data[g_tvchart_real.time],
                    open: close,
                    high: close,
                    low: close,
                    close: close,
                    volume: vol
                }
            }
            else {
                this.lastbar.close = close;
                if (this.interval == "D" || this.interval == "2") {
                    this.lastbar.high = high;
                    this.lastbar.low = low;
                    this.lastbar.volume = totvol;
                }
                else if (this.interval == "W" || this.interval == "M" || this.interval == "3" || this.interval == "4") {
                    if (high > this.lastbar.high) this.lastbar.high = high;
                    if (low < this.lastbar.low) this.lastbar.low = low;
                    // console.log(this.lastbar.volume, vol);
                    this.lastbar.volume += vol;
                }
                else {
                    if (close > this.lastbar.high) this.lastbar.high = close;
                    if (close < this.lastbar.low) this.lastbar.low = close;

                    this.lastbar.volume += vol;
                }
            }

            try {
                if(this.onRealtimeCallback && typeof(this.onRealtimeCallback) == "function"){
                    this.onRealtimeCallback({ time: todate, close: close, open: this.lastbar.open, high: this.lastbar.high, low: this.lastbar.low, volume: this.lastbar.volume });
                }
            }
            catch (e) {
                console.log(e);
            }
        },

        onRequestChart: function (code, interval) {
            /*var that = this;
            if (this.code != code || this.interval != interval) {
                if(this.jisuBar.code != code || this.jisuBar.interval != interval){
                    this.nextKey = "";
                    if(this.widget){
                        if(this.widget.chart()){
                            this.widget.chart().executeActionById("timeScaleReset");
                        }
                    }
                }
            }

            var unit = "", serverInterval;
            if(interval == "D") serverInterval = "2";
            else if(interval == "W") serverInterval = "3";
            else if(interval == "M") serverInterval = "4";
            else{
                serverInterval = "1";
                unit = hi5.LPAD(interval, 3, "0");
            }
            //objCommInput.InRec1.nflag = "1";
            //objCommInput.InRec1.nkey = ctlObj.nextKey;
            var objTranData = {
                trcode: "102028",  // 차트조회
                input: {
                    "InRec1": {
                        symbol: code,
                        edate: (new Date()).curDate(),
                        num: "0300",
                        unit: unit,
                        button: serverInterval,
                        modGb: "1",
                        nflag: this.nextKey != "" ? "1" : "",
                        nkey: this.nextKey != "" ? this.nextKey : "",
                        nDataGubun: "0",
                        ImgRgb: "0",
                        nowData: "1",
                        currency: hi5.GetSharedMemory("@BASE_CURRENCY"),
                        currency_rt: hi5.GetSharedMemory("@BASE_CURRRATE")
                    }
                }
            };
            // 통신요청
            commAPI.commTranRQ(objTranData, function (rpData) {
                if (rpData.status == "success") {  // 정상데이터
                    var data = rpData.data.OutRec2; // 실제 데이터
                    
                    var option = {
                        prevnext: rpData.data.OutRec1.nkey != "" ? 2 : 0,
                        dataExist: 1,
                        nextKeyBuf: rpData.data.OutRec1.nkey,
                        nextKeyLen: 0
                    }
                    that.OnGetData(data, option);

                    var nPrevNext = 0;
                    if(that.nextKey) nPrevNext = 2;
                    that.nextKey = rpData.data.OutRec1.nkey;
                   
                    
                } else {   // 오류
                    var errorcode = rpData.msgHeader.MSG_COD;    // 오류코드
                    var errormsg = rpData.msgHeader.MSG_CTNS   // 오류메세지
                    var msg = "[" + errorcode + "]" + errormsg;
                    hi5.MessageBox(msg, $hi5_regional.title.notice, 0, function (ret) {
                    });
                }
            });*/
        }
    }

    
    /* events */
    /// <member id="OnRangeChange" kind="event" default="true">
    /// <summary>하단 스크롤바 이동시 발생되는 이벤트</summary>
    /// <remarks>하단 스크롤바 이동시 발생되는 이벤트</remarks>
    /// <param name="data" type="object"> total, show, minX, maxX 등의 정보를 객체로 넘겨준다. </param>
    /// <example><![CDATA[
    ///  // 하단 range 스크롤바 움직일때 마다 발생되는 이벤트
    ///     cht_1.OnRangeChange(data);
    ///     data = {total : Total data count, show : currently selected count, minX : selected range's lowest X(date), maxX : largest X(date)}
    /// ]]></example>
    /// </member>
    //chart.prototype.OnRangeChange = function (data) {
    //}

    tvchart.ctlName = "tvchart";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(tvchart.ctlName, tvchart);
    return tvchart;
}());


/*
	This class implements interaction with UDF-compatible datafeed.

	See UDF protocol reference at
	https://github.com/tradingview/charting_library/wiki/UDF
*/

function parseJSONorNot(mayBeJSON) {
    if (typeof mayBeJSON === 'string') {
        return JSON.parse(mayBeJSON);
    } else {
        return mayBeJSON;
    }
}

(function (global, undefined) {

    'use strict';
    global.Datafeeds = {};
    Datafeeds.UDFCompatibleDatafeed = function (datafeedURL, updateFrequency, chartObj) {
        this._datafeedURL = datafeedURL;
        this._configuration = undefined;

        this._symbolSearch = null;
        this._symbolsStorage = null;
        this._barsPulseUpdater = new Datafeeds.DataPulseUpdater(this, updateFrequency || 10 * 1000);
        //this._quotesPulseUpdater = new Datafeeds.QuotesPulseUpdater(this);

        this._enableLogging = false;
        this._initializationFinished = false;
        this._callbacks = {};

        this.chartObj = chartObj;

        this._initialize(chartObj.tvoptions);
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.defaultConfiguration = function () {
        return {
            supports_search: false,
            supports_group_request: true,
            supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
            supports_marks: false,
            supports_timescale_marks: false
        };
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
        if (this._configuration.supports_time) {
            var time = new Date();
            if (!isNaN(time)) {
                callback(time);
            }
        }
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.on = function (event, callback) {
        if (!this._callbacks.hasOwnProperty(event)) {
            this._callbacks[event] = [];
        }

        this._callbacks[event].push(callback);
        return this;
    };

    Datafeeds.UDFCompatibleDatafeed.prototype._fireEvent = function (event, argument) {
        if (this._callbacks.hasOwnProperty(event)) {
            var callbacksChain = this._callbacks[event];
            for (var i = 0; i < callbacksChain.length; ++i) {
                callbacksChain[i](argument);
            }

            this._callbacks[event] = [];
        }
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.onInitialized = function () {
        this._initializationFinished = true;
        this._fireEvent('initialized');
    };

    Datafeeds.UDFCompatibleDatafeed.prototype._logMessage = function (message) {
        if (this._enableLogging) {
            var now = new Date();
            console.log(now.toLocaleTimeString() + '.' + now.getMilliseconds() + '> ' + message);
        }
    };

    Datafeeds.UDFCompatibleDatafeed.prototype._send = function (url, params) {
        var request = url;
        if (params) {
            for (var i = 0; i < Object.keys(params).length; ++i) {
                var key = Object.keys(params)[i];
                var value = encodeURIComponent(params[key]);
                request += (i === 0 ? '?' : '&') + key + '=' + value;
            }
        }

        this._logMessage('New request: ' + request);

        return $.ajax({
            type: 'GET',
            url: request,
            contentType: 'text/plain'
        });
    };

    Datafeeds.UDFCompatibleDatafeed.prototype._initialize = function (obj) {
        var that = this;
        var configurationData = parseJSONorNot(obj.config);
        that._setupWithConfiguration(configurationData);
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function (callback) {
        var that = this;
        if (this._configuration) {
            setTimeout(function () {
                callback(that._configuration);
            }, 0);
        } else {
            this.on('configuration_ready', function () {
                callback(that._configuration);
            });
        }
    };

    Datafeeds.UDFCompatibleDatafeed.prototype._setupWithConfiguration = function (configurationData) {
        this._configuration = configurationData;

        if (!configurationData.exchanges) {
            configurationData.exchanges = [];
        }

        //	@obsolete; remove in 1.5
        var supportedResolutions = configurationData.supported_resolutions || configurationData.supportedResolutions;
        configurationData.supported_resolutions = supportedResolutions;

        //	@obsolete; remove in 1.5
        var symbolsTypes = configurationData.symbols_types || configurationData.symbolsTypes;
        configurationData.symbols_types = symbolsTypes;

        if (!configurationData.supports_search && !configurationData.supports_group_request) {
            throw new Error('Unsupported datafeed configuration. Must either support search, or support group request');
        }

        if (!configurationData.supports_search) {
            this._symbolSearch = new Datafeeds.SymbolSearchComponent(this);
        }

        if (configurationData.supports_group_request) {
            //	this component will call onInitialized() by itself
            this._symbolsStorage = new Datafeeds.SymbolsStorage(this);
        } else {
            this.onInitialized();
        }

        this._fireEvent('configuration_ready');
        this._logMessage('Initialized with ' + JSON.stringify(configurationData));
    };

    //	===============================================================================================================================
    //	The functions set below is the implementation of JavaScript API.

    Datafeeds.UDFCompatibleDatafeed.prototype.getMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
        if (this._configuration.supports_marks) {
            this._send(this._datafeedURL + '/marks', {
                symbol: symbolInfo.ticker.toUpperCase(),
                from: rangeStart,
                to: rangeEnd,
                resolution: resolution
            }).done(function (response) {
                onDataCallback(parseJSONorNot(response));
            })
            .fail(function () {
                onDataCallback([]);
            });
        }
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.getTimescaleMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
        if (this._configuration.supports_timescale_marks) {
            this._send(this._datafeedURL + '/timescale_marks', {
                symbol: symbolInfo.ticker.toUpperCase(),
                from: rangeStart,
                to: rangeEnd,
                resolution: resolution
            })
            .done(function (response) {
                onDataCallback(parseJSONorNot(response));
            })
            .fail(function () {
                onDataCallback([]);
            });
        }
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.searchSymbols = function (searchString, exchange, type, onResultReadyCallback) {
        var MAX_SEARCH_RESULTS = 30;

        if (!this._configuration) {
            onResultReadyCallback([]);
            return;
        }

        if (this._configuration.supports_search) {
            this._send(this._datafeedURL + '/search', {
                limit: MAX_SEARCH_RESULTS,
                query: searchString.toUpperCase(),
                type: type,
                exchange: exchange
            })
            .done(function (response) {
                var data = parseJSONorNot(response);

                for (var i = 0; i < data.length; ++i) {
                    if (!data[i].params) {
                        data[i].params = [];
                    }

                    data[i].exchange = data[i].exchange || '';
                }

                if (typeof data.s == 'undefined' || data.s !== 'error') {
                    onResultReadyCallback(data);
                } else {
                    onResultReadyCallback([]);
                }
            })
            .fail(function (reason) {
                onResultReadyCallback([]);
            });
        } else {
            if (!this._symbolSearch) {
                throw new Error('Datafeed error: inconsistent configuration (symbol search)');
            }
            var searchArgument = {
                searchString: searchString,
                exchange: exchange,
                type: type,
                onResultReadyCallback: onResultReadyCallback
            };

            if (this._initializationFinished) {
                this._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
            } else {
                var that = this;
                this.on('initialized', function () {
                    that._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
                });
            }
        }
    };

    //	BEWARE: this function does not consider symbol's exchange
    Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        var _this = this;
console.log('resolveSymbol - ', symbolName)
        if (!this._initializationFinished) {
            this.on('initialized', function () {
                that.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
            });
            return;
        }

        var resolveRequestStartTime = Date.now();
        _this._logMessage('Resolve requested');

        function onResultReady(data) {
            var postProcessedData = data;
            if (_this.postProcessSymbolInfo) {
                postProcessedData = _this.postProcessSymbolInfo(postProcessedData);
            }

            _this._logMessage('Symbol resolved: ' + (Date.now() - resolveRequestStartTime));

            onSymbolResolvedCallback(postProcessedData);
        }

        if (!this._configuration.supports_group_request) {
            //var data = parseJSONorNot(this.chartObj.options.SymbolInfo);
            var data = hi5.clone(this.chartObj.tvoptions.SymbolInfo);
            if (!data) {
                onResolveErrorCallback('unknown_symbol');
            }
            else {
                var exchangeName = 'BISPEX';
                if (!exchangeName) {
                    onResolveErrorCallback('unknown_symbol');
                    return;
                }
                var ticker = symbolName;
                if (symbolName.indexOf(exchangeName) > -1) {
                    //ticker = symbolName.substring(exchangeName.length + 1);
                    //setTimeout(function () {
                    onResolveErrorCallback('unknown_symbol');
                    //}, 1000);
                }
                else {
                    data.base_name = [ticker];
                    data.name = ticker;
                    data.description = ticker;
                    data.ticker = ticker;
                    data.pro_name = ticker;
                    data.legs = [ticker];
                    data.full_name = ticker;
                    //if (hi5.GetCodeInfo(ticker, { itemname: "base_coincode" }) != "") {
                    //var code;
                    /*if(hi5.SHMEM.symbol){
                        var pathName = $(location).attr('pathname');
                        if(pathName.indexOf('/trade') > -1) {
                            if(hi5.SHMEM.symbol.code != ticker)
                                ticker = hi5.SHMEM.symbol.code;
                        }
                    }*/
                    
                    var prc_danwi = hi5.GetCodeInfo(ticker, { itemname: "prc_danwi" });
                    //if(code){
                    //    prc_danwi = hi5.GetCodeInfo(code, { itemname: "prc_danwi" });
                    //}
                    if(prc_danwi != ""){
                        var code = ticker;
                        data.pricescale = Math.pow(10, parseInt(prc_danwi));

                        // 2020.03.12 kws
                        // 결함번호 1013 관련 추가
                        var that = this.chartObj;
                        if(!that.chartSetting){
                            if(that.bInit || that.code != code){
                                // 선물 지수가 존재할 때만 지수 데이터 요청하도록
                                var tv_chart = that.getChart();
                                if(g_masterInfo[code]){
                                    if(g_masterInfo[code].upjongcode){
                                        $('#' + that.id + ' iframe').contents().find('.indexBtn').css('display', 'block');
                                        var upjongcode = g_masterInfo[code].upjongcode;
                                        if(g_upjongInfo[upjongcode].base_code){
                                            var base_code = g_upjongInfo[upjongcode].base_code;
                                            if(that.jisuBar.entityId && that.jisuBar.entityId != ""){
                                                tv_chart.removeEntity(that.jisuBar.entityId);
                                                that.jisuBar.code = "";
                                                that.jisuBar.entityId = "";
                                            }
                                            tv_chart.createStudy('Compare', false, false, ["close", base_code], function(entityId){
                                                that.jisuBar.entityId = entityId;
                                                that.jisuBar.code = base_code;
                                                that.jisuBar.interval = that.interval;
                                            });
                                            var t = that.widget.activeChart()._chartWidget._model.m_model.m_mainSeries.priceScale().properties();
                                            //var n = t.log._value;
                                            //var i = t.percentage._value;
                                            t.log.setValue(false);
                                            t.percentage.setValue(false);
                                        }
                                    }
                                    else{
                                        $('#' + that.id + ' iframe').contents().find('.indexBtn').css('display', 'none');
                                        if(that.jisuBar.entityId && that.jisuBar.entityId != ""){
                                            tv_chart.removeEntity(that.jisuBar.entityId);
                                            that.jisuBar.code = "";
                                            that.jisuBar.entityId = "";
                                        }
                                    }
                                }
                            }
                        }
                        that.bInit = false;
                    }
                    else{
                        if(g_upjongInfo[ticker]){
                            var fut_code = g_upjongInfo[ticker].fut_code;
                            if(fut_code){
                                //debugger;
                                prc_danwi = hi5.GetCodeInfo(fut_code, { itemname: "prc_danwi" });
                                //data.pricescale = Math.pow(10, parseInt(prc_danwi));
                                data.pricescale = 100;
                            }
                        }
                        
                        if(prc_danwi == ""){
                            data.pricescale = 100000000;
                        }
                    }
                    
                        //data.pricescale = 100000000;
                    //}
                    setTimeout(function () {
                        onResultReady(data);
                    }, 0);
                }
            }
        } else {
            if (this._initializationFinished) {
                this._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
            } else {
                this.on('initialized', function () {
                    that._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
                });
            }
        }
    };

    Datafeeds.UDFCompatibleDatafeed.prototype._historyURL = '/history';

    Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
        //console.log('*getBars. resolution:' + resolution + ', rangeStartDate:' + rangeStartDate + ', rangeEndDate:' + rangeEndDate + ', onDataCallback:' + onDataCallback);
        if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
            throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate]);
        }

        var code = symbolInfo.ticker;
        var that = this.chartObj;
        var nKey;
        console.log('getBars : ', symbolInfo.ticker, that.code, resolution, rangeStartDate, new Date(rangeStartDate * 1000), rangeEndDate, new Date(rangeEndDate * 1000));
        if(!g_masterInfo[code]){
            console.log('This is upjongcode');
        }
        else{
            if (that.bInit || that.code != code || that.interval != resolution) {
                //if(that.jisuBar.code != code || that.jisuBar.interval != resolution){
                that.nextKey = "";
                if(that.widget){
                    if(that.widget.chart()){
                        that.widget.chart().executeActionById("timeScaleReset");
                    }
                }
                //}

                // 2020.03.12 kws
                // 결함번호 1013 관련 추가
                //if(!that.chartSetting && (that.bInit || that.code != code)) {
                if(that.bInit || that.code != code) {
                    // 선물 지수가 존재할 때만 지수 데이터 요청하도록
                    var tv_chart = that.getChart();
                    if(g_masterInfo[code]){
                        if(g_masterInfo[code].upjongcode){
                            $('#' + that.id + ' iframe').contents().find('.indexBtn').css('display', 'block');
                            var upjongcode = g_masterInfo[code].upjongcode;
                            if(g_upjongInfo[upjongcode].base_code){
                                var base_code = g_upjongInfo[upjongcode].base_code;
                                if(that.jisuBar.entityId && that.jisuBar.entityId != ""){
                                    tv_chart.removeEntity(that.jisuBar.entityId);
                                    that.jisuBar.code = "";
                                    that.jisuBar.entityId = "";
                                }
                                tv_chart.createStudy('Compare', false, false, ["close", base_code], function(entityId){
                                    that.jisuBar.entityId = entityId;
                                    that.jisuBar.code = base_code;
                                    that.jisuBar.interval = that.interval;
                                });
                                var t = that.widget.activeChart()._chartWidget._model.m_model.m_mainSeries.priceScale().properties();
                                //var n = t.log._value;
                                //var i = t.percentage._value;
                                t.log.setValue(false);
                                t.percentage.setValue(false);
                            }
                        }
                        else{
                            $('#' + that.id + ' iframe').contents().find('.indexBtn').css('display', 'none');
                            if(that.jisuBar.entityId && that.jisuBar.entityId != ""){
                                tv_chart.removeEntity(that.jisuBar.entityId);
                                that.jisuBar.code = "";
                                that.jisuBar.entityId = "";
                            }
                        }
                    }
                }
                that.bInit = false;
            }
        }       

        var endDate = new Date(rangeEndDate * 1000);
        var nKeyYear = endDate.getUTCFullYear();
        var nKeyMonth = (endDate.getUTCMonth() + 1) < 10 ? "0" + (endDate.getUTCMonth() + 1) : (endDate.getUTCMonth() + 1);
        var nKeyDate = endDate.getUTCDate() < 10 ? "0" + endDate.getUTCDate() : endDate.getUTCDate();
        var nKeyHours = endDate.getUTCHours() < 10 ? "0" + endDate.getUTCHours() : endDate.getUTCHours();
        var nKeyMin = endDate.getUTCMinutes() < 10 ? "0" + endDate.getUTCMinutes() : endDate.getUTCMinutes();
        var nKey = nKeyYear.toString() + nKeyMonth.toString() + nKeyDate.toString();

        var unit = "", serverInterval;
        if(resolution == "D") { serverInterval = "2"; nKey += "000000";}
        else if(resolution == "W") { serverInterval = "3"; nKey += "000000";}
        else if(resolution == "M") { serverInterval = "4"; nKey += "000000";}
        else{
            serverInterval = "1";
            unit = hi5.LPAD(resolution, 3, "0");
            nKey += nKeyHours.toString() + nKeyMin.toString() + "00";
        }
        //objCommInput.InRec1.nflag = "1";
        //objCommInput.InRec1.nkey = ctlObj.nextKey;
        if(that.nextKey != "" && nKey < that.nextKey){
            nKey = that.nextKey;
        }
        if(g_masterInfo[code]){
            that.code = code;
        }
        var objTranData = {
            trcode: "102028",  // 차트조회
            input: {
                "InRec1": {
                    symbol: code,
                    edate: (new Date()).curDate(),
                    num: that.tvoptions.rqDataCount.toString(),
                    unit: unit,
                    button: serverInterval,
                    modGb: "1",
                    nflag: that.nextKey != "" ? "1" : "",
                    nkey: that.nextKey != "" ? nKey : "",
                    nDataGubun: "0",
                    ImgRgb: "0",
                    nowData: "1",
                    currency: hi5.GetSharedMemory("@BASE_CURRENCY"),
                    currency_rt: hi5.GetSharedMemory("@BASE_CURRRATE")
                }
            }
        };
        // 통신요청
        commAPI.commTranRQ(objTranData, function (rpData) {
            if (rpData.status == "success") {  // 정상데이터
                that.showLoading = false;

                var nodata = false;
                var bUpjong = false;

                var outdata = rpData.data.OutRec1;  // 싱글 출력
                if(!g_masterInfo[outdata.symbol]){
                    bUpjong = true;
                }
                var chartdata = rpData.data.OutRec2; // 실제 데이터
                if(!bUpjong){
                    that.nextKey = outdata.nkey;
                    console.log(that.nextKey);
                    if(hi5.SHMEM.symbol && outdata.symbol != hi5.SHMEM.symbol.code){
                        //debugger;
                        that.widget.setSymbol(hi5.SHMEM.symbol.code, that.interval, function () { });
                    }
                    that.code = outdata.symbol;
                }
                //that.nextKeyLen = option.nextKeyLen;

                var referitem = that.referitem;

                var openItem = g_tvchart_fid.open;
                var highItem = g_tvchart_fid.high;
                var lowItem = g_tvchart_fid.low;
                var closeItem = g_tvchart_fid.close;
                var dateItem = g_tvchart_fid.date;
                var timeItem = g_tvchart_fid.time;
                var volItem = g_tvchart_fid.chevol;
                var datetimeItem = g_tvchart_fid.datetime;

                if (referitem) {
                    if (referitem.data) {
                        openItem = referitem.data.open;
                        highItem = referitem.data.high;
                        lowItem = referitem.data.low;
                        closeItem = referitem.data.close || referitem.data.price;
                        dateItem = referitem.data.date;
                        timeItem = referitem.data.time;
                        volItem = referitem.data.chevol;
                        datetimeItem = referitem.data.datetime;
                    }
                }

                var data = {
                    's': 'ok',
                    'v': [],
                    't': [],
                    'o': [],
                    'h': [],
                    'l': [],
                    'c': []
                };

                if (chartdata.length < 1 || chartdata.length < that.tvoptions.rqDataCount) {
                    nodata = true;
                    that.lastdata = true;
                }
                //if ((option.prevnext == 1 && option.nextKeyBuf == "") || (option.prevnext == 2 && !option.dataExist)) {
                //    nodata = true;
                //    that.lastdata = true;
                //}
                for (i = chartdata.length - 1; i >= 0; i--) {
                    var date = chartdata[i][dateItem];
                    var time = chartdata[i][timeItem];
                    var open = parseFloat(chartdata[i][openItem]);
                    var high = parseFloat(chartdata[i][highItem]);
                    var low = parseFloat(chartdata[i][lowItem]);
                    var close = parseFloat(chartdata[i][closeItem]);
                    var volume = parseFloat(chartdata[i][volItem]);
                    var datetime = parseFloat(chartdata[i][datetimeItem] + "000");

                    //var todate = ConvertToChartTime(date, time);
                    //todate = parseFloat(todate);

                    var todate = datetime;
                    if(that.interval == "D" || that.interval == "W" || that.interval == "M"){
                        todate = new Date(parseInt(date.substr(0, 4)), parseInt(date.substr(4,2)) - 1, parseInt(date.substr(6,2)), 0, 0, 0, 0).getTime();
                    }

                    //console.log(data.t[i], rangeStartDate, rangeEndDate);
                    /*if(rangeStartDate * 1000 > todate || todate > rangeEndDate * 1000) {
                        console.log(todate, rangeStartDate * 1000, rangeEndDate * 1000);
                        if(!bUpjong){
                            that.nextKey = date.toString() + time.toString();
                        }
                        continue;
                    }*/

                    data.t.push(todate); // times
                    data.o.push(open); // opens
                    data.h.push(high); // highs
                    data.l.push(low); // lows
                    data.c.push(close); // closes
                    data.v.push(volume); // volumes
                    if (0 == i && !bUpjong) {
                        that.tvoptions.lastChartDate = todate;

                        that.lastbar = {
                            todate: todate,
                            date: date,
                            time: time,
                            open: open,
                            high: high,
                            low: low,
                            close: close,
                            volume: volume
                        };
                    }
                }

                var bars = [];

                var volumePresent = typeof data.v != 'undefined';
                var ohlPresent = typeof data.o != 'undefined';

                for (var i = 0; i < data.t.length; ++i) {
                    var barValue = {
                        time: data.t[i],
                        close: data.c[i]
                    };

                    if (volumePresent) {
                        barValue.volume = data.v[i];
                    }
                    var valueCheck = data.o[i] === 0 || data.h[i] === 0 || data.l[i] === 0 || data.c[i] === 0;//가끔 데이터가 0으로 들어옴
                    if (ohlPresent && !valueCheck) {
                        barValue.open = data.o[i];
                        barValue.high = data.h[i];
                        barValue.low = data.l[i];
                    } else {
                        barValue.open = barValue.high = barValue.low = barValue.close = data.c[i - 1];
                        barValue.volume = 0;
                    }

                    bars.push(barValue);
                }

                onDataCallback(bars, { noData: false, nextTime: data.nb || data.nextTime });
                if (nodata) {
                    onDataCallback([], { noData: true });
                }
            
                //var nPrevNext = 0;
                //if(that.nextKey) nPrevNext = 2;
                //that.nextKey = rpData.data.OutRec1.nkey;                
            } else {   // 오류
                var errorcode = rpData.msgHeader.MSG_COD;    // 오류코드
                var errormsg = rpData.msgHeader.MSG_CTNS   // 오류메세지
                var msg = "[" + errorcode + "]" + errormsg;
                hi5.MessageBox(msg, $hi5_regional.title.notice, 0);
                onErrorCallback();
            }
        });
        //this.chartObj.onDataCallback = onDataCallback;
        //this.chartObj.onErrorCallback = onErrorCallback;
        //this.chartObj.onRequestChart(symbolInfo.ticker, resolution);
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
        console.log('subscribeBars - ', symbolInfo, resolution, listenerGUID);
        if(symbolInfo.ticker){
            if(g_masterInfo[symbolInfo.ticker]){    // 종목
                this.chartObj.onRealtimeCallback = onRealtimeCallback;
                this.chartObj.onResetCacheNeededCallback = onResetCacheNeededCallback;
            }
            else{   // 업종 지수
                this.chartObj.onRealtimeCallbackUpjong = onRealtimeCallback;
                this.chartObj.onResetCacheNeededCallbackUpjong = onResetCacheNeededCallback;
            }
        }
        
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGUID) {
        this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function (period, resolutionBack, intervalBack) {
        //console.log('*calculateHistoryDepth. period : ' + period + ', resolutionBack: ' + resolutionBack + ", intervalBack :" + intervalBack);
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.getQuotes = function (symbols, onDataCallback, onErrorCallback) {
        
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.subscribeQuotes = function (symbols, fastSymbols, onRealtimeCallback, listenerGUID) {
        
    };

    Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeQuotes = function (listenerGUID) {
        
    };

    //	==================================================================================================================================================
    //	==================================================================================================================================================
    //	==================================================================================================================================================

    /*
        It's a symbol storage component for ExternalDatafeed. This component can
          * interact to UDF-compatible datafeed which supports whole group info requesting
          * do symbol resolving -- return symbol info by its name
    */
    Datafeeds.SymbolsStorage = function (datafeed) {

    };

    Datafeeds.SymbolsStorage.prototype._requestFullSymbolsList = function () {

    };

    Datafeeds.SymbolsStorage.prototype._onExchangeDataReceived = function (exchangeName, data) {

    };

    Datafeeds.SymbolsStorage.prototype._onAnyExchangeResponseReceived = function (exchangeName) {

    };

    //	BEWARE: this function does not consider symbol's exchange
    Datafeeds.SymbolsStorage.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {

    };

    //	==================================================================================================================================================
    //	==================================================================================================================================================
    //	==================================================================================================================================================

    /*
        It's a symbol search component for ExternalDatafeed. This component can do symbol search only.
        This component strongly depends on SymbolsDataStorage and cannot work without it. Maybe, it would be
        better to merge it to SymbolsDataStorage.
    */

    Datafeeds.SymbolSearchComponent = function (datafeed) {

    };

    //	searchArgument = { searchString, onResultReadyCallback}
    Datafeeds.SymbolSearchComponent.prototype.searchSymbols = function (searchArgument, maxSearchResults) {

    };

    //	==================================================================================================================================================
    //	==================================================================================================================================================
    //	==================================================================================================================================================

    /*
        This is a pulse updating components for ExternalDatafeed. They emulates realtime updates with periodic requests.
    */

    Datafeeds.DataPulseUpdater = function (datafeed, updateFrequency) {
        
    };

    Datafeeds.DataPulseUpdater.prototype.unsubscribeDataListener = function (listenerGUID) {

    };

    Datafeeds.DataPulseUpdater.prototype.subscribeDataListener = function (symbolInfo, resolution, newDataCallback, listenerGUID) {

    };

    Datafeeds.DataPulseUpdater.prototype.periodLengthSeconds = function (resolution, requiredPeriodsCount) {

    };

    Datafeeds.QuotesPulseUpdater = function (datafeed) {

    };

    Datafeeds.QuotesPulseUpdater.prototype.subscribeDataListener = function (symbols, fastSymbols, newDataCallback, listenerGUID) {

    };

    Datafeeds.QuotesPulseUpdater.prototype.unsubscribeDataListener = function (listenerGUID) {

    };

    Datafeeds.QuotesPulseUpdater.prototype._updateQuotes = function (symbolsGetter) {
        
    };
    global.UDFCompatibleDatafeed = Datafeeds.UDFCompatibleDatafeed;
    //global.Datafeeds = Datafeeds;
})(this || {});