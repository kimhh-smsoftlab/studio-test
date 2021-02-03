let data_obj = {
    dambo : '70%', cash_evi : '30%', cred_evi : '45%', cred_per : '90일', closing : '3335', sub_price : '2400',
    high_f : '4095', low_f : '3095', high_t : '4095', low_t : '3095', higher : '4095', lower : '1500',
    par_val : '5000', num : '60314', market : '2316', capital : '3015', quarter : '340', billion : '340',
    per : '5.41', eps : '710', pbr : '0.47', bps : '8098', ev : '0.00', roe : '9.18', foreign : '23.01%',
    cred_rate : '1.81%', div_pay : '', yield : '4.50%'
};

// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    Table_1.OnGetData(data_obj);
};