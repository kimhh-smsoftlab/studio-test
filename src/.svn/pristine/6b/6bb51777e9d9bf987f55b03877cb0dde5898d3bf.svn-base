// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    window.fromWeb2Native.postMessage(me_1.GetProp("value"));
};
// [form:event ] onConfigChange  start...
form.onConfigChange=function(option){
    if(option.fromNative){
        eb_1.SetProp("caption",JSON.stringify(option.data));
    }
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    let txt = "{'type' : 'tran', 'trCode': 't1101', 'input' : {'shcode' : '005930'}, 'output': ['OutBlock']}";
    me_1.SetProp("value",txt);
};