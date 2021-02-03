// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    grd_all.OnGetData(dataAll);
    gb_all.$html.show();

    $('.tabtitle').css('border','none');
    $('#'+grd_all.id).css('border','none');
    $('#'+grd_all.id).addClass('pq-grid-row');

    
    $('.move').children().css('margin-bottom','3% !important');
    $('.move').parent().css('border','0.1px solid #c2c2c2');
    btn_all.OnClick();
}

// [grid:event ] OnCellClick  start...
grd_all.OnCellClick=function(rowData, rowIndx, dataIndx, colIndx){
    let openDialogObj = {
        type : 'screenLoad',//'tran'
        screen: 'bbb100005',
    }
    let convertString = JSON.stringify(openDialogObj);

    window.fromWeb2Native.postMessage(convertString);
};


// 모의 뉴스 데이터들
let dataAll = [
    { title: '삼성전자, 2023년까지 연간 배당 9조8천억원으로 상향', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "삼성전자"},
    { title: 'CU 매각 추진 실패', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: '검찰개혁 강조한 황운하 잠든채 발견', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: '환경부 장관 후보 사퇴 ', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: 'TSMC 파운드리 사업 철수', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "SK하이닉스"},
    { title: '[속보] 삼성전자 상장폐지', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "삼성전자"},
    { title: 'CU 매각 추진 실패', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: '검찰개혁 강조한 황운하 잠든채 발견', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: '환경부 장관 후보 사퇴 ', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: 'TSMC 파운드리 사업 철수', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "SK하이닉스"},
    { title: '검찰개혁 강조한 황운하 잠든채 발견', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: '환경부 장관 후보 사퇴 ', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: 'TSMC 파운드리 사업 철수', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "SK하이닉스"}
];

// [grid:event ] OnColumnRender  start...
grd_all.OnColumnRender=function(ui){
    let htmlText = 
    /*   타이틀   */  "<div><span style='font-weight:bold;font-size:16px;float:left;margin-left:10px;'>" + ui.rowData.title + "</span></br></div>"
    /*    날짜    */ +"<div><span style='font-size:13px;color:#c7c7c7;float:left;margin-left:10px;margin-right:20px;'>" + ui.rowData.date + "</span>"
    /*  관련종목  */ +"<span style='font-size:14px;color:#c7c7c7;float:left;margin-left:10px;'>" + ui.rowData.hname + "</span></div>";
    return {text : htmlText}; 
};

// 모의 뉴스 데이터들
let dataNews = [
    { title: '삼성전자, 2023년까지 연간 배당 9조8천억원으로 상향', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "삼성전자"},
    { title: 'CU 매각 추진 실패', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: '검찰개혁 강조한 황운하 잠든채 발견', date: " 2020/12/31 14:13", journal : "연합뉴스", },
    { title: '환경부 장관 후보 사퇴 ', date: " 2020/12/31 14:13", journal : "연합뉴스", },
    { title: 'TSMC 파운드리 사업 철수', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "SK하이닉스"},
    { title: '[속보] 삼성전자 상장폐지', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "삼성전자"},
    { title: 'CU 매각 추진 실패', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: '검찰개혁 강조한 황운하 잠든채 발견', date: " 2020/12/31 14:13", journal : "연합뉴스", },
    { title: '환경부 장관 후보 사퇴 ', date: " 2020/12/31 14:13", journal : "연합뉴스", },
    { title: 'TSMC 파운드리 사업 철수', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "SK하이닉스"}
];

// 모의 뉴스 데이터들
let dataGong = [
    { title: '삼성전자, 2023년까지 연간 배당 9조8천억원으로 상향', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "삼성전자"},
    { title: 'CU 매각 추진 실패', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: '검찰개혁 강조한 황운하 잠든채 발견', date: " 2020/12/31 14:13", journal : "연합뉴스", },
    { title: '환경부 장관 후보 사퇴 ', date: " 2020/12/31 14:13", journal : "연합뉴스", },
    { title: 'TSMC 파운드리 사업 철수', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "SK하이닉스"}
];

// 모의 뉴스 데이터들
let dataDart = [
    { title: '삼성전자, 2023년까지 연간 배당 9조8천억원으로 상향', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "삼성전자"},
    { title: 'CU 매각 추진 실패', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "BGF"},
    { title: '검찰개혁 강조한 황운하 잠든채 발견', date: " 2020/12/31 14:13", journal : "연합뉴스", },
    { title: '환경부 장관 후보 사퇴 ', date: " 2020/12/31 14:13", journal : "연합뉴스", },
    { title: 'TSMC 파운드리 사업 철수', date: " 2020/12/31 14:13", journal : "연합뉴스", hname: "SK하이닉스"}
];

// [button:event ] OnClick  start...
btn_all.OnClick=function(){
    $('#'+gb_1.id).find('.clickik').removeClass('clickik');
    $('#'+btn_all.id).addClass('clickik');
    
    grd_all.OnGetData(dataAll);
};
// [button:event ] OnClick  start...
btn_news.OnClick=function(){
    $('#'+gb_1.id).find('.clickik').removeClass('clickik');
    $('#'+btn_news.id).addClass('clickik');

    grd_all.OnGetData(dataNews);
};
// [button:event ] OnClick  start...
btn_post.OnClick=function(){
    $('#'+gb_1.id).find('.clickik').removeClass('clickik');
    $('#'+btn_post.id).addClass('clickik');

    grd_all.OnGetData(dataGong);
};
// [button:event ] OnClick  start...
btn_dart.OnClick=function(){
    $('#'+gb_1.id).find('.clickik').removeClass('clickik');
    $('#'+btn_dart.id).addClass('clickik');

    grd_all.OnGetData(dataDart);
};

// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    let openDialogObj = {
        type : 'screenLoad',//'tran'
        screen: 'bbb100005',
    }
    let convertString = JSON.stringify(openDialogObj);

    window.fromWeb2Native.postMessage(convertString);
};