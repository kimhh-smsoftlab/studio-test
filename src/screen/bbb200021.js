var left_box_state = 0; // gb_rest(체결), gb_rest(잔량) 번갈아 표현 할 플래그
var check_state = true;

// [table:event ] OnCellClick  start...
Table_1.OnCellClick=function(nRow, nCol, item, value){
    $('.event').removeClass('event');
    
    $(event.target).addClass('event');
    debugger
    $('#'+spn_price1.id+' .spinBoxText').first().children().text(event.target.textContent);
    debugger
};

// [table:event ] OnColumnRender  start...
Table_1.OnColumnRender=function($TD, item, value, objDatas){
    for(item = 500; item<=519; item++){
         debugger
	    if((value<1011) === true && ($TD.parent().next().children().first().children().length === 0) === true){
	        if(value === "1001"){
	            break;
	        }
			$TD.parent().next().children().first().append('<td style="height:4.000%;font-size:10px;background-color:#D0E7FA;display:block;font-weight:normal;">-3.7</td>');
	    break;
	    }
	    else if((value<1011) === false && ($TD.parent().next().children().first().children().length === 0) === true && (value<=2020)===true){
	        if(value === "1011"){
	            break;
	        }
	        else 
	        if(1011 < value <=1020){
			    $TD.parent().prev().children().first().append('<td style="height:4.000%;font-size:10px;background-color:#FCE2E3;display:block;font-weight:normal;">-3.7</td>');
	            break;}
	   }
        else{
            //return;
            break;
        }
     }
};



// [button:event ] OnClick  start...
btn_title1.OnClick=function(){
    $('#'+btn_title2.id).removeClass('clickedsell');
    $('#'+btn_title3.id).removeClass('clickedcancel');
    $('#'+btn_title1.id).addClass('clickedbuy');
    gb_buy.$html.show();
    gb_sell.$html.hide();
    gb_change.$html.hide();
    btn_misu.$html.show();
    cb_misu.$html.hide();
    btn_cash.$html.show();
    cb_cash.$html.hide();
    $('#'+cb_1.id).removeClass('remove_btn');
};
// [button:event ] OnClick  start...
btn_title2.OnClick=function(){
    $('#'+btn_title1.id).removeClass('clickedbuy');
    $('#'+btn_title3.id).removeClass('clickedcancel');
    $('#'+btn_title2.id).addClass('clickedsell');
    gb_buy.$html.hide();
    gb_sell.$html.show();
    gb_change.$html.hide();
};
// [button:event ] OnClick  start...
btn_title3.OnClick=function(){
    $('#'+btn_title1.id).removeClass('clickedbuy');
    $('#'+btn_title2.id).removeClass('clickedsell');
    $('#'+btn_title3.id).addClass('clickedcancel');
    gb_buy.$html.hide();
    gb_sell.$html.hide();
    gb_change.$html.show();
};


// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    if(left_box_state){ // 체결일 때
        btn_1.SetProp('caption',"잔량");
        left_box_state -= 1;
        
        gb_rest.$html.show();
        gb_che.$html.hide();
    }else{
        btn_1.SetProp('caption',"체결");
        left_box_state += 1;
        
        gb_rest.$html.hide();
        gb_che.$html.show();
    }
    btn_1.$html.toggleClass('order_che');
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    // 우측 그룹박스 내부 visibility 설정
    // 1. 매수 박스 세팅
    // 현금가능, 미수가능 콤보박스 숨기기
    cb_cash.$html.hide();
    cb_misu.$html.hide();
    
    // 2. 매도 박스 세팅
    // 라디오버튼 : 현금 -> 계좌 X, 달력 X
    cb_account.$html.hide(); // 계좌 X
    gb_calendar.$html.hide();// 달력 X
    
    
    // 마지막!!
    // 좌측 그룹박스 & 그리드 visibility 설정
    grd_che.OnGetData(dataObj);
    gb_che.$html.hide();
    
    // 매수 박스만 보이게 설정
    gb_buy.$html.show();
    gb_sell.$html.hide();
    gb_change.$html.hide();

    // 호가 -> 중앙으로 스크롤 
    //  => ( 호가높이 - 그룹박스 높이 ) / 2 만큼 스크롤
    // 호가 높이
    var tHeight = Table_1.GetStyle('height'); // btn_title318px -> px 안잘라도 됨..
    // 그룹박스 높이
    var gHeight = gb_rest.GetStyle('height'); // 399px
    // 스크롤 범위
    var middle = ( parseInt(tHeight) - parseInt(gHeight) ) / 2; // => 154
    // "그룹박스" 스크롤
    gb_rest.$html.scrollTop(middle);
    
    
    $('#'+spn_price1.id+' .spinBoxText').css('background-color','rgb(254,251,229)');
    $('#'+spn_price2.id+' .spinBoxText').css('background-color','rgb(254,251,229)');
    $('#'+spn_qty3.id+' .spinBoxText').css('background-color','rgb(254,251,229)');
    
    st_1.SetProp('caption','11:05:00');
    Table_1.OnGetData(hoData);
    Table_1.OnGetData(dataObj);
    $('#'+Table_1.id).addClass('align');
    
    $('#'+gb_9.id).addClass('border');
    $('#'+gb_10.id).addClass('border');
    
    btn_all.OnClick();
    sell_cash.OnClick();
    btn_title1.OnClick();
    buy_cash.OnClick();
    
    //정정
    
};

