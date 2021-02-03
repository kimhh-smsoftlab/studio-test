// [button:event ] OnClick  start...
var toggle = false;
btn_1.OnClick=function(){
    if(toggle){
        gb_etf.$html.hide();
        toggle = false;
    }else{
        gb_etf.$html.show();
        toggle = true;
    }
};