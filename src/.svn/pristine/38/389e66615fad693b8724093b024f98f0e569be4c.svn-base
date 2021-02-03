function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

function createHogaData(){
    let data = {
        jmcode : '005930',
        500 : 73700,
        501 : 73800,
        502 : 73900,
        503 : 74000,
        504 : 74100,
        505 : 74200,
        506 : 74300,
        507 : 74400,
        508 : 74500,
        509 : 74600,
        510 : 73600,
        511 : 73500,
        512 : 73400,
        513 : 73300,
        514 : 73200,
        515 : 73100,
        516 : 73000,
        517 : 72900,
        518 : 72800,
        519 : 72700
    }
    
    let price = getRandomIntInclusive(1, 9) * 10000;
    let prcAsk = 500;
    let prcBid = 510;
    let qtyAsk = 520;
    let qtyBid = 530;
    let askSum = 0, bidSum = 0;
    
    for(let x = 0;x < 10;x++){
        data[prcAsk.toString()] = price + (x * 100);
        data[qtyAsk.toString()] = getRandomIntInclusive(1, 10000);
        askSum = askSum + data[qtyAsk.toString()];
        prcAsk++;
        qtyAsk++;

        data[prcBid.toString()] = price - ((x + 1) * 100);
        data[qtyBid.toString()] = getRandomIntInclusive(1, 10000);
        bidSum = bidSum + data[qtyBid.toString()];
        prcBid++;
        qtyBid++;
    }
    data["560"] = askSum;
    data["561"] = bidSum;

    return data;
}
let dataObj = [
    { shcode: '005930', hname : '삼성전자', price : "73000", diff : "0.5", change : "2000", amount : "15461", sign : "2",
        open: '11', high: '11', low: '11', uplmtprice: '11', dnlmtprice: '11'
    }
];
let gb1data = [
    { title:'52주 최고', price:'3405'},
    { title:'52주 최저', price:'1500'}
    // { title:'전일거래량', price:'195530'},
    // { title:'시가', price:'3232'},
    // { title:'고가', price:'340115'},
    // { title:'저가', price:'4206'},
    // { title:'상한가', price:'12220'},
    // { title:'하한가', price:'2275'}
];
let gb3data = [
    { price:'3285', vol:'100'},
    { price:'3285', vol:'1500'},
    { price:'3285', vol:'1'},
    { price:'3275', vol:'3232'},
    { price:'3275', vol:'253'},
    { price:'3270', vol:'3'},
    { price:'3270', vol:'1105'},
    { price:'3270', vol:'1206'},
    { price:'3285', vol:'100'},
    { price:'3285', vol:'1500'},
    { price:'3285', vol:'1'},
    { price:'3275', vol:'3232'},
    { price:'3275', vol:'253'},
    { price:'3270', vol:'3'},
    { price:'3270', vol:'1105'},
    { price:'3270', vol:'1206'}
];
let data = [
    { price:'3285', rate:'100'}
]
let tabledata = [
    { asksum:'24070', price: '7100', bidsum:'16960'}
]

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    Table_4.$html.hide();
    Table_5.$html.hide();
    Table_1.OnGetData(tabledata);
    // grd_1.OnGetData(gb1data);
    grd_3.OnGetData(gb3data);
    Table_3.OnGetData(dataObj);
    formlink_1.$html.hide();
    
    
    // 호가 -> 중앙으로 스크롤 
    //  => ( 호가높이 - 그룹박스 높이 ) / 2 만큼 스크롤
    // 호가 높이
    var tHeight = hoga_1.GetStyle('height'); // 900px -> px 안잘라도 됨..
    // 그룹박스 높이
    var gHeight = gb_1.GetStyle('height'); // 450px
    // 총잔량 높이
    var aHeight = Table_1.GetStyle('height');
    // 스크롤 범위
    var middle = ( parseInt(tHeight) - parseInt(gHeight)) / 2; // => 675
    // "그룹박스" 스크롤
    gb_1.$html.scrollTop(middle);
    
    $('.grid').css('width','80px');
    $('.pq-grid-cell').css('width','35px');
    $('#'+grd_3.id).css('border','none');
    $('#'+Table_1.id).addClass('borderTop');
    
    hoga_1.SetItemValue(createHogaData());
    
};

// [hoga:event ] OnCellClick  start...
hoga_1.OnCellClick=function(nRow, nCol, item, value){
    $('.event').removeClass('event');
    if (nCol == 1 || nCol == 2){
        debugger
        //alert('클릭');
        //form.OpenDialog("bbb100101","","bbb100101",{},"center");
        // $('#'+formlink_1.id).css('left',(event.target.offsetLeft));
        formlink_1.$html.show();
        formlink_1.SetPage('bbb100101');
        
        
        
        if(nCol == 1){
           $(event.target).addClass('event');
           $(event.target.nextElementSibling).addClass('event');
           
           $('#'+formlink_1.id+' .form .table_ctl tbody tr').children().first().text(event.target.textContent);
           $('#'+formlink_1.id+' .form .table_ctl tbody tr').children().first().next().text(event.target.nextElementSibling.textContent);
        }
        else if(nCol == 2){
           $(event.target).addClass('event');
           $(event.target.previousElementSibling).addClass('event');
           
           $('#'+formlink_1.id+' .form .table_ctl tbody tr').children().first().text(event.target.textContent);
           $('#'+formlink_1.id+' .form .table_ctl tbody tr').children().first().next().text(event.target.previousElementSibling.textContent);
        }
    } 
        //$('#'+formlink_1.id).css('left',(event.target.offsetLeft-90));
        //$('#'+formlink_1.id).css('top',(event.target.offsetTop));
        //$('#'+formlink_1.id).css('height',(event.target.offsetHeight));
        $('#'+formlink_1.id).css('top',(event.target.offsetTop) + $($('#'+hoga_1.id)).offset().top);
        $('#'+gb_1.id).css('filter','brightness(0.5)');
        $('#'+Table_1.id).css('filter','brightness(0.5)');
        $('.newsSize').css('filter','brightness(0.5');
        
        
    
};

// [table:event ] OnCellClick  start...
Table_3.OnCellClick=function(nRow, nCol, item, value){
    Table_3.$html.hide();
    Table_4.$html.show();
};

// [table:event ] OnCellClick  start...
Table_4.OnCellClick=function(nRow, nCol, item, value){
    Table_4.$html.hide();
    Table_5.$html.show();
};

// [table:event ] OnCellClick  start...
Table_5.OnCellClick=function(nRow, nCol, item, value){
    Table_5.$html.hide();
    Table_3.$html.show();
};

// [button:event ] OnClick  start...
btn_all.OnClick=function(){
    form.OpenScreen({menuid:'bbb100052', tagName:'open', initdata:{}});
};
// [button:event ] OnClick  start...
btn_10hoga.OnClick=function(){
    
};