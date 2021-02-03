// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    $('button.clicking').removeClass('clicking');
    $('#'+me_1.id).css('border-bottom','1px solid #848484');
    $('#'+btn_4.id).addClass('clicking');
    $('#'+gb_1.id).css('border-bottom','1px solid #c2c2c2');
    $('.baseLine').css('border','1px solid #c2c2c2');
};

// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    $('.hi5_formlink.baseLine').hide();
    $('.hi5_formlink').css('opacity','1.0');
};

// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    $('.hi5_formlink.baseLine').hide();
    $('.hi5_formlink').css('opacity','1.0');
};

// [button:event ] OnClick  start...
btn_3.OnClick=function(){
    $('.hi5_formlink.baseLine').hide();
    $('.hi5_formlink').css('opacity','1.0');
};

// [button:event ] OnClick  start...
btn_4.OnClick=function(){
    $('button.clicking').removeClass('clicking');
    $('#'+btn_4.id).addClass('clicking');
};

// [button:event ] OnClick  start...
btn_5.OnClick=function(){
    $('button.clicking').removeClass('clicking');
    $('#'+btn_5.id).addClass('clicking');
};