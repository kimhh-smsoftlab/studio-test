// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    $('.hi5_formlink.wish').css('opacity','0');
    btn_4.OnClick();
    $('#'+me_1.id).css('border-bottom','1px solid #848484');
    $('.backWhite').css('border','1px solid #c2c2c2');
    $('#'+gb_1.id).css('border-bottom','1px solid #c2c2c2');
};



// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    $('.hi5_formlink.backWhite').hide();
    $('.hi5_formlink.first').css('filter','none');
    $('.hi5_groupbox.show').css('filter','none');
    $('.hi5_combo.comboSize').css('filter','none');
};

// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    $('.hi5_formlink.backWhite').hide();
    $('.hi5_formlink.first').css('filter','none');
    $('.hi5_groupbox.show').css('filter','none');
    $('.hi5_combo.comboSize').css('filter','none');
};

// [button:event ] OnClick  start...
btn_3.OnClick=function(){

    if($('button.clicking').text() == "맨 아래"){
        $('.tabtitle').last().after("<li class="+"tabtitle></li>");
        $('.tabheaderContainer.slideTab_header').attr('style','none');
        $('.tabtitle').attr('style','border-width:0px;width:40px');
        var txt_down = me_1.GetProp("value");
        $('.tabtitle').last().append("<div><span>"+txt_down+"</span></div>");
        $('.tabtitle').css('background-color','#ffffff');
        $('.tabtitle').css('color','#000000');
    }
    else if($('button.clicking').text() == "맨 위"){
        $('.tabtitle').first().before("<li class="+"tabtitle></li>");
        $('.tabheaderContainer.slideTab_header').attr('style','none');
        $('.tabtitle').attr('style','border-width:0px;width:40px');
        var txt_top = me_1.GetProp("value");
        $('.tabtitle').first().append("<div><span>"+txt_top+"</span></div>");
        $('.tabtitle').css('background-color','#ffffff');
        $('.tabtitle').css('color','#000000');
    }
    
    $('.hi5_formlink.backWhite').hide();
    $('.hi5_formlink.first').css('opacity','1.0');
    $('.hi5_formlink.wish').css('opacity','0');
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