// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    formlink_2.$html.hide();
    Table_3.OnGetData(dataObj);
    formlink_3.$html.hide();
    Table_2.OnGetData(dataObj_2);
    $('.mainTable tbody tr td.comitem').css('text-align','right');
    $('.mainTable tbody tr td.comitem.fidprice').css('text-align','left');
    $('.comitem.fidsign').text("▼");
    $('#'+cb_1.id).css('text-align-last','left');
};

// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    formlink_1.$html.hide();
    formlink_2.$html.show();
    formlink_2.SetPage('bbb200022');
    $('#'+gb_1.id).css('filter','brightness(0.5)');
};

// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    formlink_1.$html.hide();
    formlink_2.$html.show();
    formlink_2.SetPage('bbb200023');
    $('#'+gb_1.id).css('filter','brightness(0.5)');
};

let dataObj = [
    { shcode: '005930', price : "73000", vol : "190", total : "436,941", rate : "5.16%", rate2 : "67.44%", sign : "5"}
];

let dataObj_2 = [
    { firPer : '20%', secondPer : '45%', thirdPer : '70%'}
];
// [table:event ] OnColumnRender  start...
Table_3.OnColumnRender=function($TD, item, value, objDatas){
    if (item == "price") {
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        return {cls :true};
    }
    
    if (item == "vol") {
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        return {cls :true};
    }
    
    if (item == "rate") {
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        return {cls :true};
    }
    
    if (item == "sign"){
        debugger
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        
        return {cls :true};
    }
};