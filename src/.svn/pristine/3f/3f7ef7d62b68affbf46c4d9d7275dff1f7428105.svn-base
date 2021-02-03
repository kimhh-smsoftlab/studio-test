//slider.js
(function () {
    'use strict';

    var slider = function () {

        this.slideroptions = {
            //width: 300,
            //height: 50,
            min: 0,
            max: 100,
            value: 0,
            //buttonsPosition: 'both',
            //layout: 'normal',
            //mode: 'fixed',
            //minorTicksFrequency: 2,
            //minorTickSize: 4,
            //rangeSlider: false,
            //step: 1,
            //step: 12.5, // 핀트라용
            //showTicks: true,
            //showMinorTicks: false,
            //showTickLabels: true,
            //showButtons: true,
            //showRange: false,
            //ticksPosition: 'bottom',
            //ticksFrequency: 10,
            //tickSize: 7,
            //tooltip: true,
            //tooltipPosition: 'far',
            //values: [50, 50],
            //tickLabelFormat: "",
            //tooltipFormat: "",
            //theme: 'bootstrap',
            useLabelToVal: true,  // 가영 추가 190724
            rangeLabels: "교차,1x,2x,3x,5x,10x,25x,50x,100x",  // 가영 추가 190724
            curLabel: null,  // 가영 추가 190724
            useLabel:false

        };
    }
    var slideobj;
    slider.prototype={
        propertyLoad : function (node, nodeName, xmlHolderElement) {
            slideobj = this;
            var that = this,
                style = [],
                cls = ["hi5_slider"],
                attr = { id: "", disabled: "" };

            var objXML = x2h.getXML2Control(node, this, attr, cls, style, function (type) {
                return ["options"]
            });
            attr["class"] = cls.join(" ");
            if (style.length)
                attr["style"] = style.join("");
            //for(var key in this.options) {
            //    if (objXML[key]) this.options[key] = objXML[key];
            //}

            if (objXML.options) {
                $.extend(that.slideroptions, objXML.options);
            }

            style = x2h.attri(xmlHolderElement, attr);

            var subEle = document.createElement("input");
            xmlHolderElement.appendChild(subEle);
            //attr = { type: "range", min: this.slideroptions.min, max: this.slideroptions.max, value: this.slideroptions.value };
            attr = { type: "range", min: this.slideroptions.min, max: this.slideroptions.max, value: this.slideroptions.value,  curLabel: this.slideroptions.curLabel, useLabelToVal: this.slideroptions.useLabelToVal, rangeLabels: this.slideroptions.rangeLabels,useLabel: this.slideroptions.useLabel };
            var rangeLabels = attr.rangeLabels;
            var rangeArray = rangeLabels.split(',');
            var stepsize = ((attr.max - attr.min) / (rangeArray.length - 1));
            attr.step = Number(stepsize.toFixed(2));
            style = x2h.attri(subEle, attr);
            subEle['data-rangeslider'] = "";
            return;
        }

       ,onInitAfter : function () {
           var obj = this;
           $("#" + obj.id + " input[type=range]").rangeslider({
               // Deactivate the feature detection
               polyfill: false,

               rangeClass: 'rangeslider',
               disabledClass: 'rangeslider--disabled',
               horizontalClass: 'rangeslider--horizontal',
               verticalClass: 'rangeslider--vertical',
               fillClass: 'rangeslider__fill',
               handleClass: 'rangeslider__handle',

               // Callback function
               onInit: function (updaterange) {
                   var that = this.$element.parent();
                   var $rangeEl = this.$range;

                   // add value label to handle
                   var $handle = $rangeEl.find('.rangeslider__handle');
                   var handleValue;

                   var rangeLabels = this.rangeLabels;
                   rangeLabels = rangeLabels.split(',');
                   var labelCount = rangeLabels.length;
                   var tempLabelVal = {};
                   for (var i = 0; i <= labelCount; i++) {
                       var key = this.step * i;
                       tempLabelVal[key] = rangeLabels[i];
                   }
                   this.LabelVal = tempLabelVal;
                   this.curLabel = this.LabelVal[this.value];
                   if (this.$range[0].clientWidth != 0) {
                       var labelWidth = (this.$range[0].clientWidth - 10) / (rangeLabels.length - 1);
                       //var labelConWidth = this.$range[0].clientWidth - 10 + labelWidth;
                       var labelConWidth = this.$range[0].clientWidth - 6 + labelWidth;
                       var labelConLeft = labelWidth / 2 - 4;
                       var useLabel = this.$element.attr('useLabel')
                       if (updaterange != 'noupdate' && useLabel == 'true') {
                           if (!this.useLabelToVal) {
                               // add handle value
                               if (hi5.WTS_MODE == WTS_TYPE.SPA)
                                   handleValue = '<div class="rangeslider__handle__value__sdi">' + this.value + '</div>';
                               else
                                   handleValue = '<div class="rangeslider__handle__value">' + this.value + '</div>';
                               $handle.append(handleValue);
                           } else if (this.useLabelToVal) {
                               // add handle value
                               if (hi5.WTS_MODE == WTS_TYPE.SPA)
                                   handleValue = '<div class="rangeslider__handle__value__sdi">' + this.curLabel + '</div>';
                               else
                                   handleValue = '<div class="rangeslider__handle__value">' + this.curLabel + '</div>';
                               $handle.append(handleValue);
                           }
                       } 
                       else {
                           if (useLabel == 'false') {
                               that.css('padding-top','8px')
                           }
                           if (hi5.WTS_MODE == WTS_TYPE.SPA)
                               $(".rangeslider__handle__value__sdi").text(this.curLabel)
                           else
                               $(".rangeslider__handle__value").text(this.curLabel)
                       }
                   }
                   // add labels
                   that.find('.rangeslider__labels').remove();
                   //if (updaterange != 'noupdate') {
                       $rangeEl.append('<div class="rangeslider__labels" style="width:' + labelConWidth + 'px; left:-' + labelConLeft + 'px"></div>');
                       $(rangeLabels).each(function (index, value) {
                           if (index == 0)
                               $rangeEl.find('.rangeslider__labels').append('<div class="rangeslider__labels__box" style="width: ' + labelWidth + 'px"><p class="rangeslider__labels__label__point"></p><p class="rangeslider__labels__label activeLabel">' + value + '</span></div>');
                           else
                               $rangeEl.find('.rangeslider__labels').append('<div class="rangeslider__labels__box" style="width: ' + labelWidth + 'px"><p class="rangeslider__labels__label__point"></p><p class="rangeslider__labels__label">' + value + '</span></div>');

                       });
                   //} else {
                   //    $(".rangeslider__labels").css({ 'width': labelConWidth, 'left': -labelConLeft });
                   //    $(rangeLabels).each(function (index, value) {
                   //        $(".rangeslider__labels__box").css({ 'width': labelWidth });
                   //        $(".rangeslider__labels__label").text(value)
                   //    });
                   //}
                  
                   if (this.$element[0].value) {
                       if (obj.OnInit)
                           obj.OnInit.call(obj, this.$element[0].value);
                   }
               },

               // Callback function
               onSlide: function (position, value, triggerSlide) {
                   var $handle;
                   if (hi5.WTS_MODE == WTS_TYPE.SPA)
                       $handle = this.$range.find('.rangeslider__handle__value__sdi');
                   else
                       $handle = this.$range.find('.rangeslider__handle__value');

                   if (this.useLabelToVal && this.LabelVal) {
                       $handle.text(this.LabelVal[this.value]);
                   } else {
                       $handle.text(this.value);
                   }


                   //if (obj.OnChange && triggerSlide)
                   //    obj.OnChange.call(obj, value, this.curLabel);
               },
               // Callback function
               onSlideEnd: function (position, value) {
                   //var selLabel = value == 0 ? value : this.curLabel.replace(/[^0-9 .]/g, "");

                   var $inputRange = $('#' + this.id + " input[type='range']");
                   $inputRange.attr('value', this.curLabel);
                   this.$element.attr('value', this.curLabel);//selLabel
                   //this.$element.attr('key', this.selLabel);
                   value = this.curLabel;
                   if (obj.OnChange)
                       obj.OnChange.call(obj, value, this.curLabel);
               }
           });

           var disabled = this._html.disabled;
           //var disabled = $self.prop("disabled");
           if (disabled == true) {
               this.Disabled(true);
           }
           return;
       }

        ,GetElemnt : function () {
            return this.$html;
        }

        // disabled 됐을때 동작(css disabled 동일)
        ,Disabled : function (state) {
            if (state == undefined) return;
            var $inputRange = $('#' + this.id + " input[type='range']");
            if (state == true || state == "disabled" || state == "true") {
                $inputRange.prop("disabled", true);
                $("#" + this.id + " .rangeslider__handle").css("cursor", "not-allowed");
            }
            else {
                $inputRange.prop("disabled", false);
                $("#" + this.id + " .rangeslider__handle").css("cursor", "pointer");
            }

            // change 이벤트를 발생 시키지 않는다.
            $inputRange.rangeslider('update', false, false);
            $inputRange.rangeslider({
                polyfill: false
            });
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
        , GetProp: function (propName) {
            var $inputRange = $('#' + this.id + " input[type='range']");

            var val = $inputRange[0].attributes[propName].value
            return val;
        }

        /// <member id="SetProp" kind="method">
        /// <summary>속성 정보를 변경하는 함수</summary>
        /// <remarks>속성명으로 모든 속성을 제어하는 함수</remarks>
        /// <param name = "propName" type="string"> 스타일 정보</param>
        /// <param name = "value" type="string"> 셀 아이템명</param>
        /// <param name = "evtChange" type="boolean" default="false"> change 이벤트 발생여부 기본값: 이벤트 발생안함</param>
        /// </member>
        ,SetProp : function (propName, Value, evtChange) {
            var $element = this.GetElemnt();
            //var selLabel = value == 0 ? 'C' : this.curLabel.replace(/[^0-9 .]/g, "");
            var id = $element[0].id;
            if (propName == "value") {
                var triggerSlide = (evtChange == undefined) ? false : evtChange;
                $("#" + id + " input[type=range]").attr('value', Value).trigger('change', { triggerSlide: triggerSlide });
                
            }else if (propName == "label") {
                var triggerSlide = (evtChange == undefined) ? false : evtChange;
                $("#" + id + " input[type=range]").attr('value',Value).trigger('change', { triggerSlide: triggerSlide });
            }
            else {
                if (propName != 'rangeLabels') {
                    typeof (propName) === "object" ? $element.attr(propName) : $element.attr(propName, Value);
                    if (propName == "disabled") {
                        this.Disabled(Value);
                    }
                }
                else if (propName == 'rangeLabels') {
                    var $inputRange = $('#' + this.id + " input[type='range']");
                    Value = Value.replace("Cross", $hi5_regional.lev_cross);
                    $inputRange.attr('rangelabels', Value);
                    var rangeArray = Value.split(',');
                    var stepsize = (($inputRange.attr('max') - $inputRange.attr('min')) / (rangeArray.length - 1));
                    $inputRange.attr('step', Number(stepsize.toFixed(2)));

                    //$inputRange.rangeslider('destroy');
                    //$inputRange.rangeslider('init');

                    $inputRange.rangeslider('update', true, true,'noupdate');
                }
            }
        }
        , SetSize: function (control, sizePer) {
            if (sizePer) {
                if (control && control.$html.css('display') == 'block') {
                    
                    var p_width = control.$html.width();
                    var s_width = p_width * sizePer / 100;
                    s_width = s_width.toFixed(2);
                    
                    $('#' + this.id).width(s_width);
                    var $inputRange = $('#' + this.id + " input[type='range']");
                    $inputRange.rangeslider('update', false, false, 'noupdate');
                }
            }
        }
        /* 190724 가영 추가 - 필요없을 것 같아서 일단 주석처리해둠
        , GetOption: function (optionName) {
            var obj = this;
            if (!optionName) {
                return obj.slideroptions;
            } else {
                return obj.slideroptions[optionName];
            }
        }
        */
    }


    /// <member id="OnInit" kind="event">
    /// <summary>슬라이더 생성 시에 값을 반환</summary>
    /// <remarks>슬라이더 생성 시에 발생하는 이벤트. 초기값을 반환한다.</remarks>
    /// <param name = "value" type="string"> 슬라이더 위치 값 </param>
    /// <example><![CDATA[
    ///             slider_1.OnInit(value){
    ///                 lb_1.SetProp(value);
    ///             }
    /// ]]></example>
    /// </member>


    /// <member id="OnChange" kind="event">
    /// <summary>슬라이더 움직일 시에 해당 값을 반환</summary>
    /// <remarks>움직일때마다 값을 반환한다.</remarks>
    /// <param name = "value" type="string"> 위치값 </param>
    /// <param name = "label" type="string"> 라벨값 </param>
    /// <example><![CDATA[
    ///             slider_1.OnChange(value, label){
    ///                 lb_1.SetProp(value);
    ///             }
    /// ]]></example>
    /// </member>

    slider.ctlName = "slider";
    // 해쉬데이터에 함수를 등록한다.
    hi5_controlExpert(slider.ctlName, slider);
    return slider;
}());
