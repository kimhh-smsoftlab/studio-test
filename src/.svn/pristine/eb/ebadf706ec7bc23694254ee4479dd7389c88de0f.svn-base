// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    gb_add.$html.hide();
};
// [tab:event ] OnTabChanged  start...
tab_1.OnTabChanged=function(nCurrentTab){
    if (nCurrentTab == 1) {
        gb_time.$html.show();
        gb_date.$html.hide();
        gb_jm.$html.hide();
    } else if (nCurrentTab == 2) {
        gb_time.$html.hide();
        gb_date.$html.show();
        gb_jm.$html.hide();
    } else if (nCurrentTab == 3) {
        // gb_time.$html.hide();
        // gb_date.$html.hide();
        // gb_jm.$html.hide();
    } else if (nCurrentTab == 4) {
        gb_time.$html.hide();
        gb_date.$html.hide();
        gb_jm.$html.show();
        btn_intAdd.$html.show();
    }
};

// [button:event ] OnClick  start...
btn_intAdd.OnClick=function(){
    btn_intAdd.$html.hide();
    gb_add.$html.show();
};