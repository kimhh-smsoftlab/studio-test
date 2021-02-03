let tableObj = {
    101 : '17.69%', 111 : '397,524' , 116 : '344,942' , 106 : '15.35%',
    102 : '9.60%', 112 : '215,739' , 117 : '303,425' , 107 : '13.51%',
    103 : '8.50%', 113 : '191,048' , 118 : '185,022' , 108 : '8.24%',
    104 : '8.17%', 114 : '183.571' , 119 : '167,232' ,109 : '7.44%',
    105 : '7.55%', 115 : '169,564' , 120 : '154,118' , 110 : '6.86%',
    1 : '키움증권', 2: '미래에셋대우', 3:'KB증권', 4:'한국증권', 5:'NH투자',
    6 : '키움증권', 7 : 'NH투자', 8 : '미래에셋대우', 9:'한국증권', 10:'삼성증권',
    121 : '415', '123' : '14,837', '122' : '15,252'
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    Table_1.OnGetData(tableObj);
    Table_2.OnGetData(tableObj);
    gb_trade.$html.show();
    Table_2.$html.hide();
    btn_1.OnClick();
    $('#'+Table_1.id).css('border-bottom','1px solid #c2c2c2')
};



// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    $('.clicking').removeClass('clicking');
    $('#'+btn_1.id).addClass('clicking');
    gb_trade.$html.show();
    formlink_1.$html.hide();
};

// [button:event ] OnClick  start...
btn_2.OnClick=function(){
    $('.clicking').removeClass('clicking');
    $('#'+btn_2.id).addClass('clicking');
    gb_trade.$html.hide();
    formlink_1.$html.show();
    formlink_1.SetPage('bbb100009');
};

// [button:event ] OnClick  start...
btn_3.OnClick=function(){
    $('.clicking').removeClass('clicking');
    $('#'+btn_3.id).addClass('clicking');
    gb_trade.$html.hide();
    formlink_1.$html.show();
    formlink_1.SetPage('bbb100010');
};

// [button:event ] OnClick  start...
btn_4.OnClick=function(){
    $('.clicking').removeClass('clicking');
    $('#'+btn_4.id).addClass('clicking');
    gb_trade.$html.hide();
    formlink_1.$html.show();
    formlink_1.SetPage('bbb100011');
};

// [table:event ] OnCellClick  start...
Table_1.OnCellClick=function(nRow, nCol, item, value){
  if ((nRow == 1 && nCol == 0)||(nRow == 1 && nCol == 5) ){
      alert('클릭');
      Table_2.$html.show();
  } 
  else if(nCol == 2 || nCol == 3){
      gb_1.$html.hide();
      gb_trade.$html.hide();
      formlink_1.$html.show();
      formlink_1.SetPage('bbb100007');
  }
}
// [table:event ] OnCellClick  start...
Table_2.OnCellClick=function(nRow, nCol, item, value){
  if ((nRow == 1 && nCol == 0)||(nRow == 1 && nCol == 5) ){
      alert('클릭');
      Table_2.$html.hide();
      Table_1.$html.show();
  }  
  else if(nCol == 2 || nCol == 3){
      gb_1.$html.hide();
      gb_trade.$html.hide();
      formlink_1.$html.show();
      formlink_1.SetPage('bbb100007');
  }
};