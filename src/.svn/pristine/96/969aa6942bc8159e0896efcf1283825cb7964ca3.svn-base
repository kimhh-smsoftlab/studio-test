//chart.js
(function () {
    'use strict';
    
    var g_chartColor = {
        scichart1: {
            fillColor: 'rgb(241,251,255)',
            borderColor: 'rgb(55,185,244)'
        },
        scichart2: {
            fillColor: '#2f2f2f',
            borderColor: '#05a8d3'
        }
    }

    var g_chartOption = {
        scichart: {
            animation: {
                duration: 0
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            layout: {
                padding: {
                    top: 20,
                    bottom: 2
                }
            },
            legend: {
                display: false
            },
            plugins: {
                filler: {
                    propagate: true
                }
            },
            scales: {
                xAxes: [{
                    position: 'top',
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }],
                yAxes: [{
                    position: 'right',
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    afterFit: function (scaleInstance) {
                        scaleInstance.width = 0;
                    }
                }]
            },
            tooltips: {
                enabled: false
            }
        },
        depthchart: {
            animation: {
                duration: 0
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            layout: {
                padding: {
                    right: 10
                }
            },
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        callback: function (dataLabel, index) {
                            if (index == 0) return '';
                            return index % 2 === 0 ? dataLabel : '';
                        }
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    display: true,
                    position: 'right'
                }]
            },
            elements: {
                line: {
                    fill: true
                }
            }
        }
    }
    // init object
    var chart = function () {
        this.options = {
            rqDataCount : 300,
            scichart1: false,
            scichart2: false,
            depthchart: false
        };

        this.itemflag = "2";

        this.showLoading = false;
        this._realMng = null;  // 시세풀 관리( {자동갱신 타입 : 종목코드 배열[] }

        this.nextKey = "";
        this.nextKeyLen = 0;
        this._realArrayMode = true;
/*
        this.depthChartFID = {
            bidp: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3032, 3033, 3034],   //매수호가
            askp: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 3015, 3016, 3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024],   //매도호가
            bidq: [73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 3045, 3046, 3047, 3048, 3049, 3050, 3051, 3052, 3053, 3054],   //매수잔량
            askq: [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 3035, 3036, 3037, 3038, 3039, 3040, 3041, 3042, 3043, 3044]    //매도잔량
        }
*/
        this._chart = null; //Chartjs module
    }
    
    chart.prototype = {
        onDestroy: function () {
            //this.realMng = {};
            if (this._realMng) {
                this._realMng.destroy();
                this._realMng = null;
            }

            if (this._chart) {
                this._chart.destroy();
            }
        },

        propertyLoad: function (node, nodeName, xmlHolderElement) {
            var that = this,
                cls = ["hi5_chart"], // 클래스 정보명 
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "", disabled: "" }, // HTML Attri 정의하는 정보 설정
                dataCell = "";  // caption

            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            var objXML = x2h.getXML2Control(node, this, attr, cls, style);

            attr["class"] = cls.join(" ");

            if (style.length)
                attr["style"] = style.join("");

            // HTML Attribute 속성 변환( Style, Attribute, Class)
            style = x2h.attri(xmlHolderElement, attr);

            if (objXML.referitem) {
                this.referitem = hi5.getJSONParse(objXML.referitem);
                this.comm_list = this.referitem.comm_list;
            }

            if (objXML.realitem) {
                this.realitem = [];
                var realitems = objXML.realitem.split(",");
                for (var x = 0; x < realitems.length; x++) {
                    this.realitem.push(realitems[x]);
                    this.objParentForm.realitems[realitems[x]] = [];
                }
            }

            var canvasEle = x2h.createXmlElement(xmlHolderElement, "canvas");
            xmlHolderElement.appendChild(canvasEle);

            if(local_lang == 'zh'){
                this.fontFamily = '"Noto Sans SC", sans-serif';
            }
            else if(local_lang == 'jp'){
                this.fontFamily = '"Noto Sans JP", sans-serif';
            }
            else {
                this.fontFamily = '"Noto Sans KR", sans-serif';
            }
    
            return;
        },

        GetElemnt: function () {
            return this.$html;
        },

        GetCommValue: function (option) {
            // 통신중
            this.showLoading = true;

            //this.realMng = {}; // 자동갱신 관리객체 해제
            if (commAPI.getRealTime() && this.realitem.length > 0) {
                // 시세Pool Paint 타이머를 등록한다.
                if (!this._realMng) {
                    this._realMng = new hi5_realMng();
                    this._realMng.init({ control: this, update: false });
                } else {
                    this._realMng.clear();
                }
            }

            if (this.options.depthchart) {
                //option.fidInfo.isArray = "N";
                //this.comm_list = this.depthChartFID.bidp.concat(this.depthChartFID.askp, this.depthChartFID.bidq, this.depthChartFID.askq);
                //option.fidInfo.outFID = this.comm_list;
                return;
            }

            if (option.fidYN && option.fidInfo) {
                option.fidInfo.reqCnt = this.options.rqDataCount;    // 데이터 요청건수
                option.fidInfo.isArray = "Y";
                option.fidInfo.outFID = this.comm_list;  // 출력용 FID 추가

                if (option.PrevNext > 1) {
                    option.fidInfo.nextKeyLen = this.nextKeyLen;
                    option.fidInfo.nextKeyBuf = this.nextKey;
                }
            }
        },

        /*깊이차트 호가 데이터 JSON 구조 처리 */
        _OnDepthChartData: function (ui) {
            let _this = this, bids=[],asks=[], symbol=ui.data.code, //심볼
            ui_bids= ui.data.bids||[],  ui_asks= ui.data.asks||[], askLastPrc = 0, askLastQty = 0, bidLastPrc = 0, bidLastQty = 0;
            // 매수호가 데이터 가공
            // for(let idx = 0; idx < ui_bids.length; idx++){
            //     bids[idx] = [+(ui_bids[idx][_JCol.price]), ui_bids[idx][_JCol._sum]];  // 호가가격 ,총수량
            // }
            for(let idx = 0; idx < 20; idx++){
                //debugger;
                if(ui_bids[idx]){
                    bids[idx] = [idx, ui_bids[idx][_JCol._sum], +(ui_bids[idx][_JCol.price])];  //  index, 총수량, 호가가격
                    bidLastPrc = +(ui_bids[idx][_JCol.price]);
                    bidLastQty = ui_bids[idx][_JCol._sum];
                }else    
                    bids[idx] = [idx, bidLastQty, bidLastPrc];  // 호가가격 ,총수량, index

                if(ui_asks[idx]){
                    asks[idx] = [-1*idx, ui_asks[idx][_JCol._sum], +(ui_asks[idx][_JCol.price])];  // index, 총수량, 호가가격
                    askLastPrc = +(ui_asks[idx][_JCol.price]);
                    askLastQty = ui_asks[idx][_JCol._sum];
                }else    
                    asks[idx] = [-1*idx, askLastQty, askLastPrc];  // 호가가격 ,총수량, index
            }

            //bids.reverse(); // 데이터를 역순으로 변경
            // 매도호가 데이터 가공
            // for(let idx = 0; idx < ui_asks.length; idx++){
            //     asks[idx] = [+(ui_asks[idx][_JCol.price]), ui_asks[idx][_JCol._sum]];  // 호가가격 ,총수량
            // }
//debugger;
            let update = (ui.realType !== undefined)  ? true : false;
            if(!update){
                bids.reverse(); // 데이터를 역순으로 변경
                this.initChart();
                var options = {
                    _symbol : symbol,  // 툴팁 마스킹 정보를 위한 심볼 정의
                    chart: {
                        animation: false,
                        type: 'area',
                        //zoomType: 'xy',
                        backgroundColor: 'rgb(28,40,62)',
                        marginBottom : 3,
                        marginLeft: 3,
                        marginRight: 3
                    },
                    title: false,
                    xAxis: {
                        minPadding: 0,
                        maxPadding: 0,
                        lineColor: hi5.SHMEM.user_setting.general.theme == "light" ? '#e6e6e6' : '#666666',
                        title: false,
                        labels: {
                            enabled: false
                        },
                        plotLines: [{
                            color: hi5.SHMEM.user_setting.general.theme == "light" ? '#d6d6d6' : '#435679',
                            value: 0,
                            width: 1
                        }],
                        tickWidth: 0,
                        tickInterval: 1
                    },
                    yAxis: [{
                        lineWidth: 1,
                        lineColor: hi5.SHMEM.user_setting.general.theme == "light" ? '#e6e6e6' : '#666666',
                        gridLineWidth: 0,
                        title: null,
                        tickWidth: 0,
                        tickLength: 20,
                        tickPosition: 'inside',
                        labels: {
                            enabled: false
                            // align: 'left',
                            // x: 8
                        }
                    }, {
                        opposite: true,
                        lineColor: hi5.SHMEM.user_setting.general.theme == "light" ? '#e6e6e6' : '#666666',
                        linkedTo: 0,
                        lineWidth: 1,
                        gridLineWidth: 0,
                        title: null,
                        tickWidth: 0,
                        tickLength: 20,
                        tickPosition: 'inside',
                        labels: {
                            enabled: false
                            // align: 'right',
                            // x: -8
                        }
                    }],
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillOpacity: 0.3,
                            lineWidth: 1,
                            step: 'center'
                        }
                    },
                    tooltip: {
                        formatter: function(){
                            // 호가 가격, 수량 단위로 마스킹 처리
                            let unit = hi5.getHogaUnit (this.series.chart.userOptions._symbol),
                            prc = (this.point.p).toFixed(unit.price),
                            qty = (this.y).toFixed(unit.qty);
                            if(this.point.p == 0 && this.y == 0 )
                                return false;

                            return '<span style="font-size:11px;font-family:' + _this.fontFamily + ';">Price : ' + putThousandsSeparators(prc) + '</span><br><span style="font-size:11px;font-family:' + _this.fontFamily + ';">' + this.series.name + ' : ' + putThousandsSeparators(qty) + '</span>';
                        }
                        //headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
                        //valueDecimals: 2
                    },
                    series: [{
                        name: 'Bids',
                        keys:['x','y','p'],
                        data: bids,
                        color: '#48b96f',   // 원래 색상 #0B7903
                        marker: {
                            enabled: false
                        }
                    }, {
                        name: 'Asks',
                        keys:['x','y','p'],
                        data: asks,
                        color: '#df5f58',   // 원래 색상 #fc5857
                        marker: {
                            enabled: false
                        }
                    }],
                    
                    credits: {
                        enabled: false
                    },
                    navigation: {
                        buttonOptions: {
                            enabled: false
                        }
                    }
                };
                if(hi5.SHMEM.user_setting){
                    if(hi5.SHMEM.user_setting.general){
                        if(hi5.SHMEM.user_setting.general.theme){
                            if(hi5.SHMEM.user_setting.general.theme == "light"){    // 결함번호 979
                                options.chart.backgroundColor = "#ffffff";
                            }
                            else{
                                options.chart.backgroundColor = "rgb(28,40,62)";
                            }
                        }
                    }
                }
                this._chart = new Highcharts.chart(this.id, options);
            }
            else{
                //bids.reverse(); // 데이터를 역순으로 변경
                asks.reverse(); // 데이터를 역순으로 변경
                this._chart.series[0].setData(bids);
                this._chart.series[1].setData(asks);
            }
        },

        GetDepthChartData: function (d, bUpdate) {
            var _this = this;
            /* fosc ask1~20, bid1~20, askqty1~20, bidqty1~20 */
            var data = d;

            var bids = [];
            var asks = [];
            var xLabels = [];

            var prevvol = 0;
            var prevprc = 0;
            for (var x = 1; x <= 20; x++) {
                var bidArr = [];
                var bidp = data["bid" + x];
                var bidP = parseFloat(bidp);
                if (bidP <= 0) {
                    continue;
                }
                prevprc = bidP;
                bidArr.push(bidP);
                //xLabels.push(bidP);
                var bidq = data["bidqty" + x];
                var bidQ = parseFloat(bidq) + prevvol;

                bidQ = parseFloat(bidQ.toFixed(8));
                prevvol = bidQ;
                bidArr.push(bidQ);
                bids.push(bidArr);
                //asks.push(null);
            }
            //xLabels.reverse();
            bids.reverse();

            var prevvol = 0;
            var prevprc = 0;
            for (var x = 1; x <= 20; x++) {
                var askArr = [];
                var askp = data["ask" + x];
                var askP = parseFloat(askp);
                if (askP <= 0) {
                    continue;
                }
                prevprc = askP;
                askArr.push(askP);
                //xLabels.push(askP);
                var askq = data["askqty" + x];
                var askQ = parseFloat(askq) + prevvol;

                askQ = parseFloat(askQ.toFixed(8));
                prevvol = askQ;
                askArr.push(askQ);
                asks.push(askArr);
                //bids.push(null);
            }
            //asks.reverse();
            if(!bUpdate){
                this.initChart();
                var options = {
                    chart: {
                        animation: false,
                        type: 'area',
                        //zoomType: 'xy',
                        backgroundColor: 'rgb(28,40,62)',
                        marginBottom : 3,
                        marginLeft: 3,
                        marginRight: 3
                    },
                    title: false,
                    xAxis: {
                        minPadding: 0,
                        maxPadding: 0,
                        lineColor: hi5.SHMEM.user_setting.general.theme == "light" ? '#e6e6e6' : '#666666',
                        //plotLines: [{
                        //    color: '#666666',
                        //    value: parseFloat(data.price),  // 기준선
                        //    width: 1,
                        //   label: {
                                //text: 'Actual price',
                        //        rotation: 90
                        //    }
                        //}],
                        title: false,
                        labels: {
                            enabled: false
                        },
                        tickWidth: 0
                    },
                    yAxis: [{
                        lineWidth: 1,
                        lineColor: hi5.SHMEM.user_setting.general.theme == "light" ? '#e6e6e6' : '#666666',
                        gridLineWidth: 0,
                        title: null,
                        tickWidth: 0,
                        tickLength: 5,
                        tickPosition: 'inside',
                        labels: {
                            enabled: false
                            //align: 'left',
                            // x: 8
                        }
                    }, {
                        opposite: true,
                        lineColor: hi5.SHMEM.user_setting.general.theme == "light" ? '#e6e6e6' : '#666666',
                        linkedTo: 0,
                        lineWidth: 1,
                        gridLineWidth: 0,
                        title: null,
                        tickWidth: 0,
                        tickLength: 5,
                        tickPosition: 'inside',
                        labels: {
                            enabled: false
                            //align: 'right',
                            //x: -8
                        }
                    }],
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillOpacity: 0.3,
                            lineWidth: 1,
                            step: 'center'
                        }
                    },
                    tooltip: {
                        formatter: function(){
                            var prc = this.x;
                            if(this.x.toString().indexOf('e-') > 0){
                                prc = prc.toFixed(8);
                            }

                            /*var prc_danwi;
                            if(_this.realkeys && _this.realkeys.length > 0){
                                var symbol = _this.realkeys[0];
                                prc_danwi = g_masterInfo[symbol].prc_danwi;
                                prc = prc.toFixed(prc_danwi);
                            }*/
                            return '<span style="font-size:11px;font-family:' + _this.fontFamily + ';">Price : ' + putThousandsSeparators(prc) + '</span><br><span style="font-size:11px;font-family:' + _this.fontFamily + ';">' + this.series.name + ' : ' + putThousandsSeparators(this.y) + '</span>';
                        }
                        //valueDecimals: 2
                    },
                    series: [{
                        name: 'Bids',
                        data: bids,
                        color: '#48b96f',   // 원래 색상 #0B7903
                        marker: {
                            enabled: false
                        }
                    }, {
                        name: 'Asks',
                        data: asks,
                        color: '#df5f58',   // 원래 색상 #fc5857
                        marker: {
                            enabled: false
                        }
                    }],
                    credits: {
                        enabled: false
                    },
                    navigation: {
                        buttonOptions: {
                            enabled: false
                        }
                    }
                };
                if(hi5.SHMEM.user_setting){
                    if(hi5.SHMEM.user_setting.general){
                        if(hi5.SHMEM.user_setting.general.theme){
                            if(hi5.SHMEM.user_setting.general.theme == "light"){    // 결함번호 979
                                options.chart.backgroundColor = "#ffffff";
                            }
                            else{
                                options.chart.backgroundColor = "rgb(28,40,62)";
                            }
                        }
                    }
                }
                this._chart = new Highcharts.chart(this.id, options);
            }
            else{
                this._chart.series[0].setData(bids);
                this._chart.series[1].setData(asks);
                
                
                //this._chart.update({
                //    plotLines: [{
                //        value: parseFloat(data.price)  // 기준선
                //    }]
                //});
            }


