let dataObj = [
    { shcode: '005930', hname : '삼성전자', price : "73000", diff : "0.5%", change : "2000", volume : "94.28%", sign : "2", rate : "80534"}
];
let dataObj_upTable = [
    { up : '100%', sin: '-', wa: '50%'}  
];
// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    Table_1.OnGetData(dataObj);  
    Table_2.OnGetData(dataObj_upTable);
    btn_3.OnClick(); 
    $('.mainTable tbody tr td.comitem').css('text-align','right');
    $('.mainTable tbody tr td.comitem.fidprice').css('text-align','left');
    $('.comitem.fidsign').text("▲");
    $('.comitem.fidsign').css('color','rgb(255,0,0)');
    
    form.CommRequest("RQ_CHART",0);
};

// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    $('.clickik').removeClass('clickik');
    $('#'+btn_1.id).addClass('clickik');
};

// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    $('.clickik').removeClass('clickik');
    $('#'+btn_2.id).addClass('clickik');
};

// [button:event ] OnClick  start...
btn_3.OnClick=function(){
    $('.clickik').removeClass('clickik');
    $('#'+btn_3.id).addClass('clickik');
};

// [button:event ] OnClick  start...
btn_4.OnClick=function(){
    $('.clickik').removeClass('clickik');
    $('#'+btn_4.id).addClass('clickik');
};

// [button:event ] OnClick  start...
btn_5.OnClick=function(){
    $('.clickik').removeClass('clickik');
    $('#'+btn_5.id).addClass('clickik');
};

// [form:event ] OnCommSendDataAfter  start...
form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal){
    if(strRQName == "RQ_CHART"){
        debugger
        objCommInput.InRec1.shcode = dataObj[0].shcode;
        var dateObj = hi5.getUTCLocalTime(new Date());
	    objCommInput.InRec1.edate = dateObj.utc.yy + dateObj.utc.mm + dateObj.utc.dd;
	    objCommInput.InRec1.ncnt = '0';
	    objCommInput.InRec1.qrycnt = '500';
	    objCommInput.InRec1.sdate = '20210101';
	    objCommInput.InRec1.tdgb = '0';
	    objCommInput.InRec1.gubun = '2';
    }
};

// [form:event ] OnRpData  start...
form.OnRpData=function(strRQName, strTRCode, nPreNext, ui){
    debugger
};

// [table:event ] OnColumnRender  start...
Table_1.OnColumnRender=function($TD, item, value, objDatas){
	    if (item == "price") {
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        return {cls :true};
    }
    
    if (item == "change") {
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        return {cls :true};
    }
    
    if (item == "diff") {
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        return {cls :true};
    }
    
    if (item == "volume"){
        debugger
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        
        return {cls :true};
    }
};