// 매도
// [button:event ] OnClick  start...
sell_cash.OnClick=function(){
    $('#'+sell_cred.id).removeClass('clickik');
    $('#'+sell_loan.id).removeClass('clickik');
    $('#'+sell_sub.id).removeClass('clickik');
    $('#'+sell_cash.id).addClass('clickik');
    cb_account.$html.hide(); // 계좌 X
    gb_calendar.$html.hide();// 달력 X
    btn_sell.SetProp('caption','현금매도');
};

// [button:event ] OnClick  start...
sell_cred.OnClick=function(){
    $('#'+sell_cash.id).removeClass('clickik');
    $('#'+sell_loan.id).removeClass('clickik');
    $('#'+sell_sub.id).removeClass('clickik');
    $('#'+sell_cred.id).addClass('clickik');
    cb_account.$html.hide(); // 계좌 X
    gb_calendar.$html.show();// 달력 O
    btn_sell.SetProp('caption','신용매도');
};
// [button:event ] OnClick  start...
sell_loan.OnClick=function(){
    $('#'+sell_cash.id).removeClass('clickik');
    $('#'+sell_cred.id).removeClass('clickik');
    $('#'+sell_sub.id).removeClass('clickik');
    $('#'+sell_loan.id).addClass('clickik');
    cb_account.$html.hide(); // 계좌 X
    gb_calendar.$html.show();// 달력 O
    btn_sell.SetProp('caption','대출매도');
};
// [button:event ] OnClick  start...
sell_sub.OnClick=function(){
    $('#'+sell_cash.id).removeClass('clickik');
    $('#'+sell_cred.id).removeClass('clickik');
    $('#'+sell_loan.id).removeClass('clickik');
    $('#'+sell_sub.id).addClass('clickik');
    cb_account.$html.show(); // 계좌 O
    gb_calendar.$html.hide();// 달력 X
    btn_sell.SetProp('caption','대용매도');
};
// [button:event ] OnClick  start...
btn_6.OnClick=function(){
    $('#'+btn_7.id).removeClass('clickik');
    $('#'+btn_6.id).addClass('clickik');
};
// [button:event ] OnClick  start...
btn_7.OnClick=function(){
    $('#'+btn_6.id).removeClass('clickik');
    $('#'+btn_7.id).addClass('clickik');
};
// [image:event ] OnClick  start...
img_sellinit.OnClick=function(){
    cb_poss.$html.hide();
    btn_poss.$html.show();
};

// [button:event ] OnClick  start...
btn_rest.OnClick=function(){
    $('.hi5_formlink.firstform').hide();
    $('.hi5_formlink.subform').show();
    $('#'+gb_1.id).css('opacity','0.3');
};



// <정정>
// 전량
// [button:event ] OnClick  start...
btn_all.OnClick=function(){
    if(check_state){
        $('#'+gb_8.id).removeClass('borderBtn');
        $('#'+gb_8.id).addClass('clickik');
        img_check.$html.show();
        img_uncheck.$html.hide();
        spn_qty1.SetProp('disabled','true');
        
        var a = $('div[disabled="disabled"]').first().children();
        a.first().attr('style','display: block');
        a.first().next().attr('style','display: block');

        check_state = false;
    } else {
        $('#'+gb_8.id).addClass('borderBtn');
        $('#'+gb_8.id).removeClass('clickik');
        img_check.$html.hide();
        img_uncheck.$html.show();
        spn_qty1.SetProp('disabled','false');
        check_state = true;
    }
};
// 시장가
// [button:event ] OnClick  start...
btn_mprice.OnClick=function(){
    $('#'+btn_sprice.id).removeClass('clickik');
    $('#'+btn_mprice.id).addClass('clickik');
};
// 단일가
// [button:event ] OnClick  start...
btn_sprice.OnClick=function(){
    $('#'+btn_mprice.id).removeClass('clickik');
    $('#'+btn_sprice.id).addClass('clickik');
};
// 초기화버튼
// [image:event ] OnClick  start...
img_corinit.OnClick=function(){
    $('#'+btn_mprice.id).removeClass('clickik');
    $('#'+btn_sprice.id).removeClass('clickik');
    check_state = true;
    btn_all.OnClick();
};




// <매수>
// [button:event ] OnClick  start...
buy_cash.OnClick=function(){
    $('#'+buy_cred.id).removeClass('clickik');
    $('#'+buy_cash.id).addClass('clickik');
    btn_buy.SetProp('caption','현금매수');
};
// [button:event ] OnClick  start...
buy_cred.OnClick=function(){
    $('#'+buy_cash.id).removeClass('clickik');
    $('#'+buy_cred.id).addClass('clickik');
    btn_buy.SetProp('caption','신용매수');
};
// [image:event ] OnClick  start...
img_buyinit.OnClick=function(){
    cb_cash.$html.hide();
    cb_misu.$html.hide();
    btn_cash.$html.show();
    btn_misu.$html.show();
};

