var g_category;
var g_id;
var g_createdDate;

form.OnFormInit=function(tagName, objData)
{
if(tagName == 'Register' && objData){	btn_1.SetStyle('display', 'block');	cb_3.SetCurSelKey(objData.lang.toString());	cb_1.SetCurSelKey(objData.open == true? '1':'0');	me_1.SetProp('caption', objData.title);
	me_2.SetProp('caption', objData.pk || '');	g_createdDate = objData.createdDate;	var time = objData.createdDate;	time = time.replace('T',' ');	time = time.split('.')[0];		lb_3.SetProp('caption', time);		g_id = objData.id;		var option = {		trcode:'/api/tb_content',		ajaxType:'GET', 		param:{contentId:g_id}	};		hi5.getAjaxData(option, function (rpData) {		eb_Content.SetProp('caption', rpData.content);    });	}else if(tagName == 'newRegister' && objData){	btn_1.SetStyle('display', 'none');}g_category = objData.category;lb_1.SetProp('caption', objData.main);cb_cata.SetItemValue( objData.arrCata );cb_cata.SetCurSelKey(objData.subCategory, false );form.$html.parents('div[hi5_tagname]').height('auto');form.$html.parents('.hi5_dlg_form').css('padding-bottom','5px');//Table_1.$html.height('auto');
}
btn_1.OnClick=function()
{
var option = {				trcode:'/api/tb_content/delete?contentId='+g_id+'&ver='+new Date().getTime(),				ajaxType:'POST', 			}; hi5.getAjaxData(option, function () {        		form.CloseScreen(1);            }, function (jqXHR, textStatus, errorThrown) {        //alert('Failed to get master!!!');        hi5.MessageBox('Processing failure!!!', "Alert", 0);	});
}
btn_2.OnClick=function()
{
var lang = cb_3.GetProp('value');var open = cb_1.GetProp('value');var title = me_1.GetProp('caption');var pk = me_2.GetProp('caption');var content = eb_Content.GetProp('caption');var Open = open =='1' ? true:false;var id = g_id? g_id.toString():null;if(title == ''){	hi5.MessageBox($hi5_regional.noticeAlarm.title, "Notice", 0, function(fn){		me_1.SetFocus( );	});}else if(content == ''||content=="<p><br></p>"){	hi5.MessageBox($hi5_regional.noticeAlarm.content, "Notice", 0, function(fn){		$('.note-editable')[0].focus();	});}else{	var inputData = {		lang:lang,		category: g_category,		subCategory: cb_cata.GetCurSelValue( ),		title:title,		pk:pk,		content:content,		open:Open,		createdDate: g_createdDate ,		ver:new Date().getTime(),		sortOrder:1	};	if (open =='1')	 inputData['isOpen'] = 'open';	if(g_id && g_id != '')		inputData['id'] = g_id.toString();			var option = {					trcode:'/api/tb_content',					ajaxType:'POST', 					param:inputData				};	 hi5.getAjaxData(option, function () {			form.CloseScreen(1);	    }, function (jqXHR, textStatus, errorThrown) {		  //alert('Failed to get master!!!');		  hi5.MessageBox(jqXHR.message, "Alert", 0);		});}
}
btn_3.OnClick=function()
{
		form.CloseScreen(0);
}
