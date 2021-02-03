$('#'+Table_cost.id).css('border','1px solid #c2c2c2');var btn_hide_state = false;// true -> 하단 숨김상태, false -> 하단 표시 상태

let dataObj={
    invest_prof_loss:'0', invest_prin:'0', deposit_price:'0', drate_prof:'0.00%', withdrawal_price:'0'
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    Table_cost.OnGetData(dataObj);
};


// [button:event ] OnClick  start...
btn_togg.OnClick=function(){
    // 상단 테이블 토글
    Table_cost.$html.toggleClass('disabled');
    // 버튼 이미지 토글
    btn_togg.$html.toggleClass('show_box');
        
    if(btn_hide_state){ // 보이도록 만들기!!
        // 그리드 위치(top) 아래로 ㄱㄱ
        grd_date.SetStyle('top','130');
        // 그리드 높이(height) 줄이기
        grd_date.SetGridHeight(320);
        // 버튼 상태 토글
        btn_hide_state = false;
        Table_cost.$html.show();
    }else{// 안보이도록 만들기!!
        // 그리드 위치(top) 위로 ㄱㄱ
        grd_date.SetStyle('top','45');
        // 그리드 높이(height) 늘이기
        grd_date.SetGridHeight(405);
        // 버튼 상태 토글
        btn_hide_state = true;
        Table_cost.$html.hide();   
    }
    grd_date._gPQ.refreshDataAndView( );
    // grd_date._gPQ.refreshDataAndView( { sort: false } );
};


// [button:event ] OnClick  start...
btn_day.OnClick=function(){
    $('button.clickik').removeClass('clickik');
    cal_from.SetProp("value",cal_to.GetProp("value"));
    $('#'+btn_day.id).addClass('clickik');
};

// [button:event ] OnClick  start...
btn_week.OnClick=function(){
    $('button.clickik').removeClass('clickik');
    var date_day = new Date();
    date_day.setDate(date_day.getDate()-7);
    var target_day = date_day.toISOString().substr(0,10);
    target_day = target_day.removeAll('-','');
    cal_from.SetProp("value",target_day);
    $('#'+btn_week.id).addClass('clickik');
};

// [button:event ] OnClick  start...
btn_month.OnClick=function(){
    $('button.clickik').removeClass('clickik');
    var date_month = new Date();
    date_month.setMonth(date_month.getMonth()-1);
    var target_month = date_month.toISOString().substr(0,10);
    target_month = target_month.removeAll('-','');
    cal_from.SetProp("value",target_month);
    $('#'+btn_month.id).addClass('clickik');
};