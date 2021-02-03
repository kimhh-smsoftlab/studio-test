// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    Table_1.OnGetData(tableData);
    $('#'+Table_1.id).addClass('align');
    grd_1.OnGetData(dataObj);
    gb_grd.$html.show();
    gb_chart.$html.hide();
    $('#'+btn_1.id).addClass('btn_border');
    $('#'+btn_1.id).addClass('bold');
};

// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    gb_grd.$html.show();
    gb_chart.$html.hide();
    $('#'+btn_2.id).removeClass('bold');
    $('#'+btn_1.id).addClass('bold');
};

// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    gb_grd.$html.hide();
    gb_chart.$html.show();
    $('#'+btn_1.id).removeClass('bold');
    $('#'+btn_2.id).addClass('bold');
};

let tableData = [
  {stock : '60,314,092', stockRate : '(100.00%)', order : '46,372,605', orderRate : '(76.89%)',
  vol : '13,941,487', volRate : '(23.11%)'}
];

let dataObj = [
    { date: '20005930', daebi : '110477', vol : "73000", rate : "0.5", sign: '0' },
    { date: '20035720', daebi : '110254', vol : "372000", rate : "-0.4", sign: '2' },
    { date: '20001105', daebi : '1234', vol : "80645", rate : "0.6", sign: '2' },
    { date: '20006576', daebi : '212', vol : "4057", rate : "-0.3", sign: '5' },
    { date: '20002455', daebi : '9135', vol : "80005", rate : "-0.22", sign: '2' },
    { date: '20005380', daebi : '5808', vol : "187500", rate : "-0.79", sign: '0' },
    { date: '20001105', daebi : '46786', vol : "80645", rate : "0.6", sign: '0' },
    { date: '20006576', daebi : '54657', vol : "4057", rate : "-0.3", sign: '2' },
    { date: '20002455', daebi : '4254', vol : "80005", rate : "-0.22", sign: '5' },
    { date: '20001105', daebi : '46786', vol : "80645", rate : "0.6", sign: '0' },
    { date: '20006576', daebi : '54657', vol : "4057", rate : "-0.3", sign: '2' },
    { date: '20002455', daebi : '4254', vol : "80005", rate : "-0.22", sign: '5' }
];

// [grid:event ] OnColumnRender  start...
grd_1.OnColumnRender=function(ui){
    // sign에 따른 글자색 세팅
    if (ui.rowData.sign == "5"){
            fontColor = "color:blue;"
    }
    // "2" -> 빨강(상승)
    else if (ui.rowData.sign == "2"){
        fontColor = "color:red;"
    }else{
        fontColor = "color:black;"
    }
    
    let htmlText = "";
    switch (ui.dataIndx) {
        // 2. 등락률
        case 'daebi':
            htmlText = "<div style='" + fontColor + "'>" + putThousandsSeparators(ui.rowData.daebi) + "</div>";
            return {text : htmlText};
            break;            
        default:
            // code
    }
};