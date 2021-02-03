// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    debugger
    
    var cost_val = $('.event').first().text();
    var per_val = $('.event').first().next().text();
    let Table_Data = [
        {amount : cost_val, cost : per_val}
    ];
    
    Table_1.OnGetData(Table_Data);

};

// [form:event ] onConfigChange  start...
form.onConfigChange=function(option){
    var cost_val = $('.event').first().text();
    var per_val = $('.event').first().next().text();
    let Table_Data = [
        {amount : cost_val, cost : per_val}
    ];
    
    Table_1.OnGetData(Table_Data);
};


// [table:event ] OnCellClick  start...
Table_1.OnCellClick=function(nRow, nCol, item, value){
    debugger
    $('.hi5_formlink.hidden').hide();
    $('.hi5_groupbox').css('filter','');
    $('.table_ctl').css('filter','');
    
    if($('.event').length >= 2){
        $('.event').removeClass('event');
    }
    
    
};

// [form:event ] OnFormClose  start...
form.OnFormClose=function(){
    debugger
    
};