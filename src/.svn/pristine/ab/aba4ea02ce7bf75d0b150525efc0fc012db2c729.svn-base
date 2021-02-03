// 모의 뉴스 데이터들
let dataObj = [
    { title: '[속보] 삼성전자 상장폐지', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "삼성전자"},
    { title: 'CU 매각 추진 실패', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: '검찰개혁 강조한 황운하 잠든채 발견', date: " 2020/12/31 14:13", journal : "연합뉴스", },
    { title: '환경부 장관 후보 사퇴 ', date: " 2020/12/31 14:13", journal : "연합뉴스", },
    { title: 'TSMC 파운드리 사업 철수', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "SK하이닉스"}
];

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    grd_1.OnGetData(dataObj);
};


// [grid:event ] OnColumnRender  start...
grd_1.OnColumnRender=function(ui){
    
    let htmlText = 
    /*   타이틀   */  "<div><span style='font-weight:bold;float:left;'>" + ui.rowData.title + "</span></div>"
    /*    날짜    */ +"<div><span style='font-size:10px;color:#ddd;float:left;'>" + ui.rowData.date + "</span>"
    /*   언론사   */ +"<span style='font-size:10px;color:#ddd;float:center;'>" + ui.rowData.journal + "</span>"
    /*  관련종목  */ +"<span style='font-size:10px;color:#ddd;float:right;'>" + ui.rowData.hname + "</span></div>";
    return {text : htmlText};
    
};