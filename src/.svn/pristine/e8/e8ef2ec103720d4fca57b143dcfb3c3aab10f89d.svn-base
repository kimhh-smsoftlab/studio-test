var hi5MobileRun = {
    run: false,
    ws: null, // mobile 연결 websocket 객체
    xhr: null, // 전송될 파일 내용
    init: function () { // 팝업 화면 표시
        if (this.run) {
            this.close();
            return;
        }

        this.run = true;
        $("#hi5_goMobile").css({
            "background": "url(images/mobileclose.png) no-repeat center",
            "background-size": "24px"
        });

        var $popDiv = $("<div/>");
        $popDiv.attr("id", "hi5MobileRun").css({
            position: "fixed",
            top: "2px",
            left: "2px",
            width: '98%',
            height: '98%',
            opacity: "1",
            backgroundColor: 'white'
        });
        $("body").append($popDiv);

        var $titleDiv = $("<div/>");
        $titleDiv.html("Connected Mobile List").css({
            position: 'relative',
            height: '30px',
            fontSize: '16px'
        });
        $popDiv.append($titleDiv);

        this.setList([]);

        this.initWS();
    },
    close: function () {
        $("#hi5MobileRun").remove();
        $("#hi5_goMobile").css("background", "");
        this.run = false;

        this.closeWS();
    },
    interval: null,
    setList: function (list) {
        let that = this;
        if ($("#mobileContentList").length) {
            $("#mobileContentList").remove();
        }
        let $div = $("<div/>");
        $div.attr("id", "mobileContentList").css({
            position: 'relative'
        });
        $("#hi5MobileRun").append($div);

        let colModel = [{
                text: 'Idx',
                width: 50,
                type: "index"
            },
            {
                text: 'M-Name',
                width: 150,
                id: 'hi5-id'
            },
            {
                text: 'Connected',
                width: 200,
                id: 'time',
                style: {
                    "font-size": "10px"
                }
            },
            {
                text: 'SessionID',
                width: 200,
                id: 'sessionId',
                style: {
                    "font-size": "10px"
                }
            },
            {
                text: 'Chk',
                width: 50,
                type: 'check',
                style: {
                    "text-align": "center"
                }
            }
        ];
        let $table = $("<table/>");
        $table.css({
            "border-collapse": "collapse",
            "border": "1px solid #333"
        });
        $div.append($table);
        let $headTr = $("<tr/>");
        $table.append($headTr);

        for (var x = 0; x < colModel.length; x++) {
            let colObj = colModel[x];
            let $th = $("<th/>");
            $th.css({
                "text-align": "center",
                "border": "1px solid #333"
            });
            $th.attr("width", colObj.width).html(colObj.text);
            $headTr.append($th);
        }

        if (list.length == 0) { // no list
            let $bodyTr = $("<tr/>");
            $table.append($bodyTr);
            let $td = $("<td/>");
            $td.attr({
                "align": "center",
                "colspan": colModel.length
            }).html("No available mobile to run.");
            $bodyTr.append($td);
            return;
        }

        for (var x = 0; x < list.length; x++) {
            let listObj = list[x];
            let $bodyTr = $("<tr/>");
            $table.append($bodyTr);
            for (var y = 0; y < colModel.length; y++) {
                let colObj = colModel[y];
                let $td = $("<td/>");
                if (colObj.type) {
                    if (colObj.type == "index") {
                        $td.text(x + 1).css({
                            "text-align": "center",
                            "border": "1px solid #333"
                        });
                    } else if (colObj.type == "check") {
                        let $inputCheck = $("<input/>");
                        $inputCheck.attr({
                            "type": "checkbox",
                            "name": "check_" + (x + 1)
                        }).css({
                            "border": "1px solid #333"
                        });
                        $td.append($inputCheck);
                    }
                } else {
                    if (colObj.id && listObj[colObj.id]) {
                        $td.text(listObj[colObj.id]).css({
                            "border": "1px solid #333"
                        });
                    }
                }
                if (colObj.style) {
                    $td.css(colObj.style);
                }
                $bodyTr.append($td);
            }
        }

        let $bottomDiv = $("<div/>");
        $div.append($bottomDiv);
        $bottomDiv.css({
            'text-align': 'right',
            'padding': '5px'
        });
        let $runBtn = $("<button/>");
        $bottomDiv.append($runBtn);
        $runBtn.text("Run on Mobile").css({
            right: '10px',
            height: '30px'
        }).on("click", function () {
            var rowData = new Array();
            var tdArr = new Array();
            var checkbox = $("td input[type=checkbox]:checked");

            let sessionList = [];
            // 체크된 체크박스 값을 가져온다
            checkbox.each(function (i) {

                // checkbox.parent() : checkbox의 부모는 <td>이다.
                // checkbox.parent().parent() : <td>의 부모이므로 <tr>이다.
                var tr = checkbox.parent().parent().eq(i);
                var td = tr.children();

                // 체크된 row의 모든 값을 배열에 담는다.
                rowData.push(tr.text());

                // td.eq(0)은 체크박스 이므로  td.eq(1)의 값부터 가져온다.
                var hi5id = td.eq(1).text();
                var sessionid = td.eq(3).text();

                sessionList.push(sessionid);
            });

            console.log(sessionList);
            if (sessionList.length > 0) {
                let sendData = {
                    event: 'loadScreen',
                    sessionid: sessionList,
                    filename: that.xhr.key,
                    js: that.xhr.script,
                    xml: that.xhr.responseText
                }

                hi5MobileRun.sendWS(sendData);
                hi5MobileRun.close();
                //hi5MobileRun.sendWS(hi5MobileRun.xhr);
            } else {
                alert('No list selected.');
            }
        });
    },
    initWS: function () {
        try {
            this.ws = new WebSocket('ws://hi5dev.sorimachi.co.kr:23501');
        } catch (e) {
            console.log(e);
            debugger;
        }

        this.ws.onopen = function (event) {
            let sendData = {
                event: 'getSessions'
            };
            hi5MobileRun.sendWS(sendData);
            //testSend();
        }
        //        this.ws.binaryType = "arraybuffer";
        hi5MobileRun.ws.onmessage = function (event) {
            let recvData = JSON.parse(event.data);
            if (recvData.event && recvData.event == "getSessions") {
                var listData = recvData.data;
                for (var x = 0; x < listData.length; x++) {
                    listData[x].time = new Date(listData[x].time);
                }
                console.log(listData);

                hi5MobileRun.setList(listData);
            }
        }
        hi5MobileRun.ws.onclose = function (event) {
            console.log(event);
        }

        this.interval = setInterval(function () {
            hi5MobileRun.sendWS({
                'heartbeat': true
            });
        }, 5000);
    },
    closeWS: function () {
        hi5MobileRun.ws.close();
    },
    sendWS: function (obj) {
        if (hi5MobileRun.ws.readyState == 1) {
            this.ws.send(JSON.stringify(obj));
        } else {
            if (this.interval)
                clearInterval(this.interval);

            //alert("No connection");
        }
    },
    uploadFile: function () {
        console.log(this.xhr);
        let sendData = {
            event: 'loadScreen',
            filename: this.xhr.key,
            js: this.xhr.script,
            xml: this.xhr.responseText
        }

        this.sendWS(sendData);
        this.close();
        //  $.ajax({
        //      type : "POST",
        //      url: 'http://hi5dev.sorimachi.co.kr:23500/uploadFile',
        //      data: JSON.stringify(sendData),
        //      processData: false,
        //      contentType: 'text/plain',
        //      cache: false,
        //      success: function(data){
        //          console.log('success : ', data);
        //      },
        //      error: function(e){
        //          console.log('error : ', e);
        //      }
        // })
    }
};

