var objData={
      "529":"184","509":"127500","528":"215","508":"127600","527":"118","507":"126500","526":"836","506":"126000","525":"58","505":"125500",
     "524":"161","504":"125000","523":"152","503":"124500","522":"190","502":"124000","521":"57","501":"123500", "520":"10","500":"123000",
    "510":"122500","530":"116","511":"122000","531":"192","512":"121500","532":"92","513":"121000","533":"396", "514":"120500","534":"372",
      "515":"120000","535":"592","516":"119500","536":"275","517":"119000","537":"964","518":"118500","538":"261","519":"118000","539":"280",
	"562":"10","560":"100","561":"101","563":"20","582":"50","584":"500","585":"501","583":"10"
      };
	
var g_nSelRow, g_nSelCol, g_strItem,g_strValue;
var g_nTimer1 = 10, g_nTimer2 = 20;

form.OnFormInit=function(tagName , objInit)
{
hoga_1.SetPrice("124000");
hoga_1.SetBasePrice("123000");
hoga_1.SetItemValue ( objData);
}
form.OnTimerChange=function(nTimerID)
{
var fid;
if ( nTimerID == g_nTimer1 )
{
	fid = Math.floor((Math.random() * 4) + 504);
} else if ( nTimerID == g_nTimer2 )
{
	fid = Math.floor((Math.random() * 4) + 510);
}
price = hoga_1.GetProp("caption", fid );
hoga_1.SetPrice(price);
}
form.OnLinkDataNotify=function(strTagName , strValue)
{
 if ( strTagName  == "종목연동태그" )
	jmc_1.SetProp("caption", strValue);
}
hoga_1.OnCellClick=function(nRow , nCol , strItem , strValue)
{
g_nSelRow = nRow; g_nSelCol = nCol; g_strItem = strItem; g_strValue = strValue;

if ( nRow == 11 && nCol == 2 )
{
	hoga_1.HideRow(11, true);
	hoga_1.HideRow(12, false);
}
else if ( nRow == 12 && nCol == 2)
{
	hoga_1.HideRow(11, false);
	hoga_1.HideRow(12, true);
}
}
btn_1.OnClick=function()
{
 form.ScreenReplace("aaa000004" );
}
btn_3.OnClick=function()
{
var caption= btn_3.GetProp('caption');
var nOption = 0;
if (caption == "현재가"){
	text = "중지";
}else{
	nOption = 1;
	text = "현재가";
}

btn_3.SetProp('caption', text); 
 
 form.SetTimer(g_nTimer1, nOption, 300);
 form.SetTimer(g_nTimer2, nOption, 200);
}
btn_4.OnClick=function()
{
 hoga_1.SetPrice(g_strValue);
}