// [combo:event ] OnListSelChanged  start...
cb_1.OnListSelChanged=function(index, value, caption){
    $('#'+cb_1.id).addClass('remove_btn');
};
// [spin:event ] OnSpinChange  start...
spn_qty.OnSpinChange=function(){
    lb_2.SetProp('caption','3,870');
};





// [button:event ] OnClick  start...
// 현금가능 버튼 클릭 이벤트
btn_cash.OnClick=function(){
    // 미수가능 버튼 보임
    btn_misu.$html.show();
    // 현금가능 버튼 가림
    btn_cash.$html.hide();
    
    // 현금최대 콤보 보임
    cb_cash.$html.show();
    // 미수가능 콤보 가림
    cb_misu.$html.hide();
};

// [button:event ] OnClick  start...
// 미수가능 버튼 클릭 이벤트
btn_misu.OnClick=function(){
    // 미수가능 버튼 가림
    btn_misu.$html.hide();
    // 현금가능 버튼 보임
    btn_cash.$html.show();
    
    // 현금최대 콤보 가림
    cb_cash.$html.hide();
    // 미수가능 콤보 보임
    cb_misu.$html.show();
};

// [button:event ] OnClick  start...
btn_poss.OnClick=function(){
    btn_poss.$html.hide();
    cb_poss.$html.show();
};

// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    $('#'+btn_3.id).removeClass('clickik');
    $('#'+btn_2.id).addClass('clickik');
};
// [button:event ] OnClick  start...
btn_3.OnClick=function(){
    $('#'+btn_2.id).removeClass('clickik');
    $('#'+btn_3.id).addClass('clickik');
};


let dataObj = [
    { che_rate : "1.15", che_price : "4505", che_stren : "3"},
    { che_rate : "1.15", che_price : "4505", che_stren : "6"},
    { che_rate : "1.15", che_price : "4510", che_stren : "13"},
    { che_rate : "1.15", che_price : "4505", che_stren : "12"},
    { che_rate : "1.15", che_price : "4505", che_stren : "54"},
    { che_rate : "1.15", che_price : "4510", che_stren : "5"},
    { che_rate : "1.15", che_price : "4510", che_stren : "13"},
    { che_rate : "1.15", che_price : "4505", che_stren : "64"},
    { che_rate : "1.15", che_price : "4505", che_stren : "86"},
    { che_rate : "1.15", che_price : "4505", che_stren : "614"},
    { che_rate : "1.15", che_price : "4510", che_stren : "156"},
    { che_rate : "1.15", che_price : "4505", che_stren : "12"},
    { che_rate : "1.15", che_price : "4510", che_stren : "4"},
    { che_rate : "1.15", che_price : "4505", che_stren : "9"},
    { che_rate : "1.15", che_price : "4505", che_stren : "8"},
    { che_rate : "1.15", che_price : "4505", che_stren : "6"},
    { che_rate : "1.15", che_price : "4505", che_stren : "5"},
    { che_rate : "1.15", che_price : "4505", che_stren : "51"},
    { che_rate : "1.15", che_price : "4510", che_stren : "82"},
    { che_rate : "1.15", che_price : "4510", che_stren : "31"},
    { che_rate : "1.15", che_price : "4505", che_stren : "1"},
    { che_rate : "1.15", che_price : "4510", che_stren : "21"},
    { che_rate : "1.15", che_price : "4510", che_stren : "4"},
    { che_rate : "1.15", che_price : "4510", che_stren : "5"},
    { che_rate : "1.15", che_price : "4505", che_stren : "12"},
    { che_rate : "1.15", che_price : "4510", che_stren : "31"},
    { che_rate : "1.15", che_price : "4505", che_stren : "5"},
    { che_rate : "1.15", che_price : "4505", che_stren : "63"},
    { che_rate : "1.15", che_price : "4510", che_stren : "9"},
    { che_rate : "1.15", che_price : "4510", che_stren : "10"}
];

let hoData = [
    {
        500 : "1001",
        501 : "1002",
        502 : "1003",
        503 : "1004",
        504 : "1005",
        505 : "1006",
        506 : "1007",
        507 : "1008",
        508 : "1009",
        509 : "1010",
        510 : "1011",
        511 : "1012",
        512 : "1013",
        513 : "1014",
        514 : "1015",
        515 : "1016",
        516 : "1017",
        517 : "1018",
        518 : "1019",
        519 : "1020",
        
        520 : "167",
        521 : "6105",
        522 : "1349",
        523 : "3035",
        524 : "1705",
        525 : "910",
        526 : "591",
        527 : "493",
        528 : "1092",
        529 : "660",
        530 : "4609",
        531 : "1105",
        532 : "115",
        533 : "808",
        534 : "1206",
        535 : "1016",
        536 : "6939",
        537 : "953",
        538 : "1503",
        539 : "1302"
    }
];