function loadFullWindow() {
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1] || 0;
        }
    }

    var menuId = $.urlParam("menuId");
    if (!menuId) {
        menuId = $.urlParam("uiId");
    }

    var menuObj = g_menuList[menuId];
    if (!menuObj) {
        var screenId = menuId;
    } else {
        var screenId = menuObj.screenid;
    }

    // CacheBuster
    var cb = hi5cb.getCacheBuster({
        data: "map",
        mapfile: screenId
    });
    var path = "screen/" + screenId + ".xml";
    var strUrl = hi5.getURL({
        url: path + cb.cb
    });

    var curWinindex = hi5.GetCurWinindex();
    var itemId = screenId + '_' + curWinindex;

    hi5.getScreenLoad({
        mapName: screenId,
        cb: cb.cb,
        url: strUrl
    }, function (xhr, objData) {
        // 맵이름을 지정후 오류시에 표시.
        //    x2h.requestURL(strUrl, function (xhr, objData) {
        try {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    hi5MobileRun.xhr = xhr;
                    var xmlDoc = xhr.responseXML; //httpRequest.responseText;  // Text Data
                    if (xmlDoc == null) {
                        throw "mapfile responseXML Error!!!"
                    }
                    var xmlFormDoc = xmlDoc.getElementsByTagName(FORM)[0];
                    var formSize = x2h.defaultStyle(xmlFormDoc);

                    // form 객체 취득
                    var winForm = new(hi5_controlExpert("form"));
                    //var objForm = hi5_hash.record('form').fn;
                    if (winForm) {
                        winForm.id = itemId + "_form";

                        // --> [Edit] 수정자:kim changa 일시:2019/03/15
                        // 수정내용> 메뉴별 등록/수정 권한 설정 
                        //winForm.menuid = menuid;     // 메뉴번호 설정
                        winForm.mainform = true; // MainForm

                        // <-- [Edit] kim changa 2019/03/15
                        // loading 상태 표시
                        winForm.showLoading();

                        //form.mapCtlList.put(winForm.id, winForm);
                        hi5.SetObjData(winForm.id, winForm);
                        var options = {
                            form: winForm,
                            itemId: itemId
                        };
                        winForm.LoadMapXML(xhr, options);

                        $("#hi5_loading").remove();
                    };
                } else {
                    // 맵 이름과 상태코드 표시
                    if (objData.div) {
                        objData.div.remove();
                    }
                    var msg = "Page Not Found!!...map=" + (objData.map ? objData.map : "") + "\r\n";
                    msg += "status : " + xhr.status + "\r\n";
                    msg += "statusText:" + xhr.statusText;
                    hi5.MessageBox(msg, "Error", 0, function (ret) {
                        return false;
                    });
                    return false;
                }
            }
        } catch (e) {
            if (objData && objData.div) {
                objData.div.remove();
            }

            var msg = "error =" + (objData && objData.map ? objData.map : "") + "\r\n";
            msg += "message: " + (e.message == undefined ? e : e.message);
            hi5.MessageBox(msg, "Error", 0, function (ret) {
                return false;
            });

            console.log(e);
            console.log("error : " + e.message);
            console.log("error==>screeDownLoad : " + e.message);
            return false;
        }
        return true;
    });
}

$("#hi5_goMobile").on("click", function () {
    //hi5MobileRun.uploadFile();
    hi5MobileRun.init();
});