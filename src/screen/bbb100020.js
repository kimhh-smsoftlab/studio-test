// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    formlink_1.SetPage('bbb100021');
    $('#'+tab_1.id).addClass('borderBottom')
    
};

tab_1.OnTabChanged=function(nCurrentTab){
    $('.tabtitle.clicked').addClass('clicked');
    if (nCurrentTab == '1'){
        formlink_1.SetPage('bbb100021');
    } else if (nCurrentTab == '2'){
        formlink_1.SetPage('bbb100022');
    } else if (nCurrentTab == '3'){
        formlink_1.SetPage('bbb100023');
    } else if (nCurrentTab == '4'){
        formlink_1.SetPage('bbb100024');
    }
};