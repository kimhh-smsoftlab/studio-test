var btn_hide_state = false;// true -> 하단 숨김상태, false -> 하단 표시 상태

let data_cost = {
    eval_gl : '0', real_gl : '0', rate: '0.00%', pur_amt : '0', eval_amt : '0'
};

let data_all = {
    asset : '0'
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    Table_1.OnGetData(data_cost);
    //$('#'+Table_1.id).addClass('border');
};


// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    // 상단 테이블 토글
    Table_1.$html.toggleClass('disabled');
    // 버튼 이미지 토글
    btn_1.$html.toggleClass('show_box');
    
    if(btn_hide_state){
        grd_1.SetStyle('top','95');
        grd_1.SetGridHeight(365);
        btn_hide_state = false;
    }else{
        grd_1.SetStyle('top','0');
        grd_1.SetGridHeight(465);
        btn_hide_state = true;
    }
    grd_1._gPQ.refreshDataAndView( );
};

// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    Table_1.OnGetData(data_all);
};