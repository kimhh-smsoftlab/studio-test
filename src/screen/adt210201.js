// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    $('.tabcontents').remove();
    
    Table_1.OnGetData(dataObj);
    formlink_1.SetPage('bbb100002');
    $('#'+Table_1.id).css('text-align','right')
    //$('.tabheader').css('border-bottom','1px solid #000000')
    $('.hi5_tab').css('border-bottom','1px solid #000000')
    //$('#'+gb_2.id).addClass('borderBottom')
    $('.news').hide();
    $('#'+formlink_1.id).addClass('newsSize_1');
};

var fontColor;
let dataObj = [
    { shcode: '005930', hname : '삼성전자', price : "73000", diff : "0.5", change : "2000", volume : "15461", sign : "5"}
    ];

tab_1.OnTabChanged=function(nCurrentTab){
    $('.tabtitle.clicked').addClass('clicked');
    if (nCurrentTab == '1'){    // 호가
        formlink_1.SetPage('bbb100002');
    } else if (nCurrentTab == '2'){ // 체결
        formlink_1.SetPage('bbb100003');
    } else if (nCurrentTab == '3'){ // 차트
        formlink_1.SetPage('bbb100017');
    } else if (nCurrentTab == '4'){ // 뉴스
        formlink_1.SetPage('bbb100004');
    } else if (nCurrentTab == '5'){ // 거래동향
        formlink_1.SetPage('bbb100006');
    } else if (nCurrentTab == '6'){ // 일별
        formlink_1.SetPage('bbb100008');
    } else if (nCurrentTab == '7'){ // 업종
        formlink_1.SetPage('bbb100012');
    } else if (nCurrentTab == '8'){ // 종목정보
        formlink_1.SetPage('bbb100013');
    } else if (nCurrentTab == '9'){ // 투자의견
        formlink_1.SetPage('bbb100014');
    } else if (nCurrentTab == '11'){ // 시간외
        formlink_1.SetPage('bbb100016');
    }
};

// [table:event ] OnColumnRender  start...
Table_1.OnColumnRender=function($TD, item, value, objDatas){

    if (item == "price") {
        debugger;
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        return {cls :true};
    }
    
    if (item == "change") {
        debugger;
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        return {cls :true};
    }
    
    if (item == "diff") {
        debugger;
        var fontColor;
        let htmlText = "";
        if (objDatas['sign'] == "5"){
            $TD.css("color",'blue');
        }else if (objDatas['sign'] == "2"){
            $TD.css("color",'red');
        }
        return {cls :true};
    }
    
    // if(objDatas['sign'] == "5"){
    //     item.change.css("color",'blue');
    // }else if (objDatas['sign'] == "2"){
    //     item.price.css("color",'red');
    //     item.change.css("color",'red');
    //     item.diff.css("color",'red');
    // }
    
};