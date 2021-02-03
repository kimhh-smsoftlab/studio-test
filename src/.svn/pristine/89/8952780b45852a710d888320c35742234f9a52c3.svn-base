// // (임시)관심종목 코드 목록
// let currData = [
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
//     { shcode: '976468'},
//     { shcode: '976468'},
//     { shcode: '976468'},
//     { shcode: '976468'},
//     { shcode: '976468'},
//     { shcode: '976468'}
// ];

// // [form:event ] OnFormInit  start...
// form.OnFormInit=function(tagName, objData){
//     // 멀티 현재가
//     form.CommRequest("RQCurrent");
// };

// [form:event ] OnCommSendDataAfter  start...
form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal){
    // 1. 멀티 현재가 TR 요청일 때
    if(strRQName == "RQCurrent"){
        // 1. nrec 세팅
        objCommInput.InRec1.nrec = currData.length;
        
        // 2. shcode 세팅
        // 구분자 없이 종목코드를 붙여서 입력
        // 078020, 000660, 005930 -> 078020000660005930
        var data="";
        // 3. 종목데이터에서 종목코드만 찾아서 붙이기 (최대 50개!!!)
        for(var i = 0; i < currData.length; i++){
            data += currData[i]["shcode"];
        }
        // 4. 종목코드 세팅!!
        objCommInput.InRec1.shcode = data;
        
        alert("레코드 수: " + objCommInput.InRec1.nrec + ",shcode: " + objCommInput.InRec1.shcode);
    }
    // 2. 호가 TR 요청일 때
    else if(strRQName == "RQHoga"){
        // 1. shcode 세팅
        objCommInput.InRec1.shcode = currData[nPreNext]['shcode'];
        
        alert("호가 요청 종목: " + objCommInput.InRec1.shcode);
    }
    else if(strRQName == "RQWeek"){
        // 1. shcode 세팅 -> 
        objCommInput.InRec1.shcode = currData[nPreNext]['shcode'];
        
        // 2. 일,주,월 구분 -> 1: 일, 2: 주, 3: 월
        objCommInput.InRec1.dwncode = "1"
        
        // 3. 기준(시작)날짜 설정 -> 오늘 날짜로!!
        var curr_date = new Date().toISOString().substr(0, 10).replace('T', ' ').replaceAll('-', '');
        // alert(curr_date);
        objCommInput.InRec1.date = curr_date;
        
        // 4. 인덱스 -> 사용 안함!!
        // objCommInput.InRec1.idx = ""
        
        // 5. 조회 할 날짜 수 설정 -> 현재 화면에서는 7일로 고정
        objCommInput.InRec1.cnt = "7"
        
        // alert("기간별 요청 종목: " + objCommInput.InRec1.shcode);
    }
};


// 우측 현재가 그리드 (grd_curr) 셀 클릭 이벤트
grd_curr.OnCellClick=function(rowData, rowIndx, dataIndx, colIndx){
    // 좌측에서 클릭한 종목으로 우측 화면 데이터 요청해 갱신해야됨!!
    // 1. 클릭한 셀의 종목코드 가져오기
    var code = currData[rowIndx]['shcode'];
    alert("종목코드: " + code + ", 인덱스: " + rowIndx);
    // 2. 해당 종목코드 인덱스로 "호가" TR 요청하기
    form.CommRequest("RQHoga",rowIndx); // rowIndx : 종목코드 위치(index)
    
    // 3. 해당 종목코드 인덱스로 "기간별" TR 요청하기
    form.CommRequest("RQWeek",rowIndx); // rowIndx : 종목코드 위치(index)
    
};


/* ---------- 모의 데이터로 화면 표현 ----------*/

