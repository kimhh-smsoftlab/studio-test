debugger;
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

function createHogaData(){
    let data = {
        jmcode : '005930',
        500 : 73700,
        501 : 73800,
        502 : 73900,
        503 : 74000,
        504 : 74100,
        505 : 74200,
        506 : 74300,
        507 : 74400,
        508 : 74500,
        509 : 74600,
        510 : 73600,
        511 : 73500,
        512 : 73400,
        513 : 73300,
        514 : 73200,
        515 : 73100,
        516 : 73000,
        517 : 72900,
        518 : 72800,
        519 : 72700
    }
    
    let price = getRandomIntInclusive(1, 9) * 10000;
    let prcAsk = 500;
    let prcBid = 510;
    let qtyAsk = 520;
    let qtyBid = 530;
    let askSum = 0, bidSum = 0;
    
    for(let x = 0;x < 10;x++){
        data[prcAsk.toString()] = price + (x * 100);
        data[qtyAsk.toString()] = getRandomIntInclusive(1, 10000);
        askSum = askSum + data[qtyAsk.toString()];
        prcAsk++;
        qtyAsk++;

        data[prcBid.toString()] = price - ((x + 1) * 100);
        data[qtyBid.toString()] = getRandomIntInclusive(1, 10000);
        bidSum = bidSum + data[qtyBid.toString()];
        prcBid++;
        qtyBid++;
    }
    data["560"] = askSum;
    data["561"] = bidSum;

    return data;
}
// [form:event ] OnFormInit  start...
form.OnFormInit=function(tagName, objData){
    hoga_1.SetItemValue(createHogaData());
};

let siseTimer;
// [button:event ] OnClick  start...
btn_1.OnClick=function(){
    if(siseTimer) {
        clearInterval(siseTimer);
        siseTimer = null;
        btn_1.SetProp("caption","실시간 시작");
        return;
    }
    btn_1.SetProp("caption","실시간 종료");
    siseTimer = setInterval(() => {
        hoga_1.SetItemValue(createHogaData());
    }, 1000);
};