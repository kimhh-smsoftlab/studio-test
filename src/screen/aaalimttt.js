// [tab:event ] OnTabChanged  start...
tab_1.OnTabChanged=function(nCurrentTab){
    debugger;
    switch(nCurrentTab){
        case "0":
            formlink_1.SetPage('aaatab001');
            break;
            
        case "1":
            formlink_1.SetPage('aaatab002');
            break;
            
        case "2":
            formlink_1.SetPage('aaatab003');
            break;
            
        case "3":
            formlink_1.SetPage('aaatab004');
            break;
        
        case "4":
            formlink_1.SetPage('aaatab005');
            break;
            
        case "5":
            formlink_1.SetPage('aaatab006');
            break;
            
        case "6":
            formlink_1.SetPage('aaatab007');
            break;    
    }
};