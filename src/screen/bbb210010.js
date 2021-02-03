// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    // 호가 -> 중앙으로 스크롤 
    //  => ( 호가높이 - 그룹박스 높이 ) / 2 만큼 스크롤
    // 호가 높이
    var tHeight = Table_2.GetStyle('height'); // btn_title318px -> px 안잘라도 됨..
    // 그룹박스 높이
    var gHeight = gb_3.GetStyle('height'); // 399px
    // 스크롤 범위
    var middle = ( parseInt(tHeight) - parseInt(gHeight) ) / 2; // => 154
    // "그룹박스" 스크롤
    gb_3.$html.scrollTop(middle);
    
    $('#'+spn_price.id+' .spinBoxText').css('background-color','rgb(254,251,229)');
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