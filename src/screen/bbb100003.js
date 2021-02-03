let dataObj = [
    { chetime: '005930', price : '110477', cvolume : "73000", change : "500", revolume : "0.5", chdegree: '12306977', sign: '2' },
    { chetime: '035720', price : '110254', cvolume : "372000", change : "-1500", revolume : "-0.4", chdegree: '200265', sign: '2' },
    { chetime: '005380', price : '5465', cvolume : "187500", change : "-1500", revolume : "-0.79", chdegree: '663404', sign: '5' },
    { chetime: '001105', price : '1234', cvolume : "80645", change : "2500", revolume : "0.6", chdegree: '12306977', sign: '2' },
    { chetime: '006576', price : '212', cvolume : "4057", change : "-4500", revolume : "-0.3", chdegree: '200265', sign: '5' },
    { chetime: '002455', price : '9135', cvolume : "80005", change : "-500", revolume : "-0.22", chdegree: '663404', sign: '2' },
    { chetime: '005380', price : '5808', cvolume : "187500", change : "-1500", revolume : "-0.79", chdegree: '663404', sign: '5' },
    { chetime: '001105', price : '46786', cvolume : "80645", change : "2500", revolume : "0.6", chdegree: '12306977', sign: '5' },
    { chetime: '006576', price : '54657', cvolume : "4057", change : "-4500", revolume : "-0.3", chdegree: '200265', sign: '2' },
    { chetime: '002455', price : '4254', cvolume : "80005", change : "-500", revolume : "-0.22", chdegree: '663404', sign: '5' }
];
let dataObj2 = [
    { chetime: '005930', price : '110477', cvolume : "73000", change : "500", revolume : "0.5", chdegree: '12306977', sign: '2' },
    { chetime: '035720', price : '110254', cvolume : "372000", change : "-1500", revolume : "-0.4", chdegree: '200265', sign: '2' },
    { chetime: '005380', price : '5465', cvolume : "187500", change : "-1500", revolume : "-0.79", chdegree: '663404', sign: '5' },
    { chetime: '001105', price : '1234', cvolume : "80645", change : "2500", revolume : "0.6", chdegree: '12306977', sign: '2' },
    { chetime: '006576', price : '212', cvolume : "4057", change : "-4500", revolume : "-0.3", chdegree: '200265', sign: '5' },
    { chetime: '002455', price : '9135', cvolume : "80005", change : "-500", revolume : "-0.22", chdegree: '663404', sign: '2' }
];
let dataObj3 = [
    { chetime: '005380', price : '5808', cvolume : "187500", change : "-1500", revolume : "-0.79", chdegree: '663404', sign: '5' },
    { chetime: '001105', price : '46786', cvolume : "80645", change : "2500", revolume : "0.6", chdegree: '12306977', sign: '5' },
    { chetime: '006576', price : '54657', cvolume : "4057", change : "-4500", revolume : "-0.3", chdegree: '200265', sign: '2' },
    { chetime: '002455', price : '4254', cvolume : "80005", change : "-500", revolume : "-0.22", chdegree: '663404', sign: '5' }
];

var btn_select = true;
// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    
    // grd_1.OnGetData(dataObj);
    grd_2.OnGetData(dataObj2);
    grd_3.OnGetData(dataObj3);
    gb_time.$html.show();
    grd_1_2.$html.hide();
    gb_date.$html.hide();
    gb_exp.$html.hide();
    img_check.$html.hide();
    img_uncheck.$html.show();
    btn_time.OnClick();
    btn_chart.OnClick();
    debugger
    // TR 요청
    form.CommRequest("t1301");
    debugger
}
//요청 데이터(InRec1) 편집!!
form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal)
{
    strRQName = 't1301';
     debugger
    
    //objCommInput.InRec1.shcode = dataObj.length;
    //objCommInput.InRec1.starttime = '000000';
    //objCommInput.InRec1.endtime = '235959';
    
    // // 2. shcode 세팅
    // // 구분자 없이 종목코드를 붙여서 입력
    // // 078020, 000660, 005930 -> 078020000660005930
    // var data="";
    // // 3. 종목데이터에서 종목코드만 찾아서 붙이기 (최대 50개!!!)
    // for(var i = 0; i < dataObj.length; i++){
    //     data += dataObj[i]["shcode"];
    // }
    // 4. 종목코드 세팅!!
    // objCommInput.InRec1.shcode = data;
//     debugger
}

// [form:event ] OnRpData  start...
form.OnRpData=function(strRQName, strTRCode, nPreNext, ui){
    //alert("OnRpData : " + ui.rowData.hname); 
};

// [form:event ] OnRpBefore  start...
form.OnRpBefore=function(strRQName, strTRCode, nPreNext, ui, _objBeforeReal){
    //alert("OnRpBefore : " + ui.rowData.hname); 
  
};

