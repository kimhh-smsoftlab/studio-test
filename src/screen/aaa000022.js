
btn_1.OnClick=function()
{
var value = "btn_1.OnClick event";
}
lb_1.OnClick=function()
{
var value = "lb_1.OnClick event";
}
rdo_1.OnChange=function(nIndex)
{
var value = "rdo_1.OnChange event(" + nIndex + ")";
}
cb_1.OnListSelChanged=function(index,value,caption)
{
var value = "cb_1.OnListSelChanged event(" + nSelIndex + "," + strKey + "," + strCaption +")";
}
chk_1.OnStateChanged=function(checkstate,value)
{
var value = "chk_1.OnStateChanged event(" + nCheckState + "," + value + ")";
}
cal_1.OnChanged=function()
{
var value = "cal_1.OnChanged event";
}
btn_5.OnClick=function()
{
document.getElementById("aaa000005_0_me_1").focus();
}
btn_2.OnClick=function()
{
var value = rdo_style.GetProp('value');
}
btn_3.OnClick=function()
{
var value = rdo_style.GetProp('value');
}