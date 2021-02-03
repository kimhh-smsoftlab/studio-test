var gb_2_state = 0; // 0이면 안보임, 1이면 보임
var account_combo_state = 0;

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    debugger
    $('#'+formlink_1.id).css('height','Calc(100% - 40px)');
    $('.hi5_formlink.wish').css('opacity','0');
    $('#'+cb_1.id).addClass('btnChange');
    $("#"+cb_2.id+" option:eq(0)").prop("selected", true);
    $('#'+cb_2.id+" option:eq(0)").hide();
    $('#'+cb_2.id).css('transform','translateY(4px)');
    $('#'+gb_1.i).addClass('show');
    $('#'+cb_2.id).css('text-align-last','center');
    formlink_1.SetPage("bbb200001");
    formlink_5.SetPage("bbb200055");
    $('.hi5_formlink.wish .form .grid .pq-header-outer .pq-grid-row').css('background-color','rgb(245,245,245)');
   // $('.hi5_formlink.wish').css('opacity','0');
    
    //$('.hi5_formlink.proto').hide();
    $('.tabcontents').remove();
    
    formlink_2.$html.hide();
    formlink_3.$html.hide();
    formlink_5.$html.hide();
    
    switch(tab_1.currenttabid){
        case '0':
            gb_2.$html.hide();
            cb_1.$html.hide();
            break;
        case '1':
            gb_2.$html.hide();
            cb_1.$html.show();
            break;
        case '2':
            gb_2.$html.show();
            cb_1.$html.hide();
            break;
    }
};


// // [button:event ] OnClick  start...
// /*----- 스타일 변경 버튼 클릭 이벤트 -----*/
// btn_style.OnClick=function(){
//     var style = btn_style.GetProp('caption');
//     switch(style){
//         case "1": // 1 -> 2
//             formlink_1.SetPage("bbb200002");
//             btn_style.SetProp('caption',"2");
//             break;
//         case "2": // 2 -> 3
//             formlink_1.SetPage("bbb200003");
//             btn_style.SetProp('caption',"3");
            
//             // 계좌콤보 or 관심추가 -> 폭 좁히기
//             cb_1.SetStyle('width',"50%");
//             gb_2.SetStyle('width',"50%");
//             break;
//         case "3": // 3 -> 4
//             formlink_1.SetPage("bbb200004");
//             btn_style.SetProp('caption',"4");
            
//             // 계좌콤보 & 관심추가 폭 넓히기
//             cb_1.SetStyle('width',"100%");
//             gb_2.SetStyle('width',"100%");
//             break;
//         case "4": // 4 -> 1
//             formlink_1.SetPage("bbb200001");
//             btn_style.SetProp('caption',"1");
//             break;
//     }
// };

// [tab:event ] OnTabChanged  start...
/*----- 탭 변경 이벤트 -----*/
tab_1.OnTabChanged=function(nCurrentTab){
    debugger
    $('.tabtitle.clicked').addClass('clicked');
    // 그룹탭
    if($('.tabtitle.clicked').text() == "최근"){
        cb_1.$html.hide();
        formlink_1.SetPage('bbb200001');
    }
    else if($('.tabtitle.clicked').text() == "보유"){
        // 관심추가 숨김
        gb_2.$html.hide();
        cb_1.$html.show(); // 계좌콤보 보임
        formlink_1.SetPage('bbb200001');
    }
    else{
        // 관심추가 보임
        gb_2.$html.show();
        // 계좌콤보 숨김
        cb_1.$html.hide();
        formlink_1.SetPage('bbb200101');
    }
    // gb_2.$html.toggleClass('disabled');
    
    if($('.tabtitle.clicked').text() == "보유"){
        $('#'+formlink_1.id).css('height','Calc(100% - 72px)');
        $('.grid_sb_area').css('height','Calc(100% - 65px)');
    }
    else{
        $('#'+formlink_1.id).css('height','Calc(100% - 40px)');
        $('.grid_sb_area').css('height','Calc(100%)');
    }
    
};

//상단 combobox 클릭 시, 나머지 background 어둡게 처리하는 click evt
$('.remove_btn').on('click',function(){
    if($('.hi5_formlink.first').hasClass('bright') === false){
        $('.hi5_formlink.first').addClass('bright');
        $('.comboSize').addClass('bright');
    }
    else{
        $('.hi5_formlink.first').removeClass('bright');
        $('.comboSize').removeClass('bright');
        
    }
});
// [combo:event ] OnListSelChanged  start...
cb_2.OnListSelChanged=function(index, value, caption){
    if(index===1){
        formlink_2.$html.show();
        formlink_2.SetPage('bbb200005');
        $('.hi5_formlink.wish').css('opacity','0');
        $('#'+gb_1.id).css('filter','brightness(0.5)');
        $('#'+formlink_1.id).css('filter','brightness(0.5)');
        $('#'+cb_1.id).css('filter','brightness(0.5)');
        //form.OpenDialog('bbb200005','','bbb200005','scrollbar=false, width= 240px, height=320px');
        $('.hi5_mobile_popup_top').remove();
    }
    else if(index===2){
        $('.first').css('display','none');
        $('.hi5_formlink.wish').css('opacity','1.0');
        $('.hi5_formlink.proto').css('opacity','1.0');
        $('.Again').click();
        gb_1.$html.hide();
        cb_1.$html.hide();
        cb_2.$html.hide();
        btn_1.$html.hide();
        gb_2.$html.hide();
    }
     $("#"+cb_2.id+" option:eq(0)").prop("selected", true);
};
// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    formlink_3.$html.show();
    formlink_3.SetPage('bbb200006');
    $('.hi5_formlink.wish').css('opacity','0');
    $('#'+formlink_1.id).addClass('bright');
    $('#'+formlink_1.id).css('background-color','#c2c2c2');
    gb_1.$html.hide();
    $('#'+cb_1.id).addClass('bright');
};

// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    formlink_5.$html.show();
};