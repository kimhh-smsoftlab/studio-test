let dataObj = [
    { chetime: '201518', price : '110477', upDown : "73000", buy : "500", sign: '2' },
    { chetime: '201518', price : '110254', upDown : "372000", buy : "-1500", sign: '0' },
    { chetime: '201518', price : '5465', upDown : "187500", buy : "-1500", sign: '5' },
    { chetime: '201518', price : '1234', upDown : "80645", buy : "2500", sign: '0' },
    { chetime: '201518', price : '212', upDown : "4057", buy : "-4500", sign: '5' },
    { chetime: '201518', price : '9135', upDown : "80005", buy : "-500", sign: '0' },
    { chetime: '201105', price : '5808', upDown : "187500", buy : "-1500", sign: '0' },
    { chetime: '201105', price : '46786', upDown : "80645", buy : "2500", sign: '5' },
    { chetime: '201105', price : '54657', upDown : "4057", buy : "-4500", sign: '2' },
    { chetime: '201105', price : '4254', upDown : "80005", buy : "-500", sign: '5' }
];

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    grd_1.OnGetData(dataObj);
    // TR 요청
    //form.CommRequest("t1637");
}
// [form:event ] OnCommSendDataAfter  start...
form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal){
    //strRQName = 't1637';
};


// [grid:event ] OnColumnRender  start...
grd_1.OnColumnRender=function(ui){
    var uData =ui.dataIndx;
    
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
        case 'upDown':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.upDown) + "</div>";
            return {text : htmlText};
            break;
        // 3.1 대비
        case 'buy':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.buy) + "</div>";
            return {text : htmlText};
            break;            
        default:
            // code
    }
};