// 좌측 현재가 데이터
let currData = [
    { shcode: '005930', hname : '삼성전자', price : "73000", change : "500", diff : "0.5", open : "5500", high : "5800", low : "5300", volume: '12306977' , amount: '5332', sign : '2'},
    { shcode: '035720', hname : '카카오', price : "372000", change : "-1500", diff : "-0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '5'},
    { shcode: '048549', hname : '현대차', price : "187500", change : "-1500", diff : "-0.79", open : "5500", high : "5800", low : "5300", volume: '663404' , amount: '1125', sign : '5'},
    { shcode: '165468', hname : 'KTB', price : "4840", change : "-1500", diff : "-0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '5'},
    { shcode: '168468', hname : 'NHN', price : "156460", change : "-1500", diff : "-0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '5'},
    { shcode: '464874', hname : '한화', price : "26042", change : "-1500", diff : "-0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '5'},
    { shcode: '164984', hname : '파티게임즈', price : "1204", change : "-1500", diff : "-0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '5'},
    { shcode: '321975', hname : 'HABBY', price : "3265", change : "1500", diff : "0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '2'},
    { shcode: '794635', hname : 'MSSoft', price : "120849", change : "-1500", diff : "-0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '5'},
    { shcode: '098749', hname : 'Apple', price : "415600", change : "1500", diff : "0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '2'},
    { shcode: '976468', hname : 'Marvel', price : "49876", change : "-1500", diff : "-0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '2'},
    { shcode: '976468', hname : 'Marvel', price : "49876", change : "-1500", diff : "-0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '5'},
    { shcode: '976468', hname : 'Marvel', price : "49876", change : "-1500", diff : "-0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '5'},
    { shcode: '976468', hname : 'Marvel', price : "49876", change : "1500", diff : "0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '2'},
    { shcode: '976468', hname : 'Marvel', price : "49876", change : "-1500", diff : "-0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '5'},
    { shcode: '976468', hname : 'Marvel', price : "49876", change : "1500", diff : "0.4", open : "5500", high : "5800", low : "5300", volume: '200265' , amount: '534', sign : '2'},
];

// 우측상단 호가 데이터
let hogaData = [
    { offerho1 : '4600', offerho2 : '4650', offerho3 : '4700', offerrem1 : '209', offerrem2 : '1016', offerrem3 : '1107', 
    bidho1 : '4550', bidho2 : '4500', bidho3 : '4450', bidrem1 : '80', bidrem2 : '2500', bidrem3 : '3000' }
];

// 우측하단 기간별 데이터
let dateData = [
    { date : '20201230', close : '31950', sign : '5'},
    { date : '20201229', close : '32000', sign : '5'},
    { date : '20201228', close : '32250', sign : '2'},
    { date : '20201227', close : '31650', sign : '2'},
    { date : '20201226', close : '31450', sign : '5'},
    { date : '20201225', close : '31600', sign : '5'},
    { date : '20201224', close : '32050', sign : '5'}
];

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    grd_curr.OnGetData(currData);
    table_before.OnGetData(currData);
    grd_date.OnGetData(dateData);
    hoga_1.OnGetData(hogaData); // 호가는 임의데이터로 세팅 시 리얼 처리중 죽으므로 맨 마지막..!!!
};




// /*---------- 데이터 랜더링 ----------*/

// 1. 좌측 현재가 그리드
grd_curr.OnColumnRender=function(ui){
    var fontColor = "";
    if (ui.rowData.sign == "5"){
        fontColor = "color:blue;"
    }else if (ui.rowData.sign == "2"){
        fontColor = "color:red;"
    }else{
        fontColor = "color:black;"
    }
    
    if(ui.dataIndx == "row1"){  // 컬럼 구성 : 3줄
        let htmlText = 
        /*   종목명   */  "<div style='font-weight:bold;'>" + ui.rowData.hname + "</div>"
        /*    가격    */ +"<div><span style='font-size:12px;float:left;" + fontColor + "'>" + putThousandsSeparators(ui.rowData.price) + "</span>"
        /*  전일대비  */ +"<span style='font-size:10px;float:right;" + fontColor + "'>" + putThousandsSeparators(ui.rowData.change) + "</span></br></div>" // br 태그 추가로 밑에는 3번째 줄!!
        /* 누적거래량 */ +"<div><span style='font-size:10px;color:#ddd;float:left;color:black;'>" + putThousandsSeparators(ui.rowData.volume) + "</span>"
        /*   등락률   */ +"<span style='font-size:10px;float:right;" + fontColor + "'>" + ui.rowData.diff + "%</span></div>";
        return {text : htmlText};
    }
};

// 2. 우측 중간 시고저 테이블
// [table:event ] OnColumnRender  start...
table_before.OnColumnRender=function($TD, item, value, objDatas){
	// 컬럼별 색깔 구분 기준 확인 후 적용 필요!!
};


// 3. 우측하단 날짜별 종가 그리드 (grd_date) 렌더링
grd_date.OnColumnRender=function(ui){
    var fontColor = "";
    if (ui.rowData.sign == "5"){
        fontColor = "color:blue;"
    }else if (ui.rowData.sign == "2"){
        fontColor = "color:red;"
    }else{
        fontColor = "color:black;"
    }

    if(ui.dataIndx == "close"){ 
        let htmlText = "<div style='" + fontColor + "'>" + ui.rowData.close + "</span></div>";
        return {text : htmlText};
    }
};

/*---------- 데이터 랜더링 끝----------*/