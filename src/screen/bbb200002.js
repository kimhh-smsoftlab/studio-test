// // 외국인 보유 데이터 저장할 배열
// let dataForeign = [];

// // 임시 데이터 -> 현재가 데이터 수신 시 저장하도록 사용!!
// // 현재는 종목코드만..
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
//     // 화면 첫 생성 -> 현재가 데이터 요청 -> 현재가 데이터 수신 후 -> 외국인보유 데이터 요청
//     form.CommRequest('RQCurrent');
// };



// // 요청 보내기 전에 요청 데이터(InRec1) 편집!!
// form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal)
// {
//     // 종목코드 담을 변수
//     var data="";
    
//     // 현재가 데이터 요청 시
//     if(strRQName == "RQCurrent"){
//         // 1. nrec(레코드 수) 세팅
//         objCommInput.InRec1.nrec = dataObj.length;
        
//         // 2. shcode 세팅
//         // 구분자 없이 종목코드를 붙여서 한줄로 입력!
//         // ex) 078020, 000660, 005930 -> 078020000008005930
        
//         // 3. 종목데이터 목록에서 종목코드만 꺼내서 붙이기
//         for(var i = 0; i < dataObj.length; i++){
//             data += dataObj[i]["shcode"];
//         }
//         objCommInput.InRec1.shcode = data;
        
//     }// 외국인 보유 데이터 요청 시
//     else if(strRQName == "RQForeign"){
//         data = dataObj[nPreNext]["shcode"];
//         objCommInput.InRec1.shcode = data;       // 종목코드
//         objCommInput.InRec1.gubun = '0';         // 구분(0: 일별 순매수, 1: 기간내 누적순매수)
//         objCommInput.InRec1.fromdt = '20201229'; // 시작일자
//         objCommInput.InRec1.todt = '20201229';   // 종료일자
//         objCommInput.InRec1.prapp = '0';         // PR 적용
//         objCommInput.InRec1.prgubun = '0';       // PR 적용 구분
//         objCommInput.InRec1.orggubun = '0';      // 기관 적용
//         objCommInput.InRec1.frggubun = '0';      // 외인 적용
//     }
//     alert('strRQName: '+strRQName+', strTRCode'+strTRCode + ', shcode: ' + data);
// }


// // 응답 데이터 처리!!
// // [form:event ] OnRpData  start...
// form.OnRpData=function(strRQName, strTRCode, nPreNext, ui){
//     alert('strRQName: '+strRQName+'strTRCode'+strTRCode);
//     // RQCurrent(멀티 현재가) 데이터 수신 시 -> 현재 화면에 표시 할 종목 개수만큼 외국인 보유 TR 요청
//     if(strRQName == 'RQCurrent'){
//         // 1. 일단 기존 외국인 보유 삭제!!
//         dataForeign = [];
//         // 2. 데이터 반복 요청 실행
//         for(var i = 0; i < dataObj.length; i++){
//             form.CommRequest("RQForeign",i);
//         }
//     }// RQForeign(외국인보유) 데이터 수신 시 -> 마지막 데이터(nPreNext == dataObj.length 일 때)까지 다 모아서 그리드에 한 칼럼씩 추가..
//     else if(strRQName == 'RQForeign'){
//         if(nPreNext == dataObj.length){
//             // 데이터 필드 명 : listing
//             // 해당 필드 접근 방식이 ui.rowData.listing 맞는지 확인 필요
//             dataForeign.push(ui.rowData.listing); // 데이터 추가 끝!!
//             // 새 데이터로 그리드 갱신!!
//             grd_1.OnGetData(dataForeign);
//         }else{
//             dataForeign.push(ui.rowData.listing); // 데이터 추가만!!
//         }
//     }
//     // 신용비율 TR 찾아서 추가 필요..ㅠ
//     // + 현재가 TR 데이터로 계산해서 할 수 있는지 확인 필요
//     // else if(..)
// };

