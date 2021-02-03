let data_gubun = {
    dep_bal : '0', dep_evi : '0', sub_bal : '0', sub_evi : '0'
};

let data_esti = {
    dep_d1 : '0', dep_d2 : '0', cal_d1 : '0', cal_d2 : '0', req_d1 : '0', req_d2 : '0',
    est_d1 : '0', est_d2 : '0'
};

let data_check = {
    amount : '0', reuse : '0', withdraw : '0'
};

let data_cash = {
    uncol : '0', rental : '0', unpaid : '0'
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    // 텍스트 오른쪽 정렬
    $('#'+Table_1.id).addClass('align');
    $('#'+Table_2.id).addClass('align');
    $('#'+Table_3.id).addClass('align');
    $('#'+Table_4.id).addClass('align');
    
    Table_1.OnGetData(data_gubun);
    Table_2.OnGetData(data_esti);
    Table_3.OnGetData(data_check);
    Table_4.OnGetData(data_cash);
};