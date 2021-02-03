
btn_1.OnClick=function()
{
var value = "btn_1.OnClick event"; eb_event.SetProp('caption' , value);  form.SetFocus("me_1");
}
lb_1.OnClick=function()
{
var value = "lb_1.OnClick event"; eb_event.SetProp('caption' , value);
}
rdo_1.OnChange=function(nIndex)
{
var value = "rdo_1.OnChange event(" + nIndex + ")"; eb_event.SetProp('caption' , value);
}
cb_1.OnListSelChanged=function(index,value,caption)
{
var value = "cb_1.OnListSelChanged event(" + nSelIndex + "," + strKey + "," + strCaption +")"; eb_event.SetProp('caption' , value);
}
chk_1.OnStateChanged=function(checkstate,value)
{
var value = "chk_1.OnStateChanged event(" + nCheckState + "," + value + ")"; eb_event.SetProp('caption' , value);
}
cal_1.OnChanged=function()
{
var value = "cal_1.OnChanged event"; eb_event.SetProp('caption' , value);
}
btn_5.OnClick=function()
{
document.getElementById("aaa000005_0_me_1").focus();
}
btn_2.OnClick=function()
{
var value = rdo_style.GetProp('value');var rdo_value = rdo_2.GetProp('value');var propName = me_style.GetProp('value');if(propName == ""){	alert("속성명 입력 바랍니다.");	form.SetFocus('me_style');	return;}var ctrlid = "{{id.}}" + rdo_value + "_1";var obj = no5.GetObjData(ctrlid);if (value == "0") {// Style	var objValue = obj.GetStyle(propName);}else { // Property	var objValue = obj.GetProp(propName);}eb_style.SetProp('caption', "[" + propName +  "]\r\n" + objValue  );
}
btn_3.OnClick=function()
{
var value = rdo_style.GetProp('value');var rdo_value = rdo_2.GetProp('value');var propName = me_style.GetProp('value');var setValue = me_set.GetProp('value');var ctrlid = "{{id.}}" + rdo_value + "_1";var obj = no5.GetObjData(ctrlid);if (value == "0") {// Style	var objValue = obj.SetStyle(propName, setValue);}else { // Property	var objValue = obj.SetProp(propName, setValue);}
}
