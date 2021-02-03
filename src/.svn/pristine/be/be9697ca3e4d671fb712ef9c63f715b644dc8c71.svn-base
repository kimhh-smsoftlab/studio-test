var btn_hide_state = false;// true -> 하단 숨김상태, false -> 하단 표시 상태

let dataObj = {
    day_prof : '0', buy_price : '0', sell_price : '0', total_price : '0', price_prof : '0.00%',
    total_cost : '0', day_trade_prof : '0', trade_prof : '0.00%'
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    Table_price.OnGetData(dataObj);
};


// [button:event ] OnClick  start...
btn_togg.OnClick=function(){
    // 상단 테이블 토글
    Table_price.$html.toggleClass('disabled');
    // 버튼 이미지 토글
    btn_togg.$html.toggleClass('show_box');
        
    if(btn_hide_state){ // 보이도록 만들기!!
        // 그리드 위치(top) 아래로 ㄱㄱ
        grd_gubun.SetStyle('top','115');
        // 그리드 높이(height) 줄이기
        grd_gubun.SetGridHeight(335);
        // 버튼 상태 토글
        btn_hide_state = false;
        Table_price.$html.show();
    }else{// 안보이도록 만들기!!
        // 그리드 위치(top) 위로 ㄱㄱ
        grd_gubun.SetStyle('top','5');
        // 그리드 높이(height) 늘이기
        grd_gubun.SetGridHeight(445);
        // 버튼 상태 토글
        btn_hide_state = true;
        Table_price.$html.hide();
    }
    grd_gubun._gPQ.refreshDataAndView( );
};