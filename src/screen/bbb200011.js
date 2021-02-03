// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    $('.clickee').removeClass('clickee');
    $('#'+btn_1.id).addClass('clickee');
    formlink_1.SetPage('bbb200012');
};

// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    $('.clickee').removeClass('clickee');
    $('#'+btn_2.id).addClass('clickee');
    formlink_1.SetPage('bbb200013');
};

// [button:event ] OnClick  start...
btn_3.OnClick=function(){
    $('.clickee').removeClass('clickee');
    $('#'+btn_3.id).addClass('clickee');
    formlink_1.SetPage('bbb200014');
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    btn_2.OnClick();
    formlink_1.SetPage('bbb200013');
    $('.hi5_formlink.wish .form .grid .pq-header-outer .pq-grid-row').css('background-color','rgb(245,245,245');
    $('#'+formlink_1.id).css('height','Calc(100% - 49px)');
};