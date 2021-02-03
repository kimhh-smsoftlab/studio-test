var btn_select = true;
// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    grd_3.$html.hide();
    $('#'+gb_2.id).addClass('border');
    // btn_select = false;
};

// [grid:event ] OnHeaderCellClick  start...
grd_1.OnHeaderCellClick=function(dataIndx, column){
    if(dataIndx == 'quantity'){
        grd_1.$html.hide();
        grd_3.$html.show();
    }
};

// [grid:event ] OnHeaderCellClick  start...
grd_3.OnHeaderCellClick=function(dataIndx, column){
    if(dataIndx == 'million'){
        grd_1.$html.show();
        grd_3.$html.hide();
    }
};

// [button:event ] OnClick  start...
btn_chart.OnClick=function(){
    if(btn_select){
        // $('#'+gb_2.id).removeClass('border');
        $('#'+gb_2.id).addClass('clickik');
        img_check.$html.show();
        img_uncheck.$html.hide();
    
        
        btn_select = false;
    } else{
        $('#'+gb_2.id).removeClass('clickik');
        $('#'+gb_2.id).addClass('border');
        img_check.$html.hide();
        img_uncheck.$html.show();

        
        btn_select = true;
    }
};

// [combo:event ] OnListSelChanged  start...
cb_1.OnListSelChanged=function(index, value, caption){
    if(index===1){
        
    }
    else if(index===2){
        
    }
};