//var hi5_timeOut = 10;
//function timedCount() {
//    postMessage(0); //->OnMessage
//    setTimeout("timedCount()", hi5_timeOut );
//}
//timedCount();
//debugger;
//var comapi = null;

/*
self.onmessage = function (e) {
    var data = e.data;
    console.log("self.onmessage...........수신");

    // Work로 처리결과 전달
    //postMessage(data);  // ->OnMessage() 전달
    console.log("self.onmessage...........전달");

}
*/


var Timer = function () {
    onmessage = this.switchCase.bind(this);
    this.currentTime = 0;
    this.timerId = 0;
};

p = Timer.prototype;

p.switchCase = function (e) {
    var option = e.data;
    switch (option.cmd) {
        case "stop":
            this.stopTimer();
            break;
        case "start":
            this.startTimer(option);
            break;
        default:
            break;
    }
};

p.stopTimer = function () {
    clearInterval(this.timerId);

    this.currentTime = 0;
    this.timerId = 0;

    postMessage(0);
};

p.startTimer = function (option) {
    this.timerId = setInterval(function () {
        //this.currentTime++;
        postMessage(1);
    }.bind(this), option.time)
};


new Timer();