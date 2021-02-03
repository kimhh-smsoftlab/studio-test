var g_MarketCode = 'BTC', g_pre_code;
var book_data; 
var g_griddata;
var g_strCode = 'ETH/BTC';
var g_jscode = []; // 업종지수 코드
var g_id; // 스토리지 저장용
var g_star_check = 0; // 즐겨찾기 체크유무
var book_list = {}; // 스토리지 내용
var objBalance = null; // 잔고객체 , 메인에서 잔고를 관리해야하므로 해당객체를 만든다
var gridData= function ( grid ) {
	return grid.option ("dataModel.data") || [];
}
// 기능설명>  작성자:홍주형 일시:2019/08/09 17:10:14 //////// 
//setTicker 탭 변경 할때 해당 탭의 id를 가져와 종목시세 g_masteinfo 데이터 적용하는부분
var setTicker= function ( MarketCode ) {
	me_jmsearch.SetProp('caption','' );
	g_MarketCode = MarketCode;
	if(MarketCode != 'bookmark'){
		if(MarketCode !='FUT'){
			grd_list._gPQ.options.colModel[1].title = $hi5_regional.header_txt.pair;
			grd_list._gPQ.options.colModel[1].pq_title = $hi5_regional.header_txt.pair;
		}
		else{
			grd_list._gPQ.options.colModel[1].title = $hi5_regional.header_txt.symbol;
			grd_list._gPQ.options.colModel[1].pq_title = $hi5_regional.header_txt.symbol;
		}
	}
	form.CommRequest("coin_list",0);
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

// 기능설명>  작성자:홍주형 일시:2019/08/09 17:14:21 //////// 
//호가의 현재가 영역에 선물 지수 가져오기위한 실시간 관리
function real_regi_jisu(bReg){
	var option_b = { 'realtype': "0010", 'keylist': g_jscode, 'obj': form, 'formReal' : true};
	if(bReg == true){
		form.RealSB(option_b);
	}else {
		form.RealSBC(option_b);
	}
}
function hi5_calcTurnover(symbol, value) {
    var codeObj = hi5.GetCodeInfo(symbol);
    if (value == "") return value; //|| parseFloat(value) == 0|| (codeObj.base_currency_co != "KRW")
    var objText;
    //1억 이상이면 백만으로 단위처리
    //if (parseFloat(value) >= 1000000) {
    //    objText = { ko: "백만", en: "M", zh: "百万" };
    //    value = parseFloat(value) / 1000000;
    //} else
    if (parseFloat(value) >= 1000) {
        //1억 미만이면 천원으로 단위처리
        objText = { ko: "천", en: "K", zh: "千" ,jp:"千"};
        value = parseFloat(value) / 1000;
    } else {
        if (codeObj.item_sect != '00')
            var format = { gubun: 1, comma: 1, decimal: 1 };
        else
            var format = { gubun: 1, comma: 1, decimal: 1 };
        value = maskstr.GetMaskValue(format, value);
        return value;
    }
    value = Math.floor(value);
    var format = { gubun: 1, comma: 1 };
    value = maskstr.GetMaskValue(format, value) + " " + objText[local_lang];

    return value;
}
// --> [Edit] 수정자:김창하 일시:2020/03/25 10:42:51 
// 수정내용> bRequest 인자 추가 ( 보험금 신청 및 초기화시에 보험 포지션 잔고 재 조회기능)
// <-- [Edit] 김창하 2020/03/25 10:42:51 
function setGridSise(itemsect , bRequest)  {
	if ( bRequest === undefined ){
		real_regi_jisu(false);
		setRealRegister ( false );
	}
	
	if(itemsect == ITEM_SECT.INS){
		g_MarketCode = 'INS';
		if ( bRequest === undefined ){
			grd_list.SetStyle('display','none')
			grd_ins.SetStyle('display','block')
			search_gb.SetStyle('display','none' );
			tab_spot.SetStyle('display','none' );
		}
		//g_ticker_gb.$html.height('100%');
// --> [Edit] 수정자:김창하 일시:2020/03/25 00:47:05 
// 수정내용> 보험 포지션 잔고 사용
		if ( hi5_OrdMng ){
			if ( !objBalance ){
				hi5_OrdMng.setActiveContext ( {itemsect:itemsect,form:form })
				objBalance = hi5_OrdMng.getLibContent ("balance", itemsect );
				objBalance._singlePage = true; // 그리드 컨트롤에서 바로 데이터 설정옵션 기능
				objBalance.grid  = grd_ins;
				hi5_OrdMng.comRqInit ( itemsect, function(sect){
					// 보험 포지션 서비스 응답 완료
					hi5_OrdMng.SB(itemsect); // 실시간 등록
				 },["balance"]);
     		 }else{
				hi5_OrdMng.SBC(itemsect); // 실시간 해제
				// 보험 포지션 재조회를 한다.
				hi5_OrdMng.comRQ ( itemsect,  "17217", function(){
					hi5_OrdMng.SB(itemsect);  //실시간 등록
				} );
			}
		}	  
// <-- [Edit] 김창하 2020/03/25 00:47:05 
		
	}
	else{
		grd_list.SetStyle('display','block')
		grd_ins.SetStyle('display','none')
		search_gb.SetStyle('display','block' );
		tab_spot.SetStyle('display','block' );
		if(itemsect != ITEM_SECT.SPOT){
			g_MarketCode = 'FUT';
			tab_spot.SetStyle('display','none');
			//g_ticker_gb.$html.height('calc( 100% - 40px )');//spot을 제외 하고는 마켓 선택 탭이 없기때문에 높이 재설정
			
			setTicker('FUT');//티커 호출 함수
		}else{
			tab_spot.SetStyle('display','block');
			//g_ticker_gb.$html.height('calc( 100% - 70px )');
			var obj = tab_spot.GetProp('currenttabid');
				setTicker(obj);//티커 호출 함수
		}
	}
		var form_t = g_ticker_gb.$html.position().top;
	g_ticker_gb.$html.height('calc( 100% - '+form_t+'px ');
}

form.OnDialogClose=function(strConfirm, strTagName, objData)
{
real_regi_jisu(false);
}
form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal)
{
if(strRQName == "coin_list"){	if(g_MarketCode=='bookmark')  objCommInput.InRec1.coin_currency = "";	else objCommInput.InRec1.coin_currency = g_MarketCode;}
}
form.onConfigChange=function(option)
{
// --> [Edit] 수정자:김창하 일시:2020/03/25 10:28:19 
// 수정내용>  보험신청 및 초기화시에 보험포지션 잔고 재조회
if ( option && option.gong && option.source ){
	var contentData = option.gong;
	if ( (option.source  =="Insur.Reset" || option.source  =="Insur.DepositApproved") && g_MarketCode == "INS" && contentData.item_sect == ITEM_SECT.INS ){
		//contentData .av_tot // 사용가능잔고
		setGridSise ( ITEM_SECT.INS, true );
	}
	return;
}
// <-- [Edit] 김창하 2020/03/25 10:28:19 




$(".markettab2 .clicked  ").removeClass('bookmark');if(g_star_check == 1){	btn_2.$html.toggleClass( 'check' );		g_star_check = 0;		sessionStorage.setItem("bookmark",g_star_check);}if(option.item_sect) {	setGridSise(option.item_sect)}
}
form.OnRpBefore=function(strRQName, strTRCode, nPreNext, ui, _objBeforeReal)
{
if(strRQName == "coin_list"){	var objdata = ui.rpData.OutRec1;	var data=[];	g_MarketCode;	g_pre_code;	if(g_MarketCode =='bookmark'){		var book_code = Object.keys(book_list);		var m_book_code= [];		for(var cnt = 0; cnt < book_code.length; cnt++){			//if(g_masterInfo[book_code[cnt]] && g_masterInfo[book_code[cnt]].use_yn == "Y"){			if(g_masterInfo[book_code[cnt]]){				var base_code = g_masterInfo[book_code[cnt]].base_currency_co;				if(g_pre_code == 'FUT'){					if(base_code == 'FUT')						m_book_code.push(book_code[cnt]);				}				else{					if(base_code != 'FUT')						m_book_code.push(book_code[cnt]);					}			}		}				for(var cnt = 0; cnt < m_book_code.length; cnt++){			data.push(objdata.filter(function (objData) { return objData.symbol == m_book_code[cnt]})[0]);		}		book_data = data;		ui.rpData.OutRec1 = book_data;	}	else{		for(var cnt = 0; cnt < objdata.length; cnt++){			var mastercode =objdata[cnt].symbol			//if(g_masterInfo[mastercode] && g_masterInfo[mastercode].use_yn =="Y"){			if(g_masterInfo[mastercode]){				objdata[cnt].code = g_masterInfo[objdata[cnt].symbol].code_only;				data.push(objdata[cnt]);			}		}		g_griddata = data;		ui.rpData.OutRec1 = data;	}}
}
form.OnFormInit=function(tagName, objData)
{
me_jmsearch.SetStyle("width","calc(100% - 87px)");	// 좌우 여백 16px씩, 버튼 너비 45px, 버튼과 사이 여백 10pxg_jscode = Object.keys(g_upjongInfo);var obj = tab_spot.GetProp('currenttabid');btn_2.SetProp("icon", {iconClass : 'fa fa-star'});//쿠키에 있는 즐겨찾기 등록되어있는 목록 호출g_id = hi5.GetSharedMemory("@USER_ID") + "_book";if(simpleStorage.get(g_id) && simpleStorage.get(g_id) !='')	book_list = simpleStorage.get(g_id);else	book_list = {};	var storage_obj = simpleStorage.get('lastCode');// {code : strCode, item_sect: codeObj.item_sect}if(storage_obj && storage_obj.item_sect == ITEM_SECT.SPOT){	var market = hi5.GetCodeInfo(storage_obj.code).base_currency_co;	tab_spot.SelectTab(market,null,false );	}if(objData.item_sect) {	setGridSise(objData.item_sect)}
}
form.OnFormClose=function()
{
// --> [Edit] 수정자:김창하 일시:2020/03/25 00:41:29 
// 수정내용> 시세 및 포지션 잔고 클리어 
setRealRegister ( false );
if ( hi5_OrdMng && objBalance ){
	hi5_OrdMng.SBC(ITEM_SECT.INS);
	hi5_OrdMng.setActiveContext ( {itemsect:"" });
}
// <-- [Edit] 김창하 2020/03/25 00:41:29
}
form.OnRealDataBefore=function(objPb, option)
{
if ( option.realType == "JUCH" ){	var ret;	if ( option.fn ){		option.fn( {data:objPb}, function( pbData, idx ){			ret  = GetJuChe_Type ( pbData );			if ( !ret.error ){   // 체결인 경우 				var baseCode = hi5.GetCodeInfo(pbData.symbol, { itemname: "base_currency_co" });				objBalance.OnReciveJanReal ( pbData, option );			}		});	}else{		ret  = GetJuChe_Type ( objPb[0] );		if ( !ret.error ){   // 체결인 경우 			var baseCode = hi5.GetCodeInfo(objPb[0].symbol, { itemname: "base_currency_co" });			objBalance.OnReciveJanReal ( objPb[0], option );		}	}}
}
form.OnRpData=function(strRQName, strTRCode, nPreNext, ui)
{
if(strRQName == 'coin_list'){	setRealRegister(true);	}
}
me_jmsearch.OnChange=function()
{
var grid = grd_list._gPQ;var data;if(g_MarketCode != 'bookmark')	data = g_griddata;else	data = book_data;var sort_list;var obj = me_jmsearch.GetProp('caption').toUpperCase();if(obj ==""){	sort_list = hi5.clone(data);//원본}else{	if(g_MarketCode != 'bookmark')		sort_list = data.filter(function (number) { return number.symbol.toUpperCase().indexOf(obj)!=-1 });//|| number.codename.toUpperCase().indexOf(obj)!=-1	else		sort_list = data.filter(function (number) { return number.symbol.toUpperCase().indexOf(obj)!=-1 });}grid.option("dataModel.data", sort_list);grid.refreshDataAndView( );
}
btn_2.OnClick=function()
{
$(".hi5_tab.markettab2 .clicked").toggleClass('bookmark');if(g_star_check != 1){	btn_2.$html.toggleClass( 'check' );	if(g_MarketCode != 'bookmark')		g_pre_code = g_MarketCode	g_MarketCode = 'bookmark'	g_star_check = 1;}else{	btn_2.$html.toggleClass( 'check' );	g_MarketCode = g_pre_code;	g_star_check = 0;}setTicker(g_MarketCode);sessionStorage.setItem("bookmark",g_star_check);
}
tab_spot.OnTabChangeBefore=function(screen, newTabId)
{
$(".markettab2 .clicked  ").removeClass('bookmark');if(g_star_check == 1 && g_pre_code == screen){	btn_2.$html.toggleClass( 'check' );		g_star_check = 0;	sessionStorage.setItem("bookmark",g_star_check);		setRealRegister ( false );	setTicker(screen);}
}
tab_spot.OnTabChanged=function(nCurrentTab)
{
setRealRegister ( false );setTicker(nCurrentTab);
}
grd_list.OnCellClick=function(rowData, rowIndx, dataIndx, colIndx)
{
var symbol = rowData["symbol"];if(dataIndx!='star'){		var codeObj = hi5.GetCodeInfo(symbol);	if(codeObj.item_sect){		if(codeObj.item_sect == ITEM_SECT.SPOT) hi5.callMenu(1010, codeObj);		else if(codeObj.item_sect == ITEM_SECT.FUT) hi5.callMenu(1020, codeObj);	}}else{	var bFind = book_list[symbol];    if(bFind){		delete book_list[symbol];		if(g_MarketCode =='bookmark'){			grd_list._gPQ.deleteRow( { rowIndx: rowIndx } );			grd_list._gPQ.refreshDataAndView( );		}else			grd_list._gPQ.refreshDataAndView( );	}else{		book_list[symbol] = symbol;		grd_list._gPQ.refreshDataAndView( );	}	simpleStorage.set(g_id,book_list);}
}
grd_list.OnColumnRender=function(ui)
{
var br = "<br>";var symbol = ui.rowData["symbol"];var codeonly = hi5.GetCodeInfo(symbol, { itemname: "code_only" });var basecode = hi5.GetCodeInfo(symbol, { itemname: "base_currency_co" });if ( ui.column.dataIndx == "star"){//즐겨찾기 등록을 위한 별모양 세팅	if(book_list)		var bFind = book_list[symbol];  	var cls_star = "spa_icon_default port_cls " + (bFind ? "check_star2" : "uncheck_star2");	var a = "<div class='"+ cls_star + "' style= 'width : 16px; height:30px; margin: auto; margin-top: 14px;'></div>"	return {text:a};}//else if ( ui.column.dataIndx == "symbol"){//심볼의 코드만 표기//	if(g_MarketCode != 'bookmark'){//	var a = '<div style = "text-overflow: ellipsis; float:left;">'+codeonly+'</div>';//	return {text:a}//	}//}else if(ui.column.dataIndx == "h24_gvol"){	var data = hi5_calcTurnover(symbol, ui.cellData);	return {text:data};}else if ( ui.column.dataIndx == "symbol"){	if($(window).width() <= 320 ){		if(ui.cellData.length > 6 ){			var font = 13 - (ui.cellData.length - 6) ;			return {style:'font-size : '+ font +'px;'}		}	}	else if($(window).width() <= 360 ){		if(ui.cellData.length > 7 ){			var font = 13 - (ui.cellData.length - 7) ;			return {style:'font-size : '+ font +'px;'}		}	}}
}
grd_ins.OnCellClick=function(rowData, rowIndx, dataIndx, colIndx)
{
if(rowData.market_gb){	hi5.callMenu(1030, {item_sect : ITEM_SECT.INS, symbol : rowData.market_gb});}
}
grd_ins.OnColumnRender=function(ui)
{
if ( ui.dataIndx == 'status' ) {	text = $hi5_regional.InsuranceStatus[ ui.cellData ];	return {text: text};}
}
