var g_category;
var g_id;
var g_createdDate;

form.OnFormInit=function(tagName, objData)
{
if(tagName == 'Register' && objData){
	me_2.SetProp('caption', objData.pk || '');
}
btn_1.OnClick=function()
{
var option = {
}
btn_2.OnClick=function()
{
var lang = cb_3.GetProp('value');
}
btn_3.OnClick=function()
{
		form.CloseScreen(0);
}