// // [grid:event ] OnColumnRender  start...
// grd_1.OnColumnRender=function(ui){
//     // 기존 (현재가) 데이터 cell은 수정하지 않고 외국인보유 cell만 데이터가 수정되도록 작성 필요..!!
// };


/* ---------- 모의 데이터로 화면 표현 ----------*/
let grdData = [
    { shcode: '005930', hname : '1삼성전자', price : "73000", change : "500", diff : "0.5", volume :'12306977', value : '498797498', chdegree: "1.65", offerho: "73500", bidho : "72500", sign : '2'},
    { shcode: '035720', hname : '1카카오', price : "372000", change : "-1500", diff : "-0.4", volume : '200265', value : '6876089', chdegree: "10.07", offerho: "373000", bidho : "375000", sign : '5'},
    { shcode: '005380', hname : '1현대차', price : "187500", change : "-1500", diff : "-0.79", volume : '663404', value : '797964', chdegree: "8.94", offerho: "188000", bidho : "187000", sign : '5'},
    { shcode: '005930', hname : '2삼성전자', price : "73000", change : "500", diff : "0.5", volume :'12306977', value : '498797498', chdegree: "1.65", offerho: "73500", bidho : "72500", sign : '2'},
    { shcode: '035720', hname : '2카카오', price : "372000", change : "-1500", diff : "-0.4", volume : '200265', value : '6876089', chdegree: "10.07", offerho: "373000", bidho : "375000", sign : '5'},
    { shcode: '005380', hname : '2현대차', price : "187500", change : "-1500", diff : "-0.79", volume : '663404', value : '797964', chdegree: "8.94", offerho: "188000", bidho : "187000", sign : '5'},
    { shcode: '005930', hname : '3삼성전자', price : "73000", change : "500", diff : "0.5", volume :'12306977', value : '498797498', chdegree: "1.65", offerho: "73500", bidho : "72500", sign : '2'},
    { shcode: '035720', hname : '3카카오', price : "372000", change : "-1500", diff : "-0.4", volume : '200265', value : '6876089', chdegree: "10.07", offerho: "373000", bidho : "375000", sign : '5'},
    { shcode: '005380', hname : '3현대차', price : "187500", change : "-1500", diff : "-0.79", volume : '663404', value : '797964', chdegree: "8.94", offerho: "188000", bidho : "187000", sign : '5'},
    { shcode: '005930', hname : '4삼성전자', price : "73000", change : "500", diff : "0.5", volume :'12306977', value : '498797498', chdegree: "1.65", offerho: "73500", bidho : "72500", sign : '2'},
    { shcode: '035720', hname : '4카카오', price : "372000", change : "-1500", diff : "-0.4", volume : '200265', value : '6876089', chdegree: "10.07", offerho: "373000", bidho : "375000", sign : '5'},
    { shcode: '005380', hname : '4현대차', price : "187500", change : "-1500", diff : "-0.79", volume : '663404', value : '797964', chdegree: "8.94", offerho: "188000", bidho : "187000", sign : '5'},
    { shcode: '005930', hname : '5삼성전자', price : "73000", change : "500", diff : "0.5", volume :'12306977', value : '498797498', chdegree: "1.65", offerho: "73500", bidho : "72500", sign : '2'},
    { shcode: '035720', hname : '5카카오', price : "372000", change : "-1500", diff : "-0.4", volume : '200265', value : '6876089', chdegree: "10.07", offerho: "373000", bidho : "375000", sign : '5'},
    { shcode: '005380', hname : '5현대차', price : "187500", change : "-1500", diff : "-0.79", volume : '663404', value : '797964', chdegree: "8.94", offerho: "188000", bidho : "187000", sign : '5'},
    { shcode: '005930', hname : '6삼성전자', price : "73000", change : "500", diff : "0.5", volume :'12306977', value : '498797498', chdegree: "1.65", offerho: "73500", bidho : "72500", sign : '2'},
    { shcode: '035720', hname : '6카카오', price : "372000", change : "-1500", diff : "-0.4", volume : '200265', value : '6876089', chdegree: "10.07", offerho: "373000", bidho : "375000", sign : '5'},
    { shcode: '005380', hname : '6현대차', price : "187500", change : "-1500", diff : "-0.79", volume : '663404', value : '797964', chdegree: "8.94", offerho: "188000", bidho : "187000", sign : '5'},
    { shcode: '005930', hname : '7삼성전자', price : "73000", change : "500", diff : "0.5", volume :'12306977', value : '498797498', chdegree: "1.65", offerho: "73500", bidho : "72500", sign : '2'},
    { shcode: '035720', hname : '7카카오', price : "372000", change : "-1500", diff : "-0.4", volume : '200265', value : '6876089', chdegree: "10.07", offerho: "373000", bidho : "375000", sign : '5'},
    { shcode: '005380', hname : '7현대차', price : "187500", change : "-1500", diff : "-0.79", volume : '663404', value : '797964', chdegree: "8.94", offerho: "188000", bidho : "187000", sign : '5'},
    { shcode: '005930', hname : '8삼성전자', price : "73000", change : "500", diff : "0.5", volume :'12306977', value : '498797498', chdegree: "1.65", offerho: "73500", bidho : "72500", sign : '2'},
    { shcode: '035720', hname : '8카카오', price : "372000", change : "-1500", diff : "-0.4", volume : '200265', value : '6876089', chdegree: "10.07", offerho: "373000", bidho : "375000", sign : '5'},
    { shcode: '005380', hname : '8현대차', price : "187500", change : "-1500", diff : "-0.79", volume : '663404', value : '797964', chdegree: "8.94", offerho: "188000", bidho : "187000", sign : '5'},
    { shcode: '005930', hname : '9삼성전자', price : "73000", change : "500", diff : "0.5", volume :'12306977', value : '498797498', chdegree: "1.65", offerho: "73500", bidho : "72500", sign : '2'},
    { shcode: '035720', hname : '9카카오', price : "372000", change : "-1500", diff : "-0.4", volume : '200265', value : '6876089', chdegree: "10.07", offerho: "373000", bidho : "375000", sign : '5'},
    { shcode: '005380', hname : '9현대차', price : "187500", change : "-1500", diff : "-0.79", volume : '663404', value : '797964', chdegree: "8.94", offerho: "188000", bidho : "187000", sign : '5'},
    { shcode: '005930', hname : '10삼성전자', price : "73000", change : "500", diff : "0.5", volume :'12306977', value : '498797498', chdegree: "1.65", offerho: "73500", bidho : "72500", sign : '2'},
    { shcode: '035720', hname : '10카카오', price : "372000", change : "-1500", diff : "-0.4", volume : '200265', value : '6876089', chdegree: "10.07", offerho: "373000", bidho : "375000", sign : '5'},
    { shcode: '005380', hname : '10현대차', price : "187500", change : "-1500", diff : "-0.79", volume : '663404', value : '797964', chdegree: "8.94", offerho: "188000", bidho : "187000", sign : '5'}
];


// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    // 화면 첫 생성 -> 현재가 데이터 요청 -> 현재가 데이터 수신 후 -> 외국인보유 데이터 요청
    grd_1.OnGetData(grdData);
    // grd_1.$html.css('overflow','hidden');
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
            htmlText = "<div style='font-weight:bold;" + fontColor + "'>" + putThousandsSeparators(ui.rowData.price) + "</div>";
            return {text : htmlText};
            break;
        // 2. 등락률
        case 'diff':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.diff) + "%</div>";
            return {text : htmlText};
            break;
        // 3.1 대비
        case 'change':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.change) + "</div>";
            return {text : htmlText};
            break;
        // 3.2 매도호가
        case 'offerho':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.offerho) + "</div>";
            return {text : htmlText};
            break;
        // 3.3 매수호가
        case 'bidho':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.bidho) + "</div>";
            return {text : htmlText};
            break;            
        default:
            // code
    }

};