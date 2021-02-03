let data_gubun = {
    dep_bal : '0', dep_evi : '0', sub_bal : '0', sub_evi : '0',  dep_d1 : '0', dep_d2 : '0', cal_d1 : '0', cal_d2 : '0', req_d1 : '0', req_d2 : '0',
    est_d1 : '0', est_d2 : '0', amount : '0', reuse : '0', withdraw : '0', uncol : '0', 
    rental : '0', unpaid : '0'
};

// [tab:event ] OnTabChanged  start...
tab_2.OnTabChanged=function(nCurrentTab){
    switch (nCurrentTab) {
        case '0': // 잔고 탭일 때
            Table_2.$html.hide();
            gb_1.$html.show();
            grd_2.$html.show();
            chk_1.OnStateChanged(false);
            $('input[type="checkbox"]').prop('checked',false);
            break;
        case '1': // 예수금 탭일 때
            Table_2.$html.show();
            gb_1.$html.hide();
            grd_2.$html.hide();
            // code
            break;
        
        default:
            // code
    }
};


// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    // 텍스트 오른쪽 정렬
    $('#'+Table_2.id).addClass('align');
    Table_2.$html.hide();
    gb_1.$html.show();
    Table_2.OnGetData(data_gubun);
    chk_1.OnStateChanged(false);
    grd_2._gPQ.refreshDataAndView();
    $('#'+Table_2.id).css('padding','5px 5px 5px 5px');
    $('#'+lb_1.id).css('border-bottom','1px solid #c2c2c2');
    $('#'+chk_1.id).css('cursor','pointer');
};

// [checkbox:event ] OnStateChanged  start...
chk_1.OnStateChanged=function(checkstate, value){
    if(checkstate === true){
        $('#'+btn_10.id).attr('disabled',false);
    }
    else if(checkstate === false){
        $('#'+btn_10.id).attr('disabled',true);
    }
};

// [button:event ] OnClick  start...
btn_11.OnClick=function(){
    $('.hi5_formlink.subform').hide();
    $('.hi5_formlink.firstform').show();
    $('.hi5_groupbox.mainGroup').css('filter','none');
};

// [button:event ] OnClick  start...
btn_10.OnClick=function(){
    $('.hi5_formlink.subform').css('filter','brightness(0.5)');
    $('.hi5_formlink.popUp').show();
    $('.hi5_formlink.popUp').css('background-color','#ffffff');
};