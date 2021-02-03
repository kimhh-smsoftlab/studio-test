//dygraph.js
(function () {
    'use strict';
    
    // init object
    var dygraph = function () {
        this.itemflag = "2";

        this.showLoading = false;
        this._realMng = null;  // 시세풀 관리( {자동갱신 타입 : 종목코드 배열[] }

        this.nextKey = "";
        this.nextKeyLen = 0;

        this._chart = null; //lib module
        this.baseOptions = {
            exporting: {
                enabled: false
            },
            credits : {
                enabled : false
            }
        }
    }
    
    dygraph.prototype = {
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
                cls = ["hi5_dygraph"], // 클래스 정보명 
                style = [],           //  Style, 색정보용 Style  정보
                attr = { id: "", disabled: "" }, // HTML Attri 정의하는 정보 설정
                dataCell = "";  // caption

            // XML 정보에서 컨트롤 스타일, 속성정보 등을 취득하는 기능
            var objXML = x2h.getXML2Control(node, this, attr, cls, style, function(type){
                return ["options"];
            });
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

            if(objXML.options){
                this.options = hi5.clone(objXML.options);
            }
    
            return;
        },

        onInitAfter: function(){
            if(this.options){
                this.SetOption(this.options);
            }
        },

        GetElemnt: function () {
            return this.$html;
        },

        GetCommValue: function (option) {
            
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

        /// <member id="GetOption" kind="method">
        /// <summary>차트 옵션 취득 함수</summary>
        /// <remarks>차트 옵션 취득 함수</remarks>
        /// <returns type="json">옵션정보를 반환</returns>
        /// </member>
        GetOption: function(){
            return this.options || null;
        },

        /// <member id="SetOption" kind="method">
        /// <summary>차트 옵션 설정 함수</summary>
        /// <remarks>차트 옵션 설정 함수</remarks>
        /// <param name="optionObj" type="json">속성 json</param>
        /// </member>
        SetOption: function(optionObj){
            if(!this.options) this.options = {};
            $.extend(this.options, this.baseOptions);
            $.extend(this.options, optionObj);

            this._chart = new Highcharts.chart(this.id, this.options);
        },

        /// <member id="SetData" kind="method">
        /// <summary>차트 데이터 반영 함수</summary>
        /// <remarks>차트 데이터 반영 함수</remarks>
        /// <param name="data" type="object">속성 json</param>
        /// </member>
        SetData: function(data){
            if(!this._chart) return;
            if(hi5.isArray(data)){
                let seriesCnt = this._chart.series.length;

                if(seriesCnt == 0){
                    this._chart.addSeries({data : data});
                    return;
                }
                for(let x = 0;x < seriesCnt;x++){
                    this._chart.series[x].setData(data, true);
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
            
            if (data.length <= 0) {
                this.initChart();
                this.nextKey = "";
                this.nextKeyLen = 0;
                return;
            }

            this.nextKey = option.nextKeyBuf;
            this.nextKeyLen = option.nextKeyLen;
        },

        // 시세PoolData Paint 처리 함수
        OnRealTime: function (option) {

        },

        OnRealData: function (data, option) {
            
        },

        // chart update data
        AppendData: function (data, bDraw) {
            
        },

        updateChartData: function (data) {
            
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
    //dygraph.prototype.OnRangeChange = function (data) {
    //}

    dygraph.ctlName = "dygraph";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(dygraph.ctlName, dygraph);
    return dygraph;
}());
