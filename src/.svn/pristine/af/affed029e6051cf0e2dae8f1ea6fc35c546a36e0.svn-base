// // t8407(멀티현재가조회) 요청 할 종목코드들..
// let dataObj = [
//     { shcode: '005930'}, 
//     { shcode: '035720'}, 
//     { shcode: '048549'}, 
//     { shcode: '165468'}, 
//     { shcode: '168468'}, 
//     { shcode: '464874'}, 
//     { shcode: '164984'}, 
//     { shcode: '321975'}, 
//     { shcode: '794635'}, 
//     { shcode: '098749'},
//     { shcode: '976468'}
// ];

// // [form:event ] OnFormInit  start...
// form.OnFormInit=function(tagName, objData){
//     // 현재가 TR 요청
//     form.CommRequest("RQCurrent");
// };

// // 요청 데이터(InRec1) 편집!!
// form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal)
// {
//     // 1. nrec 세팅
//     objCommInput.InRec1.nrec = dataObj.length;
    
//     // 2. shcode 세팅
//     // 구분자 없이 종목코드를 붙여서 입력
//     // 078020, 000660, 005930 -> 078020000660005930
//     var data="";
//     // 3. 종목데이터에서 종목코드만 찾아서 붙이기 (최대 50개!!!)
//     for(var i = 0; i < dataObj.length; i++){
//         data += dataObj[i]["shcode"];
//     }
//     // 4. 종목코드 세팅!!
//     objCommInput.InRec1.shcode = data;
    
//     //alert("레코드 수: " + objCommInput.InRec1.nrec + ",shcode: " + objCommInput.InRec1.shcode);
// }


// // [form:event ] OnRpData  start...
// form.OnRpData=function(strRQName, strTRCode, nPreNext, ui){
//     alert("OnRpData : " + ui.rowData.hname); 
// };

// // [form:event ] OnRpBefore  start...
// form.OnRpBefore=function(strRQName, strTRCode, nPreNext, ui, _objBeforeReal){
//     alert("OnRpBefore : " + ui.rowData.hname); 
  
// };


// // [grid:event ] OnColumnRender  start...
// grd_1.OnColumnRender=function(ui){
//     // var uData = "종목: "+ui.rowData.jmname + ",가격: "+ ui.rowData.price + ",등락률: "+ui.rowData.diff + ",대비: "+ui.rowData.change;
//     var uData =ui.dataIndx;
//     // alert(uData);
//     // alert(ui.dataIndx);
//     if (ui.rowData.sign == "5"){
//             fontColor = "color:blue;"
//     }else if (ui.rowData.sign == "2"){
//         fontColor = "color:red;"
//     }else{
//         fontColor = "color:black;"
//     }

//     if(ui.dataIndx == "price"){  // 첫번째 컬럼 구성 2줄
//         // alert("price: "+ui.rowData.price+ ", amount: "+ui.rowData.amount);
//         let htmlText = "<div style='font-size:16px;" + fontColor + "'>" + putThousandsSeparators(ui.rowData.price) + "</div><div><span style='font-size:12px;'>" + putThousandsSeparators(ui.rowData.value) + "</span></div>";
//         return {text : htmlText};
//     }
//     else if(ui.dataIndx == "diff"){ // 3번째 컬럼 구성 2줄
//         // alert("diff: "+ui.rowData.diff+ ", change: "+ui.rowData.change);
//         let htmlText = "<div style='font-size:16px;" + fontColor + "'>" + putThousandsSeparators(ui.rowData.change) + "</div><div><span style='font-size:12px;" + fontColor + "'>" + ui.rowData.diff + "%</span></div>";
//         return {text : htmlText};
//     }
// };


/* ---------- 모의 데이터로 화면 표현 ----------*/

// 등락(sign)에 따른 폰트 색깔 변경
var fontColor; 

// 임시 데이터, 그리드에 표현 할 데이터 key는 TR과 서로 일치함
let dataObj = [
    { shcode: '005930', hname : '삼성전자', price : "73000", diff : "0.5", change : "2000", amount : "15461", sign : "2"},
    { shcode: '035720', hname : '카카오', price : "372000", diff : "-0.4", change : "-15500", amount : "468", sign : "5"},
    { shcode: '048549', hname : '현대차', price : "187500", diff : "-0.79",  change : "-1650", amount : "1068496", sign : "5"},
    { shcode: '165468', hname : 'KTB', price : "4840", diff : "-0.4", change : "-463", amount : "49684", sign : "5"},
    { shcode: '168468', hname : 'NHN', price : "156460", diff : "-0.4", change : "-749", amount : "6546", sign : "5"},
    { shcode: '464874', hname : '한화', price : "26042", diff : "-0.4", change : "-908", amount : "465", sign : "5"},
    { shcode: '164984', hname : '파티게임즈', price : "1204", diff : "0.4", change : "978", amount : "798", sign : "2"},
    { shcode: '321975', hname : 'HABBY', price : "3265", diff : "0.4", change : "1.18", amount : "6543", sign : "2"},
    { shcode: '794635', hname : 'MSSoft', price : "120849", diff : "-0.4", change : "-15850", amount : "976", sign : "5"},
    { shcode: '098749', hname : 'Apple', price : "415600", diff : "-0.4", change : "-468790", amount : "50466483", sign : "5"},
    { shcode: '976468', hname : 'Marvel', price : "49876", diff : "-0.4", change : "-49800", amount : "4987984", sign : "5"},
    { shcode: '794635', hname : 'MSSoft', price : "120849", diff : "-0.4", change : "-15850", amount : "976", sign : "5"},
    { shcode: '098749', hname : 'Apple', price : "415600", diff : "-0.4", change : "-468790", amount : "50466483", sign : "5"},
    { shcode: '976468', hname : 'Marvel', price : "49876", diff : "-0.4", change : "-49800", amount : "4987984", sign : "5"}
];

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    grd_1.OnGetData(dataObj);
    // grd_1.HideFirstHeader(); 
    grd_1._gPQ.refreshDataAndView();
    $('.grid').css('border-top','1px solid #c2c2c2')
};


// [grid:event ] OnColumnRender  start...
grd_1.OnColumnRender=function(ui){
    // var uData = "종목: "+ui.rowData.jmname + ",가격: "+ ui.rowData.price + ",등락률: "+ui.rowData.diff + ",대비: "+ui.rowData.change;
    var uData =ui.dataIndx;
    // alert(uData);
    // alert(ui.dataIndx);
    if (ui.rowData.sign == "5"){
            fontColor = "color:blue;"
    }else if (ui.rowData.sign == "2"){
        fontColor = "color:red;"
    }else{
        fontColor = "color:black;"
    }

    if(ui.dataIndx == "price"){  // 첫번째 컬럼 구성 2줄
        // alert("price: "+ui.rowData.price+ ", amount: "+ui.rowData.amount);
        let htmlText = "<div style='font-size:16px;" + fontColor + "'>" + putThousandsSeparators(ui.rowData.price) + "</div><div><span style='font-size:12px;'>" + putThousandsSeparators(ui.rowData.amount) + "</span></div>";
        return {text : htmlText};
    }
    else if(ui.dataIndx == "diff"){ // 3번째 컬럼 구성 2줄
        // alert("diff: "+ui.rowData.diff+ ", change: "+ui.rowData.change);
        let htmlText = "<div style='font-size:16px;" + fontColor + "'>" + putThousandsSeparators(ui.rowData.change) + "</div><div><span style='font-size:12px;" + fontColor + "'>" + ui.rowData.diff + "%</span></div>";
        return {text : htmlText};
    }
};