// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    formlink_1.SetPage('bbb100031');
};

tab_1.OnTabChanged=function(nCurrentTab){
    if (nCurrentTab == '1'){
        formlink_1.SetPage('bbb100031');
    } else if (nCurrentTab == '2'){
        formlink_1.SetPage('bbb100022');
    } else if (nCurrentTab == '3'){
        formlink_1.SetPage('bbb100023');
    }
};