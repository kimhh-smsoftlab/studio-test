var g_strCode;
var g_jscode = [];
// 기능설명>  작성자:홍주형 일시:2019/08/09 17:14:21 //////// 
//차트의 심볼값 설정
var setSymbol = function(code,precode){
	if(tv_chart.widget && tv_chart.widget._ready){
		if(tv_chart.code == code){
			//if( precode == hi5.SHMEM["@BASE_CURRENCY"]) {
				//self.onResetCacheNeededCallback();
				return;
			//}
		}
		real_reg(g_strCode, false);
		
		tv_chart.nextKey = "";
		tv_chart.nextKeyLen = 0;
		g_strCode = code;
		tv_chart.widget.setSymbol(code, tv_chart.interval, function(){});
		
		real_reg(code, true);
		
	}
};

// 기능설명>  작성ㅇ자:홍주형 일시:2019/08/09 17:14:21 //////// 
//호가의 현재가 영역에 선물 지수 가져오기위한 실시간 관리
function real_regi_jisu(bReg){
	var option_b = { 'realtype': "0010", 'keylist': g_jscode, 'obj': form, 'formReal' : true};
	if(bReg == true){
		form.RealSB(option_b);
	}else {
		form.RealSBC(option_b);
	}
}

function real_reg(code, bReg){
	var option_h = { 'realtype': "0012", 'keylist': [code], obj : form, 'formReal' : true};
	if(bReg == true){
		form.RealSB(option_h);
	}else {
		form.RealSBC(option_h);
	}
}
// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    g_strCode = me_1.GetProp("value");
    tv_chart.code = g_strCode;
    tv_chart.StartChart();
};


form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal)
{
if(strRQName == "RQ_CHART"){
	objCommInput.InRec1.symbol = tv_chart.code;
	var interval = tv_chart.interval;
	if(interval == "D") interval = "2";
	else if(interval == "W") interval = "3";
	else if(interval == "M") interval = "4";
	else{
		interval = "1";
		objCommInput.InRec1.unit = hi5.LPAD(tv_chart.interval, 3, "0");
	}
	objCommInput.InRec1.button = interval;
	var dateObj = hi5.getUTCLocalTime(new Date());
	objCommInput.InRec1.edate = dateObj.utc.yy + dateObj.utc.mm + dateObj.utc.dd;
}
}
form.onConfigChange=function(option)
{
    if(option.item_sect){
    	if(option.item_sect == ITEM_SECT.INS)
    		option.code = hi5.getInsuranceCode("symbol");
    }
    
    if(option.code){
    	setSymbol(option.code);
    }
}
form.OnFormClose=function()
{
    real_regi_jisu(false);
    real_reg(g_strCode, false);
}
form.OnRealDataBefore=function(objPb, option)
{
    if(option.realType=='0012'){
	    var objData = objPb[0];
	    var symbol = objData.symbol;
	    if(symbol == g_strCode){
	        if(tv_chart.OnRealData)
		        tv_chart.OnRealData(objPb);
	    }
	}
}