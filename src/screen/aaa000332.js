let dataObj = [
    { jmcode: '005930', jmname : '삼성전자', price : "73000", daebi : "500", drate : "0.5", market: 'KOSPI', vol: '12306977' },
    { jmcode: '035720', jmname : '카카오', price : "372000", daebi : "-1500", drate : "-0.4", market: 'KOSPI', vol: '200265' },
    { jmcode: '005380', jmname : '현대차', price : "187500", daebi : "-1500", drate : "-0.79", market: 'KOSPI', vol: '663404' },
    { jmcode: '001105', jmname : '네이버', price : "80645", daebi : "2500", drate : "0.6", market: 'KOSPI', vol: '12306977' },
    { jmcode: '006576', jmname : '다음', price : "4057", daebi : "-4500", drate : "-0.3", market: 'KOSPI', vol: '200265' },
    { jmcode: '002455', jmname : '구글', price : "80005", daebi : "-500", drate : "-0.22", market: 'KOSPI', vol: '663404' }
];
tab_1.OnTabChanged=function(nCurrentTab){
    if (nCurrentTab == '2'){
        formlink_1.SetPage('aaa000330');
    } else if (nCurrentTab == '3'){
        formlink_1.SetPage('bbb100002');
    }
};