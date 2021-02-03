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

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    grd_curr.OnGetData(currData);
    form.CommRequest('RQ_curData',0);
};