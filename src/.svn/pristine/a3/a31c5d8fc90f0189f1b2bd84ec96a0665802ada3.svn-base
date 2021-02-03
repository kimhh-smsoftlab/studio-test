// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    // 보유종목 라디오 체크에 따른 계좌 보이기 or 숨기기 설정
    setAccountBox(chk_2.GetCheck());
    $('#'+gb_2.id).css('background-color','#ffffff');
    // 탭 별 초기 화면 설정
    btn_3.OnClick();
    $('#'+btn_3.id).css('border-bottom','1px solid #000000');
    $('#'+btn_4.id).css('border-bottom','1px solid #000000');
    $('#'+gb_1.id).css('height','Calc(100% - 160px');
    $('#'+cb_1.id).css('text-align-last','left');
    $('#'+grd_2.id).css('height','Calc(100%)');
};
        
        
        
// [button:event ] OnClick  start...
btn_3.OnClick=function(){
    $('.clickik').removeClass('clickik');
    $('#'+btn_3.id).addClass('clickik');
    gb_1.$html.show();
    gb_4.$html.hide();
    grd_2.$html.hide();
    /*$('#'+grd_1.id).css('width','100%');
    $('#'+grd_1.id).css('height','380px'); */
    btn_add.SetProp('caption',"그룹추가");
    //$('#'+grd_1.id+' .pq-header-outer.ui-widget-header').css('display','block');
};

// [button:event ] OnClick  start...
btn_4.OnClick=function(){
    $('.clickik').removeClass('clickik');
    $('#'+btn_4.id).addClass('clickik');
    gb_1.$html.hide();
    gb_4.$html.show();
    grd_2.$html.show();
    /*$('.grid .pq-grid-title').css('display','block');
    $('#'+grd_2.id).css('width','100%');
    $('#'+grd_2.id).css('height','100%');*/
    //$('.pq-grid-top.ui-widget-header.ui-corner-top').css('display','block');
    btn_add.SetProp('caption',"업종/테마/순위 추가");
};


// [checkbox:event ] OnStateChanged  start...
chk_1.OnStateChanged=function(checkstate, value){
    setAccountBox_1(checkstate);
};



// [checkbox:event ] OnStateChanged  start...
chk_2.OnStateChanged=function(checkstate, value){
    // 보유종목 라디오 체크에 따른 계좌 보이기 or 숨기기 설정
    setAccountBox(checkstate);
};


// 보유종목 라디오 체크에 따른 계좌 보이기 or 숨기기 설정 함수
var setAccountBox= function ( bFlag ) {
    if(bFlag){// on, true
        gb_3.$html.show();
        grd_1.SetStyle('top','120px');
        grd_1.SetGridHeight(340);
        $('#'+chk_2.id).addClass('slide_on');
    }else{
        $('#'+chk_2.id).removeClass('slide_on');
        gb_3.$html.hide();
        grd_1.SetStyle('top','80px');
        grd_1.SetGridHeight(380);
        $('#'+chk_2.id).addClass('slide_off');
    }
    grd_1._gPQ.refreshDataAndView();
};

var setAccountBox_1= function ( bFlag ) {
    if(bFlag){// on, true
        $('#'+chk_1.id).addClass('slide_on');
    }else{
        $('#'+chk_1.id).removeClass('slide_on');
        $('#'+chk_1.id).addClass('slide_off');
    }
};