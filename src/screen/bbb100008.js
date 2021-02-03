var btn_hide_state = true;// true -> 하단 숨김상태, false -> 하단 표시 상태

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    $('#'+btn_chart.id).addClass('border');
    grd_cred2.$html.hide();
    gb_sell.$html.hide();
    gb_daecha.$html.hide();
    $('.tabtitle').css('border','none');
    $('#'+gb_2.id).addClass('borderBtn');
    btn_cred.OnClick();
}

// [grid:event ] OnHeaderCellClick  start...
grd_cred1.OnHeaderCellClick=function(dataIndx, column){
    if(dataIndx == 'date'){
    //alert('클릭');
    grd_cred1.$html.hide();
    grd_cred2.$html.show();
    }
};
// [grid:event ] OnHeaderCellClick  start...
grd_cred2.OnHeaderCellClick=function(dataIndx, column){
    if(dataIndx == 'date'){
    grd_cred1.$html.show();
    grd_cred2.$html.hide();
    }
};

// [button:event ] OnClick  start...
btn_cred.OnClick=function(){
    $('#'+btn_sell.id).removeClass('clickik');
    $('#'+btn_deb.id).removeClass('clickik');
    $('#'+btn_cred.id).addClass('clickik');
    gb_cred.$html.show();
    gb_sell.$html.hide();
    gb_daecha.$html.hide();
    grd_cred1._gPQ.refreshDataAndView( );
    grd_cred2._gPQ.refreshDataAndView( );
};

// [button:event ] OnClick  start...
btn_sell.OnClick=function(){
    $('#'+btn_cred.id).removeClass('clickik');
    $('#'+btn_deb.id).removeClass('clickik');
    $('#'+btn_sell.id).addClass('clickik');
    gb_cred.$html.hide();
    gb_sell.$html.show();
    gb_daecha.$html.hide();
    grd_sell._gPQ.refreshDataAndView( );
};

// [button:event ] OnClick  start...
btn_deb.OnClick=function(){
    $('#'+btn_cred.id).removeClass('clickik');
    $('#'+btn_sell.id).removeClass('clickik');
    $('#'+btn_deb.id).addClass('clickik');
    gb_cred.$html.hide();
    gb_sell.$html.hide();
    gb_daecha.$html.show();
    grd_daecha._gPQ.refreshDataAndView( );
};

// [button:event ] OnClick  start...
btn_chart.OnClick=function(){
    
    //상단 테이블 토글
    tv_1.$html.toggleClass('disabled');
    
    if(btn_hide_state){
        $('#'+gb_2.id).removeClass('borderBtn');
        $('#'+gb_2.id).addClass('clickik');
        img_check.$html.show();
        img_uncheck.$html.hide();
        $('#'+grd_cred1.id).css('height','Calc(100% - 38%) !important');
        grd_cred1.SetStyle('top','150');
        grd_cred1.SetGridHeight(279);
        grd_cred2.SetStyle('top','150');
        grd_cred2.SetGridHeight(279);
        grd_sell.SetStyle('top','150');
        grd_sell.SetGridHeight(278);
        grd_daecha.SetStyle('top','150');
        grd_daecha.SetGridHeight(278);
        btn_hide_state = false;
    }else{
        $('#'+gb_2.id).addClass('borderBtn');
        $('#'+gb_2.id).removeClass('clickik');
        img_check.$html.hide();
        img_uncheck.$html.show();
        grd_cred1.SetStyle('top','0');
        grd_cred1.SetGridHeight(428);
        grd_cred2.SetStyle('top','0');
        grd_cred2.SetGridHeight(428);
        grd_sell.SetStyle('top','0');
        grd_sell.SetGridHeight(428);
        grd_daecha.SetStyle('top','0');
        grd_daecha.SetGridHeight(428);
        btn_hide_state = true;
    }
    grd_cred1._gPQ.refreshDataAndView( );
    grd_cred2._gPQ.refreshDataAndView( );
    grd_sell._gPQ.refreshDataAndView( );
    grd_daecha._gPQ.refreshDataAndView( );
    
    if($('.hi5_image').hasClass('unchecking')){
        $('.hi5_image').removeClass('unchecking');
        $('.hi5_image').addClass('checkingChart');
    }
    else if($('.hi5_image').hasClass('checkingChart')){
        $('.hi5_image').removeClass('checkingChart');
        $('.hi5_image').addClass('unchecking');
    }
};