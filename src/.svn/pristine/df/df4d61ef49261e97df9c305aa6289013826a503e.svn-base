var btn_hide_state = false;// true -> 하단 숨김상태, false -> 하단 표시 상태

let data_buy = {
    dep_d1 : '0', dep_d2 : '0', dep_d3 : '0', cal_d1 : '0', cal_d2 : '0', cal_d3 : '0',
    req_d1 : '0', req_d2 : '0', req_d3 : '0', est_d1 : '0', est_d2 : '0', est_d3 : '0'
};

let data_amount = {
    deposit : '0', withdraw : '0', net_dep : '0'
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    Table_trade.OnGetData(data_buy);
    Table_cost.OnGetData(data_amount);
    formlink_page.$html.hide();
    btn_back.$html.hide();
    btn_today.OnClick();
};


// [button:event ] OnClick  start...
btn_togg.OnClick=function(){
    // 상단 테이블 토글
    Table_cost.$html.toggleClass('disabled');
    // 버튼 이미지 토글
    btn_togg.$html.toggleClass('show_box');
    
    if(btn_hide_state){
        grd_sub.SetStyle('top','195');
        grd_sub.SetGridHeight(216);
        btn_hide_state = false;
        Table_trade.$html.show();
        Table_cost.$html.show();
    }else{
        grd_sub.SetStyle('top','5');
        grd_sub.SetGridHeight(405);
        btn_hide_state = true;
        Table_trade.$html.hide();
        Table_cost.$html.hide();
    }
    grd_sub._gPQ.refreshDataAndView( );
};

// [button:event ] OnClick  start...
btn_today.OnClick=function(){
    $('button.clickik').removeClass('clickik');
    cal_from.SetProp("value",cal_to.GetProp("value"));
    $('#'+btn_today.id).addClass('clickik');
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
// [button:event ] OnClick  start...
btn_searchIcon.OnClick=function(){
    gb_1.$html.hide();
    gb_2.$html.hide();
    gb_3.$html.hide();
    
    formlink_page.SetPage('bbb200040');
    formlink_page.$html.show();
    btn_back.$html.show();
};


// [button:event ] OnClick  start...
btn_search.OnClick=function(){
    gb_1.$html.hide();
    gb_2.$html.hide();
    gb_3.$html.hide();
    
    formlink_page.SetPage('bbb200040');
    formlink_page.$html.show();
    btn_back.$html.show();
};

// [button:event ] OnClick  start...
btn_back.OnClick=function(){
    gb_1.$html.show();
    gb_2.$html.show();
    gb_3.$html.show();
    
    formlink_page.$html.hide();
    btn_back.$html.hide();
};