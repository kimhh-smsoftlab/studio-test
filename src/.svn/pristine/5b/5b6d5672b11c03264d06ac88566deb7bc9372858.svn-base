var g_MarketCode = 'BTC';
var g_Prev_MarketCode = '';
var g_griddata;
var g_star_check = 0; // 즐겨찾기 체크유무
var book_mark = []; // 관심목록 데이터!!
var book_list = {}; // 스토리지 내용 => 관심목록 리스트!!
var objBalance = null; // 잔고객체 , 메인에서 잔고를 관리해야하므로 해당객체를 만든다
var gridData= function ( grid ) {
	return grid.option ("dataModel.data") || [];
}

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    // 화면에 메시지 박스 띄우기 -> hi5.MessageBox(strText,strTitle,nType,fn,position);
    // hi5.MessageBox('화면 초기화','알림',3,function(fn){ }); // 0:닫기,1:확인/취소,2:예/아니오,3:확인
    form.CommRequest("RQ106122");
};

form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal)
{
if(strRQName == "RQ106122"){
    // 관심목록 체크 O -> 전체 데이터 받아오기!!
    if(g_star_check == 1) g_MarketCode = ""; 
    // 관심목록 체크 X -> 현재 선택된 탭 ID 데이터 받아오기!!
    else g_MarketCode = tab_1.GetProp('currenttabid');
    
    objCommInput.InRec1.coin_currency = g_MarketCode;
}
}

// [tab:event ] OnTabChanged  start...
tab_1.OnTabChanged=function(nCurrentTab){
    // 관심버튼 & Flag 초기화
    g_star_check = 0;
    btn_search.SetProp('caption','검색');
    // 사용자 입력값 초기화
    me_jmsearch.SetProp('caption','');
    // 다시 데이터 요청!!
    setRealRegister(false);
    form.CommRequest("RQ106122");
}

// 수신 TR데이터 컨트롤로 보내기 전 처리
form.OnRpBefore=function(strRQName, strTRCode, nPreNext, ui, _objBeforeReal)
{
if(strRQName == "RQ106122"){
	var objdata = ui.rpData.OutRec1; // 수신된 데이터
	var data=[]; // 데이터 담을 배열

	// 관심종목 체크상태 -> 전체데이터에서 관심종목만 골라야됨
	if(g_star_check == 1){
	    var book_code = Object.keys(book_list);
		var m_book_code= [];
		for(var cnt = 0; cnt < book_code.length; cnt++){
			//if(g_masterInfo[book_code[cnt]] && g_masterInfo[book_code[cnt]].use_yn == "Y"){
			if(g_masterInfo[book_code[cnt]]){
				var base_code = g_masterInfo[book_code[cnt]].base_currency_co;
				m_book_code.push(book_code[cnt]);
			}
		}
		for(var cnt = 0; cnt < m_book_code.length; cnt++){
			data.push(objdata.filter(function (objData) { return objData.symbol == m_book_code[cnt]})[0]);
		}
	}else{
	    for(var cnt = 0; cnt < objdata.length; cnt++){
    		var mastercode =objdata[cnt].symbol
    		if(g_masterInfo[mastercode]){
    			objdata[cnt].code = g_masterInfo[objdata[cnt].symbol].code_only;
    			data.push(objdata[cnt]);
    		}
	    }
	}
	
	// 수신데이터 
	g_griddata = data;
	ui.rpData.OutRec1 = data;
}
}

form.OnRpData=function(strRQName, strTRCode, nPreNext, ui)
{
if(strRQName == 'RQ106122'){
	setRealRegister(true);
}
}

