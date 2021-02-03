// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    gb_1.$html.hide();
    gb_2.$html.show();
};

// [button:event ] OnClick  start...
btn_3.OnClick=function(){
    gb_1.$html.show();
    gb_2.$html.hide();
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    $('.hi5_formlink.wish').css('opacity','1.0');
    grd_1.OnGetData(dataObj); // gb_2 숨기기 전에 그리드 먼저 세팅해야됨..!!
    gb_2.$html.hide();
    
    $('.pq-grid-row .pq-grid-cell').first().css('background-image', 'url(' + "./css/images/checked.png" + ')');
    $('.pq-grid-row .pq-grid-cell').first().css('background-size', 'cover');
    $('.pq-grid-row .pq-grid-cell').first().css('bottom', '3px');
};

// [grid:event ] OnColumnRender  start...
grd_1.OnColumnRender=function(ui){
    if(ui.dataIndx == "check"){
        var $cell = grd_1._gPQ.getCell( { rowIndx: ui.rowIndx, dataIndx: ui.dataIndx } );
        // 셀 렌더링 시 unchecked_item 이미지 씌우기...안됨...
        $cell.toggleClass('checked_item');
        // $cell.css('background-image', 'url(' + "./css/images/unchecked_item.png" + ')');
        // let htmlText = "<div class='unchecked_item'></div>";
        // return {text : htmlText};
    }
    
    
    var fieldName = ui.rowData.fieldname;
    var defVal = ui.rowData.defaultValue;
    var item = ui.dataIndx;
    // alert('fieldName:' + fieldName + 'devVal:' + defVal + 'item: '+ item);
    
    // TODO : 체크상태 데이터 일 때 -> 체크박스 체크!!
    if(ui.rowData.defaultValue == '1' || ui.dataIndx == 'check'){
        // grd_1.cellClick("",ui);
        
    }
};
// 보유종목 라디오 체크에 따른 계좌 보이기 or 숨기기 설정 함수
var setAccountBox= function ( bFlag ) {
    if(bFlag){// on, true
        $('#'+chk_1.id).addClass('slide_on')
    }else{
        $('#'+chk_1.id).removeClass('slide_on')

        $('#'+chk_1.id).addClass('slide_off')
    }
}

// [checkbox:event ] OnStateChanged  start...
chk_1.OnStateChanged=function(checkstate, value){
    setAccountBox(checkstate);
};





// let dataObj = [
//     { fieldname:'대비'},
//     { fieldname:'등락률'},
//     { fieldname:'봉차트'},
//     { fieldname:'거래량'},
//     { fieldname:'신용비율'},
//     { fieldname:'외국인보유'},
//     { fieldname:'거래대금'},
//     { fieldname:'체결강도'},
//     { fieldname:'매도호가'},
//     { fieldname:'매도잔량'},
//     { fieldname:'매수잔량'},
//     { fieldname:'시가'},
//     { fieldname:'고가'},
//     { fieldname:'저가'},
//     { fieldname:'PER'},
//     { fieldname:'액면가'},
//     { fieldname:'시가총액'},
//     { fieldname:'증거금률'},
//     { fieldname:'외국계추정합'},
//     { fieldname:'외국계 변동'}
// ];

let dataObj = [
    { fieldname:'대비', defaultValue:'1'},
    { fieldname:'등락률', defaultValue:'1'},
    { fieldname:'봉차트', defaultValue:'1'},
    { fieldname:'거래량', defaultValue:'1'},
    { fieldname:'신용비율', defaultValue:'1'},
    { fieldname:'외국인보유', defaultValue:'1'},
    { fieldname:'거래대금', defaultValue:'1'},
    { fieldname:'체결강도', defaultValue:'1'},
    { fieldname:'매도호가', defaultValue:'1'},
    { fieldname:'매도잔량', defaultValue:'0'},
    { fieldname:'매수잔량', defaultValue:'0'},
    { fieldname:'시가', defaultValue:'0'},
    { fieldname:'고가', defaultValue:'0'},
    { fieldname:'저가', defaultValue:'0'},
    { fieldname:'PER', defaultValue:'0'},
    { fieldname:'액면가', defaultValue:'0'},
    { fieldname:'시가총액', defaultValue:'0'},
    { fieldname:'증거금률', defaultValue:'0'},
    { fieldname:'외국계추정합', defaultValue:'0'},
    { fieldname:'외국계 변동', defaultValue:'0'}
];

// [grid:event ] OnCellClick  start...
grd_1.OnCellClick=function(rowData, rowIndx, dataIndx, colIndx){
    // 2. 해당 셀 컨트롤 가져오기!!
    var $cell = grd_1._gPQ.getCell( { rowIndx: rowIndx, dataIndx: 'check' } );
    if (!$cell) return;
    // 3. 체크 클릭 시!!
    if(dataIndx == 'check'){	
        // 셀 클릭 시 checked_item 이미지 씌우기!!
        $cell.css('background-image', 'url(' + "./css/images/checked.png" + ')');
        $cell.css('background-size', 'cover');
        $cell.css('bottom', '3px');
}
};