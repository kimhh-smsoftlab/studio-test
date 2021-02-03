debugger;
let dataObj = [
    { jmcode: '005930', jmname : '삼성전자', price : 73000, daebi : 500, drate : 0.5, market: 'KOSPI', vol: 12306977 },
    { jmcode: '035720', jmname : '카카오', price : 372000, daebi : -1500, drate : -0.4, market: 'KOSPI', vol: 200265 },
    { jmcode: '005380', jmname : '현대차', price : 187500, daebi : -1500, drate : -0.79, market: 'KOSPI', vol: 663404 },
    { jmcode: '285130', jmname : 'SK텔레콤', price : 368000, daebi : -8000, drate : -2.13, market: 'KOSPI', vol: 153243 },
    { jmcode: '051910', jmname : 'LG화학', price : 799000, daebi : 6000, drate : 0.76, market: 'KOSPI', vol: 183433 },
    { jmcode: '000660', jmname : 'SK하이닉스', price : 116000, daebi : -1000, drate : -0.85, market: 'KOSPI', vol: 1766356 },
    { jmcode: '068270', jmname : '셀트리온', price : 345500, daebi : -12000, drate : -3.36, market: 'KOSPI', vol: 1359851 },
    { jmcode: '005490', jmname : 'POSCO', price : 269500, daebi : -7000, drate : -2.53, market: 'KOSPI', vol: 232135 },
    { jmcode: '036570', jmname : '엔씨소프트', price : 873000, daebi : -11000, drate : -1.13, market: 'KOSPI', vol: 44260 },
    { jmcode: '105560', jmname : 'KB금융', price : 46100, daebi : -900, drate : -1.91, market: 'KOSPI', vol: 1020900 }
];

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    grd_1.OnGetData(dataObj);
};

// [grid:event ] OnColumnRender  start...
grd_1.OnColumnRender=function(ui){
    if(ui.dataIndx == "col2"){  // 두번째 컬럼 구성 2줄
        let htmlText = "<div style='font-weight:bold'>" + putThousandsSeparators(ui.rowData.price) + "</div><div style='font-size:12px'>" + putThousandsSeparators(ui.rowData.vol) + "</div>";
        return {text : htmlText};
    }
    else if(ui.dataIndx == "col3"){ // 세번째 컬럼 구성 2줄
        let htmlText = "<div style='font-weight:bold'>" + putThousandsSeparators(ui.rowData.daebi) + "</div><div>" + ui.rowData.drate + "%"+"</div>";
        return {text : htmlText};
    }
};