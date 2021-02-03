// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    formlink_2.$html.hide();
    btn_back.$html.hide();
};
    
// [label:event ] OnClick  start...
lb_search.OnClick=function(){
    gb_1.$html.hide();
    gb_2.$html.hide();
    formlink_2.$html.show();
    formlink_2.SetPage('bbb200040');
    btn_back.$html.show();
};

// [button:event ] OnClick  start...
btn_back.OnClick=function(){
    formlink_2.$html.hide();
    btn_back.$html.hide();
    gb_1.$html.show();
    gb_2.$html.show();
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