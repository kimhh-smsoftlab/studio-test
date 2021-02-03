var g_nGlobal = 0;

form.OnFormInit=function(tagName,objData)
{
var obj = jmc_1.GetProp("value");if(obj != "") 	var obj = form.CommRequest ("fid1000",0,"");g_nGlobal++;console.log(g_nGlobal);	
}
form.OnRqData=function(strRQName,strTRCode,nPreNext)
{
if(strRQName == "fid1000"){
	var strCode = Table_1.GetCellString(3,0);
	var strUpjong = Table_1.GetCellString(3,1);
	var strMGubun = Table_1.GetCellString(3,2);
	if(strMGubun == "1") strMGubun = "KOSPI";
	else if(strMGubun == "4") strMGubun = "KOSDAQ";

	var strText = strCode + " " + strMGubun + " " + strUpjong;
	Table_1.SetCellString(2,0,strText);
}
}
jmc_1.OnCodeChange=function(strCode)
{
var obj = form.CommRequest ("fid1000",0,"");
form.PostLinkData("SISE", strCode);
}
