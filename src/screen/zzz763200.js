var g_selectRow;
var g_tabid;
var gridSelIndex = function ( grid ) {
	// 그리드 선택된 행 위치 취득
	var objSel = grid.SelectRow(), selIndex;
	if ( objSel ){
		var rows = objSel.getSelection();
		if ( rows .length )
			selIndex= rows[0].rowIndx;
	}
	return selIndex
};

// 그리드 데이터 취득
var gridData= function ( grid ) {
	return grid.option ("dataModel.data") || [];
};

// 그리드 데이터 취득
form.getSelectRowData = function ( ) {
	var tab = tab_1.GetProp('currenttabid' );
	if(grd_allSearch._gPQ.Selection().getSelection() && grd_allSearch._gPQ.Selection().getSelection().length>0){
	
		var obj = hi5.clone(grd_allSearch._gPQ.Selection().getSelection()[0].rowData || {});
		obj.top_data = {
						from_cal : cal_from.GetProp('value'),
						to_cal : cal_to.GetProp('value'),
						coin : jmc_1.GetProp('value'),
						coin_j : cb_coin.GetProp('value'),
						slby : cb_slby.GetCurSelValue( ),
						dw : cb_dw.GetCurSelValue() // 자산이동내역 입출금 콤보
						}
		
		
		if(tab == 10){
			obj.usid = me_stakingId.GetProp('value');
			obj.top_data = {
					proc_gb : rdo_procgb.GetProp('value'),
					from_cal : cal_from.GetProp('value'),
					to_cal : cal_to.GetProp('value')
			}
		}

		if(chk_all.GetCheck( )&&(chk_all.GetStyle('display')!='none')){
			obj.top_data.from_cal = '00000000'
			obj.top_data.to_cal = '99999999'
		}
				
		
		return obj;
	}
	else{
		if(tab == 10){
			var obj = {};
			obj.usid = me_stakingId.GetProp('value');
			obj.not = 1;
			obj.top_data = {
					proc_gb : rdo_procgb.GetProp('value'),
					from_cal : cal_from.GetProp('value'),
					to_cal : cal_to.GetProp('value')
			}
			return obj;
		}
		
	}
};

// 코인 종목리스트 설정
function setSymbolCombo(market) {
debugger;
	var codelist = hi5.getMarketCodeList(market);  // 인자값 null : 코인전체, marketcode(B : btc종목 E : eth종목)
	var tempList = [{' ': 'ALL'}];
	if(codelist.length > 0) {
		for(var i = 0; i < codelist.length; i++) {
			var tempObj = {};
			var val = codelist[i].code;  // code
			tempObj[val] = val.split('/')[0];   // value : BTC/PHP
			tempList.push(tempObj);
		}
	}
	cb_coin.ResetContent();  // 해당 콤보의 내용 초기화
	cb_coin.SetItemValue(tempList);  // 콤보 리스트에 키값과 표시내용을 설정
}

