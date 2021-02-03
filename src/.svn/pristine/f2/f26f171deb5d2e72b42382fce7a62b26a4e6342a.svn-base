// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    grd_time.OnGetData(timeDate);
    grd_date.OnGetData(dataDate);
    grd_time.$html.hide();
    grd_time2.$html.hide();
    grd_date.$html.show();
    $('#'+btn_3.id).addClass('clicking');
    btn_2.OnClick();
};


// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    grd_time.$html.show();
    grd_date.$html.hide();
    $('#'+btn_2.id).addClass('clicking');
    $('#'+btn_3.id).removeClass('clicking');
};

// [button:event ] OnClick  start...
btn_3.OnClick=function(){
    grd_time.$html.hide();
    grd_date.$html.show();
    $('#'+btn_3.id).addClass('clicking');
    $('#'+btn_2.id).removeClass('clicking');
};


let timeDate = [
    { time: '143445', vol: '4', nujeok: '-897', daebi: '15', sign: '5'},
    { time: '143445', vol: '4', nujeok: '-897', daebi: '15', sign: '2'},
    { time: '143445', vol: '4', nujeok: '-897', daebi: '15', sign: '5'},
    { time: '143445', vol: '4', nujeok: '-897', daebi: '15', sign: '5'}
];
let dataDate = [
    { date: '005930', sell: '005930', buy : '005930', buy2 : "73000", sign : '2'},
    { date: '005930', sell: '035720', buy : '005930', buy2 : "372000", sign : '2'},
    { date: '005380', sell: '005930', buy : '005930', buy2 : "187500", sign : '2'},
    { date: '005930', sell: '001105', buy : '005930', buy2 : "80645", sign : '5'},
    { date: '005930', sell: '006576', buy : '005930', buy2 : "4057", sign : '5'},
    { date: '005930', sell: '002455', buy : '005930', buy2 : "80005", sign : '5'},
    { date: '005930', sell: '005380', buy : '005930', buy2 : "187500", sign : '5'},
    { date: '005930', sell: '001105', buy : '005930', buy2 : "80645", sign : '5'},
    { date: '005930', sell: '006576', buy : '005930', buy2 : "4057", sign : '2'},
    { date: '005930', sell: '002455', buy : '005930', buy2 : "80005", sign : '2'}
];

// [grid:event ] OnColumnRender  start...
grd_time.OnColumnRender=function(ui){
    // var uData = "종목: "+ui.rowData.jmname + ",가격: "+ ui.rowData.price + ",등락률: "+ui.rowData.diff + ",대비: "+ui.rowData.change;
    var uData =ui.dataIndx;
    
    // sign에 따른 글자색 세팅
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
    
    // 1. 등락률 -> 색 & %기호 적용
    let htmlText = "";
    switch (ui.dataIndx) {
        // 1. 현재가
        case 'vol':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.vol) + "</div>";
            return {text : htmlText};
            break;
        // 2. 등락률
        case 'nujeok':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.nujeok) + "</div>";
            return {text : htmlText};
            break;           
        default:
            // code
    }
};

// [grid:event ] OnColumnRender  start...
grd_date.OnColumnRender=function(ui){
    // var uData = "종목: "+ui.rowData.jmname + ",가격: "+ ui.rowData.price + ",등락률: "+ui.rowData.diff + ",대비: "+ui.rowData.change;
    var uData =ui.dataIndx;
    
    // sign에 따른 글자색 세팅
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
    
    // 1. 등락률 -> 색 & %기호 적용
    let htmlText = "";
    switch (ui.dataIndx) {
        // 1. 현재가
        case 'sell':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.sell) + "</div>";
            return {text : htmlText};
            break;
        // 2. 등락률
        case 'buy':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.buy) + "</div>";
            return {text : htmlText};
            break;           
        default:
            // code
    }
};

// [grid:event ] OnHeaderCellClick  start...
grd_time.OnHeaderCellClick=function(dataIndx, column){
    if(dataIndx == 'daebi'){
        grd_time.$html.hide();
        grd_time2.$html.show();
    }
};

// [grid:event ] OnHeaderCellClick  start...
grd_time2.OnHeaderCellClick=function(dataIndx, column){
    if(dataIndx == 'rate'){
        grd_time.$html.show();
        grd_time2.$html.hide();
    }
};