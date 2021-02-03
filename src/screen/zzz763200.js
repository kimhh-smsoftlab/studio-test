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
if(strRQName == 'RQ_17325'){
}
form.onConfigChange=function(option)
{
if(g_selectRow){
}
form.OnRpBefore=function(strRQName, strTRCode, nPreNext, ui, _objBeforeReal)
{
if( strRQName == "RQ_17329" ){	//조회 시점에 totalcount 셋팅
}
form.OnFormInit=function(tagName, objData)
{
tab_1.$html[0].style.overflowY = 'auto'
}
form.OnRpData=function(strRQName, strTRCode, nPreNext, ui)
{
if(strRQName == 'RQ_17325' && (g_modType==3 || g_modType==2)){
}
form.OnLinkDataNotify=function(tagName, objdata)
{
if(tagName == 'contextmenu' && objdata){
}
btn_query.OnClick=function()
{
	var obj = me_id.GetProp('value' ).length;
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
if(rowData != null){
}
grd_allSearch.OnColumnRender=function(ui)
{
var caption;
}
tab_1.OnTabChanged=function(nCurrentTab)
{
var screenid;
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
//formlink_1.objSubForm.onConfigChange({refresh: true, data : g_selectRow});
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
	if(checkstate == true) {
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