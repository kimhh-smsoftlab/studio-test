var header ={ 
	curr : {
		ko : "체결금액",
		en : "amount",
		jp : "締結金額"
	},
	price : {
		ko : "체결량",
		en : "coins",
		jp : "締結量"
	}
}
var timeFormt = function(data, bReal){
	var count = data.length;
	$.each( data, function(idx, obj){
	   var d, t;
	   d = obj["9"];t = obj["8"];
	   obj["dt"] = d+t;
	});
}

form.OnCommSendDataAfter=function(strRQName, strTRCode, nPreNext, objCommInput, objInterfaceHeader)
{
//환경설정 기준대비 변경//objCommInput["9159"] = g_bitpax_config.baseTime.toString();

var symbol = jmc_code.GetProp('caption');
objCommInput["9001"] = hi5.GetCodeInfo(symbol,{ itemname: "mrkt_code"});
}
form.OnFormInit=function(tagName, objData)
{
//btn_Next.SetStyle({"left":"","right":"0", "width" : "52", "top" : "0", "height" : "22"});var obj = jmc_code.GetProp("value");

var colModel = grd_data._gPQ.getColModel( );

var symbol = jmc_code.GetProp('caption');
var code = hi5.GetCodeInfo(symbol, { itemname: "code_only" });
var currency = hi5.GetCodeInfo(symbol, { itemname: "base_currency_co" });
var col;
col = colModel[4];
col.title = header.curr[local_lang]+"("+currency+")";
col = colModel[5];
col.title = header.price[local_lang]+"("+code+")";

if(obj != ""){	form.CommRequest("FID_1002",0,"");}
}
jmc_code.OnCodeChange=function(strCode)
{
var colModel = grd_data._gPQ.getColModel( );

var symbol = jmc_code.GetProp('caption');
var code = hi5.GetCodeInfo(symbol, { itemname: "code_only" });
var currency = hi5.GetCodeInfo(symbol, { itemname: "base_currency_co" });
var col;
col = colModel[4];
col.title = header.curr[local_lang]+"("+currency+")";
col = colModel[5];
col.title = header.price[local_lang]+"("+code+")";

form.CommRequest("FID_1002",0);
}
grd_data.OnRpDataBefore=function(option, data)
{
//if(option.dataExist == true)//	btn_Next.SetProp("disabled", false)//else//	btn_Next.SetProp("disabled", true)timeFormt(data);
}
grd_data.OnVScrollEnd=function(ui, nextDataExist)
{
//if(nextDataExist==true){//	//form.CommRequest("FID_1002",2,"");//	btn_Next.OnClick();//}
}
grd_data.OnRealDataBefore=function(ui, data)
{
timeFormt(data);
}
grd_data.OnColumnRender=function(ui)
{
if ( ui.dataIndx == "223"){  			// 체결강도    var data = ui.rowData["2988"];	// 체결강도구분코드(+:상승,-:하락)    if ( data == "+" ) return {cls : " up_txt"};    if ( data == "-" ) return {cls : " low_txt"};}
}
