// [tab:event ] OnTabChanged  start...
tab_1.OnTabChanged=function(nCurrentTab){
    $('.cliking').removeClass('cliking');
    $('.tabtitle.clicked').addClass('cliking');
};


let dataObj = [
    { group_name : '그룹1', jmname : [{ 0:'BGF리테일', 1:'BGF', 2:'APS홀딩스' }] }
];

let data = [
    { jmname:'BGF리테일'},
    { jmname:'BGF'},
    { jmname:'APS홀딩스' }
];


// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    // var loc = window.location.pathname;
    // var dir = loc.substring(0, loc.lastIndexOf('/'));
    // alert(dir);
    grd_1.OnGetData(data);
    $('.tabtitle.clicked').addClass('cliking');
    $('.hi5_formlink.wish').css('opacity','1.0');
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
};

grd_1.OnCellClick=function(rowData, rowIndx, dataIndx, colIndx)
{
// 1. 종목명 가져오기
var jmname = rowData["jmname"];

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
// 4. x 클릭 시!!
else if(dataIndx == 'delete'){
    // 셀 클릭 시 checked_item 이미지 씌우기!!
    $cell.css('background-image', 'url(' + "./css/images/non_check.png" + ')');
    $cell.css('background-size', 'cover');
    $cell.css('bottom', '3px');
}
// 5. 종목명 클릭 시
else{	
    alert(jmname + '클릭!!');
}
}