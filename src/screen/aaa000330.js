let dataObj = [
    { jmcode: '005930', jmname : '삼성전자', price : "73000", daebi : "500", drate : "0.5", market: 'KOSPI', vol: '12306977' },
    { jmcode: '035720', jmname : '카카오', price : "372000", daebi : "-1500", drate : "-0.4", market: 'KOSPI', vol: '200265' },
    { jmcode: '005380', jmname : '현대차', price : "187500", daebi : "-1500", drate : "-0.79", market: 'KOSPI', vol: '663404' },
    { jmcode: '001105', jmname : '네이버', price : "80645", daebi : "2500", drate : "0.6", market: 'KOSPI', vol: '12306977' },
    { jmcode: '006576', jmname : '다음', price : "4057", daebi : "-4500", drate : "-0.3", market: 'KOSPI', vol: '200265' },
    { jmcode: '002455', jmname : '구글', price : "80005", daebi : "-500", drate : "-0.22", market: 'KOSPI', vol: '663404' },
    { jmcode: '005380', jmname : '현대차', price : "187500", daebi : "-1500", drate : "-0.79", market: 'KOSPI', vol: '663404' },
    { jmcode: '001105', jmname : '네이버', price : "80645", daebi : "2500", drate : "0.6", market: 'KOSPI', vol: '12306977' },
    { jmcode: '006576', jmname : '다음', price : "4057", daebi : "-4500", drate : "-0.3", market: 'KOSPI', vol: '200265' },
    { jmcode: '002455', jmname : '구글', price : "80005", daebi : "-500", drate : "-0.22", market: 'KOSPI', vol: '663404' }
];
// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    grd_1.OnGetData(dataObj);
}

// [grid:event ] OnColumnRender  start...
grd_1.OnColumnRender=function(ui){
    if(ui.dataIndx == "col1"){  // 첫번째 컬럼 구성 2줄
        let htmlText = "<div style='font-weight:bold'>" + putThousandsSeparators(ui.rowData.price) + "</div><div><span style='font-size:10px;color:#ddd;float:left;'>" + putThousandsSeparators(ui.rowData.market) + "</span><span style='font-size:10px;color:#ddd;float:right;'>" + ui.rowData.jmcode + "</span></div>";
        return {text : htmlText};
    }
    else if(ui.dataIndx == "col2"){ // 2번째 컬럼 구성 2줄
        let htmlText = "<div>" + putThousandsSeparators(ui.rowData.drate) + "</div><div style='font-size:11px;'>" + putThousandsSeparators(ui.rowData.vol) + "</div>";
        return {text : htmlText};
    }
    else if(ui.dataIndx == "col3"){ // 3번째 컬럼 구성 2줄
        let htmlText = "<div>" + putThousandsSeparators(ui.rowData.daebi) + "</div><div><span style='font-size:11px;'>" + putThousandsSeparators(ui.rowData.vol) + "</span></div>";
        return {text : htmlText};
    }
};