form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader, _objBeforeReal)
{
if(strRQName == 'RQ_17325'){	objCommInput.InRec1.hv_gb = g_modType;	objCommInput.InRec1.stat = rdo_stat.GetProp('value' );		if(g_f==1){		g_cellOadd = me_oadd.GetProp('caption' );	}}if(strRQName == 'RQ_17329'){	var rdoIndx = rdo_gb.GetSelectedIndex( );	if(rdoIndx == 1){		objCommInput.InRec1.hv_gb = 1;	}	objCommInput.InRec1.qry_condition = me_id.GetProp('value');}
}
form.onConfigChange=function(option)
{
if(g_selectRow){	if(option.init){		tab_query.OnClick();	}}
}
form.OnRpBefore=function(strRQName, strTRCode, nPreNext, ui, _objBeforeReal)
{
if( strRQName == "RQ_17329" ){	//조회 시점에 totalcount 셋팅	lb_Total.SetProp("caption",ui.rpData.OutRec2.length);		for(var i=0; i<ui.rpData.OutRec2.length; i++){			ui.rpData.OutRec2[i].mod = $hi5_regional.grid.mod; //'수정'	}}
}
form.OnFormInit=function(tagName, objData)
{
tab_1.$html[0].style.overflowY = 'auto'// [결함960] 일별손익 hidetab_1.ShowHideTab("1",false );var width = gb_left.$html[0].style.width;var containerSplit = gb_container.$html.split({	cls_vspltter : "vsplitter img_vsplitter",   // 이미지 splitter 바 디자인	orientation: 'vertical',  					// 수직 (default:'horizontal')	limit: 215,   								// 최소 사이즈(px)	position :  width,							// left 초기 position	height_unit : "%",							// 컨테이너 높이값을 고정(px), 유동(유무)	percent: true,								// css 저장단위 지정   	    onDragEnd: function(e) {		var arrPqList = gb_container.$html.find('.pq-grid')		$.each( arrPqList, function( index, element ) {			var grid = $('#'+element.id).pqGrid('getInstance').grid;			grid.refresh( );		});    },});cal_from.SetProp("setDate" , "-7");jmc_1.SetProp('value', '');//g_stat = null;//tab_1.$html.css('z-index','100');//formlink_1.$html.css('width','calc( 100% - 453px )');//formlink_1.$html.css('height','calc( 100% - 43px )');//if(tagName == 'open'&& objData){//	me_id.SetProp('caption',objData.code);//	btn_query.OnClick();//	g_tabid = objData.tabid//}//else//	btn_query.OnClick();//let market = ITEM_SECT.FUT;	setSymbolCombo('USDT');if(tagName == 'open'){	me_id.SetProp('value',objData.code );	g_tabid = objData.tabid;} else if (tagName == '##USERINFO' && objData){	me_id.SetProp('value',objData.usid);}	btn_query.OnClick();
}
form.OnRpData=function(strRQName, strTRCode, nPreNext, ui)
{
if(strRQName == 'RQ_17325' && (g_modType==3 || g_modType==2)){	btn_query.OnClick();}if(g_tabid != '' && g_tabid){	grd_allSearch._gPQ.setSelection({ rowIndx: 0, dataIndx:'v_accn'});	var grid = grd_allSearch._gPQ;	var selIndex1 = gridSelIndex (grid);	var data = gridData(grid);	g_selectRow = data[selIndex1];	var obj = tab_1.GetProp('currenttabid');		var scrollH = $("#" + tab_1.id)[0].scrollHeight;	if(g_tabid > 6){		$("#" + tab_1.id).scrollTop(scrollH)	}	else{		$("#" + tab_1.id).scrollTop(0)	}		if(obj == g_tabid){		grd_allSearch._gPQ.setSelection({ rowIndx: 0, dataIndx:'v_accn'});		tab_query.OnClick();	}	else{		tab_1.SelectTab(null,g_tabid);		g_tabid = null;	}}if(strRQName == "RQ_17329"){	for(var i=0; i<ui.rpData.OutRec2.length; i++){		if(me_id.GetProp('value') != ""){			if(ui.rpData.OutRec2[i].usid == me_id.GetProp('value')){				grd_allSearch._gPQ.setSelection(  { rowIndx: i, dataIndx:'usid' } );				tab_query.OnClick();			}		}	}}
}
form.OnLinkDataNotify=function(tagName, objdata)
{
if(tagName == 'contextmenu' && objdata){	me_id.SetProp('caption',objdata.code);	btn_query.OnClick();	g_tabid = objdata.tabid}
}
btn_query.OnClick=function()
{
	var obj = me_id.GetProp('value' ).length;	if(obj != 1){		form.CommRequest ("RQ_17329", 0);	}	else{		hi5.MessageBox($hi5_regional.admin.twoChar, $hi5_regional.title.notice,0, function(){			me_id.SetFocus( );			grd_allSearch.clearAllData();		});	}
}
me_id.OnEditEnter=function()
{
btn_query.OnClick();
}
rdo_accType.OnChange=function(nIndex)
{
btn_query.OnClick();
}
grd_allSearch.OnCellClick=function(rowData, rowIndx, dataIndx, colIndx)
{
if(rowData != null){	/*g_selectRow = rowData;	g_selectRow.selCode = jmc_1.GetProp('value' );	g_selectRow.from = cal_from.GetProp('value' );	g_selectRow.to = cal_to.GetProp('value' );	form.PostLinkData("selectData", g_selectRow);*/	var tab = tab_1.GetProp('currenttabid' );	me_stakingId.SetProp('value', hi5.clone(rowData.usid) );	if(tab != 10){		tab_query.OnClick();	}}if(dataIndx == 'mod'){	form.OpenDialog("aaz76320p", $hi5_regional.popupName.manage, "mod",rowData);}if(form.$html.parents('.hi5_win_main').attr('linkcode') == 1){	form.SetCodeDataLink("queryID", rowData['usid']);}
}
grd_allSearch.OnColumnRender=function(ui)
{
var caption;if(ui.dataIndx == 'stat'){	caption = hi5.getCodeConvert({ key:"stat", code:ui.cellData} );	return {text:caption};}else if(ui.dataIndx == 'losscut_use_gb'){	caption = hi5.getCodeConvert({ key:"losscut_use_gb", code:ui.cellData} );	return {text:caption};}
}
tab_1.OnTabChanged=function(nCurrentTab)
{
var screenid;var show = 'block';var cb_show = 'block';jmc_1.SetStyle('display', show );cb_coin.SetStyle('display', cb_show );chk_all.SetStyle('display', 'none' );cal_from.SetProp('disabled', false);cal_to.SetProp('disabled', false);gb_slby.SetStyle('display', 'none' );gb_staking.SetStyle('display', 'none' );//cb_dw.SetStyle('display', 'none');if(nCurrentTab == 0){//잔고	screenid = "aaz763201";	show = 'none';	jmc_1.SetStyle('display', show );	cb_coin.SetStyle('display', cb_show );}else if(nCurrentTab == 1){//일별	screenid = "aaz763202";	cb_show	 = 'none'}else if(nCurrentTab == 2){//종목별	screenid = "aaz763207";	}else if(nCurrentTab == 3){//미체결	screenid = "aaz763208";			show = 'none';}else if(nCurrentTab == 4){//스탑주문	screenid = "aaz763209";	show = 'none';	cb_show = 'none'}else if(nCurrentTab == 5){//거래내역	screenid = "aaz763204";	gb_slby.SetStyle('display', 'block' );	cb_slby.SetStyle('display','block');	cb_dw.SetStyle('display','none');}else if(nCurrentTab == 6){//주문내역	screenid = "aaz763203";	gb_slby.SetStyle('display', 'block' );	cb_slby.SetStyle('display','block');	cb_dw.SetStyle('display','none');	}else if(nCurrentTab == 7){//스탑주문내역	screenid = "aaz262005";	gb_slby.SetStyle('display', 'block' );	cb_slby.SetStyle('display','block');	cb_dw.SetStyle('display','none');}else if(nCurrentTab == 8){//에약내역	screenid = "aaz763205";	chk_all.SetStyle('display', cb_show );	var obj = chk_all.GetCheck( );	if(obj){		cal_from.SetProp('disabled', true);		cal_to.SetProp('disabled', true);	}}else if(nCurrentTab ==9){//지갑주소	screenid = "aaz763206";	show = 'none';	cb_show = 'none';}else if(nCurrentTab == 10){//스테이킹 내역	screenid = "aaz763210";	cb_show = 'none';	gb_staking.SetStyle('display', 'block' );}else if(nCurrentTab == 11){//추천인조회	screenid = "aaz763211";	cb_show = 'none';	show = 'none';}else if(nCurrentTab == 12){ // 자산거래내역	screenid = "aaz763212";	jmc_1.SetStyle('display', 'none' );	cb_coin.SetStyle('display', cb_show );	gb_slby.SetStyle('display', 'block' );	cb_slby.SetStyle('display','none');	cb_dw.SetStyle('display','block');	}gb_cal.SetStyle('display', show );gb_code.SetStyle('display', cb_show );formlink_1.SetPage(screenid);
}
cb_coin.OnListSelChanged=function(index, value, caption)
{
tab_query.OnClick();
}
jmc_1.OnCodeChange=function(strCode)
{
tab_query.OnClick();
}
tab_query.OnClick=function()
{
//formlink_1.objSubForm.onConfigChange({refresh: true, data : g_selectRow});if(formlink_1.objSubForm.onConfigChange)	var obj_data = form.getSelectRowData( ) 	if(obj_data){		formlink_1.objSubForm.onConfigChange({refresh: true, data : obj_data});	}	g_selectRow = undefined;
}
cal_to.OnChanged=function()
{
tab_query.OnClick();
}
cal_from.OnChanged=function()
{
	tab_query.OnClick();
}
chk_all.OnStateChanged=function(checkstate, value)
{
	if(checkstate == true) {		cal_from.SetProp('disabled','disabled' );		cal_to.SetProp('disabled','disabled' );	} else {		cal_from.SetProp('disabled',false );		cal_to.SetProp('disabled',false );	}		tab_query.OnClick();
}
cb_slby.OnListSelChanged=function(index, value, caption)
{
tab_query.OnClick();
}
cb_dw.OnListSelChanged=function(index, value, caption)
{
tab_query.OnClick();
}
rdo_procgb.OnChange=function(nIndex)
{
tab_query.OnClick();
}
me_stakingId.OnEditEnter=function()
{
tab_query.OnClick();
}
