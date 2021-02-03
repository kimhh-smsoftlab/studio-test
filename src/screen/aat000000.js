var l_chepop, l_startType, l_maxCount, l_linkCode;
function saveConfigData(){
	var sound = chk_sound.GetCheck( );
	var orderdlg = chk_orderdlg.GetCheck( );
	var login_alarm = chk_login_alarm.GetProp("value" );
	var cash_inout_alarm = chk_cash_inout_alarm.GetProp("value" );
	var coin_inout_alarm = chk_coin_inout_alarm.GetProp("value" );
	var info_change_alarm = chk_info_change_alarm.GetProp("value" );
	var baseTime = rdo_time.GetProp("value");
	var chepop = l_chepop;
	var maxCount = l_maxCount;
	var startType = l_rdo_load;
	var linkCode = l_linkCode;

	var objConfig = {
		sound : sound,
		chepop: chepop,
		orderdlg: orderdlg,
		startType : startType,
		baseTime : baseTime,
		maxCount : maxCount,
		linkCode : linkCode,
		login_alarm : login_alarm,
		cash_inout_alarm : cash_inout_alarm,
		coin_inout_alarm : coin_inout_alarm,
		info_change_alarm : info_change_alarm
	};	
	// mdi.js 파일에서 설정정보 취득
	coredax_config_save( objConfig);
	// 공유메모리에 기준시간 정보 값 변경
	return true;
}
function loadConfigData(){
	// mdi.js 파일에서 설정정보 취득
	var objSet = coredax_config_load();
	if(objSet){
		var value = objSet.baseTime.toString();
		rdo_time.SetProp('value',value);
		chk_sound.SetCheck(objSet.sound);
		chk_orderdlg.SetCheck(objSet.orderdlg);
		chk_cash_inout_alarm.SetProp('value',objSet.cash_inout_alarm);
		chk_login_alarm.SetProp('value',objSet.login_alarm);
		chk_coin_inout_alarm.SetProp('value',objSet.coin_inout_alarm);
		chk_info_change_alarm.SetProp('value',objSet.info_change_alarm);

		l_chepop = objSet.chepop;
		l_maxCount = objSet.maxCount.toString();
		l_rdo_load = objSet.startType.toString();
		l_linkCode = objSet.linkCode;
	}
	return objSet;
}

form.OnFormInit=function(tagName, objData)
{
$(".b ").css({'height' : 'auto'});$(".b div div").css({'white-space' : 'normal'});var objSet = loadConfigData();
}
btn_ok.OnClick=function()
{
var bRet = saveConfigData();
}
btn_ok1.OnClick=function()
{
rdo_time.SetProp('value',1);chk_sound.SetCheck(false);
chk_orderdlg.SetCheck(false);
chk_cash_inout_alarm.SetCheck(false);
chk_login_alarm.SetCheck(false);
chk_coin_inout_alarm.SetCheck(false);
chk_info_change_alarm.SetCheck(false);
}