/*
            var ctxs = document.getElementById(this.id);
            var ctx = ctxs.getElementsByTagName("canvas")[0].getContext('2d');

            var gr1 = ctx.createLinearGradient(0, 0, 0, 400);
            gr1.addColorStop(0, g_chartColor.depthchart.bids.fillColor);
            gr1.addColorStop(1, g_chartColor.depthchart.bids.fillColor2);

            var gr2 = ctx.createLinearGradient(0, 0, 0, 400);
            gr2.addColorStop(0, g_chartColor.depthchart.asks.fillColor);
            gr2.addColorStop(1, g_chartColor.depthchart.asks.fillColor2);

            var dataSet = {
                labels: xLabels,
                datasets: [{
                    label: 'Buy',
                    data: bids,
                    backgroundColor: gr1,
                    borderColor: g_chartColor.depthchart.bids.borderColor,
                    borderWidth: 1
                },
                {
                    label: 'Sell',
                    data: asks,
                    backgroundColor: gr2,
                    borderColor: g_chartColor.depthchart.asks.borderColor,
                    borderWidth: 1
                }]
            }
            this.initChart();
            this._chart = new Chart(ctx, {
                type: 'line',
                responsive: true,
                data: dataSet,
                options: g_chartOption.depthchart
            });
*/
            return;
        },

        SetData: function (data) {
            var obj = this;

            if (obj.options.pie && obj.options.multiline) {
                try{
                    this._chart = new Highcharts.chart(this.id, data);
                }
                catch(e){
                    console.log(e);
                }
            }else if (obj.options.multiline && obj.options.pie == null) {
                this.initChart();
                
                var options = {
                    chart: {
                        type: 'area',
                        zoomType: 'xy',
                        backgroundColor: 'rgb(28,40,62)'
                    },
                    title: false,
                    xAxis: {
                        minPadding: 0,
                        maxPadding: 0,
                        plotLines: [{
                            color: '#666666',
                            value: 0.1523,
                            width: 1,
                            label: {
                                //text: 'Actual price',
                                rotation: 90
                            }
                        }],
                        title: false,
                        labels: {
                            enabled: false
                        },
                        tickWidth: 0
                    },
                    yAxis: [{
                        lineWidth: 1,
                        lineColor: '#666666',
                        gridLineWidth: 0,
                        title: null,
                        tickWidth: 0,
                        tickLength: 5,
                        tickPosition: 'inside',
                        labels: {
                            enabled: false
                            //align: 'left',
                            // x: 8
                        }
                    }, {
                        opposite: true,
                        lineColor: '#666666',
                        linkedTo: 0,
                        lineWidth: 1,
                        gridLineWidth: 0,
                        title: null,
                        tickWidth: 0,
                        tickLength: 5,
                        tickPosition: 'inside',
                        labels: {
                            enabled: false
                            //align: 'right',
                            //x: -8
                        }
                    }],
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillOpacity: 0.2,
                            lineWidth: 1,
                            step: 'center'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
                        valueDecimals: 2
                    },
                    series: [{
                        name: 'Bids',
                        data: [
                            [
                                0.1524,
                                0.948665
                            ],
                            [
                                0.1539,
                                35.510715
                            ],
                            [
                                0.154,
                                39.883437
                            ],
                            [
                                0.1541,
                                40.499661
                            ],
                            [
                                0.1545,
                                43.262994000000006
                            ],
                            [
                                0.1547,
                                60.14799400000001
                            ],
                            [
                                0.1553,
                                60.30799400000001
                            ],
                            [
                                0.1558,
                                60.55018100000001
                            ],
                            [
                                0.1564,
                                68.381696
                            ],
                            [
                                0.1567,
                                69.46518400000001
                            ],
                            [
                                0.1569,
                                69.621464
                            ],
                            [
                                0.157,
                                70.398015
                            ],
                            [
                                0.1574,
                                70.400197
                            ],
                            [
                                0.1575,
                                73.199217
                            ],
                            [
                                0.158,
                                77.700017
                            ],
                            [
                                0.1583,
                                79.449017
                            ],
                            [
                                0.1588,
                                79.584064
                            ],
                            [
                                0.159,
                                80.584064
                            ],
                            [
                                0.16,
                                81.58156
                            ],
                            [
                                0.1608,
                                83.38156
                            ]
                        ],
                        color: '#fc5857'
                    }, {
                        name: 'Asks',
                        data: [
                            [
                                0.1435,
                                242.521842
                            ],
                            [
                                0.1436,
                                206.49862099999999
                            ],
                            [
                                0.1437,
                                205.823735
                            ],
                            [
                                0.1438,
                                197.33275
                            ],
                            [
                                0.1439,
                                153.677454
                            ],
                            [
                                0.144,
                                146.007722
                            ],
                            [
                                0.1442,
                                82.55212900000001
                            ],
                            [
                                0.1443,
                                59.152814000000006
                            ],
                            [
                                0.1444,
                                57.942260000000005
                            ],
                            [
                                0.1445,
                                57.483850000000004
                            ],
                            [
                                0.1446,
                                52.39210800000001
                            ],
                            [
                                0.1447,
                                51.867208000000005
                            ],
                            [
                                0.1448,
                                44.104697
                            ],
                            [
                                0.1449,
                                40.131217
                            ],
                            [
                                0.145,
                                31.878217
                            ],
                            [
                                0.1451,
                                22.794916999999998
                            ],
                            [
                                0.1453,
                                12.345828999999998
                            ],
                            [
                                0.1454,
                                10.035642
                            ],
                            [
                                0.148,
                                9.326642
                            ],
                            [
                                0.1522,
                                3.76317
                            ]
                        ],
                        color: '#0B7903'
                    }],
                    credits: {
                        enabled: false
                    },
                    navigation: {
                        buttonOptions: {
                            enabled: false
                        }
                    }
                };
                this._chart = new Highcharts.chart(this.id, options);
            } else {
                var referitem = obj.referitem;

                var openItem = "13";
                var highItem = "14";
                var lowItem = "15";
                var closeItem = "4";
                var dateItem = "9";
                var timeItem = "8";
                var volItem = "83";
                var signItem = "sign";

                if (referitem) {
                    if (referitem.data) {
                        openItem = referitem.data.open;
                        highItem = referitem.data.high;
                        lowItem = referitem.data.low;
                        closeItem = referitem.data.close || referitem.data.price;
                        dateItem = referitem.data.date;
                        timeItem = referitem.data.time;
                        volItem = referitem.data.vol;
                        signItem = referitem.data.sign;
                    }
                }

                var chartdata = data;
                // split the data set into ohlc and volume
                var xLabels = [], datas = [],
                    dataLength = chartdata.length,
                    i = 0, tickCnt = 0;

                for (i = dataLength - 1; i >= 0; i--) {
                    var date = "";
                    date = chartdata[i][dateItem];
                    var time = chartdata[i][timeItem];
                    date = date + time;

                    xLabels.push(date);
                    var close = parseFloat(chartdata[i][closeItem]);
                    datas.push(close);
                }

                this.initChart();
                var dataSet = {
                    labels: xLabels,
                    datasets: [{
                        fill: 'origin',
                        data: datas,
                        backgroundColor: '',
                        borderColor: '',
                        borderWidth: 1
                    }]
                };
                if (this.options.scichart1) {
                    dataSet.datasets[0].backgroundColor = g_chartColor.scichart1.fillColor;
                    dataSet.datasets[0].borderColor = g_chartColor.scichart1.borderColor;
                }
                else if (this.options.scichart2) {
                    dataSet.datasets[0].backgroundColor = g_chartColor.scichart2.fillColor;
                    dataSet.datasets[0].borderColor = g_chartColor.scichart2.borderColor;
                }

                var ctxs = document.getElementById(this.id);
                var ctx = ctxs.getElementsByTagName("canvas")[0].getContext('2d');
                this._chart = new Chart(ctx, {
                    type: 'line',
                    responsive: true,
                    animation: false,
                    data: dataSet,
                    options: g_chartOption.scichart
                });
            }

            
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
        GetProp: function (propName) {
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
        SetProp: function (propName, Value) {
            var $element = this.GetElemnt();

            if (propName == "caption") {
                $element.text(Value);
            }
            else if(propName == "background"){  // 2019.09.20 kws -> 테마 변경 시 depthchart는 배경색을 변경해야한다.
                // theme-light #25385f
                // theme-dark rgb(28,40,62)
                var bgColor = "rgb(28,40,62)";
                if(Value == "light"){
                    //bgColor = "#25385f";
                    bgColor = "#ffffff";    // 2020.02.10 kws -> 결함번호 1430 화이트테마 기본 색 변경
                }
                if(this._chart){
                    this._chart.update({chart : {backgroundColor : bgColor}});
                }
            }
            else {
                typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
            }
        },

        /// <member id="SetOption" kind="method">
        /// <summary>차트 속성을 지정하는 함수</summary>
        /// <remarks>period, ntick 등 옵션 지정</remarks>
        /// <param name = "option" type="object"> 옵션 정보 </param>
        /// <example><![CDATA[
        ///  // chart 조회 전 옵션 변경(일봉으로 변경)
        ///     var options = { period : '2' };
        ///     cht_1.SetOption(options);
        /// ]]></example>
        /// </member>
        SetOption: function (option) {
            if (option.remake == true) {
                var data = option.data;
                this.SetData(data);
            }
            else {
                for (var key in option) {
                    this.options[key] = option[key];
                }
            }
        },

        initChart: function () {
            if (this._chart) {
                this._chart.destroy();
                delete this._chart;
                this._chart = null;
            }
        },

        OnGetData: function (data, option) {
            this.showLoading = false;
/* GetDepthChartData() 함수자로 option 전달*/
            if (this.options.depthchart) {
                this.GetDepthChartData(option, false);
                return;
            }

            if (data.length <= 0) {
                this.initChart();
                this.nextKey = "";
                this.nextKeyLen = 0;
                return;
            }

            this.nextKey = option.nextKeyBuf;
            this.nextKeyLen = option.nextKeyLen;

            this.SetData(data);
        },

        // 시세PoolData Paint 처리 함수
        OnRealTime: function (option) {
            if (this.showLoading) return;  // 조회중이면 무시를 한다.

            this._chart.update();
        },

        OnRealData: function (data, option) {
            if (data.length <= 0) {
                return;
            }
            /* GetDepthChartData() 함수자로 option 전달*/
            if (this.options.depthchart) {
                this.GetDepthChartData(option, true);
                return;
            }
            return;
        },

        // chart update data
        AppendData: function (data, bDraw) {
            if (!this._chart) return;

            if (hi5.isArray(data)) {
                for (var x = data.length - 1; x >= 0; x--) {
                    var updatedata = data[x];
                    this.updateChartData(updatedata);
                }
            }
            else {
                this.updateChartData(updatedata);
            }

            if (bDraw)
                this._chart.update();
        },

        updateChartData: function (data) {
            var obj = this;

            var closeItem = "4";
            var dateItem = "9";
            var timeItem = "8";

            //data - [YYYYMMDDhhmmssSSS, open, high, low, close, volume]
            var pricedata = "";
            var updateYN = false;

            var datetime = data[dateItem] + data[timeItem];
            datetime = datetime.substring(0, 12) + "00";
            var close = data[closeItem];
            close = parseFloat(close, 10);

            var orgData = this._chart.data.labels;
            var lastTime = this._chart.data.labels[orgData.length - 1];
            if (lastTime >= datetime) {
                this._chart.data.datasets[0].data[orgData.length - 1] = close;
            }
            else {
                this._chart.data.labels.push(datetime);
                this._chart.data.datasets[0].data.push(close);

                if (this._chart.data.datasets[0].data.length > this.options.rqDataCount) {
                    this._chart.data.labels.shift();
                    this._chart.data.datasets[0].data.shift();
                }
            }
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

    chart.ctlName = "chart";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(chart.ctlName, chart);
    return chart;
}());
