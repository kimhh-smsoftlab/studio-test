// [tab:event ] OnTabChanged  start...
tab_1.OnTabChanged=function(nCurrentTab){
    debugger;
    switch(nCurrentTab){
        case '0': 
            formlink_1.SetPage("test10khh");
            break;
        case '1':
            formlink_1.SetPage("test13khh");
            break;
        case '2':
            formlink_1.SetPage("test14khh");
            break;
            
    }
};