me_jmsearch.OnChange=function()
{
var grid = grd_list._gPQ;
var data = g_griddata;
var sort_list;

// 사용자 입력값 가져오기
var obj = me_jmsearch.GetProp('caption').toUpperCase();
if(obj == ""){ // 공백이면
	// 기존 데이터로
    grid.option("dataModel.data", data);
    // 그리드 새로고침
    grid.refreshDataAndView( );
    return ;
}else{ // 입력값 있으면
    // 관심종목 보기 상태이면
    if(g_star_check == 1){
        // 데이터 -> 관심종목 데이터 빼냄
        sort_list = data.filter(function (number) { 
            if(number.symbol.toUpperCase().indexOf(obj)!=-1){
                if(book_list[number.symbol.toUpperCase()]){
                    return true;
                }
            }
            return false;
        });
    }else{
        sort_list = data.filter(function (number) { return number.symbol.toUpperCase().indexOf(obj)!=-1 });
        
    }
}
// 새 데이터로
grid.option("dataModel.data", sort_list);
// 그리드 새로고침
grid.refreshDataAndView( );
}

grd_list.OnCellClick=function(rowData, rowIndx, dataIndx, colIndx)
{
var symbol = rowData["symbol"];

// 별 클릭 아닐 시!! => 알림창!! (화면전환)
if(dataIndx != 'star'){	
    alert(symbol + '클릭!!');
}
// 별 클릭 시!! => 관심목록 등록
else{
    // 해당 셀 컨트롤 가져오기!!
    var $cell = grd_list._gPQ.getCell( { rowIndx: rowIndx, dataIndx: dataIndx } );
    if (!$cell) return;
    
    // 관심목록에 있나 꺼내봄
	var bFind = book_list[symbol]; 
	// 관심목록에 있었다면 => ex. ETH/BTC
    if(bFind){ 
        // 관심목록에서 제거하기
        alert(book_list[symbol] + ' 관심목록 삭제!');
		delete book_list[symbol];
		
		// 관심목록 보기 상태였으면
		if(g_star_check == 1){
		    // 해당 행 ㅂㅂ
			grd_list._gPQ.deleteRow( { rowIndx: rowIndx } );
	    }
	    // 클릭된 star 셀 배경 흰색으로 변경
	    $cell.css("background-color",'white');
	    
    // 관심목록에 없었다면 => undefined
	}else{
        // 관심목록에 추가하기
		book_list[symbol] = symbol;
		alert(book_list[symbol] + ' 관심목록 추가!');	
		// 클릭된 star 셀 배경 흰색으로 변경
		$cell.css("background-color",'red');
	}
	// 그리드 전체 배경색 변경
// 	grd_list.SetStyle('background-color','blue');
	// 화면 새로고침
// 	grd_list._gPQ.refreshDataAndView();
}
}

// [button:event ] OnClick  start...
btn_search.OnClick = function(){
    btn_search.$html.toggleClass( 'check' );
    // 입력값 초기화
    me_jmsearch.SetProp('caption','');
    // 그리드 참조하기
    var grid = grd_list._gPQ;
    
    if(g_star_check === 0){
        btn_search.SetProp('caption','관심');
        // 그리드 데이터 -> 관심목록 데이터로 바꿈
        grid.option("dataModel.data", book_mark);
        g_star_check = 1;
    }else{
        btn_search.SetProp('caption','검색');
        // 그리드 데이터 -> 원본 데이터로 바꿈
        grid.option("dataModel.data", g_griddata);
        g_star_check = 0;
    }
    // 새 데이터 요청!!
    setRealRegister(false);
    form.CommRequest("RQ106122");
}

var setRealRegister = function( bReg){
     var keylist=[];
     // 그리드에서 종목코드를 취득한다.
     
     if(!grd_list._gPQ.option) return;
     var gd  = grd_list._gPQ.option("dataModel.data");
     $.each ( gd, function ( index, rc  ){
        keylist.push(rc["symbol"]);
	});
	
     if (keylist.length <= 0) return;
     
     var option = { 'realtype': '0012', 'keylist': keylist, 'obj': grd_list};
      bReg == true ? form.RealSB(option) : form.RealSBC(option)
}