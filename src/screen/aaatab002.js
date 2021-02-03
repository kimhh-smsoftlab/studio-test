// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    var listitem = [{"test1":"test1"},{"test2":"test2"}];
    
    // cb_1.SetItemValue(listitem)
    // cb_1.updateComboList(listitem);
    alert(cb_1.GetCount());
    var opt = cb_1.GetProp('options');
    alert(cb_1.GetProp('options'));
    // alert(cb_1.GetProp('fncustom'));
};