// [grid:event ] OnColumnRender  start...
grd_1.OnColumnRender=function(ui){
    // var uData = "종목: "+ui.rowData.jmname + ",가격: "+ ui.rowData.price + ",등락률: "+ui.rowData.diff + ",대비: "+ui.rowData.change;
    var uData =ui.dataIndx;
    // alert(uData);
    // alert(ui.dataIndx);
    
    // sign에 따른 글자색 세팅
    // 다른 옵션값으로 올 수 있기때문에 grid.js, common.js 등 참조 필요!!
    
    // "5" -> 파랑(하락)
    if (ui.rowData.sign == "5"){
            fontColor = "color:blue;"
    }
    // "2" -> 빨강(상승)
    else if (ui.rowData.sign == "2"){
        fontColor = "color:red;"
    }else{
        fontColor = "color:black;"
    }
    
    // 1. 현재가 -> 색 & bold 적용
    // 2. 등락률 -> 색 & %기호 적용
    // 3. 대비, 매도호가, 매수호가 -> 색
    let htmlText = "";
    switch (ui.dataIndx) {
        // 1. 현재가
        case 'price':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.price) + "</div>";
            return {text : htmlText};
            break;
        // 2. 등락률
        case 'change':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.change) + "</div>";
            return {text : htmlText};
            break;
        // 3.1 대비
        case 'cvolume':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.cvolume) + "</div>";
            return {text : htmlText};
            break;            
        default:
            // code
    }
};

// [grid:event ] OnHeaderCellClick  start...
grd_1.OnHeaderCellClick=function(dataIndx, column){
    // 대비 클릭시 등락률 그리드로 변경
    if(dataIndx == 'change'){
        grd_1.$html.hide();
        grd_1_2.$html.show();
    }
    grd_1_2._gPQ.refreshDataAndView( );
};
// [grid:event ] OnHeaderCellClick  start...
grd_1_2.OnHeaderCellClick=function(dataIndx, column){
    // 등락률 클릭시 대비 그리드로 변경
    if(dataIndx == 'diff'){
        grd_1.$html.show();
        grd_1_2.$html.hide();
    }
    grd_1._gPQ.refreshDataAndView( );
};
// [grid:event ] OnHeaderCellClick  start...
grd_2.OnHeaderCellClick=function(dataIndx, column){
    // 대비 클릭시 등락률 그리드로 변경
    if(dataIndx == 'daebi'){
        grd_2.$html.hide();
        grd_2_2.$html.show();
    }
    grd_2_2._gPQ.refreshDataAndView( );
};
// [grid:event ] OnHeaderCellClick  start...
grd_2_2.OnHeaderCellClick=function(dataIndx, column){
    // 대비 클릭시 등락률 그리드로 변경
    if(dataIndx == 'rate'){
        grd_2.$html.show();
        grd_2_2.$html.hide();
    }
    grd_2._gPQ.refreshDataAndView( );
};

// [button:event ] OnClick  start...
btn_time.OnClick=function(){
    $('#'+btn_day.id).removeClass('clickik');
    $('#'+btn_exp.id).removeClass('clickik');
    $('#'+btn_time.id).addClass('clickik');
    gb_time.$html.show();
    grd_1.$html.show();
    grd_1_2.$html.hide();
    gb_date.$html.hide();
    gb_exp.$html.hide();
    btn_chart.$html.show();
    grd_1._gPQ.refreshDataAndView( );
    grd_1_2._gPQ.refreshDataAndView( );
    gb_2.$html.show();
};

// [button:event ] OnClick  start...
btn_day.OnClick=function(){
    $('#'+btn_time.id).removeClass('clickik');
    $('#'+btn_exp.id).removeClass('clickik');
    $('#'+btn_day.id).addClass('clickik');
    gb_time.$html.hide();
    gb_date.$html.show();
    grd_2.$html.show();
    grd_2_2.$html.hide();
    gb_exp.$html.hide();
    btn_chart.$html.show();
    grd_2._gPQ.refreshDataAndView( );
    grd_2_2._gPQ.refreshDataAndView( );
    gb_2.$html.show();
};

// [button:event ] OnClick  start...
btn_exp.OnClick=function(){
    $('#'+btn_time.id).removeClass('clickik');
    $('#'+btn_day.id).removeClass('clickik');
    $('#'+btn_exp.id).addClass('clickik');
    gb_time.$html.hide();
    gb_date.$html.hide();
    gb_exp.$html.show();
    gb_2.$html.hide();
};

// [button:event ] OnClick  start...
btn_chart.OnClick=function(){
    if(btn_select){
        //$('#'+btn_chart.id).addClass('clickik');
        $('#'+gb_2.id).removeClass('border');
        $('#'+gb_2.id).addClass('clickik');
        img_check.$html.show();
        img_uncheck.$html.hide();
        grd_1.SetStyle('top','164');
        grd_1.SetGridHeight('265');
        grd_1_2.SetStyle('top','164');
        grd_1_2.SetGridHeight('265');
        grd_2.SetStyle('top','164');
        grd_2.SetGridHeight('265');
        grd_2_2.SetStyle('top','164');
        grd_2_2.SetGridHeight('265');
        btn_select = false;
    } else{
        //$('#'+btn_chart.id).removeClass('clickik');
        $('#'+gb_2.id).removeClass('clickik');
        $('#'+gb_2.id).addClass('border');
        img_check.$html.hide();
        img_uncheck.$html.show();
        debugger;
        grd_1.SetStyle('top','0');
        grd_1.SetGridHeight('429');
        grd_1_2.SetStyle('top','0');
        grd_1_2.SetGridHeight('429');
        grd_2.SetStyle('top','0');
        grd_2.SetGridHeight('429');
        grd_2_2.SetStyle('top','0');
        grd_2_2.SetGridHeight('429');
        btn_select = true;
        debugger;
    }
    grd_1._gPQ.refreshDataAndView( );
    grd_1_2._gPQ.refreshDataAndView( );
    grd_2._gPQ.refreshDataAndView( );
    grd_2_2._gPQ.refreshDataAndView( );
};